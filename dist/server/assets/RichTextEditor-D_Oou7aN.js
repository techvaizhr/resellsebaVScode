import { l as validateAndCompress, r as supabase } from "./client-Be051lUg.js";
import { useEffect, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Bold, Heading2, Heading3, Image, Italic, Link, List, ListOrdered, Minus, Quote, Redo2, Strikethrough, Undo2 } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image$1 from "@tiptap/extension-image";
import Link$1 from "@tiptap/extension-link";
//#region src/components/RichTextEditor.tsx
function Btn({ onClick, active, disabled, children, title }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		title,
		onClick,
		disabled,
		className: `inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-foreground/80 transition hover:border-border hover:bg-muted hover:text-foreground disabled:opacity-40 ${active ? "border-primary/30 bg-primary/15 text-primary" : ""}`,
		children
	});
}
function RichTextEditor({ value, onChange, placeholder = "Product er bistarito description likhun…", uploadFolder = "descriptions" }) {
	const fileRef = useRef(null);
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [2, 3],
					HTMLAttributes: { class: "font-semibold" }
				},
				bulletList: { HTMLAttributes: { class: "list-disc pl-6 my-2" } },
				orderedList: { HTMLAttributes: { class: "list-decimal pl-6 my-2" } },
				listItem: { HTMLAttributes: { class: "my-1" } },
				blockquote: { HTMLAttributes: { class: "border-l-4 border-muted pl-3 italic my-2" } }
			}),
			Image$1.configure({ HTMLAttributes: { class: "rounded-md my-2 max-w-full h-auto" } }),
			Link$1.configure({
				openOnClick: false,
				HTMLAttributes: { class: "text-primary underline" }
			})
		],
		content: value || "",
		editorProps: { attributes: { class: "max-w-none min-h-[220px] px-3 py-3 focus:outline-none text-sm leading-relaxed" } },
		onUpdate: ({ editor }) => onChange(editor.getHTML())
	});
	/** Keep the editor in sync when `value` arrives/changes from outside (duplicate, async prefill). */
	useEffect(() => {
		if (!editor) return;
		const next = value || "";
		if (next !== editor.getHTML()) editor.commands.setContent(next, { emitUpdate: false });
	}, [value, editor]);
	if (!editor) return null;
	async function insertImage(files) {
		if (!files?.length || !editor) return;
		try {
			const f = files[0];
			const compressed = await validateAndCompress(f);
			const path = `${uploadFolder.replace(/\/+$/, "")}/${crypto.randomUUID()}.webp`;
			const { error } = await supabase.storage.from("product-images").upload(path, compressed.blob, {
				contentType: "image/webp",
				cacheControl: "31536000"
			});
			if (error) throw error;
			const { data: signed } = await supabase.storage.from("product-images").createSignedUrl(path, 3600 * 24 * 365 * 5);
			if (signed?.signedUrl) editor.chain().focus().setImage({ src: signed.signedUrl }).run();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Image insert failed");
		} finally {
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	function addLink() {
		const prev = editor.getAttributes("link").href;
		const url = window.prompt("Link URL", prev ?? "https://");
		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	}
	const e = editor;
	return /* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-md border bg-background",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-0.5 border-b bg-muted/60 p-1",
				children: [
					/* @__PURE__ */ jsx(Btn, {
						title: "Heading 2",
						onClick: () => e.chain().focus().toggleHeading({ level: 2 }).run(),
						active: e.isActive("heading", { level: 2 }),
						children: /* @__PURE__ */ jsx(Heading2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Heading 3",
						onClick: () => e.chain().focus().toggleHeading({ level: 3 }).run(),
						active: e.isActive("heading", { level: 3 }),
						children: /* @__PURE__ */ jsx(Heading3, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx("div", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ jsx(Btn, {
						title: "Bold",
						onClick: () => e.chain().focus().toggleBold().run(),
						active: e.isActive("bold"),
						children: /* @__PURE__ */ jsx(Bold, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Italic",
						onClick: () => e.chain().focus().toggleItalic().run(),
						active: e.isActive("italic"),
						children: /* @__PURE__ */ jsx(Italic, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Strike",
						onClick: () => e.chain().focus().toggleStrike().run(),
						active: e.isActive("strike"),
						children: /* @__PURE__ */ jsx(Strikethrough, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx("div", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ jsx(Btn, {
						title: "Bullet list",
						onClick: () => e.chain().focus().toggleBulletList().run(),
						active: e.isActive("bulletList"),
						children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Numbered list",
						onClick: () => e.chain().focus().toggleOrderedList().run(),
						active: e.isActive("orderedList"),
						children: /* @__PURE__ */ jsx(ListOrdered, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Quote",
						onClick: () => e.chain().focus().toggleBlockquote().run(),
						active: e.isActive("blockquote"),
						children: /* @__PURE__ */ jsx(Quote, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Divider",
						onClick: () => e.chain().focus().setHorizontalRule().run(),
						children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx("div", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ jsx(Btn, {
						title: "Link",
						onClick: addLink,
						active: e.isActive("link"),
						children: /* @__PURE__ */ jsx(Link, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Image",
						onClick: () => fileRef.current?.click(),
						children: /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx("div", { className: "mx-1 h-5 w-px bg-border" }),
					/* @__PURE__ */ jsx(Btn, {
						title: "Undo",
						onClick: () => e.chain().focus().undo().run(),
						disabled: !e.can().undo(),
						children: /* @__PURE__ */ jsx(Undo2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						title: "Redo",
						onClick: () => e.chain().focus().redo().run(),
						disabled: !e.can().redo(),
						children: /* @__PURE__ */ jsx(Redo2, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ jsx(EditorContent, {
				editor,
				placeholder
			}),
			/* @__PURE__ */ jsx("input", {
				ref: fileRef,
				type: "file",
				accept: "image/jpeg,image/png,image/webp,image/gif",
				className: "hidden",
				onChange: (ev) => insertImage(ev.target.files)
			})
		]
	});
}
//#endregion
export { RichTextEditor as t };
