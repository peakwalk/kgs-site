const productionOrigin = 'https://keithski.eaxmarketplace.com';
const measurementId = 'G-0NGL92QQ2Y';

function analyticsUrl(value) {
  if (!value) return '';

  const url = new URL(value);
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase() === 'challenge') url.searchParams.delete(key);
  }
  url.hash = '';
  return url.href;
}

if (location.origin === productionOrigin) {
  const dataLayer = window.dataLayer ||= [];
  window.gtag = function gtag() {
    dataLayer.push(arguments);
  };

  // Keep the challenge URL available to the game preview, but send clean URLs to GA4.
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: analyticsUrl(location.href),
    page_referrer: analyticsUrl(document.referrer),
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(script);
}
