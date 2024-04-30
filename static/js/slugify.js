/**
 * Custom slugifier that copies the logic of Django's built-in one.
 *
 * @param {string} value
 * @returns {string}
 */
function slugify(value, allow_unicode = false) {
   // Convert to lowercase
   value = value.toLowerCase();

   // Normalize Unicode characters if allow_unicode is false
   if (!allow_unicode) {
     value = value.normalize('NFKD').replace(/[^\x00-\x7F]/g, "");
   }

   // Remove characters that aren't alphanumerics, underscores, hyphens, or whitespace
   value = value.replace(/[^a-zA-Z0-9_\s\-]/g, "");

   // Replace any whitespace or repeated dashes with single dashes
   value = value.replace(/[\s-]+/g, "-");

   // Replace leading and trailing dashes and underscores
   value = value.replace(/^-+|-+$/g, "");

   return value;
 }