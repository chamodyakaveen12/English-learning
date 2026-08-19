import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as uid, f as useStore, l as minutesFmt, u as today } from "./router-BT7oMHeH.mjs";
import { n as Button, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Input } from "./input-C01gOcV-.mjs";
import { t as Label } from "./label-DgT5L6ow.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Kq7VaPVO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/focus-Dtj0EQQe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FocusPage() {
	const { db, update } = useStore();
	const [typeId, setTypeId] = (0, import_react.useState)(db.activityTypes[0]?.id ?? "");
	const [task, setTask] = (0, import_react.useState)("Vocabulary review");
	const [duration, setDuration] = (0, import_react.useState)(25);
	const [left, setLeft] = (0, import_react.useState)(0);
	const [running, setRunning] = (0, import_react.useState)(false);
	const doneRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!running) return;
		const t = setInterval(() => setLeft((s) => s > 0 ? s - 1 : 0), 1e3);
		return () => clearInterval(t);
	}, [running]);
	(0, import_react.useEffect)(() => {
		if (running && left === 0 && !doneRef.current) {
			doneRef.current = true;
			setRunning(false);
			update((d) => d.logs.push({
				id: uid(),
				date: today(),
				typeId,
				minutes: duration,
				note: `Focus: ${task}`
			}));
		}
	}, [
		left,
		running,
		duration,
		typeId,
		task,
		update
	]);
	const start = () => {
		doneRef.current = false;
		setLeft(duration * 60);
		setRunning(true);
	};
	const cancel = () => {
		setRunning(false);
		setLeft(0);
	};
	const sessions = db.logs.filter((l) => l.note?.startsWith("Focus:"));
	const totalFocus = sessions.reduce((s, l) => s + l.minutes, 0);
	const pct = running && duration ? 1 - left / (duration * 60) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Focus",
		subtitle: "Complete a session and the time is logged automatically.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[1fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid size-48 place-items-center rounded-full",
						style: { background: `conic-gradient(var(--primary) ${pct * 360}deg, var(--secondary) 0deg)` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-40 place-items-center rounded-full bg-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-4xl",
								children: [
									String(Math.floor(left / 60)).padStart(2, "0"),
									":",
									String(left % 60).padStart(2, "0")
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Task" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: task,
									onChange: (e) => setTask(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Counts as" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: typeId,
									onValueChange: setTypeId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.activityTypes.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: a.id,
										children: a.name
									}, a.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (minutes)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: duration,
									onChange: (e) => setDuration(Number(e.target.value) || 1)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex justify-center gap-2",
						children: running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: cancel,
							children: "Give up"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: start,
							children: "🌱 Start focus session"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl",
						children: "Focus history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							sessions.length,
							" sessions · ",
							minutesFmt(totalFocus),
							" focused"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm",
						children: [sessions.slice().reverse().map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3 border-b border-border/60 pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate",
								children: ["🌳 ", l.note?.replace("Focus: ", "")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-muted-foreground",
								children: [
									l.date,
									" · ",
									l.minutes,
									"m"
								]
							})]
						}, l.id)), sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "No completed sessions yet."
						}) : null]
					})
				]
			})]
		})
	});
}
//#endregion
export { FocusPage as component };
