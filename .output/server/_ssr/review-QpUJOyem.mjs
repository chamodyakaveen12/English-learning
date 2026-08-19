import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as useStore, o as folderLabel, r as applyReview, u as today } from "./router-BT7oMHeH.mjs";
import { n as Button, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/review-QpUJOyem.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RATINGS = [
	{
		key: "Again",
		cls: "bg-destructive text-destructive-foreground"
	},
	{
		key: "Hard",
		cls: "bg-chart-4 text-primary-foreground"
	},
	{
		key: "Good",
		cls: "bg-accent text-accent-foreground"
	},
	{
		key: "Easy",
		cls: "bg-chart-5 text-primary-foreground"
	}
];
function ReviewPage() {
	const { db, update } = useStore();
	const [i, setI] = (0, import_react.useState)(0);
	const [show, setShow] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(0);
	const queue = (0, import_react.useMemo)(() => db.words.filter((w) => w.due <= today()), [db.words]);
	const card = queue[i];
	const rate = (r) => {
		if (!card) return;
		update((d) => {
			const w = d.words.find((x) => x.id === card.id);
			if (w) applyReview(w, r, d.settings.schedule);
		});
		setShow(false);
		setDone((n) => n + 1);
		setI((n) => r === "Again" ? n + 1 : n);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Review",
		subtitle: `${queue.length} due · ${done} completed this session`,
		children: [!card ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "All caught up"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "No words are due right now. Come back after your next interval."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel mx-auto max-w-xl p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs uppercase tracking-wide text-muted-foreground",
					title: folderLabel(db.folders, card.folderId),
					children: folderLabel(db.folders, card.folderId)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl",
					children: card.word
				}),
				!show ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Can you remember the meaning?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					onClick: () => setShow(true),
					children: "Show answer"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base",
						children: card.meaning
					}),
					card.example ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm italic text-muted-foreground",
						children: [
							"“",
							card.example,
							"”"
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: RATINGS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => rate(r.key),
							className: `rounded-lg px-3 py-2 text-sm font-medium transition-opacity hover:opacity-90 ${r.cls}`,
							children: r.key
						}, r.key))
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel mt-6 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl",
				children: "Your schedule"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [db.settings.schedule.map((d, idx) => `Review ${idx + 1}: ${d}d`).join(" · "), " — change it in Customization."]
			})]
		})]
	});
}
//#endregion
export { ReviewPage as component };
