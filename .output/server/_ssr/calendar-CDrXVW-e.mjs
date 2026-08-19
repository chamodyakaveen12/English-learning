import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as useStore, l as minutesFmt, o as folderLabel, u as today } from "./router-BT7oMHeH.mjs";
import { _ as ChevronRight, v as ChevronLeft } from "../_libs/lucide-react.mjs";
import { n as Button, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Input } from "./input-C01gOcV-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-CDrXVW-e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CalendarPage() {
	const { db } = useStore();
	const now = /* @__PURE__ */ new Date();
	const [ym, setYm] = (0, import_react.useState)({
		y: now.getFullYear(),
		m: now.getMonth()
	});
	const [selected, setSelected] = (0, import_react.useState)(today());
	const days = (0, import_react.useMemo)(() => {
		const first = new Date(ym.y, ym.m, 1);
		const start = new Date(first);
		start.setDate(1 - (first.getDay() + 6) % 7);
		return Array.from({ length: 42 }, (_, i) => {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			return {
				iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
				day: d.getDate(),
				inMonth: d.getMonth() === ym.m
			};
		});
	}, [ym]);
	const stats = (iso) => ({
		collected: db.words.filter((w) => w.createdAt === iso).length,
		due: db.words.filter((w) => w.due === iso).length,
		minutes: db.logs.filter((l) => l.date === iso).reduce((s, l) => s + l.minutes, 0)
	});
	const sel = stats(selected);
	const monthName = new Date(ym.y, ym.m).toLocaleString("en", {
		month: "long",
		year: "numeric"
	});
	const months = Array.from({ length: 12 }, (_, i) => new Date(2e3, i).toLocaleString("en", { month: "long" }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Calendar",
		subtitle: "One calendar for words, reviews and study activity.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[1.6fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: monthName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Previous month",
								onClick: () => setYm(({ y, m }) => m === 0 ? {
									y: y - 1,
									m: 11
								} : {
									y,
									m: m - 1
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Next month",
								onClick: () => setYm(({ y, m }) => m === 11 ? {
									y: y + 1,
									m: 0
								} : {
									y,
									m: m + 1
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Jump to month",
								value: ym.m,
								onChange: (e) => setYm((p) => ({
									...p,
									m: Number(e.target.value)
								})),
								className: "h-9 rounded-md border border-border bg-background px-2 text-sm",
								children: months.map((mn, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: i,
									children: mn
								}, mn))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								"aria-label": "Jump to year",
								className: "h-9 w-24",
								value: ym.y,
								onChange: (e) => setYm((p) => ({
									...p,
									y: Number(e.target.value) || p.y
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								"aria-label": "Jump to date",
								className: "h-9 w-44",
								value: selected,
								onChange: (e) => {
									const iso = e.target.value;
									if (!iso) return;
									setSelected(iso);
									const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
									setYm({
										y: d.getFullYear(),
										m: d.getMonth()
									});
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: () => {
									const t = today();
									setSelected(t);
									const d = /* @__PURE__ */ new Date(t + "T00:00:00");
									setYm({
										y: d.getFullYear(),
										m: d.getMonth()
									});
								},
								children: "Today"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-7 gap-1 text-center text-[11px] uppercase text-muted-foreground",
						children: [
							"Mon",
							"Tue",
							"Wed",
							"Thu",
							"Fri",
							"Sat",
							"Sun"
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: d }, d))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 grid grid-cols-7 gap-1",
						children: days.map((d) => {
							const s = stats(d.iso);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelected(d.iso),
								className: `h-[70px] rounded-lg border p-1 text-left text-xs transition-colors ${selected === d.iso ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/60"} ${d.inMonth ? "" : "opacity-40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: d.iso === today() ? "font-semibold text-primary" : "",
									children: d.day
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 flex flex-col gap-0.5",
									children: [
										s.collected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-accent",
											children: [
												"● ",
												s.collected,
												" new"
											]
										}) : null,
										s.due ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-primary",
											children: [
												"● ",
												s.due,
												" due"
											]
										}) : null,
										s.minutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: [
												"● ",
												s.minutes,
												"m"
											]
										}) : null
									]
								})]
							}, d.iso);
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: selected
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							sel.collected,
							" collected · ",
							sel.due,
							" due · ",
							minutesFmt(sel.minutes),
							" studied"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-sm uppercase tracking-wide text-muted-foreground",
						children: "Words collected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: [db.words.filter((w) => w.createdAt === selected).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "truncate",
							title: folderLabel(db.folders, w.folderId),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: w.word
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: ["— ", folderLabel(db.folders, w.folderId)]
								})
							]
						}, w.id)), sel.collected === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "None"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-sm uppercase tracking-wide text-muted-foreground",
						children: "Study activity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: [db.logs.filter((l) => l.date === selected).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							db.activityTypes.find((a) => a.id === l.typeId)?.name ?? "Activity",
							": ",
							l.minutes,
							" min"
						] }, l.id)), sel.minutes === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "Nothing logged"
						}) : null]
					})
				]
			})]
		})
	});
}
//#endregion
export { CalendarPage as component };
