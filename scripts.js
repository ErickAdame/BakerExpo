const actionLinks = document.querySelectorAll('.actions__link');
const modalMessage = "We're baking up something great here, come back soon";
let lastTrigger = null;

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
  if (event.key === 'Escape' && modal?.classList.contains('modal--visible')) {
    hideModal();
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
