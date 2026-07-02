import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);
console.log('Properties:', Object.keys(pdf));
if (typeof pdf === 'function') {
  console.log('It is a function');
} else if (pdf && typeof pdf.default === 'function') {
  console.log('It has a default function');
}
