/**
 * Formatting Utilities
 * Date, currency, and other formatting helpers
 */

/** Format a date string to Australian format */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-AU', options);
}

/** Format a date with time */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format relative time (e.g., "2 hours ago") */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(d);
}

/** Format currency (AUD) */
export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/** Format a number with commas */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-AU').format(num);
}

/** Format a phone number */
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Format based on length
  if (digits.length === 10) {
    // Mobile: 0400 000 000
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 8) {
    // Landline: 0000 0000
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  return phone;
}

/** Format NDIS number with spaces */
export function formatNdisNumber(ndisNumber: string): string {
  // Format as: 123 456 789
  const digits = ndisNumber.replace(/\D/g, '');
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return ndisNumber;
}

/** Calculate age from date of birth */
export function calculateAge(dateOfBirth: string | Date): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
