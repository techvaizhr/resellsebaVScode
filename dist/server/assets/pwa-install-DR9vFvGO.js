import { t as cn } from "./utils-C_uf36nf.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Download, MoreVertical, Share2, X } from "lucide-react";
//#region src/components/pwa-install.tsx
var deferredPrompt = null;
var listeners = /* @__PURE__ */ new Set();
if (typeof window !== "undefined") {
	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		deferredPrompt = e;
		listeners.forEach((cb) => cb(true));
	});
	window.addEventListener("appinstalled", () => {
		deferredPrompt = null;
		listeners.forEach((cb) => cb(false));
	});
}
/**
* Hook to track PWA install state and trigger 1-click install.
*/
function usePwaInstall() {
	const [canInstall, setCanInstall] = useState(!!deferredPrompt);
	const [installed, setInstalled] = useState(false);
	const [isIos, setIsIos] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);
	useEffect(() => {
		const isStandalone = window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
		if (isStandalone) setInstalled(true);
		const ua = window.navigator.userAgent.toLowerCase();
		const isIosDevice = /iphone|ipad|ipod/.test(ua);
		setIsIos(isIosDevice);
		if (deferredPrompt) setCanInstall(true);
		const listener = (state) => {
			setCanInstall(state);
			if (!state && isStandalone) setInstalled(true);
		};
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	}, []);
	const triggerInstall = async () => {
		if (deferredPrompt) try {
			await deferredPrompt.prompt();
			if ((await deferredPrompt.userChoice).outcome === "accepted") {
				deferredPrompt = null;
				setCanInstall(false);
				setInstalled(true);
				return true;
			}
		} catch (err) {
			console.warn("PWA prompt error:", err);
		}
		setShowInstructions(true);
		return false;
	};
	return {
		canInstall,
		installed,
		isIos,
		triggerInstall,
		showInstructions,
		setShowInstructions
	};
}
/**
* PWA Install Instructions Modal for iOS and browsers where native prompt isn't directly triggered.
*/
function PwaInstructionModal({ isOpen, onClose, isIos, onPromptInstall, canInstall }) {
	if (!isOpen) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ jsx("img", {
						src: "/favicon.ico",
						alt: "ResellSeba Icon",
						className: "h-12 w-12 rounded-xl border border-border bg-background p-1 shadow-sm"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-foreground",
						children: "ResellSeba App"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: "সরাসরি আপনার মোবাইল বা কম্পিউটারে ইন্সটল করুন"
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 space-y-4 text-sm text-foreground",
					children: [canInstall ? /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-primary/20 bg-primary/5 p-4 text-center",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground mb-3",
							children: "নিচের বাটনে ক্লিক করে এক ক্লিকে সরাসরি অ্যাপটি ইন্সটল করুন:"
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => {
								onPromptInstall();
								onClose();
							},
							className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90",
							children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " ১-ক্লিকে অ্যাপ ইন্সটল করুন"]
						})]
					}) : isIos ? /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-muted/30 p-4 space-y-2.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 font-semibold text-xs text-primary",
							children: [/* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }), " iPhone বা iPad-এ ইন্সটল করার নিয়ম:"]
						}), /* @__PURE__ */ jsxs("ol", {
							className: "list-decimal pl-5 space-y-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [
									"Safari ব্রাউজারের নিচে থাকা ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "Share (শেয়ার)"
									}),
									" ",
									"আইকনে চাপ দিন।"
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									"মেনু স্ক্রল করে ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "\"Add to Home Screen\" (+)"
									}),
									" অপশনটিতে চাপ দিন।"
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									"উপরে ডানপাশে ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "\"Add\""
									}),
									" বাটনে ট্যাপ করলেই অ্যাপটি হোম স্ক্রিনে সেভ হয়ে যাবে।"
								] })
							]
						})]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-muted/30 p-4 space-y-2.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 font-semibold text-xs text-primary",
							children: [/* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }), " Android ও Chrome-এ ইন্সটল করার নিয়ম:"]
						}), /* @__PURE__ */ jsxs("ol", {
							className: "list-decimal pl-5 space-y-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [
									"ব্রাউজারের উপরে ডানদিকের ৩-ডট মেনু ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "(⋮)"
									}),
									" চাপুন।"
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "\"Install app\""
									}),
									" বা",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "\"Add to Home screen\""
									}),
									" অপশনে ক্লিক করুন।"
								] }),
								/* @__PURE__ */ jsxs("li", { children: [
									"কনফার্ম করার জন্য ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "\"Install\""
									}),
									" চাপুন।"
								] })
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-2 pt-2 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ jsx("span", { children: "০ মেগাবাইট স্টোরেজ খরচ" })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ jsx("span", { children: "সরাসরি ফুল স্ক্রিন মোড" })]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 flex justify-end",
					children: /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted",
						children: "বন্ধ করুন"
					})
				})
			]
		})
	});
}
/**
* Standard PWA Install Button (renders inline, icon, or footer block).
*/
function PwaInstallButton({ className, variant = "inline", label = "অ্যাপ ইন্সটল করুন" }) {
	const { canInstall, installed, isIos, triggerInstall, showInstructions, setShowInstructions } = usePwaInstall();
	if (installed) {
		if (variant === "footer" || variant === "inline") return /* @__PURE__ */ jsxs("span", {
			className: cn("inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400", className),
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5" }), " অ্যাপ ইন্সটল করা আছে"]
		});
		return null;
	}
	if (variant === "footer") return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		onClick: triggerInstall,
		role: "button",
		tabIndex: 0,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") triggerInstall();
		},
		className: cn("group relative flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-3.5 text-left transition-all hover:border-primary/40 hover:bg-primary/10 cursor-pointer", className),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx("img", {
				src: "/favicon.ico",
				alt: "App Favicon",
				className: "h-9 w-9 rounded-lg border border-border bg-background p-1 shadow-xs transition-transform group-hover:scale-105"
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-bold text-foreground",
					children: label
				}), /* @__PURE__ */ jsx("span", {
					className: "rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-semibold text-primary",
					children: "1-Click"
				})]
			}), /* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Android, iOS ও PC তে সহজে ব্যবহার করুন"
			})] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-110",
			children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" })
		})]
	}), /* @__PURE__ */ jsx(PwaInstructionModal, {
		isOpen: showInstructions,
		onClose: () => setShowInstructions(false),
		isIos,
		onPromptInstall: triggerInstall,
		canInstall
	})] });
	if (variant === "inline") return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick: triggerInstall,
		className: cn("inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary shadow-2xs", className),
		children: [
			/* @__PURE__ */ jsx("img", {
				src: "/favicon.ico",
				alt: "Icon",
				className: "h-4 w-4 rounded-sm"
			}),
			/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5 text-primary" }),
			/* @__PURE__ */ jsx("span", { children: label })
		]
	}), /* @__PURE__ */ jsx(PwaInstructionModal, {
		isOpen: showInstructions,
		onClose: () => setShowInstructions(false),
		isIos,
		onPromptInstall: triggerInstall,
		canInstall
	})] });
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: triggerInstall,
		title: label,
		"aria-label": label,
		className: cn("relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-primary", className),
		children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" })
	}), /* @__PURE__ */ jsx(PwaInstructionModal, {
		isOpen: showInstructions,
		onClose: () => setShowInstructions(false),
		isIos,
		onPromptInstall: triggerInstall,
		canInstall
	})] });
}
/**
* High-Converting PWA Footer Box for use in platform or storefront footers.
*/
function PwaFooterOption({ className, title = "ResellSeba মোবাইল অ্যাপ", subtitle = "দ্রুত ও সহজে অর্ডার এবং ব্যবসা পরিচালনার জন্য অ্যাপ ইন্সটল করুন" }) {
	const { canInstall, installed, isIos, triggerInstall, showInstructions, setShowInstructions } = usePwaInstall();
	if (installed) return /* @__PURE__ */ jsxs("div", {
		className: cn("flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400", className),
		children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "অ্যাপ আপনার ডিভাইসে সক্রিয় রয়েছে" })]
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 rounded-xl border border-border bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-card shadow-xs", className),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: "relative grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20",
				children: /* @__PURE__ */ jsx("img", {
					src: "/favicon.ico",
					alt: "Favicon App Icon",
					className: "h-6 w-6 rounded"
				})
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h4", {
				className: "text-sm font-bold text-foreground flex items-center gap-2",
				children: [title, /* @__PURE__ */ jsx("span", {
					className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400",
					children: "PWA Fast"
				})]
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: subtitle
			})] })]
		}), /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: triggerInstall,
			className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-95 shrink-0",
			children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "অ্যাপ ইন্সটল করুন (1-Click)" })]
		})]
	}), /* @__PURE__ */ jsx(PwaInstructionModal, {
		isOpen: showInstructions,
		onClose: () => setShowInstructions(false),
		isIos,
		onPromptInstall: triggerInstall,
		canInstall
	})] });
}
//#endregion
export { PwaInstallButton as n, PwaFooterOption as t };
