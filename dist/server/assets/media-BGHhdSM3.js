import { a as listUploadedFilesServer, c as blobToDataUrl, i as deleteUploadedFileServer, l as validateAndCompress, o as saveUploadedFileServer } from "./client-Be051lUg.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { n as PageHeader } from "./ui-kit-D-uo76H8.js";
import { t as Button } from "./button-BkEeRci-.js";
import { i as usePaginated, r as Pagination } from "./data-list-Cd6RJIu_.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Filter, FolderOpen, HardDrive, Image, Loader2, Search, Trash2, Upload } from "lucide-react";
//#region src/routes/_authenticated/admin/media.tsx?tsr-split=component
var FOLDERS = [
	{
		id: "all",
		label: "All Media",
		icon: FolderOpen
	},
	{
		id: "products",
		label: "Products",
		icon: Image
	},
	{
		id: "branding",
		label: "Branding",
		icon: Image
	},
	{
		id: "brands",
		label: "Brands",
		icon: Image
	},
	{
		id: "categories",
		label: "Categories",
		icon: Image
	},
	{
		id: "stores",
		label: "Reseller Stores",
		icon: Image
	},
	{
		id: "avatars",
		label: "Avatars",
		icon: Image
	},
	{
		id: "notices",
		label: "Notices",
		icon: Image
	},
	{
		id: "tutorials",
		label: "Tutorials",
		icon: Image
	}
];
function AdminMediaPage() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedFolder, setSelectedFolder] = useState("all");
	const [unusedOnly, setUnusedOnly] = useState(false);
	const [unusedCount, setUnusedCount] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [folderCounts, setFolderCounts] = useState({});
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
				folder: selectedFolder,
				unused_only: unusedOnly,
				search
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
		loadMedia();
		setSelectedPaths(/* @__PURE__ */ new Set());
		setPage(1);
	}, [
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
		if (!confirm(`Are you sure you want to delete ${selectedPaths.size} selected image(s)?`)) return;
		setBusy(true);
		try {
			for (const p of Array.from(selectedPaths)) await deleteUploadedFileServer({ data: { path: p } });
			toast.success(`${selectedPaths.size} image(s) deleted successfully!`);
			setSelectedPaths(/* @__PURE__ */ new Set());
			await loadMedia();
		} catch (err) {
			toast.error(err.message || "Bulk delete failed");
		} finally {
			setBusy(false);
		}
	};
	const handleCleanUnused = async () => {
		const unusedItems = items.filter((i) => !i.is_used);
		if (unusedItems.length === 0) {
			toast.info("No unused images to clean!");
			return;
		}
		if (!confirm(`Delete all ${unusedItems.length} unused image(s) to free up storage space?`)) return;
		setBusy(true);
		try {
			for (const i of unusedItems) await deleteUploadedFileServer({ data: { path: i.path } });
			toast.success(`Cleaned ${unusedItems.length} unused images!`);
			await loadMedia();
		} catch (err) {
			toast.error(err.message || "Cleanup failed");
		} finally {
			setBusy(false);
		}
	};
	const totalSizeMB = (items.reduce((acc, i) => acc + (i.size || 0), 0) / (1024 * 1024)).toFixed(1);
	const totalDisplay = totalCount || items.length;
	const inUseCount = Math.max(0, totalDisplay - unusedCount);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsx(PageHeader, {
					title: "Media Library & Asset Manager",
					description: "Manage, categorize, and clean up product and brand assets."
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [unusedCount > 0 && /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleCleanUnused,
						disabled: busy,
						className: "rounded-xl border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 text-xs font-semibold gap-1.5",
						children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsxs("span", { children: [
							"Clean ",
							unusedCount,
							" Unused"
						] })]
					}), /* @__PURE__ */ jsxs("label", {
						className: "btn-brand inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-md cursor-pointer",
						children: [
							uploading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
							/* @__PURE__ */ jsx("span", { children: "Upload Media" }),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								multiple: true,
								accept: "image/*",
								onChange: handleUpload,
								className: "hidden",
								disabled: uploading
							})
						]
					})]
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
							children: totalDisplay
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
							children: inUseCount
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
							children: [totalSizeMB, " MB"]
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground",
							children: "Disk Space"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "surface-card p-4 space-y-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: FOLDERS.map((f) => {
							const count = folderCounts[f.id] ?? (f.id === "all" ? totalCount : 0);
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => setSelectedFolder(f.id),
								className: cn("inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all", selectedFolder === f.id ? "bg-primary text-primary-foreground shadow-xs font-bold" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"),
								children: [/* @__PURE__ */ jsx("span", { children: f.label }), /* @__PURE__ */ jsx("span", {
									className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums", selectedFolder === f.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"),
									children: count
								})]
							}, f.id);
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setUnusedOnly(!unusedOnly),
								className: cn("inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all", unusedOnly ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs" : "border-border/70 text-muted-foreground hover:bg-muted"),
								children: [
									/* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ jsx("span", { children: "Unused Only" }),
									/* @__PURE__ */ jsx("span", {
										className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-bold tabular-nums", unusedOnly ? "bg-amber-500 text-white" : "bg-amber-500/20 text-amber-700 dark:text-amber-300"),
										children: unusedCount
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex items-center",
								children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Search file name...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && loadMedia(),
									className: "rounded-xl border border-border/70 bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
								})]
							}),
							/* @__PURE__ */ jsxs("select", {
								value: perPage,
								onChange: (e) => setPerPage(Number(e.target.value)),
								className: "rounded-xl border border-border/70 bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer",
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
							})
						]
					})]
				}), selectedPaths.size > 0 && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between rounded-xl bg-destructive/10 px-4 py-2 border border-destructive/20 text-destructive text-xs",
					children: [/* @__PURE__ */ jsxs("span", { children: [selectedPaths.size, " image(s) selected"] }), /* @__PURE__ */ jsxs(Button, {
						variant: "destructive",
						size: "sm",
						onClick: handleBulkDelete,
						disabled: busy,
						className: "rounded-lg text-xs font-bold gap-1.5 h-8",
						children: [
							/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
							" Delete Selected (",
							selectedPaths.size,
							")"
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "surface-card p-6 min-h-[400px]",
				children: loading ? /* @__PURE__ */ jsx("div", {
					className: "grid place-items-center py-24",
					children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
				}) : items.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-20 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground mb-3",
							children: /* @__PURE__ */ jsx(Image, { className: "h-7 w-7" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-foreground",
							children: "No media files found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground mt-1 max-w-sm",
							children: "Upload product photos, store logos or banners to see them in this library."
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
						children: pagedItems.map((item) => {
							return /* @__PURE__ */ jsxs("div", {
								onClick: () => {
									const next = new Set(selectedPaths);
									if (next.has(item.path)) next.delete(item.path);
									else next.add(item.path);
									setSelectedPaths(next);
								},
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
										children: [/* @__PURE__ */ jsx("span", {
											className: "capitalize",
											children: item.folder
										}), /* @__PURE__ */ jsxs("span", { children: [Math.round(item.size / 1024), " KB"] })]
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
			})
		]
	});
}
//#endregion
export { AdminMediaPage as component };
