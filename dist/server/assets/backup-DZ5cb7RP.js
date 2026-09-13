import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { B as getToken, u as api } from "./client-CiD-puKw.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { En as Download, J as RefreshCw, K as RotateCcw, Mt as LoaderCircle, On as Database, f as Upload, fn as FolderArchive, gn as FileCodeCorner, h as TriangleAlert, qt as Image, rn as HardDrive, v as Trash2, wr as Archive } from "./vendor-icons-BEaCFqaT.js";
import { t as ConfirmModal } from "./ConfirmModal-D7BYETKw.js";
import { n as PageHeader, r as StatCard, t as EmptyState } from "./ui-kit-QFWJ0cl0.js";
//#region src/lib/backup.ts
var import_react = /* @__PURE__ */ __toESM(require_react());
var backupApi = {
	async list() {
		return api.get("admin/backup/list");
	},
	async createDb() {
		return api.post("admin/backup/create-db");
	},
	async createFiles() {
		return api.post("admin/backup/create-files");
	},
	async restoreDb(options) {
		if (options.file) {
			const formData = new FormData();
			formData.append("file", options.file);
			return api.upload("admin/backup/restore-db", formData);
		}
		return api.post("admin/backup/restore-db", { filename: options.filename });
	},
	async restoreFiles(options) {
		if (options.file) {
			const formData = new FormData();
			formData.append("file", options.file);
			return api.upload("admin/backup/restore-files", formData);
		}
		return api.post("admin/backup/restore-files", { filename: options.filename });
	},
	async delete(filename) {
		return api.post("admin/backup/delete", { filename });
	},
	async download(filename) {
		const token = getToken();
		const headers = {};
		if (token) headers["Authorization"] = `Bearer ${token}`;
		const res = await fetch(`/api/admin/backup/download/${encodeURIComponent(filename)}`, { headers });
		if (!res.ok) throw new Error("Failed to download backup file");
		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}
};
//#endregion
//#region src/routes/_authenticated/admin/backup.tsx?tsr-split=component
var import_jsx_runtime = require_jsx_runtime();
function AdminBackupPage() {
	const [backups, setBackups] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [creatingDb, setCreatingDb] = (0, import_react.useState)(false);
	const [creatingFiles, setCreatingFiles] = (0, import_react.useState)(false);
	const [filterType, setFilterType] = (0, import_react.useState)("all");
	const [confirmModal, setConfirmModal] = (0, import_react.useState)({
		isOpen: false,
		title: "",
		description: "",
		variant: "warning",
		confirmText: "Confirm",
		onConfirm: async () => {}
	});
	const [actionLoading, setActionLoading] = (0, import_react.useState)(false);
	const dbFileInputRef = (0, import_react.useRef)(null);
	const filesInputRef = (0, import_react.useRef)(null);
	async function loadData() {
		setLoading(true);
		try {
			const res = await backupApi.list();
			if (res.ok) {
				setBackups(res.backups || []);
				setStats(res.stats || null);
			}
		} catch (e) {
			toast.error(e?.message || "Failed to load backups list");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	async function handleCreateDb() {
		setCreatingDb(true);
		try {
			const res = await backupApi.createDb();
			toast.success(res.message || `Database backup created! (${res.size})`);
			await loadData();
		} catch (e) {
			toast.error(e?.message || "Failed to create database backup");
		} finally {
			setCreatingDb(false);
		}
	}
	async function handleCreateFiles() {
		setCreatingFiles(true);
		try {
			const res = await backupApi.createFiles();
			toast.success(res.message || `Images backup created! (${res.files_count} files, ${res.size})`);
			await loadData();
		} catch (e) {
			toast.error(e?.message || "Failed to create media backup");
		} finally {
			setCreatingFiles(false);
		}
	}
	async function handleDownload(item) {
		try {
			toast.loading(`Downloading ${item.filename}...`, { id: "download" });
			await backupApi.download(item.filename);
			toast.success("Download started!", { id: "download" });
		} catch (e) {
			toast.error(e?.message || "Download failed", { id: "download" });
		}
	}
	function confirmRestoreServer(item) {
		const isDb = item.type === "database";
		setConfirmModal({
			isOpen: true,
			title: isDb ? "Restore Database" : "Restore Media & Images",
			description: isDb ? "Warning: Restoring the database will overwrite current tables and records with the data from this backup file. Are you sure you want to proceed?" : "Warning: Restoring media will extract and overwrite files in public/uploads with files from this archive. Are you sure?",
			detail: `File: ${item.filename} (${item.size})`,
			variant: "danger",
			confirmText: "Yes, Restore Now",
			onConfirm: async () => {
				setActionLoading(true);
				try {
					if (isDb) {
						const res = await backupApi.restoreDb({ filename: item.filename });
						toast.success(res.message || "Database restored successfully!");
					} else {
						const res = await backupApi.restoreFiles({ filename: item.filename });
						toast.success(res.message || "Media images restored successfully!");
					}
					setConfirmModal((prev) => ({
						...prev,
						isOpen: false
					}));
					await loadData();
				} catch (e) {
					toast.error(e?.message || "Restore operation failed");
				} finally {
					setActionLoading(false);
				}
			}
		});
	}
	function confirmDelete(item) {
		setConfirmModal({
			isOpen: true,
			title: "Delete Backup File",
			description: "Are you sure you want to permanently delete this backup file? This action cannot be undone.",
			detail: `${item.filename} (${item.size})`,
			variant: "danger",
			confirmText: "Delete File",
			onConfirm: async () => {
				setActionLoading(true);
				try {
					const res = await backupApi.delete(item.filename);
					toast.success(res.message || "Backup deleted successfully");
					setConfirmModal((prev) => ({
						...prev,
						isOpen: false
					}));
					await loadData();
				} catch (e) {
					toast.error(e?.message || "Failed to delete backup");
				} finally {
					setActionLoading(false);
				}
			}
		});
	}
	async function handleFileUpload(file, type) {
		const isDb = type === "database";
		setConfirmModal({
			isOpen: true,
			title: isDb ? "Restore Database from Upload" : "Restore Images from Upload",
			description: isDb ? `You are about to restore the database using uploaded file "${file.name}". Current database tables will be updated. Proceed?` : `You are about to restore uploaded archive "${file.name}" into public/uploads/. Existing images with same names will be overwritten. Proceed?`,
			detail: `Upload: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
			variant: "danger",
			confirmText: "Upload & Restore",
			onConfirm: async () => {
				setActionLoading(true);
				try {
					if (isDb) {
						const res = await backupApi.restoreDb({ file });
						toast.success(res.message || "Database restored successfully from uploaded file!");
					} else {
						const res = await backupApi.restoreFiles({ file });
						toast.success(res.message || "Media images restored successfully from uploaded archive!");
					}
					setConfirmModal((prev) => ({
						...prev,
						isOpen: false
					}));
					await loadData();
				} catch (e) {
					toast.error(e?.message || "Restore from upload failed");
				} finally {
					setActionLoading(false);
					if (dbFileInputRef.current) dbFileInputRef.current.value = "";
					if (filesInputRef.current) filesInputRef.current.value = "";
				}
			}
		});
	}
	const filteredBackups = backups.filter((b) => {
		if (filterType === "all") return true;
		return b.type === filterType;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Backup & Restore",
				description: "Dynamic 1-click database SQL backup, uploads media ZIP archive, and safe restoration.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: loadData,
					disabled: loading,
					className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 " + (loading ? "animate-spin" : "") }), " Refresh"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Database Size",
						value: stats ? `${stats.db_size_mb} MB` : "—",
						hint: "MySQL live database tables",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-5 w-5 text-indigo-500" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Uploads & Images Storage",
						value: stats?.uploads_size || "—",
						hint: `${stats?.uploads_files_count?.toLocaleString() || 0} product images & media`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-5 w-5 text-emerald-500" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Saved Backups",
						value: stats ? `${stats.total_backups} files` : "—",
						hint: `Total storage: ${stats?.total_backup_size || "0 MB"}`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-5 w-5 text-amber-500" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold text-foreground",
							children: "Database Backup & Restore"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Dynamic SQL dump of all schemas, products, orders & settings."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleCreateDb,
							disabled: creatingDb,
							className: "flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-50",
							children: creatingDb ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Exporting Database..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4" }), " Create Database Backup (.sql)"] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: dbFileInputRef,
								type: "file",
								accept: ".sql",
								className: "hidden",
								onChange: (e) => {
									const file = e.target.files?.[0];
									if (file) handleFileUpload(file, "database");
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => dbFileInputRef.current?.click(),
								className: "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 text-indigo-500" }), " Upload & Restore .SQL File"]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-5 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold text-foreground",
							children: "Media & Images Backup & Restore"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Zip archive of all product photos, brand logos, banners & uploads."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleCreateFiles,
							disabled: creatingFiles,
							className: "flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50",
							children: creatingFiles ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Packing Images Archive..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderArchive, { className: "h-4 w-4" }), " Create Images Backup (.zip)"] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: filesInputRef,
								type: "file",
								accept: ".zip",
								className: "hidden",
								onChange: (e) => {
									const file = e.target.files?.[0];
									if (file) handleFileUpload(file, "files");
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => filesInputRef.current?.click(),
								className: "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5 text-emerald-500" }), " Upload & Restore .ZIP Archive"]
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold text-foreground",
						children: "Backup Files on Server"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Stored securely in backend storage. Download or restore anytime."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-lg bg-muted p-1 text-xs font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilterType("all"),
								className: `rounded-md px-3 py-1.5 transition-all ${filterType === "all" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
								children: [
									"All (",
									backups.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilterType("database"),
								className: `rounded-md px-3 py-1.5 transition-all ${filterType === "database" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
								children: [
									"Database (",
									backups.filter((b) => b.type === "database").length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilterType("files"),
								className: `rounded-md px-3 py-1.5 transition-all ${filterType === "files" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground hover:text-foreground"}`,
								children: [
									"Images (",
									backups.filter((b) => b.type === "files").length,
									")"
								]
							})
						]
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-16 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm",
						children: "Loading backup files..."
					})]
				}) : filteredBackups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No backup files yet",
						description: "Click 'Create Database Backup' or 'Create Images Backup' above to generate your first backup.",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-10 w-10 text-muted-foreground/60" })
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Filename"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4",
									children: "Date Created"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: filteredBackups.map((item) => {
								const isDb = item.type === "database";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "transition-colors hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${isDb ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`,
												children: [isDb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCodeCorner, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" }), isDb ? "Database SQL" : "Images ZIP"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 font-mono text-xs font-medium text-foreground",
											children: item.filename
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 text-muted-foreground whitespace-nowrap",
											children: item.size
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 text-muted-foreground whitespace-nowrap",
											children: item.created_at
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-3.5 px-4 text-right whitespace-nowrap",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => handleDownload(item),
														title: "Download to PC",
														className: "inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-primary" }), " Download"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => confirmRestoreServer(item),
														title: "Restore this backup",
														className: "inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/10 dark:text-amber-400",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Restore"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => confirmDelete(item),
														title: "Delete backup",
														className: "inline-flex items-center rounded-md border border-border bg-card p-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											})
										})
									]
								}, item.filename);
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-900 dark:text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-semibold",
					children: "Important Backup & Restore Instructions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs leading-relaxed opacity-90",
					children: [
						"• Database backups contain exact MySQL table definitions and data. Restoring an SQL backup will update all tables with the backup contents.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"• Image backups package all product, store, brand, and category media into a unified `.zip` file.",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"• Backups are safely saved in backend storage and protected from direct unauthorized browser access."
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				isOpen: confirmModal.isOpen,
				onClose: () => {
					if (!actionLoading) setConfirmModal((prev) => ({
						...prev,
						isOpen: false
					}));
				},
				onConfirm: confirmModal.onConfirm,
				title: confirmModal.title,
				description: confirmModal.description,
				detail: confirmModal.detail,
				variant: confirmModal.variant,
				confirmText: confirmModal.confirmText,
				isLoading: actionLoading
			})
		]
	});
}
//#endregion
export { AdminBackupPage as component };
