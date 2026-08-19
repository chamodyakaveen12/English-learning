import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as useStore, i as descendantIds, o as folderLabel, u as today } from "./router-BT7oMHeH.mjs";
import { c as Pencil, n as Trash2, s as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Input } from "./input-C01gOcV-.mjs";
import { t as Label } from "./label-DgT5L6ow.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Kq7VaPVO.mjs";
import { t as WordDialog } from "./WordDialog-BVwrlWY6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-bx9ZjyH_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ANY = "__any__";
function LibraryPage() {
	const { db, update } = useStore();
	const [q, setQ] = (0, import_react.useState)("");
	const [folder, setFolder] = (0, import_react.useState)(ANY);
	const [difficulty, setDifficulty] = (0, import_react.useState)(ANY);
	const [level, setLevel] = (0, import_react.useState)(ANY);
	const [source, setSource] = (0, import_react.useState)(ANY);
	const [tag, setTag] = (0, import_react.useState)(ANY);
	const [status, setStatus] = (0, import_react.useState)(ANY);
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const tags = (0, import_react.useMemo)(() => Array.from(new Set(db.words.flatMap((w) => w.tags))), [db.words]);
	const words = (0, import_react.useMemo)(() => {
		const scope = folder === ANY ? null : descendantIds(db.folders, folder);
		return db.words.filter((w) => {
			if (q && !`${w.word} ${w.meaning} ${w.example}`.toLowerCase().includes(q.toLowerCase())) return false;
			if (scope && !(w.folderId && scope.includes(w.folderId))) return false;
			if (difficulty !== ANY && w.difficulty !== difficulty) return false;
			if (level !== ANY && w.level !== level) return false;
			if (source !== ANY && w.source !== source) return false;
			if (tag !== ANY && !w.tags.includes(tag)) return false;
			if (status === "due" && !(w.due <= today())) return false;
			if (status === "scheduled" && w.due <= today()) return false;
			if (status === "new" && w.stage !== 0) return false;
			if (from && w.createdAt < from) return false;
			if (to && w.createdAt > to) return false;
			return true;
		});
	}, [
		db.words,
		db.folders,
		q,
		folder,
		difficulty,
		level,
		source,
		tag,
		status,
		from,
		to
	]);
	const clear = () => {
		setQ("");
		setFolder(ANY);
		setDifficulty(ANY);
		setLevel(ANY);
		setSource(ANY);
		setTag(ANY);
		setStatus(ANY);
		setFrom("");
		setTo("");
	};
	const dd = db.settings.dropdowns;
	const Filter = ({ label, value, onChange, options }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-w-0 gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-[11px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value,
			onValueChange: onChange,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
				className: "max-w-[min(90vw,30rem)]",
				children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: o.v,
					title: o.l,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block max-w-[26rem] truncate",
						children: o.l
					})
				}, o.v))
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Word Library",
		subtitle: `${words.length} of ${db.words.length} words shown`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mb-5 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid min-w-[220px] flex-1 gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-[11px] uppercase tracking-wide text-muted-foreground",
								children: "Search"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search word, meaning or example…"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								setEditing(null);
								setOpen(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add word"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
								label: "Folder / subfolder",
								value: folder,
								onChange: setFolder,
								options: [{
									v: ANY,
									l: "All folders"
								}, ...db.folders.map((f) => ({
									v: f.id,
									l: folderLabel(db.folders, f.id)
								}))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
								label: "Difficulty",
								value: difficulty,
								onChange: setDifficulty,
								options: [{
									v: ANY,
									l: "Any"
								}, ...dd.difficulty.map((d) => ({
									v: d,
									l: d
								}))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
								label: "English level",
								value: level,
								onChange: setLevel,
								options: [{
									v: ANY,
									l: "Any"
								}, ...dd.level.map((d) => ({
									v: d,
									l: d
								}))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
								label: "Source",
								value: source,
								onChange: setSource,
								options: [{
									v: ANY,
									l: "Any"
								}, ...dd.source.map((d) => ({
									v: d,
									l: d
								}))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
								label: "Tag",
								value: tag,
								onChange: setTag,
								options: [{
									v: ANY,
									l: "Any"
								}, ...tags.map((d) => ({
									v: d,
									l: d
								}))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
								label: "Review status",
								value: status,
								onChange: setStatus,
								options: [
									{
										v: ANY,
										l: "Any"
									},
									{
										v: "due",
										l: "Due now"
									},
									{
										v: "scheduled",
										l: "Scheduled"
									},
									{
										v: "new",
										l: "New / stage 0"
									}
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] uppercase tracking-wide text-muted-foreground",
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
									className: "text-[11px] uppercase tracking-wide text-muted-foreground",
									children: "Date to"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: to,
									onChange: (e) => setTo(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "mt-3",
						onClick: clear,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }), " Clear filters"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
				children: [words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "panel flex flex-col gap-2 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl leading-tight",
								children: w.word
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => {
										setEditing(w);
										setOpen(true);
									},
									"aria-label": "Edit word",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									"aria-label": "Delete word",
									onClick: () => update((d) => {
										d.words = d.words.filter((x) => x.id !== w.id);
										d.links = d.links.filter((l) => l.a !== w.id && l.b !== w.id);
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: w.meaning
						}),
						w.example ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm italic text-foreground/70",
							children: [
								"“",
								w.example,
								"”"
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-accent",
							title: folderLabel(db.folders, w.folderId),
							children: folderLabel(db.folders, w.folderId)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto flex flex-wrap gap-1.5 pt-2 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2 py-0.5",
									children: w.createdAt
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2 py-0.5",
									children: w.difficulty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2 py-0.5",
									children: w.level
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2 py-0.5",
									children: w.source
								}),
								w.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-primary/15 px-2 py-0.5 text-primary",
									children: ["#", t]
								}, t))
							]
						})
					]
				}, w.id)), words.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No words match these filters."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordDialog, {
				open,
				onOpenChange: setOpen,
				word: editing
			})
		]
	});
}
//#endregion
export { LibraryPage as component };
