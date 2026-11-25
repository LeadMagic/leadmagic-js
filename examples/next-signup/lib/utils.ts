/** Joins class names; the example has no tailwind-merge to keep dependencies small. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
