import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as uid, f as useStore, l as minutesFmt, u as today } from "./router-BT7oMHeH.mjs";
import { n as Trash2, s as Plus } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Input } from "./input-C01gOcV-.mjs";
import { t as Label } from "./label-DgT5L6ow.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Kq7VaPVO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-DB98ftjL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ActivityPage() {
	const { db, update } = useStore();
	const [date, setDate] = (0, import_react.useState)(today());
	const [typeId, setTypeId] = (0, import_react.useState)(db.activityTypes[0]?.id ?? "");
	const [minutes, setMinutes] = (0, import_react.useState)("30");
	const [newType, setNewType] = (0, import_react.useState)("");
	const logs = db.logs.filter((l) => l.date === date);
	const total = logs.reduce((s, l) => s + l.minutes, 0);
	const blocks = db.blocks.filter((b) => b.date === date);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Activity Tracker",
		subtitle: "Every minute you log here flows into the calendar and analytics.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel mb-5 flex flex-wrap items-end gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] uppercase text-muted-foreground",
						children: "Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] uppercase text-muted-foreground",
						children: "Activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: typeId,
						onValueChange: setTypeId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "min-w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.activityTypes.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: a.id,
							children: a.name
						}, a.id)) })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] uppercase text-muted-foreground",
						children: "Minutes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						className: "w-28",
						value: minutes,
						onChange: (e) => setMinutes(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						const m = Number(minutes);
						if (!typeId || !m) return;
						update((d) => d.logs.push({
							id: uid(),
							date,
							typeId,
							minutes: m
						}));
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Log time"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl",
						children: [
							date,
							" — ",
							minutesFmt(total)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: [db.activityTypes.map((a) => {
							const m = logs.filter((l) => l.typeId === a.id).reduce((s, l) => s + l.minutes, 0);
							if (!m) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [m, " min"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 h-1.5 rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary",
									style: { width: `${total ? m / total * 100 : 0}%` }
								})
							})] }, a.id);
						}), total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "Nothing logged for this day."
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm uppercase tracking-wide text-muted-foreground",
						children: "Entries"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1 truncate",
								children: [
									db.activityTypes.find((a) => a.id === l.typeId)?.name,
									" · ",
									l.minutes,
									" min",
									l.note ? ` · ${l.note}` : ""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Delete entry",
								onClick: () => update((d) => {
									d.logs = d.logs.filter((x) => x.id !== l.id);
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})]
						}, l.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm uppercase tracking-wide text-muted-foreground",
						children: "Custom activities"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: db.activityTypes.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs",
							children: [a.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": `Delete ${a.name}`,
								className: "text-muted-foreground hover:text-destructive",
								onClick: () => update((d) => {
									d.activityTypes = d.activityTypes.filter((x) => x.id !== a.id);
								}),
								children: "×"
							})]
						}, a.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: newType,
							onChange: (e) => setNewType(e.target.value),
							placeholder: "Add activity (e.g. Shadowing)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								if (!newType.trim()) return;
								update((d) => d.activityTypes.push({
									id: uid(),
									name: newType.trim()
								}));
								setNewType("");
							},
							children: "Add"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "24-hour tracker"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Assign each hour. English hours count towards your totals."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 max-h-[520px] space-y-1 overflow-y-auto pr-1",
						children: Array.from({ length: 24 }, (_, h) => {
							const block = blocks.find((b) => b.hour === h);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-12 shrink-0 text-xs text-muted-foreground",
										children: [String(h).padStart(2, "0"), ":00"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "h-8 flex-1",
										placeholder: "—",
										defaultValue: block?.label ?? "",
										onBlur: (e) => {
											const label = e.target.value;
											update((d) => {
												const ex = d.blocks.find((b) => b.date === date && b.hour === h);
												if (ex) ex.label = label;
												else d.blocks.push({
													id: uid(),
													date,
													hour: h,
													label,
													typeId: null
												});
											});
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: block?.typeId ?? "none",
										onValueChange: (v) => update((d) => {
											const tid = v === "none" ? null : v;
											const ex = d.blocks.find((b) => b.date === date && b.hour === h);
											if (ex) ex.typeId = tid;
											else d.blocks.push({
												id: uid(),
												date,
												hour: h,
												label: "",
												typeId: tid
											});
											d.logs = d.logs.filter((l) => !(l.date === date && l.id === `blk-${date}-${h}`));
											if (tid) d.logs.push({
												id: `blk-${date}-${h}`,
												date,
												typeId: tid,
												minutes: 60,
												note: "24h tracker"
											});
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-8 w-36 shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Not English" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											children: "Not English"
										}), db.activityTypes.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: a.id,
											children: a.name
										}, a.id))] })]
									})
								]
							}, h);
						})
					})
				]
			})]
		})]
	});
}
//#endregion
export { ActivityPage as component };
