import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as emptyDB, f as useStore } from "./router-BT7oMHeH.mjs";
import { n as Button, r as cn, t as AppShell } from "./AppShell-CFm2OfI6.mjs";
import { t as Input } from "./input-C01gOcV-.mjs";
import { t as Label } from "./label-DgT5L6ow.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DmWcs6lJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function DropdownEditor({ label, dkey }) {
	const { db, update } = useStore();
	const [val, setVal] = (0, import_react.useState)("");
	const items = db.settings.dropdowns[dkey];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex max-w-full items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs",
					title: it,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "max-w-[16rem] truncate",
						children: it
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": `Remove ${it}`,
						className: "text-muted-foreground hover:text-destructive",
						onClick: () => update((d) => {
							d.settings.dropdowns[dkey] = d.settings.dropdowns[dkey].filter((x) => x !== it);
						}),
						children: "×"
					})]
				}, it))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: val,
					onChange: (e) => setVal(e.target.value),
					placeholder: `Add ${label.toLowerCase()} option`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => {
						if (!val.trim()) return;
						update((d) => d.settings.dropdowns[dkey].push(val.trim()));
						setVal("");
					},
					children: "Add"
				})]
			})
		]
	});
}
function SettingsPage() {
	const { db, update, reset } = useStore();
	const fileRef = (0, import_react.useRef)(null);
	const s = db.settings;
	const downloadBackup = () => {
		const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `english-os-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const restoreBackup = async (file) => {
		try {
			const parsed = JSON.parse(await file.text());
			if (!Array.isArray(parsed.words) || !Array.isArray(parsed.folders)) {
				window.alert("That file does not look like an English OS backup.");
				return;
			}
			if (!window.confirm("Replace all current data with this backup?")) return;
			update((d) => Object.assign(d, emptyDB(), parsed));
		} catch {
			window.alert("Could not read that backup file.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Customization",
		subtitle: "Names, schedules and reminders — all yours.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg",
							children: "Review schedule (days)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-2",
							children: s.schedule.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "w-24 shrink-0 text-sm",
										children: ["Review ", i + 1]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										className: "w-24",
										value: d,
										onChange: (e) => update((db2) => {
											db2.settings.schedule[i] = Number(e.target.value) || 1;
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => update((db2) => {
											db2.settings.schedule.splice(i, 1);
										}),
										children: "Remove"
									})
								]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							variant: "secondary",
							onClick: () => update((db2) => db2.settings.schedule.push((db2.settings.schedule.at(-1) ?? 1) * 2)),
							children: "Add interval"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg",
						children: "Reminders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "w-40",
									children: "Reminder time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "time",
									className: "w-32",
									value: s.reminder.time,
									onChange: (e) => update((d) => {
										d.settings.reminder.time = e.target.value;
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Remind me when words are due" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: s.reminder.onDue,
									onCheckedChange: (v) => update((d) => {
										d.settings.reminder.onDue = v;
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Remind me if I have not studied today" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: s.reminder.onIdle,
									onCheckedChange: (v) => update((d) => {
										d.settings.reminder.onIdle = v;
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "w-40",
										children: "Only if more than"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										className: "w-24",
										value: s.reminder.threshold,
										onChange: (e) => update((d) => {
											d.settings.reminder.threshold = Number(e.target.value) || 0;
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground",
										children: "words are due"
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownEditor, {
					label: "Difficulty",
					dkey: "difficulty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownEditor, {
					label: "English level",
					dkey: "level"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownEditor, {
					label: "Source",
					dkey: "source"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownEditor, {
					label: "Connection types",
					dkey: "linkTypes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg",
							children: "Data"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Everything is stored privately in this browser. Download a backup regularly — that .json file is your only fully portable copy until you move the data to the cloud."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: downloadBackup,
									children: "Download backup (.json)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => fileRef.current?.click(),
									children: "Restore from backup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "destructive",
									onClick: () => {
										if (window.confirm("Reset all data?")) reset();
									},
									children: "Reset all data"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "application/json,.json",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								e.target.value = "";
								if (f) restoreBackup(f);
							}
						})
					]
				})
			]
		})
	});
}
//#endregion
export { SettingsPage as component };
