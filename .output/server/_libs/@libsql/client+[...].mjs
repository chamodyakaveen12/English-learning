import { t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/unenv/dist/runtime/polyfill/globalthis.mjs
var globalthis_default = globalThis;
(() => {
	return new RegExp(`^(?<scheme>[A-Za-z][A-Za-z.+-]*):(//(?<authority>[^/?#]*))?(?<path>[^?#]*)(\\?(?<query>[^#]*))?(#(?<fragment>.*))?$`, "su");
})();
(() => {
	return new RegExp(`^((?<username>[^:]*)(:(?<password>.*))?@)?((?<host>[^:\\[\\]]*)|(\\[(?<host_br>[^\\[\\]]*)\\]))(:(?<port>[0-9]*))?$`, "su");
})();
if (typeof WebSocket !== "undefined");
else if (typeof globalthis_default !== "undefined") globalthis_default.WebSocket;
else if (typeof window !== "undefined") window.WebSocket;
else if (typeof self !== "undefined") self.WebSocket;
if (typeof queueMicrotask !== "undefined");
else Promise.resolve();
(/* @__PURE__ */ __commonJSMin(((exports, module) => {
	function limiter(count) {
		var outstanding = 0;
		var jobs = [];
		function remove() {
			outstanding--;
			if (outstanding < count) dequeue();
		}
		function dequeue() {
			var job = jobs.shift();
			semaphore.queue = jobs.length;
			if (job) run(job.fn).then(job.resolve).catch(job.reject);
		}
		function queue(fn) {
			return new Promise(function(resolve, reject) {
				jobs.push({
					fn,
					resolve,
					reject
				});
				semaphore.queue = jobs.length;
			});
		}
		function run(fn) {
			outstanding++;
			try {
				return Promise.resolve(fn()).then(function(result) {
					remove();
					return result;
				}, function(error) {
					remove();
					throw error;
				});
			} catch (err) {
				remove();
				return Promise.reject(err);
			}
		}
		var semaphore = function(fn) {
			if (outstanding >= count) return queue(fn);
			else return run(fn);
		};
		return semaphore;
	}
	function map(items, mapper) {
		var failed = false;
		var limit = this;
		return Promise.all(items.map(function() {
			var args = arguments;
			return limit(function() {
				if (!failed) return mapper.apply(void 0, args).catch(function(e) {
					failed = true;
					throw e;
				});
			});
		}));
	}
	function addExtras(fn) {
		fn.queue = 0;
		fn.map = map;
		return fn;
	}
	module.exports = function(count) {
		if (count) return addExtras(limiter(count));
		else return addExtras(function(fn) {
			return fn();
		});
	};
})))();
//#endregion
export { globalthis_default as t };
