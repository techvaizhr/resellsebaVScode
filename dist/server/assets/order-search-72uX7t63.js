import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime, o as require_react_dom } from "./vendor-editor-CeWP4_Ao.js";
import { r as supabase } from "./client-DdbbmuGT.js";
import { d as orderTabClasses, f as orderTabGroup, n as ORDER_TABS } from "./courier-status-BxiQVHJB.js";
import { C as shouldThrowError, D as focusManager, E as timeoutManager, O as Subscribable, S as shallowEqualObjects, T as timeUntilStale, _ as noop, b as resolveQueryBoolean, c as notifyManager, i as fetchState, l as pendingThenable, m as isValidTimeout, n as useQueryClient, u as environmentManager, x as resolveStaleTime, y as replaceData } from "./QueryClientProvider-CF67hjzh.js";
import { n as toast } from "./dist-D98gQi4U.js";
import { C as StickyNote, H as Search, Jn as ChevronDown, M as ShoppingCart, Mt as LoaderCircle, Yn as Check, _n as ExternalLink, bt as MessageSquarePlus, ot as Pencil, r as X, v as Trash2 } from "./vendor-icons-BWIzFOtW.js";
import { n as useAuth } from "./use-auth-BsApJ5EH.js";
//#region node_modules/@tanstack/query-core/build/modern/queryObserver.js
var QueryObserver = class extends Subscribable {
	constructor(client, options) {
		super();
		this.options = options;
		this.#client = client;
		this.#selectError = null;
		this.#currentThenable = pendingThenable();
		this.bindMethods();
		this.setOptions(options);
	}
	#client;
	#currentQuery = void 0;
	#currentQueryInitialState = void 0;
	#currentResult = void 0;
	#currentResultState;
	#currentResultOptions;
	#currentThenable;
	#selectError;
	#selectFn;
	#selectResult;
	#lastQueryWithDefinedData;
	#staleTimeoutId;
	#refetchIntervalId;
	#currentRefetchInterval;
	#trackedProps = /* @__PURE__ */ new Set();
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		if (this.listeners.size === 1) {
			this.#currentQuery.addObserver(this);
			if (shouldFetchOnMount(this.#currentQuery, this.options)) this.#executeFetch();
			else this.updateResult();
			this.#updateTimers();
		}
	}
	onUnsubscribe() {
		if (!this.hasListeners()) this.destroy();
	}
	shouldFetchOnReconnect() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnReconnect);
	}
	shouldFetchOnWindowFocus() {
		return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnWindowFocus);
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set();
		this.#clearStaleTimeout();
		this.#clearRefetchInterval();
		this.#currentQuery.removeObserver(this);
	}
	setOptions(options) {
		const prevOptions = this.options;
		const prevQuery = this.#currentQuery;
		this.options = this.#client.defaultQueryOptions(options);
		if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#updateQuery();
		this.#currentQuery.setOptions(this.options);
		if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) this.#client.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#currentQuery,
			observer: this
		});
		const mounted = this.hasListeners();
		if (mounted && shouldFetchOptionally(this.#currentQuery, prevQuery, this.options, prevOptions)) this.#executeFetch();
		this.updateResult();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || resolveStaleTime(this.options.staleTime, this.#currentQuery) !== resolveStaleTime(prevOptions.staleTime, this.#currentQuery))) this.#updateStaleTimeout();
		const nextRefetchInterval = this.#computeRefetchInterval();
		if (mounted && (this.#currentQuery !== prevQuery || resolveQueryBoolean(this.options.enabled, this.#currentQuery) !== resolveQueryBoolean(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) this.#updateRefetchInterval(nextRefetchInterval);
	}
	getOptimisticResult(options) {
		const query = this.#client.getQueryCache().build(this.#client, options);
		const result = this.createResult(query, options);
		if (shouldAssignObserverCurrentProperties(this, result)) {
			this.#currentResult = result;
			this.#currentResultOptions = this.options;
			this.#currentResultState = this.#currentQuery.state;
		}
		return result;
	}
	getCurrentResult() {
		return this.#currentResult;
	}
	trackResult(result, onPropTracked) {
		return new Proxy(result, { get: (target, key) => {
			this.trackProp(key);
			onPropTracked?.(key);
			if (key === "promise") {
				this.trackProp("data");
				if (!this.options.experimental_prefetchInRender && this.#currentThenable.status === "pending") this.#currentThenable.reject(/* @__PURE__ */ new Error("experimental_prefetchInRender feature flag is not enabled"));
			}
			return Reflect.get(target, key);
		} });
	}
	trackProp(key) {
		this.#trackedProps.add(key);
	}
	getCurrentQuery() {
		return this.#currentQuery;
	}
	refetch({ ...options } = {}) {
		return this.fetch({ ...options });
	}
	fetchOptimistic(options) {
		const defaultedOptions = this.#client.defaultQueryOptions(options);
		const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
		return query.fetch().then(() => this.createResult(query, defaultedOptions));
	}
	fetch(fetchOptions) {
		return this.#executeFetch({
			...fetchOptions,
			cancelRefetch: fetchOptions.cancelRefetch ?? true
		}).then(() => {
			this.updateResult();
			return this.#currentResult;
		});
	}
	#executeFetch(fetchOptions) {
		this.#updateQuery();
		let promise = this.#currentQuery.fetch(this.options, fetchOptions);
		if (!fetchOptions?.throwOnError) promise = promise.catch(noop);
		return promise;
	}
	#updateStaleTimeout() {
		this.#clearStaleTimeout();
		const staleTime = resolveStaleTime(this.options.staleTime, this.#currentQuery);
		if (environmentManager.isServer() || this.#currentResult.isStale || !isValidTimeout(staleTime)) return;
		const timeout = timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime) + 1;
		this.#staleTimeoutId = timeoutManager.setTimeout(() => {
			if (!this.#currentResult.isStale) this.updateResult();
		}, timeout);
	}
	#computeRefetchInterval() {
		return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(this.#currentQuery) : this.options.refetchInterval) ?? false;
	}
	#updateRefetchInterval(nextInterval) {
		this.#clearRefetchInterval();
		this.#currentRefetchInterval = nextInterval;
		if (environmentManager.isServer() || resolveQueryBoolean(this.options.enabled, this.#currentQuery) === false || !isValidTimeout(this.#currentRefetchInterval) || this.#currentRefetchInterval === 0) return;
		this.#refetchIntervalId = timeoutManager.setInterval(() => {
			if (this.options.refetchIntervalInBackground || focusManager.isFocused()) this.#executeFetch();
		}, this.#currentRefetchInterval);
	}
	#updateTimers() {
		this.#updateStaleTimeout();
		this.#updateRefetchInterval(this.#computeRefetchInterval());
	}
	#clearStaleTimeout() {
		if (this.#staleTimeoutId !== void 0) {
			timeoutManager.clearTimeout(this.#staleTimeoutId);
			this.#staleTimeoutId = void 0;
		}
	}
	#clearRefetchInterval() {
		if (this.#refetchIntervalId !== void 0) {
			timeoutManager.clearInterval(this.#refetchIntervalId);
			this.#refetchIntervalId = void 0;
		}
	}
	createResult(query, options) {
		const prevQuery = this.#currentQuery;
		const prevOptions = this.options;
		const prevResult = this.#currentResult;
		const prevResultState = this.#currentResultState;
		const prevResultOptions = this.#currentResultOptions;
		const queryInitialState = query !== prevQuery ? query.state : this.#currentQueryInitialState;
		const { state } = query;
		let newState = { ...state };
		let isPlaceholderData = false;
		let data;
		if (options._optimisticResults) {
			const mounted = this.hasListeners();
			const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
			const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
			if (fetchOnMount || fetchOptionally) newState = {
				...newState,
				...fetchState(state.data, query.options)
			};
			if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
		}
		let { error, errorUpdatedAt, status } = newState;
		data = newState.data;
		let skipSelect = false;
		if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
			let placeholderData;
			if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
				placeholderData = prevResult.data;
				skipSelect = true;
			} else placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(this.#lastQueryWithDefinedData?.state.data, this.#lastQueryWithDefinedData) : options.placeholderData;
			if (placeholderData !== void 0) {
				status = "success";
				data = replaceData(prevResult?.data, placeholderData, options);
				isPlaceholderData = true;
			}
		}
		if (options.select && data !== void 0 && !skipSelect) if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) data = this.#selectResult;
		else try {
			this.#selectFn = options.select;
			data = options.select(data);
			data = replaceData(prevResult?.data, data, options);
			this.#selectResult = data;
			this.#selectError = null;
		} catch (selectError) {
			this.#selectError = selectError;
		}
		if (this.#selectError) {
			error = this.#selectError;
			data = this.#selectResult;
			errorUpdatedAt = Date.now();
			status = "error";
		}
		const isFetching = newState.fetchStatus === "fetching";
		const isPending = status === "pending";
		const isError = status === "error";
		const isLoading = isPending && isFetching;
		const hasData = data !== void 0;
		const nextResult = {
			status,
			fetchStatus: newState.fetchStatus,
			isPending,
			isSuccess: status === "success",
			isError,
			isInitialLoading: isLoading,
			isLoading,
			data,
			dataUpdatedAt: newState.dataUpdatedAt,
			error,
			errorUpdatedAt,
			failureCount: newState.fetchFailureCount,
			failureReason: newState.fetchFailureReason,
			errorUpdateCount: newState.errorUpdateCount,
			isFetched: query.isFetched(),
			isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
			isFetching,
			isRefetching: isFetching && !isPending,
			isLoadingError: isError && !hasData,
			isPaused: newState.fetchStatus === "paused",
			isPlaceholderData,
			isRefetchError: isError && hasData,
			isStale: isStale(query, options),
			refetch: this.refetch,
			promise: this.#currentThenable,
			isEnabled: resolveQueryBoolean(options.enabled, query) !== false
		};
		if (this.options.experimental_prefetchInRender) {
			const hasResultData = nextResult.data !== void 0;
			const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
			const finalizeThenableIfPossible = (thenable) => {
				if (isErrorWithoutData) thenable.reject(nextResult.error);
				else if (hasResultData) thenable.resolve(nextResult.data);
			};
			const recreateThenable = () => {
				const pending = this.#currentThenable = nextResult.promise = pendingThenable();
				finalizeThenableIfPossible(pending);
			};
			const prevThenable = this.#currentThenable;
			switch (prevThenable.status) {
				case "pending":
					if (query.queryHash === prevQuery.queryHash) finalizeThenableIfPossible(prevThenable);
					break;
				case "fulfilled":
					if (isErrorWithoutData || nextResult.data !== prevThenable.value) recreateThenable();
					break;
				case "rejected":
					if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) recreateThenable();
					break;
			}
		}
		return nextResult;
	}
	updateResult() {
		const prevResult = this.#currentResult;
		const nextResult = this.createResult(this.#currentQuery, this.options);
		this.#currentResultState = this.#currentQuery.state;
		this.#currentResultOptions = this.options;
		if (this.#currentResultState.data !== void 0) this.#lastQueryWithDefinedData = this.#currentQuery;
		if (shallowEqualObjects(nextResult, prevResult)) return;
		this.#currentResult = nextResult;
		const shouldNotifyListeners = () => {
			if (!prevResult) return true;
			const { notifyOnChangeProps } = this.options;
			const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
			if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) return true;
			const includedProps = new Set(notifyOnChangePropsValue ?? this.#trackedProps);
			if (this.options.throwOnError) includedProps.add("error");
			return Object.keys(this.#currentResult).some((key) => {
				const typedKey = key;
				return this.#currentResult[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
			});
		};
		this.#notify({ listeners: shouldNotifyListeners() });
	}
	#updateQuery() {
		const query = this.#client.getQueryCache().build(this.#client, this.options);
		if (query === this.#currentQuery) return;
		const prevQuery = this.#currentQuery;
		this.#currentQuery = query;
		this.#currentQueryInitialState = query.state;
		if (this.hasListeners()) {
			prevQuery?.removeObserver(this);
			query.addObserver(this);
		}
	}
	onQueryUpdate() {
		this.updateResult();
		if (this.hasListeners()) this.#updateTimers();
	}
	#notify(notifyOptions) {
		notifyManager.batch(() => {
			if (notifyOptions.listeners) this.listeners.forEach((listener) => {
				listener(this.#currentResult);
			});
			this.#client.getQueryCache().notify({
				query: this.#currentQuery,
				type: "observerResultsUpdated"
			});
		});
	}
};
function shouldLoadOnMount(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && resolveQueryBoolean(options.retryOnMount, query) === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveQueryBoolean(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
		const value = typeof field === "function" ? field(query) : field;
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveQueryBoolean(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
	if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) return true;
	return false;
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var IsRestoringContext = import_react.createContext(false);
var useIsRestoring = () => import_react.useContext(IsRestoringContext);
IsRestoringContext.Provider;
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
function createValue() {
	let isReset = false;
	return {
		clearReset: () => {
			isReset = false;
		},
		reset: () => {
			isReset = true;
		},
		isReset: () => {
			return isReset;
		}
	};
}
var QueryErrorResetBoundaryContext = import_react.createContext(createValue());
var useQueryErrorResetBoundary = () => import_react.useContext(QueryErrorResetBoundaryContext);
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
	const throwOnError = query?.state.error && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
	if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
		if (!errorResetBoundary.isReset()) options.retryOnMount = false;
	}
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
	import_react.useEffect(() => {
		errorResetBoundary.clearReset();
	}, [errorResetBoundary]);
};
var getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
	return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/suspense.js
