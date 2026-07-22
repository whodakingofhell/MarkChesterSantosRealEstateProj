// Input sanitization utilities

// Sanitize string for safe display
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

// Sanitize for Discord webhook (prevent mentions and code injection)
export function sanitizeForDiscord(input: string): string {
  return input
    .replace(/@/g, '\u200B@') // Zero-width space before @
    .replace(/`/g, '`\u200B') // Zero-width space after `
    .replace(/\n{3,}/g, '\n\n') // Collapse triple newlines
    .substring(0, 1000); // Truncate to safe length
}

// Sanitize for email HTML
export function sanitizeForEmailHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return input.replace(/[&<>"']/g, char => map[char] || char);
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/_{2,}/g, '_') // Collapse multiple underscores
    .substring(0, 255); // Limit length
}

// Sanitize URL
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.toString();
  } catch {
    return '';
  }
}

// Sanitize phone number
export function sanitizePhone(phone: string): string {
  return phone
    .replace(/[^0-9+\-() ]/g, '') // Keep only valid chars
    .trim();
}

// Sanitize email
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim();
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
}

// Strip HTML tags
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Check for SQL injection patterns
export function containsSqlInjection(input: string): boolean {
  const patterns = [
    /union.*select/i,
    /insert.*into/i,
    /delete.*from/i,
    /drop.*table/i,
    /update.*set/i,
    /exec.*\(/i,
    /execute.*\(/i,
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

// Check for XSS patterns
export function containsXss(input: string): boolean {
  const patterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

// Check for suspicious patterns
export function containsSuspiciousPatterns(input: string): boolean {
  return containsSqlInjection(input) || containsXss(input);
}
