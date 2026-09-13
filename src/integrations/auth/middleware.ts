import { redirect } from "@tanstack/react-router";
import { isAuthenticated } from "./token";

export async function beforeLoadAuth({ location }: { location: { pathname: string } }) {
  if (!isAuthenticated()) {
    throw redirect({
      to: "/login",
      search: { redirect: location.pathname },
    });
  }
}
