/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test as it, expect } from './pageTest';

it('should fail page.textContent in strict mode', async ({ page }) => {
  await page.setContent(`<span>span1</span><div><span>target</span></div>`);
  const error = await page.textContent('span', { strict: true }).catch(e => e);
  expect(error.message).toContain('strict mode violation');
  expect(error.message).toContain('1) <span>span1</span> aka playwright.$("text=span1")');
  expect(error.message).toContain('2) <span>target</span> aka playwright.$("text=target")');
});

it('should fail page.getAttribute in strict mode', async ({ page }) => {
  await page.setContent(`<span>span1</span><div><span>target</span></div>`);
  const error = await page.getAttribute('span', 'id', { strict: true }).catch(e => e);
  expect(error.message).toContain('strict mode violation');
});

it('should fail page.fill in strict mode', async ({ page }) => {
  await page.setContent(`<input></input><div><input></input></div>`);
  const error = await page.fill('input', 'text', { strict: true }).catch(e => e);
  expect(error.message).toContain('strict mode violation');
  expect(error.message).toContain('1) <input/> aka playwright.$("input >> nth=0")');
  expect(error.message).toContain('2) <input/> aka playwright.$("div input")');
});

it('should fail page.$ in strict mode', async ({ page }) => {
  await page.setContent(`<span>span1</span><div><span>target</span></div>`);
  const error = await page.$('span', { strict: true }).catch(e => e);
  expect(error.message).toContain('strict mode violation');
});

it('should fail page.waitForSelector in strict mode', async ({ page }) => {
  await page.setContent(`<span>span1</span><div><span>target</span></div>`);
  const error = await page.waitForSelector('span', { strict: true }).catch(e => e);
  expect(error.message).toContain('strict mode violation');
});

it('should fail page.dispatchEvent in strict mode', async ({ page }) => {
  await page.setContent(`<span></span><div><span></span></div>`);
  const error = await page.dispatchEvent('span', 'click', {}, { strict: true }).catch(e => e);
  expect(error.message).toContain('strict mode violation');
  expect(error.message).toContain('1) <span></span> aka playwright.$("span >> nth=0")');
  expect(error.message).toContain('2) <span></span> aka playwright.$("div span")');
});

it('should properly format :nth-child() in strict mode message', async ({ page }) => {
  await page.setContent(`
  <div>
    <div>
    </div>
    <div>
      <div>
      </div>
      <div>
      </div>
    </div>
  </div>
  <div>
    <div class='foo'>
    </div>
    <div class='foo'>
    </div>
  </div>
  `);
  const error = await page.locator('.foo').hover().catch(e => e);
  expect(error.message).toContain('strict mode violation');
  // Second div has body > div:nth-child(2) > div:nth-child(2) selector which would be ambiguous
  // if '>' were ' '.
  expect(error.message).toContain('body > div:nth-child(2) > div:nth-child(2)');
});
