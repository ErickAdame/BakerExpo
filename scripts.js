const actionLinks = document.querySelectorAll('.actions__link');
const menuToggle = document.querySelector('.menu-toggle');
const siteMenu = document.querySelector('.site-menu');
const deepLinkAnchors = document.querySelectorAll('[data-app-scheme]');
const modalMessage = "We're baking up something great here, come back soon";
let lastTrigger = null;

const isMobileDevice = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const launchDeepLink = (appUrl, fallbackUrl) => {
  const launchTime = Date.now();
  const fallbackDelay = 850;
  let fallbackTimer;

  const cleanup = () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', cleanup);
    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      cleanup();
    }
  };

  fallbackTimer = setTimeout(() => {
    if (Date.now() - launchTime < fallbackDelay + 200) {
      window.location.href = fallbackUrl;
    }
    cleanup();
  }, fallbackDelay);

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', cleanup, { once: true });

  window.location.href = appUrl;
};

deepLinkAnchors.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const appScheme = anchor.dataset.appScheme;
    if (!appScheme || !isMobileDevice()) {
      return;
    }

    event.preventDefault();
    launchDeepLink(appScheme, anchor.href);
  });
});

const closeMenu = () => {
  if (!menuToggle || !siteMenu) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  siteMenu.classList.remove('site-menu--open');
  siteMenu.setAttribute('aria-hidden', 'true');
};

const openMenu = () => {
  if (!menuToggle || !siteMenu) return;
  menuToggle.setAttribute('aria-expanded', 'true');
  siteMenu.classList.add('site-menu--open');
  siteMenu.setAttribute('aria-hidden', 'false');
  const firstLink = siteMenu.querySelector('a');
  firstLink?.focus();
};

menuToggle?.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (isExpanded) {
    closeMenu();
  } else {
    openMenu();
  }
});

document.addEventListener('click', (event) => {
  if (!menuToggle || !siteMenu) return;
  const target = event.target;
  if (
    menuToggle.getAttribute('aria-expanded') === 'true' &&
    target instanceof Node &&
    !siteMenu.contains(target) &&
    !menuToggle.contains(target)
  ) {
    closeMenu();
  }
});

const modalMarkup = `
  <div class="modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="placeholder-modal-message">
    <div class="modal__dialog">
      <p class="modal__message" id="placeholder-modal-message">${modalMessage}</p>
      <button type="button" class="modal__close" aria-label="Close message">Got it</button>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalMarkup);

const modal = document.querySelector('.modal');
const modalCloseButton = modal?.querySelector('.modal__close');

const hideModal = () => {
  if (!modal) return;
  modal.classList.remove('modal--visible');
  modal.setAttribute('aria-hidden', 'true');
  if (lastTrigger instanceof HTMLElement) {
    lastTrigger.focus();
    lastTrigger = null;
  }
};

const showModal = () => {
  if (!modal || !modalCloseButton) return;
  modal.classList.add('modal--visible');
  modal.setAttribute('aria-hidden', 'false');
  modalCloseButton.focus();
};

modalCloseButton?.addEventListener('click', hideModal);

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (modal?.classList.contains('modal--visible')) {
      hideModal();
    }
    if (menuToggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuToggle.focus();
    }
  }
});

actionLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const label = target.textContent?.trim() ?? 'Expo action';

    console.info(`Action clicked: ${label}`);

    if (target instanceof HTMLAnchorElement && target.getAttribute('href')?.startsWith('#')) {
      event.preventDefault();
      lastTrigger = target;
      showModal();
    }
  });
});
