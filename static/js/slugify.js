/**
 * Custom slugifier that copies the logic of Django's built-in one.
 * 
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
  // Convert to lowercase
  value = value.toLowerCase();

  // Remove characters that aren't alphanumerics, underscores, hyphens, or whitespace
  value = value.replace(/[^a-zA-Z0-9_\s\-]/g, "");

  // Replace any whitespace or repeated dashes with single dashes
  value = value.replace(/[\s-]+/g, "-");

  // Replace leading and trailing whitespace, dashes, and underscores
  value = value.trim();
  value = value.replace(/^-+|-+$/g, "");
  value = value.replace(/^_+|_+$/g, "");

  return value;
}
