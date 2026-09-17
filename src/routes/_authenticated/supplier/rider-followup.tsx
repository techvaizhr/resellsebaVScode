import { createFileRoute } from "@tanstack/react-router";
import { RiderFollowupView } from "@/components/rider-followup";

export const Route = createFileRoute("/_authenticated/supplier/rider-followup")({
  component: () => <RiderFollowupView role="supplier" />,
  head: () => ({
    meta: [
      { title: "Rider Followup — Supplier panel" },
      {
        name: "description",
        content: "Your products that are with a delivery rider right now, with waiting time.",
      },
      { property: "og:title", content: "Rider Followup — Supplier panel" },
      { property: "og:description", content: "Follow rider-assigned parcels containing your products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
