// Catches typos in the guest's email domain ("gmial.com") before they pay —
// the receipt and booking confirmation go to that address. Safe to import
// in the browser.

// Providers guests commonly book with. A domain listed here is never
// "corrected", so real look-alikes (ymail.com, mail.com) are listed too.
const DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "yahoo.co.id",
  "yahoo.com.au",
  "yahoo.co.uk",
  "hotmail.co.uk",
  "bigpond.com",
  "googlemail.com",
  "ymail.com",
  "msn.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "mail.com",
  "email.com",
  "gmx.com",
  "gmx.de",
  "web.de",
  "qq.com",
  "naver.com",
];

/** Edit distance: insertions, deletions and substitutions. */
function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(
        above + 1,
        row[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return row[b.length];
}

/** "you@gmail.com" for "you@gmial.com"; null when nothing looks wrong. */
export function suggestEmail(email: string): string | null {
  const value = email.trim();
  const at = value.lastIndexOf("@");
  if (at < 1) return null;
  const domain = value.slice(at + 1).toLowerCase();
  if (domain.length < 3 || DOMAINS.includes(domain)) return null;

  // Short domains get less slack, or "me.co" would match half the list.
  const maxDistance = domain.length >= 8 ? 2 : 1;
  let best: string | null = null;
  let bestDistance = maxDistance + 1;
  for (const candidate of DOMAINS) {
    const d = distance(domain, candidate);
    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  }
  return best && `${value.slice(0, at)}@${best}`;
}

/** Same address, ignoring case and stray spaces. */
export function sameEmail(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
