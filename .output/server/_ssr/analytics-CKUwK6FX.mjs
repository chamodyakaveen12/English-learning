import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as useStore, l as minutesFmt, n as addDays, o as folderLabel, s as folderPath, u as today } from "./router-BT7oMHeH.mjs";
import { t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Label } from "./label-DgT5L6ow.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Kq7VaPVO.mjs";
import { a as Bar, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as Pie, r as YAxis, s as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-CKUwK6FX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)"
];
function AnalyticsPage() {
	const { db } = useStore();
	const [dim, setDim] = (0, import_react.useState)("folder");
	const breakdown = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		db.words.forEach((w) => {
			let key = "Unspecified";
			if (dim === "folder") key = folderPath(db.folders, w.folderId)[0]?.name ?? "Unfiled";
			else if (dim === "subfolder") key = folderLabel(db.folders, w.folderId);
			else if (dim === "difficulty") key = w.difficulty;
			else if (dim === "level") key = w.level;
			else if (dim === "source") key = w.source;
			else if (dim === "date") key = w.createdAt;
			else if (dim === "status") key = w.due <= today() ? "Due" : "Scheduled";
			else if (dim === "tag") key = w.tags[0] ?? "No tag";
			counts.set(key, (counts.get(key) ?? 0) + 1);
		});
		return Array.from(counts, ([name, value]) => ({
			name,
			value
		})).sort((a, b) => b.value - a.value);
	}, [
		db.words,
		db.folders,
		dim
	]);
	const timeSplit = (0, import_react.useMemo)(() => db.activityTypes.map((a) => ({
		name: a.name,
		value: db.logs.filter((l) => l.typeId === a.id).reduce((s, l) => s + l.minutes, 0)
	})).filter((x) => x.value > 0), [db]);
	const trend = (0, import_react.useMemo)(() => Array.from({ length: 7 }, (_, i) => {
		const d = addDays(today(), i - 6);
		return {
			day: d.slice(5),
			words: db.words.filter((w) => w.createdAt === d).length
		};
	}), [db.words]);
	const minutesIn = (fromISO) => db.logs.filter((l) => l.date >= fromISO).reduce((s, l) => s + l.minutes, 0);
	const due = db.words.filter((w) => w.due <= today()).length;
	const completed = db.words.filter((w) => (w.history ?? []).some((h) => h.date === today())).length;
	const rate = due + completed ? Math.round(completed / (due + completed) * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Analytics",
		subtitle: "Choose your own breakdown — nothing is predefined.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				["Today", minutesIn(today())],
				["This week", minutesIn(addDays(today(), -6))],
				["This month", minutesIn(addDays(today(), -29))]
			].map(([l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-muted-foreground",
					children: l
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-3xl",
					children: minutesFmt(v)
				})]
			}, l))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl",
								children: "Vocabulary breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] uppercase text-muted-foreground",
									children: "Break down by"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: dim,
									onValueChange: setDim,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-44",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "folder",
											children: "Folder"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "subfolder",
											children: "Subfolder path"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "difficulty",
											children: "Difficulty"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "level",
											children: "English level"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "source",
											children: "Source"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "date",
											children: "Date collected"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "status",
											children: "Review status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "tag",
											children: "Tag"
										})
									] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: breakdown,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 50,
								outerRadius: 90,
								children: breakdown.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} })] }) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1 text-sm",
							children: breakdown.slice(0, 8).map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2.5 shrink-0 rounded-full",
										style: { background: COLORS[i % COLORS.length] }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 flex-1 truncate",
										title: b.name,
										children: b.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: b.value
									})
								]
							}, b.name))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "English time allocation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: timeSplit,
								dataKey: "value",
								nameKey: "name",
								outerRadius: 90,
								children: timeSplit.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} })] }) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: timeSplit.length ? timeSplit.map((t) => `${t.name} ${t.value}m`).join(" · ") : "Log some activity to see the split."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Collection trend (7 days)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: trend,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									stroke: "var(--muted-foreground)",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									allowDecimals: false,
									stroke: "var(--muted-foreground)",
									fontSize: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "words",
									fill: "var(--chart-1)",
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						}) })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl",
							children: "Review completion"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Due today" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: due + completed })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Completed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: completed })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remaining" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: due })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Completion rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [rate, "%"] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-2 rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${rate}%` }
							})
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { AnalyticsPage as component };
