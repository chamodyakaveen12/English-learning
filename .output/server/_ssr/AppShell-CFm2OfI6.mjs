import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as useStore, u as today } from "./router-BT7oMHeH.mjs";
import { S as CalendarDays, a as Settings2, d as Library, f as LayoutDashboard, i as Sprout, l as Network, o as RotateCcw, p as FolderTree, r as Timer, x as ChartPie } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-CFm2OfI6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function ReviewReminder() {
	const { db, ready } = useStore();
	const [dismissed, setDismissed] = (0, import_react.useState)(true);
	const due = db.words.filter((w) => w.due <= today()).length;
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const key = "english-os-reminder-" + today();
		if (localStorage.getItem(key)) return;
		setDismissed(false);
	}, [ready]);
	if (dismissed || !db.settings.reminder.onDue || due === 0) return null;
	const close = () => {
		localStorage.setItem("english-os-reminder-" + today(), "1");
		setDismissed(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-5 right-5 z-50 w-[320px] panel p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg",
				children: "Vocabulary review reminder"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Today you have ",
					due,
					" word",
					due === 1 ? "" : "s",
					" ready for review."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/review",
						children: "Review now"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: close,
					children: "Later"
				})]
			})
		]
	});
}
var nav = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/library",
		label: "Word Library",
		icon: Library
	},
	{
		to: "/folders",
		label: "Folders",
		icon: FolderTree
	},
	{
		to: "/mindmap",
		label: "Mind Map",
		icon: Network
	},
	{
		to: "/calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		to: "/review",
		label: "Review",
		icon: RotateCcw
	},
	{
		to: "/activity",
		label: "Activity",
		icon: Timer
	},
	{
		to: "/focus",
		label: "Focus",
		icon: Sprout
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartPie
	},
	{
		to: "/settings",
		label: "Customization",
		icon: Settings2
	}
];
function AppShell({ title, subtitle, children }) {
	const { db } = useStore();
	const due = db.words.filter((w) => w.due <= today()).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen lg:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "lg:sticky lg:top-0 lg:h-screen lg:w-60 shrink-0 border-b border-border bg-sidebar/80 backdrop-blur lg:border-b-0 lg:border-r",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-lg",
						children: "E"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-base",
							children: "English OS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "personal learning system"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible",
					children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						activeOptions: { exact: n.to === "/" },
						activeProps: { className: "bg-sidebar-accent text-sidebar-accent-foreground" },
						className: "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "size-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label }),
							n.to === "/review" && due > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground",
								children: due
							}) : null
						]
					}, n.to))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-w-0 flex-1 px-5 py-7 lg:px-9",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl",
						children: title
					}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: subtitle
					}) : null]
				}), children]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewReminder, {})
		]
	});
}
//#endregion
export { Button as n, cn as r, AppShell as t };
