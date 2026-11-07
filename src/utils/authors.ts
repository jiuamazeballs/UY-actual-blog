import { getCollection } from "astro:content";

let displayNameBySlug: Map<string, string> | null = null;

async function loadDisplayNames(): Promise<Map<string, string>> {
  if (!displayNameBySlug) {
    const entries = await getCollection("authors");
    // entry.id includes the file extension (e.g. "jiu.md") in this Astro
    // version's legacy content collections; entry.slug is the clean one.
    displayNameBySlug = new Map(entries.map((entry: any) => [entry.slug, entry.data.title]));
  }
  return displayNameBySlug;
}

function capitalize(slug: string): string {
  return slug
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Resolves an author slug (as stored in a post's `authors` frontmatter, e.g. "jiu")
// to its real display name from the authors collection (e.g. "Sweta Baruah"),
// falling back to a capitalized version of the slug if no author entry exists.
export async function getAuthorDisplayName(authorSlug: string): Promise<string> {
  const names = await loadDisplayNames();
  return names.get(authorSlug.toLowerCase()) ?? capitalize(authorSlug);
}
