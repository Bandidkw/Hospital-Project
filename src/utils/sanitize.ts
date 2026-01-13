import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * @param dirty - The potentially unsafe HTML string.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ADD_TAGS: ['iframe'], // Allow iframes for Google Maps (needs careful validation if content is user-generated)
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'], // Attributes for iframes
  })
}
