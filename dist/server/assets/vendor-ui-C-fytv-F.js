import { i as __toESM } from "./rolldown-runtime-JspESFgx.js";
import { m as require_react } from "./vendor-charts-kQ5QBPqu.js";
import { c as require_jsx_runtime, o as require_react_dom } from "./vendor-editor-CeWP4_Ao.js";
//#region node_modules/@radix-ui/primitive/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var __defProp$17 = Object.defineProperty;
var __name$17 = (target, value) => __defProp$17(target, "name", {
	value,
	configurable: true
});
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return /* @__PURE__ */ __name$17(function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event || !event.defaultPrevented) return ourEventHandler?.(event);
	}, "handleEvent");
}
__name$17(composeEventHandlers, "composeEventHandlers");
function getOwnerWindow(element) {
	if (!canUseDOM) throw new Error("Cannot access window outside of the DOM");
	return element?.ownerDocument?.defaultView ?? window;
}
__name$17(getOwnerWindow, "getOwnerWindow");
function getOwnerDocument(element) {
	if (!canUseDOM) throw new Error("Cannot access document outside of the DOM");
	return element?.ownerDocument ?? document;
}
__name$17(getOwnerDocument, "getOwnerDocument");
function getActiveElement(node, activeDescendant = false) {
	const { activeElement } = getOwnerDocument(node);
	if (!activeElement?.nodeName) return null;
	if (isFrame(activeElement) && activeElement.contentDocument) return getActiveElement(activeElement.contentDocument.body, activeDescendant);
	if (activeDescendant) {
		const id = activeElement.getAttribute("aria-activedescendant");
		if (id) {
			const element = getOwnerDocument(activeElement).getElementById(id);
			if (element) return element;
		}
	}
	return activeElement;
}
__name$17(getActiveElement, "getActiveElement");
function isFrame(element) {
	return element.tagName === "IFRAME";
}
__name$17(isFrame, "isFrame");
//#endregion
//#region node_modules/@radix-ui/react-compose-refs/dist/index.mjs
function setRef$1(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
function composeRefs(...refs) {
	return (node) => {
		let hasCleanup = false;
		const cleanups = refs.map((ref) => {
			const cleanup = setRef$1(ref, node);
			if (!hasCleanup && typeof cleanup == "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup == "function") cleanup();
				else setRef$1(refs[i], null);
			}
		};
	};
}
function useComposedRefs(...refs) {
	return import_react.useCallback(composeRefs(...refs), refs);
}
//#endregion
//#region node_modules/@radix-ui/react-context/dist/index.mjs
var import_jsx_runtime = require_jsx_runtime();
function createContextScope(scopeName, createContextScopeDeps = []) {
	let defaultContexts = [];
	function createContext3(rootComponentName, defaultContext) {
		const BaseContext = import_react.createContext(defaultContext);
		BaseContext.displayName = rootComponentName + "Context";
		const index = defaultContexts.length;
		defaultContexts = [...defaultContexts, defaultContext];
		const Provider = (props) => {
			const { scope, children, ...context } = props;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const value = import_react.useMemo(() => context, Object.values(context));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, {
				value,
				children
			});
		};
		Provider.displayName = rootComponentName + "Provider";
		function useContext2(consumerName, scope, options = {}) {
			const { optional = false } = options;
			const Context = scope?.[scopeName]?.[index] || BaseContext;
			const context = import_react.useContext(Context);
			if (context) return context;
			if (defaultContext !== void 0) return defaultContext;
			if (optional) return void 0;
			throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
		}
		return [Provider, useContext2];
	}
	const createScope = () => {
		const scopeContexts = defaultContexts.map((defaultContext) => {
			return import_react.createContext(defaultContext);
		});
		return function useScope(scope) {
			const contexts = scope?.[scopeName] || scopeContexts;
			return import_react.useMemo(() => ({ [`__scope${scopeName}`]: {
				...scope,
				[scopeName]: contexts
			} }), [scope, contexts]);
		};
	};
	createScope.scopeName = scopeName;
	return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
	const baseScope = scopes[0];
	if (scopes.length === 1) return baseScope;
	const createScope = () => {
		const scopeHooks = scopes.map((createScope2) => ({
			useScope: createScope2(),
			scopeName: createScope2.scopeName
		}));
		return function useComposedScopes(overrideScopes) {
			const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
				const currentScope = useScope(overrideScopes)[`__scope${scopeName}`];
				return {
					...nextScopes2,
					...currentScope
				};
			}, {});
			return import_react.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
		};
	};
	createScope.scopeName = baseScope.scopeName;
	return createScope;
}
//#endregion
//#region node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var useLayoutEffect2 = globalThis?.document ? import_react.useLayoutEffect : () => {};
//#endregion
//#region node_modules/@radix-ui/react-id/dist/index.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var useReactId = import_react[" useId ".trim().toString()] || (() => void 0);
var count$1 = 0;
function useId(deterministicId) {
	const [id, setId] = import_react.useState(useReactId());
	useLayoutEffect2(() => {
		if (!deterministicId) setId((reactId) => reactId ?? String(count$1++));
	}, [deterministicId]);
	return deterministicId || (id ? `radix-${id}` : "");
}
//#endregion
//#region node_modules/@radix-ui/react-use-effect-event/dist/index.mjs
var useReactEffectEvent = import_react[" useEffectEvent ".trim().toString()];
var useReactInsertionEffect = import_react[" useInsertionEffect ".trim().toString()];
function useEffectEvent(callback) {
	if (typeof useReactEffectEvent === "function") return useReactEffectEvent(callback);
	const ref = import_react.useRef(() => {
		throw new Error("Cannot call an event handler while rendering.");
	});
	if (typeof useReactInsertionEffect === "function") useReactInsertionEffect(() => {
		ref.current = callback;
	});
	else useLayoutEffect2(() => {
		ref.current = callback;
	});
	return import_react.useMemo(() => ((...args) => ref.current?.(...args)), []);
}
//#endregion
//#region node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var __defProp$16 = Object.defineProperty;
var __name$16 = (target, value) => __defProp$16(target, "name", {
	value,
	configurable: true
});
var useInsertionEffect = import_react[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({ prop, defaultProp, onChange = /* @__PURE__ */ __name$16(() => {}, "onChange"), caller }) {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
		defaultProp,
		onChange
	});
	const isControlled = prop !== void 0;
	return [isControlled ? prop : uncontrolledProp, import_react.useCallback((nextValue) => {
		if (isControlled) {
			const value2 = isFunction$2(nextValue) ? nextValue(prop) : nextValue;
			if (value2 !== prop) onChangeRef.current?.(value2);
		} else setUncontrolledProp(nextValue);
	}, [
		isControlled,
		prop,
		setUncontrolledProp,
		onChangeRef
	])];
}
__name$16(useControllableState, "useControllableState");
function useUncontrolledState({ defaultProp, onChange }) {
	const [value, setValue] = import_react.useState(defaultProp);
	const prevValueRef = import_react.useRef(value);
	const onChangeRef = import_react.useRef(onChange);
	useInsertionEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	import_react.useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value, prevValueRef]);
	return [
		value,
		setValue,
		onChangeRef
	];
}
__name$16(useUncontrolledState, "useUncontrolledState");
function isFunction$2(value) {
	return typeof value === "function";
}
__name$16(isFunction$2, "isFunction");
var SYNC_STATE = Symbol("RADIX:SYNC_STATE");
function useControllableStateReducer(reducer, userArgs, initialArg, init) {
	const { prop: controlledState, defaultProp, onChange: onChangeProp, caller } = userArgs;
	const isControlled = controlledState !== void 0;
	const onChange = useEffectEvent(onChangeProp);
	const args = [{
		...initialArg,
		state: defaultProp
	}];
	if (init) args.push(init);
	const [internalState, dispatch] = import_react.useReducer((state2, action) => {
		if (action.type === SYNC_STATE) return {
			...state2,
			state: action.state
		};
		const next = reducer(state2, action);
		if (isControlled && !Object.is(next.state, state2.state)) onChange(next.state);
		return next;
	}, ...args);
	const uncontrolledState = internalState.state;
	const prevValueRef = import_react.useRef(uncontrolledState);
	import_react.useEffect(() => {
		if (prevValueRef.current !== uncontrolledState) {
			prevValueRef.current = uncontrolledState;
			if (!isControlled) onChange(uncontrolledState);
		}
	}, [
		uncontrolledState,
		prevValueRef,
		isControlled
	]);
	const state = import_react.useMemo(() => {
		if (controlledState !== void 0) return {
			...internalState,
			state: controlledState
		};
		return internalState;
	}, [internalState, controlledState]);
	import_react.useEffect(() => {
		if (isControlled && !Object.is(controlledState, internalState.state)) dispatch({
			type: SYNC_STATE,
			state: controlledState
		});
	}, [
		controlledState,
		internalState.state,
		isControlled
	]);
	return [state, dispatch];
}
__name$16(useControllableStateReducer, "useControllableStateReducer");
//#endregion
//#region node_modules/@radix-ui/react-slot/dist/index.mjs
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
	const Slot2 = import_react.forwardRef((props, forwardedRef) => {
		let { children, ...slotProps } = props;
		let slottableElement = null;
		let hasSlottable = false;
		const newChildren = [];
		if (isLazyComponent(children) && typeof use === "function") children = use(children._payload);
		import_react.Children.forEach(children, (maybeSlottable) => {
			if (isSlottable(maybeSlottable)) {
				hasSlottable = true;
				const slottable = maybeSlottable;
				let child = "child" in slottable.props ? slottable.props.child : slottable.props.children;
				if (isLazyComponent(child) && typeof use === "function") child = use(child._payload);
				slottableElement = getSlottableElementFromSlottable(slottable, child);
				newChildren.push(slottableElement?.props?.children);
			} else newChildren.push(maybeSlottable);
		});
		if (slottableElement) slottableElement = import_react.cloneElement(slottableElement, void 0, newChildren);
		else if (!hasSlottable && import_react.Children.count(children) === 1 && import_react.isValidElement(children)) slottableElement = children;
		const slottableElementRef = slottableElement ? getElementRef$1(slottableElement) : void 0;
		const composedRef = useComposedRefs(forwardedRef, slottableElementRef);
		if (!slottableElement) {
			if (children || children === 0) throw new Error(hasSlottable ? createSlottableError(ownerName) : createSlotError(ownerName));
			return children;
		}
		const mergedProps = mergeProps(slotProps, slottableElement.props ?? {});
		if (slottableElement.type !== import_react.Fragment) mergedProps.ref = forwardedRef ? composedRef : slottableElementRef;
		return import_react.cloneElement(slottableElement, mergedProps);
	});
	Slot2.displayName = `${ownerName}.Slot`;
	return Slot2;
}
var Slot$3 = /* @__PURE__ */ createSlot("Slot");
var SLOTTABLE_IDENTIFIER = Symbol.for("radix.slottable");
var getSlottableElementFromSlottable = (slottable, child) => {
	if ("child" in slottable.props) {
		const child2 = slottable.props.child;
		if (!import_react.isValidElement(child2)) return null;
		return import_react.cloneElement(child2, void 0, slottable.props.children(child2.props.children));
	}
	return import_react.isValidElement(child) ? child : null;
};
function mergeProps(slotProps, childProps) {
	const overrideProps = { ...childProps };
	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];
		if (/^on[A-Z]/.test(propName)) {
			if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
				const result = childPropValue(...args);
				slotPropValue(...args);
				return result;
			};
			else if (slotPropValue) overrideProps[propName] = slotPropValue;
		} else if (propName === "style") overrideProps[propName] = {
			...slotPropValue,
			...childPropValue
		};
		else if (propName === "className") overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
	}
	return {
		...slotProps,
		...overrideProps
	};
}
function getElementRef$1(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
function isSlottable(child) {
	return import_react.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
function isLazyComponent(element) {
	return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
function isPromiseLike(value) {
	return typeof value === "object" && value !== null && "then" in value;
}
var createSlotError = (ownerName) => {
	return `${ownerName} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`;
};
var createSlottableError = (ownerName) => {
	return `${ownerName} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`;
};
var use = import_react[" use ".trim().toString()];
//#endregion
//#region node_modules/@radix-ui/react-primitive/dist/index.mjs
var Primitive = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((primitive, node) => {
	const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
	const Node = import_react.forwardRef((props, forwardedRef) => {
		const { asChild, ...primitiveProps } = props;
		const Comp = asChild ? Slot : node;
		if (typeof window !== "undefined") window[Symbol.for("radix-ui")] = true;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
			...primitiveProps,
			ref: forwardedRef
		});
	});
	Node.displayName = `Primitive.${node}`;
	return {
		...primitive,
		[node]: Node
	};
}, {});
function dispatchDiscreteCustomEvent(target, event) {
	if (target) import_react_dom.flushSync(() => target.dispatchEvent(event));
}
//#endregion
//#region node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
function useCallbackRef$1(callback) {
	const callbackRef = import_react.useRef(callback);
	import_react.useEffect(() => {
		callbackRef.current = callback;
	});
	return import_react.useMemo(() => ((...args) => callbackRef.current?.(...args)), []);
}
//#endregion
//#region node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var __defProp$15 = Object.defineProperty;
var __name$15 = (target, value) => __defProp$15(target, "name", {
	value,
	configurable: true
});
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = import_react.createContext({
	layers: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set(),
	dismissableSurfaces: /* @__PURE__ */ new Set()
});
var DismissableLayer = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$15(function DismissableLayer2(props, forwardedRef) {
	const { disableOutsidePointerEvents = false, deferPointerDownOutside = false, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, ...layerProps } = props;
	const context = import_react.useContext(DismissableLayerContext);
	const [node, setNode] = import_react.useState(null);
	const ownerDocument = node?.ownerDocument ?? globalThis?.document;
	const [, force] = import_react.useState({});
	const composedRefs = useComposedRefs(forwardedRef, setNode);
	const layers = Array.from(context.layers);
	const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
	const highestLayerWithOutsidePointerEventsDisabledIndex = highestLayerWithOutsidePointerEventsDisabled ? layers.indexOf(highestLayerWithOutsidePointerEventsDisabled) : -1;
	const index = node ? layers.indexOf(node) : -1;
	const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
	const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
	const isDeferredPointerDownOutsideRef = import_react.useRef(false);
	const pointerDownOutside = usePointerDownOutside((event) => {
		onPointerDownOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, {
		ownerDocument,
		deferPointerDownOutside,
		isDeferredPointerDownOutsideRef,
		dismissableSurfaces: context.dismissableSurfaces,
		shouldHandlePointerDownOutside: import_react.useCallback((target) => {
			if (!(target instanceof Node)) return false;
			const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
			return isPointerEventsEnabled && !isPointerDownOnBranch;
		}, [context.branches, isPointerEventsEnabled])
	});
	const focusOutside = useFocusOutside((event) => {
		if (deferPointerDownOutside && isDeferredPointerDownOutsideRef.current) return;
		const target = event.target;
		if ([...context.branches].some((branch) => branch.contains(target))) return;
		onFocusOutside?.(event);
		onInteractOutside?.(event);
		if (!event.defaultPrevented) onDismiss?.();
	}, ownerDocument);
	const isHighestLayer = node ? index === layers.length - 1 : false;
	const handleKeyDown = useCallbackRef$1((event) => {
		if (event.key !== "Escape") return;
		onEscapeKeyDown?.(event);
		if (!event.defaultPrevented && onDismiss) {
			event.preventDefault();
			onDismiss();
		}
	});
	import_react.useEffect(() => {
		if (!isHighestLayer) return;
		ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
	}, [
		ownerDocument,
		isHighestLayer,
		handleKeyDown
	]);
	import_react.useEffect(() => {
		if (!node) return;
		if (disableOutsidePointerEvents) {
			if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
				originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
				ownerDocument.body.style.pointerEvents = "none";
			}
			context.layersWithOutsidePointerEventsDisabled.add(node);
		}
		context.layers.add(node);
		dispatchUpdate();
		return () => {
			if (disableOutsidePointerEvents) {
				context.layersWithOutsidePointerEventsDisabled.delete(node);
				if (context.layersWithOutsidePointerEventsDisabled.size === 0) ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
			}
		};
	}, [
		node,
		ownerDocument,
		disableOutsidePointerEvents,
		context
	]);
	import_react.useEffect(() => {
		return () => {
			if (!node) return;
			context.layers.delete(node);
			context.layersWithOutsidePointerEventsDisabled.delete(node);
			dispatchUpdate();
		};
	}, [node, context]);
	import_react.useEffect(() => {
		const handleUpdate = /* @__PURE__ */ __name$15(() => force({}), "handleUpdate");
		document.addEventListener(CONTEXT_UPDATE, handleUpdate);
		return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...layerProps,
		ref: composedRefs,
		style: {
			pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
			...props.style
		},
		onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
		onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
		onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
	});
}, "DismissableLayer"));
function useDismissableLayerSurface() {
	const context = import_react.useContext(DismissableLayerContext);
	const [node, setNode] = import_react.useState(null);
	import_react.useEffect(() => {
		if (!node) return;
		context.dismissableSurfaces.add(node);
		return () => {
			context.dismissableSurfaces.delete(node);
		};
	}, [node, context.dismissableSurfaces]);
	return setNode;
}
__name$15(useDismissableLayerSurface, "useDismissableLayerSurface");
var IS_TRUE = /* @__PURE__ */ __name$15(() => true, "IS_TRUE");
function usePointerDownOutside(onPointerDownOutside, args) {
	const { ownerDocument = globalThis?.document, deferPointerDownOutside = false, isDeferredPointerDownOutsideRef, dismissableSurfaces, shouldHandlePointerDownOutside = IS_TRUE } = args;
	const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
	const isPointerInsideReactTreeRef = import_react.useRef(false);
	const isPointerDownOutsideRef = import_react.useRef(false);
	const interceptedOutsideInteractionEventsRef = import_react.useRef(/* @__PURE__ */ new Map());
	const handleClickRef = import_react.useRef(() => {});
	import_react.useEffect(() => {
		function resetOutsideInteraction() {
			isPointerDownOutsideRef.current = false;
			isDeferredPointerDownOutsideRef.current = false;
			interceptedOutsideInteractionEventsRef.current.clear();
		}
		__name$15(resetOutsideInteraction, "resetOutsideInteraction");
		function isOutsideInteractionIntercepted() {
			return Array.from(interceptedOutsideInteractionEventsRef.current.values()).some(Boolean);
		}
		__name$15(isOutsideInteractionIntercepted, "isOutsideInteractionIntercepted");
		function handleInteractionCapture(event) {
			if (!isPointerDownOutsideRef.current) return;
			const target = event.target;
			if (!(target instanceof Node && [...dismissableSurfaces].some((surface) => surface.contains(target)))) interceptedOutsideInteractionEventsRef.current.set(event.type, true);
			if (event.type === "click") window.setTimeout(() => {
				if (isPointerDownOutsideRef.current) handleClickRef.current();
			}, 0);
		}
		__name$15(handleInteractionCapture, "handleInteractionCapture");
		function handleInteractionBubble(event) {
			if (isPointerDownOutsideRef.current) interceptedOutsideInteractionEventsRef.current.set(event.type, false);
		}
		__name$15(handleInteractionBubble, "handleInteractionBubble");
		const handlePointerDown = /* @__PURE__ */ __name$15((event) => {
			if (event.target && !isPointerInsideReactTreeRef.current) {
				let handleAndDispatchPointerDownOutsideEvent2 = function() {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					const wasOutsideInteractionIntercepted = isOutsideInteractionIntercepted();
					resetOutsideInteraction();
					if (!wasOutsideInteractionIntercepted) handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, { discrete: true });
				};
				__name$15(handleAndDispatchPointerDownOutsideEvent2, "handleAndDispatchPointerDownOutsideEvent");
				if (!shouldHandlePointerDownOutside(event.target)) {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					resetOutsideInteraction();
					isPointerInsideReactTreeRef.current = false;
					return;
				}
				const eventDetail = { originalEvent: event };
				isPointerDownOutsideRef.current = true;
				isDeferredPointerDownOutsideRef.current = deferPointerDownOutside && event.button === 0;
				interceptedOutsideInteractionEventsRef.current.clear();
				if (!deferPointerDownOutside || event.button !== 0) handleAndDispatchPointerDownOutsideEvent2();
				else {
					ownerDocument.removeEventListener("click", handleClickRef.current);
					handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
					ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
				}
			} else {
				ownerDocument.removeEventListener("click", handleClickRef.current);
				resetOutsideInteraction();
			}
			isPointerInsideReactTreeRef.current = false;
		}, "handlePointerDown");
		const outsideInteractionEvents = [
			"pointerup",
			"mousedown",
			"mouseup",
			"touchstart",
			"touchend",
			"click"
		];
		for (const eventName of outsideInteractionEvents) {
			ownerDocument.addEventListener(eventName, handleInteractionCapture, true);
			ownerDocument.addEventListener(eventName, handleInteractionBubble);
		}
		const timerId = window.setTimeout(() => {
			ownerDocument.addEventListener("pointerdown", handlePointerDown);
		}, 0);
		return () => {
			window.clearTimeout(timerId);
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
			ownerDocument.removeEventListener("click", handleClickRef.current);
			for (const eventName of outsideInteractionEvents) {
				ownerDocument.removeEventListener(eventName, handleInteractionCapture, true);
				ownerDocument.removeEventListener(eventName, handleInteractionBubble);
			}
		};
	}, [
		ownerDocument,
		handlePointerDownOutside,
		deferPointerDownOutside,
		isDeferredPointerDownOutsideRef,
		dismissableSurfaces,
		shouldHandlePointerDownOutside
	]);
	return { onPointerDownCapture: /* @__PURE__ */ __name$15(() => isPointerInsideReactTreeRef.current = true, "onPointerDownCapture") };
}
__name$15(usePointerDownOutside, "usePointerDownOutside");
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
	const handleFocusOutside = useCallbackRef$1(onFocusOutside);
	const isFocusInsideReactTreeRef = import_react.useRef(false);
	import_react.useEffect(() => {
		const handleFocus = /* @__PURE__ */ __name$15((event) => {
			if (event.target && !isFocusInsideReactTreeRef.current) handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, { originalEvent: event }, { discrete: false });
		}, "handleFocus");
		ownerDocument.addEventListener("focusin", handleFocus);
		return () => ownerDocument.removeEventListener("focusin", handleFocus);
	}, [ownerDocument, handleFocusOutside]);
	return {
		onFocusCapture: /* @__PURE__ */ __name$15(() => isFocusInsideReactTreeRef.current = true, "onFocusCapture"),
		onBlurCapture: /* @__PURE__ */ __name$15(() => isFocusInsideReactTreeRef.current = false, "onBlurCapture")
	};
}
__name$15(useFocusOutside, "useFocusOutside");
function dispatchUpdate() {
	const event = new CustomEvent(CONTEXT_UPDATE);
	document.dispatchEvent(event);
}
__name$15(dispatchUpdate, "dispatchUpdate");
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
	const target = detail.originalEvent.target;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) target.addEventListener(name, handler, { once: true });
	if (discrete) dispatchDiscreteCustomEvent(target, event);
	else target.dispatchEvent(event);
}
__name$15(handleAndDispatchCustomEvent, "handleAndDispatchCustomEvent");
//#endregion
//#region node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var __defProp$14 = Object.defineProperty;
var __name$14 = (target, value) => __defProp$14(target, "name", {
	value,
	configurable: true
});
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS$1 = {
	bubbles: false,
	cancelable: true
};
var FocusScope = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$14(function FocusScope2(props, forwardedRef) {
	const { loop = false, trapped = false, onMountAutoFocus: onMountAutoFocusProp, onUnmountAutoFocus: onUnmountAutoFocusProp, ...scopeProps } = props;
	const [container, setContainer] = import_react.useState(null);
	const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
	const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
	const lastFocusedElementRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, setContainer);
	const focusScope = import_react.useRef({
		paused: false,
		pause() {
			this.paused = true;
		},
		resume() {
			this.paused = false;
		}
	}).current;
	import_react.useEffect(() => {
		if (trapped) {
			let handleFocusIn2 = function(event) {
				if (focusScope.paused || !container) return;
				const target = event.target;
				if (container.contains(target)) lastFocusedElementRef.current = target;
				else focus(lastFocusedElementRef.current, { select: true });
			}, handleFocusOut2 = function(event) {
				if (focusScope.paused || !container) return;
				const relatedTarget = event.relatedTarget;
				if (relatedTarget === null) return;
				if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.current, { select: true });
			}, handleMutations2 = function(mutations) {
				if (document.activeElement !== document.body) return;
				for (const mutation of mutations) if (mutation.removedNodes.length > 0) focus(container);
			};
			__name$14(handleFocusIn2, "handleFocusIn");
			__name$14(handleFocusOut2, "handleFocusOut");
			__name$14(handleMutations2, "handleMutations");
			document.addEventListener("focusin", handleFocusIn2);
			document.addEventListener("focusout", handleFocusOut2);
			const mutationObserver = new MutationObserver(handleMutations2);
			if (container) mutationObserver.observe(container, {
				childList: true,
				subtree: true
			});
			return () => {
				document.removeEventListener("focusin", handleFocusIn2);
				document.removeEventListener("focusout", handleFocusOut2);
				mutationObserver.disconnect();
			};
		}
	}, [
		trapped,
		container,
		focusScope.paused
	]);
	import_react.useEffect(() => {
		if (container) {
			focusScopesStack.add(focusScope);
			const previouslyFocusedElement = document.activeElement;
			if (!container.contains(previouslyFocusedElement)) {
				const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS$1);
				container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				container.dispatchEvent(mountEvent);
				if (!mountEvent.defaultPrevented) {
					focusFirst$2(removeLinks(getTabbableCandidates(container)), { select: true });
					if (document.activeElement === previouslyFocusedElement) focus(container);
				}
			}
			return () => {
				container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
				setTimeout(() => {
					const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS$1);
					container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					container.dispatchEvent(unmountEvent);
					if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
					container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
					focusScopesStack.remove(focusScope);
				}, 0);
			};
		}
	}, [
		container,
		onMountAutoFocus,
		onUnmountAutoFocus,
		focusScope
	]);
	const handleKeyDown = import_react.useCallback((event) => {
		if (!loop && !trapped) return;
		if (focusScope.paused) return;
		const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
		const focusedElement = document.activeElement;
		if (isTabKey && focusedElement) {
			const container2 = event.currentTarget;
			const [first, last] = getTabbableEdges(container2);
			if (!(first && last)) {
				if (focusedElement === container2) event.preventDefault();
			} else if (!event.shiftKey && focusedElement === last) {
				event.preventDefault();
				if (loop) focus(first, { select: true });
			} else if (event.shiftKey && focusedElement === first) {
				event.preventDefault();
				if (loop) focus(last, { select: true });
			}
		}
	}, [
		loop,
		trapped,
		focusScope.paused
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		tabIndex: -1,
		...scopeProps,
		ref: composedRefs,
		onKeyDown: handleKeyDown
	});
}, "FocusScope"));
function focusFirst$2(candidates, { select = false } = {}) {
	const previouslyFocusedElement = document.activeElement;
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (document.activeElement !== previouslyFocusedElement) return;
	}
}
__name$14(focusFirst$2, "focusFirst");
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
__name$14(getTabbableEdges, "getTabbableEdges");
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: /* @__PURE__ */ __name$14((node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	}, "acceptNode") });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
__name$14(getTabbableCandidates, "getTabbableCandidates");
function findVisible(elements, container) {
	const canUseCheckVisibility = typeof container.checkVisibility === "function" && container.checkVisibility({ checkVisibilityCSS: true });
	for (const element of elements) if (!(canUseCheckVisibility ? !element.checkVisibility({ checkVisibilityCSS: true }) : isHidden(element, { upTo: container }))) return element;
}
__name$14(findVisible, "findVisible");
function isHidden(node, { upTo }) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (upTo !== void 0 && node === upTo) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
__name$14(isHidden, "isHidden");
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
__name$14(isSelectableInput, "isSelectableInput");
function focus(element, { select = false } = {}) {
	if (element && element.focus) {
		const previouslyFocusedElement = document.activeElement;
		element.focus({ preventScroll: true });
		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
	}
}
__name$14(focus, "focus");
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
	let stack = [];
	return {
		add(focusScope) {
			const activeFocusScope = stack[0];
			if (focusScope !== activeFocusScope) activeFocusScope?.pause();
			stack = arrayRemove(stack, focusScope);
			stack.unshift(focusScope);
		},
		remove(focusScope) {
			stack = arrayRemove(stack, focusScope);
			stack[0]?.resume();
		}
	};
}
__name$14(createFocusScopesStack, "createFocusScopesStack");
function arrayRemove(array, item) {
	const updatedArray = [...array];
	const index = updatedArray.indexOf(item);
	if (index !== -1) updatedArray.splice(index, 1);
	return updatedArray;
}
__name$14(arrayRemove, "arrayRemove");
function removeLinks(items) {
	return items.filter((item) => item.tagName !== "A");
}
__name$14(removeLinks, "removeLinks");
//#endregion
//#region node_modules/@radix-ui/react-portal/dist/index.mjs
var __defProp$13 = Object.defineProperty;
var __name$13 = (target, value) => __defProp$13(target, "name", {
	value,
	configurable: true
});
var Portal$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$13(function Portal2(props, forwardedRef) {
	const { container: containerProp, ...portalProps } = props;
	const [mounted, setMounted] = import_react.useState(false);
	useLayoutEffect2(() => setMounted(true), []);
	const container = containerProp || mounted && globalThis?.document?.body;
	return container ? import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...portalProps,
		ref: forwardedRef
	}), container) : null;
}, "Portal"));
//#endregion
//#region node_modules/@radix-ui/react-presence/dist/index.mjs
var __defProp$12 = Object.defineProperty;
var __name$12 = (target, value) => __defProp$12(target, "name", {
	value,
	configurable: true
});
function useStateMachine(initialState, machine) {
	return import_react.useReducer((state, event) => {
		return machine[state][event] ?? state;
	}, initialState);
}
__name$12(useStateMachine, "useStateMachine");
var Presence = /* @__PURE__ */ __name$12((props) => {
	const { present, children } = props;
	const presence = usePresence(present);
	const child = typeof children === "function" ? children({ present: presence.isPresent }) : import_react.Children.only(children);
	const ref = useStableComposedRefs(presence.ref, getElementRef(child));
	return typeof children === "function" || presence.isPresent ? import_react.cloneElement(child, { ref }) : null;
}, "Presence");
function usePresence(present) {
	const [node, setNode] = import_react.useState();
	const stylesRef = import_react.useRef(null);
	const prevPresentRef = import_react.useRef(present);
	const prevAnimationNameRef = import_react.useRef("none");
	const mountAnimationNameRef = import_react.useRef(void 0);
	const [state, send] = useStateMachine(present ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	import_react.useEffect(() => {
		if (state === "mounted") {
			prevAnimationNameRef.current = mountAnimationNameRef.current ?? getAnimationName(stylesRef.current);
			mountAnimationNameRef.current = void 0;
		} else prevAnimationNameRef.current = "none";
	}, [state]);
	useLayoutEffect2(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		if (wasPresent !== present) {
			const prevAnimationName = prevAnimationNameRef.current;
			const currentAnimationName = getAnimationName(styles);
			if (present) {
				mountAnimationNameRef.current = currentAnimationName;
				send("MOUNT");
			} else if (currentAnimationName === "none" || styles?.display === "none") send("UNMOUNT");
			else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
			else send("UNMOUNT");
			prevPresentRef.current = present;
		}
	}, [present, send]);
	useLayoutEffect2(() => {
		if (node) {
			let timeoutId;
			const ownerWindow = node.ownerDocument.defaultView ?? window;
			const handleAnimationEnd = /* @__PURE__ */ __name$12((event) => {
				const isCurrentAnimation = getAnimationName(stylesRef.current).includes(CSS.escape(event.animationName));
				if (event.target === node && isCurrentAnimation) {
					send("ANIMATION_END");
					if (!prevPresentRef.current) {
						const currentFillMode = node.style.animationFillMode;
						node.style.animationFillMode = "forwards";
						timeoutId = ownerWindow.setTimeout(() => {
							if (node.style.animationFillMode === "forwards") node.style.animationFillMode = currentFillMode;
						});
					}
				}
			}, "handleAnimationEnd");
			const handleAnimationStart = /* @__PURE__ */ __name$12((event) => {
				if (event.target === node) prevAnimationNameRef.current = getAnimationName(stylesRef.current);
			}, "handleAnimationStart");
			node.addEventListener("animationstart", handleAnimationStart);
			node.addEventListener("animationcancel", handleAnimationEnd);
			node.addEventListener("animationend", handleAnimationEnd);
			return () => {
				ownerWindow.clearTimeout(timeoutId);
				node.removeEventListener("animationstart", handleAnimationStart);
				node.removeEventListener("animationcancel", handleAnimationEnd);
				node.removeEventListener("animationend", handleAnimationEnd);
			};
		} else send("ANIMATION_END");
	}, [node, send]);
	return {
		isPresent: ["mounted", "unmountSuspended"].includes(state),
		ref: import_react.useCallback((node2) => {
			if (node2) {
				const styles = getComputedStyle(node2);
				stylesRef.current = styles;
				mountAnimationNameRef.current = getAnimationName(styles);
			} else stylesRef.current = null;
			setNode(node2);
		}, [])
	};
}
__name$12(usePresence, "usePresence");
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
__name$12(setRef, "setRef");
function useStableComposedRefs(...refs) {
	const refsRef = import_react.useRef(refs);
	refsRef.current = refs;
	return import_react.useCallback((node) => {
		const currentRefs = refsRef.current;
		let hasCleanup = false;
		const cleanups = currentRefs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup === "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup === "function") cleanup();
				else setRef(currentRefs[i], null);
			}
		};
	}, []);
}
__name$12(useStableComposedRefs, "useStableComposedRefs");
function getAnimationName(styles) {
	return styles?.animationName || "none";
}
__name$12(getAnimationName, "getAnimationName");
function getElementRef(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
__name$12(getElementRef, "getElementRef");
//#endregion
//#region node_modules/@radix-ui/react-focus-guards/dist/index.mjs
var count = 0;
var guards = null;
function useFocusGuards() {
	import_react.useEffect(() => {
		if (!guards) guards = {
			start: createFocusGuard(),
			end: createFocusGuard()
		};
		const { start, end } = guards;
		if (document.body.firstElementChild !== start) document.body.insertAdjacentElement("afterbegin", start);
		if (document.body.lastElementChild !== end) document.body.insertAdjacentElement("beforeend", end);
		count++;
		return () => {
			if (count === 1) {
				guards?.start.remove();
				guards?.end.remove();
				guards = null;
			}
			count = Math.max(0, count - 1);
		};
	}, []);
}
function createFocusGuard() {
	const element = document.createElement("span");
	element.setAttribute("data-radix-focus-guard", "");
	element.tabIndex = 0;
	element.style.outline = "none";
	element.style.opacity = "0";
	element.style.position = "fixed";
	element.style.pointerEvents = "none";
	return element;
}
//#endregion
//#region node_modules/tslib/tslib.es6.mjs
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}
//#endregion
//#region node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var zeroRightClassName = "right-scroll-bar-position";
var fullWidthClassName = "width-before-scroll-bar";
var noScrollbarsClassName = "with-scroll-bars-hidden";
/**
* Name of a CSS variable containing the amount of "hidden" scrollbar
* ! might be undefined ! use will fallback!
*/
var removedBarSizeVariable = "--removed-body-scroll-bar-size";
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/assignRef.js
/**
* Assigns a value for a given ref, no matter of the ref format
* @param {RefObject} ref - a callback function or ref object
* @param value - a new value
*
* @see https://github.com/theKashey/use-callback-ref#assignref
* @example
* const refObject = useRef();
* const refFn = (ref) => {....}
*
* assignRef(refObject, "refValue");
* assignRef(refFn, "refValue");
*/
function assignRef(ref, value) {
	if (typeof ref === "function") ref(value);
	else if (ref) ref.current = value;
	return ref;
}
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/useRef.js
/**
* creates a MutableRef with ref change callback
* @param initialValue - initial ref value
* @param {Function} callback - a callback to run when value changes
*
* @example
* const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
* ref.current = 1;
* // prints 0 -> 1
*
* @see https://reactjs.org/docs/hooks-reference.html#useref
* @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
* @returns {MutableRefObject}
*/
function useCallbackRef(initialValue, callback) {
	var ref = (0, import_react.useState)(function() {
		return {
			value: initialValue,
			callback,
			facade: {
				get current() {
					return ref.value;
				},
				set current(value) {
					var last = ref.value;
					if (last !== value) {
						ref.value = value;
						ref.callback(value, last);
					}
				}
			}
		};
	})[0];
	ref.callback = callback;
	return ref.facade;
}
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
var currentValues = /* @__PURE__ */ new WeakMap();
/**
* Merges two or more refs together providing a single interface to set their value
* @param {RefObject|Ref} refs
* @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
*
* @see {@link mergeRefs} a version without buit-in memoization
* @see https://github.com/theKashey/use-callback-ref#usemergerefs
* @example
* const Component = React.forwardRef((props, ref) => {
*   const ownRef = useRef();
*   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
*   return <div ref={domRef}>...</div>
* }
*/
function useMergeRefs(refs, defaultValue) {
	var callbackRef = useCallbackRef(defaultValue || null, function(newValue) {
		return refs.forEach(function(ref) {
			return assignRef(ref, newValue);
		});
	});
	useIsomorphicLayoutEffect(function() {
		var oldValue = currentValues.get(callbackRef);
		if (oldValue) {
			var prevRefs_1 = new Set(oldValue);
			var nextRefs_1 = new Set(refs);
			var current_1 = callbackRef.current;
			prevRefs_1.forEach(function(ref) {
				if (!nextRefs_1.has(ref)) assignRef(ref, null);
			});
			nextRefs_1.forEach(function(ref) {
				if (!prevRefs_1.has(ref)) assignRef(ref, current_1);
			});
		}
		currentValues.set(callbackRef, refs);
	}, [refs]);
	return callbackRef;
}
//#endregion
//#region node_modules/use-sidecar/dist/es2015/medium.js
function ItoI(a) {
	return a;
}
function innerCreateMedium(defaults, middleware) {
	if (middleware === void 0) middleware = ItoI;
	var buffer = [];
	var assigned = false;
	return {
		read: function() {
			if (assigned) throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			if (buffer.length) return buffer[buffer.length - 1];
			return defaults;
		},
		useMedium: function(data) {
			var item = middleware(data, assigned);
			buffer.push(item);
			return function() {
				buffer = buffer.filter(function(x) {
					return x !== item;
				});
			};
		},
		assignSyncMedium: function(cb) {
			assigned = true;
			while (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
			}
			buffer = {
				push: function(x) {
					return cb(x);
				},
				filter: function() {
					return buffer;
				}
			};
		},
		assignMedium: function(cb) {
			assigned = true;
			var pendingQueue = [];
			if (buffer.length) {
				var cbs = buffer;
				buffer = [];
				cbs.forEach(cb);
				pendingQueue = buffer;
			}
			var executeQueue = function() {
				var cbs = pendingQueue;
				pendingQueue = [];
				cbs.forEach(cb);
			};
			var cycle = function() {
				return Promise.resolve().then(executeQueue);
			};
			cycle();
			buffer = {
				push: function(x) {
					pendingQueue.push(x);
					cycle();
				},
				filter: function(filter) {
					pendingQueue = pendingQueue.filter(filter);
					return buffer;
				}
			};
		}
	};
}
function createSidecarMedium(options) {
	if (options === void 0) options = {};
	var medium = innerCreateMedium(null);
	medium.options = __assign({
		async: true,
		ssr: false
	}, options);
	return medium;
}
//#endregion
//#region node_modules/use-sidecar/dist/es2015/exports.js
var SideCar = function(_a) {
	var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
	if (!sideCar) throw new Error("Sidecar: please provide `sideCar` property to import the right car");
	var Target = sideCar.read();
	if (!Target) throw new Error("Sidecar medium not found");
	return import_react.createElement(Target, __assign({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
	medium.useMedium(exported);
	return SideCar;
}
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/medium.js
var effectCar = createSidecarMedium();
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/UI.js
var nothing = function() {};
/**
* Removes scrollbar from the page and contain the scroll within the Lock
*/
var RemoveScroll = import_react.forwardRef(function(props, parentRef) {
	var ref = import_react.useRef(null);
	var _a = import_react.useState({
		onScrollCapture: nothing,
		onWheelCapture: nothing,
		onTouchMoveCapture: nothing
	}), callbacks = _a[0], setCallbacks = _a[1];
	var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]);
	var SideCar = sideCar;
	var containerRef = useMergeRefs([ref, parentRef]);
	var containerProps = __assign(__assign({}, rest), callbacks);
	return import_react.createElement(import_react.Fragment, null, enabled && import_react.createElement(SideCar, {
		sideCar: effectCar,
		removeScrollBar,
		shards,
		noRelative,
		noIsolation,
		inert,
		setCallbacks,
		allowPinchZoom: !!allowPinchZoom,
		lockRef: ref,
		gapMode
	}), forwardProps ? import_react.cloneElement(import_react.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : import_react.createElement(Container, __assign({}, containerProps, {
		className,
		ref: containerRef
	}), children));
});
RemoveScroll.defaultProps = {
	enabled: true,
	removeScrollBar: true,
	inert: false
};
RemoveScroll.classNames = {
	fullWidth: fullWidthClassName,
	zeroRight: zeroRightClassName
};
//#endregion
//#region node_modules/get-nonce/dist/es2015/index.js
var currentNonce;
var getNonce = function() {
	if (currentNonce) return currentNonce;
	if (typeof __webpack_nonce__ !== "undefined") return __webpack_nonce__;
};
//#endregion
//#region node_modules/react-style-singleton/dist/es2015/singleton.js
function makeStyleTag() {
	if (!document) return null;
	var tag = document.createElement("style");
	tag.type = "text/css";
	var nonce = getNonce();
	if (nonce) tag.setAttribute("nonce", nonce);
	return tag;
}
function injectStyles(tag, css) {
	if (tag.styleSheet) tag.styleSheet.cssText = css;
	else tag.appendChild(document.createTextNode(css));
}
function insertStyleTag(tag) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(tag);
}
var stylesheetSingleton = function() {
	var counter = 0;
	var stylesheet = null;
	return {
		add: function(style) {
			if (counter == 0) {
				if (stylesheet = makeStyleTag()) {
					injectStyles(stylesheet, style);
					insertStyleTag(stylesheet);
				}
			}
			counter++;
		},
		remove: function() {
			counter--;
			if (!counter && stylesheet) {
				stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
				stylesheet = null;
			}
		}
	};
};
//#endregion
//#region node_modules/react-style-singleton/dist/es2015/hook.js
/**
* creates a hook to control style singleton
* @see {@link styleSingleton} for a safer component version
* @example
* ```tsx
* const useStyle = styleHookSingleton();
* ///
* useStyle('body { overflow: hidden}');
*/
var styleHookSingleton = function() {
	var sheet = stylesheetSingleton();
	return function(styles, isDynamic) {
		import_react.useEffect(function() {
			sheet.add(styles);
			return function() {
				sheet.remove();
			};
		}, [styles && isDynamic]);
	};
};
//#endregion
//#region node_modules/react-style-singleton/dist/es2015/component.js
/**
* create a Component to add styles on demand
* - styles are added when first instance is mounted
* - styles are removed when the last instance is unmounted
* - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
*/
var styleSingleton = function() {
	var useStyle = styleHookSingleton();
	var Sheet = function(_a) {
		var styles = _a.styles, dynamic = _a.dynamic;
		useStyle(styles, dynamic);
		return null;
	};
	return Sheet;
};
//#endregion
//#region node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var zeroGap = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
};
var parse = function(x) {
	return parseInt(x || "", 10) || 0;
};
var getOffset = function(gapMode) {
	var cs = window.getComputedStyle(document.body);
	var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
	var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
	var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
	return [
		parse(left),
		parse(top),
		parse(right)
	];
};
var getGapWidth = function(gapMode) {
	if (gapMode === void 0) gapMode = "margin";
	if (typeof window === "undefined") return zeroGap;
	var offsets = getOffset(gapMode);
	var documentWidth = document.documentElement.clientWidth;
	var windowWidth = window.innerWidth;
	return {
		left: offsets[0],
		top: offsets[1],
		right: offsets[2],
		gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
	};
};
//#endregion
//#region node_modules/react-remove-scroll-bar/dist/es2015/component.js
var Style = styleSingleton();
var lockAttribute = "data-scroll-locked";
var getStyles = function(_a, allowRelative, gapMode, important) {
	var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
	if (gapMode === void 0) gapMode = "margin";
	return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
		allowRelative && "position: relative ".concat(important, ";"),
		gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
		gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
	].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
	var counter = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
	import_react.useEffect(function() {
		document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
		return function() {
			var newCounter = getCurrentUseCounter() - 1;
			if (newCounter <= 0) document.body.removeAttribute(lockAttribute);
			else document.body.setAttribute(lockAttribute, newCounter.toString());
		};
	}, []);
};
/**
* Removes page scrollbar and blocks page scroll when mounted
*/
var RemoveScrollBar = function(_a) {
	var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
	useLockAttribute();
	var gap = import_react.useMemo(function() {
		return getGapWidth(gapMode);
	}, [gapMode]);
	return import_react.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
};
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var passiveSupported = false;
if (typeof window !== "undefined") try {
	var options = Object.defineProperty({}, "passive", { get: function() {
		passiveSupported = true;
		return true;
	} });
	window.addEventListener("test", options, options);
	window.removeEventListener("test", options, options);
} catch (err) {
	passiveSupported = false;
}
var nonPassive = passiveSupported ? { passive: false } : false;
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var alwaysContainsScroll = function(node) {
	return node.tagName === "TEXTAREA";
};
var elementCanBeScrolled = function(node, overflow) {
	if (!(node instanceof Element)) return false;
	var styles = window.getComputedStyle(node);
	return styles[overflow] !== "hidden" && !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible");
};
var elementCouldBeVScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowY");
};
var elementCouldBeHScrolled = function(node) {
	return elementCanBeScrolled(node, "overflowX");
};
var locationCouldBeScrolled = function(axis, node) {
	var ownerDocument = node.ownerDocument;
	var current = node;
	do {
		if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) current = current.host;
		if (elementCouldBeScrolled(axis, current)) {
			var _a = getScrollVariables(axis, current);
			if (_a[1] > _a[2]) return true;
		}
		current = current.parentNode;
	} while (current && current !== ownerDocument.body);
	return false;
};
var getVScrollVariables = function(_a) {
	return [
		_a.scrollTop,
		_a.scrollHeight,
		_a.clientHeight
	];
};
var getHScrollVariables = function(_a) {
	return [
		_a.scrollLeft,
		_a.scrollWidth,
		_a.clientWidth
	];
};
var elementCouldBeScrolled = function(axis, node) {
	return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
	return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
	/**
	* If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
	* and then increasingly negative as you scroll towards the end of the content.
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	*/
	return axis === "h" && direction === "rtl" ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
	var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
	var delta = directionFactor * sourceDelta;
	var target = event.target;
	var targetInLock = endTarget.contains(target);
	var shouldCancelScroll = false;
	var isDeltaPositive = delta > 0;
	var availableScroll = 0;
	var availableScrollTop = 0;
	do {
		if (!target) break;
		var _a = getScrollVariables(axis, target), position = _a[0];
		var elementScroll = _a[1] - _a[2] - directionFactor * position;
		if (position || elementScroll) {
			if (elementCouldBeScrolled(axis, target)) {
				availableScroll += elementScroll;
				availableScrollTop += position;
			}
		}
		var parent_1 = target.parentNode;
		target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
	} while (!targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target));
	if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) shouldCancelScroll = true;
	else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) shouldCancelScroll = true;
	return shouldCancelScroll;
};
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var getTouchXY = function(event) {
	return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function(event) {
	return [event.deltaX, event.deltaY];
};
var extractRef = function(ref) {
	return ref && "current" in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
	return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
	return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
	var shouldPreventQueue = import_react.useRef([]);
	var touchStartRef = import_react.useRef([0, 0]);
	var activeAxis = import_react.useRef();
	var id = import_react.useState(idCounter++)[0];
	var Style = import_react.useState(styleSingleton)[0];
	var lastProps = import_react.useRef(props);
	import_react.useEffect(function() {
		lastProps.current = props;
	}, [props]);
	import_react.useEffect(function() {
		if (props.inert) {
			document.body.classList.add("block-interactivity-".concat(id));
			var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
			allow_1.forEach(function(el) {
				return el.classList.add("allow-interactivity-".concat(id));
			});
			return function() {
				document.body.classList.remove("block-interactivity-".concat(id));
				allow_1.forEach(function(el) {
					return el.classList.remove("allow-interactivity-".concat(id));
				});
			};
		}
	}, [
		props.inert,
		props.lockRef.current,
		props.shards
	]);
	var shouldCancelEvent = import_react.useCallback(function(event, parent) {
		if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) return !lastProps.current.allowPinchZoom;
		var touch = getTouchXY(event);
		var touchStart = touchStartRef.current;
		var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
		var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
		var currentAxis;
		var target = event.target;
		var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
		if ("touches" in event && moveDirection === "h" && target.type === "range") return false;
		var selection = window.getSelection();
		var anchorNode = selection && selection.anchorNode;
		if (anchorNode ? anchorNode === target || anchorNode.contains(target) : false) return false;
		var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		if (!canBeScrolledInMainDirection) return true;
		if (canBeScrolledInMainDirection) currentAxis = moveDirection;
		else {
			currentAxis = moveDirection === "v" ? "h" : "v";
			canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
		}
		if (!canBeScrolledInMainDirection) return false;
		if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) activeAxis.current = currentAxis;
		if (!currentAxis) return true;
		var cancelingAxis = activeAxis.current || currentAxis;
		return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY, true);
	}, []);
	var shouldPrevent = import_react.useCallback(function(_event) {
		var event = _event;
		if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) return;
		var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
		var sourceEvent = shouldPreventQueue.current.filter(function(e) {
			return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
		})[0];
		if (sourceEvent && sourceEvent.should) {
			if (event.cancelable) event.preventDefault();
			return;
		}
		if (!sourceEvent) {
			var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
				return node.contains(event.target);
			});
			if (shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation) {
				if (event.cancelable) event.preventDefault();
			}
		}
	}, []);
	var shouldCancel = import_react.useCallback(function(name, delta, target, should) {
		var event = {
			name,
			delta,
			target,
			should,
			shadowParent: getOutermostShadowParent(target)
		};
		shouldPreventQueue.current.push(event);
		setTimeout(function() {
			shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
				return e !== event;
			});
		}, 1);
	}, []);
	var scrollTouchStart = import_react.useCallback(function(event) {
		touchStartRef.current = getTouchXY(event);
		activeAxis.current = void 0;
	}, []);
	var scrollWheel = import_react.useCallback(function(event) {
		shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	var scrollTouchMove = import_react.useCallback(function(event) {
		shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
	}, []);
	import_react.useEffect(function() {
		lockStack.push(Style);
		props.setCallbacks({
			onScrollCapture: scrollWheel,
			onWheelCapture: scrollWheel,
			onTouchMoveCapture: scrollTouchMove
		});
		document.addEventListener("wheel", shouldPrevent, nonPassive);
		document.addEventListener("touchmove", shouldPrevent, nonPassive);
		document.addEventListener("touchstart", scrollTouchStart, nonPassive);
		return function() {
			lockStack = lockStack.filter(function(inst) {
				return inst !== Style;
			});
			document.removeEventListener("wheel", shouldPrevent, nonPassive);
			document.removeEventListener("touchmove", shouldPrevent, nonPassive);
			document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
		};
	}, []);
	var removeScrollBar = props.removeScrollBar, inert = props.inert;
	return import_react.createElement(import_react.Fragment, null, inert ? import_react.createElement(Style, { styles: generateStyle(id) }) : null, removeScrollBar ? import_react.createElement(RemoveScrollBar, {
		noRelative: props.noRelative,
		gapMode: props.gapMode
	}) : null);
}
function getOutermostShadowParent(node) {
	var shadowParent = null;
	while (node !== null) {
		if (node instanceof ShadowRoot) {
			shadowParent = node.host;
			node = node.host;
		}
		node = node.parentNode;
	}
	return shadowParent;
}
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/sidecar.js
var sidecar_default = exportSidecar(effectCar, RemoveScrollSideCar);
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/Combination.js
var ReactRemoveScroll = import_react.forwardRef(function(props, ref) {
	return import_react.createElement(RemoveScroll, __assign({}, props, {
		ref,
		sideCar: sidecar_default
	}));
});
ReactRemoveScroll.classNames = RemoveScroll.classNames;
//#endregion
//#region node_modules/aria-hidden/dist/es2015/index.js
var getDefaultParent = function(originalTarget) {
	if (typeof document === "undefined") return null;
	return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
};
var counterMap = /* @__PURE__ */ new WeakMap();
var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
	return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
	return targets.map(function(target) {
		if (parent.contains(target)) return target;
		var correctedTarget = unwrapHost(target);
		if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
		console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
		return null;
	}).filter(function(x) {
		return Boolean(x);
	});
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @param {String} [controlAttribute] - html Attribute to control
* @return {Undo} undo command
*/
var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
	var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
	var markerCounter = markerMap[markerName];
	var hiddenNodes = [];
	var elementsToKeep = /* @__PURE__ */ new Set();
	var elementsToStop = new Set(targets);
	var keep = function(el) {
		if (!el || elementsToKeep.has(el)) return;
		elementsToKeep.add(el);
		keep(el.parentNode);
	};
	targets.forEach(keep);
	var deep = function(parent) {
		if (!parent || elementsToStop.has(parent)) return;
		Array.prototype.forEach.call(parent.children, function(node) {
			if (elementsToKeep.has(node)) deep(node);
			else try {
				var attr = node.getAttribute(controlAttribute);
				var alreadyHidden = attr !== null && attr !== "false";
				var counterValue = (counterMap.get(node) || 0) + 1;
				var markerValue = (markerCounter.get(node) || 0) + 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				hiddenNodes.push(node);
				if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
				if (markerValue === 1) node.setAttribute(markerName, "true");
				if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
			} catch (e) {
				console.error("aria-hidden: cannot operate on ", node, e);
			}
		});
	};
	deep(parentNode);
	elementsToKeep.clear();
	lockCount++;
	return function() {
		hiddenNodes.forEach(function(node) {
			var counterValue = counterMap.get(node) - 1;
			var markerValue = markerCounter.get(node) - 1;
			counterMap.set(node, counterValue);
			markerCounter.set(node, markerValue);
			if (!counterValue) {
				if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
				uncontrolledNodes.delete(node);
			}
			if (!markerValue) node.removeAttribute(markerName);
		});
		lockCount--;
		if (!lockCount) {
			counterMap = /* @__PURE__ */ new WeakMap();
			counterMap = /* @__PURE__ */ new WeakMap();
			uncontrolledNodes = /* @__PURE__ */ new WeakMap();
			markerMap = {};
		}
	};
};
/**
* Marks everything except given node(or nodes) as aria-hidden
* @param {Element | Element[]} originalTarget - elements to keep on the page
* @param [parentNode] - top element, defaults to document.body
* @param {String} [markerName] - a special attribute to mark every node
* @return {Undo} undo command
*/
var hideOthers = function(originalTarget, parentNode, markerName) {
	if (markerName === void 0) markerName = "data-aria-hidden";
	var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
	var activeParentNode = parentNode || getDefaultParent(originalTarget);
	if (!activeParentNode) return function() {
		return null;
	};
	targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
	return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
};
//#endregion
//#region node_modules/@radix-ui/react-dialog/dist/index.mjs
var __defProp$11 = Object.defineProperty;
var __name$11 = (target, value) => __defProp$11(target, "name", {
	value,
	configurable: true
});
var DIALOG_NAME = "Dialog";
var [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = /* @__PURE__ */ __name$11((props) => {
	const { __scopeDialog, children, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const triggerRef = import_react.useRef(null);
	const contentRef = import_react.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DIALOG_NAME
	});
	const [titleCount, setTitleCount] = import_react.useState(0);
	const [descriptionCount, setDescriptionCount] = import_react.useState(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogProvider, {
		scope: __scopeDialog,
		triggerRef,
		contentRef,
		contentId: useId(),
		titleId: useId(),
		descriptionId: useId(),
		titlePresent: titleCount > 0,
		descriptionPresent: descriptionCount > 0,
		setTitleCount,
		setDescriptionCount,
		open,
		onOpenChange: setOpen,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children
	});
}, "Dialog");
var TRIGGER_NAME$6 = "DialogTrigger";
var DialogTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogTrigger2(props, forwardedRef) {
	const { __scopeDialog, ...triggerProps } = props;
	const context = useDialogContext(TRIGGER_NAME$6, __scopeDialog);
	const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": context.open,
		"aria-controls": context.open ? context.contentId : void 0,
		"data-state": getState$3(context.open),
		...triggerProps,
		ref: composedTriggerRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
}, "DialogTrigger"));
var PORTAL_NAME$1 = "DialogPortal";
var [PortalProvider$2, usePortalContext$2] = createDialogContext(PORTAL_NAME$1, { forceMount: void 0 });
var DialogPortal = /* @__PURE__ */ __name$11((props) => {
	const { __scopeDialog, forceMount, children, container } = props;
	const context = useDialogContext(PORTAL_NAME$1, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider$2, {
		scope: __scopeDialog,
		forceMount,
		children: import_react.Children.map(children, (child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$1, {
				asChild: true,
				container,
				children: child
			})
		}))
	});
}, "DialogPortal");
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogOverlay2(props, forwardedRef) {
	const portalContext = usePortalContext$2(OVERLAY_NAME, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
	return context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlayImpl, {
			...overlayProps,
			ref: forwardedRef
		})
	}) : null;
}, "DialogOverlay"));
var Slot$2 = /* @__PURE__ */ createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogOverlayImpl2(props, forwardedRef) {
	const { __scopeDialog, ...overlayProps } = props;
	const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
	const composedRefs = useComposedRefs(forwardedRef, useDismissableLayerSurface());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
		as: Slot$2,
		allowPinchZoom: true,
		shards: [context.contentRef],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": getState$3(context.open),
			...overlayProps,
			ref: composedRefs,
			style: {
				pointerEvents: "auto",
				...overlayProps.style
			}
		})
	});
}, "DialogOverlayImpl"));
var CONTENT_NAME$7 = "DialogContent";
var DialogContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogContent2(props, forwardedRef) {
	const portalContext = usePortalContext$2(CONTENT_NAME$7, props.__scopeDialog);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME$7, props.__scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: context.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentModal, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentNonModal, {
			...contentProps,
			ref: forwardedRef
		})
	});
}, "DialogContent"));
var DialogContentModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogContentModal2(props, forwardedRef) {
	const context = useDialogContext(CONTENT_NAME$7, props.__scopeDialog);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
	import_react.useEffect(() => {
		const content = contentRef.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: context.open,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			event.preventDefault();
			context.triggerRef.current?.focus();
		}),
		onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
		}),
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault())
	});
}, "DialogContentModal"));
var DialogContentNonModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogContentNonModal2(props, forwardedRef) {
	const context = useDialogContext(CONTENT_NAME$7, props.__scopeDialog);
	const hasInteractedOutsideRef = import_react.useRef(false);
	const hasPointerDownOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		onCloseAutoFocus: (event) => {
			props.onCloseAutoFocus?.(event);
			if (!event.defaultPrevented) {
				if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
				event.preventDefault();
			}
			hasInteractedOutsideRef.current = false;
			hasPointerDownOutsideRef.current = false;
		},
		onInteractOutside: (event) => {
			props.onInteractOutside?.(event);
			if (!event.defaultPrevented) {
				hasInteractedOutsideRef.current = true;
				if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.current = true;
			}
			const target = event.target;
			if (context.triggerRef.current?.contains(target)) event.preventDefault();
			if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) event.preventDefault();
		}
	});
}, "DialogContentNonModal"));
var DialogContentImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogContentImpl2(props, forwardedRef) {
	const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
	const context = useDialogContext(CONTENT_NAME$7, __scopeDialog);
	useFocusGuards();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
		asChild: true,
		loop: true,
		trapped: trapFocus,
		onMountAutoFocus: onOpenAutoFocus,
		onUnmountAutoFocus: onCloseAutoFocus,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
			role: "dialog",
			id: context.contentId,
			"aria-describedby": context.descriptionPresent ? context.descriptionId : void 0,
			"aria-labelledby": context.titlePresent ? context.titleId : void 0,
			"data-state": getState$3(context.open),
			...contentProps,
			ref: forwardedRef,
			deferPointerDownOutside: true,
			onDismiss: () => context.onOpenChange(false)
		})
	}) });
}, "DialogContentImpl"));
var TITLE_NAME = "DialogTitle";
var DialogTitle = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogTitle2(props, forwardedRef) {
	const { __scopeDialog, ...titleProps } = props;
	const context = useDialogContext(TITLE_NAME, __scopeDialog);
	const { setTitleCount } = context;
	useLayoutEffect2(() => {
		setTitleCount((count) => count + 1);
		return () => setTitleCount((count) => count - 1);
	}, [setTitleCount]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.h2, {
		id: context.titleId,
		...titleProps,
		ref: forwardedRef
	});
}, "DialogTitle"));
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogDescription2(props, forwardedRef) {
	const { __scopeDialog, ...descriptionProps } = props;
	const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
	const { setDescriptionCount } = context;
	useLayoutEffect2(() => {
		setDescriptionCount((count) => count + 1);
		return () => setDescriptionCount((count) => count - 1);
	}, [setDescriptionCount]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.p, {
		id: context.descriptionId,
		...descriptionProps,
		ref: forwardedRef
	});
}, "DialogDescription"));
var CLOSE_NAME = "DialogClose";
var DialogClose = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$11(function DialogClose2(props, forwardedRef) {
	const { __scopeDialog, ...closeProps } = props;
	const context = useDialogContext(CLOSE_NAME, __scopeDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		...closeProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
	});
}, "DialogClose"));
function getState$3(open) {
	return open ? "open" : "closed";
}
__name$11(getState$3, "getState");
//#endregion
//#region node_modules/@radix-ui/react-collection/dist/index.mjs
function createCollection(name) {
	const PROVIDER_NAME = name + "CollectionProvider";
	const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
	const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	});
	const CollectionProvider = (props) => {
		const { scope, children } = props;
		const ref = import_react.useRef(null);
		const itemMap = import_react.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionProviderImpl, {
			scope,
			itemMap,
			collectionRef: ref,
			children
		});
	};
	CollectionProvider.displayName = PROVIDER_NAME;
	const COLLECTION_SLOT_NAME = name + "CollectionSlot";
	const CollectionSlotImpl = /* @__PURE__ */ createSlot(COLLECTION_SLOT_NAME);
	const CollectionSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children } = props;
		const composedRefs = useComposedRefs(forwardedRef, useCollectionContext(COLLECTION_SLOT_NAME, scope).collectionRef);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionSlotImpl, {
			ref: composedRefs,
			children
		});
	});
	CollectionSlot.displayName = COLLECTION_SLOT_NAME;
	const ITEM_SLOT_NAME = name + "CollectionItemSlot";
	const ITEM_DATA_ATTR = "data-radix-collection-item";
	const CollectionItemSlotImpl = /* @__PURE__ */ createSlot(ITEM_SLOT_NAME);
	const CollectionItemSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children, ...itemData } = props;
		const ref = import_react.useRef(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);
		const context = useCollectionContext(ITEM_SLOT_NAME, scope);
		import_react.useEffect(() => {
			context.itemMap.set(ref, {
				ref,
				...itemData
			});
			return () => void context.itemMap.delete(ref);
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionItemSlotImpl, {
			[ITEM_DATA_ATTR]: "",
			ref: composedRefs,
			children
		});
	});
	CollectionItemSlot.displayName = ITEM_SLOT_NAME;
	function useCollection(scope) {
		const context = useCollectionContext(name + "CollectionConsumer", scope);
		return import_react.useCallback(() => {
			const collectionNode = context.collectionRef.current;
			if (!collectionNode) return [];
			const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
			return Array.from(context.itemMap.values()).sort((a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current));
		}, [context.collectionRef, context.itemMap]);
	}
	return [
		{
			Provider: CollectionProvider,
			Slot: CollectionSlot,
			ItemSlot: CollectionItemSlot
		},
		useCollection,
		createCollectionScope
	];
}
//#endregion
//#region node_modules/@radix-ui/react-direction/dist/index.mjs
var DirectionContext = import_react.createContext(void 0);
function useDirection(localDir) {
	const globalDir = import_react.useContext(DirectionContext);
	return localDir || globalDir || "ltr";
}
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
var sides = [
	"top",
	"right",
	"bottom",
	"left"
];
var min = Math.min;
var max = Math.max;
var round = Math.round;
var floor = Math.floor;
var createCoords = (v) => ({
	x: v,
	y: v
});
var oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp$1(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
var lrPlacement = ["left", "right"];
var rlPlacement = ["right", "left"];
var tbPlacement = ["top", "bottom"];
var btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	var _padding$top, _padding$right, _padding$bottom, _padding$left;
	return {
		top: (_padding$top = padding.top) != null ? _padding$top : 0,
		right: (_padding$right = padding.right) != null ? _padding$right : 0,
		bottom: (_padding$bottom = padding.bottom) != null ? _padding$bottom : 0,
		left: (_padding$left = padding.left) != null ? _padding$left : 0
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}
//#endregion
//#region node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	const alignment = getAlignment(placement);
	if (alignment) coords[alignmentAxis] += commonAlign * (alignment === "end" ? 1 : -1) * (rtl && isVertical ? -1 : 1);
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) && await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
var MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
var computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$3 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp$1(minPadding, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement":
						resetPlacement = initialPlacement;
						break;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
var originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$2 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const clampCoord = (axis, coord) => clamp$1(coord + overflow[axis === "y" ? "top" : "left"], coord, coord - overflow[axis === "y" ? "bottom" : "right"]);
			if (checkMainAxis) mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
			if (checkCrossAxis) crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$2 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			var _rawOffset$mainAxis, _rawOffset$crossAxis;
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) != null ? _rawOffset$mainAxis : 0,
				crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) != null ? _rawOffset$crossAxis : 0
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$2 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const shiftData = state.middlewareData.shift;
			const noShift = !shiftData;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if (shiftData != null && shiftData.enabled.x) availableWidth = maximumClippingWidth;
			if (shiftData != null && shiftData.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) if (isYAxis) availableWidth = width - 2 * max(overflow.left, overflow.right);
			else availableHeight = height - 2 * max(overflow.top, overflow.bottom);
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
var containRe = /paint|layout|strict|content/;
var isNotNone = (value) => !!value && value !== "none";
var isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return (node.ownerDocument || node).body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
//#endregion
//#region node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
var noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) if (offsetParent) {
		if (isElement(offsetParent)) scale = getScale(offsetParent);
	} else scale = getScale(element);
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement && offsetParent) {
		const win = getWindow(domElement);
		const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return element.getClientRects ? Array.from(element.getClientRects()) : [];
}
function getDocumentRect(html) {
	const scroll = getNodeScroll(html);
	const body = html.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(html);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
var SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary) {
	if (rootBoundary === void 0) rootBoundary = "viewport";
	const isLayoutViewport = rootBoundary === "layoutViewport";
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		const layoutRelativeClientCoords = !isWebKit() || strategy === "fixed";
		if (isLayoutViewport) {
			if (!layoutRelativeClientCoords) {
				x = -visualViewport.offsetLeft;
				y = -visualViewport.offsetTop;
			}
		} else {
			width = visualViewport.width;
			height = visualViewport.height;
			if (layoutRelativeClientCoords) {
				x = visualViewport.offsetLeft;
				y = visualViewport.offsetTop;
			}
		}
	}
	if (getWindowScrollBarX(html) <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const reservedWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		const gutter = getComputedStyle(html).scrollbarGutter === "stable both-edges" ? reservedWidth / 2 : reservedWidth;
		if (gutter <= SCROLLBAR_MAX) width -= gutter;
	}
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = getScale(element);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport" || clippingAncestor === "layoutViewport") rect = getViewportRect(element, strategy, clippingAncestor);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let lastKeptComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? "fixed" : "";
		if (!currentNodeIsContaining && (lastPosition === "fixed" || lastPosition === "absolute" && computedStyle.position === "static")) result = result.filter((ancestor) => ancestor !== currentNode);
		else lastKeptComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	if (isOffsetParentAnElement || !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	if (!isOffsetParentAnElement && documentElement) offsets.x = getWindowScrollBarX(documentElement);
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
var getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
var platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove, ancestorResize) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (!rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) return refresh();
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	const win = getWindow(element);
	const handleResize = () => refresh(ancestorResize);
	win.addEventListener("resize", handleResize);
	refresh(true);
	return () => {
		win.removeEventListener("resize", handleResize);
		cleanup();
	};
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update);
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update, ancestorResize) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset$1 = offset$2;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift$1 = shift$2;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip$1 = flip$2;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size$1 = size$2;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide$1 = hide$2;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$2 = arrow$3;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift$1 = limitShift$2;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
var computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = options != null ? options : {};
	const platformWithCache = {
		...platform,
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};
//#endregion
//#region node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.mjs
var index = typeof document !== "undefined" ? import_react.useLayoutEffect : function noop() {};
function deepEqual(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (typeof a === "function" && a.toString() === b.toString()) return true;
	let length;
	let i;
	let keys;
	if (a && b && typeof a === "object") {
		if (Array.isArray(a)) {
			length = a.length;
			if (length !== b.length) return false;
			for (i = length; i-- !== 0;) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}
		keys = Object.keys(a);
		length = keys.length;
		if (length !== Object.keys(b).length) return false;
		for (i = length; i-- !== 0;) if (!{}.hasOwnProperty.call(b, keys[i])) return false;
		for (i = length; i-- !== 0;) {
			const key = keys[i];
			if (key === "_owner" && a.$$typeof) continue;
			if (!deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
	return a !== a && b !== b;
}
function getDPR(element) {
	if (typeof window === "undefined") return 1;
	return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function roundByDPR(element, value) {
	const dpr = getDPR(element);
	return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
	const ref = import_react.useRef(value);
	index(() => {
		ref.current = value;
	});
	return ref;
}
/**
* Provides data to position a floating element.
* @see https://floating-ui.com/docs/useFloating
*/
function useFloating(options) {
	if (options === void 0) options = {};
	const { placement = "bottom", strategy = "absolute", middleware = [], platform, elements: { reference: externalReference, floating: externalFloating } = {}, transform = true, whileElementsMounted, open } = options;
	const [data, setData] = import_react.useState({
		x: 0,
		y: 0,
		strategy,
		placement,
		middlewareData: {},
		isPositioned: false
	});
	const [latestMiddleware, setLatestMiddleware] = import_react.useState(middleware);
	if (!deepEqual(latestMiddleware, middleware)) setLatestMiddleware(middleware);
	const [_reference, _setReference] = import_react.useState(null);
	const [_floating, _setFloating] = import_react.useState(null);
	const setReference = import_react.useCallback((node) => {
		if (node !== referenceRef.current) {
			referenceRef.current = node;
			_setReference(node);
		}
	}, []);
	const setFloating = import_react.useCallback((node) => {
		if (node !== floatingRef.current) {
			floatingRef.current = node;
			_setFloating(node);
		}
	}, []);
	const referenceEl = externalReference || _reference;
	const floatingEl = externalFloating || _floating;
	const referenceRef = import_react.useRef(null);
	const floatingRef = import_react.useRef(null);
	const dataRef = import_react.useRef(data);
	const hasWhileElementsMounted = whileElementsMounted != null;
	const whileElementsMountedRef = useLatestRef(whileElementsMounted);
	const platformRef = useLatestRef(platform);
	const openRef = useLatestRef(open);
	const update = import_react.useCallback(() => {
		if (!referenceRef.current || !floatingRef.current) return;
		const config = {
			placement,
			strategy,
			middleware: latestMiddleware
		};
		if (platformRef.current) config.platform = platformRef.current;
		computePosition(referenceRef.current, floatingRef.current, config).then((data) => {
			const fullData = {
				...data,
				isPositioned: openRef.current !== false
			};
			if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
				dataRef.current = fullData;
				import_react_dom.flushSync(() => {
					setData(fullData);
				});
			}
		});
	}, [
		latestMiddleware,
		placement,
		strategy,
		platformRef,
		openRef
	]);
	index(() => {
		if (open === false && dataRef.current.isPositioned) {
			dataRef.current.isPositioned = false;
			setData((data) => ({
				...data,
				isPositioned: false
			}));
		}
	}, [open]);
	const isMountedRef = import_react.useRef(false);
	index(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	index(() => {
		if (referenceEl) referenceRef.current = referenceEl;
		if (floatingEl) floatingRef.current = floatingEl;
		if (referenceEl && floatingEl) {
			if (whileElementsMountedRef.current) return whileElementsMountedRef.current(referenceEl, floatingEl, update);
			update();
		}
	}, [
		referenceEl,
		floatingEl,
		update,
		whileElementsMountedRef,
		hasWhileElementsMounted
	]);
	const refs = import_react.useMemo(() => ({
		reference: referenceRef,
		floating: floatingRef,
		setReference,
		setFloating
	}), [setReference, setFloating]);
	const elements = import_react.useMemo(() => ({
		reference: referenceEl,
		floating: floatingEl
	}), [referenceEl, floatingEl]);
	const floatingStyles = import_react.useMemo(() => {
		const initialStyles = {
			position: strategy,
			left: 0,
			top: 0
		};
		if (!elements.floating) return initialStyles;
		const x = roundByDPR(elements.floating, data.x);
		const y = roundByDPR(elements.floating, data.y);
		if (transform) return {
			...initialStyles,
			transform: "translate(" + x + "px, " + y + "px)",
			...getDPR(elements.floating) >= 1.5 && { willChange: "transform" }
		};
		return {
			position: strategy,
			left: x,
			top: y
		};
	}, [
		strategy,
		transform,
		elements.floating,
		data.x,
		data.y
	]);
	return import_react.useMemo(() => ({
		...data,
		update,
		refs,
		elements,
		floatingStyles
	}), [
		data,
		update,
		refs,
		elements,
		floatingStyles
	]);
}
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow$1 = (options) => {
	function isRef(value) {
		return {}.hasOwnProperty.call(value, "current");
	}
	return {
		name: "arrow",
		options,
		fn(state) {
			const { element, padding } = typeof options === "function" ? options(state) : options;
			if (element && isRef(element)) {
				if (element.current != null) return arrow$2({
					element: element.current,
					padding
				}).fn(state);
				return {};
			}
			if (element) return arrow$2({
				element,
				padding
			}).fn(state);
			return {};
		}
	};
};
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
var offset = (options, deps) => {
	const result = offset$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
var shift = (options, deps) => {
	const result = shift$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
var limitShift = (options, deps) => {
	return {
		fn: limitShift$1(options).fn,
		options: [options, deps]
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
var flip = (options, deps) => {
	const result = flip$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
var size = (options, deps) => {
	const result = size$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
var hide = (options, deps) => {
	const result = hide$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* This wraps the core `arrow` middleware to allow React refs as the element.
* @see https://floating-ui.com/docs/arrow
*/
var arrow = (options, deps) => {
	const result = arrow$1(options);
	return {
		name: result.name,
		fn: result.fn,
		options: [options, deps]
	};
};
//#endregion
//#region node_modules/@radix-ui/react-use-size/dist/index.mjs
function useSize(element) {
	const [size, setSize] = import_react.useState(void 0);
	useLayoutEffect2(() => {
		if (element) {
			setSize({
				width: element.offsetWidth,
				height: element.offsetHeight
			});
			const resizeObserver = new ResizeObserver((entries) => {
				if (!Array.isArray(entries)) return;
				if (!entries.length) return;
				const entry = entries[0];
				let width;
				let height;
				if ("borderBoxSize" in entry) {
					const borderSizeEntry = entry["borderBoxSize"];
					const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
					width = borderSize["inlineSize"];
					height = borderSize["blockSize"];
				} else {
					width = element.offsetWidth;
					height = element.offsetHeight;
				}
				setSize({
					width,
					height
				});
			});
			resizeObserver.observe(element, { box: "border-box" });
			return () => resizeObserver.unobserve(element);
		} else setSize(void 0);
	}, [element]);
	return size;
}
//#endregion
//#region node_modules/@radix-ui/react-popper/dist/index.mjs
var __defProp$10 = Object.defineProperty;
var __name$10 = (target, value) => __defProp$10(target, "name", {
	value,
	configurable: true
});
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = /* @__PURE__ */ __name$10((props) => {
	const { __scopePopper, children } = props;
	const [anchor, setAnchor] = import_react.useState(null);
	const [placementState, setPlacementState] = import_react.useState(void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperProvider, {
		scope: __scopePopper,
		anchor,
		onAnchorChange: setAnchor,
		placementState,
		setPlacementState,
		children
	});
}, "Popper");
var ANCHOR_NAME = "PopperAnchor";
var PopperAnchor = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$10(function PopperAnchor2(props, forwardedRef) {
	const { __scopePopper, virtualRef, ...anchorProps } = props;
	const context = usePopperContext(ANCHOR_NAME, __scopePopper);
	const ref = import_react.useRef(null);
	const onAnchorChange = context.onAnchorChange;
	const composedRefs = useComposedRefs(forwardedRef, import_react.useCallback((node) => {
		ref.current = node;
		if (node) onAnchorChange(node);
	}, [onAnchorChange]));
	const anchorRef = import_react.useRef(null);
	import_react.useEffect(() => {
		if (!virtualRef) return;
		const previousAnchor = anchorRef.current;
		anchorRef.current = virtualRef.current;
		if (previousAnchor !== anchorRef.current) onAnchorChange(anchorRef.current);
	});
	const sideAndAlign = context.placementState && getSideAndAlignFromPlacement(context.placementState);
	const placedSide = sideAndAlign?.[0];
	const placedAlign = sideAndAlign?.[1];
	return virtualRef ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-radix-popper-side": placedSide,
		"data-radix-popper-align": placedAlign,
		...anchorProps,
		ref: composedRefs
	});
}, "PopperAnchor"));
var CONTENT_NAME$6 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$6);
var PopperContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$10(function PopperContent2(props, forwardedRef) {
	const { __scopePopper, side = "bottom", sideOffset = 0, align = "center", alignOffset = 0, arrowPadding = 0, avoidCollisions = true, collisionBoundary = [], collisionPadding: collisionPaddingProp = 0, sticky = "partial", hideWhenDetached = false, updatePositionStrategy = "optimized", onPlaced, ...contentProps } = props;
	const context = usePopperContext(CONTENT_NAME$6, __scopePopper);
	const [content, setContent] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, setContent);
	const [arrow$4, setArrow] = import_react.useState(null);
	const arrowSize = useSize(arrow$4);
	const arrowWidth = arrowSize?.width ?? 0;
	const arrowHeight = arrowSize?.height ?? 0;
	const desiredPlacement = side + (align !== "center" ? "-" + align : "");
	const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...collisionPaddingProp
	};
	const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
	const hasExplicitBoundaries = boundary.length > 0;
	const detectOverflowOptions = {
		padding: collisionPadding,
		boundary: boundary.filter(isNotNull),
		altBoundary: hasExplicitBoundaries
	};
	const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
		strategy: "fixed",
		placement: desiredPlacement,
		whileElementsMounted: /* @__PURE__ */ __name$10((...args) => {
			return autoUpdate(...args, { animationFrame: updatePositionStrategy === "always" });
		}, "whileElementsMounted"),
		elements: { reference: context.anchor },
		middleware: [
			offset({
				mainAxis: sideOffset + arrowHeight,
				alignmentAxis: alignOffset
			}),
			avoidCollisions && shift({
				mainAxis: true,
				crossAxis: false,
				limiter: sticky === "partial" ? limitShift() : void 0,
				...detectOverflowOptions
			}),
			avoidCollisions && flip({ ...detectOverflowOptions }),
			size({
				...detectOverflowOptions,
				apply: /* @__PURE__ */ __name$10(({ elements, rects, availableWidth, availableHeight }) => {
					const { width: anchorWidth, height: anchorHeight } = rects.reference;
					const contentStyle = elements.floating.style;
					contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
					contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
					contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
					contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
				}, "apply")
			}),
			arrow$4 && arrow({
				element: arrow$4,
				padding: arrowPadding
			}),
			transformOrigin({
				arrowWidth,
				arrowHeight
			}),
			hideWhenDetached && hide({
				strategy: "referenceHidden",
				...detectOverflowOptions,
				boundary: hasExplicitBoundaries ? detectOverflowOptions.boundary : void 0
			})
		]
	});
	const setPlacementState = context.setPlacementState;
	useLayoutEffect2(() => {
		setPlacementState(placement);
		return () => {
			setPlacementState(void 0);
		};
	}, [placement, setPlacementState]);
	const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
	const handlePlaced = useCallbackRef$1(onPlaced);
	useLayoutEffect2(() => {
		if (isPositioned) handlePlaced?.();
	}, [isPositioned, handlePlaced]);
	const arrowX = middlewareData.arrow?.x;
	const arrowY = middlewareData.arrow?.y;
	const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
	const [contentZIndex, setContentZIndex] = import_react.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: refs.setFloating,
		"data-radix-popper-content-wrapper": "",
		style: {
			...floatingStyles,
			transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: contentZIndex,
			"--radix-popper-transform-origin": [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(" "),
			...middlewareData.hide?.referenceHidden && {
				visibility: "hidden",
				pointerEvents: "none"
			}
		},
		dir: props.dir,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopperContentProvider, {
			scope: __scopePopper,
			placedSide,
			placedAlign,
			onArrowChange: setArrow,
			arrowX,
			arrowY,
			shouldHideArrow: cannotCenterArrow,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				"data-side": placedSide,
				"data-align": placedAlign,
				...contentProps,
				ref: composedRefs,
				style: {
					...contentProps.style,
					animation: !isPositioned ? "none" : contentProps.style?.animation
				}
			})
		})
	});
}, "PopperContent"));
function isNotNull(value) {
	return value !== null;
}
__name$10(isNotNull, "isNotNull");
var transformOrigin = /* @__PURE__ */ __name$10((options) => ({
	name: "transformOrigin",
	options,
	fn(data) {
		const { placement, rects, middlewareData } = data;
		const isArrowHidden = middlewareData.arrow?.centerOffset !== 0;
		const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
		const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
		const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
		const noArrowAlign = {
			start: "0%",
			center: "50%",
			end: "100%"
		}[placedAlign];
		const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
		const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
		let x = "";
		let y = "";
		if (placedSide === "bottom") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${-arrowHeight}px`;
		} else if (placedSide === "top") {
			x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
			y = `${rects.floating.height + arrowHeight}px`;
		} else if (placedSide === "right") {
			x = `${-arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		} else if (placedSide === "left") {
			x = `${rects.floating.width + arrowHeight}px`;
			y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
		}
		return { data: {
			x,
			y
		} };
	}
}), "transformOrigin");
function getSideAndAlignFromPlacement(placement) {
	const [side, align = "center"] = placement.split("-");
	return [side, align];
}
__name$10(getSideAndAlignFromPlacement, "getSideAndAlignFromPlacement");
var Root2$4 = Popper;
var Anchor = PopperAnchor;
var Content$2 = PopperContent;
//#endregion
//#region node_modules/@radix-ui/react-use-is-hydrated/dist/index.mjs
var _isHydrated = false;
function useIsHydrated() {
	const [isHydrated, setIsHydrated] = import_react.useState(_isHydrated);
	import_react.useEffect(() => {
		if (!_isHydrated) {
			_isHydrated = true;
			setIsHydrated(true);
		}
	}, []);
	return isHydrated;
}
var useReactSyncExternalStore = import_react[" useSyncExternalStore ".trim().toString()];
function subscribe() {
	return () => {};
}
function useIsHydratedModern() {
	return useReactSyncExternalStore(subscribe, () => true, () => false);
}
var useIsHydrated2 = typeof useReactSyncExternalStore === "function" ? useIsHydratedModern : useIsHydrated;
//#endregion
//#region node_modules/@radix-ui/react-roving-focus/dist/index.mjs
var __defProp$9 = Object.defineProperty;
var __name$9 = (target, value) => __defProp$9(target, "name", {
	value,
	configurable: true
});
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
var GROUP_NAME = "RovingFocusGroup";
var [Collection$3, useCollection$3, createCollectionScope$3] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(GROUP_NAME, [createCollectionScope$3]);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$9(function RovingFocusGroup2(props, forwardedRef) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$3.Provider, {
		scope: props.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$3.Slot, {
			scope: props.__scopeRovingFocusGroup,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusGroupImpl, {
				...props,
				ref: forwardedRef
			})
		})
	});
}, "RovingFocusGroup"));
var RovingFocusGroupImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$9(function RovingFocusGroupImpl2(props, forwardedRef) {
	const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, preventScrollOnEntryFocus = false, ...groupProps } = props;
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const direction = useDirection(dir);
	const [currentTabStopId, setCurrentTabStopId] = useControllableState({
		prop: currentTabStopIdProp,
		defaultProp: defaultCurrentTabStopId ?? null,
		onChange: onCurrentTabStopIdChange,
		caller: GROUP_NAME
	});
	const [isTabbingBackOut, setIsTabbingBackOut] = import_react.useState(false);
	const handleEntryFocus = useCallbackRef$1(onEntryFocus);
	const getItems = useCollection$3(__scopeRovingFocusGroup);
	const isClickFocusRef = import_react.useRef(false);
	const [focusableItemsCount, setFocusableItemsCount] = import_react.useState(0);
	import_react.useEffect(() => {
		const node = ref.current;
		if (node) {
			node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
			return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
		}
	}, [handleEntryFocus]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RovingFocusProvider, {
		scope: __scopeRovingFocusGroup,
		orientation,
		dir: direction,
		loop,
		currentTabStopId,
		onItemFocus: import_react.useCallback((tabStopId) => setCurrentTabStopId(tabStopId), [setCurrentTabStopId]),
		onItemShiftTab: import_react.useCallback(() => setIsTabbingBackOut(true), []),
		onFocusableItemAdd: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount + 1), []),
		onFocusableItemRemove: import_react.useCallback(() => setFocusableItemsCount((prevCount) => prevCount - 1), []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
			"data-orientation": orientation,
			...groupProps,
			ref: composedRefs,
			style: {
				outline: "none",
				...props.style
			},
			onMouseDown: composeEventHandlers(props.onMouseDown, () => {
				isClickFocusRef.current = true;
			}),
			onFocus: composeEventHandlers(props.onFocus, (event) => {
				const isKeyboardFocus = !isClickFocusRef.current;
				if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
					const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
					event.currentTarget.dispatchEvent(entryFocusEvent);
					if (!entryFocusEvent.defaultPrevented) {
						const items = getItems().filter((item) => item.focusable);
						focusFirst$1([
							items.find((item) => item.active),
							items.find((item) => item.id === currentTabStopId),
							...items
						].filter(Boolean).map((item) => item.ref.current), preventScrollOnEntryFocus);
					}
				}
				isClickFocusRef.current = false;
			}),
			onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
		})
	});
}, "RovingFocusGroupImpl"));
var ITEM_NAME$3 = "RovingFocusGroupItem";
var RovingFocusGroupItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$9(function RovingFocusGroupItem2(props, forwardedRef) {
	const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, children, ...itemProps } = props;
	const autoId = useId();
	const id = tabStopId || autoId;
	const context = useRovingFocusContext(ITEM_NAME$3, __scopeRovingFocusGroup);
	const isCurrentTabStop = context.currentTabStopId === id;
	const getItems = useCollection$3(__scopeRovingFocusGroup);
	const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
	const isHydrated = useIsHydrated2();
	useLayoutEffect2(() => {
		if (!isHydrated || !focusable) return;
		onFocusableItemAdd();
		return () => onFocusableItemRemove();
	}, [
		isHydrated,
		focusable,
		onFocusableItemAdd,
		onFocusableItemRemove
	]);
	import_react.useEffect(() => {
		if (isHydrated || !focusable) return;
		onFocusableItemAdd();
		return () => onFocusableItemRemove();
	}, [
		isHydrated,
		focusable,
		onFocusableItemAdd,
		onFocusableItemRemove
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$3.ItemSlot, {
		scope: __scopeRovingFocusGroup,
		id,
		focusable,
		active,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			tabIndex: isCurrentTabStop ? 0 : -1,
			"data-orientation": context.orientation,
			...itemProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!focusable) event.preventDefault();
				else context.onItemFocus(id);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (event.key === "Tab" && event.shiftKey) {
					context.onItemShiftTab();
					return;
				}
				if (event.target !== event.currentTarget) return;
				const focusIntent = getFocusIntent(event, context.orientation, context.dir);
				if (focusIntent !== void 0) {
					if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
					event.preventDefault();
					let candidateNodes = getItems().filter((item) => item.focusable).map((item) => item.ref.current);
					if (focusIntent === "last") candidateNodes.reverse();
					else if (focusIntent === "prev" || focusIntent === "next") {
						if (focusIntent === "prev") candidateNodes.reverse();
						const currentIndex = candidateNodes.indexOf(event.currentTarget);
						candidateNodes = context.loop ? wrapArray$2(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
					}
					setTimeout(() => focusFirst$1(candidateNodes));
				}
			}),
			children: typeof children === "function" ? children({
				isCurrentTabStop,
				hasTabStop: currentTabStopId != null
			}) : children
		})
	});
}, "RovingFocusGroupItem"));
var MAP_KEY_TO_FOCUS_INTENT = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function getDirectionAwareKey(key, dir) {
	if (dir !== "rtl") return key;
	return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
__name$9(getDirectionAwareKey, "getDirectionAwareKey");
function getFocusIntent(event, orientation, dir) {
	const key = getDirectionAwareKey(event.key, dir);
	if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
	if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
	return MAP_KEY_TO_FOCUS_INTENT[key];
}
__name$9(getFocusIntent, "getFocusIntent");
function focusFirst$1(candidates, preventScroll = false) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus({ preventScroll });
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
__name$9(focusFirst$1, "focusFirst");
function wrapArray$2(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
__name$9(wrapArray$2, "wrapArray");
var Root$2 = RovingFocusGroup;
var Item$1 = RovingFocusGroupItem;
//#endregion
//#region node_modules/@radix-ui/react-menu/dist/index.mjs
var __defProp$8 = Object.defineProperty;
var __name$8 = (target, value) => __defProp$8(target, "name", {
	value,
	configurable: true
});
var SELECTION_KEYS$1 = ["Enter", " "];
var FIRST_KEYS = [
	"ArrowDown",
	"PageUp",
	"Home"
];
var LAST_KEYS = [
	"ArrowUp",
	"PageDown",
	"End"
];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
	ltr: [...SELECTION_KEYS$1, "ArrowRight"],
	rtl: [...SELECTION_KEYS$1, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
	ltr: ["ArrowLeft"],
	rtl: ["ArrowRight"]
};
var MENU_NAME = "Menu";
var [Collection$2, useCollection$2, createCollectionScope$2] = createCollection(MENU_NAME);
var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
	createCollectionScope$2,
	createPopperScope,
	createRovingFocusGroupScope
]);
var usePopperScope$1 = createPopperScope();
var useRovingFocusGroupScope$1 = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
var Menu = /* @__PURE__ */ __name$8((props) => {
	const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
	const popperScope = usePopperScope$1(__scopeMenu);
	const [content, setContent] = import_react.useState(null);
	const isUsingKeyboardRef = import_react.useRef(false);
	const handleOpenChange = useCallbackRef$1(onOpenChange);
	const direction = useDirection(dir);
	import_react.useEffect(() => {
		const handleKeyDown = /* @__PURE__ */ __name$8(() => {
			isUsingKeyboardRef.current = true;
			document.addEventListener("pointerdown", handlePointer, {
				capture: true,
				once: true
			});
			document.addEventListener("pointermove", handlePointer, {
				capture: true,
				once: true
			});
		}, "handleKeyDown");
		const handlePointer = /* @__PURE__ */ __name$8(() => isUsingKeyboardRef.current = false, "handlePointer");
		document.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => {
			document.removeEventListener("keydown", handleKeyDown, { capture: true });
			document.removeEventListener("pointerdown", handlePointer, { capture: true });
			document.removeEventListener("pointermove", handlePointer, { capture: true });
		};
	}, []);
	import_react.useEffect(() => {
		if (!open) return;
		const handleBlur = /* @__PURE__ */ __name$8(() => handleOpenChange(false), "handleBlur");
		window.addEventListener("blur", handleBlur);
		return () => window.removeEventListener("blur", handleBlur);
	}, [open, handleOpenChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$4, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuProvider, {
			scope: __scopeMenu,
			open,
			onOpenChange: handleOpenChange,
			content,
			onContentChange: setContent,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRootProvider, {
				scope: __scopeMenu,
				onClose: import_react.useCallback(() => handleOpenChange(false), [handleOpenChange]),
				isUsingKeyboardRef,
				dir: direction,
				modal,
				children
			})
		})
	});
}, "Menu");
var MenuAnchor = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuAnchor2(props, forwardedRef) {
	const { __scopeMenu, ...anchorProps } = props;
	const popperScope = usePopperScope$1(__scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		...popperScope,
		...anchorProps,
		ref: forwardedRef
	});
}, "MenuAnchor"));
var PORTAL_NAME = "MenuPortal";
var [PortalProvider$1, usePortalContext$1] = createMenuContext(PORTAL_NAME, { forceMount: void 0 });
var MenuPortal = /* @__PURE__ */ __name$8((props) => {
	const { __scopeMenu, forceMount, children, container } = props;
	const context = useMenuContext(PORTAL_NAME, __scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider$1, {
		scope: __scopeMenu,
		forceMount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$1, {
				asChild: true,
				container,
				children
			})
		})
	});
}, "MenuPortal");
var CONTENT_NAME$5 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$5);
var MenuContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuContent2(props, forwardedRef) {
	const portalContext = usePortalContext$1(CONTENT_NAME$5, props.__scopeMenu);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$5, props.__scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Provider, {
		scope: props.__scopeMenu,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Slot, {
				scope: props.__scopeMenu,
				children: rootContext.modal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRootContentModal, {
					...contentProps,
					ref: forwardedRef
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuRootContentNonModal, {
					...contentProps,
					ref: forwardedRef
				})
			})
		})
	});
}, "MenuContent"));
var MenuRootContentModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuRootContentModal2(props, forwardedRef) {
	const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	import_react.useEffect(() => {
		const content = ref.current;
		if (content) return hideOthers(content);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentImpl, {
		...props,
		ref: composedRefs,
		trapFocus: context.open,
		disableOutsidePointerEvents: context.open,
		disableOutsideScroll: true,
		onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => event.preventDefault(), { checkForDefaultPrevented: false }),
		onDismiss: () => context.onOpenChange(false)
	});
}, "MenuRootContentModal"));
var MenuRootContentNonModal = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuRootContentNonModal2(props, forwardedRef) {
	const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentImpl, {
		...props,
		ref: forwardedRef,
		trapFocus: false,
		disableOutsidePointerEvents: false,
		disableOutsideScroll: false,
		onDismiss: () => context.onOpenChange(false)
	});
}, "MenuRootContentNonModal"));
var Slot$1 = /* @__PURE__ */ createSlot("MenuContent.ScrollLock");
var MenuContentImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuContentImpl2(props, forwardedRef) {
	const { __scopeMenu, loop = false, trapFocus, onOpenAutoFocus, onCloseAutoFocus, disableOutsidePointerEvents, onEntryFocus, onEscapeKeyDown, onPointerDownOutside, onFocusOutside, onInteractOutside, onDismiss, disableOutsideScroll, ...contentProps } = props;
	const context = useMenuContext(CONTENT_NAME$5, __scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$5, __scopeMenu);
	const popperScope = usePopperScope$1(__scopeMenu);
	const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeMenu);
	const getItems = useCollection$2(__scopeMenu);
	const [currentItemId, setCurrentItemId] = import_react.useState(null);
	const contentRef = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
	const timerRef = import_react.useRef(0);
	const searchRef = import_react.useRef("");
	const pointerGraceTimerRef = import_react.useRef(0);
	const pointerGraceIntentRef = import_react.useRef(null);
	const pointerDirRef = import_react.useRef("right");
	const lastPointerXRef = import_react.useRef(0);
	const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : import_react.Fragment;
	const scrollLockWrapperProps = disableOutsideScroll ? {
		as: Slot$1,
		allowPinchZoom: true
	} : void 0;
	const handleTypeaheadSearch = /* @__PURE__ */ __name$8((key) => {
		const search = searchRef.current + key;
		const items = getItems().filter((item) => !item.disabled);
		const currentItem = document.activeElement;
		const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
		const nextMatch = getNextMatch(items.map((item) => item.textValue), search, currentMatch);
		const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;
		(/* @__PURE__ */ __name$8((function updateSearch(value) {
			searchRef.current = value;
			window.clearTimeout(timerRef.current);
			if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
		}), "updateSearch"))(search);
		if (newItem) setTimeout(() => newItem.focus());
	}, "handleTypeaheadSearch");
	import_react.useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);
	useFocusGuards();
	const isPointerMovingToSubmenu = import_react.useCallback((event) => {
		return pointerDirRef.current === pointerGraceIntentRef.current?.side && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentProvider, {
		scope: __scopeMenu,
		searchRef,
		onItemEnter: import_react.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) event.preventDefault();
		}, [isPointerMovingToSubmenu]),
		onItemLeave: import_react.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) return;
			contentRef.current?.focus();
			setCurrentItemId(null);
		}, [isPointerMovingToSubmenu]),
		onTriggerLeave: import_react.useCallback((event) => {
			if (isPointerMovingToSubmenu(event)) event.preventDefault();
		}, [isPointerMovingToSubmenu]),
		pointerGraceTimerRef,
		onPointerGraceIntentChange: import_react.useCallback((intent) => {
			pointerGraceIntentRef.current = intent;
		}, []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollLockWrapper, {
			...scrollLockWrapperProps,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
				asChild: true,
				trapped: trapFocus,
				onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
					event.preventDefault();
					contentRef.current?.focus({ preventScroll: true });
				}),
				onUnmountAutoFocus: onCloseAutoFocus,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
					asChild: true,
					disableOutsidePointerEvents,
					onEscapeKeyDown,
					onPointerDownOutside,
					onFocusOutside,
					onInteractOutside,
					onDismiss,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$2, {
						asChild: true,
						...rovingFocusGroupScope,
						dir: rootContext.dir,
						orientation: "vertical",
						loop,
						currentTabStopId: currentItemId,
						onCurrentTabStopIdChange: setCurrentItemId,
						onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
							if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
						}),
						preventScrollOnEntryFocus: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content$2, {
							role: "menu",
							"aria-orientation": "vertical",
							"data-state": getOpenState(context.open),
							"data-radix-menu-content": "",
							dir: rootContext.dir,
							...popperScope,
							...contentProps,
							ref: composedRefs,
							style: {
								outline: "none",
								...contentProps.style
							},
							onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
								const isKeyDownInside = event.target.closest("[data-radix-menu-content]") === event.currentTarget;
								const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
								const isCharacterKey = event.key.length === 1;
								if (isKeyDownInside) {
									if (event.key === "Tab") event.preventDefault();
									if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
								}
								const content = contentRef.current;
								if (event.target !== content) return;
								if (!FIRST_LAST_KEYS.includes(event.key)) return;
								event.preventDefault();
								const candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
								if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
								focusFirst(candidateNodes);
							}),
							onBlur: composeEventHandlers(props.onBlur, (event) => {
								if (!event.currentTarget.contains(event.target)) {
									window.clearTimeout(timerRef.current);
									searchRef.current = "";
								}
							}),
							onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
								const target = event.target;
								const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
								if (event.currentTarget.contains(target) && pointerXHasChanged) {
									const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
									pointerDirRef.current = newDir;
									lastPointerXRef.current = event.clientX;
								}
							}))
						})
					})
				})
			})
		})
	});
}, "MenuContentImpl"));
var MenuLabel = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuLabel2(props, forwardedRef) {
	const { __scopeMenu, ...labelProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...labelProps,
		ref: forwardedRef
	});
}, "MenuLabel"));
var ITEM_NAME$2 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuItem2(props, forwardedRef) {
	const { disabled = false, onSelect, ...itemProps } = props;
	const ref = import_react.useRef(null);
	const rootContext = useMenuRootContext(ITEM_NAME$2, props.__scopeMenu);
	const contentContext = useMenuContentContext(ITEM_NAME$2, props.__scopeMenu);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const isPointerDownRef = import_react.useRef(false);
	const handleSelect = /* @__PURE__ */ __name$8(() => {
		const menuItem = ref.current;
		if (!disabled && menuItem) {
			const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
				bubbles: true,
				cancelable: true
			});
			menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
			dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
			if (itemSelectEvent.defaultPrevented) isPointerDownRef.current = false;
			else rootContext.onClose();
		}
	}, "handleSelect");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItemImpl, {
		...itemProps,
		ref: composedRefs,
		disabled,
		onClick: composeEventHandlers(props.onClick, handleSelect),
		onPointerDown: (event) => {
			props.onPointerDown?.(event);
			isPointerDownRef.current = true;
		},
		onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
			if (!isPointerDownRef.current) event.currentTarget?.click();
		}),
		onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
			if (disabled || event.target !== event.currentTarget) return;
			if (contentContext.searchRef.current !== "" && event.key === " ") return;
			if (SELECTION_KEYS$1.includes(event.key)) {
				event.currentTarget.click();
				event.preventDefault();
			}
		})
	});
}, "MenuItem"));
var MenuItemImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuItemImpl2(props, forwardedRef) {
	const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
	const contentContext = useMenuContentContext(ITEM_NAME$2, __scopeMenu);
	const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeMenu);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const [isFocused, setIsFocused] = import_react.useState(false);
	const [textContent, setTextContent] = import_react.useState("");
	import_react.useEffect(() => {
		const menuItem = ref.current;
		if (menuItem) setTextContent((menuItem.textContent ?? "").trim());
	}, [itemProps.children]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.ItemSlot, {
		scope: __scopeMenu,
		disabled,
		textValue: textValue ?? textContent,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
			asChild: true,
			...rovingFocusGroupScope,
			focusable: !disabled,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				role: "menuitem",
				"data-highlighted": isFocused ? "" : void 0,
				"aria-disabled": disabled || void 0,
				"data-disabled": disabled ? "" : void 0,
				...itemProps,
				ref: composedRefs,
				onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
					if (disabled) contentContext.onItemLeave(event);
					else {
						contentContext.onItemEnter(event);
						if (!event.defaultPrevented) event.currentTarget.focus({ preventScroll: true });
					}
				})),
				onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse((event) => contentContext.onItemLeave(event))),
				onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
				onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
			})
		})
	});
}, "MenuItemImpl"));
var MenuCheckboxItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuCheckboxItem2(props, forwardedRef) {
	const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicatorProvider, {
		scope: props.__scopeMenu,
		checked,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
			role: "menuitemcheckbox",
			"aria-checked": isIndeterminate(checked) ? "mixed" : checked,
			...checkboxItemProps,
			ref: forwardedRef,
			"data-state": getCheckedState(checked),
			onSelect: composeEventHandlers(checkboxItemProps.onSelect, () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked), { checkForDefaultPrevented: false })
		})
	});
}, "MenuCheckboxItem"));
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext("MenuRadioGroup", {
	value: void 0,
	onValueChange: /* @__PURE__ */ __name$8(() => {}, "onValueChange")
});
var RADIO_ITEM_NAME = "MenuRadioItem";
var MenuRadioItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuRadioItem2(props, forwardedRef) {
	const { value, ...radioItemProps } = props;
	const context = useRadioGroupContext(RADIO_ITEM_NAME, props.__scopeMenu);
	const checked = value === context.value;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicatorProvider, {
		scope: props.__scopeMenu,
		checked,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
			role: "menuitemradio",
			"aria-checked": checked,
			...radioItemProps,
			ref: forwardedRef,
			"data-state": getCheckedState(checked),
			onSelect: composeEventHandlers(radioItemProps.onSelect, () => context.onValueChange?.(value), { checkForDefaultPrevented: false })
		})
	});
}, "MenuRadioItem"));
var ITEM_INDICATOR_NAME$1 = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(ITEM_INDICATOR_NAME$1, { checked: false });
var MenuItemIndicator = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuItemIndicator2(props, forwardedRef) {
	const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
	const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME$1, __scopeMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			...itemIndicatorProps,
			ref: forwardedRef,
			"data-state": getCheckedState(indicatorContext.checked)
		})
	});
}, "MenuItemIndicator"));
var MenuSeparator = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuSeparator2(props, forwardedRef) {
	const { __scopeMenu, ...separatorProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		role: "separator",
		"aria-orientation": "horizontal",
		...separatorProps,
		ref: forwardedRef
	});
}, "MenuSeparator"));
var [MenuSubProvider, useMenuSubContext] = createMenuContext("MenuSub");
var SUB_TRIGGER_NAME = "MenuSubTrigger";
var MenuSubTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuSubTrigger2(props, forwardedRef) {
	const context = useMenuContext(SUB_TRIGGER_NAME, props.__scopeMenu);
	const rootContext = useMenuRootContext(SUB_TRIGGER_NAME, props.__scopeMenu);
	const subContext = useMenuSubContext(SUB_TRIGGER_NAME, props.__scopeMenu);
	const contentContext = useMenuContentContext(SUB_TRIGGER_NAME, props.__scopeMenu);
	const openTimerRef = import_react.useRef(null);
	const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
	const scope = { __scopeMenu: props.__scopeMenu };
	const clearOpenTimer = import_react.useCallback(() => {
		if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
		openTimerRef.current = null;
	}, []);
	import_react.useEffect(() => clearOpenTimer, [clearOpenTimer]);
	import_react.useEffect(() => {
		const pointerGraceTimer = pointerGraceTimerRef.current;
		return () => {
			window.clearTimeout(pointerGraceTimer);
			onPointerGraceIntentChange(null);
		};
	}, [pointerGraceTimerRef, onPointerGraceIntentChange]);
	const composedRefs = useComposedRefs(forwardedRef, subContext.onTriggerChange);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuAnchor, {
		asChild: true,
		...scope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItemImpl, {
			id: subContext.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": context.open,
			"aria-controls": context.open ? subContext.contentId : void 0,
			"data-state": getOpenState(context.open),
			...props,
			ref: composedRefs,
			onClick: (event) => {
				props.onClick?.(event);
				if (props.disabled || event.defaultPrevented) return;
				event.currentTarget.focus();
				if (!context.open) context.onOpenChange(true);
			},
			onPointerMove: composeEventHandlers(props.onPointerMove, whenMouse((event) => {
				contentContext.onItemEnter(event);
				if (event.defaultPrevented) return;
				if (!props.disabled && !context.open && !openTimerRef.current) {
					contentContext.onPointerGraceIntentChange(null);
					openTimerRef.current = window.setTimeout(() => {
						context.onOpenChange(true);
						clearOpenTimer();
					}, 100);
				}
			})),
			onPointerLeave: composeEventHandlers(props.onPointerLeave, whenMouse((event) => {
				clearOpenTimer();
				const contentRect = context.content?.getBoundingClientRect();
				if (contentRect) {
					const side = context.content?.dataset.side;
					const rightSide = side === "right";
					const bleed = rightSide ? -5 : 5;
					const contentNearEdge = contentRect[rightSide ? "left" : "right"];
					const contentFarEdge = contentRect[rightSide ? "right" : "left"];
					contentContext.onPointerGraceIntentChange({
						area: [
							{
								x: event.clientX + bleed,
								y: event.clientY
							},
							{
								x: contentNearEdge,
								y: contentRect.top
							},
							{
								x: contentFarEdge,
								y: contentRect.top
							},
							{
								x: contentFarEdge,
								y: contentRect.bottom
							},
							{
								x: contentNearEdge,
								y: contentRect.bottom
							}
						],
						side
					});
					window.clearTimeout(pointerGraceTimerRef.current);
					pointerGraceTimerRef.current = window.setTimeout(() => contentContext.onPointerGraceIntentChange(null), 300);
				} else {
					contentContext.onTriggerLeave(event);
					if (event.defaultPrevented) return;
					contentContext.onPointerGraceIntentChange(null);
				}
			})),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (props.disabled || event.target !== event.currentTarget) return;
				if (contentContext.searchRef.current !== "" && event.key === " ") return;
				if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
					context.onOpenChange(true);
					context.content?.focus();
					event.preventDefault();
				}
			})
		})
	});
}, "MenuSubTrigger"));
var SUB_CONTENT_NAME = "MenuSubContent";
var MenuSubContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$8(function MenuSubContent2(props, forwardedRef) {
	const portalContext = usePortalContext$1(CONTENT_NAME$5, props.__scopeMenu);
	const { forceMount = portalContext.forceMount, align = "start", ...subContentProps } = props;
	const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
	const rootContext = useMenuRootContext(CONTENT_NAME$5, props.__scopeMenu);
	const subContext = useMenuSubContext(SUB_CONTENT_NAME, props.__scopeMenu);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Provider, {
		scope: props.__scopeMenu,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
			present: forceMount || context.open,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$2.Slot, {
				scope: props.__scopeMenu,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuContentImpl, {
					id: subContext.contentId,
					"aria-labelledby": subContext.triggerId,
					...subContentProps,
					ref: composedRefs,
					align,
					side: rootContext.dir === "rtl" ? "left" : "right",
					disableOutsidePointerEvents: false,
					disableOutsideScroll: false,
					trapFocus: false,
					onOpenAutoFocus: (event) => {
						if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
						event.preventDefault();
					},
					onCloseAutoFocus: (event) => event.preventDefault(),
					onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
						if (event.target !== subContext.trigger) context.onOpenChange(false);
					}),
					onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
						rootContext.onClose();
						event.preventDefault();
					}),
					onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
						const isKeyDownInside = event.currentTarget.contains(event.target);
						const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
						if (isKeyDownInside && isCloseKey) {
							context.onOpenChange(false);
							subContext.trigger?.focus();
							event.preventDefault();
						}
					})
				})
			})
		})
	});
}, "MenuSubContent"));
function getOpenState(open) {
	return open ? "open" : "closed";
}
__name$8(getOpenState, "getOpenState");
function isIndeterminate(checked) {
	return checked === "indeterminate";
}
__name$8(isIndeterminate, "isIndeterminate");
function getCheckedState(checked) {
	return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
__name$8(getCheckedState, "getCheckedState");
function focusFirst(candidates) {
	const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
	for (const candidate of candidates) {
		if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
		candidate.focus();
		if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
	}
}
__name$8(focusFirst, "focusFirst");
function wrapArray$1(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
__name$8(wrapArray$1, "wrapArray");
function getNextMatch(values, search, currentMatch) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
	let wrappedValues = wrapArray$1(values, Math.max(currentMatchIndex, 0));
	if (normalizedSearch.length === 1) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
	const nextMatch = wrappedValues.find((value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextMatch !== currentMatch ? nextMatch : void 0;
}
__name$8(getNextMatch, "getNextMatch");
function isPointInPolygon(point, polygon) {
	const { x, y } = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const ii = polygon[i];
		const jj = polygon[j];
		const xi = ii.x;
		const yi = ii.y;
		const xj = jj.x;
		const yj = jj.y;
		if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}
__name$8(isPointInPolygon, "isPointInPolygon");
function isPointerInGraceArea(event, area) {
	if (!area) return false;
	return isPointInPolygon({
		x: event.clientX,
		y: event.clientY
	}, area);
}
__name$8(isPointerInGraceArea, "isPointerInGraceArea");
function whenMouse(handler) {
	return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
__name$8(whenMouse, "whenMouse");
var Root3 = Menu;
var Anchor2 = MenuAnchor;
var Portal = MenuPortal;
var Content2$3 = MenuContent;
var Label$1 = MenuLabel;
var Item2$1 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioItem = MenuRadioItem;
var ItemIndicator = MenuItemIndicator;
var Separator = MenuSeparator;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;
//#endregion
//#region node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs
var __defProp$7 = Object.defineProperty;
var __name$7 = (target, value) => __defProp$7(target, "name", {
	value,
	configurable: true
});
var DROPDOWN_MENU_NAME = "DropdownMenu";
var [createDropdownMenuContext, createDropdownMenuScope] = createContextScope(DROPDOWN_MENU_NAME, [createMenuScope]);
var useMenuScope = createMenuScope();
var [DropdownMenuProvider, useDropdownMenuContext] = createDropdownMenuContext(DROPDOWN_MENU_NAME);
var DropdownMenu = /* @__PURE__ */ __name$7((props) => {
	const { __scopeDropdownMenu, children, dir, open: openProp, defaultOpen, onOpenChange, modal = true } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const triggerRef = import_react.useRef(null);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: DROPDOWN_MENU_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuProvider, {
		scope: __scopeDropdownMenu,
		triggerId: useId(),
		triggerRef,
		contentId: useId(),
		open,
		onOpenChange: setOpen,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		modal,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root3, {
			...menuScope,
			open,
			onOpenChange: setOpen,
			dir,
			modal,
			children
		})
	});
}, "DropdownMenu");
var TRIGGER_NAME$5 = "DropdownMenuTrigger";
var DropdownMenuTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuTrigger2(props, forwardedRef) {
	const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
	const context = useDropdownMenuContext(TRIGGER_NAME$5, __scopeDropdownMenu);
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const composedRefs = useComposedRefs(forwardedRef, context.triggerRef);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor2, {
		asChild: true,
		...menuScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			id: context.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": context.open,
			"aria-controls": context.open ? context.contentId : void 0,
			"data-state": context.open ? "open" : "closed",
			"data-disabled": disabled ? "" : void 0,
			disabled,
			...triggerProps,
			ref: composedRefs,
			onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
				if (!disabled && event.button === 0 && event.ctrlKey === false) {
					context.onOpenToggle();
					if (!context.open) event.preventDefault();
				}
			}),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (disabled) return;
				if (["Enter", " "].includes(event.key)) context.onOpenToggle();
				if (event.key === "ArrowDown") context.onOpenChange(true);
				if ([
					"Enter",
					" ",
					"ArrowDown"
				].includes(event.key)) event.preventDefault();
			})
		})
	});
}, "DropdownMenuTrigger"));
var DropdownMenuPortal = /* @__PURE__ */ __name$7((props) => {
	const { __scopeDropdownMenu, ...portalProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
		...menuScope,
		...portalProps
	});
}, "DropdownMenuPortal");
var CONTENT_NAME$4 = "DropdownMenuContent";
var DropdownMenuContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuContent2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...contentProps } = props;
	const context = useDropdownMenuContext(CONTENT_NAME$4, __scopeDropdownMenu);
	const menuScope = useMenuScope(__scopeDropdownMenu);
	const hasInteractedOutsideRef = import_react.useRef(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$3, {
		id: context.contentId,
		"aria-labelledby": context.triggerId,
		...menuScope,
		...contentProps,
		ref: forwardedRef,
		onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
			if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
			hasInteractedOutsideRef.current = false;
			event.preventDefault();
		}),
		onInteractOutside: composeEventHandlers(props.onInteractOutside, (event) => {
			const originalEvent = event.detail.originalEvent;
			const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
			const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
			if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
		}),
		style: {
			...props.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
}, "DropdownMenuContent"));
var DropdownMenuLabel = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuLabel2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...labelProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
		...menuScope,
		...labelProps,
		ref: forwardedRef
	});
}, "DropdownMenuLabel"));
var DropdownMenuItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuItem2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...itemProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2$1, {
		...menuScope,
		...itemProps,
		ref: forwardedRef
	});
}, "DropdownMenuItem"));
var DropdownMenuCheckboxItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuCheckboxItem2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...checkboxItemProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxItem, {
		...menuScope,
		...checkboxItemProps,
		ref: forwardedRef
	});
}, "DropdownMenuCheckboxItem"));
var DropdownMenuRadioItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuRadioItem2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...radioItemProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioItem, {
		...menuScope,
		...radioItemProps,
		ref: forwardedRef
	});
}, "DropdownMenuRadioItem"));
var DropdownMenuItemIndicator = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuItemIndicator2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator, {
		...menuScope,
		...itemIndicatorProps,
		ref: forwardedRef
	});
}, "DropdownMenuItemIndicator"));
var DropdownMenuSeparator = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuSeparator2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...separatorProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
		...menuScope,
		...separatorProps,
		ref: forwardedRef
	});
}, "DropdownMenuSeparator"));
var DropdownMenuSubTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuSubTrigger2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...subTriggerProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubTrigger, {
		...menuScope,
		...subTriggerProps,
		ref: forwardedRef
	});
}, "DropdownMenuSubTrigger"));
var DropdownMenuSubContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$7(function DropdownMenuSubContent2(props, forwardedRef) {
	const { __scopeDropdownMenu, ...subContentProps } = props;
	const menuScope = useMenuScope(__scopeDropdownMenu);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent, {
		...menuScope,
		...subContentProps,
		ref: forwardedRef,
		style: {
			...props.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
}, "DropdownMenuSubContent"));
var Root2$3 = DropdownMenu;
var Trigger$2 = DropdownMenuTrigger;
var Portal2$1 = DropdownMenuPortal;
var Content2$2 = DropdownMenuContent;
var Label2 = DropdownMenuLabel;
var Item2 = DropdownMenuItem;
var CheckboxItem2 = DropdownMenuCheckboxItem;
var RadioItem2 = DropdownMenuRadioItem;
var ItemIndicator2 = DropdownMenuItemIndicator;
var Separator2 = DropdownMenuSeparator;
var SubTrigger2 = DropdownMenuSubTrigger;
var SubContent2 = DropdownMenuSubContent;
//#endregion
//#region node_modules/@radix-ui/react-switch/dist/index.mjs
var __defProp$6 = Object.defineProperty;
var __name$6 = (target, value) => __defProp$6(target, "name", {
	value,
	configurable: true
});
var SWITCH_NAME = "Switch";
var [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);
var [SwitchProviderImpl, useSwitchContext] = createSwitchContext(SWITCH_NAME);
function SwitchProvider(props) {
	const { __scopeSwitch, checked: checkedProp, children, defaultChecked, disabled, form, name, onCheckedChange, required, value = "on", internal_do_not_use_render } = props;
	const [checked, setChecked] = useControllableState({
		prop: checkedProp,
		defaultProp: defaultChecked ?? false,
		onChange: onCheckedChange,
		caller: SWITCH_NAME
	});
	const [control, setControl] = import_react.useState(null);
	const [bubbleInput, setBubbleInput] = import_react.useState(null);
	const hasConsumerStoppedPropagationRef = import_react.useRef(false);
	const [userInteractionCount, onUserInteraction] = import_react.useReducer((count) => count + 1, 0);
	const context = {
		checked,
		setChecked,
		disabled,
		control,
		setControl,
		name,
		form,
		value,
		hasConsumerStoppedPropagationRef,
		userInteractionCount,
		onUserInteraction,
		required,
		defaultChecked,
		isFormControl: control ? !!form || !!control.closest("form") : true,
		bubbleInput,
		setBubbleInput
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchProviderImpl, {
		scope: __scopeSwitch,
		...context,
		children: isFunction$1(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
	});
}
__name$6(SwitchProvider, "SwitchProvider");
var TRIGGER_NAME$4 = "SwitchTrigger";
var SwitchTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$6(function SwitchTrigger2({ __scopeSwitch, onClick, ...switchProps }, forwardedRef) {
	const { control, form, value, disabled, checked, required, setControl, setChecked, hasConsumerStoppedPropagationRef, onUserInteraction, isFormControl, bubbleInput } = useSwitchContext(TRIGGER_NAME$4, __scopeSwitch);
	const composedRefs = useComposedRefs(forwardedRef, setControl);
	const initialCheckedStateRef = import_react.useRef(checked);
	import_react.useEffect(() => {
		const associatedForm = form ? control?.ownerDocument.getElementById(form) : control?.form;
		if (associatedForm instanceof HTMLFormElement) {
			const reset = /* @__PURE__ */ __name$6(() => setChecked(initialCheckedStateRef.current), "reset");
			associatedForm.addEventListener("reset", reset);
			return () => associatedForm.removeEventListener("reset", reset);
		}
	}, [
		control,
		form,
		setChecked
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		"aria-required": required,
		"data-state": getState$2(checked),
		"data-disabled": disabled ? "" : void 0,
		disabled,
		value,
		...switchProps,
		ref: composedRefs,
		onClick: composeEventHandlers(onClick, (event) => {
			onUserInteraction();
			setChecked((prevChecked) => !prevChecked);
			if (bubbleInput && isFormControl) {
				hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
				if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
			}
		})
	});
}, "SwitchTrigger"));
var Switch = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$6(function Switch2(props, forwardedRef) {
	const { __scopeSwitch, name, checked, defaultChecked, required, disabled, value, onCheckedChange, form, ...switchProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchProvider, {
		__scopeSwitch,
		checked,
		defaultChecked,
		disabled,
		required,
		onCheckedChange,
		name,
		form,
		value,
		internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchTrigger, {
			...switchProps,
			ref: forwardedRef,
			__scopeSwitch
		}), isFormControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchBubbleInput, { __scopeSwitch })] })
	});
}, "Switch"));
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$6(function SwitchThumb2(props, forwardedRef) {
	const { __scopeSwitch, ...thumbProps } = props;
	const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		"data-state": getState$2(context.checked),
		"data-disabled": context.disabled ? "" : void 0,
		...thumbProps,
		ref: forwardedRef
	});
}, "SwitchThumb"));
var BUBBLE_INPUT_NAME$1 = "SwitchBubbleInput";
var SwitchBubbleInput = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$6(function SwitchBubbleInput2({ __scopeSwitch, onClick, ...props }, forwardedRef) {
	const { control, hasConsumerStoppedPropagationRef, userInteractionCount, checked, defaultChecked, required, disabled, name, value, form, bubbleInput, setBubbleInput } = useSwitchContext(BUBBLE_INPUT_NAME$1, __scopeSwitch);
	const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
	const controlSize = useSize(control);
	const shouldStopClickPropagationRef = import_react.useRef(false);
	const prevCheckedRef = import_react.useRef(checked);
	const prevUserInteractionCountRef = import_react.useRef(userInteractionCount);
	import_react.useEffect(() => {
		const input = bubbleInput;
		if (!input) return;
		const inputProto = window.HTMLInputElement.prototype;
		const setChecked = Object.getOwnPropertyDescriptor(inputProto, "checked").set;
		const isUserInteraction = userInteractionCount !== prevUserInteractionCountRef.current;
		prevUserInteractionCountRef.current = userInteractionCount;
		const checkedChanged = prevCheckedRef.current !== checked;
		prevCheckedRef.current = checked;
		const bubbles = !(isUserInteraction && hasConsumerStoppedPropagationRef.current);
		if (checkedChanged && setChecked) {
			shouldStopClickPropagationRef.current = !isUserInteraction;
			const event = new Event("click", { bubbles });
			setChecked.call(input, checked);
			input.dispatchEvent(event);
			shouldStopClickPropagationRef.current = false;
		}
	}, [
		bubbleInput,
		checked,
		hasConsumerStoppedPropagationRef,
		userInteractionCount
	]);
	const defaultCheckedRef = import_react.useRef(checked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.input, {
		type: "checkbox",
		"aria-hidden": true,
		defaultChecked: defaultChecked ?? defaultCheckedRef.current,
		required,
		disabled,
		name,
		value,
		form,
		...props,
		tabIndex: -1,
		ref: composedRefs,
		onClick: composeEventHandlers(onClick, (event) => {
			if (shouldStopClickPropagationRef.current) event.stopPropagation();
		}),
		style: {
			...props.style,
			...controlSize,
			position: "absolute",
			pointerEvents: "none",
			opacity: 0,
			margin: 0,
			transform: "translateX(-100%)"
		}
	});
}, "SwitchBubbleInput"));
function isFunction$1(value) {
	return typeof value === "function";
}
__name$6(isFunction$1, "isFunction");
function getState$2(checked) {
	return checked ? "checked" : "unchecked";
}
__name$6(getState$2, "getState");
//#endregion
//#region node_modules/@radix-ui/react-tabs/dist/index.mjs
var __defProp$5 = Object.defineProperty;
var __name$5 = (target, value) => __defProp$5(target, "name", {
	value,
	configurable: true
});
var TABS_NAME = "Tabs";
var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [createRovingFocusGroupScope]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$5(function Tabs2(props, forwardedRef) {
	const { __scopeTabs, value: valueProp, onValueChange, defaultValue, orientation = "horizontal", dir, activationMode = "automatic", ...tabsProps } = props;
	const direction = useDirection(dir);
	const [value, setValue] = useControllableState({
		prop: valueProp,
		onChange: onValueChange,
		defaultProp: defaultValue ?? "",
		caller: TABS_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsProvider, {
		scope: __scopeTabs,
		baseId: useId(),
		value,
		onValueChange: setValue,
		orientation,
		dir: direction,
		activationMode,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			dir: direction,
			"data-orientation": orientation,
			...tabsProps,
			ref: forwardedRef
		})
	});
}, "Tabs"));
var TAB_LIST_NAME = "TabsList";
var TabsList = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$5(function TabsList2(props, forwardedRef) {
	const { __scopeTabs, loop = true, ...listProps } = props;
	const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$2, {
		asChild: true,
		...rovingFocusGroupScope,
		orientation: context.orientation,
		dir: context.dir,
		loop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			role: "tablist",
			"aria-orientation": context.orientation,
			...listProps,
			ref: forwardedRef
		})
	});
}, "TabsList"));
var TRIGGER_NAME$3 = "TabsTrigger";
var TabsTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$5(function TabsTrigger2(props, forwardedRef) {
	const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
	const context = useTabsContext(TRIGGER_NAME$3, __scopeTabs);
	const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
	const triggerId = makeTriggerId(context.baseId, value);
	const contentId = makeContentId(context.baseId, value);
	const isSelected = value === context.value;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item$1, {
		asChild: true,
		...rovingFocusGroupScope,
		focusable: !disabled,
		active: isSelected,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			role: "tab",
			"aria-selected": isSelected,
			"aria-controls": contentId,
			"data-state": isSelected ? "active" : "inactive",
			"data-disabled": disabled ? "" : void 0,
			disabled,
			id: triggerId,
			...triggerProps,
			ref: forwardedRef,
			onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
				if (!disabled && event.button === 0 && event.ctrlKey === false) context.onValueChange(value);
				else event.preventDefault();
			}),
			onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
				if (disabled || event.target !== event.currentTarget) return;
				if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
			}),
			onFocus: composeEventHandlers(props.onFocus, () => {
				const isAutomaticActivation = context.activationMode !== "manual";
				if (!isSelected && !disabled && isAutomaticActivation) context.onValueChange(value);
			})
		})
	});
}, "TabsTrigger"));
var CONTENT_NAME$3 = "TabsContent";
var TabsContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$5(function TabsContent2(props, forwardedRef) {
	const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
	const context = useTabsContext(CONTENT_NAME$3, __scopeTabs);
	const triggerId = makeTriggerId(context.baseId, value);
	const contentId = makeContentId(context.baseId, value);
	const isSelected = value === context.value;
	const isMountAnimationPreventedRef = import_react.useRef(isSelected);
	import_react.useEffect(() => {
		const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
		return () => cancelAnimationFrame(rAF);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || isSelected,
		children: ({ present }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": isSelected ? "active" : "inactive",
			"data-orientation": context.orientation,
			role: "tabpanel",
			"aria-labelledby": triggerId,
			hidden: !present,
			id: contentId,
			tabIndex: 0,
			...contentProps,
			ref: forwardedRef,
			style: {
				...props.style,
				animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
			},
			children: present && children
		})
	});
}, "TabsContent"));
function makeTriggerId(baseId, value) {
	return `${baseId}-trigger-${value}`;
}
__name$5(makeTriggerId, "makeTriggerId");
function makeContentId(baseId, value) {
	return `${baseId}-content-${value}`;
}
__name$5(makeContentId, "makeContentId");
var Root2$2 = Tabs;
var List = TabsList;
var Trigger$1 = TabsTrigger;
var Content$1 = TabsContent;
//#endregion
//#region node_modules/@radix-ui/react-label/dist/index.mjs
var __defProp$4 = Object.defineProperty;
var __name$4 = (target, value) => __defProp$4(target, "name", {
	value,
	configurable: true
});
var Root$1 = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$4(function Label2(props, forwardedRef) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.label, {
		...props,
		ref: forwardedRef,
		onMouseDown: (event) => {
			if (event.target.closest("button, input, select, textarea")) return;
			props.onMouseDown?.(event);
			if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
		}
	});
}, "Label"));
//#endregion
//#region node_modules/@radix-ui/number/dist/index.mjs
function clamp(value, [min, max]) {
	return Math.min(max, Math.max(min, value));
}
//#endregion
//#region node_modules/@radix-ui/react-use-previous/dist/index.mjs
function usePrevious(value) {
	const ref = import_react.useRef({
		value,
		previous: value
	});
	return import_react.useMemo(() => {
		if (ref.current.value !== value) {
			ref.current.previous = ref.current.value;
			ref.current.value = value;
		}
		return ref.current.previous;
	}, [value]);
}
//#endregion
//#region node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var VISUALLY_HIDDEN_STYLES = Object.freeze({
	position: "absolute",
	border: 0,
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	wordWrap: "normal"
});
//#endregion
//#region node_modules/@radix-ui/react-select/dist/index.mjs
var __defProp$3 = Object.defineProperty;
var __name$3 = (target, value) => __defProp$3(target, "name", {
	value,
	configurable: true
});
var OPEN_KEYS = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(SELECT_NAME);
var [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [createCollectionScope$1, createPopperScope]);
var usePopperScope = createPopperScope();
var [SelectProviderImpl, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
function SelectProvider(props) {
	const { __scopeSelect, children, open: openProp, defaultOpen, onOpenChange, value: valueProp, defaultValue, onValueChange, dir, name, autoComplete, disabled, required, form, internal_do_not_use_render } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const [trigger, setTrigger] = import_react.useState(null);
	const [valueNode, setValueNode] = import_react.useState(null);
	const [valueNodeHasChildren, setValueNodeHasChildren] = import_react.useState(false);
	const direction = useDirection(dir);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: SELECT_NAME
	});
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue,
		onChange: onValueChange,
		caller: SELECT_NAME
	});
	const triggerPointerDownPosRef = import_react.useRef(null);
	const initialValueRef = import_react.useRef(value);
	import_react.useEffect(() => {
		const associatedForm = form ? trigger?.ownerDocument.getElementById(form) : trigger?.form;
		if (associatedForm instanceof HTMLFormElement) {
			const reset = /* @__PURE__ */ __name$3(() => setValue(initialValueRef.current), "reset");
			associatedForm.addEventListener("reset", reset);
			return () => associatedForm.removeEventListener("reset", reset);
		}
	}, [
		form,
		trigger,
		setValue
	]);
	const isFormControl = trigger ? !!form || !!trigger.closest("form") : true;
	const [nativeOptionsSet, setNativeOptionsSet] = import_react.useState(/* @__PURE__ */ new Set());
	const contentId = useId();
	const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
	const handleNativeOptionAdd = import_react.useCallback((option) => {
		setNativeOptionsSet((prev) => new Set(prev).add(option));
	}, []);
	const handleNativeOptionRemove = import_react.useCallback((option) => {
		setNativeOptionsSet((prev) => {
			const optionsSet = new Set(prev);
			optionsSet.delete(option);
			return optionsSet;
		});
	}, []);
	const context = {
		required,
		trigger,
		onTriggerChange: setTrigger,
		valueNode,
		onValueNodeChange: setValueNode,
		valueNodeHasChildren,
		onValueNodeHasChildrenChange: setValueNodeHasChildren,
		contentId,
		value,
		onValueChange: setValue,
		open,
		onOpenChange: setOpen,
		dir: direction,
		triggerPointerDownPosRef,
		disabled,
		name,
		autoComplete,
		form,
		nativeOptions: nativeOptionsSet,
		nativeSelectKey,
		isFormControl
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$4, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectProviderImpl, {
			scope: __scopeSelect,
			...context,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.Provider, {
				scope: __scopeSelect,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectNativeOptionsProvider, {
					scope: __scopeSelect,
					onNativeOptionAdd: handleNativeOptionAdd,
					onNativeOptionRemove: handleNativeOptionRemove,
					children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
				})
			})
		})
	});
}
__name$3(SelectProvider, "SelectProvider");
var Select = /* @__PURE__ */ __name$3((props) => {
	const { __scopeSelect, children, ...providerProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectProvider, {
		__scopeSelect,
		...providerProps,
		internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [children, isFormControl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectBubbleInput, { __scopeSelect }) : null] })
	});
}, "Select");
var TRIGGER_NAME$2 = "SelectTrigger";
var SelectTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectTrigger2(props, forwardedRef) {
	const { __scopeSelect, disabled = false, ...triggerProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const context = useSelectContext(TRIGGER_NAME$2, __scopeSelect);
	const isDisabled = context.disabled || disabled;
	const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
	const getItems = useCollection$1(__scopeSelect);
	const pointerTypeRef = import_react.useRef("touch");
	const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.value === context.value));
		if (nextItem !== void 0) context.onValueChange(nextItem.value);
	});
	const handleOpen = /* @__PURE__ */ __name$3((pointerEvent) => {
		if (!isDisabled) {
			context.onOpenChange(true);
			resetTypeahead();
		}
		if (pointerEvent) context.triggerPointerDownPosRef.current = {
			x: Math.round(pointerEvent.pageX),
			y: Math.round(pointerEvent.pageY)
		};
	}, "handleOpen");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		asChild: true,
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			role: "combobox",
			"aria-controls": context.open ? context.contentId : void 0,
			"aria-expanded": context.open,
			"aria-required": context.required,
			"aria-autocomplete": "none",
			dir: context.dir,
			"data-state": context.open ? "open" : "closed",
			disabled: isDisabled,
			"data-disabled": isDisabled ? "" : void 0,
			"data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
			...triggerProps,
			ref: composedRefs,
			onClick: composeEventHandlers(triggerProps.onClick, (event) => {
				event.currentTarget.focus();
				if (pointerTypeRef.current !== "mouse") handleOpen(event);
			}),
			onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
				pointerTypeRef.current = event.pointerType;
				const target = event.target;
				if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
				if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
					handleOpen(event);
					event.preventDefault();
				}
			}),
			onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
				const isTypingAhead = searchRef.current !== "";
				if (!(event.ctrlKey || event.altKey || event.metaKey) && event.key.length === 1) handleTypeaheadSearch(event.key);
				if (isTypingAhead && event.key === " ") return;
				if (OPEN_KEYS.includes(event.key)) {
					handleOpen();
					event.preventDefault();
				}
			})
		})
	});
}, "SelectTrigger"));
var VALUE_NAME = "SelectValue";
var SelectValue = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectValue2(props, forwardedRef) {
	const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
	const context = useSelectContext(VALUE_NAME, __scopeSelect);
	const { onValueNodeHasChildrenChange } = context;
	const hasChildren = children !== void 0;
	const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
	useLayoutEffect2(() => {
		onValueNodeHasChildrenChange(hasChildren);
	}, [onValueNodeHasChildrenChange, hasChildren]);
	const showPlaceholder = shouldShowPlaceholder(context.value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		...valueProps,
		asChild: showPlaceholder ? false : valueProps.asChild,
		ref: composedRefs,
		style: { pointerEvents: "none" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: showPlaceholder ? placeholder : children }, showPlaceholder ? "placeholder" : "value")
	});
}, "SelectValue"));
var SelectIcon = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectIcon2(props, forwardedRef) {
	const { __scopeSelect, children, ...iconProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		"aria-hidden": true,
		...iconProps,
		ref: forwardedRef,
		children: children || "▼"
	});
}, "SelectIcon"));
var [PortalProvider, usePortalContext] = createSelectContext("SelectPortal", { forceMount: void 0 });
var SelectPortal = /* @__PURE__ */ __name$3((props) => {
	const { __scopeSelect, forceMount, ...portalProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalProvider, {
		scope: props.__scopeSelect,
		forceMount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$1, {
			asChild: true,
			...portalProps
		})
	});
}, "SelectPortal");
var CONTENT_NAME$2 = "SelectContent";
var SelectContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectContent2(props, forwardedRef) {
	const portalContext = usePortalContext(CONTENT_NAME$2, props.__scopeSelect);
	const { forceMount = portalContext.forceMount, ...contentProps } = props;
	const context = useSelectContext(CONTENT_NAME$2, props.__scopeSelect);
	const [fragment, setFragment] = import_react.useState();
	useLayoutEffect2(() => {
		setFragment(new DocumentFragment());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: ({ present }) => present ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentImpl, {
			...contentProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentFragment, {
			...contentProps,
			fragment
		})
	});
}, "SelectContent"));
var SelectContentFragment = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectContentFragment2(props, forwardedRef) {
	const { __scopeSelect, children, fragment } = props;
	if (!fragment) return null;
	return import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentProvider, {
		scope: __scopeSelect,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.Slot, {
			scope: __scopeSelect,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: forwardedRef,
				children
			})
		})
	}), fragment);
}, "SelectContentFragment"));
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME$2);
var Slot = /* @__PURE__ */ createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectContentImpl2(props, forwardedRef) {
	const { __scopeSelect } = props;
	const { position = "item-aligned", onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, side, sideOffset, align, alignOffset, arrowPadding, collisionBoundary, collisionPadding, sticky, hideWhenDetached, avoidCollisions, ...contentProps } = props;
	const context = useSelectContext(CONTENT_NAME$2, __scopeSelect);
	const [content, setContent] = import_react.useState(null);
	const [viewport, setViewport] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, setContent);
	const [selectedItem, setSelectedItem] = import_react.useState(null);
	const [selectedItemText, setSelectedItemText] = import_react.useState(null);
	const getItems = useCollection$1(__scopeSelect);
	const [isPositioned, setIsPositioned] = import_react.useState(false);
	const firstValidItemFoundRef = import_react.useRef(false);
	import_react.useEffect(() => {
		if (content) return hideOthers(content);
	}, [content]);
	useFocusGuards();
	const focusFirst = import_react.useCallback((candidates) => {
		const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
		const [lastItem] = restItems.slice(-1);
		const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
		for (const candidate of candidates) {
			if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
			candidate?.scrollIntoView({ block: "nearest" });
			if (candidate === firstItem && viewport) viewport.scrollTop = 0;
			if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
			candidate?.focus();
			if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
		}
	}, [getItems, viewport]);
	const focusSelectedItem = import_react.useCallback(() => focusFirst([selectedItem, content]), [
		focusFirst,
		selectedItem,
		content
	]);
	import_react.useEffect(() => {
		if (isPositioned) focusSelectedItem();
	}, [isPositioned, focusSelectedItem]);
	const { onOpenChange, triggerPointerDownPosRef } = context;
	import_react.useEffect(() => {
		if (content) {
			let pointerMoveDelta = {
				x: 0,
				y: 0
			};
			const handlePointerMove = /* @__PURE__ */ __name$3((event) => {
				pointerMoveDelta = {
					x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
					y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0))
				};
			}, "handlePointerMove");
			const handlePointerUp = /* @__PURE__ */ __name$3((event) => {
				if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
				else if (!event.composedPath().includes(content)) onOpenChange(false);
				document.removeEventListener("pointermove", handlePointerMove);
				triggerPointerDownPosRef.current = null;
			}, "handlePointerUp");
			if (triggerPointerDownPosRef.current !== null) {
				document.addEventListener("pointermove", handlePointerMove);
				document.addEventListener("pointerup", handlePointerUp, {
					capture: true,
					once: true
				});
			}
			return () => {
				document.removeEventListener("pointermove", handlePointerMove);
				document.removeEventListener("pointerup", handlePointerUp, { capture: true });
			};
		}
	}, [
		content,
		onOpenChange,
		triggerPointerDownPosRef
	]);
	import_react.useEffect(() => {
		const close = /* @__PURE__ */ __name$3(() => onOpenChange(false), "close");
		window.addEventListener("blur", close);
		window.addEventListener("resize", close);
		return () => {
			window.removeEventListener("blur", close);
			window.removeEventListener("resize", close);
		};
	}, [onOpenChange]);
	const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.ref.current === document.activeElement));
		if (nextItem) setTimeout(() => nextItem.ref.current?.focus());
	});
	const itemRefCallback = import_react.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) {
			setSelectedItem(node);
			if (isFirstValidItem) firstValidItemFoundRef.current = true;
		}
	}, [context.value]);
	const handleItemLeave = import_react.useCallback(() => content?.focus(), [content]);
	const itemTextRefCallback = import_react.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) setSelectedItemText(node);
	}, [context.value]);
	const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
	const popperContentProps = SelectPosition === SelectPopperPosition ? {
		side,
		sideOffset,
		align,
		alignOffset,
		arrowPadding,
		collisionBoundary,
		collisionPadding,
		sticky,
		hideWhenDetached,
		avoidCollisions
	} : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentProvider, {
		scope: __scopeSelect,
		content,
		viewport,
		onViewportChange: setViewport,
		itemRefCallback,
		selectedItem,
		onItemLeave: handleItemLeave,
		itemTextRefCallback,
		focusSelectedItem,
		selectedItemText,
		position,
		isPositioned,
		searchRef,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
			as: Slot,
			allowPinchZoom: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
				asChild: true,
				trapped: context.open,
				onMountAutoFocus: (event) => {
					event.preventDefault();
				},
				onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
					context.trigger?.focus({ preventScroll: true });
					event.preventDefault();
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
					asChild: true,
					disableOutsidePointerEvents: true,
					onEscapeKeyDown,
					onPointerDownOutside,
					onFocusOutside: (event) => event.preventDefault(),
					onDismiss: () => context.onOpenChange(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPosition, {
						role: "listbox",
						id: context.contentId,
						"data-state": context.open ? "open" : "closed",
						dir: context.dir,
						onContextMenu: (event) => event.preventDefault(),
						...contentProps,
						...popperContentProps,
						onPlaced: () => setIsPositioned(true),
						ref: composedRefs,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none",
							...contentProps.style
						},
						onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
							const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
							if (event.key === "Tab") event.preventDefault();
							if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
							if ([
								"ArrowUp",
								"ArrowDown",
								"Home",
								"End"
							].includes(event.key)) {
								let candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
								if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
								if (["ArrowUp", "ArrowDown"].includes(event.key)) {
									const currentElement = event.target;
									const currentIndex = candidateNodes.indexOf(currentElement);
									candidateNodes = candidateNodes.slice(currentIndex + 1);
								}
								setTimeout(() => focusFirst(candidateNodes));
								event.preventDefault();
							}
						})
					})
				})
			})
		})
	});
}, "SelectContentImpl"));
var SelectItemAlignedPosition = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectItemAlignedPosition2(props, forwardedRef) {
	const { __scopeSelect, onPlaced, ...popperProps } = props;
	const context = useSelectContext(CONTENT_NAME$2, __scopeSelect);
	const contentContext = useSelectContentContext(CONTENT_NAME$2, __scopeSelect);
	const [contentWrapper, setContentWrapper] = import_react.useState(null);
	const [content, setContent] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, setContent);
	const getItems = useCollection$1(__scopeSelect);
	const shouldExpandOnScrollRef = import_react.useRef(false);
	const shouldRepositionRef = import_react.useRef(true);
	const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
	const position = import_react.useCallback(() => {
		if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
			const triggerRect = context.trigger.getBoundingClientRect();
			const contentRect = content.getBoundingClientRect();
			const valueNodeRect = context.valueNode.getBoundingClientRect();
			const itemTextRect = selectedItemText.getBoundingClientRect();
			if (context.dir !== "rtl") {
				const itemTextOffset = itemTextRect.left - contentRect.left;
				const left = valueNodeRect.left - itemTextOffset;
				const leftDelta = triggerRect.left - left;
				const minContentWidth = triggerRect.width + leftDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const rightEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedLeft = clamp(left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.left = clampedLeft + "px";
			} else {
				const itemTextOffset = contentRect.right - itemTextRect.right;
				const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
				const rightDelta = window.innerWidth - triggerRect.right - right;
				const minContentWidth = triggerRect.width + rightDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const leftEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedRight = clamp(right, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.right = clampedRight + "px";
			}
			const items = getItems();
			const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
			const itemsHeight = viewport.scrollHeight;
			const contentStyles = window.getComputedStyle(content);
			const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
			const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
			const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
			const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
			const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
			const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
			const viewportStyles = window.getComputedStyle(viewport);
			const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
			const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
			const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
			const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
			const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
			const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
			const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
			const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
			if (contentTopToItemMiddle <= topEdgeToTriggerMiddle) {
				const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
				contentWrapper.style.bottom = "0px";
				const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
				const height = contentTopToItemMiddle + Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
				contentWrapper.style.height = height + "px";
			} else {
				const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
				contentWrapper.style.top = "0px";
				const height = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight) + itemMiddleToContentBottom;
				contentWrapper.style.height = height + "px";
				viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
			}
			contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
			contentWrapper.style.minHeight = minContentHeight + "px";
			contentWrapper.style.maxHeight = availableHeight + "px";
			onPlaced?.();
			requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
		}
	}, [
		getItems,
		context.trigger,
		context.valueNode,
		contentWrapper,
		content,
		viewport,
		selectedItem,
		selectedItemText,
		context.dir,
		onPlaced
	]);
	useLayoutEffect2(() => position(), [position]);
	const [contentZIndex, setContentZIndex] = import_react.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewportProvider, {
		scope: __scopeSelect,
		contentWrapper,
		shouldExpandOnScrollRef,
		onScrollButtonChange: import_react.useCallback((node) => {
			if (node && shouldRepositionRef.current === true) {
				position();
				focusSelectedItem?.();
				shouldRepositionRef.current = false;
			}
		}, [position, focusSelectedItem]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: setContentWrapper,
			style: {
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: contentZIndex
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				...popperProps,
				ref: composedRefs,
				style: {
					boxSizing: "border-box",
					maxHeight: "100%",
					...popperProps.style
				}
			})
		})
	});
}, "SelectItemAlignedPosition"));
var SelectPopperPosition = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectPopperPosition2(props, forwardedRef) {
	const { __scopeSelect, align = "start", collisionPadding = CONTENT_MARGIN, ...popperProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content$2, {
		...popperScope,
		...popperProps,
		ref: forwardedRef,
		align,
		collisionPadding,
		style: {
			boxSizing: "border-box",
			...popperProps.style,
			"--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-select-content-available-width": "var(--radix-popper-available-width)",
			"--radix-select-content-available-height": "var(--radix-popper-available-height)",
			"--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
}, "SelectPopperPosition"));
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME$2, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectViewport2(props, forwardedRef) {
	const { __scopeSelect, nonce, ...viewportProps } = props;
	const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
	const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
	const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
	const prevScrollTopRef = import_react.useRef(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
		dangerouslySetInnerHTML: { __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}` },
		nonce
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.Slot, {
		scope: __scopeSelect,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-radix-select-viewport": "",
			role: "presentation",
			...viewportProps,
			ref: composedRefs,
			style: {
				position: "relative",
				flex: 1,
				overflow: "hidden auto",
				...viewportProps.style
			},
			onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
				const viewport = event.currentTarget;
				const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
				if (shouldExpandOnScrollRef?.current && contentWrapper) {
					const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
					if (scrolledBy > 0) {
						const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
						const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
						const cssHeight = parseFloat(contentWrapper.style.height);
						const prevHeight = Math.max(cssMinHeight, cssHeight);
						if (prevHeight < availableHeight) {
							const nextHeight = prevHeight + scrolledBy;
							const clampedNextHeight = Math.min(availableHeight, nextHeight);
							const heightDiff = nextHeight - clampedNextHeight;
							contentWrapper.style.height = clampedNextHeight + "px";
							if (contentWrapper.style.bottom === "0px") {
								viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
								contentWrapper.style.justifyContent = "flex-end";
							}
						}
					}
				}
				prevScrollTopRef.current = viewport.scrollTop;
			})
		})
	})] });
}, "SelectViewport"));
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext("SelectGroup");
var LABEL_NAME = "SelectLabel";
var SelectLabel = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectLabel2(props, forwardedRef) {
	const { __scopeSelect, ...labelProps } = props;
	const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		id: groupContext.id,
		...labelProps,
		ref: forwardedRef
	});
}, "SelectLabel"));
var ITEM_NAME$1 = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME$1);
var SelectItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectItem2(props, forwardedRef) {
	const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props;
	const context = useSelectContext(ITEM_NAME$1, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_NAME$1, __scopeSelect);
	const isSelected = context.value === value;
	const [textValue, setTextValue] = import_react.useState(textValueProp ?? "");
	const [isFocused, setIsFocused] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, useCallbackRef$1((node) => contentContext.itemRefCallback?.(node, value, disabled)));
	const textId = useId();
	const pointerTypeRef = import_react.useRef("touch");
	const handleSelect = /* @__PURE__ */ __name$3(() => {
		if (!disabled) {
			context.onValueChange(value);
			context.onOpenChange(false);
		}
	}, "handleSelect");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemContextProvider, {
		scope: __scopeSelect,
		value,
		disabled,
		textId,
		isSelected,
		onItemTextChange: import_react.useCallback((node) => {
			setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? "").trim());
		}, []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection$1.ItemSlot, {
			scope: __scopeSelect,
			value,
			disabled,
			textValue,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				role: "option",
				"aria-labelledby": textId,
				"data-highlighted": isFocused ? "" : void 0,
				"aria-selected": isSelected && isFocused,
				"data-state": isSelected ? "checked" : "unchecked",
				"aria-disabled": disabled || void 0,
				"data-disabled": disabled ? "" : void 0,
				tabIndex: disabled ? void 0 : -1,
				...itemProps,
				ref: composedRefs,
				onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
				onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
				onClick: composeEventHandlers(itemProps.onClick, () => {
					if (pointerTypeRef.current !== "mouse") handleSelect();
				}),
				onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
					if (pointerTypeRef.current === "mouse") handleSelect();
				}),
				onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
					pointerTypeRef.current = event.pointerType;
				}),
				onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
					pointerTypeRef.current = event.pointerType;
					if (disabled) contentContext.onItemLeave?.();
					else if (pointerTypeRef.current === "mouse") event.currentTarget.focus({ preventScroll: true });
				}),
				onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
					if (event.currentTarget === document.activeElement) contentContext.onItemLeave?.();
				}),
				onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
					if (disabled || event.target !== event.currentTarget) return;
					if (contentContext.searchRef?.current !== "" && event.key === " ") return;
					if (SELECTION_KEYS.includes(event.key)) handleSelect();
					if (event.key === " ") event.preventDefault();
				})
			})
		})
	});
}, "SelectItem"));
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectItemText2(props, forwardedRef) {
	const { __scopeSelect, className, style, ...itemTextProps } = props;
	const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
	const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
	const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
	const [itemTextNode, setItemTextNode] = import_react.useState(null);
	const handleItemTextRefCallback = useCallbackRef$1((node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled));
	const composedRefs = useComposedRefs(forwardedRef, setItemTextNode, itemContext.onItemTextChange, handleItemTextRefCallback);
	const textContent = itemTextNode?.textContent;
	const nativeOption = import_react.useMemo(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
		value: itemContext.value,
		disabled: itemContext.disabled,
		children: textContent
	}, itemContext.value), [
		itemContext.disabled,
		itemContext.value,
		textContent
	]);
	const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
	useLayoutEffect2(() => {
		onNativeOptionAdd(nativeOption);
		return () => onNativeOptionRemove(nativeOption);
	}, [
		onNativeOptionAdd,
		onNativeOptionRemove,
		nativeOption
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		id: itemContext.textId,
		...itemTextProps,
		ref: composedRefs
	}), itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren && !shouldShowPlaceholder(context.value) ? import_react_dom.createPortal(itemTextProps.children, context.valueNode) : null] });
}, "SelectItemText"));
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectItemIndicator2(props, forwardedRef) {
	const { __scopeSelect, ...itemIndicatorProps } = props;
	return useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect).isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		"aria-hidden": true,
		...itemIndicatorProps,
		ref: forwardedRef
	}) : null;
}, "SelectItemIndicator"));
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectScrollUpButton2(props, forwardedRef) {
	const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const [canScrollUp, setCanScrollUp] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				const canScrollUp2 = viewport.scrollTop > 0;
				setCanScrollUp(canScrollUp2);
			};
			__name$3(handleScroll2, "handleScroll");
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		}
	}) : null;
}, "SelectScrollUpButton"));
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectScrollDownButton2(props, forwardedRef) {
	const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const [canScrollDown, setCanScrollDown] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				const maxScroll = viewport.scrollHeight - viewport.clientHeight;
				const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
				setCanScrollDown(canScrollDown2);
			};
			__name$3(handleScroll2, "handleScroll");
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		}
	}) : null;
}, "SelectScrollDownButton"));
var SelectScrollButtonImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectScrollButtonImpl2(props, forwardedRef) {
	const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
	const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
	const autoScrollTimerRef = import_react.useRef(null);
	const getItems = useCollection$1(__scopeSelect);
	const clearAutoScrollTimer = import_react.useCallback(() => {
		if (autoScrollTimerRef.current !== null) {
			window.clearInterval(autoScrollTimerRef.current);
			autoScrollTimerRef.current = null;
		}
	}, []);
	import_react.useEffect(() => {
		return () => clearAutoScrollTimer();
	}, [clearAutoScrollTimer]);
	useLayoutEffect2(() => {
		getItems().find((item) => item.ref.current === document.activeElement)?.ref.current?.scrollIntoView({ block: "nearest" });
	}, [getItems]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"aria-hidden": true,
		...scrollIndicatorProps,
		ref: forwardedRef,
		style: {
			flexShrink: 0,
			...scrollIndicatorProps.style
		},
		onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
			contentContext.onItemLeave?.();
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
			clearAutoScrollTimer();
		})
	});
}, "SelectScrollButtonImpl"));
var SelectSeparator = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectSeparator2(props, forwardedRef) {
	const { __scopeSelect, ...separatorProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"aria-hidden": true,
		...separatorProps,
		ref: forwardedRef
	});
}, "SelectSeparator"));
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$3(function SelectBubbleInput2({ __scopeSelect, ...props }, forwardedRef) {
	const context = useSelectContext(BUBBLE_INPUT_NAME, __scopeSelect);
	const { value, onValueChange, required, disabled, name, autoComplete, form } = context;
	const { nativeOptions, nativeSelectKey } = context;
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const selectValue = value ?? "";
	const prevValue = usePrevious(selectValue);
	const hasEmptyValueOption = Array.from(nativeOptions).some((option) => (option.props.value ?? "") === "");
	import_react.useEffect(() => {
		const select = ref.current;
		if (!select) return;
		const selectProto = window.HTMLSelectElement.prototype;
		const setValue = Object.getOwnPropertyDescriptor(selectProto, "value").set;
		if (prevValue !== selectValue && setValue) {
			const event = new Event("change", { bubbles: true });
			setValue.call(select, selectValue);
			select.dispatchEvent(event);
		}
	}, [prevValue, selectValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Primitive.select, {
		"aria-hidden": true,
		required,
		tabIndex: -1,
		name,
		autoComplete,
		disabled,
		form,
		onChange: (event) => onValueChange(event.target.value),
		...props,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		},
		ref: composedRefs,
		defaultValue: selectValue,
		children: [shouldShowPlaceholder(value) && !hasEmptyValueOption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "" }) : null, Array.from(nativeOptions)]
	}, nativeSelectKey);
}, "SelectBubbleInput"));
function isFunction(value) {
	return typeof value === "function";
}
__name$3(isFunction, "isFunction");
function shouldShowPlaceholder(value) {
	return value === "" || value === void 0;
}
__name$3(shouldShowPlaceholder, "shouldShowPlaceholder");
function useTypeaheadSearch(onSearchChange) {
	const handleSearchChange = useCallbackRef$1(onSearchChange);
	const searchRef = import_react.useRef("");
	const timerRef = import_react.useRef(0);
	const handleTypeaheadSearch = import_react.useCallback((key) => {
		const search = searchRef.current + key;
		handleSearchChange(search);
		(/* @__PURE__ */ __name$3((function updateSearch(value) {
			searchRef.current = value;
			window.clearTimeout(timerRef.current);
			if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
		}), "updateSearch"))(search);
	}, [handleSearchChange]);
	const resetTypeahead = import_react.useCallback(() => {
		searchRef.current = "";
		window.clearTimeout(timerRef.current);
	}, []);
	import_react.useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);
	return [
		searchRef,
		handleTypeaheadSearch,
		resetTypeahead
	];
}
__name$3(useTypeaheadSearch, "useTypeaheadSearch");
function findNextItem(items, search, currentItem) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
	let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
	if (normalizedSearch.length === 1) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
	const nextItem = wrappedItems.find((item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextItem !== currentItem ? nextItem : void 0;
}
__name$3(findNextItem, "findNextItem");
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
__name$3(wrapArray, "wrapArray");
//#endregion
//#region node_modules/@radix-ui/react-alert-dialog/dist/index.mjs
var __defProp$2 = Object.defineProperty;
var __name$2 = (target, value) => __defProp$2(target, "name", {
	value,
	configurable: true
});
var [createAlertDialogContext, createAlertDialogScope] = createContextScope("AlertDialog", [createDialogScope]);
var useDialogScope = createDialogScope();
var AlertDialog = /* @__PURE__ */ __name$2((props) => {
	const { __scopeAlertDialog, ...alertDialogProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		...dialogScope,
		...alertDialogProps,
		modal: true
	});
}, "AlertDialog");
import_react.forwardRef(/* @__PURE__ */ __name$2(function AlertDialogTrigger2(props, forwardedRef) {
	const { __scopeAlertDialog, ...triggerProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
		...dialogScope,
		...triggerProps,
		ref: forwardedRef
	});
}, "AlertDialogTrigger"));
var AlertDialogPortal = /* @__PURE__ */ __name$2((props) => {
	const { __scopeAlertDialog, ...portalProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogPortal, {
		...dialogScope,
		...portalProps
	});
}, "AlertDialogPortal");
var AlertDialogOverlay = import_react.forwardRef(/* @__PURE__ */ __name$2(function AlertDialogOverlay2(props, forwardedRef) {
	const { __scopeAlertDialog, ...overlayProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
		...dialogScope,
		...overlayProps,
		ref: forwardedRef
	});
}, "AlertDialogOverlay"));
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext("AlertDialogContent");
var AlertDialogContent = import_react.forwardRef(/* @__PURE__ */ __name$2(function AlertDialogContent2(props, forwardedRef) {
	const { __scopeAlertDialog, children, ...contentProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	const composedRefs = useComposedRefs(forwardedRef, import_react.useRef(null));
	const cancelRef = import_react.useRef(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContentProvider, {
		scope: __scopeAlertDialog,
		cancelRef,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			role: "alertdialog",
			...dialogScope,
			...contentProps,
			ref: composedRefs,
			onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
				event.preventDefault();
				cancelRef.current?.focus({ preventScroll: true });
			}),
			onPointerDownOutside: (event) => event.preventDefault(),
			onInteractOutside: (event) => event.preventDefault(),
			children
		})
	});
}, "AlertDialogContent"));
var AlertDialogTitle = import_react.forwardRef(/* @__PURE__ */ __name$2(function AlertDialogTitle2(props, forwardedRef) {
	const { __scopeAlertDialog, ...titleProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
		...dialogScope,
		...titleProps,
		ref: forwardedRef
	});
}, "AlertDialogTitle"));
var AlertDialogDescription = import_react.forwardRef(/* @__PURE__ */ __name$2(function AlertDialogDescription2(props, forwardedRef) {
	const { __scopeAlertDialog, ...descriptionProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
		...dialogScope,
		...descriptionProps,
		ref: forwardedRef
	});
}, "AlertDialogDescription"));
var AlertDialogAction = import_react.forwardRef(/* @__PURE__ */ __name$2(function AlertDialogAction2(props, forwardedRef) {
	const { __scopeAlertDialog, ...actionProps } = props;
	const dialogScope = useDialogScope(__scopeAlertDialog);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
		...dialogScope,
		...actionProps,
		ref: forwardedRef
	});
}, "AlertDialogAction"));
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel = import_react.forwardRef(/* @__PURE__ */ __name$2(function AlertDialogCancel2(props, forwardedRef) {
	const { __scopeAlertDialog, ...cancelProps } = props;
	const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
	const dialogScope = useDialogScope(__scopeAlertDialog);
	const ref = useComposedRefs(forwardedRef, cancelRef);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
		...dialogScope,
		...cancelProps,
		ref
	});
}, "AlertDialogCancel"));
var Root2$1 = AlertDialog;
var Portal2 = AlertDialogPortal;
var Overlay2 = AlertDialogOverlay;
var Content2$1 = AlertDialogContent;
var Action = AlertDialogAction;
var Cancel = AlertDialogCancel;
var Title2 = AlertDialogTitle;
var Description2 = AlertDialogDescription;
//#endregion
//#region node_modules/@radix-ui/react-collapsible/dist/index.mjs
var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", {
	value,
	configurable: true
});
var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function Collapsible2(props, forwardedRef) {
	const { __scopeCollapsible, open: openProp, defaultOpen, disabled, onOpenChange, ...collapsibleProps } = props;
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: COLLAPSIBLE_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleProvider, {
		scope: __scopeCollapsible,
		disabled,
		contentId: useId(),
		open,
		onOpenToggle: import_react.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-state": getState$1(open),
			"data-disabled": disabled ? "" : void 0,
			...collapsibleProps,
			ref: forwardedRef
		})
	});
}, "Collapsible"));
var TRIGGER_NAME$1 = "CollapsibleTrigger";
var CollapsibleTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function CollapsibleTrigger2(props, forwardedRef) {
	const { __scopeCollapsible, ...triggerProps } = props;
	const context = useCollapsibleContext(TRIGGER_NAME$1, __scopeCollapsible);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
		type: "button",
		"aria-controls": context.open ? context.contentId : void 0,
		"aria-expanded": context.open || false,
		"data-state": getState$1(context.open),
		"data-disabled": context.disabled ? "" : void 0,
		disabled: context.disabled,
		...triggerProps,
		ref: forwardedRef,
		onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
	});
}, "CollapsibleTrigger"));
var CONTENT_NAME$1 = "CollapsibleContent";
var CollapsibleContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function CollapsibleContent2(props, forwardedRef) {
	const { forceMount, ...contentProps } = props;
	const context = useCollapsibleContext(CONTENT_NAME$1, props.__scopeCollapsible);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || context.open,
		children: ({ present }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContentImpl, {
			...contentProps,
			ref: forwardedRef,
			present
		})
	});
}, "CollapsibleContent"));
var CollapsibleContentImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function CollapsibleContentImpl2(props, forwardedRef) {
	const { __scopeCollapsible, present, children, ...contentProps } = props;
	const context = useCollapsibleContext(CONTENT_NAME$1, __scopeCollapsible);
	const [isPresent, setIsPresent] = import_react.useState(present);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const heightRef = import_react.useRef(0);
	const height = heightRef.current;
	const widthRef = import_react.useRef(0);
	const width = widthRef.current;
	const isOpen = context.open || isPresent;
	const isMountAnimationPreventedRef = import_react.useRef(isOpen);
	const originalStylesRef = import_react.useRef(void 0);
	import_react.useEffect(() => {
		const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
		return () => cancelAnimationFrame(rAF);
	}, []);
	useLayoutEffect2(() => {
		const node = ref.current;
		if (node) {
			originalStylesRef.current = originalStylesRef.current || {
				transitionDuration: node.style.transitionDuration,
				animationName: node.style.animationName
			};
			node.style.transitionDuration = "0s";
			node.style.animationName = "none";
			const rect = node.getBoundingClientRect();
			heightRef.current = rect.height;
			widthRef.current = rect.width;
			if (!isMountAnimationPreventedRef.current) {
				node.style.transitionDuration = originalStylesRef.current.transitionDuration;
				node.style.animationName = originalStylesRef.current.animationName;
			}
			setIsPresent(present);
		}
	}, [context.open, present]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-state": getState$1(context.open),
		"data-disabled": context.disabled ? "" : void 0,
		id: context.contentId,
		hidden: !isOpen,
		...contentProps,
		ref: composedRefs,
		style: {
			[`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
			[`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
			...props.style
		},
		children: isOpen && children
	});
}, "CollapsibleContentImpl"));
function getState$1(open) {
	return open ? "open" : "closed";
}
__name$1(getState$1, "getState");
var Root = Collapsible;
var Trigger = CollapsibleTrigger;
var Content = CollapsibleContent;
//#endregion
//#region node_modules/@radix-ui/react-accordion/dist/index.mjs
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var ACCORDION_NAME = "Accordion";
var ACCORDION_KEYS = [
	"Home",
	"End",
	"ArrowDown",
	"ArrowUp",
	"ArrowLeft",
	"ArrowRight"
];
var [Collection, useCollection, createCollectionScope] = createCollection(ACCORDION_NAME);
var [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME, [createCollectionScope, createCollapsibleScope]);
var useCollapsibleScope = createCollapsibleScope();
var Accordion = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function Accordion2(props, forwardedRef) {
	const { type, ...accordionProps } = props;
	const singleProps = accordionProps;
	const multipleProps = accordionProps;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Provider, {
		scope: props.__scopeAccordion,
		children: type === "multiple" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionImplMultiple, {
			...multipleProps,
			ref: forwardedRef
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionImplSingle, {
			...singleProps,
			ref: forwardedRef
		})
	});
}, "Accordion"));
var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME);
var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(ACCORDION_NAME, { collapsible: false });
var AccordionImplSingle = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AccordionImplSingle2(props, forwardedRef) {
	const { value: valueProp, defaultValue, onValueChange = /* @__PURE__ */ __name(() => {}, "onValueChange"), collapsible = false, ...accordionSingleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? "",
		onChange: onValueChange,
		caller: ACCORDION_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionValueProvider, {
		scope: props.__scopeAccordion,
		value: import_react.useMemo(() => value ? [value] : [], [value]),
		onItemOpen: setValue,
		onItemClose: import_react.useCallback(() => collapsible && setValue(""), [collapsible, setValue]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionCollapsibleProvider, {
			scope: props.__scopeAccordion,
			collapsible,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionImpl, {
				...accordionSingleProps,
				ref: forwardedRef
			})
		})
	});
}, "AccordionImplSingle"));
var AccordionImplMultiple = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AccordionImplMultiple2(props, forwardedRef) {
	const { value: valueProp, defaultValue, onValueChange = /* @__PURE__ */ __name(() => {}, "onValueChange"), ...accordionMultipleProps } = props;
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue ?? [],
		onChange: onValueChange,
		caller: ACCORDION_NAME
	});
	const handleItemOpen = import_react.useCallback((itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]), [setValue]);
	const handleItemClose = import_react.useCallback((itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)), [setValue]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionValueProvider, {
		scope: props.__scopeAccordion,
		value,
		onItemOpen: handleItemOpen,
		onItemClose: handleItemClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionCollapsibleProvider, {
			scope: props.__scopeAccordion,
			collapsible: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionImpl, {
				...accordionMultipleProps,
				ref: forwardedRef
			})
		})
	});
}, "AccordionImplMultiple"));
var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME);
var AccordionImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AccordionImpl2(props, forwardedRef) {
	const { __scopeAccordion, disabled, dir, orientation = "vertical", ...accordionProps } = props;
	const composedRefs = useComposedRefs(import_react.useRef(null), forwardedRef);
	const getItems = useCollection(__scopeAccordion);
	const isDirectionLTR = useDirection(dir) === "ltr";
	const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
		if (!ACCORDION_KEYS.includes(event.key)) return;
		const target = event.target;
		const triggerCollection = getItems().filter((item) => !item.ref.current?.disabled);
		const triggerIndex = triggerCollection.findIndex((item) => item.ref.current === target);
		const triggerCount = triggerCollection.length;
		if (triggerIndex === -1) return;
		event.preventDefault();
		let nextIndex = triggerIndex;
		const homeIndex = 0;
		const endIndex = triggerCount - 1;
		const moveNext = /* @__PURE__ */ __name(() => {
			nextIndex = triggerIndex + 1;
			if (nextIndex > endIndex) nextIndex = homeIndex;
		}, "moveNext");
		const movePrev = /* @__PURE__ */ __name(() => {
			nextIndex = triggerIndex - 1;
			if (nextIndex < homeIndex) nextIndex = endIndex;
		}, "movePrev");
		switch (event.key) {
			case "Home":
				nextIndex = homeIndex;
				break;
			case "End":
				nextIndex = endIndex;
				break;
			case "ArrowRight":
				if (orientation === "horizontal") if (isDirectionLTR) moveNext();
				else movePrev();
				break;
			case "ArrowDown":
				if (orientation === "vertical") moveNext();
				break;
			case "ArrowLeft":
				if (orientation === "horizontal") if (isDirectionLTR) movePrev();
				else moveNext();
				break;
			case "ArrowUp":
				if (orientation === "vertical") movePrev();
				break;
		}
		triggerCollection[nextIndex % triggerCount].ref.current?.focus();
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionImplProvider, {
		scope: __scopeAccordion,
		disabled,
		direction: dir,
		orientation,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, {
			scope: __scopeAccordion,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				...accordionProps,
				"data-orientation": orientation,
				ref: composedRefs,
				onKeyDown: disabled ? void 0 : handleKeyDown
			})
		})
	});
}, "AccordionImpl"));
var ITEM_NAME = "AccordionItem";
var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME);
var AccordionItem = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AccordionItem2(props, forwardedRef) {
	const { __scopeAccordion, value, ...accordionItemProps } = props;
	const accordionContext = useAccordionContext(ITEM_NAME, __scopeAccordion);
	const valueContext = useAccordionValueContext(ITEM_NAME, __scopeAccordion);
	const collapsibleScope = useCollapsibleScope(__scopeAccordion);
	const triggerId = useId();
	const open = value && valueContext.value.includes(value) || false;
	const disabled = accordionContext.disabled || props.disabled;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionItemProvider, {
		scope: __scopeAccordion,
		open,
		disabled,
		triggerId,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
			"data-orientation": accordionContext.orientation,
			"data-state": getState(open),
			...collapsibleScope,
			...accordionItemProps,
			ref: forwardedRef,
			disabled,
			open,
			onOpenChange: (open2) => {
				if (open2) valueContext.onItemOpen(value);
				else valueContext.onItemClose(value);
			}
		})
	});
}, "AccordionItem"));
var HEADER_NAME = "AccordionHeader";
var AccordionHeader = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AccordionHeader2(props, forwardedRef) {
	const { __scopeAccordion, ...headerProps } = props;
	const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
	const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.h3, {
		"data-orientation": accordionContext.orientation,
		"data-state": getState(itemContext.open),
		"data-disabled": itemContext.disabled ? "" : void 0,
		...headerProps,
		ref: forwardedRef
	});
}, "AccordionHeader"));
var TRIGGER_NAME = "AccordionTrigger";
var AccordionTrigger = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AccordionTrigger2(props, forwardedRef) {
	const { __scopeAccordion, ...triggerProps } = props;
	const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
	const itemContext = useAccordionItemContext(TRIGGER_NAME, __scopeAccordion);
	const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME, __scopeAccordion);
	const collapsibleScope = useCollapsibleScope(__scopeAccordion);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.ItemSlot, {
		scope: __scopeAccordion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
			"aria-disabled": itemContext.open && !collapsibleContext.collapsible || void 0,
			"data-orientation": accordionContext.orientation,
			id: itemContext.triggerId,
			...collapsibleScope,
			...triggerProps,
			ref: forwardedRef
		})
	});
}, "AccordionTrigger"));
var CONTENT_NAME = "AccordionContent";
var AccordionContent = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function AccordionContent2(props, forwardedRef) {
	const { __scopeAccordion, ...contentProps } = props;
	const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
	const itemContext = useAccordionItemContext(CONTENT_NAME, __scopeAccordion);
	const collapsibleScope = useCollapsibleScope(__scopeAccordion);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		role: "region",
		"aria-labelledby": itemContext.triggerId,
		"data-orientation": accordionContext.orientation,
		...collapsibleScope,
		...contentProps,
		ref: forwardedRef,
		style: {
			"--radix-accordion-content-height": "var(--radix-collapsible-content-height)",
			"--radix-accordion-content-width": "var(--radix-collapsible-content-width)",
			...props.style
		}
	});
}, "AccordionContent"));
function getState(open) {
	return open ? "open" : "closed";
}
__name(getState, "getState");
var Root2 = Accordion;
var Item = AccordionItem;
var Header = AccordionHeader;
var Trigger2 = AccordionTrigger;
var Content2 = AccordionContent;
//#endregion
export { DialogTitle as $, List as A, Portal2$1 as B, SelectScrollUpButton as C, SelectViewport as D, SelectValue as E, CheckboxItem2 as F, SubTrigger2 as G, Root2$3 as H, Content2$2 as I, DialogClose as J, Trigger$2 as K, Item2 as L, Trigger$1 as M, Switch as N, Root$1 as O, SwitchThumb as P, DialogPortal as Q, ItemIndicator2 as R, SelectScrollDownButton as S, SelectTrigger as T, Separator2 as U, RadioItem2 as V, SubContent2 as W, DialogDescription as X, DialogContent as Y, DialogOverlay as Z, SelectItem as _, Trigger2 as a, SelectLabel as b, Content2$1 as c, Portal2 as d, Slot$3 as et, Root2$1 as f, SelectIcon as g, SelectContent as h, Root2 as i, Root2$2 as j, Content$1 as k, Description2 as l, Select as m, Header as n, Action as o, Title2 as p, Dialog as q, Item as r, Cancel as s, Content2 as t, Overlay2 as u, SelectItemIndicator as v, SelectSeparator as w, SelectPortal as x, SelectItemText as y, Label2 as z };
