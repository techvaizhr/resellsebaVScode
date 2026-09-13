import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/login",
      search: { mode: "signup", ...(search as Record<string, unknown>) },
    });
  },
});

