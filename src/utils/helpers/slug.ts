export function generateSlug(title: string): string {
    const slug = title
        .normalize('NFD')                     // Split accented characters (e.g., 'é' -> 'e' + '´')
        .replace(/[\u0300-\u036f]/g, '')      // Remove the accent marks
        .toLowerCase()                        // Convert to lowercase
        .trim()                               // Remove whitespace from both ends
        .replace(/[^a-z0-9 -]/g, '')          // Remove invalid characters (keep only a-z, 0-9, space, and hyphen)
        .replace(/\s+/g, '-')                 // Replace space with -
        .replace(/-+/g, '-')                  // Replace multiple - with single -
        .replace(/^-+|-+$/g, '');             // Trim leading and trailing hyphens

    const uniqueId = crypto.randomUUID().slice(0, 8);
    if (slug.length === 0) {
        return uniqueId;
    }

    return `${slug}-${uniqueId}`;
}
