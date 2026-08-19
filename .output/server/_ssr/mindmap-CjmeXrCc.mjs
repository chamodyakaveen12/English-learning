import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as uid, f as useStore, i as descendantIds, o as folderLabel } from "./router-BT7oMHeH.mjs";
import { n as Trash2 } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Input } from "./input-C01gOcV-.mjs";
import { t as Label } from "./label-DgT5L6ow.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Kq7VaPVO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mindmap-CjmeXrCc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ANY = "__any__";
function MindMapPage() {
	const { db, update } = useStore();
	const [folder, setFolder] = (0, import_react.useState)(ANY);
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [view, setView] = (0, import_react.useState)("full");
	const [a, setA] = (0, import_react.useState)("");
	const [b, setB] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)(db.settings.dropdowns.linkTypes[0] ?? "related to");
	const { nodes, edges } = (0, import_react.useMemo)(() => {
		const scope = folder === ANY ? null : descendantIds(db.folders, folder);
		const depthOf = (id) => folderLabel(db.folders, id).split(" → ").length;
		const maxDepth = view === "main" ? 1 : view === "sub" ? 2 : 99;
		const folders = db.folders.filter((f) => (!scope || scope.includes(f.id)) && depthOf(f.id) <= maxDepth);
		const words = db.words.filter((w) => {
			if (scope && !(w.folderId && scope.includes(w.folderId))) return false;
			if (from && w.createdAt < from) return false;
			if (to && w.createdAt > to) return false;
			return true;
		});
		const levels = [];
		if (view !== "words") {
			levels.push([{
				id: "root",
				label: "English",
				kind: "root",
				parent: null
			}]);
			let depth = 1;
			while (depth <= maxDepth) {
				const row = folders.filter((f) => depthOf(f.id) === depth).map((f) => ({
					id: f.id,
					label: f.name,
					kind: "folder",
					parent: f.parentId ?? "root"
				}));
				if (!row.length) break;
				levels.push(row);
				depth++;
			}
		}
		if (view === "full" || view === "words") levels.push(words.map((w) => ({
			id: w.id,
			label: w.word,
			kind: "word",
			parent: view === "words" ? null : w.folderId ?? "root"
		})));
		const width = 1e3;
		const rowH = 120;
		const ns = [];
		const es = [];
		const pos = /* @__PURE__ */ new Map();
		levels.forEach((row, li) => {
			row.forEach((n, i) => {
				const node = {
					id: n.id,
					label: n.label,
					kind: n.kind,
					x: (i + 1) * width / (row.length + 1),
					y: 60 + li * rowH
				};
				ns.push(node);
				pos.set(n.id, node);
			});
		});
		levels.forEach((row) => row.forEach((n) => {
			if (!n.parent) return;
			const p = pos.get(n.parent);
			const c = pos.get(n.id);
			if (p && c) es.push({
				x1: p.x,
				y1: p.y + 12,
				x2: c.x,
				y2: c.y - 12
			});
		}));
		db.links.forEach((l) => {
			const p = pos.get(l.a);
			const c = pos.get(l.b);
			if (p && c) es.push({
				x1: p.x,
				y1: p.y,
				x2: c.x,
				y2: c.y,
				dashed: true,
				label: l.type
			});
		});
		return {
			nodes: ns,
			edges: es,
			height: 60 + levels.length * rowH
		};
	}, [
		db,
		folder,
		from,
		to,
		view
	]);
	const height = 80 + Math.max(...nodes.map((n) => n.y), 200);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mind Map",
		subtitle: "Folder hierarchy plus your own word-to-word connections.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid min-w-0 gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[11px] uppercase text-muted-foreground",
							children: "Folder"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: folder,
							onValueChange: setFolder,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "max-w-[min(90vw,30rem)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: ANY,
									children: "All folders"
								}), db.folders.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: f.id,
									title: folderLabel(db.folders, f.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block max-w-[26rem] truncate",
										children: folderLabel(db.folders, f.id)
									})
								}, f.id))]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[11px] uppercase text-muted-foreground",
							children: "View level"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: view,
							onValueChange: (v) => setView(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "main",
									children: "Main folders only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "sub",
									children: "Main + subfolders"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "full",
									children: "Full hierarchy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "words",
									children: "Words only"
								})
							] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[11px] uppercase text-muted-foreground",
							children: "Date from"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: from,
							onChange: (e) => setFrom(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-[11px] uppercase text-muted-foreground",
							children: "Date to"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: to,
							onChange: (e) => setTo(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel overflow-x-auto p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `0 0 1000 ${height}`,
					className: "min-w-[900px]",
					style: { height },
					children: [edges.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: e.x1,
						y1: e.y1,
						x2: e.x2,
						y2: e.y2,
						stroke: e.dashed ? "var(--accent)" : "var(--border)",
						strokeWidth: e.dashed ? 1.5 : 1,
						strokeDasharray: e.dashed ? "5 4" : void 0
					}), e.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: (e.x1 + e.x2) / 2,
						y: (e.y1 + e.y2) / 2 - 4,
						textAnchor: "middle",
						fontSize: "10",
						fill: "var(--muted-foreground)",
						children: e.label
					}) : null] }, i)), nodes.map((n) => {
						const w = Math.min(180, Math.max(60, n.label.length * 8 + 20));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: n.x - w / 2,
							y: n.y - 13,
							width: w,
							height: 26,
							rx: 13,
							fill: n.kind === "word" ? "var(--card)" : n.kind === "root" ? "var(--primary)" : "var(--secondary)",
							stroke: n.kind === "word" ? "var(--accent)" : "var(--border)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
							x: n.x,
							y: n.y + 4,
							textAnchor: "middle",
							fontSize: "12",
							fill: n.kind === "root" ? "var(--primary-foreground)" : "var(--foreground)",
							children: [n.label.length > 20 ? n.label.slice(0, 19) + "…" : n.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: n.label })]
						})] }, n.id);
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-5 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Word connections"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: a,
								onValueChange: setA,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "min-w-[160px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Word A" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: w.id,
									children: w.word
								}, w.id)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: type,
								onValueChange: setType,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "min-w-[150px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.settings.dropdowns.linkTypes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: t,
									children: t
								}, t)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: b,
								onValueChange: setB,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "min-w-[160px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Word B" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: w.id,
									children: w.word
								}, w.id)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: !a || !b || a === b,
								onClick: () => update((d) => d.links.push({
									id: uid(),
									a,
									b,
									type
								})),
								children: "Connect"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: [db.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1 truncate",
								children: [
									db.words.find((w) => w.id === l.a)?.word ?? "?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"— ",
											l.type,
											" —"
										]
									}),
									" ",
									db.words.find((w) => w.id === l.b)?.word ?? "?"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Remove connection",
								onClick: () => update((d) => {
									d.links = d.links.filter((x) => x.id !== l.id);
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						}, l.id)), db.links.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "No connections yet."
						}) : null]
					})
				]
			})
		]
	});
}
//#endregion
export { MindMapPage as component };
