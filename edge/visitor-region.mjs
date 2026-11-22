const euCountries = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU',
  'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
]);
const regionNames = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });
const nonCountryCodes = new Set(['EU', 'EZ', 'QO', 'UN', 'XA', 'XB', 'XX', 'ZZ']);

function visitorRegion(cf) {
  const country = cf?.country;
  if (cf?.isEUCountry === '1' || euCountries.has(country)) return 'eu';
  if (typeof country !== 'string' || country.length !== 2 || !/^[A-Z]{2}$/u.test(country) ||
      nonCountryCodes.has(country) || !regionNames.of(country)) {
    return 'unknown';
  }
  return 'outside-eu';
}

export default {
  fetch(request) {
    const headers = {
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    };
    if (new URL(request.url).pathname !== '/_visitor-region') {
      return new Response(null, { status: 404, headers });
    }
    if (request.method !== 'GET') {
      return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET' } });
    }
    // Cloudflare supplies this metadata. Client headers and URL parameters are ignored.
    return Response.json({ region: visitorRegion(request.cf) }, { headers });
  },
};
