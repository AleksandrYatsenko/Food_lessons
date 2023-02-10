function modal() {
  const modal = document.querySelector('.modal'),
        modalActiv = document.querySelectorAll('[data-modal]');
        // modalClose = modal.querySelector('[data-close]');

  const openModal = function() {
    // modal.style.display = 'block';
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  };
  const closeModal = function() {
    // modal.style.display = 'none';
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };

  modalActiv.forEach(item => {
    item.addEventListener('click', openModal);
  });

  modal.addEventListener('click', (e) => {
    if(e.target === modal || e.target.getAttribute('data-close') == "") {
      closeModal();
    }
  });

  modal.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    // closeModal();
  });

  // ---------- close modal by key (Escape) --------------
  document.addEventListener('keydown', (e) => {
    if(e.code == 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // -------------- open modal after 50 sec ----------
  const modalTimerId = setTimeout(openModal, 50000);

  // ------------ open modal by scroll down ----------------
  function showModalByScroll () {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  };

  window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;