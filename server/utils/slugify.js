import { query } from "../config/database.js";
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


export async function generateUniqueSlug(baseSlug) {
 
  const existing = await query('SELECT slug FROM products WHERE slug = $1', [baseSlug]);
  
  if (existing.rows.length === 0) {
    return baseSlug;
  }

  
  let counter = 1;
  let newSlug = `${baseSlug}-${counter}`;
  
  while (true) {
    const check = await query('SELECT slug FROM products WHERE slug = $1', [newSlug]);
    if (check.rows.length === 0) {
      return newSlug;
    }
    counter++;
    newSlug = `${baseSlug}-${counter}`;
  }
}