import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetFile = path.resolve(
  __dirname,
  "../node_modules/@tanstack/start-server-core/dist/esm/createStartHandler.js"
);

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, "utf8");
  const needle = "const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);";
  const replacement = `const _matchedRes = router.getMatchedRoutes(pathname);
\tconst matchedRoutes = Array.isArray(_matchedRes) ? _matchedRes : (_matchedRes?.matchedRoutes || []);
\tconst foundRoute = Array.isArray(_matchedRes) ? _matchedRes[_matchedRes.length - 1] : _matchedRes?.foundRoute;
\tconst routeParams = (Array.isArray(_matchedRes) ? {} : _matchedRes?.routeParams) || {};`;

  if (content.includes(needle)) {
    content = content.replace(needle, replacement);
    content = content.replace(
      "for (const route of matchedRoutes)",
      "for (const route of (matchedRoutes || []))"
    );
    fs.writeFileSync(targetFile, content, "utf8");
    console.log("Successfully patched @tanstack/start-server-core");
  }
}
