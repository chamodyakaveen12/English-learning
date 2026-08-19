import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as isDescendant, d as uid, f as useStore, i as descendantIds, o as folderLabel } from "./router-BT7oMHeH.mjs";
import { _ as ChevronRight, c as Pencil, h as Copy, m as FolderPlus, n as Trash2, u as MoveRight, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Input } from "./input-C01gOcV-.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Kq7VaPVO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/folders-7SKw24tl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FoldersPage() {
	const { db, update } = useStore();
	const [expanded, setExpanded] = (0, import_react.useState)({});
	const [newName, setNewName] = (0, import_react.useState)("");
	const [target, setTarget] = (0, import_react.useState)("root");
	const children = (parentId) => db.folders.filter((f) => f.parentId === parentId);
	const wordCount = (id) => {
		const ids = descendantIds(db.folders, id);
		return db.words.filter((w) => w.folderId && ids.includes(w.folderId)).length;
	};
	const addFolder = () => {
		if (!newName.trim()) return;
		update((d) => d.folders.push({
			id: uid(),
			name: newName.trim(),
			parentId: target === "root" ? null : target
		}));
		setNewName("");
	};
	const rename = (f) => {
		const name = window.prompt("Rename folder", f.name);
		if (name?.trim()) update((d) => {
			const x = d.folders.find((y) => y.id === f.id);
			if (x) x.name = name.trim();
		});
	};
	const remove = (f) => {
		if (!window.confirm(`Delete "${f.name}" and its subfolders? Words inside become Unfiled.`)) return;
		update((d) => {
			const ids = descendantIds(d.folders, f.id);
			d.folders = d.folders.filter((x) => !ids.includes(x.id));
			d.words.forEach((w) => {
				if (w.folderId && ids.includes(w.folderId)) w.folderId = null;
			});
		});
	};
	const moveTo = (f, copy) => {
		const options = [{
			id: "root",
			label: "Top level"
		}, ...db.folders.filter((x) => !isDescendant(db.folders, x.id, f.id)).map((x) => ({
			id: x.id,
			label: folderLabel(db.folders, x.id)
		}))];
		const answer = window.prompt(`${copy ? "Copy" : "Move"} "${f.name}" into which folder? Type the number:\n` + options.map((o, i) => `${i + 1}. ${o.label}`).join("\n"));
		const dest = options[Number(answer) - 1];
		if (!dest) return;
		const destId = dest.id === "root" ? null : dest.id;
		update((d) => {
			if (!copy) {
				const x = d.folders.find((y) => y.id === f.id);
				if (x) x.parentId = destId;
				return;
			}
			const map = /* @__PURE__ */ new Map();
			const clone = (srcId, parentId) => {
				const src = d.folders.find((y) => y.id === srcId);
				const nid = uid();
				map.set(srcId, nid);
				d.folders.push({
					id: nid,
					name: src.name,
					parentId
				});
				d.folders.filter((y) => y.parentId === srcId).forEach((c) => clone(c.id, nid));
			};
			clone(f.id, destId);
			d.words.filter((w) => w.folderId && map.has(w.folderId)).forEach((w) => d.words.push({
				...w,
				id: uid(),
				folderId: map.get(w.folderId),
				history: [...w.history]
			}));
		});
	};
	const Row = ({ f, depth }) => {
		const kids = children(f.id);
		const open = expanded[f.id] ?? depth < 1;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60",
			style: { paddingLeft: depth * 18 + 8 },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-muted-foreground",
					onClick: () => setExpanded((e) => ({
						...e,
						[f.id]: !open
					})),
					"aria-label": "Toggle",
					children: kids.length ? open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate",
					title: folderLabel(db.folders, f.id),
					children: f.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground",
					children: wordCount(f.id)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "Rename",
							onClick: () => rename(f),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "Move",
							onClick: () => moveTo(f, false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveRight, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "Copy",
							onClick: () => moveTo(f, true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							"aria-label": "Delete",
							onClick: () => remove(f),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})
					]
				})
			]
		}), open && kids.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: kids.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
			f: k,
			depth: depth + 1
		}, k.id)) }) : null] });
	};
	const unfiled = db.words.filter((w) => !w.folderId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Folders",
		subtitle: "Unlimited hierarchy — create, rename, move, copy or delete anything.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel mb-5 flex flex-wrap items-end gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "min-w-[200px] flex-1",
					value: newName,
					onChange: (e) => setNewName(e.target.value),
					placeholder: "New folder name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: target,
					onValueChange: setTarget,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "min-w-[220px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
						className: "max-w-[min(90vw,30rem)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "root",
							children: "Top level"
						}), db.folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: f.id,
							title: folderLabel(db.folders, f.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block max-w-[26rem] truncate",
								children: folderLabel(db.folders, f.id)
							})
						}, f.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: addFolder,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "size-4" }), " Create folder"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-xl",
						children: "Hierarchy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: children(null).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						f,
						depth: 0
					}, f.id)) }),
					db.folders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No folders yet — create your first one above."
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-2 text-xl",
					children: [
						"Unfiled words (",
						unfiled.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2",
					children: [unfiled.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate",
							children: w.word
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: "none",
							onValueChange: (v) => update((d) => {
								const x = d.words.find((y) => y.id === w.id);
								if (x) x.folderId = v;
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Move to…" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "max-w-[min(90vw,30rem)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "none",
									disabled: true,
									children: "Move to…"
								}), db.folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: f.id,
									title: folderLabel(db.folders, f.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block max-w-[24rem] truncate",
										children: folderLabel(db.folders, f.id)
									})
								}, f.id))]
							})]
						})]
					}, w.id)), unfiled.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Everything is filed."
					}) : null]
				})]
			})]
		})]
	});
}
//#endregion
export { FoldersPage as component };
