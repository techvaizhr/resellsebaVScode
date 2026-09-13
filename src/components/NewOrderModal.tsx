import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/laravel/client";
import { areaOptions, productDeliveryCharge, deliveryLabel, deliveryMode, type DeliveryArea } from "@/lib/delivery";
import { addressError, nameError, normalizePhone, phoneError, sanitizeName } from "@/lib/checkout-validate";
import { Loader2, Plus, Minus, X, Trash2, Search, Building2, Check, Store } from "lucide-react";
import { toast } from "sonner";
import { ProductCodeChip } from "@/components/product-code";
import { AdvanceByToggle, MoneyField, SectionLabel } from "@/components/order-form-fields";
import { packagingModeHint, packagingTotal } from "@/lib/packaging";
import { useAdvancedSettings } from "@/lib/advanced-settings";
import initialData from "@/lib/initial-data.json";

type Line = { listing_id?: string; product_id?: string; qty: number; name?: string; price?: number; cost?: number; image?: string; delivery?: any };

/** Minimum allowed selling price = SA base cost (product cost + packaging). */
function minSellPrice(p: any) {
  return Number(p?.reseller_price ?? 0) + Number(p?.packaging_cost ?? 0);
}

interface NewOrderModalProps {
  listings: any[];
  allProducts: any[];
  resellerId?: string | null;
  resellers?: any[];
  onClose: () => void;
  onCreated: () => void;
  isAdmin?: boolean;
}

