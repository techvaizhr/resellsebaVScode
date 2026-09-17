import { createFileRoute } from "@tanstack/react-router";
import { RiderFollowupView } from "@/components/rider-followup";

export const Route = createFileRoute("/_authenticated/admin/rider-followup")({
  component: () => <RiderFollowupView role="admin" />,
  head: () => ({
    meta: [
      { title: "Rider Followup — Admin panel" },
      {
        name: "description",
        content: "Every parcel currently out with a delivery rider, with waiting time and COD amount.",
      },
      { property: "og:title", content: "Rider Followup — Admin panel" },
      { property: "og:description", content: "Track rider-assigned parcels and recheck courier status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
