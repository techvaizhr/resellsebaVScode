import { a as listUploadedFilesServer, c as blobToDataUrl, i as deleteUploadedFileServer, l as validateAndCompress, o as saveUploadedFileServer } from "./client-CdRSQB5v.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { t as Button } from "./button-BkEeRci-.js";
import { i as usePaginated, r as Pagination } from "./data-list-Cd6RJIu_.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, HardDrive, Image, Loader2, Search, Trash2, Upload } from "lucide-react";
//#region src/routes/_authenticated/supplier/media.tsx?tsr-split=component
function SupplierMediaPage() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [unusedOnly, setUnusedOnly] = useState(false);
	const [unusedCount, setUnusedCount] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(48);
	const [selectedPaths, setSelectedPaths] = useState(/* @__PURE__ */ new Set());
	const [uploading, setUploading] = useState(false);
	const [busy, setBusy] = useState(false);
	const loadMedia = async () => {
		setLoading(true);
		try {
			const res = await listUploadedFilesServer({ data: {
				folder: "products",
				unused_only: unusedOnly,
				search
			} });
			setItems(res?.data ?? []);
			setUnusedCount(res?.unused_count ?? 0);
			setTotalCount(res?.total ?? (res?.data ?? []).length);
		} catch {
			setItems([]);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadMedia();
		setSelectedPaths(/* @__PURE__ */ new Set());
		setPage(1);
	}, [
		unusedOnly,
		search,
		perPage
	]);
	const pagedItems = usePaginated(items.filter((item) => item.filename.toLowerCase().includes(search.toLowerCase())), page, perPage);
	const handleUpload = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploading(true);
		try {
			for (const file of Array.from(files)) await saveUploadedFileServer({ data: {
				base64: await blobToDataUrl((await validateAndCompress(file)).blob),
				folder: "products"
			} });
			toast.success("Images uploaded to Media Library!");
			await loadMedia();
		} catch (err) {
			toast.error(err.message || "Upload failed");
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	};
	const handleSingleDelete = async (item) => {
		if (!confirm(`Delete image ${item.filename}?`)) return;
		try {
			await deleteUploadedFileServer({ data: { path: item.path } });
			toast.success("Image deleted successfully!");
			setItems((prev) => prev.filter((i) => i.path !== item.path));
		} catch (err) {
			toast.error(err.message || "Delete failed");
		}
	};
	const handleBulkDelete = async () => {
		if (selectedPaths.size === 0) return;
		if (!confirm(`Are you sure you want to permanently delete ${selectedPaths.size} selected image(s)?`)) return;
		setBusy(true);
		try {
			for (const p of Array.from(selectedPaths)) await deleteUploadedFileServer({ data: { path: p } });
			toast.success(`${selectedPaths.size} images deleted.`);
			setSelectedPaths(/* @__PURE__ */ new Set());
			await loadMedia();
		} catch (err) {
			toast.error(err.message || "Delete failed");
		} finally {
			setBusy(false);
		}
	};
	const toggleSelect = (path) => {
		setSelectedPaths((prev) => {
			const next = new Set(prev);
			if (next.has(path)) next.delete(path);
			else next.add(path);
			return next;
		});
	};
	const formatSize = (bytes) => {
		if (!bytes) return "0 KB";
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / 1048576).toFixed(1) + " MB";
	};
	const filteredItems = items.filter((item) => item.filename.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ jsx(PageHeader, {
					title: "Supplier Media Gallery",
					description: "Manage your uploaded product images, clear unused media, and save storage space."
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ jsxs("label", {
						className: "relative inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:bg-primary/90 cursor-pointer",
						children: [
							uploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
							/* @__PURE__ */ jsx("span", { children: "Upload Images" }),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								accept: "image/*",
								multiple: true,
								className: "hidden",
								onChange: handleUpload,
								disabled: uploading
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "surface-card p-4 flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(Image, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xl font-bold text-foreground",
							children: totalCount
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: "Total Images"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "surface-card p-4 flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600",
							children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xl font-bold text-foreground",
							children: Math.max(0, totalCount - unusedCount)
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: "In-Use Assets"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "surface-card p-4 flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600",
							children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xl font-bold text-foreground",
							children: unusedCount
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: "Unused / Orphans"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "surface-card p-4 flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600",
							children: /* @__PURE__ */ jsx(HardDrive, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "text-xl font-bold text-foreground",
							children: [(items.reduce((acc, i) => acc + (i.size || 0), 0) / (1024 * 1024)).toFixed(1), " MB"]
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: "Disk Space"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Search images by name...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "w-full rounded-xl border border-border/80 bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setUnusedOnly(!unusedOnly),
								className: cn("inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all", unusedOnly ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400" : "border-border/80 text-muted-foreground hover:bg-muted"),
								children: [
									/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ jsx("span", { children: "Unused Only" }),
									unusedCount > 0 && /* @__PURE__ */ jsx("span", {
										className: "rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-300",
										children: unusedCount
									})
								]
							}),
							/* @__PURE__ */ jsxs("select", {
								value: perPage,
								onChange: (e) => setPerPage(Number(e.target.value)),
								className: "rounded-xl border border-border/80 bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer",
								title: "Items per page",
								children: [[
									24,
									48,
									96,
									120
								].map((n) => /* @__PURE__ */ jsxs("option", {
									value: n,
									children: [n, " / page"]
								}, n)), /* @__PURE__ */ jsx("option", {
									value: -1,
									children: "All"
								})]
							}),
							selectedPaths.size > 0 && /* @__PURE__ */ jsxs(Button, {
								variant: "destructive",
								size: "sm",
								onClick: handleBulkDelete,
								disabled: busy,
								className: "rounded-xl text-xs font-semibold gap-1.5",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsxs("span", { children: [
									"Delete Selected (",
									selectedPaths.size,
									")"
								] })]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card p-6 min-h-[350px]",
				children: loading ? /* @__PURE__ */ jsx("div", {
					className: "grid place-items-center py-20",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
				}) : filteredItems.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-16 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground mb-3",
							children: /* @__PURE__ */ jsx(Image, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-semibold text-foreground",
							children: "No media files found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Upload images to populate your product gallery."
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
						children: pagedItems.map((item) => {
							return /* @__PURE__ */ jsxs("div", {
								onClick: () => toggleSelect(item.path),
								className: cn("group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all cursor-pointer select-none", selectedPaths.has(item.path) ? "border-primary ring-2 ring-primary shadow-md" : "border-border/60 hover:border-primary/50 hover:shadow-sm"),
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative aspect-square w-full overflow-hidden bg-muted/40",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: item.url,
											alt: item.filename,
											loading: "lazy",
											decoding: "async",
											className: "h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
										}),
										!item.is_used && /* @__PURE__ */ jsx("span", {
											className: "absolute top-1.5 left-1.5 rounded-md bg-amber-500/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs",
											children: "Unused"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: (e) => {
												e.stopPropagation();
												handleSingleDelete(item);
											},
											className: "absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive shadow-xs",
											title: "Delete image",
											children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "p-2.5 bg-card",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-xs font-semibold text-foreground",
										children: item.filename
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-[10px] text-muted-foreground mt-1",
										children: [/* @__PURE__ */ jsx("span", { children: item.folder }), /* @__PURE__ */ jsx("span", { children: formatSize(item.size) })]
									})]
								})]
							}, item.path);
						})
					}), /* @__PURE__ */ jsx(Pagination, {
						page,
						perPage,
						total: filteredItems.length,
						onPage: setPage
					})]
				})
			})
		]
	});
}
//#endregion
export { SupplierMediaPage as component };
