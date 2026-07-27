/**
 * Shared field validation helpers.
 *
 * These run in the Studio while the author types. Returning a STRING blocks
 * Publish (Rule.warning() would only advise), which is deliberate: the site's
 * editor is non-technical, so the validation message is the teaching moment.
 */

/**
 * Generic link text that tells a screen-reader user nothing about where the
 * link goes. WCAG 2.4.4 (Link Purpose): these links are not inside a list
 * item, article, or sentence that supplies context, so the label is the ONLY
 * thing announced — "Learn more" is a Level A failure here, not a nicety.
 */
const VAGUE_LABELS = [
  "click here",
  "here",
  "read more",
  "learn more",
  "more",
  "more info",
  "more information",
  "details",
  "link",
  "view",
  "submit",
  "go",
];

/**
 * Validator for a call-to-action link label.
 *
 * @param conflicting Labels already used ELSEWHERE on the site for a
 *   DIFFERENT destination. Reusing one here would give two links the same
 *   name and different targets (WCAG 3.2.4 Consistent Identification) — e.g.
 *   naming the /about button "Contact" when the nav and footer already point
 *   "Contact" at /contact.
 */
export function descriptiveLinkLabel(conflicting: string[] = []) {
  return (value: unknown): true | string => {
    // Empty is allowed — a blank field falls back to the shipped default.
    if (typeof value !== "string" || !value.trim()) return true;
    const label = value.trim();
    const lower = label.toLowerCase();

    if (/^https?:\/\//i.test(label)) {
      return "Link text should describe the destination in words, not be a URL.";
    }

    // Exact match OR leading phrase — "Click here to learn about the firm"
    // is as unhelpful as "Click here".
    const vague = VAGUE_LABELS.find(
      (p) => lower === p || lower.startsWith(p + " "),
    );
    if (vague) {
      return `Link text must describe where the link goes. “${label}” tells a screen-reader user nothing — say something like “About the Firm” instead.`;
    }

    const clash = conflicting.find((c) => c.toLowerCase() === lower);
    if (clash) {
      return `“${clash}” is already used elsewhere on the site for a different page. Two links with the same name that go to different places are confusing — please pick a distinct label.`;
    }

    return true;
  };
}
