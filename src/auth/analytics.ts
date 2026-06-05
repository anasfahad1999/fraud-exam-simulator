export async function logEvent(event: string, metadata: Record<string, unknown> = {}): Promise<void> {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ event, metadata, created_at: new Date().toISOString() }),
    });
  } catch {
    // لا نعطل تجربة المستخدم بسبب تعذر تسجيل حدث تحليلي.
  }
}
