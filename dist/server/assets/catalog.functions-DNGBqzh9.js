import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { s as createSsrRpc } from "./client-KjQ-na90.js";
//#region src/lib/catalog.functions.ts
/** Public master catalog — active products only, no cost/profit leak beyond reseller price. */
var getCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("2a45d9b79d4ba9547992f1eac18039c2bae0ddf7df7670a8638b3bf5e0a6962f"));
var getCatalogProduct = createServerFn({ method: "GET" }).validator((d) => ({ slug: String(d.slug) })).handler(createSsrRpc("007261ee9d86e87592cfcd5491f56565cca84574c79db98974ab1951a1437f9d"));
//#endregion
export { getCatalogProduct as n, getCatalog as t };
