'use strict';
document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------- Tabs ----------------------------------

  const tabHeaders = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsHeadParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      // item.style.display = 'none';
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });
    tabHeaders.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabHeaders[i].classList.add('tabheader__item_active');
  }
  hideTabContent();
  showTabContent();

  tabsHeadParent.addEventListener('click', (e) => {
    if(e.target && e.target.classList.contains('tabheader__item')) {
      tabHeaders.forEach((item, i) => {
        if(e.target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // ----------------------- Timer ------------------------------

  const deadline = '2022-11-25';

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
          days = Math.floor(t / (1000 * 60 * 60 * 24)),
          hours = Math.floor((t / (1000 * 60 * 60)) % 24),
          minutes = Math.floor((t / (1000 * 60)) % 60),
          seconds = Math.floor((t / 1000) % 60);
    return {
      'total': t,
      days,
      hours,
      minutes,
      seconds
    };
  }

  function getZero (num) {
    if(num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);
    
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);
      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if(t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadline);

  // ------------------------- Modal -----------------------------------

  const modal = document.querySelector('.modal'),
        modalActiv = document.querySelectorAll('[data-modal]'),
        modalClose = modal.querySelector('[data-close]');

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
    if(e.target.classList.contains('modal') || e.target == modalClose) {
      closeModal();
    }
  });

  modal.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
  });

  // ---------- close modal by key (Escape) --------------
  document.addEventListener('keydown', (e) => {
    if(e.code == 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // -------------- open modal after 5 sec ----------
  const modalTimerId = setTimeout(openModal, 5000);

  // ------------ open modal by scroll down ----------------
  function showModalByScroll () {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  };

  window.addEventListener('scroll', showModalByScroll);

});