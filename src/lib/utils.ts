import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function detectExtensionMode(): string {
  const url = window.location.href;

  if (url.includes("popup.html")) {
    return "popup";
  }

  if (url.includes("connect.html")) {
    return "fullscreen";
  }

  if (window.innerWidth < 800 && window.innerHeight < 600) {
    return "likely_popup";
  }

  return "unknown";
}
