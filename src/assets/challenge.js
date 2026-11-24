import { trackGa4Event } from './analytics.js';

// Match the KGS23 code format and course order used by the game.
const courseNames = [
  'Practice Slope',
  'Speed Run',
  'Tight Slalom',
  'Pine Run',
  'Ghost Summit',
  'Boulder Field',
  'Wildlife Run',
  'Switchback Ridge',
  'Ice Run',
  'Night Run',
];

const ranges = {
  v: [23, 23],
  c: [0, courseNames.length - 1],
  l: [1, 9999],
  s: [0, 0xffffffff],
  p: [0, 500000],
  g: [0, 30],
  f: [0, 1],
};

function decodeChallenge(code) {
  const match = /^KGS23-([A-Za-z0-9_-]{20,700})$/.exec(code);
  if (!match || match[0] !== code) return;

  const base64 = match[1].replaceAll('-', '+').replaceAll('_', '/');
  let challenge;
  try {
    challenge = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')));
  } catch {
    return;
  }
  if (challenge === null || typeof challenge !== 'object') return;

  for (const [key, [min, max]] of Object.entries(ranges)) {
    const value = challenge[key];
    if (!Number.isInteger(value) || value < min || value > max) return;
  }
  const requiredGates = challenge.l <= 3 ? 24 : challenge.l <= 6 ? 26 : 28;
  if (challenge.f === 1 && challenge.g < requiredGates) return;
  return challenge;
}

function showChallenge(codes) {
  const details = document.querySelector('#challenge-details');
  const challenge = codes.length === 1 ? decodeChallenge(codes[0]) : undefined;
  if (challenge) {
    const [code] = codes;
    const { c: course, l: level, p: score } = challenge;
    const levelLabel = level <= 10 ? `Level ${level}` : `Expert ${level - 10}`;
    details.textContent = `Beat ${score} points on ${courseNames[course]} · ${levelLabel} · Same layout`;
    document.querySelector('#open-app').addEventListener('click', () => {
      // Keep the deep link out of the markup so GA4 cannot collect it as an outbound link.
      try {
        trackGa4Event('challenge_open_app_clicked');
      } finally {
        location.href = `keithski://challenge?c=${encodeURIComponent(code)}`;
      }
    });

    const codeField = document.querySelector('#challenge-copy');
    const feedback = document.querySelector('#copy-feedback');
    codeField.value = code;
    document.querySelector('#copy-code').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        codeField.focus();
        codeField.select();
        feedback.textContent = 'Copy the selected code and paste it into Play a Friend’s Challenge.';
        return;
      }
      feedback.textContent = 'Copied. Paste into Play a Friend’s Challenge.';
      trackGa4Event('challenge_code_copied');
    });
    document.querySelector('#challenge-actions').hidden = false;
  } else {
    document.querySelector('#challenge-title').textContent = 'Challenge unavailable';
    details.textContent = 'This challenge link is incomplete or uses another version of the game. Ask your friend for a fresh link.';
  }
  document.querySelector('#friend-challenge').hidden = false;
  if (challenge) trackGa4Event('challenge_preview_opened');
}

const codes = new URLSearchParams(location.search).getAll('challenge');
if (codes.length) showChallenge(codes);
