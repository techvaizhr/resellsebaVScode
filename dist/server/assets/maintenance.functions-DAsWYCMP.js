import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { t as createServerRpc } from "./createServerRpc-BQTLusYf.js";
import { t as requireSupabaseAuth } from "./auth-middleware-XRMpJ1R8.js";
//#region src/lib/maintenance.functions.ts?tss-serverfn-split
function normalise(rows) {
	if (!Array.isArray(rows)) return [];
	return rows.map((r) => ({
		key: String(r.key),
		rows: Number(r.rows ?? 0)
	}));
}
/** How many junk rows are currently sitting in the database. */
var cleanupStats_createServerFn_handler = createServerRpc({
	id: "9206c2c485c931b124bb366ad679dd49c7bf9890ecb6f6df5ad02c908be2c810",
	name: "cleanupStats",
	filename: "src/lib/maintenance.functions.ts"
}, (opts) => cleanupStats.__executeServer(opts));
var cleanupStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(cleanupStats_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.rpc("cleanup_counts");
	if (error) throw new Response(error.message, { status: 400 });
	return normalise(data);
});
var runCleanup_createServerFn_handler = createServerRpc({
	id: "68042aec30d5ed0b48916e0d1225d252ef3cba70b07e0d29d468d44d8d5f9d3b",
	name: "runCleanup",
	filename: "src/lib/maintenance.functions.ts"
}, (opts) => runCleanup.__executeServer(opts));
var runCleanup = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(runCleanup_createServerFn_handler, async ({ data, context }) => {
	const { data: rows, error } = await context.supabase.rpc("cleanup_purge", { _keys: data.keys ?? [] });
	if (error) throw new Response(error.message, { status: 400 });
	return normalise(rows);
});
//#endregion
export { cleanupStats_createServerFn_handler, runCleanup_createServerFn_handler };
