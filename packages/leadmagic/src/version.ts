declare const __LEADMAGIC_VERSION__: string | undefined;

/** Replaced with the package.json version at build time (tsdown and vitest `define`). */
export const VERSION: string =
  typeof __LEADMAGIC_VERSION__ === "string"
    ? __LEADMAGIC_VERSION__
    : "0.0.0-dev";
