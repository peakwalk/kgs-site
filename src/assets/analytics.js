import { countryRegion } from './visitor-region.mjs';

const productionOrigin = 'https://keithski.eaxmarketplace.com';
const countryEndpoint = 'https://api.country.is/';
const measurementId = 'G-0NGL92QQ2Y';
let analyticsEnabled = false;
const analyticsAllowed = location.origin === productionOrigin ? mayLoadAnalytics() : Promise.resolve(false);
const analyticsReady = analyticsAllowed.then((allowed) => {
  if (allowed) enableAnalytics();
});
document.getElementById('android-direct-download')?.addEventListener('click', () => {
  trackGa4Event('apk_download_clicked');
});

async function mayLoadAnalytics() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(countryEndpoint, {
      mode: 'cors',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      redirect: 'error',
      cache: 'no-store',
      signal: controller.signal,
    });
    return response.ok && countryRegion((await response.json())?.country) === 'outside-eu';
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function analyticsUrl(value) {
  if (!value) return '';

  const url = new URL(value);
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase() === 'challenge') url.searchParams.delete(key);
  }
  url.hash = '';
  return url.href;
}

function analyticsPageContext() {
  return {
    page_location: analyticsUrl(location.href),
    page_referrer: analyticsUrl(document.referrer),
  };
}

function recordGa4Event(eventName) {
  window.gtag('event', eventName, {
    send_to: measurementId,
    ...analyticsPageContext(),
  });
}

export function trackGa4Event(eventName) {
  if (analyticsEnabled) {
    recordGa4Event(eventName);
    return;
  }

  // Keep early interactions for verified non-EU visits while the region check is pending.
  void analyticsReady.then(() => {
    if (analyticsEnabled) recordGa4Event(eventName);
  });
}

function enableAnalytics() {
  const dataLayer = window.dataLayer ||= [];
  window.gtag = function gtag() {
    dataLayer.push(arguments);
  };

  // Keep the challenge URL available to the game preview, but send clean URLs to GA4.
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    ...analyticsPageContext(),
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.referrerPolicy = 'no-referrer';
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(script);
  analyticsEnabled = true;
}
