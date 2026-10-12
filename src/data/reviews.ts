import { reviews } from "../assets/opinie/reviews.json";

export interface Opinion {
  alias: string;
  desc: string;
}

// Google appends an English machine translation to each comment – show only the original.
const TRANSLATION_MARKER = "(Translated by Google)";
const originalText = (comment: string) =>
  comment.split(TRANSLATION_MARKER)[0].trim();

/** Reviews from the Google Business Profile export, newest first. */
export const opinions: Opinion[] = reviews
  .filter((r) => r.comment?.trim()) // rating-only reviews have nothing to show
  .sort((a, b) => b.createTime.localeCompare(a.createTime))
  .map((r) => ({
    alias: r.reviewer.displayName,
    desc: originalText(r.comment),
  }));
