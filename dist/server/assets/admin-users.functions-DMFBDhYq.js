import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { i as createSsrRpc } from "./upload.functions-wdbBXhar.js";
import { l as stringType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CNexUu6x.js";
//#region src/lib/admin-users.functions.ts
var input = objectType({ userId: stringType().min(1) });
var confirmUserEmail = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(createSsrRpc("7a2fc6f207a5ff6162f1eb87faf4af12606a93357fe77592c73a780c9c7a3470"));
var listResellerEmailStatus = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d8291a8798f81d4da562d493e9e37a818e176a9a438b9e18f1603244e947944d"));
var deleteAuthUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(createSsrRpc("991da20e038601bf91e8fbcb431eb8700d1ebdfa16fdacef4672e69af0dc485c"));
/** Lists only admin/staff accounts (never resellers) with their assigned custom role. */
var listStaffUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("11f171b815abba951a9e9150a46ba78511c7bf9fac1f490e5c5aa41a9b84a5c1"));
//#endregion
export { listStaffUsers as i, deleteAuthUser as n, listResellerEmailStatus as r, confirmUserEmail as t };
