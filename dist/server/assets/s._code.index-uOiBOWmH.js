import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/s.$code.index.tsx
var $$splitComponentImporter = () => import("./s._code.index-B54ij7n5.js");
var Route = createFileRoute("/s/$code/")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (s) => ({
		q: typeof s.q === "string" && s.q ? s.q : void 0,
		theme: typeof s.theme === "string" && s.theme ? s.theme : void 0,
		palette: typeof s.palette === "string" && s.palette ? s.palette : void 0
	})
});
//#endregion
export { Route as t };
