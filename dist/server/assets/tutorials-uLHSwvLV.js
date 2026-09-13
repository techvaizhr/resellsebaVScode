import { r as supabase } from "./client-DdbbmuGT.js";
//#region src/lib/tutorials.ts
/** Extract the YouTube video id from watch / youtu.be / shorts / embed links. */
function youtubeId(url) {
	if (!url) return null;
	const v = url.trim();
	for (const p of [
		/[?&]v=([A-Za-z0-9_-]{6,})/,
		/youtu\.be\/([A-Za-z0-9_-]{6,})/,
		/\/shorts\/([A-Za-z0-9_-]{6,})/,
		/\/embed\/([A-Za-z0-9_-]{6,})/,
		/\/live\/([A-Za-z0-9_-]{6,})/
	]) {
		const m = v.match(p);
		if (m?.[1]) return m[1];
	}
	if (/^[A-Za-z0-9_-]{11}$/.test(v)) return v;
	return null;
}
function youtubeThumb(url, fallback) {
	const id = youtubeId(url);
	return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : fallback ?? null;
}
function youtubeEmbed(url) {
	const id = youtubeId(url);
	return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
}
function slugify(v) {
	return v.toLowerCase().trim().replace(/[^a-z0-9\u0980-\u09FF]+/g, "-").replace(/^-+|-+$/g, "") || `topic-${Date.now().toString(36)}`;
}
/** Topics + tutorials visible to the current viewer (RLS handles reseller-only). */
async function loadTutorialLibrary() {
	const [t, v] = await Promise.all([supabase.from("tutorial_topics").select("id,name,slug,description,sort_order,is_active").eq("is_active", true).order("sort_order").order("name"), supabase.from("tutorials").select("id,topic_id,title,details,youtube_url,thumbnail_url,duration_label,sort_order,is_active,reseller_only").eq("is_active", true).order("sort_order").order("created_at", { ascending: false })]);
	return {
		topics: t.data ?? [],
		tutorials: v.data ?? []
	};
}
//#endregion
export { youtubeThumb as a, youtubeId as i, slugify as n, youtubeEmbed as r, loadTutorialLibrary as t };
