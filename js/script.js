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

  const deadline = '2022-12-25';

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
        days.innerHTML = "00";
        hours.innerHTML = "00";
        minutes.innerHTML = "00";
        seconds.innerHTML = "00";
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

  // ----------- Classes ------------------------

  class Card {
    constructor (img, alt, title, text, price, parentSelect, ...classes) {
      this.img = img;
      this.alt = alt;
      this.title = title;
      this.text = text;
      this.price = price;
      this.parent = document.querySelector(parentSelect);
      this.classes = classes;
    }
    makeCard() {
      const element = document.createElement('div');
      if(this.classes.length === 0) {
        this.classes = "menu__item";
        element.classList.add(this.classes);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      
      element.innerHTML =`
        <img src=${this.img} alt=${this.alt}>
        <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
        <div class="menu__item-descr">${this.text}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      this.parent.append(element);
    }
  }

  new Card("img/tabs/vegy.jpg", "vegy", "Фитнес", "Меню “Фитнес” - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!", "229", ".menu .container").makeCard();

  new Card("img/tabs/elite.jpg", "elite", "Премиум", "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!", "550", ".menu .container").makeCard();

  new Card("img/tabs/post.jpg", "post", "Постное", "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.", "430", ".menu .container").makeCard();

  // ------------------ Forms ---------------------

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'Загрузка',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach(item => {
    postData(item);
  });

  // function postData (form) {
  //   form.addEventListener('submit', (e) => {
  //     e.preventDefault();

  //     const statusMessage = document.createElement('div');
  //     statusMessage.classList.add('status');
  //     statusMessage.textContent = message.loading;
  //     form.append(statusMessage);

  //     const request = new XMLHttpRequest();
  //     request.open('POST', 'server.php');

  //     const formData = new FormData(form);

  //     request.send(formData);
  //     request.addEventListener('load', () => {
  //       if(request.status === 200) {
  //         console.log(request.response);
  //         statusMessage.textContent = message.success;
  //         form.reset();
  //         setTimeout(() => {
  //           statusMessage.remove();
  //         }, 3000);
  //       } else {
  //         statusMessage.textContent = message.failure;
  //       }
  //     });
  //   })
  // }

  // with JSON -------------

  


  function postData (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('div');
      statusMessage.classList.add('status');
      statusMessage.textContent = message.loading;
      form.append(statusMessage);

      const request = new XMLHttpRequest();
      request.open('POST', 'server.php');
      request.setRequestHeader('Content-type', 'application/json');
      const formData = new FormData(form);

      const object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });

      const json = JSON.stringify(object);
      
      request.send(json);
      request.addEventListener('load', () => {
        if(request.status === 200) {
          console.log(request.response);
          statusMessage.textContent = message.success;
          form.reset();
          setTimeout(() => {
            statusMessage.remove();
          }, 3000);
        } else {
          statusMessage.textContent = message.failure;
        }
      });
    })
  }

});

