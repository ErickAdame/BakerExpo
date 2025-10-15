const actionLinks = document.querySelectorAll('.actions__link');

actionLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = event.currentTarget;
    const label = target.textContent?.trim() ?? 'Expo action';

    console.info(`Action clicked: ${label}`);
  });
});
