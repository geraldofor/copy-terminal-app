export type CopyLineKind = "heading" | "sub" | "bullet" | "divider" | "text";

export interface CopyLine {
  kind: CopyLineKind;
  text: string;
}

/**
 * Parse generated copy text into typed lines for styled rendering.
 * Marker syntax produced by the templates in copy-templates.ts:
 *   "## ..."  section heading
 *   "# ..."   sub heading (unused by templates, kept for future use)
 *   "- ..."   bullet
 *   "---"     divider
 *   ""        spacing (skipped)
 *   anything  paragraph
 *
 * Because parsing is line-oriented, a partially typed suffix (typewriter)
 * degrades gracefully into a plain "text" line.
 */
export function parseCopyText(text: string): CopyLine[] {
  const lines: CopyLine[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (line === "") continue;
    if (line.startsWith("## ")) {
      lines.push({ kind: "heading", text: line.slice(3).trim() });
    } else if (line.startsWith("# ")) {
      lines.push({ kind: "sub", text: line.slice(2).trim() });
    } else if (line.startsWith("- ")) {
      lines.push({ kind: "bullet", text: line.slice(2).trim() });
    } else if (line.trim() === "---") {
      lines.push({ kind: "divider", text: "" });
    } else {
      lines.push({ kind: "text", text: line });
    }
  }
  return lines;
}
