// Run from the shop repo: node scripts/check-categories.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function categories(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  runInNewContext(outputText, { exports, require: () => 0 }); // Mobile image imports aren't needed.
  return JSON.parse(JSON.stringify(exports.productCategories.map(({ label, sections }) => ({
    label,
    sections: sections.map(({ title, items }) => ({ title, items })),
  }))));
}

const shop = categories('../lib/productCategories.ts');
const customer = categories('../../snazzl-customer-main/src/constants/product-categories.ts');
assert.deepEqual(shop, customer, 'Shop categories must match the customer app');
assert.equal(shop[0].sections[0].items.length, 9);
console.log(`Category parity passed: ${shop.length} categories, ${shop.flatMap(c => c.sections).length} sections, ${shop.flatMap(c => c.sections.flatMap(s => s.items)).length} product types.`);