export function NewOrderModal({
  listings,
  allProducts,
  resellerId: initialResellerId,
  resellers = [],
  onClose,
  onCreated,
  isAdmin = false,
}: NewOrderModalProps) {
  const [resellerId, setResellerId] = useState<string | null>(initialResellerId || null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState<DeliveryArea>("outside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [resellerSearch, setResellerSearch] = useState("");
  /** Order level adjustments — "" means keep the automatic/default value. */
  const [discount, setDiscount] = useState("");
  const [shipOverride, setShipOverride] = useState("");
  const [packagingOverride, setPackagingOverride] = useState("");
  const [deliveryCostOverride, setDeliveryCostOverride] = useState("");
  /** Advance already collected from the customer + who is holding that cash. */
  const [advance, setAdvance] = useState("");
  const [advanceBy, setAdvanceBy] = useState<"admin" | "reseller">("reseller");
  /** Packaging charge rule from Admin → System → Advanced settings. */
  const { settings: advanced } = useAdvancedSettings();
  const packagingSum = advanced.packagingChargeSum;

  const effectiveProducts = useMemo(() => {
    return allProducts && allProducts.length > 0 ? allProducts : ((initialData as any).products || []);
  }, [allProducts]);

  const effectiveResellers = useMemo(() => {
    return (resellers && resellers.length > 0 ? resellers : ((initialData as any).resellers || [])) as any[];
  }, [resellers]);

  const selectedReseller = useMemo(() => {
    if (!resellerId) return null;
    return effectiveResellers.find((r: any) => String(r.id) === String(resellerId)) || null;
  }, [effectiveResellers, resellerId]);

  const trendingResellers = useMemo(() => {
    return effectiveResellers.slice(0, 6);
  }, [effectiveResellers]);

  const filteredResellers = useMemo(() => {
    const q = resellerSearch.trim().toLowerCase();
    if (!q) return [];
    return effectiveResellers.filter((r: any) => 
      (r.business_name && String(r.business_name).toLowerCase().includes(q)) || 
      (r.code && String(r.code).toLowerCase().includes(q)) ||
      (r.contact_phone && String(r.contact_phone).toLowerCase().includes(q))
    ).slice(0, 10);
  }, [effectiveResellers, resellerSearch]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const topListings = (listings || [])
        .filter(l => l.products)
        .map(l => ({ type: 'listing' as const, data: l }));
      const topProducts = effectiveProducts
        .filter((p: any) => !(listings || []).some((l: any) => l.products?.id === p.id))
        .map((p: any) => ({ type: 'product' as const, data: p }));
      return [...topListings, ...topProducts].slice(0, 15);
    }

    const hit = (p: any) =>
      String(p?.name ?? "").toLowerCase().includes(q) ||
      String(p?.product_code ?? "").toLowerCase().includes(q);

    const listingMatches = (listings || [])
      .filter((l: any) => l.products && hit(l.products))
      .map((l: any) => ({ type: 'listing' as const, data: l }));

    const productMatches = effectiveProducts
      .filter((p: any) => hit(p) && !(listings || []).some((l: any) => l.products?.id === p.id))
      .map((p: any) => ({ type: 'product' as const, data: p }));

    return [...listingMatches, ...productMatches].slice(0, 20);
  }, [listings, effectiveProducts, query]);

  const picked = useMemo(() => {
    return lines.map((line, index) => {
      if (line.listing_id) {
        const l = (listings || []).find((x: any) => x.id === line.listing_id);
        if (l?.products) {
          const min = minSellPrice(l.products);
          return { line, index, p: l.products, sellPrice: Number(line.price ?? l.selling_price), minPrice: min, listingId: l.id };
        }
      }
      if (line.product_id) {
        const p = effectiveProducts.find((x: any) => x.id === line.product_id);
        if (p) {
          const min = minSellPrice(p);
          return {
            line,
            index,
            p,
            sellPrice: Number(line.price ?? p.suggested_price ?? min),
            minPrice: min,
            listingId: null,
          };
        }
      }
      return null;
    }).filter(Boolean) as { line: Line; index: number; p: any; sellPrice: number; minPrice: number; listingId: string | null }[];
  }, [lines, listings, effectiveProducts]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let productCost = 0;
    let autoShipping = 0;
    let shipFrom: string | null = null;
    let isUniversalFree = true;
    let isUniversalFlat = true;

    for (const { line, p, sellPrice } of picked) {
      subtotal += Number(sellPrice) * line.qty;
      productCost += Number(p.reseller_price) * line.qty;

      const mode = deliveryMode(p);
      if (mode !== "free") isUniversalFree = false;
      if (mode !== "flat") isUniversalFlat = false;

      const dc = productDeliveryCharge(p, area);
      if (dc > autoShipping) {
        autoShipping = dc;
        shipFrom = p.name;
      }
    }

    const packagingDefault = packagingTotal(
      picked.map(({ line, p }) => ({ packaging: Number(p.packaging_cost ?? 0), qty: line.qty })),
      packagingSum,
    );

    // Determine if we should show area selection
    // If all items are "free", or all items are "flat" with the same charge, we don't need area picker
    const showAreaPicker = picked.length > 0 && !isUniversalFree && !isUniversalFlat;

    const shipping = shipOverride.trim() === "" ? autoShipping : Math.max(Number(shipOverride) || 0, 0);
    const packaging =
      packagingOverride.trim() === "" ? packagingDefault : Math.max(Number(packagingOverride) || 0, 0);

    const disc = Math.min(Math.max(Number(discount) || 0, 0), subtotal + shipping);
    const total = subtotal + shipping - disc;
    const saCost = productCost + packaging;
    const deliveryCost =
      deliveryCostOverride.trim() === "" ? autoShipping : Math.max(Number(deliveryCostOverride) || 0, 0);
    const adv = Math.min(Math.max(Number(advance) || 0, 0), total);
    const resellerAdvance = advanceBy === "reseller" ? adv : 0;
    const grossProfit = total - deliveryCost - saCost;

    return {
      subtotal,
      autoShipping,
      shipping,
      packagingDefault,
      packaging,
      productCost,
      discount: disc,
      total,
      saCost,
      deliveryCost,
      advance: adv,
      resellerAdvance,
      codDue: Math.max(total - adv, 0),
      grossProfit,
      profit: grossProfit - resellerAdvance,
      shipFrom,
      showAreaPicker,
    };
  }, [picked, area, shipOverride, packagingOverride, discount, deliveryCostOverride, advance, advanceBy, packagingSum]);



  const errors = {
    name: nameError(name),
    phone: phoneError(phone),
    address: addressError(address),
  };

  function pick(item: { type: 'listing' | 'product', data: any }) {
    const prod = item.type === 'listing' ? item.data.products : item.data;
    const stock = Number(prod?.stock ?? 0);
    if (stock <= 0) {
      toast.error(`${prod?.name ?? "Product"} is out of stock`);
      return;
    }
    if (item.type === 'listing') {
      const l = item.data;
      setLines(prev => {
        const cur = prev.find(x => x.listing_id === l.id);
        if (cur) {
          if (cur.qty + 1 > stock) { toast.error(`Only ${stock} in stock`); return prev; }
          toast.success(`Increased ${prod?.name ?? "product"} quantity`);
          return prev.map(x => (x.listing_id === l.id ? { ...x, qty: x.qty + 1 } : x));
        }
        toast.success(`Added ${prod?.name ?? "product"} to order`);
        return [...prev, { listing_id: l.id, qty: 1 }];
      });
    } else {
      const p = item.data;
      setLines(prev => {
        const cur = prev.find(x => x.product_id === p.id);
        if (cur) {
          if (cur.qty + 1 > stock) { toast.error(`Only ${stock} in stock`); return prev; }
          toast.success(`Increased ${p?.name ?? "product"} quantity`);
          return prev.map(x => (x.product_id === p.id ? { ...x, qty: x.qty + 1 } : x));
        }
        toast.success(`Added ${p?.name ?? "product"} to order`);
        return [...prev, { product_id: p.id, qty: 1, price: p.suggested_price || (p.reseller_price + p.packaging_cost) }];
      });
    }
  }


  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (picked.length === 0) return toast.error("Select at least one product.");
    const firstError = errors.name || errors.phone || errors.address;
    if (firstError) return toast.error(firstError);
    const low = picked.find((x) => x.sellPrice < x.minPrice);
    if (low)
      return toast.error(`${low.p.name}: minimum selling price is ৳${low.minPrice} — order cannot be placed below this`);
    const short = picked.find((x) => x.line.qty > Number(x.p?.stock ?? 0));
    if (short)
      return toast.error(`${short.p.name}: only ${Number(short.p?.stock ?? 0)} in stock`);

    setBusy(true);
    try {
      const nowIso = new Date().toISOString();
      const generatedOrderNumber = String(Math.floor(100000 + Math.random() * 900000));
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          order_number: generatedOrderNumber,
          reseller_id: resellerId as any,
          customer_name: sanitizeName(name).trim(),
          customer_phone: normalizePhone(phone),
          address_line: address.trim(),
          area,
          payment_method: paymentMethod as any,
          reseller_note: !isAdmin ? note : null,
          admin_note: isAdmin ? note : null,
          subtotal: totals.subtotal,
          shipping_cost: totals.shipping,
          discount: totals.discount,
          total: totals.total,
          sa_cost_total: totals.saCost,
          packaging_total: totals.packaging,
          delivery_cost: totals.deliveryCost,
          advance_amount: totals.advance,
          advance_by: totals.advance > 0 ? advanceBy : null,

          reseller_profit: totals.profit,
          status: "pending",
          forwarded_to_admin: true,
          forwarded_at: nowIso,
          created_at: nowIso,
          updated_at: nowIso,
        })
        .select("id, order_number")
        .single();
      if (error) throw error;

      const items = picked.map(({ line, p, sellPrice, listingId }) => {
        const saPrice = Number(p.reseller_price) + Number(p.packaging_cost);
        return {
          order_id: order.id,
          listing_id: listingId,
          product_id: p.id,
          product_name: p.name,
          product_image: p.og_image_url,
          quantity: line.qty,
          sa_price: saPrice,
          reseller_price: sellPrice,
          line_total: Number(sellPrice) * line.qty,
          profit: (Number(sellPrice) - saPrice) * line.qty,
        };
      });
      const { error: ie } = await supabase.from("order_items").insert(items);
      if (ie) throw ie;

      // order_items triggers recalc packaging from product defaults — re-apply the order meta last.
      const { error: me } = await supabase
        .from("orders")
        .update({
          packaging_total: totals.packaging,
          sa_cost_total: totals.saCost,
          delivery_cost: totals.deliveryCost,
          advance_amount: totals.advance,
          advance_by: totals.advance > 0 ? advanceBy : null,

          discount: totals.discount,
          shipping_cost: totals.shipping,
          subtotal: totals.subtotal,
          total: totals.total,
        })
        .eq("id", order.id);
      if (me) throw me;


      toast.success(isAdmin ? "Order created successfully" : "Order created and sent to admin");
      onCreated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.stopPropagation();
      }}
    >
      <form
        onSubmit={submit}
        className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border bg-background shadow-2xl sm:max-h-[90vh] sm:rounded-xl lg:max-w-6xl"
      >
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3 sm:px-6 bg-muted/30">
          <div>
            <h2 className="text-sm font-bold sm:text-lg">
              {isAdmin ? "Create New Order (Admin)" : "Add New Order"}
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
              {isAdmin ? "Super Admin Portal" : "Reseller Order Placement"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-accent transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start">
            {/* Left Column: Selection & Details */}
            <div className="space-y-6 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r">

              {isAdmin && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold uppercase tracking-wide text-foreground/80">
                      Reseller Selection
                    </label>
                    {selectedReseller ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary animate-in zoom-in">
                        <Check className="h-3 w-3" />
                        Selected: {selectedReseller.business_name}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Direct Order (No Reseller)
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-3.5 space-y-3">
                    {/* Active Selected Card */}
                    {selectedReseller ? (
                      <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3 shadow-xs transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                            {selectedReseller.avatar_url ? (
                              <img src={selectedReseller.avatar_url} alt="" className="h-full w-full rounded-lg object-cover" />
                            ) : (
                              selectedReseller.business_name?.slice(0, 2).toUpperCase() || "RS"
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-foreground truncate">
                                {selectedReseller.business_name}
                              </span>
                              <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-mono font-bold text-primary">
                                {selectedReseller.code}
                              </span>
                              {selectedReseller.status && (
                                <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-medium text-emerald-600 dark:text-emerald-400 capitalize">
                                  {selectedReseller.status}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {selectedReseller.contact_phone ? `Phone: ${selectedReseller.contact_phone}` : "Reseller Account"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => {
                              setResellerId(null);
                              setResellerSearch("");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-muted-foreground/20 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shadow-2xs cursor-pointer"
                            title="Remove reseller (switch to Direct order)"
                          >
                            <X className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-lg border border-border/80 bg-background/80 p-2.5 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground font-semibold text-xs">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-foreground">Direct Order</span>
                              <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                                In-House
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Placed directly by Admin (No commission/profit deduction)</p>
                          </div>
                        </div>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Direct
                        </span>
                      </div>
                    )}

                    {/* Search Input */}
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                      <input
                        value={resellerSearch}
                        onChange={(e) => setResellerSearch(e.target.value)}
                        placeholder="Search reseller by store name, code (e.g. RS1234), or phone..."
                        className="w-full rounded-lg border bg-background pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      {resellerSearch && (
                        <button
                          type="button"
                          onClick={() => setResellerSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {resellerSearch && (
                      <div className="rounded-lg border bg-background shadow-md divide-y overflow-hidden max-h-52 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                        {filteredResellers.length > 0 ? (
                          filteredResellers.map(r => {
                            const isSelected = String(resellerId) === String(r.id);
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                  setResellerId(r.id);
                                  setResellerSearch("");
                                  toast.success(`Reseller selected: ${r.business_name}`);
                                }}
                                className={`flex w-full items-center justify-between p-2.5 text-left transition-colors cursor-pointer ${
                                  isSelected ? "bg-primary/10 font-medium" : "hover:bg-accent"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                    {r.business_name?.slice(0, 2).toUpperCase() || "RS"}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-foreground truncate">{r.business_name}</span>
                                      <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-mono text-muted-foreground uppercase">{r.code}</span>
                                    </div>
                                    {r.contact_phone && (
                                      <p className="text-[10px] text-muted-foreground truncate">{r.contact_phone}</p>
                                    )}
                                  </div>
                                </div>
                                {isSelected ? (
                                  <span className="flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                                    <Check className="h-3 w-3" /> Selected
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium text-primary hover:underline">
                                    Select
                                  </span>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-3 text-center text-xs text-muted-foreground">
                            No reseller found matching &quot;{resellerSearch}&quot;
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Select / Trending Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-muted-foreground mr-1">Quick Select:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setResellerId(null);
                          setResellerSearch("");
                        }}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all border cursor-pointer ${
                          !resellerId
                            ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                            : "bg-background hover:bg-accent text-foreground"
                        }`}
                      >
                        Direct
                      </button>
                      {trendingResellers.map(r => {
                        const isSelected = String(resellerId) === String(r.id);
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setResellerId(r.id);
                              setResellerSearch("");
                            }}
                            className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                                : "bg-background hover:bg-accent text-foreground"
                            }`}
                          >
                            {r.business_name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[13px] font-bold uppercase tracking-wide text-foreground/80">Customer Information</label>
                  <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                    <Field label="Customer Full Name">
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(sanitizeName(e.target.value))}
                        placeholder="Enter full name"
                        className="w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20"
                      />
                      {name && errors.name && <FieldError text={errors.name} />}
                    </Field>
                    <Field label="Mobile Number">
                      <input
                        required
                        value={phone}
                        onChange={(e) => setPhone(normalizePhone(e.target.value))}
                        inputMode="numeric"
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20"
                      />
                      {phone && errors.phone && <FieldError text={errors.phone} />}
                    </Field>
                    
                    <Field label="Shipping Address" className="sm:col-span-2">
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={1}
                        placeholder="Complete address (Road, Area, City...)"
                        className="w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20 min-h-[42px]"
                      />
                      {address && errors.address && <FieldError text={errors.address} />}
                    </Field>
                  </div>

                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold uppercase tracking-wide text-foreground/80">Order Items</label>
                    {picked.length > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary animate-in zoom-in">
                        {picked.length} {picked.length === 1 ? 'Item' : 'Items'} Selected
                      </span>
                    )}
                  </div>

                  <div className="rounded-2xl border bg-background shadow-sm overflow-hidden flex flex-col">
                    {/* Search Bar */}
                    <div className="p-3 border-b bg-muted/5">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={isAdmin ? "Search product by name or ID..." : "Search catalog by name or ID..."}
                          className="w-full rounded-xl border bg-background px-9 py-2 text-xs focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Product Search & Browser (Visible when searching, when cart is empty, or when picker is open) */}
                    {(query.trim() !== "" || picked.length === 0 || showPicker) && (
                      <div className="max-h-72 border-b divide-y overflow-y-auto bg-muted/10 animate-in slide-in-from-top-2">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-1.5 bg-background/95 backdrop-blur border-b shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {query ? `Search Results (${results.length})` : `Available Catalog Products (${results.length})`}
                          </span>
                          {picked.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowPicker(false);
                                setQuery("");
                              }}
                              className="text-[10px] font-bold text-primary hover:underline"
                            >
                              Hide catalog
                            </button>
                          )}
                        </div>
                        {results.length > 0 ? (
                          results.map((item) => {
                            const p = item.type === 'listing' ? item.data.products! : item.data;
                            const price = item.type === 'listing' ? item.data.selling_price : (p.suggested_price || p.reseller_price + p.packaging_cost);
                            const dc = productDeliveryCharge(p, area);
                            const inCart = item.type === 'listing' 
                              ? lines.some((x) => x.listing_id === item.data.id)
                              : lines.some((x) => x.product_id === p.id);
                            return (
                              <button
                                type="button"
                                key={item.type === 'listing' ? `l-${item.data.id}` : `p-${p.id}`}
                                onClick={() => pick(item)}
                                className={`flex w-full items-center gap-3 p-3 text-left transition-colors ${
                                  inCart ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-accent/60'
                                }`}
                              >
                                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border bg-muted shadow-sm">
                                  {p.og_image_url ? (
                                    <img src={p.og_image_url} alt="" className="h-full w-full object-cover" />
                                  ) : <Search className="m-auto h-full w-1/2 text-muted-foreground/30" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="truncate text-xs font-bold text-foreground">{p.name}</span>
                                    {item.type === 'listing' && (
                                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-black text-primary uppercase tracking-tighter">Listing</span>
                                    )}
                                  </div>
                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <ProductCodeChip code={p.product_code} />
                                    <span className="text-[11px] font-bold text-primary">
                                      ৳{Number(price).toFixed(0)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      · Delivery: ৳{dc.toFixed(0)}
                                    </span>
                                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase ${Number(p.stock ?? 0) <= 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`}>
                                      {Number(p.stock ?? 0) <= 0 ? "Out of stock" : `Stock ${Number(p.stock ?? 0)}`}
                                    </span>
                                  </div>
                                </div>
                                <div className={`shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${inCart ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-primary/20 hover:text-primary'}`}>
                                  <Plus className="h-3.5 w-3.5" />
                                  <span>{inCart ? 'Added' : 'Add'}</span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-muted-foreground">
                            <p className="text-xs">No products found for "{query}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Add More button when items are in cart and picker is closed */}
                    {picked.length > 0 && !query && !showPicker && (
                      <div className="p-2.5 border-b bg-muted/20 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {picked.length} {picked.length === 1 ? 'item' : 'items'} added to order
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPicker(true)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Browse / Add more
                        </button>
                      </div>
                    )}

                    {/* Cart List (Visible when items picked) */}
                    <div className="flex-1 max-h-[300px] overflow-y-auto divide-y bg-background">
                      {picked.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground bg-muted/5">
                          <p className="text-xs font-semibold text-foreground">Click any product above or search to add to your order</p>
                          <p className="text-[10px] opacity-60 mt-0.5 uppercase tracking-wider">No items added yet</p>
                        </div>
                      ) : (
                        picked.map(({ line, p, sellPrice, minPrice, listingId }, i) => (
                          <div key={listingId || p.id} className="group relative flex flex-wrap items-center gap-4 p-4 hover:bg-muted/5 transition-colors">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-muted shadow-sm">
                              {p.og_image_url && <img src={p.og_image_url} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-black text-foreground">{p.name}</div>
                              <div className="mt-1"><ProductCodeChip code={p.product_code} /></div>
                              <div className="mt-1.5 flex items-center gap-2">
                                <span className="text-[9px] font-semibold uppercase text-muted-foreground">Sell ৳</span>
                                <input
                                  value={sellPrice}
                                  inputMode="numeric"
                                  onChange={(e) => {
                                    const v = Number(e.target.value) || 0;
                                    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, price: v } : l)));
                                  }}
                                  onBlur={() => {
                                    if (sellPrice < minPrice) {
                                      setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, price: minPrice } : l)));
                                      toast.error(`Minimum selling price is ৳${minPrice} — cannot go below this`);
                                    }
                                  }}
                                  className={`w-20 rounded-lg border bg-background px-2 py-1 text-[11px] font-bold tabular-nums focus:ring-2 focus:ring-primary/20 ${
                                    sellPrice < minPrice ? "border-destructive text-destructive" : ""
                                  }`}
                                />
                                <span className="text-[9px] text-muted-foreground/70">min ৳{minPrice}</span>
                                <span className="text-[10px] text-muted-foreground/60">× {line.qty}</span>
                              </div>
                            </div>
                            
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center rounded-xl border bg-muted/30 p-1">
                                <button 
                                  type="button" 
                                  onClick={() => setLines(prev => prev.flatMap((l, idx) => idx === i ? (l.qty <= 1 ? [] : [{...l, qty: l.qty - 1}]) : [l]))} 
                                  className="h-7 w-7 flex items-center justify-center hover:bg-background rounded-lg transition-all active:scale-90"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-[12px] font-black">{line.qty}</span>
                                <button 
                                  type="button" 
                                  onClick={() => setLines(prev => prev.map((l, idx) => {
                                    if (idx !== i) return l;
                                    const stock = Number(p?.stock ?? 0);
                                    if (l.qty + 1 > stock) { toast.error(`Only ${stock} in stock`); return l; }
                                    return { ...l, qty: l.qty + 1 };
                                  }))}

                                  className="h-7 w-7 flex items-center justify-center hover:bg-background rounded-lg transition-all active:scale-90"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => setLines(prev => prev.filter((_, idx) => idx !== i))}
                                className="h-8 w-8 flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Delivery Area Picker (Inside Cart Section) */}
                    {totals.showAreaPicker && (
                      <div className="p-4 border-t bg-muted/10 animate-in fade-in slide-in-from-bottom-2">
                        <label className="mb-2.5 block text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest">Select Delivery Destination</label>
                        <div className="grid grid-cols-3 gap-2">
                          {areaOptions().map(({ value: v, label }) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setArea(v)}
                              className={`flex items-center justify-between rounded-2xl border-2 py-3 px-4 transition-all duration-300 ${
                                area === v 
                                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                                  : "bg-background border-muted hover:border-primary/30 text-muted-foreground"
                              }`}
                            >
                              <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
                              <span className={`text-[10px] font-bold ${area === v ? 'text-primary-foreground/90' : 'text-primary'}`}>
                                ৳{Math.max(...picked.map(({ p }) => productDeliveryCharge(p, v)))}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {picked.length > 0 && (
                  <div className="space-y-3">
                    <SectionLabel>Delivery & Other Charges</SectionLabel>
                    <div className="grid gap-3 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-2">
                      <MoneyField
                        label="Delivery Charge (Customer pays)"
                        hint={`Default ৳${totals.autoShipping.toFixed(0)}`}
                        value={shipOverride}
                        onChange={setShipOverride}
                        placeholder={totals.autoShipping.toFixed(0)}
                      />
                      <MoneyField label="Discount" value={discount} onChange={setDiscount} placeholder="0" />
                      <MoneyField
                        label="Packaging Cost"
                        hint={packagingSum ? "Sum of all items" : "Highest item only"}
                        disabled={!isAdmin}
                        value={isAdmin ? packagingOverride : ""}
                        onChange={setPackagingOverride}
                        placeholder={totals.packagingDefault.toFixed(0)}
                      />
                      {isAdmin && (
                        <MoneyField
                          label="Courier Cost (Admin cost)"
                          hint={`Default ৳${totals.autoShipping.toFixed(0)}`}
                          value={deliveryCostOverride}
                          onChange={setDeliveryCostOverride}
                          placeholder={totals.autoShipping.toFixed(0)}
                        />
                      )}
                    </div>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      Leave empty to use the default. Delivery charge = paid by customer, courier cost = admin's expense.
                      <br />
                      {packagingModeHint(packagingSum)}
                    </p>

                  </div>
                )}



              </div>
            </div>


            {/* Right Column: Advance, payment & summary */}
            <aside className="flex flex-col gap-4 bg-muted/20 p-4 sm:p-6 border-t lg:border-t-0">
              {picked.length > 0 && (
                <div className="space-y-3">
                  <SectionLabel>Advance Payment</SectionLabel>
                  <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MoneyField
                        label="Advance Amount"
                        hint="If already received"
                        value={advance}
                        onChange={setAdvance}
                        placeholder="0"
                      />
                      <AdvanceByToggle value={advanceBy} onChange={setAdvanceBy} />
                    </div>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">
                      If taken by admin, it is not deducted from the reseller's account; if taken by the reseller, it will be deducted from the final amount.
                    </p>
                  </div>

                  <SectionLabel>Payment Method & Note</SectionLabel>
                  <div className="grid gap-3 rounded-2xl border bg-background p-4">
                    <Field label="Payment Method">
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="cod">Cash on Delivery</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="rocket">Rocket</option>
                        <option value="sslcommerz">SSLCommerz</option>
                      </select>
                    </Field>
                    <Field label="Order Note (Optional)">
                      <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Special instructions..."
                        className="w-full rounded-lg border px-3 py-2 text-[13px] focus:ring-2 focus:ring-primary/20"
                      />
                    </Field>
                  </div>
                </div>
              )}

              <SectionLabel>Order Summary</SectionLabel>



              {/* Summary Section (Now a Sticky Footer in the Right Column) */}
              <div className="mt-auto space-y-4 rounded-2xl border-2 border-primary/20 bg-background p-5 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-3">
                  {/* Customer bill */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Customer bill</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium">Subtotal ({picked.length} {picked.length === 1 ? "item" : "items"})</span>
                      <span className="font-black text-foreground">৳{totals.subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">Shipping charge</span>
                        {picked.length > 1 && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary">Max applied</span>
                        )}
                      </div>
                      <span className="font-black text-foreground">৳{totals.shipping.toFixed(0)}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-xs text-destructive">
                        <span className="font-medium">Discount</span>
                        <span className="font-black">−৳{totals.discount.toFixed(0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-1.5 text-xs">
                      <span className="font-bold text-foreground">Payable total</span>
                      <span className="font-black text-primary">৳{totals.total.toFixed(0)}</span>
                    </div>
                    {totals.advance > 0 && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-muted-foreground">
                            Advance received
                            <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary">
                              {advanceBy}
                            </span>
                          </span>
                          <span className="font-black text-foreground">−৳{totals.advance.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="font-medium">COD to collect</span>
                          <span className="font-black text-foreground">৳{totals.codDue.toFixed(0)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Cost side */}
                  <div className="space-y-1.5 border-t pt-2.5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {isAdmin ? "Cost" : "Your cost"}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium">Product cost</span>
                      <span className="font-black text-foreground">৳{totals.productCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium">Delivery charge</span>
                      <span className="font-black text-foreground">৳{totals.deliveryCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="font-medium">Packaging cost</span>
                      <span className="font-black text-foreground">৳{totals.packaging.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1.5 text-xs">
                      <span className="font-bold text-foreground">Total cost</span>
                      <span className="font-black text-foreground">
                        ৳{(totals.productCost + totals.deliveryCost + totals.packaging).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="space-y-1.5 border-t-2 border-dashed border-muted pt-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">
                        {totals.grossProfit < 0 ? (isAdmin ? "Reseller loss" : "Your loss") : isAdmin ? "Reseller profit" : "Your profit"}
                      </span>
                      <span className={`font-black ${totals.grossProfit < 0 ? "text-destructive" : "text-success"}`}>
                        ৳{totals.grossProfit.toFixed(0)}
                      </span>
                    </div>
                    {totals.resellerAdvance > 0 && (
                      <>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="font-medium">Advance already in reseller hand</span>
                          <span className="font-black text-foreground">−৳{totals.resellerAdvance.toFixed(0)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                            Final amount to receive
                          </span>
                          <span className={`text-lg font-black tracking-tight ${totals.profit < 0 ? "text-destructive" : "text-success"}`}>
                            ৳{totals.profit.toFixed(0)}
                          </span>
                        </div>
                      </>
                    )}
                    {totals.advance > 0 && (
                      <p className="text-[10px] leading-snug text-muted-foreground">
                        {advanceBy === "reseller"
                          ? "Advance is already with the reseller, so it is deducted from the final amount."
                          : "Advance is held by admin — no plus/minus on the reseller balance."}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy || picked.length === 0}
                  className="w-full flex items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-sm font-black text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none group"
                >
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                      <span>Place Order</span>
                      <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </form>
    </div>
  );
}


function FieldError({ text }: { text: string }) {
  return <p className="mt-1 text-[11px] font-medium text-destructive">{text}</p>;
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : ""} ${muted ? "text-success" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
