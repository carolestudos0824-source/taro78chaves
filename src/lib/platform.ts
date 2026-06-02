/**
 * Platform detection + payment policy gating.
 *
 * App Android consumption-only, sem venda interna e sem indução a checkout externo.
 *
 * The web build keeps Stripe checkout enabled.
 */

declare global {
  interface Window {
    __IS_ANDROID_APP__?: boolean;
    Capacitor?: any;
  }
}

export const isAndroidApp = (): boolean => {
  if (typeof window === "undefined") return false;
  
  // 1. URL Parameter check (for TWA start_url: ?android_app=1)
  const params = new URLSearchParams(window.location.search);
  if (params.get("android_app") === "1") {
    try {
      localStorage.setItem("platform.isAndroidApp", "1");
    } catch (e) {}
    return true;
  }

  // 2. Global window flag (injected by Capacitor/WebView)
  if (window.__IS_ANDROID_APP__ === true || !!window.Capacitor) return true;

  // 3. Persisted flag (to maintain state after navigation)
  try {
    if (localStorage.getItem("platform.isAndroidApp") === "1") return true;
  } catch {
    /* ignore */
  }
  return false;
};

/** Whether external (Stripe) checkout for digital content is allowed in this build. */
export const isWebCheckoutAllowed = (): boolean => !isAndroidApp();

export const STRIPE_BLOCKED_ANDROID_MSG = "Este conteúdo está disponível para contas com acesso ativo.";

export const platformLabel = (): "android" | "web" => (isAndroidApp() ? "android" : "web");
