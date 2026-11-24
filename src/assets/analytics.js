import { countryRegion } from './visitor-region.mjs';

const productionOrigin = 'https://keithski.eaxmarketplace.com';
const countryEndpoint = 'https://api.country.is/';
const measurementId = 'G-0NGL92QQ2Y';
const openPanelEndpoint = 'https://openpanel.peakwalk.tech/api/track';
const openPanelClientId = 'f5b416c4-293f-41ea-a747-30530f49e0b8';
let analyticsEnabled = false;
const analyticsAllowed = location.origin === productionOrigin ? mayLoadAnalytics() : Promise.resolve(false);
const analyticsReady = analyticsAllowed.then((allowed) => {
  if (allowed) enableAnalytics();
});

document.getElementById('android-direct-download')?.addEventListener('click', trackApkDownloadClick);

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

function recordChallengeEvent(eventName) {
  window.gtag('event', eventName, {
    send_to: measurementId,
    ...analyticsPageContext(),
  });
}

export function trackChallengeEvent(eventName) {
  if (analyticsEnabled) {
    recordChallengeEvent(eventName);
    return;
  }

  // Keep early interactions for verified non-EU visits while the region check is pending.
  void analyticsReady.then(() => {
    if (analyticsEnabled) recordChallengeEvent(eventName);
  });
}

function trackApkDownloadClick() {
  void analyticsAllowed.then((allowed) => {
    if (!allowed) return;

    return fetch(openPanelEndpoint, {
      method: 'POST',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      redirect: 'error',
      keepalive: true,
      headers: {
        'content-type': 'application/json',
        'openpanel-client-id': openPanelClientId,
      },
      body: JSON.stringify({ type: 'track', payload: { name: 'apk_download_clicked', properties: {} } }),
    });
  }).catch(() => {
    // Analytics failures must not interrupt the download.
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