var ensureSuspenseTimers = (defaultedOptions) => {
	if (defaultedOptions.suspense) {
		const MIN_SUSPENSE_TIME_MS = 1e3;
		const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
		const originalStaleTime = defaultedOptions.staleTime;
		defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
		if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
	}
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => defaultedOptions?.suspense && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
	errorResetBoundary.clearReset();
});
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function useBaseQuery(options, Observer, queryClient) {
	const isRestoring = useIsRestoring();
	const errorResetBoundary = useQueryErrorResetBoundary();
	const client = useQueryClient(queryClient);
	const defaultedOptions = client.defaultQueryOptions(options);
	client.getDefaultOptions().queries?._experimental_beforeQuery?.(defaultedOptions);
	const query = client.getQueryCache().get(defaultedOptions.queryHash);
	const subscribed = options.subscribed !== false;
	defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
	ensureSuspenseTimers(defaultedOptions);
	ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
	useClearResetErrorBoundary(errorResetBoundary);
	const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
	const [observer] = import_react.useState(() => new Observer(client, defaultedOptions));
	const result = observer.getOptimisticResult(defaultedOptions);
	const shouldSubscribe = !isRestoring && subscribed;
	import_react.useSyncExternalStore(import_react.useCallback((onStoreChange) => {
		const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
		observer.updateResult();
		return unsubscribe;
	}, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
	import_react.useEffect(() => {
		observer.setOptions(defaultedOptions);
	}, [defaultedOptions, observer]);
	if (shouldSuspend(defaultedOptions, result)) throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
	if (getHasError({
		result,
		errorResetBoundary,
		throwOnError: defaultedOptions.throwOnError,
		query,
		suspense: defaultedOptions.suspense
	})) throw result.error;
	client.getDefaultOptions().queries?._experimental_afterQuery?.(defaultedOptions, result);
	if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) (isNewCacheEntry ? fetchOptimistic(defaultedOptions, observer, errorResetBoundary) : query?.promise)?.catch(noop).finally(() => {
		observer.updateResult();
	});
	return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
	return useBaseQuery(options, QueryObserver, queryClient);
}
//#endregion
//#region src/components/order-items-strip.tsx
/** Light-background supplier badge — only rendered for supplier-sourced items. */
function SupplierBadge({ name }) {
	if (!name) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex max-w-[110px] items-center truncate rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
		children: name
	});
}
function ImageLightbox({ src, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in",
		onClick: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onClose,
			className: "absolute right-4 top-4 rounded-full bg-background/90 p-2 text-foreground shadow-lg transition-transform hover:scale-105",
			"aria-label": "Close",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			onClick: (e) => e.stopPropagation(),
			className: "max-h-[85vh] max-w-full rounded-xl border border-white/10 object-contain shadow-2xl animate-in zoom-in-95"
		})]
	});
}
/**
* Compact product cell used inside an order list row.
* Always renders exactly ONE product so the table row height stays stable.
* The "+N more" chip toggles the row collapse (same action as the row chevron),
* and the full item list is rendered inside that collapse via `OrderItemsList`.
*/
function OrderProductCell({ items, expanded, onZoom, onToggle }) {
	const hidden = Math.max(items.length - 1, 0);
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[10px] text-muted-foreground/60 italic",
		children: "No items"
	});
	const it = items[0];
	const unit = Number(it.unit_price ?? 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => it.image && onZoom(it.image),
				className: "h-9 w-9 shrink-0 overflow-hidden rounded-md border bg-background transition-transform hover:scale-105",
				title: it.image ? "Click to zoom" : void 0,
				children: it.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: it.image,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-full w-full items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 text-muted-foreground/40" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					it.slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `/catalog/${it.slug}`,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex max-w-full items-center gap-1 truncate text-xs font-semibold text-foreground hover:text-primary hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: it.product_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0 opacity-60" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-xs font-semibold",
						children: it.product_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 text-[10px] text-muted-foreground tabular-nums",
						children: [
							"x",
							it.quantity,
							" ",
							unit > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1",
								children: ["৳", unit.toFixed(0)]
							})
						]
					}),
					it.supplier_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierBadge, { name: it.supplier_name })
					})
				]
			})]
		}), hidden > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary transition-colors hover:bg-primary/20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}` }), expanded ? "Hide items" : `+${hidden} more`]
		})]
	});
}
/** Full item list rendered inside an expanded order row. */
function OrderItemsList({ items, onZoom, className = "" }) {
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
			className: "mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground",
			children: [
				"Products (",
				items.length,
				")"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-dashed rounded-xl border bg-background",
			children: items.map((it, idx) => {
				const unit = Number(it.unit_price ?? 0);
				const total = Number(it.line_total ?? unit * it.quantity);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => it.image && onZoom(it.image),
							className: "h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-background transition-transform hover:scale-105",
							title: it.image ? "Click to zoom" : void 0,
							children: it.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: it.image,
								alt: "",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-full w-full items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 text-muted-foreground/40" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								it.slug ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/catalog/${it.slug}`,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex max-w-full items-center gap-1 truncate text-xs font-semibold text-foreground hover:text-primary hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: it.product_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 shrink-0 opacity-60" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs font-semibold",
									children: it.product_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 text-[10px] text-muted-foreground tabular-nums",
									children: [
										"x",
										it.quantity,
										" ",
										unit > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1",
											children: ["৳", unit.toFixed(0)]
										})
									]
								}),
								it.supplier_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupplierBadge, { name: it.supplier_name })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 text-xs font-bold tabular-nums",
							children: ["৳", total.toFixed(0)]
						})
					]
				}, it.id ?? idx);
			})
		})]
	});
}
function countWords(text) {
	const t = text.trim();
	return t ? t.split(/\s+/).length : 0;
}
/** Trim input down to the word limit so users simply cannot type more. */
function clampWords(text) {
	const parts = text.split(/(\s+)/);
	let words = 0;
	let out = "";
	for (const p of parts) {
		if (/^\s+$/.test(p)) {
			out += p;
			continue;
		}
		if (p === "") continue;
		if (words >= 20) return out.replace(/\s+$/, "");
		words++;
		out += p;
	}
	return out;
}
function roleBadge(role) {
	if (role === "reseller") return "bg-primary/10 text-primary";
	if (role === "admin" || role === "super_admin") return "bg-emerald-500/10 text-emerald-600";
	if (role === "supplier") return "bg-amber-500/10 text-amber-600";
	return "bg-muted text-muted-foreground";
}
function roleLabel(role) {
	if (role === "reseller") return "Reseller";
	if (role === "super_admin" || role === "admin") return "Admin";
	if (role === "supplier") return "Supplier";
	return "Staff";
}
function OrderNotes({ orderId, canWrite, authorRole, authorName, lockedHint, title = "Order notes" }) {
	const { user } = useAuth();
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editDraft, setEditDraft] = (0, import_react.useState)("");
	const [orderNotes, setOrderNotes] = (0, import_react.useState)([]);
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		const [{ data, error }, { data: ord }] = await Promise.all([supabase.from("order_notes").select("*").eq("order_id", orderId).order("created_at", { ascending: false }), supabase.from("orders").select("reseller_note,admin_note,notes,created_at,updated_at,reseller:resellers(business_name)").eq("id", orderId).maybeSingle()]);
		if (error) console.error("[order_notes]", error);
		setNotes(data ?? []);
		const o = ord;
		const pinned = [];
		if (o) {
			const at = o.updated_at ?? o.created_at;
			if (o.reseller_note) pinned.push({
				role: "reseller",
				name: o.reseller?.business_name ?? null,
				body: o.reseller_note,
				at
			});
			if (o.admin_note) pinned.push({
				role: "admin",
				name: null,
				body: o.admin_note,
				at
			});
			if (o.notes) pinned.push({
				role: "staff",
				name: null,
				body: o.notes,
				at
			});
		}
		setOrderNotes(pinned);
		setLoading(false);
	}, [orderId]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const canEdit = (n) => canWrite && (authorRole === "admin" || authorRole === "staff" || n.author_id === user?.id);
	async function add() {
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const { error } = await supabase.from("order_notes").insert({
			order_id: orderId,
			author_id: user?.id ?? null,
			author_name: authorName ?? null,
			author_role: authorRole,
			body
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		setDraft("");
		toast.success("Note added");
		load();
	}
	async function saveEdit(id) {
		const body = editDraft.trim();
		if (!body) return;
		setBusy(true);
		const { error } = await supabase.from("order_notes").update({ body }).eq("id", id).select("id");
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		setEditingId(null);
		toast.success("Note updated");
		load();
	}
	async function remove(id) {
		setBusy(true);
		const { data, error } = await supabase.from("order_notes").delete().eq("id", id).select("id");
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (!data || data.length === 0) {
			toast.error("You do not have permission to delete this note.");
			return;
		}
		toast.success("Note deleted");
		load();
	}
	const words = countWords(draft);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b bg-muted/30 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "h-3.5 w-3.5" }), title]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[10px] font-semibold text-muted-foreground",
				children: [
					notes.length,
					" note",
					notes.length === 1 ? "" : "s",
					" · max ",
					20,
					" words"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 p-4",
			children: [
				canWrite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-background p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						value: draft,
						onChange: (e) => setDraft(clampWords(e.target.value)),
						placeholder: "Write a short note (max 20 words)…",
						className: "w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `text-[11px] font-semibold ${words >= 20 ? "text-amber-600" : "text-muted-foreground"}`,
							children: [
								words,
								"/",
								20,
								" words"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: busy || !draft.trim(),
							onClick: () => void add(),
							className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50",
							children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), "Add note"]
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground",
					children: lockedHint ?? "Notes are read-only for this order status."
				}),
				orderNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: orderNotes.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-dashed bg-muted/20 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded px-1.5 py-0.5 text-[10px] font-bold ${roleBadge(p.role)}`,
									children: roleLabel(p.role)
								}),
								p.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground/70",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(p.at).toLocaleString() }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-background px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
									children: "Order form"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-foreground/90",
							children: p.body
						})]
					}, i))
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Loading notes…"]
				}) : notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: orderNotes.length > 0 ? "No timeline notes yet." : "No notes yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "relative space-y-4 border-l pl-4",
					children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded px-1.5 py-0.5 text-[10px] font-bold ${roleBadge(n.author_role)}`,
										children: roleLabel(n.author_role)
									}),
									n.author_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground/70",
										children: n.author_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(n.created_at).toLocaleString() }),
									n.updated_at !== n.created_at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "· edited" })
								]
							}),
							editingId === n.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 rounded-lg border bg-background p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: editDraft,
									onChange: (e) => setEditDraft(clampWords(e.target.value)),
									className: "w-full resize-none bg-transparent text-sm outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: [
											countWords(editDraft),
											"/",
											20,
											" words"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setEditingId(null),
											className: "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Cancel"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: busy || !editDraft.trim(),
											onClick: () => void saveEdit(n.id),
											className: "inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Save"]
										})]
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground/90",
									children: n.body
								}), canEdit(n) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Edit note",
										onClick: () => {
											setEditingId(n.id);
											setEditDraft(n.body);
										},
										className: "grid h-6 w-6 place-items-center rounded-md border text-muted-foreground transition hover:bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Delete note",
										onClick: () => void remove(n.id),
										className: "grid h-6 w-6 place-items-center rounded-md border text-destructive transition hover:bg-destructive/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
									})]
								})]
							})
						]
					}, n.id))
				})
			]
		})]
	});
}
//#endregion
//#region src/components/order-last-update.tsx
var empty = () => ({
	statusAt: null,
	noteBody: null,
	noteRole: null,
	noteName: null,
	noteAt: null,
	noteCount: 0
});
/** Latest status-change time + latest note for a batch of orders (2 queries total). */
async function fetchOrderMeta(ids) {
	const list = ids.filter(Boolean);
	if (list.length === 0) return {};
	const [{ data: hist }, { data: notes }, { data: ords }] = await Promise.all([
		supabase.from("order_status_history").select("order_id,created_at").in("order_id", list).order("created_at", { ascending: false }),
		supabase.from("order_notes").select("order_id,body,author_role,author_name,created_at").in("order_id", list).order("created_at", { ascending: false }),
		supabase.from("orders").select("id,reseller_note,admin_note,notes,created_at,updated_at").in("id", list)
	]);
	const out = {};
	for (const id of list) out[id] = empty();
	for (const h of hist ?? []) {
		const m = out[h.order_id];
		if (m && !m.statusAt) m.statusAt = h.created_at;
	}
	for (const n of notes ?? []) {
		const m = out[n.order_id];
		if (!m) continue;
		m.noteCount += 1;
		if (!m.noteBody) {
			m.noteBody = n.body;
			m.noteRole = n.author_role;
			m.noteName = n.author_name ?? null;
			m.noteAt = n.created_at;
		}
	}
	for (const o of ords ?? []) {
		const m = out[o.id];
		if (!m) continue;
		const form = [];
		if (o.reseller_note) form.push({
			role: "reseller",
			body: o.reseller_note
		});
		if (o.admin_note) form.push({
			role: "admin",
			body: o.admin_note
		});
		if (o.notes) form.push({
			role: "staff",
			body: o.notes
		});
		m.noteCount += form.length;
		if (!m.noteBody && form[0]) {
			m.noteBody = form[0].body;
			m.noteRole = form[0].role;
			m.noteAt = o.updated_at ?? o.created_at;
		}
	}
	return out;
}
function roleTag(role) {
	if (role === "reseller") return "Reseller";
	if (role === "admin" || role === "super_admin") return "Admin";
	if (role === "supplier") return "Supplier";
	if (role) return "Staff";
	return "";
}
function OrderNotePreview({ meta, onOpenNotes, className = "", align = "center" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: onOpenNotes,
		title: "View / add notes",
		className: `w-full rounded-md border border-dashed bg-background px-1.5 py-1 text-left transition hover:border-primary/50 hover:bg-primary/5 ${className}`,
		children: meta?.noteBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 block line-clamp-4 text-[10px] leading-snug text-foreground/80",
			children: meta.noteBody
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mt-0.5 flex flex-wrap items-center gap-x-1 text-[9px] text-muted-foreground/80",
			children: [
				meta.noteAt && !isNaN(new Date(meta.noteAt).getTime()) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-muted-foreground/70",
					children: new Date(meta.noteAt).toLocaleString([], {
						day: "2-digit",
						month: "short",
						year: "numeric",
						hour: "2-digit",
						minute: "2-digit"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "by" }),
				meta.noteName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground/70",
					children: meta.noteName
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: roleTag(meta.noteRole) || "Unknown"
				}),
				meta.noteCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: ["+", meta.noteCount - 1]
				})
			]
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `flex items-center gap-1 text-[10px] text-muted-foreground ${align === "center" ? "justify-center" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "h-2.5 w-2.5" }), " Add note"]
		})
	});
}
function LastUpdateCell({ meta, fallbackAt, onOpenNotes, hideNote = false }) {
	const at = meta?.statusAt ?? fallbackAt ?? null;
	const d = at ? new Date(at) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 text-center",
		children: [Boolean(d && !isNaN(d.getTime())) && d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-medium text-foreground",
			children: d.toLocaleDateString()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] tabular-nums text-muted-foreground/80",
			children: d.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] italic text-muted-foreground/60",
			children: "No update yet"
		}), !hideNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotePreview, {
			meta,
			onOpenNotes,
			className: "mt-1"
		})]
	});
}
function OrderNotesModal({ orderId, orderNumber, authorRole, authorName, canWrite, lockedHint, onClose }) {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[70] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-bold",
					children: ["Notes ", orderNumber ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: ["· #", orderNumber]
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close notes",
					className: "grid h-7 w-7 place-items-center rounded-md border text-muted-foreground hover:bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[70vh] modal-scroll p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderNotes, {
					orderId,
					canWrite,
					authorRole,
					authorName,
					lockedHint
				})
			})]
		})
	});
}
/** Small helper hook: keeps a meta map in sync for the current rows. */
function useOrderMeta(ids) {
	const [meta, setMeta] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		let alive = true;
		if (ids.length === 0) {
			setMeta({});
			return;
		}
		fetchOrderMeta(ids).then((m) => {
			if (alive) setMeta((prev) => ({
				...prev,
				...m
			}));
		});
		return () => {
			alive = false;
		};
	}, [ids.join(",")]);
	const refresh = async (list) => {
		const m = await fetchOrderMeta(list);
		setMeta((prev) => ({
			...prev,
			...m
		}));
	};
	return {
		meta,
		refresh
	};
}
//#endregion
//#region src/components/OrderTabs.tsx
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
/** Light tint classes for the mobile status dropdown, based on the active tab's group. */
function tabTint(key) {
	const group = orderTabGroup(key);
	if (group === "delivered") return "bg-emerald-600 border-emerald-600 text-white font-semibold shadow-sm ring-2 ring-emerald-600/30";
	if (group === "partial") return "bg-amber-500 border-amber-500 text-white font-semibold shadow-sm ring-2 ring-amber-500/30";
	if (group === "terminal") return "bg-rose-600 border-rose-600 text-white font-semibold shadow-sm ring-2 ring-rose-600/30";
	return "bg-blue-600 border-blue-600 text-white font-semibold shadow-sm ring-2 ring-blue-600/30";
}
/**
* Responsive order status tabs.
* - Mobile: compact dropdown that sits inside the filter grid (lighter highlight).
* - Desktop: wraps into multiple rows, never overflows horizontally.
*/
function OrderTabs({ tab, onChange, count, className = "mb-4 w-full min-w-0", highlight = false, tabs = ORDER_TABS }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [menuPosition, setMenuPosition] = (0, import_react.useState)(null);
	const ref = (0, import_react.useRef)(null);
	const menuRef = (0, import_react.useRef)(null);
	const active = tabs.find((t) => t.key === tab);
	const updateMenuPosition = () => {
		const trigger = ref.current?.getBoundingClientRect();
		if (!trigger || typeof window === "undefined") return;
		const margin = 16;
		const gap = 6;
		const desiredWidth = Math.min(window.innerWidth - margin * 2, 360);
		const width = Math.max(trigger.width, desiredWidth);
		const left = Math.min(Math.max(margin, trigger.right - width), window.innerWidth - width - margin);
		const availableBelow = window.innerHeight - trigger.bottom - margin;
		const availableAbove = trigger.top - margin;
		const openUp = availableBelow < 260 && availableAbove > availableBelow;
		const maxHeight = Math.max(180, Math.min(360, openUp ? availableAbove - gap : availableBelow - gap));
		const top = openUp ? trigger.top - gap - maxHeight : trigger.bottom + gap;
		setMenuPosition({
			top,
			left,
			width,
			maxHeight
		});
	};
	(0, import_react.useEffect)(() => {
		function onDoc(e) {
			const target = e.target;
			if (ref.current?.contains(target) || menuRef.current?.contains(target)) return;
			setOpen(false);
		}
		function onKey(e) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", onDoc);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDoc);
			document.removeEventListener("keydown", onKey);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setMenuPosition(null);
			return;
		}
		updateMenuPosition();
		window.addEventListener("resize", updateMenuPosition);
		window.addEventListener("scroll", updateMenuPosition, true);
		return () => {
			window.removeEventListener("resize", updateMenuPosition);
			window.removeEventListener("scroll", updateMenuPosition, true);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref,
			className: "relative sm:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen((v) => !v),
				"aria-expanded": open,
				className: `flex h-10 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-ring ${highlight ? tabTint(tab) : "bg-background"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 truncate font-medium",
					children: [active?.label ?? "Orders", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1.5 text-xs opacity-70",
						children: count(tab)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}` })]
			}), open && menuPosition && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: menuRef,
				className: "fixed z-[100] rounded-md border bg-popover p-2 shadow-lg",
				style: {
					top: menuPosition.top,
					left: menuPosition.left,
					width: menuPosition.width
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar grid grid-cols-2 gap-1.5 overflow-y-auto overscroll-contain",
					style: { maxHeight: menuPosition.maxHeight },
					children: tabs.map((t) => {
						const isActive = tab === t.key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								onChange(t.key);
								setOpen(false);
							},
							className: `min-w-0 rounded-md border px-2 py-1.5 text-center text-xs transition-colors ${orderTabClasses(t.key, isActive)}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-medium",
								children: t.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] opacity-70",
								children: count(t.key)
							})]
						}, t.key);
					})
				})
			}), document.body)]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden flex-wrap gap-2 sm:flex",
			children: tabs.map((t) => {
				const isActive = tab === t.key;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange(t.key),
					className: `min-w-0 rounded-md border px-2.5 py-1.5 text-center text-xs transition-colors sm:px-3 sm:text-sm ${orderTabClasses(t.key, isActive)}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-medium",
						children: t.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `ml-1.5 text-[11px] ${isActive ? "opacity-80" : "text-muted-foreground"}`,
						children: count(t.key)
					})]
				}, t.key);
			})
		})]
	});
}
//#endregion
//#region src/lib/courier-tracking.ts
/**
* External (courier website) tracking links.
* Steadfast : the real per-consignment link Steadfast returns at booking time
*             (https://steadfast.com.bd/tl/<token>), saved on shipments.tracking_url.
*             There is no way to derive this from tracking_code — a URL built as
*             https://steadfast.com.bd/t/<tracking_code> looks plausible but 404s
*             ("Link Unavailable") on Steadfast's own site, so it's only used as a
*             last-resort fallback for the rare shipment saved before this existed.
* Pathao    : https://merchant.pathao.com/tracking?consignment_id=<id>&phone=<customer phone>
* Carrybee  : https://merchant.carrybee.com/order-track/<tracking_id>
*/
function courierTrackingUrl(provider, shipment, customerPhone) {
	if (!provider || !shipment) return null;
	const tracking = (shipment.tracking_id || "").toString().trim();
	const consignment = (shipment.consignment_id || "").toString().trim();
	if (!(tracking || consignment)) return null;
	switch (provider) {
		case "steadfast": return (shipment.tracking_url || "").toString().trim() || null;
		case "pathao": {
			const id = consignment || tracking;
			const phone = (customerPhone || "").replace(/[^0-9]/g, "");
			const qs = new URLSearchParams({ consignment_id: id });
			if (phone) qs.set("phone", phone);
			return `https://merchant.pathao.com/tracking?${qs.toString()}`;
		}
		case "carrybee": return `https://merchant.carrybee.com/order-track/${encodeURIComponent(tracking || consignment)}`;
		default: return null;
	}
}
//#endregion
//#region src/components/order-search.tsx
/** Search box with dynamic button-styled mode selector (Order / Booking combined, and Product separate). */
function OrderSearch({ mode, onMode, value, onChange, className = "" }) {
	const placeholder = mode === "product" ? "Search by product name…" : "Order no, booking ID, phone, customer…";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex h-10 min-w-0 w-full flex-1 items-center rounded-lg border bg-background shadow-xs transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 ${className}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative shrink-0 flex items-center h-full border-r border-primary/20 bg-primary/10 hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25 transition-colors rounded-l-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: mode,
					onChange: (e) => onMode(e.target.value),
					className: "h-full w-auto pl-2.5 sm:pl-3 pr-6 text-[11px] sm:text-xs font-semibold bg-transparent text-primary outline-none cursor-pointer appearance-none truncate",
					title: "Search type",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "order",
						className: "bg-background text-foreground font-medium",
						children: "Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "product",
						className: "bg-background text-foreground font-medium",
						children: "Product"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "ml-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-muted-foreground/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder,
				className: "h-full min-w-0 w-full bg-transparent px-2 text-xs sm:text-sm placeholder:text-muted-foreground/60 outline-none"
			}),
			value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(""),
				className: "mr-1.5 shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
				title: "Clear search",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
//#endregion
export { OrderNotePreview as a, OrderNotes as c, OrderProductCell as d, useQuery as f, LastUpdateCell as i, ImageLightbox as l, courierTrackingUrl as n, OrderNotesModal as o, OrderTabs as r, useOrderMeta as s, OrderSearch as t, OrderItemsList as u };
