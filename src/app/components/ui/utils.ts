import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filter out Figma-specific props that might be injected by the Figma Inspector
 * to prevent React warnings on DOM elements.
 */
export function filterFigmaProps<T extends Record<string, any>>(props: T): T {
  const filtered: Record<string, any> = {};
  for (const key in props) {
    if (!key.startsWith("_fg")) {
      filtered[key] = props[key];
    }
  }
  return filtered as T;
}
