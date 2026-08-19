import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import "../_libs/@libsql/client+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BT7oMHeH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-DMD3LPm3.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
console.log("🔍 DATABASE_URL:", "❌ Missing");
console.log("🔍 TURSO_AUTH_TOKEN:", "❌ Missing");
console.log("⚠️ Turso client not created (server-side or missing credentials)");
async function query(sql, params = []) {
	try {
		console.warn("⚠️ Turso client not available, returning empty result");
		return [];
	} catch (error) {
		console.error("❌ Database query error:", error);
		return [];
	}
}
async function queryOne(sql, params = []) {
	try {
		console.warn("⚠️ Turso client not available, returning null");
		return null;
	} catch (error) {
		console.error("❌ Database query error:", error);
		return null;
	}
}
var uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
var today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var addDays = (iso, n) => {
	const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
	d.setDate(d.getDate() + n);
	return d.toISOString().slice(0, 10);
};
function emptyDB() {
	return {
		words: [],
		folders: [],
		links: [],
		activityTypes: [
			{
				id: "a-voc",
				name: "Vocabulary"
			},
			{
				id: "a-read",
				name: "Reading"
			},
			{
				id: "a-write",
				name: "Writing"
			},
			{
				id: "a-listen",
				name: "Listening"
			},
			{
				id: "a-speak",
				name: "Speaking"
			},
			{
				id: "a-gram",
				name: "Grammar"
			}
		],
		logs: [],
		blocks: [],
		settings: {
			schedule: [
				1,
				2,
				4,
				7,
				14,
				30
			],
			dropdowns: {
				difficulty: [
					"Again",
					"Hard",
					"Good",
					"Easy"
				],
				level: [
					"A1",
					"A2",
					"B1",
					"B2",
					"C1",
					"C2"
				],
				source: [
					"Book",
					"Movie",
					"YouTube",
					"University",
					"Conversation",
					"News"
				],
				linkTypes: [
					"related to",
					"similar meaning",
					"opposite of",
					"same topic"
				]
			},
			reminder: {
				time: "20:00",
				onDue: true,
				threshold: 10,
				onIdle: true
			}
		}
	};
}
function seedDB() {
	const db = emptyDB();
	const mk = (name, parentId) => {
		const f = {
			id: uid(),
			name,
			parentId
		};
		db.folders.push(f);
		return f.id;
	};
	const cima = mk("CIMA", null);
	const ma = mk("Management Accounting", cima);
	const budg = mk("Budgeting", ma);
	mk("Costing", ma);
	const idioms = mk("Idioms", mk("Daily English", null));
	const suits = mk("Suits", mk("TV Series", null));
	[
		[
			"Allocate",
			"To distribute something for a particular purpose",
			"The manager allocated resources to the project.",
			budg,
			"Hard",
			"University",
			["Finance", "Work"]
		],
		[
			"Variance",
			"The difference between planned and actual results",
			"The team analysed the cost variance.",
			budg,
			"Good",
			"University",
			["Finance"]
		],
		[
			"Forecast",
			"To predict a future figure or trend",
			"We forecast a rise in demand.",
			budg,
			"Good",
			"Book",
			["Finance"]
		],
		[
			"Prudent",
			"Acting with care and thought for the future",
			"A prudent approach to spending.",
			cima,
			"Hard",
			"News",
			["Important"]
		],
		[
			"Hit the ground running",
			"To start something quickly and successfully",
			"She hit the ground running in her new role.",
			idioms,
			"Again",
			"Conversation",
			["Idiom"]
		],
		[
			"Leverage",
			"To use something to maximum advantage",
			"They leveraged their network to close the deal.",
			suits,
			"Easy",
			"Movie",
			["Work"]
		],
		[
			"Compelling",
			"Evoking strong interest or conviction",
			"He made a compelling argument.",
			suits,
			"Good",
			"Movie",
			[]
		]
	].forEach(([w, m, ex, folderId, difficulty, source, tags], i) => {
		const created = addDays(today(), -i);
		db.words.push({
			id: uid(),
			word: w,
			meaning: m,
			example: ex,
			folderId,
			tags,
			difficulty,
			level: "B2",
			source,
			createdAt: created,
			due: addDays(today(), i % 3 === 0 ? 0 : i - 2),
			stage: i % 3,
			history: []
		});
	});
	db.links.push({
		id: uid(),
		a: db.words[0].id,
		b: db.words[2].id,
		type: "same topic"
	});
	db.logs.push({
		id: uid(),
		date: today(),
		typeId: "a-voc",
		minutes: 30
	}, {
		id: uid(),
		date: today(),
		typeId: "a-read",
		minutes: 45
	}, {
		id: uid(),
		date: addDays(today(), -1),
		typeId: "a-speak",
		minutes: 20
	});
	return db;
}
function folderPath(folders, id) {
	const out = [];
	let cur = folders.find((f) => f.id === id);
	while (cur) {
		out.unshift(cur);
		cur = folders.find((f) => f.id === cur.parentId) ?? void 0;
	}
	return out;
}
function folderLabel(folders, id) {
	if (!id) return "Unfiled";
	return folderPath(folders, id).map((f) => f.name).join(" → ") || "Unfiled";
}
function descendantIds(folders, id) {
	const out = [id];
	const walk = (parent) => {
		folders.filter((f) => f.parentId === parent).forEach((f) => {
			out.push(f.id);
			walk(f.id);
		});
	};
	walk(id);
	return out;
}
function isDescendant(folders, candidate, ancestor) {
	return descendantIds(folders, ancestor).includes(candidate);
}
function applyReview(w, rating, schedule) {
	let stage = w.stage;
	if (rating === "Again") stage = 0;
	else if (rating === "Hard") stage = Math.max(0, stage);
	else if (rating === "Good") stage = stage + 1;
	else stage = stage + 2;
	let days = schedule[Math.min(stage, schedule.length - 1)] ?? 1;
	if (rating === "Again") days = 0;
	if (rating === "Hard") days = Math.max(1, Math.round(days / 2));
	w.stage = stage;
	w.difficulty = rating;
	w.due = addDays(today(), days);
	w.history = [...w.history ?? [], {
		date: today(),
		rating
	}];
	return w;
}
var minutesFmt = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;
async function loadFromTurso() {
	const db = emptyDB();
	db.folders = await query("SELECT * FROM folders ORDER BY name");
	db.words = (await query("SELECT * FROM words ORDER BY word")).map((w) => ({
		...w,
		tags: JSON.parse(w.tags),
		history: JSON.parse(w.history)
	}));
	db.links = await query("SELECT * FROM word_links");
	db.activityTypes = await query("SELECT * FROM activity_types ORDER BY name");
	db.logs = await query("SELECT * FROM activity_logs ORDER BY log_date DESC");
	db.blocks = await query("SELECT * FROM day_blocks ORDER BY block_date, hour");
	const settings = await queryOne("SELECT schedule, dropdowns, reminder FROM settings WHERE id = 1");
	if (settings) db.settings = {
		schedule: JSON.parse(settings.schedule),
		dropdowns: JSON.parse(settings.dropdowns),
		reminder: JSON.parse(settings.reminder)
	};
	return db;
}
async function saveToTurso(db) {
	await db.execute("DELETE FROM folders");
	await db.execute("DELETE FROM words");
	await db.execute("DELETE FROM word_links");
	await db.execute("DELETE FROM activity_types");
	await db.execute("DELETE FROM activity_logs");
	await db.execute("DELETE FROM day_blocks");
	await db.execute("DELETE FROM settings");
	for (const folder of db.folders) await db.execute({
		sql: "INSERT INTO folders (id, name, parent_id) VALUES (?, ?, ?)",
		args: [
			folder.id,
			folder.name,
			folder.parentId
		]
	});
	for (const word of db.words) await db.execute({
		sql: `INSERT INTO words (id, word, meaning, example, folder_id, tags, difficulty, level, source, created_at, due, stage, history) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			word.id,
			word.word,
			word.meaning,
			word.example,
			word.folderId,
			JSON.stringify(word.tags),
			word.difficulty,
			word.level,
			word.source,
			word.createdAt,
			word.due,
			word.stage,
			JSON.stringify(word.history)
		]
	});
	for (const link of db.links) await db.execute({
		sql: "INSERT INTO word_links (id, word_a_id, word_b_id, type) VALUES (?, ?, ?, ?)",
		args: [
			link.id,
			link.a,
			link.b,
			link.type
		]
	});
	for (const type of db.activityTypes) await db.execute({
		sql: "INSERT INTO activity_types (id, name) VALUES (?, ?)",
		args: [type.id, type.name]
	});
	for (const log of db.logs) await db.execute({
		sql: "INSERT INTO activity_logs (id, log_date, type_id, minutes, note) VALUES (?, ?, ?, ?, ?)",
		args: [
			log.id,
			log.date,
			log.typeId,
			log.minutes,
			log.note || null
		]
	});
	for (const block of db.blocks) await db.execute({
		sql: "INSERT INTO day_blocks (id, block_date, hour, label, type_id) VALUES (?, ?, ?, ?, ?)",
		args: [
			block.id,
			block.date,
			block.hour,
			block.label,
			block.typeId
		]
	});
	await db.execute({
		sql: "INSERT INTO settings (id, schedule, dropdowns, reminder) VALUES (1, ?, ?, ?)",
		args: [
			JSON.stringify(db.settings.schedule),
			JSON.stringify(db.settings.dropdowns),
			JSON.stringify(db.settings.reminder)
		]
	});
}
var StoreContext = (0, import_react.createContext)(null);
function StoreProvider({ children }) {
	const [db, setDb] = (0, import_react.useState)(() => emptyDB());
	const [ready, setReady] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const data = await loadFromTurso();
				if (data.words.length === 0 && data.folders.length === 0) {
					const seedData = seedDB();
					await saveToTurso(seedData);
					setDb(seedData);
				} else setDb(data);
			} catch (error) {
				console.error("Failed to load from Turso:", error);
				const seedData = seedDB();
				setDb(seedData);
			} finally {
				setLoading(false);
				setReady(true);
			}
		};
		loadData();
	}, []);
	const update = (0, import_react.useCallback)((fn) => {
		setDb((prev) => {
			const next = JSON.parse(JSON.stringify(prev));
			fn(next);
			saveToTurso(next).catch((error) => {
				console.error("Failed to save to Turso:", error);
			});
			return next;
		});
	}, []);
	const reset = (0, import_react.useCallback)(async () => {
		const fresh = seedDB();
		try {
			await saveToTurso(fresh);
			setDb(fresh);
		} catch (error) {
			console.error("Failed to reset database:", error);
		}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		db,
		ready,
		loading,
		update,
		reset
	}), [
		db,
		ready,
		loading,
		update,
		reset
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreContext.Provider, {
		value,
		children
	});
}
function useStore() {
	const ctx = (0, import_react.useContext)(StoreContext);
	if (!ctx) throw new Error("useStore must be used inside StoreProvider");
	return ctx;
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Personal English Learning OS" },
			{
				name: "description",
				content: "Collect English words, organise them in your own folders, review with spaced repetition and track your learning habits."
			},
			{
				property: "og:title",
				content: "Personal English Learning OS"
			},
			{
				property: "og:description",
				content: "Word library, folders, mind map, spaced repetition, habits and analytics in one system."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Outfit:wght@300;400;500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$9 = () => import("./routes-DnjB2lKm.mjs");
var Route$9 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Dashboard — Personal English Learning OS" },
		{
			name: "description",
			content: "Collect words, organise them in your own folders, review with spaced repetition and track your English habits."
		},
		{
			property: "og:title",
			content: "Personal English Learning OS"
		},
		{
			property: "og:description",
			content: "One connected system for vocabulary, folders, mind maps, review and habit analytics."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./activity-DB98ftjL.mjs");
var Route$8 = createFileRoute("/activity")({
	head: () => ({ meta: [
		{ title: "Activity Tracker — English Learning OS" },
		{
			name: "description",
			content: "Log reading, writing, speaking, listening, vocabulary or your own custom English activities, hour by hour."
		},
		{
			property: "og:title",
			content: "English Activity Tracker"
		},
		{
			property: "og:description",
			content: "Daily minutes plus a 24-hour day planner feeding straight into analytics."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./analytics-CKUwK6FX.mjs");
var Route$7 = createFileRoute("/analytics")({
	head: () => ({ meta: [
		{ title: "Analytics — English Learning OS" },
		{
			name: "description",
			content: "Custom breakdowns of your vocabulary, review performance and English time allocation."
		},
		{
			property: "og:title",
			content: "Learning Analytics"
		},
		{
			property: "og:description",
			content: "Break your vocabulary down by any field, and see where your English time goes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./calendar-CDrXVW-e.mjs");
var Route$6 = createFileRoute("/calendar")({
	head: () => ({ meta: [
		{ title: "Calendar — English Learning OS" },
		{
			name: "description",
			content: "Your English learning history day by day: words collected, reviews due and study time."
		},
		{
			property: "og:title",
			content: "Learning Calendar"
		},
		{
			property: "og:description",
			content: "Words collected, reviews due and study minutes on every day."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./focus-Dtj0EQQe.mjs");
var Route$5 = createFileRoute("/focus")({
	head: () => ({ meta: [
		{ title: "Focus — English Learning OS" },
		{
			name: "description",
			content: "Forest-style focus sessions that automatically log your English study time everywhere."
		},
		{
			property: "og:title",
			content: "Focus Sessions"
		},
		{
			property: "og:description",
			content: "Grow a session, finish it, and the minutes land in your tracker and analytics."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./folders-7SKw24tl.mjs");
var Route$4 = createFileRoute("/folders")({
	head: () => ({ meta: [
		{ title: "Folders — English Learning OS" },
		{
			name: "description",
			content: "Build your own unlimited folder and subfolder hierarchy, then move or copy words and whole folders freely."
		},
		{
			property: "og:title",
			content: "Custom Folder System"
		},
		{
			property: "og:description",
			content: "Unlimited nesting, rename, move and copy — no structure is forced on you."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./library-bx9ZjyH_.mjs");
var Route$3 = createFileRoute("/library")({
	head: () => ({ meta: [
		{ title: "Word Library — English Learning OS" },
		{
			name: "description",
			content: "Search, filter and manage every English word you have collected by folder, date, difficulty, tag and source."
		},
		{
			property: "og:title",
			content: "Word Library"
		},
		{
			property: "og:description",
			content: "Every word you collected, filterable by folder, date, difficulty, tag and source."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./mindmap-CjmeXrCc.mjs");
var Route$2 = createFileRoute("/mindmap")({
	head: () => ({ meta: [
		{ title: "Mind Map — English Learning OS" },
		{
			name: "description",
			content: "See your folder hierarchy and word-to-word relationships as one visual vocabulary map."
		},
		{
			property: "og:title",
			content: "Vocabulary Mind Map"
		},
		{
			property: "og:description",
			content: "Folder hierarchy plus manual word connections, filtered by folder and date."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./review-QpUJOyem.mjs");
var Route$1 = createFileRoute("/review")({
	head: () => ({ meta: [
		{ title: "Review — English Learning OS" },
		{
			name: "description",
			content: "Spaced repetition review with Again, Hard, Good and Easy on your own custom schedule."
		},
		{
			property: "og:title",
			content: "Spaced Repetition Review"
		},
		{
			property: "og:description",
			content: "Rate each word and the next review date adjusts automatically."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./settings-DmWcs6lJ.mjs");
var Route = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: "Customization — English Learning OS" },
		{
			name: "description",
			content: "Rename dropdowns, set your own review schedule and control reminders — nothing is fixed."
		},
		{
			property: "og:title",
			content: "Customization"
		},
		{
			property: "og:description",
			content: "Your dropdown names, review intervals and reminder rules, fully under your control."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	ActivityRoute: Route$8.update({
		id: "/activity",
		path: "/activity",
		getParentRoute: () => Route$10
	}),
	AnalyticsRoute: Route$7.update({
		id: "/analytics",
		path: "/analytics",
		getParentRoute: () => Route$10
	}),
	CalendarRoute: Route$6.update({
		id: "/calendar",
		path: "/calendar",
		getParentRoute: () => Route$10
	}),
	FocusRoute: Route$5.update({
		id: "/focus",
		path: "/focus",
		getParentRoute: () => Route$10
	}),
	FoldersRoute: Route$4.update({
		id: "/folders",
		path: "/folders",
		getParentRoute: () => Route$10
	}),
	LibraryRoute: Route$3.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$10
	}),
	MindmapRoute: Route$2.update({
		id: "/mindmap",
		path: "/mindmap",
		getParentRoute: () => Route$10
	}),
	ReviewRoute: Route$1.update({
		id: "/review",
		path: "/review",
		getParentRoute: () => Route$10
	}),
	SettingsRoute: Route.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { emptyDB as a, isDescendant as c, uid as d, useStore as f, descendantIds as i, minutesFmt as l, addDays as n, folderLabel as o, applyReview as r, folderPath as s, router_exports as t, today as u };
