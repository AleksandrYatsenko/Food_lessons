function openModal(modalSelector, modalTimerId) {
  const modal = document.querySelector(modalSelector);
  // modal.style.display = 'block';
  modal.classList.add('show');
  modal.classList.remove('hide');
  document.body.style.overflow = 'hidden';

  if(modalTimerId) {
    clearInterval(modalTimerId);
  } 
};

function closeModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  // modal.style.display = 'none';
  modal.classList.add('hide');
  modal.classList.remove('show');
  document.body.style.overflow = '';
};

function modal(triggerSelector, modalSelector, modalTimerId) {
  const modal = document.querySelector(modalSelector),
        modalActiv = document.querySelectorAll(triggerSelector);
        // modalClose = modal.querySelector('[data-close]');

  modalActiv.forEach(item => {
    item.addEventListener('click', () => openModal(modalSelector, modalTimerId));
  });

  modal.addEventListener('click', (e) => {
    if(e.target === modal || e.target.getAttribute('data-close') == "") {
      closeModal(modalSelector);
    }
  });

  // modal.querySelector('form').addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   // closeModal();
  // });

  // ---------- close modal by key (Escape) --------------
  document.addEventListener('keydown', (e) => {
    if(e.code == 'Escape' && modal.classList.contains('show')) {
      closeModal(modalSelector);
    }
  });

  // ------------ open modal by scroll down ----------------
  function showModalByScroll () {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal(modalSelector, modalTimerId);
      window.removeEventListener('scroll', showModalByScroll);
    }
  };

  window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {closeModal};
export {openModal};