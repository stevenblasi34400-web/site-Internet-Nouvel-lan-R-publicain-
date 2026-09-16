import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./session";

export const authMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const session = await getSession();
  if (!session.isAuthenticated) {
    throw new Error("Non autorisé — connexion requise");
  }
  return next({ context: { session } });
});
