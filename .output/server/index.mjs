globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-14T12:07:03.073Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-14T12:13:20.826Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/activity-Cu6VFAl1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1595-+LDn/ZDA+oaG4jOTxLM8TultMBc\"",
		"mtime": "2026-08-19T11:56:34.187Z",
		"size": 5525,
		"path": "../public/assets/activity-Cu6VFAl1.js"
	},
	"/assets/calendar-CqznYb-p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1377-RzwE3o7M4nSnGgCXrKuu4ByZnw8\"",
		"mtime": "2026-08-19T11:56:36.013Z",
		"size": 4983,
		"path": "../public/assets/calendar-CqznYb-p.js"
	},
	"/assets/AppShell-DmkZ14AU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9766-JzfNhnpNy8BnIN77Oyy9BQypaRE\"",
		"mtime": "2026-08-19T11:56:33.982Z",
		"size": 38758,
		"path": "../public/assets/AppShell-DmkZ14AU.js"
	},
	"/assets/chevron-right-PSmi0gAu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a-uzpCZJQDhHljig10tXXaJ92i1JA\"",
		"mtime": "2026-08-19T11:56:36.031Z",
		"size": 122,
		"path": "../public/assets/chevron-right-PSmi0gAu.js"
	},
	"/assets/focus-DG0J1HgN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca9-zsGww2lw6UofBqDlIfBb9VQBbbY\"",
		"mtime": "2026-08-19T11:56:36.038Z",
		"size": 3241,
		"path": "../public/assets/focus-DG0J1HgN.js"
	},
	"/assets/dist-BZERhpHV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1558-rbZskgrPFA3+X8CU4zk+N5eLnMM\"",
		"mtime": "2026-08-19T11:56:36.038Z",
		"size": 5464,
		"path": "../public/assets/dist-BZERhpHV.js"
	},
	"/assets/folders-Ds3mSzdt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17a8-CkiS2SEDwEoMIpM82/obmQASQ3Q\"",
		"mtime": "2026-08-19T11:56:36.053Z",
		"size": 6056,
		"path": "../public/assets/folders-Ds3mSzdt.js"
	},
	"/assets/label-5MS9cvcU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2aa-Nl2Ukb11QJ4qMNUdsYKQNWmRiQ0\"",
		"mtime": "2026-08-19T11:56:36.076Z",
		"size": 682,
		"path": "../public/assets/label-5MS9cvcU.js"
	},
	"/assets/input-Dxu3xMyP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"265-YsXDT4CRSrB7d/r7CGsQ/R9Y7Jo\"",
		"mtime": "2026-08-19T11:56:36.076Z",
		"size": 613,
		"path": "../public/assets/input-Dxu3xMyP.js"
	},
	"/assets/mindmap-gi0aFeVC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"185e-mGqW98fQlDIprr7dY5RDJ++NvVE\"",
		"mtime": "2026-08-19T11:56:36.101Z",
		"size": 6238,
		"path": "../public/assets/mindmap-gi0aFeVC.js"
	},
	"/assets/library--cOyhWYQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"167c-9bhS+0iIFl3CeICYkVT4RvollVI\"",
		"mtime": "2026-08-19T11:56:36.085Z",
		"size": 5756,
		"path": "../public/assets/library--cOyhWYQ.js"
	},
	"/assets/plus-L31hKIPG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"91-2gsM69pO6fNICtGRWNdGM9vfc7E\"",
		"mtime": "2026-08-19T11:56:36.132Z",
		"size": 145,
		"path": "../public/assets/plus-L31hKIPG.js"
	},
	"/assets/review-BXDq3WTO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"958-UfzoP5LwU3zU0rro/VS3HileC0U\"",
		"mtime": "2026-08-19T11:56:36.132Z",
		"size": 2392,
		"path": "../public/assets/review-BXDq3WTO.js"
	},
	"/assets/routes-B_pWt4mV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cca-mER9BuzWQlpVG5I6T4KKsBJvrNQ\"",
		"mtime": "2026-08-19T11:56:36.238Z",
		"size": 3274,
		"path": "../public/assets/routes-B_pWt4mV.js"
	},
	"/assets/settings-D-H_CM5C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23fe-sugU03exaTKaNmx1cb+lJFNL7TQ\"",
		"mtime": "2026-08-19T11:56:36.447Z",
		"size": 9214,
		"path": "../public/assets/settings-D-H_CM5C.js"
	},
	"/assets/pencil-v0y1YBLo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10c-9XG/WLJjPEoFcEV2Ae23/HvFLsI\"",
		"mtime": "2026-08-19T11:56:36.119Z",
		"size": 268,
		"path": "../public/assets/pencil-v0y1YBLo.js"
	},
	"/assets/select-wwGtjUE4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13a85-+K2w0GA7S6k7OOmOWVt7fkO8BmE\"",
		"mtime": "2026-08-19T11:56:36.244Z",
		"size": 80517,
		"path": "../public/assets/select-wwGtjUE4.js"
	},
	"/assets/trash-2-DIG70uzq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-f9HpQ5fX/10GU5cTkDO8cLG9DIc\"",
		"mtime": "2026-08-19T11:56:36.479Z",
		"size": 320,
		"path": "../public/assets/trash-2-DIG70uzq.js"
	},
	"/assets/WordDialog-CA8sk_h2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b0b-I1SUiCabI03LMs26BoX/VNhGtac\"",
		"mtime": "2026-08-19T11:56:34.157Z",
		"size": 11019,
		"path": "../public/assets/WordDialog-CA8sk_h2.js"
	},
	"/assets/styles-DMD3LPm3.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13b7c-XNRT3/Cac8Pt2Dz17O4T7FmvO+I\"",
		"mtime": "2026-08-19T11:56:36.479Z",
		"size": 80764,
		"path": "../public/assets/styles-DMD3LPm3.css"
	},
	"/assets/analytics-DzGT2eFo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ffd9-mYmKpFqoHYG6Pti+MiInH9mw7x0\"",
		"mtime": "2026-08-19T11:56:34.205Z",
		"size": 393177,
		"path": "../public/assets/analytics-DzGT2eFo.js"
	},
	"/assets/index-WtGatl_n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5810e-kYaA6US1njzmbIAJBDHSRFTxelY\"",
		"mtime": "2026-08-19T11:56:32.334Z",
		"size": 360718,
		"path": "../public/assets/index-WtGatl_n.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_E60W_C = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_E60W_C
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
