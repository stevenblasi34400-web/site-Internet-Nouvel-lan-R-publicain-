// Reporte les erreurs capturées par les error boundaries React côté client.
// Hook générique : peut être branché plus tard vers un service de monitoring.
export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  if (typeof window.dispatchEvent === "function") {
    window.dispatchEvent(
      new CustomEvent("app-error", {
        detail: { message, stack, route: window.location.pathname, ...context },
      }),
    );
  }
}
