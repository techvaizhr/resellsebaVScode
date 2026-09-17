import { createFileRoute } from "@tanstack/react-router";
import { RiderFollowupView } from "@/components/rider-followup";

export const Route = createFileRoute("/_authenticated/reseller/rider-followup")({
  component: () => <RiderFollowupView role="reseller" />,
  head: () => ({
    meta: [
      { title: "Rider Followup — Reseller panel" },
      {
        name: "description",
        content: "Your orders that are with a delivery rider right now, with waiting time and COD amount.",
      },
      { property: "og:title", content: "Rider Followup — Reseller panel" },
      { property: "og:description", content: "Follow rider-assigned parcels of your store." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
