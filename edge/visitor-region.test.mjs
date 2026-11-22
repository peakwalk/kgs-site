import assert from 'node:assert/strict';
import test from 'node:test';
import handler from './visitor-region.mjs';

const url = 'https://keithski.eaxmarketplace.com/_visitor-region';

function probe(cf, options = {}) {
  const request = new Request(options.url ?? url, options);
  if (cf) Object.defineProperty(request, 'cf', { value: cf });
  return handler.fetch(request);
}

test('European visitors are excluded even if the provider omits the EU flag', async () => {
  for (const country of ['DE', 'FR', 'GR', 'IE', 'SE']) {
    assert.deepEqual(await probe({ country }).json(), { region: 'eu' });
  }
  assert.deepEqual(await probe({ country: 'US', isEUCountry: '1' }).json(), { region: 'eu' });
});

test('known non-EU countries receive an uncached region response without a cookie', async () => {
  for (const country of ['US', 'GB', 'JP']) {
    const response = probe({ country });
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('set-cookie'), null);
    assert.deepEqual(await response.json(), { region: 'outside-eu' });
  }
});

test('missing, unresolved or malformed country data cannot enable analytics', async () => {
  for (const cf of [undefined, {}, ...['XX', 'ZZ', 'T1', 'EU', 'AA', 'US\n', 1].map(country => ({ country }))]) {
    assert.deepEqual(await probe(cf).json(), { region: 'unknown' });
  }
  const response = probe(undefined, {
    url: url + '?country=US',
    headers: { 'CF-IPCountry': 'US' },
  });
  assert.deepEqual(await response.json(), { region: 'unknown' });
});

test('the handler only serves the region GET path', () => {
  assert.equal(probe({ country: 'US' }, { url: url + '/other' }).status, 404);
  assert.equal(probe({ country: 'US' }, { method: 'POST' }).status, 405);
});
