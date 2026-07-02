import { PDFParse } from 'pdf-parse';
import fs from 'fs';

async function test() {
  const parser = new PDFParse({ data: Buffer.from('dummy') });
  console.log('PDFParse initialized');
}
test().catch(console.error);
