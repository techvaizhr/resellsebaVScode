import { a as listUploadedFilesServer, c as blobToDataUrl, i as deleteUploadedFileServer, l as validateAndCompress, o as saveUploadedFileServer } from "./client-CdRSQB5v.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Button } from "./button-BkEeRci-.js";
import { i as usePaginated, r as Pagination } from "./data-list-Cd6RJIu_.js";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Check, Filter, GripVertical, Image, Loader2, Search, Star, Trash2, Upload, X } from "lucide-react";
import { createPortal } from "react-dom";
//#region src/components/MediaLibraryModal.tsx
var CATEGORIES = [
	{
		id: "all",
		label: "All Media"
	},
	{
		id: "products",
		label: "Products"
	},
	{
		id: "branding",
		label: "Branding"
	},
	{
		id: "brands",
		label: "Brands"
	},
	{
		id: "categories",
		label: "Categories"
	},
	{
		id: "stores",
		label: "Reseller Stores"
	},
	{
		id: "avatars",
		label: "Avatars"
	},
	{
		id: "notices",
		label: "Notices"
	},
	{
		id: "tutorials",
		label: "Tutorials"
	}
];
function MediaLibraryModal({ open, onClose, onSelect, multiple = false, folder = "products" }) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedFolder, setSelectedFolder] = useState(folder || "all");
	const [unusedOnly, setUnusedOnly] = useState(false);
	const [unusedCount, setUnusedCount] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [folderCounts, setFolderCounts] = useState({});
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(30);
	const [selectedUrls, setSelectedUrls] = useState(/* @__PURE__ */ new Set());
	const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(null);
	const loadMedia = async () => {
		setLoading(true);
		try {
			const res = await listUploadedFilesServer({ data: {
				folder: selectedFolder,
				search,
				unused_only: unusedOnly
			} });
			setItems(res?.data ?? []);
			setUnusedCount(res?.unused_count ?? 0);
			setTotalCount(res?.total ?? (res?.data ?? []).length);
			setFolderCounts(res?.folder_counts ?? {});
		} catch {
			setItems([]);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (open) {
			loadMedia();
			setSelectedUrls(/* @__PURE__ */ new Set());
			setPage(1);
		}
	}, [
		open,
		selectedFolder,
		unusedOnly,
		search,
		perPage
	]);
	const pagedItems = usePaginated(items, page, perPage);
	const handleUpload = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploading(true);
		try {
			const targetFolder = selectedFolder === "all" ? "products" : selectedFolder;
			for (const file of Array.from(files)) await saveUploadedFileServer({ data: {
				base64: await blobToDataUrl((await validateAndCompress(file)).blob),
				folder: targetFolder
			} });
			toast.success("Image uploaded & saved successfully!");
			await loadMedia();
		} catch (err) {
			toast.error(err.message || "Upload failed");
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	};
	const handleDelete = async (item) => {
		if (!confirm(`Are you sure you want to delete ${item.filename}?`)) return;
		setDeleting(item.path);
		try {
			await deleteUploadedFileServer({ data: { path: item.path } });
			toast.success("Image deleted successfully!");
			setItems((prev) => prev.filter((i) => i.path !== item.path));
			if (selectedUrls.has(item.url)) {
				const next = new Set(selectedUrls);
				next.delete(item.url);
				setSelectedUrls(next);
			}
		} catch (err) {
			toast.error(err.message || "Delete failed");
		} finally {
			setDeleting(null);
		}
	};
	const toggleSelect = (item) => {
		if (!multiple) {
			onSelect([{
				url: item.url,
				path: item.path
			}]);
			onClose();
			return;
		}
		const next = new Set(selectedUrls);
		if (next.has(item.url)) next.delete(item.url);
		else next.add(item.url);
		setSelectedUrls(next);
	};
	const handleConfirmMulti = () => {
		onSelect(items.filter((i) => selectedUrls.has(i.url)).map((i) => ({
			url: i.url,
			path: i.path
		})));
		onClose();
	};
	if (!open) return null;
	if (typeof document === "undefined") return null;
	return createPortal(/* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "surface-card relative flex h-[85vh] max-h-[720px] w-full max-w-4xl flex-col overflow-hidden border border-border/80 shadow-2xl bg-card rounded-2xl mx-auto my-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-border/60 px-4 sm:px-6 py-3.5 shrink-0",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(Image, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-sm sm:text-base font-bold text-foreground",
							children: "Media Library & Gallery"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[11px] sm:text-xs text-muted-foreground",
							children: "Pick from existing uploads or add new images."
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "btn-brand inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs cursor-pointer",
							children: [
								uploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ jsx("span", { children: "Upload New" }),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									multiple: true,
									accept: "image/*",
									onChange: handleUpload,
									className: "hidden",
									disabled: uploading
								})
							]
						}), /* @__PURE__ */ jsx("button", {
							onClick: onClose,
							className: "rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
							children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-2.5 border-b border-border/50 bg-muted/20 px-4 sm:px-6 py-2.5 shrink-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap items-center gap-1",
						children: CATEGORIES.map((cat) => {
							const count = folderCounts[cat.id] ?? (cat.id === "all" ? totalCount : 0);
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => setSelectedFolder(cat.id),
								className: cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all", selectedFolder === cat.id ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"),
								children: [/* @__PURE__ */ jsx("span", { children: cat.label }), /* @__PURE__ */ jsx("span", {
									className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums", selectedFolder === cat.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"),
									children: count
								})]
							}, cat.id);
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setUnusedOnly(!unusedOnly),
								className: cn("inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all", unusedOnly ? "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shadow-xs" : "border-border/60 text-muted-foreground hover:bg-muted"),
								children: [
									/* @__PURE__ */ jsx(Filter, { className: "h-3 w-3" }),
									/* @__PURE__ */ jsx("span", { children: "Unused Only" }),
									/* @__PURE__ */ jsx("span", {
										className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums", unusedOnly ? "bg-amber-500 text-white" : "bg-amber-500/20 text-amber-700 dark:text-amber-300"),
										children: unusedCount
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex items-center",
								children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Search images...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && loadMedia(),
									className: "w-32 sm:w-44 rounded-lg border border-border/60 bg-background pl-8 pr-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
								})]
							}),
							/* @__PURE__ */ jsxs("select", {
								value: perPage,
								onChange: (e) => setPerPage(Number(e.target.value)),
								className: "rounded-lg border border-border/60 bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer",
								title: "Items per page",
								children: [[
									18,
									30,
									60,
									120
								].map((n) => /* @__PURE__ */ jsxs("option", {
									value: n,
									children: [n, "/p"]
								}, n)), /* @__PURE__ */ jsx("option", {
									value: -1,
									children: "All"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 no-scrollbar flex flex-col justify-between",
					children: loading ? /* @__PURE__ */ jsx("div", {
						className: "grid h-full place-items-center py-12",
						children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
					}) : items.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center justify-center h-full py-12 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground mb-3",
								children: /* @__PURE__ */ jsx(Image, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold text-foreground",
								children: "No media found"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Upload images or change your filter."
							})
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
							children: pagedItems.map((item) => {
								const isSelected = selectedUrls.has(item.url);
								return /* @__PURE__ */ jsxs("div", {
									onClick: () => toggleSelect(item),
									className: cn("group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all cursor-pointer select-none", isSelected ? "border-primary ring-2 ring-primary shadow-md" : "border-border/60 hover:border-primary/50 hover:shadow-sm"),
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
											isSelected && /* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center",
												children: /* @__PURE__ */ jsx("div", {
													className: "grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-md",
													children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 stroke-[3]" })
												})
											}),
											!item.is_used && /* @__PURE__ */ jsx("span", {
												className: "absolute top-1.5 left-1.5 rounded-md bg-amber-500/90 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs",
												children: "Unused"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: (e) => {
													e.stopPropagation();
													handleDelete(item);
												},
												disabled: deleting === item.path,
												className: "absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground hover:bg-destructive shadow-xs",
												children: deleting === item.path ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "p-2 bg-card",
										children: [/* @__PURE__ */ jsx("div", {
											className: "truncate text-[11px] font-medium text-foreground",
											children: item.filename
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between text-[10px] text-muted-foreground mt-0.5",
											children: [/* @__PURE__ */ jsx("span", { children: item.folder }), /* @__PURE__ */ jsxs("span", { children: [Math.round(item.size / 1024), " KB"] })]
										})]
									})]
								}, item.path);
							})
						}), /* @__PURE__ */ jsx(Pagination, {
							page,
							perPage,
							total: items.length,
							onPage: setPage
						})]
					})
				}),
				multiple && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/60 bg-muted/20 px-6 py-3",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: [selectedUrls.size, " image(s) selected"]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "sm",
							onClick: onClose,
							className: "rounded-xl text-xs",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs(Button, {
							size: "sm",
							onClick: handleConfirmMulti,
							disabled: selectedUrls.size === 0,
							className: "btn-brand rounded-xl text-xs font-bold",
							children: [
								"Insert Selected (",
								selectedUrls.size,
								")"
							]
						})]
					})]
				})
			]
		})
	}), document.body);
}
//#endregion
//#region src/components/ImageUploader.tsx
function ImageUploader({ bucket, folder, value, onChange, multiple = false, label = "Upload image", variant = "square", square = false, maxImages, hint }) {
	const [busy, setBusy] = useState(false);
	const [galleryOpen, setGalleryOpen] = useState(false);
	const [draggedIdx, setDraggedIdx] = useState(null);
	const ref = useRef(null);
	const remaining = maxImages ? Math.max(0, maxImages - value.length) : Infinity;
	async function handleFiles(files) {
		if (!files || files.length === 0) return;
		setBusy(true);
		try {
			const list = Array.from(files).slice(0, remaining === Infinity ? files.length : remaining);
			if (maxImages && files.length > remaining) toast.message(`Max ${maxImages} images — extra files skipped.`);
			const out = [];
			for (const f of list) {
				const compressed = await validateAndCompress(f, { square });
				const base64 = await blobToDataUrl(compressed.blob);
				const filename = `${crypto.randomUUID()}.webp`;
				const saved = await saveUploadedFileServer({ data: {
					base64,
					folder: folder || "products",
					filename
				} });
				out.push({
					path: saved.path,
					url: saved.url,
					bytes: compressed.bytes
				});
			}
			onChange(multiple ? [...value, ...out] : out.slice(0, 1));
			toast.success("Image uploaded & saved to folder successfully!");
		} catch (e) {
			toast.error(e?.message || "Upload failed");
		} finally {
			setBusy(false);
			if (ref.current) ref.current.value = "";
		}
	}
	const handleGallerySelect = (selected) => {
		const newItems = selected.map((s) => ({
			url: s.url,
			path: s.path,
			bytes: 0
		}));
		if (multiple) {
			const existingUrls = new Set(value.map((v) => v.url));
			const uniqueNew = newItems.filter((item) => !existingUrls.has(item.url));
			onChange([...value, ...uniqueNew].slice(0, maxImages || void 0));
		} else onChange(newItems.slice(0, 1));
		toast.success("Gallery images inserted!");
	};
	async function remove(img) {
		onChange(value.filter((v) => v.path !== img.path || v.url !== img.url));
	}
	const makePrimary = (idx) => {
		if (idx === 0) return;
		onChange([value[idx], ...value.filter((_, i) => i !== idx)]);
		toast.success("Primary image updated!");
	};
	const handleDragStart = (e, index) => {
		setDraggedIdx(index);
		e.dataTransfer.effectAllowed = "move";
	};
	const handleDragOver = (e, index) => {
		e.preventDefault();
		if (draggedIdx === null || draggedIdx === index) return;
		const newItems = [...value];
		const draggedItem = newItems[draggedIdx];
		newItems.splice(draggedIdx, 1);
		newItems.splice(index, 0, draggedItem);
		setDraggedIdx(index);
		onChange(newItems);
	};
	const handleDragEnd = () => {
		setDraggedIdx(null);
	};
	const previewClass = variant === "hero" ? "h-44 w-full max-w-3xl" : variant === "wide" ? "h-32 w-full max-w-xl" : square ? "aspect-square w-28" : "h-24 w-24";
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap items-center gap-2",
				children: (multiple || value.length === 0) && (maxImages ? value.length < maxImages : true) && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => ref.current?.click(),
					disabled: busy,
					className: "inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:border-primary hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-50 cursor-pointer",
					children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: busy ? "Uploading..." : label })]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setGalleryOpen(true),
					className: "inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary shadow-xs hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer",
					children: [/* @__PURE__ */ jsx(Image, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Pick from Gallery" })]
				})] })
			}),
			value.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-3 pt-1",
				children: value.map((img, idx) => /* @__PURE__ */ jsxs("div", {
					draggable: multiple,
					onDragStart: (e) => handleDragStart(e, idx),
					onDragOver: (e) => handleDragOver(e, idx),
					onDragEnd: handleDragEnd,
					className: cn("group relative overflow-hidden rounded-xl border bg-muted shadow-xs transition-all", previewClass, draggedIdx === idx ? "opacity-40 scale-95 border-primary ring-2 ring-primary" : "border-border/70 hover:border-primary/60", multiple && "cursor-grab active:cursor-grabbing"),
					children: [
						/* @__PURE__ */ jsx("img", {
							src: img.url,
							className: cn("h-full w-full select-none", square ? "object-cover" : "object-contain"),
							alt: ""
						}),
						multiple && /* @__PURE__ */ jsx("div", {
							className: "absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-md p-1 text-white shadow-xs",
							children: /* @__PURE__ */ jsx(GripVertical, { className: "h-3 w-3" })
						}),
						idx === 0 && multiple ? /* @__PURE__ */ jsxs("div", {
							className: "absolute bottom-1.5 left-1.5 rounded-md bg-primary/95 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground shadow-xs flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Star, { className: "h-2.5 w-2.5 fill-current" }), " Primary"]
						}) : multiple ? /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => makePrimary(idx),
							className: "absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-medium text-white hover:bg-primary shadow-xs",
							children: "Set Primary"
						}) : null,
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => remove(img),
							className: "absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive shadow-xs",
							title: "Remove image",
							children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
						})
					]
				}, (img.path || img.url) + idx))
			}),
			/* @__PURE__ */ jsx("input", {
				ref,
				type: "file",
				accept: "image/jpeg,image/png,image/webp,image/gif",
				multiple,
				className: "hidden",
				onChange: (e) => handleFiles(e.target.files)
			}),
			hint !== "" && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground",
				children: hint ?? (multiple ? "💡 Drag & drop images to reorder serial. First image is used as primary thumbnail." : "Auto-optimized for ultra-fast loading.")
			}),
			/* @__PURE__ */ jsx(MediaLibraryModal, {
				open: galleryOpen,
				onClose: () => setGalleryOpen(false),
				onSelect: handleGallerySelect,
				multiple,
				folder
			})
		]
	});
}
//#endregion
export { ImageUploader as t };
