import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SoftProductBackground({ children }: { children: ReactNode }) {
  return <div className="merchant-console min-h-screen">{children}</div>;
}

export const brandGlassContainerClass = "console-brand";
export const lightProductHeroClass = "console-hero";
export const lightProductPanelClass = "console-panel";
export const publicSubtleSurfaceClass = lightProductPanelClass;
export const lightProductInsetPanelClass = "console-inset";
export const lightProductInputClass = "console-input";
export const lightProductSectionEyebrowClass = "console-eyebrow";
export const lightProductMutedTextClass = "console-muted text-sm leading-6";
export const lightProductCompactGhostButtonClass = "inline-flex console-button console-button-secondary";
export const lightProductGhostButtonClass = lightProductCompactGhostButtonClass;
export const lightProductCompactPrimaryButtonClass = "inline-flex console-button console-button-primary";
export const publicPrimaryButtonClass = lightProductCompactPrimaryButtonClass;
export const publicSecondaryButtonClass = lightProductCompactGhostButtonClass;
export const darkInputClass = lightProductInputClass;
export const darkInsetPanelClass = lightProductInsetPanelClass;

export function lightProductStatusPillClass(tone: "success" | "violet" | "muted" | "warning") {
  return `console-status console-status-${tone}`;
}

export function darkStatusPillClass(tone: "default" | "success" | "violet" | "muted") {
  return lightProductStatusPillClass(tone === "default" ? "muted" : tone);
}

export function lightProductNavItemClass(active: boolean) {
  return cn("flex console-nav-item", active && "console-nav-item-active");
}
