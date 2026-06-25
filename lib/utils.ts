import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffSec  = Math.floor((now.getTime() - d.getTime()) / 1000);
  const diffMin  = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay  = Math.floor(diffHour / 24);

  if (diffSec  < 60) return 'just now';
  if (diffMin  < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay  < 30) return `${diffDay}d ago`;
  return formatDate(date);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch { return false; }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trimEnd() + '…';
}

export function escapeCsvValue(value: unknown): string {
  if (value === undefined || value === null) return '';
  const str = Array.isArray(value) ? value.join('; ') : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toSnakeCase(label: string): string {
  return label.trim().toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
}

export function generateUniqueFieldId(label: string, existingIds: string[]): string {
  const base = toSnakeCase(label) || 'field';
  if (!existingIds.includes(base)) return base;
  let counter = 2;
  while (existingIds.includes(`${base}_${counter}`)) counter++;
  return `${base}_${counter}`;
}

export function getFormUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${base}/f/${slug}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}