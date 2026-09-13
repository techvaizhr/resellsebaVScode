//#region src/lib/notifications.server.ts
async function pickConfig(supabase, resellerId, channel) {
	if (resellerId) {
		const { data } = await supabase.from("notification_configs").select("*").eq("reseller_id", resellerId).eq("channel", channel).eq("is_active", true).maybeSingle();
		if (data) return data;
	}
	const { data } = await supabase.from("notification_configs").select("*").is("reseller_id", null).eq("channel", channel).eq("is_active", true).maybeSingle();
	return data ?? null;
}
async function sendSms(cfg, to, message) {
	const c = cfg.config || {};
	try {
		if (cfg.provider === "bulksmsbd") {
			const url = "http://bulksmsbd.net/api/smsapi";
			const params = new URLSearchParams({
				api_key: c.api_key || "",
				type: "text",
				number: to,
				senderid: c.sender_id || cfg.from_value || "",
				message
			});
			const res = await fetch(`${url}?${params.toString()}`);
			const text = await res.text();
			return {
				ok: res.ok,
				raw: text
			};
		}
		if (cfg.provider === "sslsms") {
			const res = await fetch("https://smsplus.sslwireless.com/api/v3/send-sms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					api_token: c.api_token,
					sid: c.sid,
					msisdn: to,
					sms: message,
					csms_id: `msg_${Date.now()}`
				})
			});
			const j = await res.json();
			return {
				ok: res.ok,
				raw: j
			};
		}
		return {
			ok: false,
			error: `Unsupported provider: ${cfg.provider}`
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : String(e)
		};
	}
}
async function sendEmail(cfg, to, subject, html) {
	const c = cfg.config || {};
	try {
		if (cfg.provider === "resend") {
			const res = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${c.api_key || ""}`
				},
				body: JSON.stringify({
					from: `${cfg.from_name || "Store"} <${cfg.from_value || "onboarding@resend.dev"}>`,
					to: [to],
					subject,
					html
				})
			});
			const j = await res.json();
			return {
				ok: res.ok,
				raw: j
			};
		}
		return {
			ok: false,
			error: `Unsupported provider: ${cfg.provider}`
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : String(e)
		};
	}
}
//#endregion
export { pickConfig, sendEmail, sendSms };
