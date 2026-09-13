import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { s as createSsrRpc } from "./client-BpJCBCUq.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D4xjf72S.js";
import { z } from "zod";
//#region src/lib/verification.functions.ts
/** Send a fresh 6-digit code to the signed-in user's email or phone. */
var sendVerificationCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ channel: z.enum(["email", "sms"]) }).parse(d)).handler(createSsrRpc("0e5118af691349ef00122273a3f8e135bb8b024e71022d22ebc7d5586c787732"));
//#endregion
export { sendVerificationCode as t };
