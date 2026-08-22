/* MentEducation shared navigation wiring.
   Keeps public destinations centralized while the legacy single-file React UI is refactored. */
window.MENTEDUCATION_ROUTES = Object.freeze({
  home: '/',
  about: '/about.html',
  pricing: '/pricing.html',
  safety: '/safety.html',
  help: '/help.html',
  guidelines: '/community-guidelines.html',
  contact: '/contact.html',
  privacy: '/privacy.html',
  wallet: '/wallet/',
  earnings: '/earnings/',
  ownerPayments: '/owner/payments/'
});

window.MentEducationNav = {
  go(route, fallback) {
    const target = window.MENTEDUCATION_ROUTES[route] || fallback;
    if (target) window.location.assign(target);
  },
  scroll(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
