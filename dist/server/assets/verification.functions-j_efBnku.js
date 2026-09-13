import { t as createServerFn } from "./createServerFn-BhXNZl1x.js";
import { s as createSsrRpc } from "./client-DdbbmuGT.js";
import { i as enumType, s as objectType } from "./types-CX4iBvKD.js";
import { t as requireSupabaseAuth } from "./auth-middleware-f2jdqIGt.js";
//#region src/lib/verification.functions.ts
/** Send a fresh 6-digit code to the signed-in user's email or phone. */
var sendVerificationCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ channel: enumType(["email", "sms"]) }).parse(d)).handler(createSsrRpc("0e5118af691349ef00122273a3f8e135bb8b024e71022d22ebc7d5586c787732"));
//#endregion
export { sendVerificationCode as t };
