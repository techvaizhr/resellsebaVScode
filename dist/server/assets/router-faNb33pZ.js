import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { E as deepEqual, O as escapeHtml, r as useHydrated, t as useStore } from "./useStore-B1pEtgmS.js";
import { l as createNonReactiveMutableStore, n as Outlet, o as RouterCore, u as createNonReactiveReadonlyStore } from "./Match-D8nEIile.js";
import { i as redirect } from "./redirect-SIDaGvS3.js";
import { t as Link } from "./link-BijU1MeZ.js";
import { o as getAssetCrossOrigin, r as appendUniqueUserTags, s as getScriptPreloadAttrs, u as resolveManifestCssLink } from "./atom-HSyjuv6w.js";
import { n as createFileRoute, r as createRootRouteWithContext, t as lazyRouteComponent } from "./lazyRouteComponent-_UvbgDVt.js";
import { c as require_jsx_runtime } from "./vendor-editor-CeWP4_Ao.js";
import { t as useRouter } from "./useRouter-D2hJ-wMP.js";
import { R as initial_data_default, r as supabase } from "./client-CLBrUPi_.js";
import { i as enumType, l as stringType, o as numberType, s as objectType } from "./types-CX4iBvKD.js";
import { D as focusManager, O as Subscribable, _ as noop, c as notifyManager, d as functionalUpdate, f as hashKey, g as matchQuery, h as matchMutation, p as hashQueryKeyByOptions, r as Query, s as onlineManager, t as QueryClientProvider, v as partialMatchKey, w as skipToken, x as resolveStaleTime } from "./QueryClientProvider-CF67hjzh.js";
import { t as Mutation } from "./mutation-BvEKk1Gl.js";
import { t as Toaster } from "./dist-D98gQi4U.js";
import { i as useBrandingTheme, n as usePlatformBranding } from "./platform-branding-DO8pd0Ly.js";
import { t as GlobalConfirmHost } from "./confirm-CRVKAosm.js";
import { i as getSiteSeo, n as seoMeta, t as seoLinks } from "./seo-meta-CCcI22pj.js";
import { t as Route$87 } from "./login-CVur3u2n.js";
import { t as Route$88 } from "./catalog.index-CmZwH869.js";
import { t as Route$89 } from "./catalog._slug-ByrPytUs.js";
import { t as Route$90 } from "./s._code-C2g80dF8.js";
import { t as Route$91 } from "./orders-BXQnM1VS.js";
import { t as Route$92 } from "./payouts-BYZUN13t.js";
import { t as Route$93 } from "./resellers-BKOxn-_L.js";
import { t as Route$94 } from "./transactions-B2w9gENZ.js";
import { t as Route$95 } from "./orders-DpQ8nXNX.js";
import { t as Route$96 } from "./s._code.index-CocBTpmL.js";
import { t as Route$97 } from "./s._code.checkout-q5bWib8Z.js";
import { t as Route$98 } from "./s._code.thanks-B7Szb3Cj.js";
import { t as Route$99 } from "./products.index-B0-biH3O.js";
import { t as Route$100 } from "./products.new-DaA02h7b.js";
import { t as Route$101 } from "./s._code.c._slug-B6rHE6jC.js";
import { t as Route$102 } from "./s._code.p._slug-oILVwkAZ.js";
import { t as Route$103 } from "./products._id.edit-Bmv2zo_3.js";
import { t as Route$104 } from "./orders._id.invoice-D_SAwbYQ.js";
//#region node_modules/@tanstack/react-router/dist/esm/routerStores.js
var getStoreFactory = (opts) => {
	return {
		createMutableStore: createNonReactiveMutableStore,
		createReadonlyStore: createNonReactiveReadonlyStore,
		batch: (fn) => fn()
	};
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/router.js
/**
* Creates a new Router instance for React.
*
* Pass the returned router to `RouterProvider` to enable routing.
* Notable options: `routeTree` (your route definitions) and `context`
* (required if the root route was created with `createRootRouteWithContext`).
*
* @param options Router options used to configure the router.
* @returns A Router instance to be provided to `RouterProvider`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouterFunction
*/
var createRouter = (options) => {
	return new Router(options);
};
var Router = class extends RouterCore {
	constructor(options) {
		super(options, getStoreFactory);
	}
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Asset.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var noopScriptHandler = () => {};
function setScriptAttrs(script, attrs) {
	if (!attrs) return;
	for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
}
function Asset(asset) {
	const { attrs, children, nonce, preventScriptHoist } = asset;
	switch (asset.tag) {
		case "title": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", {
			...attrs,
			suppressHydrationWarning: true,
			children
		});
		case "meta": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			...attrs,
			suppressHydrationWarning: true
		});
		case "link": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			...attrs,
			precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
			nonce,
			suppressHydrationWarning: true
		});
		case "style":
			if (asset.inlineCss && false);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
				...attrs,
				dangerouslySetInnerHTML: { __html: children },
				nonce
			});
		case "script": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Script, {
			attrs,
			preventScriptHoist,
			children
		});
		default: return null;
	}
}
function Script({ attrs, children, preventScriptHoist }) {
	useRouter();
	useHydrated();
	const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
	import_react.useEffect(() => {
		if (dataScript) return;
		if (attrs?.src) {
			const normSrc = (() => {
				try {
					const base = document.baseURI || window.location.href;
					return new URL(attrs.src, base).href;
				} catch {
					return attrs.src;
				}
			})();
			for (const el of document.querySelectorAll("script[src]")) if (el.src === normSrc) return;
			const script = document.createElement("script");
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
		if (typeof children === "string") {
			const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
			const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
			for (const el of document.querySelectorAll("script:not([src])")) {
				if (!(el instanceof HTMLScriptElement)) continue;
				const sType = el.getAttribute("type") ?? "text/javascript";
				const sNonce = el.getAttribute("nonce") ?? void 0;
				if (el.textContent === children && sType === typeAttr && sNonce === nonceAttr) return;
			}
			const script = document.createElement("script");
			script.textContent = children;
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
	}, [
		attrs,
		children,
		dataScript
	]);
	if (attrs?.src) {
		if (!preventScriptHoist) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			suppressHydrationWarning: true
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			onLoad: noopScriptHandler,
			suppressHydrationWarning: true
		});
	}
	if (typeof children === "string") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		...attrs,
		dangerouslySetInnerHTML: { __html: children },
		suppressHydrationWarning: true
	});
	return null;
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/headContentUtils.js
function buildTagsFromMatches(router, nonce, matches, assetCrossOrigin) {
	const routeMeta = matches.map((match) => match.meta).filter((meta) => meta !== void 0);
	const resultMeta = [];
	const metaByAttribute = {};
	let title;
	for (let i = routeMeta.length - 1; i >= 0; i--) {
		const metas = routeMeta[i];
		for (let j = metas.length - 1; j >= 0; j--) {
			const m = metas[j];
			if (!m) continue;
			if (m.title) {
				if (!title) title = {
					tag: "title",
					children: m.title
				};
			} else if ("script:ld+json" in m) try {
				const json = JSON.stringify(m["script:ld+json"]);
				resultMeta.push({
					tag: "script",
					attrs: { type: "application/ld+json" },
					children: escapeHtml(json)
				});
			} catch {}
			else {
				const attribute = m.name ?? m.property;
				if (attribute) if (metaByAttribute[attribute]) continue;
				else metaByAttribute[attribute] = true;
				resultMeta.push({
					tag: "meta",
					attrs: {
						...m,
						nonce
					}
				});
			}
		}
	}
	if (title) resultMeta.push(title);
	if (nonce) resultMeta.push({
		tag: "meta",
		attrs: {
			property: "csp-nonce",
			content: nonce
		}
	});
	resultMeta.reverse();
	const constructedLinks = matches.flatMap((match) => match.links ?? []).filter((link) => link !== void 0).map((link) => ({
		tag: "link",
		attrs: {
			...link,
			nonce
		}
	}));
	const manifest = router.ssr?.manifest;
	const manifestCssTags = [];
	if (manifest) {
		matches.forEach((match) => {
			(manifest.routes[match.routeId]?.css)?.forEach((link) => {
				const resolvedLink = resolveManifestCssLink(link);
				manifestCssTags.push({
					tag: "link",
					attrs: {
						rel: "stylesheet",
						...resolvedLink,
						crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? resolvedLink.crossOrigin,
						suppressHydrationWarning: true,
						nonce
					}
				});
			});
		});
		if (manifest.inlineStyle) manifestCssTags.push({
			tag: "style",
			attrs: {
				...manifest.inlineStyle.attrs,
				nonce
			},
			children: manifest.inlineStyle.children,
			inlineCss: true
		});
	}
	const preloadLinks = [];
	if (manifest) matches.forEach((match) => {
		manifest.routes[match.routeId]?.preloads?.forEach((preload) => {
			preloadLinks.push({
				tag: "link",
				attrs: {
					...getScriptPreloadAttrs(manifest, preload, assetCrossOrigin),
					nonce
				}
			});
		});
	});
	const styles = matches.flatMap((match) => match.styles ?? []).filter((style) => style !== void 0).map(({ children, ...attrs }) => ({
		tag: "style",
		attrs: {
			...attrs,
			nonce
		},
		children
	}));
	const headScripts = matches.flatMap((match) => match.headScripts ?? []).filter((script) => script !== void 0).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			nonce
		},
		children
	}));
	const tags = [];
	appendUniqueUserTags(tags, resultMeta);
	tags.push(...preloadLinks);
	appendUniqueUserTags(tags, constructedLinks);
	tags.push(...manifestCssTags);
	appendUniqueUserTags(tags, styles);
	appendUniqueUserTags(tags, headScripts);
	return tags;
}
/**
* Build the list of head/link/meta/script tags to render for active matches.
* Used internally by `HeadContent`.
*/
var useTags = (assetCrossOrigin) => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	return buildTagsFromMatches(router, nonce, router.stores.matches.get(), assetCrossOrigin);
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/HeadContent.js
/**
* Render route-managed head tags (title, meta, links, styles, head scripts).
* Place inside the document head of your app shell.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management
*/
function HeadContent(props) {
	const tags = useTags(props.assetCrossOrigin);
	const nonce = useRouter().options.ssr?.nonce;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: tags.map((tag) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...tag,
		key: `tsr-meta-${JSON.stringify(tag)}`,
		nonce
	})) });
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Scripts.js
/**
* Render body script tags collected from route matches and SSR manifests.
* Should be placed near the end of the document body.
*/
var Scripts = () => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const getAssetScripts = (matches) => {
		const assetScripts = [];
		const manifest = router.ssr?.manifest;
		if (!manifest) return [];
		for (const match of matches) {
			const scripts = manifest.routes[match.routeId]?.scripts;
			if (!scripts) continue;
			for (const asset of scripts) assetScripts.push({
				tag: "script",
				attrs: {
					...asset.attrs,
					nonce
				},
				children: asset.children,
				...typeof asset.attrs?.src === "string" ? { preventScriptHoist: true } : {}
			});
		}
		return assetScripts;
	};
	const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			suppressHydrationWarning: true,
			nonce
		},
		children
	}));
	{
		const activeMatches = router.stores.matches.get();
		const assetScripts = getAssetScripts(activeMatches);
		return renderScripts(router, getScripts(activeMatches), assetScripts);
	}
	const assetScripts = useStore(router.stores.matches, getAssetScripts, deepEqual);
	return renderScripts(router, useStore(router.stores.matches, getScripts, deepEqual), assetScripts);
};
function renderScripts(router, scripts, assetScripts) {
	const allScripts = [...scripts, ...assetScripts];
	if (router.serverSsr) {
		const serverBufferedScript = router.serverSsr.takeBufferedScripts();
		if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...asset,
		key: `tsr-scripts-${asset.tag}-${i}`
	})) });
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutationCache.js
var MutationCache = class extends Subscribable {
	constructor(config = {}) {
		super();
		this.config = config;
		this.#mutations = /* @__PURE__ */ new Set();
		this.#scopes = /* @__PURE__ */ new Map();
		this.#mutationId = 0;
	}
	#mutations;
	#scopes;
	#mutationId;
	build(client, options, state) {
		const mutation = new Mutation({
			client,
			mutationCache: this,
			mutationId: ++this.#mutationId,
			options: client.defaultMutationOptions(options),
			state
		});
		this.add(mutation);
		return mutation;
	}
	add(mutation) {
		this.#mutations.add(mutation);
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const scopedMutations = this.#scopes.get(scope);
			if (scopedMutations) scopedMutations.push(mutation);
			else this.#scopes.set(scope, [mutation]);
		}
		this.notify({
			type: "added",
			mutation
		});
	}
	remove(mutation) {
		if (this.#mutations.delete(mutation)) {
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				const scopedMutations = this.#scopes.get(scope);
				if (scopedMutations) {
					if (scopedMutations.length > 1) {
						const index = scopedMutations.indexOf(mutation);
						if (index !== -1) scopedMutations.splice(index, 1);
					} else if (scopedMutations[0] === mutation) this.#scopes.delete(scope);
				}
			}
		}
		this.notify({
			type: "removed",
			mutation
		});
	}
	canRun(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const firstPendingMutation = this.#scopes.get(scope)?.find((m) => m.state.status === "pending");
			return !firstPendingMutation || firstPendingMutation === mutation;
		} else return true;
	}
	runNext(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") return (this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused))?.continue() ?? Promise.resolve();
		else return Promise.resolve();
	}
	clear() {
		notifyManager.batch(() => {
			this.#mutations.forEach((mutation) => {
				this.notify({
					type: "removed",
					mutation
				});
			});
			this.#mutations.clear();
			this.#scopes.clear();
		});
	}
	getAll() {
		return Array.from(this.#mutations);
	}
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((mutation) => matchMutation(defaultedFilters, mutation));
	}
	findAll(filters = {}) {
		return this.getAll().filter((mutation) => matchMutation(filters, mutation));
	}
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	resumePausedMutations() {
		const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
		return notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(noop))));
	}
};
function scopeFor(mutation) {
	return mutation.options.scope?.id;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryCache.js
var QueryCache = class extends Subscribable {
	constructor(config = {}) {
		super();
		this.config = config;
		this.#queries = /* @__PURE__ */ new Map();
	}
	#queries;
	build(client, options, state) {
		const queryKey = options.queryKey;
		const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
		let query = this.get(queryHash);
		if (!query) {
			query = new Query({
				client,
				queryKey,
				queryHash,
				options: client.defaultQueryOptions(options),
				state,
				defaultOptions: client.getQueryDefaults(queryKey)
			});
			this.add(query);
		}
		return query;
	}
	add(query) {
		if (!this.#queries.has(query.queryHash)) {
			this.#queries.set(query.queryHash, query);
			this.notify({
				type: "added",
				query
			});
		}
	}
	remove(query) {
		const queryInMap = this.#queries.get(query.queryHash);
		if (queryInMap) {
			query.destroy();
			if (queryInMap === query) this.#queries.delete(query.queryHash);
			this.notify({
				type: "removed",
				query
			});
		}
	}
	clear() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				this.remove(query);
			});
		});
	}
	get(queryHash) {
		return this.#queries.get(queryHash);
	}
	getAll() {
		return [...this.#queries.values()];
	}
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((query) => matchQuery(defaultedFilters, query));
	}
	findAll(filters = {}) {
		const queries = this.getAll();
		return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
	}
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	onFocus() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onFocus();
			});
		});
	}
	onOnline() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onOnline();
			});
		});
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryClient.js
var QueryClient = class {
	#queryCache;
	#mutationCache;
	#defaultOptions;
	#queryDefaults;
	#mutationDefaults;
	#mountCount;
	#unsubscribeFocus;
	#unsubscribeOnline;
	constructor(config = {}) {
		this.#queryCache = config.queryCache || new QueryCache();
		this.#mutationCache = config.mutationCache || new MutationCache();
		this.#defaultOptions = config.defaultOptions || {};
		this.#queryDefaults = /* @__PURE__ */ new Map();
		this.#mutationDefaults = /* @__PURE__ */ new Map();
		this.#mountCount = 0;
	}
	mount() {
		this.#mountCount++;
		if (this.#mountCount !== 1) return;
		this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
			if (focused) {
				await this.resumePausedMutations();
				this.#queryCache.onFocus();
			}
		});
		this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
			if (online) {
				await this.resumePausedMutations();
				this.#queryCache.onOnline();
			}
		});
	}
	unmount() {
		this.#mountCount--;
		if (this.#mountCount !== 0) return;
		this.#unsubscribeFocus?.();
		this.#unsubscribeFocus = void 0;
		this.#unsubscribeOnline?.();
		this.#unsubscribeOnline = void 0;
	}
	isFetching(filters) {
		return this.#queryCache.findAll({
			...filters,
			fetchStatus: "fetching"
		}).length;
	}
	isMutating(filters) {
		return this.#mutationCache.findAll({
			...filters,
			status: "pending"
		}).length;
	}
	/**
	* Imperative (non-reactive) way to retrieve data for a QueryKey.
	* Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
	*
	* Hint: Do not use this function inside a component, because it won't receive updates.
	* Use `useQuery` to create a `QueryObserver` that subscribes to changes.
	*/
	getQueryData(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state.data;
	}
	ensureQueryData(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		const query = this.#queryCache.build(this, defaultedOptions);
		const cachedData = query.state.data;
		if (cachedData === void 0) return this.fetchQuery(options);
		if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
		return Promise.resolve(cachedData);
	}
	getQueriesData(filters) {
		return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
			return [queryKey, state.data];
		});
	}
	setQueryData(queryKey, updater, options) {
		const defaultedOptions = this.defaultQueryOptions({ queryKey });
		const prevData = this.#queryCache.get(defaultedOptions.queryHash)?.state.data;
		const data = functionalUpdate(updater, prevData);
		if (data === void 0) return;
		return this.#queryCache.build(this, defaultedOptions).setData(data, {
			...options,
			manual: true
		});
	}
	setQueriesData(filters, updater, options) {
		return notifyManager.batch(() => this.#queryCache.findAll(filters).map(({ queryKey }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
	}
	getQueryState(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state;
	}
	removeQueries(filters) {
		const queryCache = this.#queryCache;
		notifyManager.batch(() => {
			queryCache.findAll(filters).forEach((query) => {
				queryCache.remove(query);
			});
		});
	}
	resetQueries(filters, options) {
		const queryCache = this.#queryCache;
		return notifyManager.batch(() => {
			queryCache.findAll(filters).forEach((query) => {
				query.reset();
			});
			return this.refetchQueries({
				type: "active",
				...filters
			}, options);
		});
	}
	cancelQueries(filters, cancelOptions = {}) {
		const defaultedCancelOptions = {
			revert: true,
			...cancelOptions
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions)));
		return Promise.all(promises).then(noop).catch(noop);
	}
	invalidateQueries(filters, options = {}) {
		return notifyManager.batch(() => {
			this.#queryCache.findAll(filters).forEach((query) => {
				query.invalidate();
			});
			if (filters?.refetchType === "none") return Promise.resolve();
			return this.refetchQueries({
				...filters,
				type: filters?.refetchType ?? filters?.type ?? "active"
			}, options);
		});
	}
	refetchQueries(filters, options = {}) {
		const fetchOptions = {
			...options,
			cancelRefetch: options.cancelRefetch ?? true
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
			let promise = query.fetch(void 0, fetchOptions);
			if (!fetchOptions.throwOnError) promise = promise.catch(noop);
			return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
		}));
		return Promise.all(promises).then(noop);
	}
	fetchQuery(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
		const query = this.#queryCache.build(this, defaultedOptions);
		return query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
	}
	prefetchQuery(options) {
		return this.fetchQuery(options).then(noop).catch(noop);
	}
	fetchInfiniteQuery(options) {
		options._type = "infinite";
		return this.fetchQuery(options);
	}
	prefetchInfiniteQuery(options) {
		return this.fetchInfiniteQuery(options).then(noop).catch(noop);
	}
	ensureInfiniteQueryData(options) {
		options._type = "infinite";
		return this.ensureQueryData(options);
	}
	resumePausedMutations() {
		if (onlineManager.isOnline()) return this.#mutationCache.resumePausedMutations();
		return Promise.resolve();
	}
	getQueryCache() {
		return this.#queryCache;
	}
	getMutationCache() {
		return this.#mutationCache;
	}
	getDefaultOptions() {
		return this.#defaultOptions;
	}
	setDefaultOptions(options) {
		this.#defaultOptions = options;
	}
	setQueryDefaults(queryKey, options) {
		this.#queryDefaults.set(hashKey(queryKey), {
			queryKey,
			defaultOptions: options
		});
	}
	getQueryDefaults(queryKey) {
		const defaults = [...this.#queryDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	setMutationDefaults(mutationKey, options) {
		this.#mutationDefaults.set(hashKey(mutationKey), {
			mutationKey,
			defaultOptions: options
		});
	}
	getMutationDefaults(mutationKey) {
		const defaults = [...this.#mutationDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	defaultQueryOptions(options) {
		if (options._defaulted) return options;
		const defaultedOptions = {
			...this.#defaultOptions.queries,
			...this.getQueryDefaults(options.queryKey),
			...options,
			_defaulted: true
		};
		if (!defaultedOptions.queryHash) defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
		if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
		if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
		if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
		if (defaultedOptions.queryFn === skipToken) defaultedOptions.enabled = false;
		return defaultedOptions;
	}
	defaultMutationOptions(options) {
		if (options?._defaulted) return options;
		return {
			...this.#defaultOptions.mutations,
			...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
			...options,
			_defaulted: true
		};
	}
	clear() {
		this.#queryCache.clear();
		this.#mutationCache.clear();
	}
};
//#endregion
//#region src/lib/pwa-register.ts
/**
* Single, guarded service-worker registration point for the PWA.
* Registers /sw.js with immediate scope.
*/
var SW_PATH = "/sw.js";
function isRefusedContext() {
	if (typeof window === "undefined") return true;
	if (window.self !== window.top) return true;
	const host = window.location.hostname;
	if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
	if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
	return false;
}
function registerPwa() {
	if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
	if (isRefusedContext()) return;
	window.addEventListener("load", () => {
		navigator.serviceWorker.register(SW_PATH, { scope: "/" }).then((reg) => {
			reg.addEventListener("updatefound", () => {
				const installing = reg.installing;
				if (installing) installing.addEventListener("statechange", () => {
					if (installing.state === "installed" && navigator.serviceWorker.controller) console.log("New PWA content available; please refresh.");
				});
			});
		}).catch((err) => {
			console.warn("PWA Service Worker registration failed:", err);
		});
	});
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-CNWDwX81.css";
//#endregion
//#region src/routes/__root.tsx
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
var Route$86 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Reseller Platform — Nijer online store, zero investment" },
			{
				name: "description",
				content: "Bangladesh er first-class reseller platform. Product listing, courier, payment, marketing — ekta panel-e sob."
			},
			{
				property: "og:title",
				content: "Reseller Platform — Nijer online store, zero investment"
			},
			{
				property: "og:description",
				content: "Bangladesh er first-class reseller platform. Product listing, courier, payment, marketing — ekta panel-e sob."
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
				name: "twitter:title",
				content: "Reseller Platform — Nijer online store, zero investment"
			},
			{
				name: "twitter:description",
				content: "Bangladesh er first-class reseller platform. Product listing, courier, payment, marketing — ekta panel-e sob."
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
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
	const { queryClient } = Route$86.useRouteContext();
	const router = useRouter();
	const brand = usePlatformBranding();
	(0, import_react.useEffect)(() => {
		registerPwa();
	}, []);
	(0, import_react.useEffect)(() => {
		const onStorage = (e) => {
			if (e.key === "auth_token" && !e.newValue) {
				queryClient.clear();
				router.navigate({
					to: "/login",
					replace: true
				});
			}
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, [router, queryClient]);
	useBrandingTheme(brand.primary, brand.accent);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-right",
				richColors: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalConfirmHost, {})
		]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$70 = () => import("./routes-BK3XZNUa.js");
var Route$85 = createFileRoute("/")({
	loader: async () => {
		try {
			return await getSiteSeo({ data: { path: "/" } });
		} catch (err) {
			console.warn("Index loader fallback:", err);
			return {
				title: "Reseller Platform — Your own online store, zero investment",
				description: "Product listing, courier, payment and marketing — everything in one panel for resellers in Bangladesh.",
				image: null,
				url: null,
				type: "website",
				siteName: "ResellSeba"
			};
		}
	},
	head: ({ loaderData }) => ({
		meta: seoMeta(loaderData, {
			title: "Reseller Platform — Your own online store, zero investment",
			description: "Product listing, courier, payment and marketing — everything in one panel for resellers in Bangladesh.",
			image: null,
			url: null,
			type: "website",
			siteName: null
		}),
		links: seoLinks(loaderData)
	}),
	component: lazyRouteComponent($$splitComponentImporter$70, "component")
});
//#endregion
//#region src/routes/_authenticated/route.tsx
var $$splitComponentImporter$69 = () => import("./route-BH6NuJbx.js");
var Route$84 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data } = await supabase.auth.getSession();
		const session = data.session;
		if (!session?.user) throw redirect({
			to: "/login",
			search: { redirect: location.href }
		});
		return { user: session.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$69, "component")
});
//#endregion
//#region src/routes/catalog.tsx
var $$splitComponentImporter$68 = () => import("./catalog-CZ4P2qjg.js");
var Route$83 = createFileRoute("/catalog")({ component: lazyRouteComponent($$splitComponentImporter$68, "component") });
//#endregion
//#region src/routes/privacy.tsx
var $$splitComponentImporter$67 = () => import("./privacy-BaAgHlYe.js");
var Route$82 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: "Privacy Policy — ResellSeba Platform" },
		{
			name: "description",
			content: "Learn how we collect, use, and protect reseller and customer data on our platform."
		},
		{
			property: "og:title",
			content: "Privacy Policy — ResellSeba Platform"
		},
		{
			property: "og:description",
			content: "Learn how we collect, use, and protect reseller and customer data on our platform."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$67, "component")
});
//#endregion
//#region src/routes/register.tsx
var Route$81 = createFileRoute("/register")({ beforeLoad: ({ search }) => {
	throw redirect({
		to: "/login",
		search: {
			mode: "signup",
			...search
		}
	});
} });
//#endregion
//#region src/routes/tutorials.tsx
var $$splitComponentImporter$66 = () => import("./tutorials-CYhJ9EPZ.js");
var Route$80 = createFileRoute("/tutorials")({
	component: lazyRouteComponent($$splitComponentImporter$66, "component"),
	head: () => ({ meta: [
		{ title: "Video Tutorial — Learn step by step" },
		{
			name: "description",
			content: "From starting reselling to orders, courier, and payments — a free video tutorial library organized by topic."
		},
		{
			property: "og:title",
			content: "Video Tutorial — Learn step by step"
		},
		{
			property: "og:description",
			content: "Video tutorials organized by topic — reselling, orders, courier, and payment guides."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/route.tsx
var $$splitComponentImporter$65 = () => import("./route-rLU9VvAb.js");
var Route$79 = createFileRoute("/_authenticated/admin")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$65, "component")
});
/** Which permission unlocks each admin route (see src/lib/permissions.ts). */
/** First admin route this permission set can actually open (nav order). */
//#endregion
//#region src/routes/_authenticated/dashboard.tsx
var $$splitComponentImporter$64 = () => import("./dashboard-DgYha4b7.js");
var Route$78 = createFileRoute("/_authenticated/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$64, "component") });
//#endregion
//#region src/routes/_authenticated/onboarding.tsx
var $$splitComponentImporter$63 = () => import("./onboarding-D-Gr78b6.js");
var Route$77 = createFileRoute("/_authenticated/onboarding")({
	head: () => ({ meta: [{ title: "Become a reseller — ResellHub" }, {
		name: "description",
		content: "Apply to become a reseller on ResellHub."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$63, "component")
});
//#endregion
//#region src/routes/_authenticated/reseller/route.tsx
var $$splitComponentImporter$62 = () => import("./route-CIC2FnVi.js");
var Route$76 = createFileRoute("/_authenticated/reseller")({ component: lazyRouteComponent($$splitComponentImporter$62, "component") });
/** Shown instead of the page when the plan has expired past its grace period. */
//#endregion
//#region src/routes/_authenticated/supplier/route.tsx
var $$splitComponentImporter$61 = () => import("./route-DRUsuWVe.js");
var Route$75 = createFileRoute("/_authenticated/supplier")({ component: lazyRouteComponent($$splitComponentImporter$61, "component") });
//#endregion
//#region src/routes/_authenticated/verify.tsx
var $$splitComponentImporter$60 = () => import("./verify-CZuA6f0q.js");
var Route$74 = createFileRoute("/_authenticated/verify")({
	component: lazyRouteComponent($$splitComponentImporter$60, "component"),
	head: () => ({ meta: [
		{ title: "Verify your account" },
		{
			name: "description",
			content: "Finish registration by verifying the codes sent to your email and mobile number."
		},
		{
			property: "og:title",
			content: "Verify your account"
		},
		{
			property: "og:description",
			content: "Activate your account with the verification code."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/index.tsx
var $$splitComponentImporter$59 = () => import("./admin-BcZpZlUr.js");
var Route$73 = createFileRoute("/_authenticated/admin/")({ component: lazyRouteComponent($$splitComponentImporter$59, "component") });
/** Small clickable report tile — always links to the page (with filter) it reports on. */
//#endregion
//#region src/routes/_authenticated/admin/advanced.tsx
var $$splitComponentImporter$58 = () => import("./advanced-DUD2WTKR.js");
var Route$72 = createFileRoute("/_authenticated/admin/advanced")({
	component: lazyRouteComponent($$splitComponentImporter$58, "component"),
	head: () => ({ meta: [
		{ title: "Advanced settings · Admin" },
		{
			name: "description",
			content: "Feature switches: reseller catalog stock visibility and signup verification rules."
		},
		{
			property: "og:title",
			content: "Advanced settings · Admin"
		},
		{
			property: "og:description",
			content: "Turn platform logic on or off without touching the code."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
/** Global auto-pricing rule used when a product is uploaded. */
/** Global delivery charge rule. A product can still override it from product edit. */
//#endregion
//#region src/routes/_authenticated/admin/agent-payouts.tsx
var $$splitComponentImporter$57 = () => import("./agent-payouts-CijzQ3KQ.js");
var Route$71 = createFileRoute("/_authenticated/admin/agent-payouts")({ component: lazyRouteComponent($$splitComponentImporter$57, "component") });
//#endregion
//#region src/routes/_authenticated/admin/agent-report.tsx
var $$splitComponentImporter$56 = () => import("./agent-report-Cah_lNka.js");
var Route$70 = createFileRoute("/_authenticated/admin/agent-report")({ component: lazyRouteComponent($$splitComponentImporter$56, "component") });
//#endregion
//#region src/routes/_authenticated/admin/agents.tsx
var $$splitComponentImporter$55 = () => import("./agents-Bc0dsvQU.js");
var Route$69 = createFileRoute("/_authenticated/admin/agents")({ component: lazyRouteComponent($$splitComponentImporter$55, "component") });
//#endregion
//#region src/routes/_authenticated/admin/backup.tsx
var $$splitComponentImporter$54 = () => import("./backup-419FVS5l.js");
var Route$68 = createFileRoute("/_authenticated/admin/backup")({
	component: lazyRouteComponent($$splitComponentImporter$54, "component"),
	head: () => ({ meta: [{ title: "Backup & Restore · Admin" }, {
		name: "description",
		content: "Dynamic full database and uploads image backup and restore system."
	}] })
});
//#endregion
//#region src/routes/_authenticated/admin/brands.tsx
var $$splitComponentImporter$53 = () => import("./brands-Beufl_jO.js");
var Route$67 = createFileRoute("/_authenticated/admin/brands")({ component: lazyRouteComponent($$splitComponentImporter$53, "component") });
//#endregion
//#region src/routes/_authenticated/admin/business-report.tsx
var $$splitComponentImporter$52 = () => import("./business-report-B3PTRPYh.js");
var Route$66 = createFileRoute("/_authenticated/admin/business-report")({
	component: lazyRouteComponent($$splitComponentImporter$52, "component"),
	head: () => ({ meta: [
		{ title: "Business report — Admin" },
		{
			name: "description",
			content: "Most selling products, reseller and courier performance, agent targets and the admin profit & loss."
		},
		{
			property: "og:title",
			content: "Business report — Admin"
		},
		{
			property: "og:description",
			content: "Five simple reports: products, resellers, couriers, agents, profit & loss."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/categories.tsx
var $$splitComponentImporter$51 = () => import("./categories-B6w_xpyD.js");
var Route$65 = createFileRoute("/_authenticated/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$51, "component") });
//#endregion
//#region src/routes/_authenticated/admin/commissions.tsx
var $$splitComponentImporter$50 = () => import("./commissions-ideiv5Gx.js");
var Route$64 = createFileRoute("/_authenticated/admin/commissions")({ component: lazyRouteComponent($$splitComponentImporter$50, "component") });
//#endregion
//#region src/routes/_authenticated/admin/couriers.tsx
var $$splitComponentImporter$49 = () => import("./couriers-YDzB9oJ_.js");
/** Server fns reject with a raw Response; read its body so the toast is useful. */
/** Pickup stores already saved in courier_configs.config.stores_json. */
var Route$63 = createFileRoute("/_authenticated/admin/couriers")({ component: lazyRouteComponent($$splitComponentImporter$49, "component") });
//#endregion
//#region src/routes/_authenticated/admin/customers.tsx
var $$splitComponentImporter$48 = () => import("./customers-CPxEMfrz.js");
var Route$62 = createFileRoute("/_authenticated/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$48, "component") });
//#endregion
//#region src/routes/_authenticated/admin/deposit-transactions.tsx
var $$splitComponentImporter$47 = () => import("./deposit-transactions-43O7z7UB.js");
var Route$61 = createFileRoute("/_authenticated/admin/deposit-transactions")({
	component: lazyRouteComponent($$splitComponentImporter$47, "component"),
	head: () => ({ meta: [
		{ title: "Deposit transactions · Finance" },
		{
			name: "description",
			content: "Every reseller security deposit, refund and adjustment with edit and delete controls."
		},
		{
			property: "og:title",
			content: "Deposit transactions · Finance"
		},
		{
			property: "og:description",
			content: "Audit and manage all reseller deposit entries in one ledger."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/deposits.tsx
/** Security deposit settings now live inside Advanced settings → Security deposit tab. */
var Route$60 = createFileRoute("/_authenticated/admin/deposits")({ beforeLoad: () => {
	throw redirect({ to: "/admin/advanced" });
} });
//#endregion
//#region src/routes/_authenticated/admin/domains.tsx
var $$splitComponentImporter$46 = () => import("./domains-BkqcEGlD.js");
var Route$59 = createFileRoute("/_authenticated/admin/domains")({ component: lazyRouteComponent($$splitComponentImporter$46, "component") });
/**
* The platform's own live domains. Payment gateways return to the origin that
* holds the privileged key, and the shopper/reseller is then sent back to the
* exact site they started on — only hosts listed here (plus connected reseller
* domains and the hosting URL) are accepted, so nothing can hijack a redirect.
*/
//#endregion
//#region src/routes/_authenticated/admin/expenses.tsx
var $$splitComponentImporter$45 = () => import("./expenses-nTeHjyX4.js");
var Route$58 = createFileRoute("/_authenticated/admin/expenses")({
	component: lazyRouteComponent($$splitComponentImporter$45, "component"),
	head: () => ({ meta: [
		{ title: "Business expenses — Admin" },
		{
			name: "description",
			content: "Record every business expense — salary, marketing, courier, office — and see the totals per category."
		},
		{
			property: "og:title",
			content: "Business expenses — Admin"
		},
		{
			property: "og:description",
			content: "Expense ledger that feeds the admin profit & loss report."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/landing.tsx
var $$splitComponentImporter$44 = () => import("./landing-D_nfu2i9.js");
var Route$57 = createFileRoute("/_authenticated/admin/landing")({ component: lazyRouteComponent($$splitComponentImporter$44, "component") });
//#endregion
//#region src/routes/_authenticated/admin/maintenance.tsx
var $$splitComponentImporter$43 = () => import("./maintenance-6giqTQG7.js");
var Route$56 = createFileRoute("/_authenticated/admin/maintenance")({
	component: lazyRouteComponent($$splitComponentImporter$43, "component"),
	head: () => ({ meta: [
		{ title: "Cache & cleanup · Admin" },
		{
			name: "description",
			content: "Clear stored logs, courier webhook payloads, old visit data and the browser cache."
		},
		{
			property: "og:title",
			content: "Cache & cleanup · Admin"
		},
		{
			property: "og:description",
			content: "Free up the database by removing logs and data the app does not need."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/marketing.tsx
var $$splitComponentImporter$42 = () => import("./marketing-B9a5LfNO.js");
var Route$55 = createFileRoute("/_authenticated/admin/marketing")({ component: lazyRouteComponent($$splitComponentImporter$42, "component") });
//#endregion
//#region src/routes/_authenticated/admin/media.tsx
var $$splitComponentImporter$41 = () => import("./media-CZuy6_bJ.js");
var Route$54 = createFileRoute("/_authenticated/admin/media")({ component: lazyRouteComponent($$splitComponentImporter$41, "component") });
//#endregion
//#region src/routes/_authenticated/admin/notices.tsx
var $$splitComponentImporter$40 = () => import("./notices-JkopHd7B.js");
var Route$53 = createFileRoute("/_authenticated/admin/notices")({
	component: lazyRouteComponent($$splitComponentImporter$40, "component"),
	head: () => ({ meta: [
		{ title: "Admin notices | Reseller platform" },
		{
			name: "description",
			content: "Create dashboard popup notices for your resellers."
		},
		{
			property: "og:title",
			content: "Admin notices"
		},
		{
			property: "og:description",
			content: "Create dashboard popup notices for your resellers."
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/notifications.tsx
var $$splitComponentImporter$39 = () => import("./notifications-BpHksKr-.js");
var Route$52 = createFileRoute("/_authenticated/admin/notifications")({ component: lazyRouteComponent($$splitComponentImporter$39, "component") });
//#endregion
//#region src/routes/_authenticated/admin/payments.tsx
var $$splitComponentImporter$38 = () => import("./payments-j6HidLri.js");
var Route$51 = createFileRoute("/_authenticated/admin/payments")({
	component: lazyRouteComponent($$splitComponentImporter$38, "component"),
	head: () => ({ meta: [
		{ title: "Payment methods · Admin" },
		{
			name: "description",
			content: "Set up manual wallet and bank methods plus automatic payment gateways used at storefront checkout and for reseller security deposits."
		},
		{
			property: "og:title",
			content: "Payment methods · Admin"
		},
		{
			property: "og:description",
			content: "Manual wallets and automatic gateways, configured in one clean place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/policies.tsx
var $$splitComponentImporter$37 = () => import("./policies-Csk6SoJL.js");
var Route$50 = createFileRoute("/_authenticated/admin/policies")({ component: lazyRouteComponent($$splitComponentImporter$37, "component") });
//#endregion
//#region src/routes/_authenticated/admin/privacy.tsx
var $$splitComponentImporter$36 = () => import("./privacy-DYWm1Sr5.js");
var Route$49 = createFileRoute("/_authenticated/admin/privacy")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
//#endregion
//#region src/routes/_authenticated/admin/settings.tsx
var $$splitComponentImporter$35 = () => import("./settings-BwlH2RiY.js");
var Route$48 = createFileRoute("/_authenticated/admin/settings")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
//#endregion
//#region src/routes/_authenticated/admin/staff.tsx
var $$splitComponentImporter$34 = () => import("./staff-DE7mYvgx.js");
var Route$47 = createFileRoute("/_authenticated/admin/staff")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
//#endregion
//#region src/routes/_authenticated/admin/subscriptions.tsx
var $$splitComponentImporter$33 = () => import("./subscriptions-CexpQvJS.js");
var Route$46 = createFileRoute("/_authenticated/admin/subscriptions")({
	component: lazyRouteComponent($$splitComponentImporter$33, "component"),
	head: () => ({ meta: [
		{ title: "Subscriptions — Plans, subscribers and billing" },
		{
			name: "description",
			content: "Manage reseller subscription plans, per-reseller pricing and trials, approve payment requests and track subscription revenue."
		},
		{
			property: "og:title",
			content: "Subscriptions — Plans, subscribers and billing"
		},
		{
			property: "og:description",
			content: "Plans, subscribers, payment requests and revenue in one place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/supplier-payouts.tsx
var $$splitComponentImporter$32 = () => import("./supplier-payouts-BKGLI3Y8.js");
var Route$45 = createFileRoute("/_authenticated/admin/supplier-payouts")({
	component: lazyRouteComponent($$splitComponentImporter$32, "component"),
	head: () => ({ meta: [
		{ title: "Supplier payouts — Admin" },
		{
			name: "description",
			content: "Approve, reject or record supplier withdrawals and track payable balance."
		},
		{
			property: "og:title",
			content: "Supplier payouts — Admin"
		},
		{
			property: "og:description",
			content: "Supplier withdrawal requests and manual payments."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/supplier-report.tsx
var $$splitComponentImporter$31 = () => import("./supplier-report-C308aGvK.js");
var Route$44 = createFileRoute("/_authenticated/admin/supplier-report")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
//#endregion
//#region src/routes/_authenticated/admin/supplier-returns.tsx
var $$splitComponentImporter$30 = () => import("./supplier-returns-Qa2hst9C.js");
var Route$43 = createFileRoute("/_authenticated/admin/supplier-returns")({
	component: lazyRouteComponent($$splitComponentImporter$30, "component"),
	head: () => ({ meta: [
		{ title: "Supplier returns handover · Admin" },
		{
			name: "description",
			content: "Hand over returned items to each supplier — in bulk or one at a time."
		},
		{
			property: "og:title",
			content: "Supplier returns handover"
		},
		{
			property: "og:description",
			content: "Hand returned items back to each supplier."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
/** Group one supplier's return rows by order so multi-product orders stay together. */
//#endregion
//#region src/routes/_authenticated/admin/suppliers.tsx
var $$splitComponentImporter$29 = () => import("./suppliers-Dv6Al7Xs.js");
var Route$42 = createFileRoute("/_authenticated/admin/suppliers")({
	component: lazyRouteComponent($$splitComponentImporter$29, "component"),
	head: () => ({ meta: [
		{ title: "Supplier network — Admin" },
		{
			name: "description",
			content: "Approve suppliers, track their sales, payable balance and account access."
		},
		{
			property: "og:title",
			content: "Supplier network — Admin"
		},
		{
			property: "og:description",
			content: "Supplier accounts, earnings and payouts in one list."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
/** Status + returns + ID + phone + email badges, reused inline (desktop) and below (mobile). */
//#endregion
//#region src/routes/_authenticated/admin/tutorials.tsx
var $$splitComponentImporter$28 = () => import("./tutorials-D3Xq7U23.js");
var Route$41 = createFileRoute("/_authenticated/admin/tutorials")({
	component: lazyRouteComponent($$splitComponentImporter$28, "component"),
	head: () => ({ meta: [
		{ title: "Video tutorials | Admin" },
		{
			name: "description",
			content: "Manage YouTube video tutorials and topics for the landing page and reseller panel."
		},
		{
			property: "og:title",
			content: "Video tutorials"
		},
		{
			property: "og:description",
			content: "Manage YouTube video tutorials and topics for resellers."
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/admin/visitors.tsx
var $$splitComponentImporter$27 = () => import("./visitors-B2aLVDRZ.js");
var Route$40 = createFileRoute("/_authenticated/admin/visitors")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/index.tsx
var $$splitComponentImporter$26 = () => import("./reseller-DHBhEDh4.js");
var Route$39 = createFileRoute("/_authenticated/reseller/")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/catalog.tsx
var $$splitComponentImporter$25 = () => import("./catalog-DpOLYDI5.js");
/** Card image picker needs every image of one product — fetched only on click. */
var Route$38 = createFileRoute("/_authenticated/reseller/catalog")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/commissions.tsx
var $$splitComponentImporter$24 = () => import("./commissions-BI7RZ2u4.js");
var Route$37 = createFileRoute("/_authenticated/reseller/commissions")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/customers.tsx
var $$splitComponentImporter$23 = () => import("./customers-DcTYIptY.js");
var Route$36 = createFileRoute("/_authenticated/reseller/customers")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/domain.tsx
var $$splitComponentImporter$22 = () => import("./domain-CowNGMQc.js");
var Route$35 = createFileRoute("/_authenticated/reseller/domain")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/listings.tsx
var $$splitComponentImporter$21 = () => import("./listings-DpGVTbQX.js");
var Route$34 = createFileRoute("/_authenticated/reseller/listings")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/marketing.tsx
var $$splitComponentImporter$20 = () => import("./marketing-CpdJ_XpJ.js");
var Route$33 = createFileRoute("/_authenticated/reseller/marketing")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/menus.tsx
var $$splitComponentImporter$19 = () => import("./menus-D8mRS7dp.js");
var Route$32 = createFileRoute("/_authenticated/reseller/menus")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/payments.tsx
var $$splitComponentImporter$18 = () => import("./payments-DpW8Gy6A.js");
var Route$31 = createFileRoute("/_authenticated/reseller/payments")({
	component: lazyRouteComponent($$splitComponentImporter$18, "component"),
	head: () => ({ meta: [
		{ title: "Store payment methods · Reseller" },
		{
			name: "description",
			content: "See the global payment methods the platform keeps active for your store and add your own wallet or bank numbers for checkout."
		},
		{
			property: "og:title",
			content: "Store payment methods · Reseller"
		},
		{
			property: "og:description",
			content: "Global methods plus your own wallet numbers, in one place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/reseller/payouts.tsx
var $$splitComponentImporter$17 = () => import("./payouts-ewR_MJby.js");
var Route$30 = createFileRoute("/_authenticated/reseller/payouts")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/policies.tsx
var $$splitComponentImporter$16 = () => import("./policies-C8F-keBf.js");
var Route$29 = createFileRoute("/_authenticated/reseller/policies")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/profile.tsx
var $$splitComponentImporter$15 = () => import("./profile-CsyhqINi.js");
var Route$28 = createFileRoute("/_authenticated/reseller/profile")({
	head: () => ({ meta: [
		{ title: "My Profile — Reseller panel" },
		{
			name: "description",
			content: "Your reseller ID, account details, payout information and finance snapshot."
		},
		{
			property: "og:title",
			content: "My Profile — Reseller panel"
		},
		{
			property: "og:description",
			content: "Your reseller ID, account details and finance snapshot."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/_authenticated/reseller/settings.tsx
var $$splitComponentImporter$14 = () => import("./settings-DarF16kA.js");
var Route$27 = createFileRoute("/_authenticated/reseller/settings")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/_authenticated/reseller/subscription.tsx
var $$splitComponentImporter$13 = () => import("./subscription-C24kGpFR.js");
var Route$26 = createFileRoute("/_authenticated/reseller/subscription")({
	component: lazyRouteComponent($$splitComponentImporter$13, "component"),
	head: () => ({ meta: [
		{ title: "My subscription — Reseller plan & billing" },
		{
			name: "description",
			content: "See your active plan, renew for 1, 3, 6 or 12 months and pay from your earnings or by wallet transfer."
		},
		{
			property: "og:title",
			content: "My subscription — Reseller plan & billing"
		},
		{
			property: "og:description",
			content: "Plan status, renewal prices and payment history in one place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/reseller/support.tsx
var $$splitComponentImporter$12 = () => import("./support-BsWrv79J.js");
var Route$25 = createFileRoute("/_authenticated/reseller/support")({
	component: lazyRouteComponent($$splitComponentImporter$12, "component"),
	head: () => ({ meta: [
		{ title: "Support & Contact — Reseller Panel" },
		{
			name: "description",
			content: "Reseller support: call, WhatsApp or email the admin team directly for orders, payouts and product help."
		},
		{
			property: "og:title",
			content: "Support & Contact — Reseller Panel"
		},
		{
			property: "og:description",
			content: "Call, WhatsApp or email the admin team for any reseller support need."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/reseller/theme.tsx
var $$splitComponentImporter$11 = () => import("./theme-DZAK-opH.js");
var Route$24 = createFileRoute("/_authenticated/reseller/theme")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
/** Tiny wireframe mock painted with a palette. */
/** Palette swatch row plus a text-on-color readability sample. */
//#endregion
//#region src/routes/_authenticated/reseller/transactions.tsx
var $$splitComponentImporter$10 = () => import("./transactions-BT41b0jh.js");
var Route$23 = createFileRoute("/_authenticated/reseller/transactions")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [
		{ title: "Transaction report — My earnings" },
		{
			name: "description",
			content: "Every order settlement, security deposit and withdraw of your store in one running-balance report."
		},
		{
			property: "og:title",
			content: "Transaction report — My earnings"
		},
		{
			property: "og:description",
			content: "Order profit, loss, deposits and withdrawals with running balance."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/reseller/tutorials.tsx
var $$splitComponentImporter$9 = () => import("./tutorials--HHAsbVo.js");
var Route$22 = createFileRoute("/_authenticated/reseller/tutorials")({
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	head: () => ({ meta: [
		{ title: "Video tutorials — Reseller Panel" },
		{
			name: "description",
			content: "Topic onujai video tutorial — store setup, order, courier o payout shikhun."
		},
		{
			property: "og:title",
			content: "Video tutorials — Reseller Panel"
		},
		{
			property: "og:description",
			content: "Store setup, order, courier o payout niye video guide."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/reseller/visitors.tsx
var $$splitComponentImporter$8 = () => import("./visitors-QR190haw.js");
var Route$21 = createFileRoute("/_authenticated/reseller/visitors")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/_authenticated/supplier/index.tsx
var $$splitComponentImporter$7 = () => import("./supplier-B19mbfWY.js");
var Route$20 = createFileRoute("/_authenticated/supplier/")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [
		{ title: "Supplier dashboard — Sales & payouts" },
		{
			name: "description",
			content: "Delivered sales, in-progress orders, returns and withdrawable balance for your products."
		},
		{
			property: "og:title",
			content: "Supplier dashboard — Sales & payouts"
		},
		{
			property: "og:description",
			content: "Track your product sales, returns and payouts in one place."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/supplier/media.tsx
var $$splitComponentImporter$6 = () => import("./media-BZZfgBxL.js");
var Route$19 = createFileRoute("/_authenticated/supplier/media")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
//#endregion
//#region src/routes/_authenticated/supplier/orders.tsx
var $$splitComponentImporter$5 = () => import("./orders-Bcif4QCi.js");
var Route$18 = createFileRoute("/_authenticated/supplier/orders")({
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [
		{ title: "Supplier orders · manage your product orders" },
		{
			name: "description",
			content: "View your product orders, confirm and package them, and book courier shipments."
		},
		{
			property: "og:title",
			content: "Supplier orders"
		},
		{
			property: "og:description",
			content: "Track and process the orders that contain your products."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/supplier/payouts.tsx
var $$splitComponentImporter$4 = () => import("./payouts-3NKUyUD0.js");
var Route$17 = createFileRoute("/_authenticated/supplier/payouts")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [
		{ title: "Payouts — Supplier panel" },
		{
			name: "description",
			content: "Withdraw the money earned from delivered items and follow every payout request."
		},
		{
			property: "og:title",
			content: "Payouts — Supplier panel"
		},
		{
			property: "og:description",
			content: "Supplier earning, available balance and withdrawal history."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/supplier/products.tsx
var $$splitComponentImporter$3 = () => import("./products-CtNVIMZ7.js");
var Route$16 = createFileRoute("/_authenticated/supplier/products")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
/** Read-only product detail — same layout language as the admin product detail modal, without platform pricing. */
/** Click-to-edit number cell — saves on blur/Enter, reverts on Escape. */
/** Copy every field of a product into a new-product draft — SKU is left blank. */
//#endregion
//#region src/routes/_authenticated/supplier/profile.tsx
var $$splitComponentImporter$2 = () => import("./profile-B0ZIhEow.js");
var Route$15 = createFileRoute("/_authenticated/supplier/profile")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/_authenticated/supplier/report.tsx
var $$splitComponentImporter$1 = () => import("./report-BzYSC8DH.js");
var Route$14 = createFileRoute("/_authenticated/supplier/report")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [
		{ title: "Supplier sales report · earnings breakdown" },
		{
			name: "description",
			content: "View earnings from delivered items and in-progress order values."
		},
		{
			property: "og:title",
			content: "Supplier sales report"
		},
		{
			property: "og:description",
			content: "Delivered earnings and in-progress order values."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/_authenticated/supplier/returns.tsx
var $$splitComponentImporter = () => import("./returns-BFEjnnnN.js");
var Route$13 = createFileRoute("/_authenticated/supplier/returns")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "Supplier returns · handover tracking" },
		{
			name: "description",
			content: "View returned items and admin handover status."
		},
		{
			property: "og:title",
			content: "Supplier returns"
		},
		{
			property: "og:description",
			content: "Track returned items and handover status."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] })
});
//#endregion
//#region src/routes/api/public/manifest.ts
/**
* Dynamic PWA manifest — uses the favicon set from Admin → Settings as the
* app icon, and the site name as the app name. Falls back to the bundled
* icons when no favicon has been uploaded yet.
*/
var Route$12 = createFileRoute("/api/public/manifest")({ server: { handlers: { GET: async () => {
	let siteName = "ResellSeba";
	let faviconUrl = null;
	let primaryColor = "#4f46e5";
	try {
		const { data } = await supabase.from("global_settings").select("site_name, favicon_url, primary_color").eq("id", 1).maybeSingle();
		if (data?.site_name) siteName = data.site_name;
		if (data?.favicon_url) faviconUrl = data.favicon_url;
		if (data?.primary_color) primaryColor = data.primary_color;
	} catch {}
	const icons = faviconUrl ? [
		{
			src: faviconUrl,
			sizes: "192x192",
			type: "image/png",
			purpose: "any"
		},
		{
			src: faviconUrl,
			sizes: "512x512",
			type: "image/png",
			purpose: "any"
		},
		{
			src: faviconUrl,
			sizes: "512x512",
			type: "image/png",
			purpose: "maskable"
		}
	] : [
		{
			src: "/pwa-192.png",
			sizes: "192x192",
			type: "image/png",
			purpose: "any"
		},
		{
			src: "/pwa-512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "any"
		},
		{
			src: "/pwa-512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "maskable"
		}
	];
	const manifest = {
		name: siteName,
		short_name: siteName.length > 12 ? siteName.slice(0, 12) : siteName,
		start_url: "/dashboard",
		scope: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: primaryColor || "#4f46e5",
		icons
	};
	return new Response(JSON.stringify(manifest), { headers: {
		"content-type": "application/manifest+json",
		"cache-control": "public, max-age=300"
	} });
} } } });
//#endregion
//#region src/routes/api/public/product.ts
/**
* Public product feed — lets another instance of this platform import a product
* by simply pasting a panel / storefront product link.
*
* GET /api/public/product?slug=<product-slug>
* GET /api/public/product?code=<product-code>
*
* Read-only, active products only, no cost/profit fields are exposed.
*/
var json$3 = (body, status = 200) => new Response(JSON.stringify(body), {
	status,
	headers: {
		"content-type": "application/json",
		"cache-control": "public, max-age=300",
		"access-control-allow-origin": "*"
	}
});
var Route$11 = createFileRoute("/api/public/product")({ server: { handlers: { GET: async ({ request }) => {
	const url = new URL(request.url);
	const slug = url.searchParams.get("slug")?.trim() || "";
	const code = url.searchParams.get("code")?.trim() || "";
	if (!slug && !code) return json$3({ error: "slug or code required" }, 400);
	let q = supabase.from("products").select("id, name, slug, sku, product_code, short_description, description, suggested_price, reseller_price, meta_title, meta_description, og_image_url, is_active, brands(name), categories(name), product_images(url, is_primary, sort_order)").eq("is_active", true).limit(1);
	q = slug ? q.eq("slug", slug) : q.eq("product_code", code.toUpperCase());
	const { data, error } = await q.maybeSingle();
	if (error) return json$3({ error: "lookup failed" }, 500);
	if (!data) return json$3({ error: "not found" }, 404);
	const images = [...data.product_images ?? []].sort((a, b) => Number(!!b.is_primary) - Number(!!a.is_primary) || Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)).map((i) => i.url).filter((u) => typeof u === "string" && u.startsWith("https://"));
	const brand = Array.isArray(data.brands) ? data.brands[0] : data.brands;
	const category = Array.isArray(data.categories) ? data.categories[0] : data.categories;
	return json$3({
		ok: true,
		product: {
			name: data.name,
			slug: data.slug,
			sku: data.sku ?? data.product_code ?? null,
			productCode: data.product_code ?? null,
			shortDescription: data.short_description ?? "",
			description: data.description ?? "",
			price: Number(data.suggested_price ?? data.reseller_price ?? 0) || null,
			currency: "BDT",
			brand: brand?.name ?? null,
			category: category?.name ?? null,
			metaTitle: data.meta_title ?? "",
			metaDescription: data.meta_description ?? "",
			images: images.length ? images : data.og_image_url ? [data.og_image_url] : []
		}
	});
} } } });
//#endregion
//#region src/routes/api/public/robots.ts
var Route$10 = createFileRoute("/api/public/robots")({ server: { handlers: { GET: () => new Response("User-agent: *\nAllow: /\n", { headers: {
	"content-type": "text/plain",
	"cache-control": "public, max-age=86400"
} }) } } });
//#endregion
//#region src/routes/api/public/courier.actions.ts
function getCourierConfigFromData(provider) {
	return (initial_data_default.courier_configs || []).find((c) => c.provider === provider)?.config || {};
}
var Route$9 = createFileRoute("/api/public/courier/actions")({ server: { handlers: {
	GET: async ({ request }) => {
		const action = new URL(request.url).searchParams.get("action");
		try {
			if (action === "steadfast-balance") {
				const conf = getCourierConfigFromData("steadfast");
				const apiKey = conf.api_key || "gjxtwjhxniitwuqkcthfnyaojqomw54y";
				const secretKey = conf.secret_key || "s1bppsevlct37lzbeovxhc8d";
				const base = (conf.base_url || "https://portal.packzy.com/api/v1").replace(/\/+$/, "");
				const res = await fetch(`${base}/get_balance`, { headers: {
					"Api-Key": apiKey,
					"Secret-Key": secretKey,
					"Content-Type": "application/json",
					Accept: "application/json"
				} });
				const text = await res.text();
				const body = text ? JSON.parse(text) : {};
				if (!res.ok) return new Response(JSON.stringify({
					success: false,
					message: body?.message || "Steadfast balance failed"
				}), {
					status: res.status,
					headers: { "Content-Type": "application/json" }
				});
				return new Response(JSON.stringify({
					success: true,
					balance: Number(body.current_balance ?? 0)
				}), {
					status: 200,
					headers: { "Content-Type": "application/json" }
				});
			}
			if (action === "pathao-stores") {
				const conf = getCourierConfigFromData("pathao");
				const token = (await (await fetch("https://api-hermes.pathao.com/aladdin/api/v1/issue-token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json"
					},
					body: JSON.stringify({
						client_id: conf.client_id || "nXe0L65exr",
						client_secret: conf.client_secret || "4UJJZbHVoZOBzKUCZdHChjtTqqeEKhcSEbfu3HdO",
						username: conf.username || "zahidha367@gmail.com",
						password: conf.password || "Zahid367//",
						grant_type: "password"
					})
				})).json()).access_token;
				if (!token) return new Response(JSON.stringify({
					success: false,
					message: "Pathao authentication failed"
				}), {
					status: 400,
					headers: { "Content-Type": "application/json" }
				});
				const storesBody = await (await fetch("https://api-hermes.pathao.com/aladdin/api/v1/stores", { headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json"
				} })).json();
				const stores = (storesBody?.data?.data || storesBody?.data || []).map((s) => ({
					id: String(s.store_id ?? s.id ?? ""),
					name: String(s.store_name ?? s.name ?? ""),
					address: String(s.store_address ?? s.address ?? ""),
					isActive: Boolean(s.is_active),
					isDefaultPickup: Boolean(s.is_default_store)
				})).filter((s) => s.id);
				return new Response(JSON.stringify({
					success: true,
					stores,
					defaultStoreId: String(conf.store_id || stores[0]?.id || "")
				}), {
					status: 200,
					headers: { "Content-Type": "application/json" }
				});
			}
			if (action === "carrybee-stores") {
				const conf = getCourierConfigFromData("carrybee");
				const body = await (await fetch("https://developers.carrybee.com/api/v2/stores", { headers: {
					"Client-ID": conf.client_id || "ce4a4884-b7a0-496c-b4de-4ea70d41f7fa",
					"Client-Secret": conf.client_secret || "3a5321d9-d540-4c47-beab-e529d1fe0464",
					"Client-Context": conf.client_context || "EG3MhxLZ9ck8reBm0UyPW6j1V2vblN",
					Accept: "application/json"
				} })).json();
				const stores = (body?.data?.stores || body?.data?.items || body?.data || []).map((s) => ({
					id: String(s.id ?? s.store_id ?? ""),
					name: String(s.name ?? s.store_name ?? ""),
					isApproved: s.status === "approved" || Boolean(s.is_approved),
					isActive: s.is_active !== false,
					isDefaultPickup: Boolean(s.is_default_pickup_store)
				})).filter((s) => s.id);
				return new Response(JSON.stringify({
					success: true,
					stores,
					defaultStoreId: String(conf.store_id || stores.find((s) => s.isDefaultPickup)?.id || stores[0]?.id || "")
				}), {
					status: 200,
					headers: { "Content-Type": "application/json" }
				});
			}
			return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
		} catch (err) {
			return new Response(JSON.stringify({
				success: false,
				message: err?.message || String(err)
			}), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	},
	POST: async ({ request }) => {
		try {
			const body = await request.json();
			const { action, provider = "steadfast", orderId, storeId } = body || {};
			if (action === "book" || provider) {
				const foundOrder = (initial_data_default.orders || []).find((o) => o.id === orderId || o.order_number === orderId);
				const order = body.order || foundOrder || {
					id: orderId,
					order_number: String(orderId).replace(/^order-/, "").split("-")[0] || "703280",
					customer_name: body.customer_name || "MD Jahid Hasan",
					customer_phone: body.customer_phone || "01733831300",
					address_line: body.address_line || "Dhaka",
					city: body.city || "Dhaka",
					total: body.total || 810,
					payment_method: body.payment_method || "cod"
				};
				const items = (initial_data_default.order_items || []).filter((i) => i.order_id === order.id || i.order_id === orderId);
				const total = Number(order.total || 0);
				const advance = Number(order.advance_amount || order.received_amount || order.advance || 0);
				let codAmount = 0;
				if (order.payment_status === "paid") codAmount = 0;
				else if (order.payment_method === "cod" || !order.payment_method) codAmount = Math.max(0, total - advance);
				else codAmount = 0;
				const fullAddress = [
					order.address_line,
					order.area,
					order.city
				].filter(Boolean).join(", ");
				const itemDesc = (items.length > 0 ? items.map((i) => `${i.product_name} x${i.quantity}`).join(", ") : "Parcel Items") || "Parcel Item";
				if (provider === "steadfast") {
					const conf = getCourierConfigFromData("steadfast");
					const apiKey = conf.api_key || "gjxtwjhxniitwuqkcthfnyaojqomw54y";
					const secretKey = conf.secret_key || "s1bppsevlct37lzbeovxhc8d";
					const base = (conf.base_url || "https://portal.packzy.com/api/v1").replace(/\/+$/, "");
					const sfPayload = {
						invoice: String(order.order_number),
						recipient_name: String(order.customer_name || "Customer").slice(0, 100),
						recipient_phone: String(order.customer_phone || "01700000000").replace(/[^0-9]/g, "").slice(-11),
						recipient_address: fullAddress || "Dhaka, Bangladesh",
						cod_amount: codAmount,
						note: (order.reseller_note || order.notes || "")?.slice(0, 250) || void 0,
						item_description: itemDesc.slice(0, 250),
						total_lot: items.reduce((s, i) => s + Number(i.quantity || 0), 0) || 1,
						delivery_type: 0
					};
					const res = await fetch(`${base}/create_order`, {
						method: "POST",
						headers: {
							"Api-Key": apiKey,
							"Secret-Key": secretKey,
							"Content-Type": "application/json",
							Accept: "application/json"
						},
						body: JSON.stringify(sfPayload)
					});
					const text = await res.text();
					let resData = {};
					try {
						resData = JSON.parse(text);
					} catch {
						resData = { message: text };
					}
					if (!res.ok || resData.status !== 200) return new Response(JSON.stringify({
						success: false,
						message: resData.message || resData.errors || `Steadfast booking failed (${res.status})`
					}), {
						status: 400,
						headers: { "Content-Type": "application/json" }
					});
					const consignment = resData.consignment || {};
					const trackingCode = consignment.tracking_code || String(consignment.consignment_id ?? "");
					const trackingUrl = consignment.tracking_link || `https://steadfast.com.bd/tl/${trackingCode}`;
					return new Response(JSON.stringify({
						success: true,
						provider: "steadfast",
						trackingId: trackingCode,
						consignmentId: String(consignment.consignment_id ?? ""),
						trackingUrl,
						status: consignment.status || "in_review"
					}), {
						status: 200,
						headers: { "Content-Type": "application/json" }
					});
				}
				if (provider === "carrybee") {
					const conf = getCourierConfigFromData("carrybee");
					const effectiveStoreId = storeId || conf.store_id || "17199";
					const cbPayload = {
						store_id: Number(effectiveStoreId),
						merchant_order_id: String(order.order_number),
						recipient_name: String(order.customer_name || "Customer").slice(0, 100),
						recipient_phone: String(order.customer_phone || "01700000000").replace(/[^0-9]/g, "").slice(-11),
						recipient_address: fullAddress || "Dhaka, Bangladesh",
						recipient_city: 14,
						recipient_zone: 57,
						recipient_area: 2110,
						delivery_type: 1,
						product_type: 1,
						item_weight: 200,
						item_quantity: items.reduce((s, i) => s + Number(i.quantity || 0), 0) || 1,
						collectable_amount: codAmount,
						product_description: itemDesc.slice(0, 255)
					};
					const res = await fetch("https://developers.carrybee.com/api/v2/orders", {
						method: "POST",
						headers: {
							"Client-ID": conf.client_id || "ce4a4884-b7a0-496c-b4de-4ea70d41f7fa",
							"Client-Secret": conf.client_secret || "3a5321d9-d540-4c47-beab-e529d1fe0464",
							"Client-Context": conf.client_context || "EG3MhxLZ9ck8reBm0UyPW6j1V2vblN",
							"Content-Type": "application/json",
							Accept: "application/json"
						},
						body: JSON.stringify(cbPayload)
					});
					const text = await res.text();
					let resData = {};
					try {
						resData = JSON.parse(text);
					} catch {
						resData = { message: text };
					}
					if (!res.ok || resData.error === true) return new Response(JSON.stringify({
						success: false,
						message: resData.message || `Carrybee booking failed (${res.status})`
					}), {
						status: 400,
						headers: { "Content-Type": "application/json" }
					});
					const o = resData?.data?.order || resData?.data || {};
					const consignmentId = String(o.consignment_id ?? "");
					return new Response(JSON.stringify({
						success: true,
						provider: "carrybee",
						trackingId: consignmentId,
						consignmentId,
						status: "created"
					}), {
						status: 200,
						headers: { "Content-Type": "application/json" }
					});
				}
				if (provider === "pathao") {
					const conf = getCourierConfigFromData("pathao");
					const effectiveStoreId = storeId || conf.store_id || "441826";
					const token = (await (await fetch("https://api-hermes.pathao.com/aladdin/api/v1/issue-token", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json"
						},
						body: JSON.stringify({
							client_id: conf.client_id || "nXe0L65exr",
							client_secret: conf.client_secret || "4UJJZbHVoZOBzKUCZdHChjtTqqeEKhcSEbfu3HdO",
							username: conf.username || "zahidha367@gmail.com",
							password: conf.password || "Zahid367//",
							grant_type: "password"
						})
					})).json()).access_token;
					if (!token) return new Response(JSON.stringify({
						success: false,
						message: "Pathao authentication failed"
					}), {
						status: 400,
						headers: { "Content-Type": "application/json" }
					});
					const pPayload = {
						store_id: Number(effectiveStoreId),
						merchant_order_id: String(order.order_number),
						recipient_name: String(order.customer_name || "Customer").slice(0, 100),
						recipient_phone: String(order.customer_phone || "01700000000").replace(/[^0-9]/g, "").slice(-11),
						recipient_address: fullAddress || "Dhaka, Bangladesh",
						recipient_city: 1,
						recipient_zone: 19,
						delivery_type: 48,
						item_type: 2,
						special_instruction: (order.reseller_note || order.notes || "")?.slice(0, 250) || void 0,
						item_quantity: items.reduce((s, i) => s + Number(i.quantity || 0), 0) || 1,
						item_weight: .2,
						amount_to_collect: codAmount,
						item_description: itemDesc.slice(0, 250)
					};
					const pRes = await fetch("https://api-hermes.pathao.com/aladdin/api/v1/orders", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
							Accept: "application/json"
						},
						body: JSON.stringify(pPayload)
					});
					const pText = await pRes.text();
					let pData = {};
					try {
						pData = JSON.parse(pText);
					} catch {
						pData = { message: pText };
					}
					if (!pRes.ok) return new Response(JSON.stringify({
						success: false,
						message: pData.message || `Pathao booking failed (${pRes.status})`
					}), {
						status: 400,
						headers: { "Content-Type": "application/json" }
					});
					const consignmentId = String(pData?.data?.consignment_id ?? "");
					return new Response(JSON.stringify({
						success: true,
						provider: "pathao",
						trackingId: consignmentId,
						consignmentId,
						status: "Pending"
					}), {
						status: 200,
						headers: { "Content-Type": "application/json" }
					});
				}
			}
			return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
		} catch (err) {
			return new Response(JSON.stringify({
				success: false,
				message: err?.message || String(err)
			}), {
				status: 500,
				headers: { "Content-Type": "application/json" }
			});
		}
	}
} } });
//#endregion
//#region src/routes/api/public/courier.carrybee.ts
/**
* Carrybee webhook receiver.
*
* Configure in Carrybee merchant panel → Webhook Integration:
*   https://<your-domain>/api/public/courier/carrybee
*   Secret: the "Webhook Secret" saved in Couriers → Carrybee settings
*
* Requirements handled here:
*  - integration/handshake request returns 202 and echoes back
*    `X-CB-Webhook-Integration-Header` with the exact secret value.
*  - `X-Carrybee-Webhook-Signature` is verified (HMAC-SHA256 of the raw body
*    with the shared secret) when Carrybee sends it.
*/
var INTEGRATION_HEADER$1 = "x-cb-webhook-integration-header";
var SIGNATURE_HEADER$1 = "x-carrybee-webhook-signature";
function json$2(body, status, headers = {}) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			...headers
		}
	});
}
async function hmacHex(secret, body) {
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
	return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var Route$8 = createFileRoute("/api/public/courier/carrybee")({ server: { handlers: {
	POST: async ({ request }) => {
		const { supabaseAdmin } = await import("./client.server-_30CTp3i.js");
		const { applyCourierUpdate } = await import("./couriers.server-DHhjOSL2.js");
		const { data: cfg } = await supabaseAdmin.from("courier_configs").select("config").eq("provider", "carrybee").maybeSingle();
		const secret = String((cfg?.config)?.webhook_secret ?? "");
		if (!secret) return json$2({
			error: true,
			message: "Webhook secret not configured"
		}, 401);
		const integrationSecret = request.headers.get(INTEGRATION_HEADER$1) ?? "";
		const raw = await request.text();
		if (integrationSecret) {
			if (integrationSecret !== secret) return json$2({
				error: true,
				message: "Invalid integration secret"
			}, 401);
			return json$2({
				error: false,
				message: "Webhook integrated"
			}, 202, { "X-CB-Webhook-Integration-Header": secret });
		}
		const signature = (request.headers.get(SIGNATURE_HEADER$1) ?? "").trim().replace(/^sha256=/, "");
		if (signature) {
			const expected = await hmacHex(secret, raw);
			if (signature.toLowerCase() !== expected.toLowerCase()) return json$2({
				error: true,
				message: "Invalid signature"
			}, 401);
		} else if ((new URL(request.url).searchParams.get("token") ?? "") !== secret) return json$2({
			error: true,
			message: "Unauthorized"
		}, 401);
		let payload;
		try {
			payload = raw ? JSON.parse(raw) : null;
		} catch {
			return json$2({
				error: true,
				message: "Invalid JSON"
			}, 400);
		}
		const events = Array.isArray(payload) ? payload : payload ? [payload] : [];
		if (events.length === 0) return json$2({
			error: true,
			message: "Empty payload"
		}, 400);
		let matched = 0;
		for (const e of events) {
			const event = e?.event;
			if (!event) continue;
			const note = [
				e.reason,
				e.remarks,
				e.agent_name ? `Agent: ${e.agent_name} ${e.agent_phone ?? ""}` : null
			].filter(Boolean).join(" · ") || null;
			if ((await applyCourierUpdate(supabaseAdmin, {
				provider: "carrybee",
				consignmentId: e.consignment_id != null ? String(e.consignment_id) : null,
				trackingCode: e.consignment_id != null ? String(e.consignment_id) : null,
				invoice: e.merchant_order_id ?? null,
				courierStatus: String(event),
				source: "webhook",
				notificationType: String(event),
				codAmount: e.collected_amount != null ? Number(e.collected_amount) : e.collectable_amount != null ? Number(e.collectable_amount) : null,
				deliveryCharge: e.delivery_fee != null ? Number(e.delivery_fee) : null,
				note,
				payload: e
			})).matched) matched += 1;
		}
		return json$2({
			error: false,
			message: "processed",
			matched
		}, 200);
	},
	GET: async () => json$2({
		error: false,
		message: "Carrybee webhook endpoint"
	}, 200)
} } });
//#endregion
//#region src/routes/api/public/courier.pathao.ts
/**
* Pathao webhook receiver.
*
* Configure in Pathao merchant panel → Webhook Integration:
*   https://<your-domain>/api/public/courier/pathao
*   Secret: the "Webhook Secret" saved in Couriers → Pathao settings
*
* Requirements handled here:
*  - every response echoes `X-Pathao-Merchant-Webhook-Integration-Secret` with
*    the configured secret (Pathao's integration check requires it),
*  - `X-PATHAO-Signature` header must match the configured secret,
*  - responds fast (well within Pathao's 10s limit).
*/
var SIGNATURE_HEADER = "x-pathao-signature";
var INTEGRATION_HEADER = "X-Pathao-Merchant-Webhook-Integration-Secret";
function json$1(body, status, secret) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			...secret ? { [INTEGRATION_HEADER]: secret } : {}
		}
	});
}
var Route$7 = createFileRoute("/api/public/courier/pathao")({ server: { handlers: {
	POST: async ({ request }) => {
		const raw = await request.text();
		let payload;
		try {
			payload = raw ? JSON.parse(raw) : null;
		} catch {
			return json$1({
				error: true,
				message: "Invalid JSON"
			}, 400);
		}
		const events = Array.isArray(payload) ? payload : payload ? [payload] : [];
		const envIntegration = String(process.env["PATHAO_INTEGRATION_SECRET"] ?? "");
		const envSecret = String(process.env["PATHAO_WEBHOOK_SECRET"] ?? "");
		if (events.some((e) => String(e?.event ?? "") === "webhook_integration")) {
			let integrationSecret = envIntegration || envSecret;
			if (!integrationSecret) {
				const backendUrl = String(process.env["SUPABASE_URL"] ?? "");
				const publishableKey = String(process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "");
				if (backendUrl && publishableKey) try {
					const response = await fetch(`${backendUrl}/rest/v1/rpc/pathao_webhook_handshake_secret`, {
						method: "POST",
						headers: {
							apikey: publishableKey,
							"Content-Type": "application/json"
						},
						body: "{}"
					});
					if (response.ok) {
						const value = await response.json();
						if (typeof value === "string") integrationSecret = value.trim();
					}
				} catch {}
			}
			return json$1({
				error: false,
				message: "webhook_integration acknowledged"
			}, 202, integrationSecret || void 0);
		}
		const { supabaseAdmin } = await import("./client.server-_30CTp3i.js");
		const { applyCourierUpdate } = await import("./couriers.server-DHhjOSL2.js");
		const { data: cfg } = await supabaseAdmin.from("courier_configs").select("config").eq("provider", "pathao").maybeSingle();
		const secret = String((cfg?.config)?.webhook_secret ?? "") || envSecret;
		if (!secret) return json$1({
			error: true,
			message: "Webhook secret not configured"
		}, 401);
		const signature = (request.headers.get(SIGNATURE_HEADER) ?? "").trim();
		const tokenOk = (new URL(request.url).searchParams.get("token") ?? "") === secret;
		if (signature !== secret && !tokenOk) return json$1({
			error: true,
			message: "Invalid signature"
		}, 401, secret);
		if (events.length === 0) return json$1({
			error: true,
			message: "Empty payload"
		}, 400, secret);
		let matched = 0;
		for (const e of events) {
			const event = String(e?.event ?? "");
			if (!event || event.startsWith("store.")) continue;
			const note = [
				e.reason,
				e.return_type ? `Return type: ${e.return_type}` : null,
				e.invoice_id ? `Invoice: ${e.invoice_id}` : null
			].filter(Boolean).join(" · ") || null;
			if ((await applyCourierUpdate(supabaseAdmin, {
				provider: "pathao",
				consignmentId: e.consignment_id != null ? String(e.consignment_id) : null,
				trackingCode: e.consignment_id != null ? String(e.consignment_id) : null,
				invoice: e.merchant_order_id ?? null,
				courierStatus: event,
				source: "webhook",
				notificationType: event,
				codAmount: e.collected_amount != null ? Number(e.collected_amount) : null,
				deliveryCharge: e.delivery_fee != null ? Number(e.delivery_fee) : null,
				note,
				payload: e
			})).matched) matched += 1;
		}
		return json$1({
			error: false,
			message: "processed",
			matched
		}, 200, secret);
	},
	GET: async () => {
		const { supabaseAdmin } = await import("./client.server-_30CTp3i.js");
		const { data: cfg } = await supabaseAdmin.from("courier_configs").select("config").eq("provider", "pathao").maybeSingle();
		return json$1({
			error: false,
			message: "Pathao webhook endpoint"
		}, 200, String((cfg?.config)?.webhook_secret ?? "") || void 0);
	}
} } });
//#endregion
//#region src/routes/api/public/courier.steadfast.ts
/**
* Steadfast delivery-status webhook.
*
* Configure this URL in the Steadfast merchant panel:
*   https://<your-domain>/api/public/courier/steadfast?token=<webhook_token>
*
* The token must match `webhook_token` saved in Couriers → Steadfast settings.
* Steadfast posts JSON like:
*   { notification_type, consignment_id, invoice, cod_amount, status,
*     delivery_charge, updated_at }
*/
var Route$6 = createFileRoute("/api/public/courier/steadfast")({ server: { handlers: {
	POST: async ({ request }) => {
		const { supabaseAdmin } = await import("./client.server-_30CTp3i.js");
		const { applyCourierUpdate } = await import("./couriers.server-DHhjOSL2.js");
		const provided = new URL(request.url).searchParams.get("token") ?? request.headers.get("x-steadfast-token") ?? request.headers.get("steadfast-webhook-token") ?? "";
		const { data: cfg } = await supabaseAdmin.from("courier_configs").select("config").eq("provider", "steadfast").maybeSingle();
		const expected = String((cfg?.config)?.webhook_token ?? "");
		if (!expected || provided !== expected) return new Response(JSON.stringify({
			status: 401,
			message: "Invalid token"
		}), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
		const raw = await request.text();
		let payload;
		try {
			payload = raw ? JSON.parse(raw) : null;
		} catch {
			return new Response(JSON.stringify({
				status: 400,
				message: "Invalid JSON"
			}), {
				status: 400,
				headers: { "Content-Type": "application/json" }
			});
		}
		const events = Array.isArray(payload) ? payload : payload ? [payload] : [];
		if (events.length === 0) return new Response(JSON.stringify({
			status: 400,
			message: "Empty payload"
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		let matched = 0;
		for (const e of events) {
			const status = e?.status ?? e?.delivery_status;
			if (!status) continue;
			if ((await applyCourierUpdate(supabaseAdmin, {
				consignmentId: e.consignment_id != null ? String(e.consignment_id) : null,
				trackingCode: e.tracking_code ?? null,
				invoice: e.invoice ?? null,
				courierStatus: String(status),
				source: "webhook",
				notificationType: e.notification_type ?? null,
				codAmount: e.cod_amount != null ? Number(e.cod_amount) : null,
				deliveryCharge: e.delivery_charge != null ? Number(e.delivery_charge) : null,
				note: e.note ?? null,
				payload: e
			})).matched) matched += 1;
		}
		return new Response(JSON.stringify({
			status: 200,
			message: "processed",
			matched
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	},
	GET: async () => new Response(JSON.stringify({
		status: 200,
		message: "Steadfast webhook endpoint"
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	})
} } });
//#endregion
//#region src/routes/api/public/courier.sync.ts
/**
* Automatic courier status sync.
*
* Webhooks can be missed (misconfigured URL, courier outage, custom domain),
* so this endpoint polls every shipment that is not yet in a final state and
* applies the live courier status. Meant to be called on a schedule with the
* cron bearer secret.
*/
var Route$5 = createFileRoute("/api/public/courier/sync")({ server: { handlers: {
	POST: async ({ request }) => {
		const { authenticateCronRequest } = await import("./cron-auth-BcSyztdx.js");
		if (!await authenticateCronRequest(request)) return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
		const { supabaseAdmin } = await import("./client.server-_30CTp3i.js");
		const { syncPendingShipments } = await import("./couriers.server-DHhjOSL2.js");
		const result = await syncPendingShipments(supabaseAdmin);
		return new Response(JSON.stringify({
			status: 200,
			...result
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	},
	GET: async () => new Response(JSON.stringify({
		status: 200,
		message: "Courier sync endpoint"
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	})
} } });
//#endregion
//#region src/routes/api/public/payment.bridge.ts
/**
* Payment bridge.
*
* Reseller storefronts and brand domains run through Cloudflare, where the
* privileged backend key is not injected. Those requests forward their payment
* step here, to the platform origin, which does have it.
*
* Security:
* - Order start/verify accept only an order number and derive every amount
*   server-side, exactly like the public server functions they replace.
* - Deposit start requires a valid signed-in bearer token, which is validated
*   here before anything is written.
* - No credentials are ever returned to the caller.
*/
var Body = objectType({
	op: enumType([
		"order-start",
		"order-verify",
		"deposit-start",
		"list-store",
		"list-deposit"
	]),
	origin: stringType().url().optional(),
	orderNumber: stringType().min(3).optional(),
	code: stringType().min(1).optional(),
	provider: stringType().min(2).optional(),
	amount: numberType().positive().max(1e7).optional()
});
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" }
	});
}
async function userFromBearer(request) {
	const header = request.headers.get("authorization") ?? "";
	if (!(header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "")) return null;
	const { supabase } = await import("./client-CLBrUPi_.js").then((n) => n.t);
	const { data } = await supabase.auth.getUser();
	return data.user?.id ?? null;
}
async function handle$2(request) {
	let input;
	try {
		input = Body.parse(await request.json());
	} catch {
		return json({ error: "Invalid request" }, 400);
	}
	const bridge = await import("./bridge.server-BhXIjTWa.js");
	if (!bridge.hasPrivilegedDb()) try {
		const { op, ...rest } = input;
		return json(await bridge.forwardToPlatform(op, rest, request.headers.get("authorization")));
	} catch (err) {
		if (err instanceof Response) return json({ error: await err.text() }, err.status || 500);
		return json({ error: "Payment backend unavailable" }, 503);
	}
	const flows = await import("./flows.server-BkilrID9.js");
	try {
		switch (input.op) {
			case "list-store":
				if (!input.code) return json({ error: "Missing store code" }, 400);
				return json(await flows.listStoreGatewaysFlow({ code: input.code }));
			case "list-deposit":
				if (!await userFromBearer(request)) return json({ error: "Unauthorized" }, 401);
				return json(await flows.listDepositGatewaysFlow());
			case "order-start":
				if (!input.orderNumber || !input.code || !input.provider) return json({ error: "Invalid request" }, 400);
				return json(await flows.startOrderPaymentFlow({
					orderNumber: input.orderNumber,
					code: input.code,
					provider: input.provider,
					storeOrigin: input.origin
				}));
			case "order-verify":
				if (!input.orderNumber) return json({ error: "Invalid request" }, 400);
				return json(await flows.verifyOrderPaymentFlow({ orderNumber: input.orderNumber }));
			case "deposit-start": {
				const userId = await userFromBearer(request);
				if (!userId) return json({ error: "Unauthorized" }, 401);
				if (!input.provider || !input.amount) return json({ error: "Invalid request" }, 400);
				return json(await flows.startDepositFlow({
					userId,
					provider: input.provider,
					amount: input.amount,
					storeOrigin: input.origin
				}));
			}
		}
	} catch (err) {
		if (err instanceof Response) return json({ error: await err.text() || "Payment failed" }, err.status || 500);
		return json({ error: err instanceof Error ? err.message : "Payment failed" }, 500);
	}
}
var Route$4 = createFileRoute("/api/public/payment/bridge")({ server: { handlers: { POST: ({ request }) => handle$2(request) } } });
//#endregion
//#region src/routes/api/public/payment.epayseba-webhook.ts
/**
* ePaySeba webhook. Signature (when a secret key is configured) is checked
* first, then the payment is re-verified through the provider API.
*/
var Route$3 = createFileRoute("/api/public/payment/epayseba-webhook")({ server: { handlers: { POST: async ({ request }) => {
	const core = await import("./core.server-CnuqbtHb.js");
	const { adapterFor } = await import("./adapters.server-BGBQL2uI.js");
	const raw = await request.text();
	let payload = {};
	try {
		payload = JSON.parse(raw);
	} catch {
		new URLSearchParams(raw).forEach((v, k) => payload[k] = v);
	}
	const orderNumber = String(payload.order_id ?? payload.invoice ?? payload.reference ?? "");
	if (!orderNumber) return new Response("missing order id", { status: 400 });
	try {
		const order = await core.loadOrder(orderNumber);
		if (order.payment_status === "paid") return new Response("ok");
		const creds = await core.getCredentials("epayseba", order.reseller_id);
		if (!creds) return new Response("not configured", { status: 400 });
		if (creds.api_secret) {
			const signature = request.headers.get("x-epayseba-signature") ?? request.headers.get("x-signature") ?? "";
			const { createHmac, timingSafeEqual } = await import("node:crypto");
			const expected = createHmac("sha256", creds.api_secret).update(raw).digest("hex");
			if (!(signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))) return new Response("invalid signature", { status: 401 });
		}
		const params = {};
		for (const [k, v] of Object.entries(payload)) params[k] = String(v ?? "");
		const v = await adapterFor("epayseba").verifyReturn(creds, order, params);
		await core.settlePayment({
			order,
			provider: "epayseba",
			paid: v.paid,
			amount: v.amount,
			txnId: v.txnId
		});
		return new Response("ok");
	} catch {
		return new Response("error", { status: 200 });
	}
} } } });
//#endregion
//#region src/routes/api/public/payment.sslcommerz-ipn.ts
/**
* SSLCommerz IPN. Server-to-server, so the payload is never trusted: the
* transaction is re-validated through the validator API before settling.
*/
async function handle$1(request) {
	const core = await import("./core.server-CnuqbtHb.js");
	const { adapterFor } = await import("./adapters.server-BGBQL2uI.js");
	const params = {};
	new URL(request.url).searchParams.forEach((v, k) => params[k] = v);
	if (request.method === "POST") {
		const body = await request.text();
		new URLSearchParams(body).forEach((v, k) => params[k] = v);
	}
	const orderNumber = params.tran_id ?? params.on ?? "";
	if (!orderNumber) return new Response("missing tran_id", { status: 400 });
	try {
		const order = await core.loadOrder(orderNumber);
		if (order.payment_status === "paid") return new Response("ok");
		const creds = await core.getCredentials("sslcommerz", order.reseller_id);
		if (!creds) return new Response("not configured", { status: 400 });
		const v = await adapterFor("sslcommerz").verifyReturn(creds, order, params);
		await core.settlePayment({
			order,
			provider: "sslcommerz",
			paid: v.paid,
			amount: v.amount,
			txnId: v.txnId
		});
		return new Response("ok");
	} catch {
		return new Response("error", { status: 200 });
	}
}
var Route$2 = createFileRoute("/api/public/payment/sslcommerz-ipn")({ server: { handlers: {
	GET: ({ request }) => handle$1(request),
	POST: ({ request }) => handle$1(request)
} } });
//#endregion
//#region src/routes/api/public/sitemap.$code.ts
var Route$1 = createFileRoute("/api/public/sitemap/$code")({ server: { handlers: { GET: async ({ params, request }) => {
	const origin = new URL(request.url).origin;
	const { data: r } = await supabase.from("resellers").select("id, code").eq("code", params.code).eq("status", "active").maybeSingle();
	if (!r) return new Response("Not found", { status: 404 });
	const { data: dom } = await supabase.from("reseller_domains").select("hostname, is_primary, ssl_status").eq("reseller_id", r.id).not("verified_at", "is", null).order("is_primary", { ascending: false }).limit(1).maybeSingle();
	const custom = dom?.hostname ?? null;
	const { data: listings } = await supabase.from("reseller_listings").select("updated_at, products(slug, updated_at)").eq("reseller_id", r.id).eq("is_active", true);
	const urls = [`<url><loc>${custom ? `https://${custom}` : `${origin}/s/${r.code}`}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`, ...(listings ?? []).map((l) => {
		const p = Array.isArray(l.products) ? l.products[0] : l.products;
		if (!p) return "";
		const path = custom ? `/p/${p.slug}` : `/s/${r.code}/p/${p.slug}`;
		return `<url><loc>${custom ? `https://${custom}${path}` : `${origin}${path}`}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod></url>`;
	})].join("");
	return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: {
		"content-type": "application/xml",
		"cache-control": "public, max-age=3600"
	} });
} } } });
//#endregion
//#region src/routes/api/public/payment.$provider.return.ts
/**
* Single return endpoint every automatic gateway is pointed at.
* Gateways may GET or form-POST here, so both verbs are handled and the final
* hop back to the app is an HTML redirect (a 302 breaks POST returns).
*
* Nothing in the query string is trusted: the outcome is always re-verified
* against the gateway API before anything is marked paid.
*
* Two kinds of payments come back here:
* - `k=order` (default) → a storefront order
* - `k=deposit`         → a reseller security deposit
*/
async function handle(request, provider) {
	const core = await import("./core.server-CnuqbtHb.js");
	const { adapterFor } = await import("./adapters.server-BGBQL2uI.js");
	const { gatewayByProvider } = await import("./registry-I6SFzk_W.js").then((n) => n.a);
	const url = new URL(request.url);
	const params = {};
	url.searchParams.forEach((v, k) => params[k] = v);
	if (request.method === "POST") {
		const body = await request.text();
		new URLSearchParams(body).forEach((v, k) => params[k] = v);
	}
	const ref = params.on ?? params.tran_id ?? params.order_id ?? "";
	const origin = core.siteOrigin();
	const signed = await core.verifyTargets(params.su, params.cu, params.sig);
	const success = signed ? params.su : await core.resolveReturnTarget(params.su, origin);
	const cancel = signed ? params.cu : await core.resolveReturnTarget(params.cu, success);
	const flag = gatewayByProvider(provider)?.returnFlag ?? provider;
	if (!ref) return core.htmlRedirect(core.appendFlag(cancel, flag, "failed"));
	if (params.k === "deposit") try {
		const intent = await core.loadDepositIntent(ref);
		if (!intent) return core.htmlRedirect(core.appendFlag(cancel, flag, "failed"));
		if (intent.status === "approved") return core.htmlRedirect(core.appendFlag(success, flag, "paid"));
		if (params.t === "cancel") return core.htmlRedirect(core.appendFlag(cancel, flag, "cancelled"));
		const creds = await core.getPlatformCredentials(provider);
		if (!creds) return core.htmlRedirect(core.appendFlag(cancel, flag, "failed"));
		const pseudo = core.depositAsOrder(intent);
		const v = await adapterFor(provider).verifyReturn(creds, pseudo, params);
		const outcome = await core.settleDeposit({
			intent,
			provider,
			paid: v.paid,
			amount: v.amount,
			txnId: v.txnId
		});
		const ok = outcome === "paid" || outcome === "already";
		const status = ok ? "paid" : v.cancelled ? "cancelled" : "failed";
		return core.htmlRedirect(core.appendFlag(ok ? success : cancel, flag, status, v.txnId));
	} catch {
		return core.htmlRedirect(core.appendFlag(cancel, flag, "failed"));
	}
	try {
		const order = await core.loadOrder(ref);
		if (order.payment_status === "paid") return core.htmlRedirect(core.appendFlag(success, flag, "paid"));
		if (params.t === "cancel") return core.htmlRedirect(core.appendFlag(cancel, flag, "cancelled"));
		const creds = await core.getCredentials(provider, order.reseller_id);
		if (!creds) return core.htmlRedirect(core.appendFlag(cancel, flag, "failed"));
		const v = await adapterFor(provider).verifyReturn(creds, order, params);
		const outcome = await core.settlePayment({
			order,
			provider,
			paid: v.paid,
			amount: v.amount,
			txnId: v.txnId,
			owner: creds.owner
		});
		const status = outcome === "paid" || outcome === "already" ? "paid" : outcome === "partial" ? "partial" : v.cancelled ? "cancelled" : "failed";
		const target = status === "failed" || status === "cancelled" ? cancel : success;
		return core.htmlRedirect(core.appendFlag(target, flag, status, v.txnId));
	} catch {
		return core.htmlRedirect(core.appendFlag(cancel, flag, "failed"));
	}
}
var Route = createFileRoute("/api/public/payment/$provider/return")({ server: { handlers: {
	GET: ({ request, params }) => handle(request, params.provider),
	POST: ({ request, params }) => handle(request, params.provider)
} } });
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$85.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$86
});
var AuthenticatedRouteRoute = Route$84.update({
	id: "/_authenticated",
	getParentRoute: () => Route$86
});
var CatalogRoute = Route$83.update({
	id: "/catalog",
	path: "/catalog",
	getParentRoute: () => Route$86
});
var LoginRoute = Route$87.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$86
});
var PrivacyRoute = Route$82.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$86
});
var RegisterRoute = Route$81.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$86
});
var TutorialsRoute = Route$80.update({
	id: "/tutorials",
	path: "/tutorials",
	getParentRoute: () => Route$86
});
var AuthenticatedAdminRouteRoute = Route$79.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$78.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOnboardingRoute = Route$77.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedResellerRouteRoute = Route$76.update({
	id: "/reseller",
	path: "/reseller",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSupplierRouteRoute = Route$75.update({
	id: "/supplier",
	path: "/supplier",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedVerifyRoute = Route$74.update({
	id: "/verify",
	path: "/verify",
	getParentRoute: () => AuthenticatedRouteRoute
});
var CatalogIndexRoute = Route$88.update({
	id: "/",
	path: "/",
	getParentRoute: () => CatalogRoute
});
var CatalogSlugRoute = Route$89.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => CatalogRoute
});
var SCodeRoute = Route$90.update({
	id: "/s/$code",
	path: "/s/$code",
	getParentRoute: () => Route$86
});
var AuthenticatedAdminIndexRoute = Route$73.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminAdvancedRoute = Route$72.update({
	id: "/advanced",
	path: "/advanced",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminAgentPayoutsRoute = Route$71.update({
	id: "/agent-payouts",
	path: "/agent-payouts",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminAgentReportRoute = Route$70.update({
	id: "/agent-report",
	path: "/agent-report",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminAgentsRoute = Route$69.update({
	id: "/agents",
	path: "/agents",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminBackupRoute = Route$68.update({
	id: "/backup",
	path: "/backup",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminBrandsRoute = Route$67.update({
	id: "/brands",
	path: "/brands",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminBusinessReportRoute = Route$66.update({
	id: "/business-report",
	path: "/business-report",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminCategoriesRoute = Route$65.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminCommissionsRoute = Route$64.update({
	id: "/commissions",
	path: "/commissions",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminCouriersRoute = Route$63.update({
	id: "/couriers",
	path: "/couriers",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminCustomersRoute = Route$62.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminDepositTransactionsRoute = Route$61.update({
	id: "/deposit-transactions",
	path: "/deposit-transactions",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminDepositsRoute = Route$60.update({
	id: "/deposits",
	path: "/deposits",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminDomainsRoute = Route$59.update({
	id: "/domains",
	path: "/domains",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminExpensesRoute = Route$58.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminLandingRoute = Route$57.update({
	id: "/landing",
	path: "/landing",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminMaintenanceRoute = Route$56.update({
	id: "/maintenance",
	path: "/maintenance",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminMarketingRoute = Route$55.update({
	id: "/marketing",
	path: "/marketing",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminMediaRoute = Route$54.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminNoticesRoute = Route$53.update({
	id: "/notices",
	path: "/notices",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminNotificationsRoute = Route$52.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminOrdersRoute = Route$91.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminPaymentsRoute = Route$51.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminPayoutsRoute = Route$92.update({
	id: "/payouts",
	path: "/payouts",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminPoliciesRoute = Route$50.update({
	id: "/policies",
	path: "/policies",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminPrivacyRoute = Route$49.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminResellersRoute = Route$93.update({
	id: "/resellers",
	path: "/resellers",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminSettingsRoute = Route$48.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminStaffRoute = Route$47.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminSubscriptionsRoute = Route$46.update({
	id: "/subscriptions",
	path: "/subscriptions",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminSupplierPayoutsRoute = Route$45.update({
	id: "/supplier-payouts",
	path: "/supplier-payouts",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminSupplierReportRoute = Route$44.update({
	id: "/supplier-report",
	path: "/supplier-report",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminSupplierReturnsRoute = Route$43.update({
	id: "/supplier-returns",
	path: "/supplier-returns",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminSuppliersRoute = Route$42.update({
	id: "/suppliers",
	path: "/suppliers",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminTransactionsRoute = Route$94.update({
	id: "/transactions",
	path: "/transactions",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminTutorialsRoute = Route$41.update({
	id: "/tutorials",
	path: "/tutorials",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminVisitorsRoute = Route$40.update({
	id: "/visitors",
	path: "/visitors",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedResellerIndexRoute = Route$39.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerCatalogRoute = Route$38.update({
	id: "/catalog",
	path: "/catalog",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerCommissionsRoute = Route$37.update({
	id: "/commissions",
	path: "/commissions",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerCustomersRoute = Route$36.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerDomainRoute = Route$35.update({
	id: "/domain",
	path: "/domain",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerListingsRoute = Route$34.update({
	id: "/listings",
	path: "/listings",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerMarketingRoute = Route$33.update({
	id: "/marketing",
	path: "/marketing",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerMenusRoute = Route$32.update({
	id: "/menus",
	path: "/menus",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerOrdersRoute = Route$95.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerPaymentsRoute = Route$31.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerPayoutsRoute = Route$30.update({
	id: "/payouts",
	path: "/payouts",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerPoliciesRoute = Route$29.update({
	id: "/policies",
	path: "/policies",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerProfileRoute = Route$28.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerSettingsRoute = Route$27.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerSubscriptionRoute = Route$26.update({
	id: "/subscription",
	path: "/subscription",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerSupportRoute = Route$25.update({
	id: "/support",
	path: "/support",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerThemeRoute = Route$24.update({
	id: "/theme",
	path: "/theme",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerTransactionsRoute = Route$23.update({
	id: "/transactions",
	path: "/transactions",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerTutorialsRoute = Route$22.update({
	id: "/tutorials",
	path: "/tutorials",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedResellerVisitorsRoute = Route$21.update({
	id: "/visitors",
	path: "/visitors",
	getParentRoute: () => AuthenticatedResellerRouteRoute
});
var AuthenticatedSupplierIndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var AuthenticatedSupplierMediaRoute = Route$19.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var AuthenticatedSupplierOrdersRoute = Route$18.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var AuthenticatedSupplierPayoutsRoute = Route$17.update({
	id: "/payouts",
	path: "/payouts",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var AuthenticatedSupplierProductsRoute = Route$16.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var AuthenticatedSupplierProfileRoute = Route$15.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var AuthenticatedSupplierReportRoute = Route$14.update({
	id: "/report",
	path: "/report",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var AuthenticatedSupplierReturnsRoute = Route$13.update({
	id: "/returns",
	path: "/returns",
	getParentRoute: () => AuthenticatedSupplierRouteRoute
});
var ApiPublicManifestRoute = Route$12.update({
	id: "/api/public/manifest",
	path: "/api/public/manifest",
	getParentRoute: () => Route$86
});
var ApiPublicProductRoute = Route$11.update({
	id: "/api/public/product",
	path: "/api/public/product",
	getParentRoute: () => Route$86
});
var ApiPublicRobotsRoute = Route$10.update({
	id: "/api/public/robots",
	path: "/api/public/robots",
	getParentRoute: () => Route$86
});
var SCodeIndexRoute = Route$96.update({
	id: "/",
	path: "/",
	getParentRoute: () => SCodeRoute
});
var SCodeCheckoutRoute = Route$97.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => SCodeRoute
});
var SCodeThanksRoute = Route$98.update({
	id: "/thanks",
	path: "/thanks",
	getParentRoute: () => SCodeRoute
});
var AuthenticatedAdminProductsIndexRoute = Route$99.update({
	id: "/products/",
	path: "/products/",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminProductsNewRoute = Route$100.update({
	id: "/products/new",
	path: "/products/new",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var ApiPublicCourierActionsRoute = Route$9.update({
	id: "/api/public/courier/actions",
	path: "/api/public/courier/actions",
	getParentRoute: () => Route$86
});
var ApiPublicCourierCarrybeeRoute = Route$8.update({
	id: "/api/public/courier/carrybee",
	path: "/api/public/courier/carrybee",
	getParentRoute: () => Route$86
});
var ApiPublicCourierPathaoRoute = Route$7.update({
	id: "/api/public/courier/pathao",
	path: "/api/public/courier/pathao",
	getParentRoute: () => Route$86
});
var ApiPublicCourierSteadfastRoute = Route$6.update({
	id: "/api/public/courier/steadfast",
	path: "/api/public/courier/steadfast",
	getParentRoute: () => Route$86
});
var ApiPublicCourierSyncRoute = Route$5.update({
	id: "/api/public/courier/sync",
	path: "/api/public/courier/sync",
	getParentRoute: () => Route$86
});
var ApiPublicPaymentBridgeRoute = Route$4.update({
	id: "/api/public/payment/bridge",
	path: "/api/public/payment/bridge",
	getParentRoute: () => Route$86
});
var ApiPublicPaymentEpaysebaWebhookRoute = Route$3.update({
	id: "/api/public/payment/epayseba-webhook",
	path: "/api/public/payment/epayseba-webhook",
	getParentRoute: () => Route$86
});
var ApiPublicPaymentSslcommerzIpnRoute = Route$2.update({
	id: "/api/public/payment/sslcommerz-ipn",
	path: "/api/public/payment/sslcommerz-ipn",
	getParentRoute: () => Route$86
});
var ApiPublicSitemapCodeRoute = Route$1.update({
	id: "/api/public/sitemap/$code",
	path: "/api/public/sitemap/$code",
	getParentRoute: () => Route$86
});
var SCodeCSlugRoute = Route$101.update({
	id: "/c/$slug",
	path: "/c/$slug",
	getParentRoute: () => SCodeRoute
});
var SCodePSlugRoute = Route$102.update({
	id: "/p/$slug",
	path: "/p/$slug",
	getParentRoute: () => SCodeRoute
});
var AuthenticatedAdminProductsIdEditRoute = Route$103.update({
	id: "/products/$id/edit",
	path: "/products/$id/edit",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedResellerOrdersIdInvoiceRoute = Route$104.update({
	id: "/$id/invoice",
	path: "/$id/invoice",
	getParentRoute: () => AuthenticatedResellerOrdersRoute
});
var ApiPublicPaymentProviderReturnRoute = Route.update({
	id: "/api/public/payment/$provider/return",
	path: "/api/public/payment/$provider/return",
	getParentRoute: () => Route$86
});
var AuthenticatedAdminRouteRouteChildren = {
	AuthenticatedAdminAdvancedRoute,
	AuthenticatedAdminAgentPayoutsRoute,
	AuthenticatedAdminAgentReportRoute,
	AuthenticatedAdminAgentsRoute,
	AuthenticatedAdminBackupRoute,
	AuthenticatedAdminBrandsRoute,
	AuthenticatedAdminBusinessReportRoute,
	AuthenticatedAdminCategoriesRoute,
	AuthenticatedAdminCommissionsRoute,
	AuthenticatedAdminCouriersRoute,
	AuthenticatedAdminCustomersRoute,
	AuthenticatedAdminDepositTransactionsRoute,
	AuthenticatedAdminDepositsRoute,
	AuthenticatedAdminDomainsRoute,
	AuthenticatedAdminExpensesRoute,
	AuthenticatedAdminLandingRoute,
	AuthenticatedAdminMaintenanceRoute,
	AuthenticatedAdminMarketingRoute,
	AuthenticatedAdminMediaRoute,
	AuthenticatedAdminNoticesRoute,
	AuthenticatedAdminNotificationsRoute,
	AuthenticatedAdminOrdersRoute,
	AuthenticatedAdminPaymentsRoute,
	AuthenticatedAdminPayoutsRoute,
	AuthenticatedAdminPoliciesRoute,
	AuthenticatedAdminPrivacyRoute,
	AuthenticatedAdminResellersRoute,
	AuthenticatedAdminSettingsRoute,
	AuthenticatedAdminStaffRoute,
	AuthenticatedAdminSubscriptionsRoute,
	AuthenticatedAdminSupplierPayoutsRoute,
	AuthenticatedAdminSupplierReportRoute,
	AuthenticatedAdminSupplierReturnsRoute,
	AuthenticatedAdminSuppliersRoute,
	AuthenticatedAdminTransactionsRoute,
	AuthenticatedAdminTutorialsRoute,
	AuthenticatedAdminVisitorsRoute,
	AuthenticatedAdminIndexRoute,
	AuthenticatedAdminProductsNewRoute,
	AuthenticatedAdminProductsIndexRoute,
	AuthenticatedAdminProductsIdEditRoute
};
var AuthenticatedAdminRouteRouteWithChildren = AuthenticatedAdminRouteRoute._addFileChildren(AuthenticatedAdminRouteRouteChildren);
var AuthenticatedResellerOrdersRouteChildren = { AuthenticatedResellerOrdersIdInvoiceRoute };
var AuthenticatedResellerRouteRouteChildren = {
	AuthenticatedResellerCatalogRoute,
	AuthenticatedResellerCommissionsRoute,
	AuthenticatedResellerCustomersRoute,
	AuthenticatedResellerDomainRoute,
	AuthenticatedResellerListingsRoute,
	AuthenticatedResellerMarketingRoute,
	AuthenticatedResellerMenusRoute,
	AuthenticatedResellerOrdersRoute: AuthenticatedResellerOrdersRoute._addFileChildren(AuthenticatedResellerOrdersRouteChildren),
	AuthenticatedResellerPaymentsRoute,
	AuthenticatedResellerPayoutsRoute,
	AuthenticatedResellerPoliciesRoute,
	AuthenticatedResellerProfileRoute,
	AuthenticatedResellerSettingsRoute,
	AuthenticatedResellerSubscriptionRoute,
	AuthenticatedResellerSupportRoute,
	AuthenticatedResellerThemeRoute,
	AuthenticatedResellerTransactionsRoute,
	AuthenticatedResellerTutorialsRoute,
	AuthenticatedResellerVisitorsRoute,
	AuthenticatedResellerIndexRoute
};
var AuthenticatedResellerRouteRouteWithChildren = AuthenticatedResellerRouteRoute._addFileChildren(AuthenticatedResellerRouteRouteChildren);
var AuthenticatedSupplierRouteRouteChildren = {
	AuthenticatedSupplierMediaRoute,
	AuthenticatedSupplierOrdersRoute,
	AuthenticatedSupplierPayoutsRoute,
	AuthenticatedSupplierProductsRoute,
	AuthenticatedSupplierProfileRoute,
	AuthenticatedSupplierReportRoute,
	AuthenticatedSupplierReturnsRoute,
	AuthenticatedSupplierIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRouteRoute: AuthenticatedAdminRouteRouteWithChildren,
	AuthenticatedResellerRouteRoute: AuthenticatedResellerRouteRouteWithChildren,
	AuthenticatedSupplierRouteRoute: AuthenticatedSupplierRouteRoute._addFileChildren(AuthenticatedSupplierRouteRouteChildren),
	AuthenticatedDashboardRoute,
	AuthenticatedOnboardingRoute,
	AuthenticatedVerifyRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var CatalogRouteChildren = {
	CatalogSlugRoute,
	CatalogIndexRoute
};
var CatalogRouteWithChildren = CatalogRoute._addFileChildren(CatalogRouteChildren);
var SCodeRouteChildren = {
	SCodeCheckoutRoute,
	SCodeThanksRoute,
	SCodeIndexRoute,
	SCodeCSlugRoute,
	SCodePSlugRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	CatalogRoute: CatalogRouteWithChildren,
	LoginRoute,
	PrivacyRoute,
	RegisterRoute,
	TutorialsRoute,
	SCodeRoute: SCodeRoute._addFileChildren(SCodeRouteChildren),
	ApiPublicManifestRoute,
	ApiPublicProductRoute,
	ApiPublicRobotsRoute,
	ApiPublicCourierActionsRoute,
	ApiPublicCourierCarrybeeRoute,
	ApiPublicCourierPathaoRoute,
	ApiPublicCourierSteadfastRoute,
	ApiPublicCourierSyncRoute,
	ApiPublicPaymentBridgeRoute,
	ApiPublicPaymentEpaysebaWebhookRoute,
	ApiPublicPaymentSslcommerzIpnRoute,
	ApiPublicSitemapCodeRoute,
	ApiPublicPaymentProviderReturnRoute
};
var routeTree = Route$86._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	const router = createRouter({
		routeTree,
		context: { queryClient: new QueryClient({ defaultOptions: { queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			staleTime: 1e3 * 60 * 5,
			retry: false
		} } }) },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultViewTransition: true
	});
	router.onFocus = () => {};
	return router;
};
//#endregion
export { getRouter };
