import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

// GA4 Measurement ID
const GA_MEASUREMENT_ID = "G-G5YQ1Y5ZPQ"; // Exemplo, deve ser substituído pelo real se disponível

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const initGA = () => {
  if (typeof window === "undefined" || window.gtag) return;

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement("script");
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      send_page_view: false // Manual pageview tracking
    });
  `;
  document.head.appendChild(script2);
};

export const trackPageView = (path: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
    });
  }
};

export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

// Hook to capture UTMs and store them for the session
export const useUTMTracker = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utms: Record<string, string> = {};
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    
    let hasUTM = false;
    keys.forEach(key => {
      const val = params.get(key);
      if (val) {
        utms[key] = val;
        hasUTM = true;
      }
    });

    if (hasUTM) {
      sessionStorage.setItem("taro_utms", JSON.stringify(utms));
    }
  }, []);
};

// Helper to get UTMs for links
export const getUTMParams = () => {
  try {
    const stored = sessionStorage.getItem("taro_utms");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const appendUTMsToUrl = (url: string) => {
  const utms = getUTMParams();
  if (Object.keys(utms).length === 0) return url;
  
  const [base, search] = url.split("?");
  const params = new URLSearchParams(search || "");
  Object.entries(utms).forEach(([key, val]) => {
    if (!params.has(key)) params.append(key, val as string);
  });
  
  return `${base}?${params.toString()}`;
};
