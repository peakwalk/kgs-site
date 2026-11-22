import { countryRegion } from '../src/assets/visitor-region.mjs';

function visitorRegion(cf) {
  return cf?.isEUCountry === '1' ? 'eu' : countryRegion(cf?.country);
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
