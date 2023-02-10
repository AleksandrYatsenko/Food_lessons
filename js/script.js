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

  const deadline = '2023-02-25';

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
      this.transfer = 40;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
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

  const getResouce = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  // ------------------------------- with Classes -------------
  getResouce('http://localhost:3000/menu')
    .then(data => {
      data.forEach(({img, altimg, title, descr, price}) => {
        new Card(img, altimg, title, descr, price, '.menu .container').makeCard();
      })
    });

  // --------- with AXIOS liblary and class-------------
  // axios.get('http://localhost:3000/menu')
  //   .then(data => {
  //     data.data.forEach(({img, altimg, title, descr, price}) => {
  //       new Card(img, altimg, title, descr, price, '.menu .container').makeCard();
  //     })
  //   });
  // -----------Axios /\ ----------------
  
  // --------- without Classes ----------
  // getResouce('http://localhost:3000/menu')
  //   .then(data => createCard(data));

  // function createCard(data) {
  //   data.forEach(({img, altimg, title, descr, price}) => {
  //     const element = document.createElement('div');
  //     price = price * 40;
  //     element.classList.add('menu__item');
  //     element.innerHTML =`
  //       <img src=${img} alt=${altimg}>
  //       <h3 class="menu__item-subtitle">Меню "${title}"</h3>
  //       <div class="menu__item-descr">${descr}</div>
  //       <div class="menu__item-divider"></div>
  //       <div class="menu__item-price">
  //         <div class="menu__item-cost">Цена:</div>
  //         <div class="menu__item-total"><span>${price}</span> грн/день</div>
  //       </div>
  //     `;
  //     document.querySelector('.menu .container').append(element);
  //   });
  // }
  // ---------------- without Classes ------ /\ ---


  // new Card("img/tabs/vegy.jpg", "vegy", "Фитнес", "Меню “Фитнес” - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!", "229", ".menu .container").makeCard();

  // new Card("img/tabs/elite.jpg", "elite", "Премиум", "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!", "550", ".menu .container").makeCard();

  // new Card("img/tabs/post.jpg", "post", "Постное", "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.", "430", ".menu .container").makeCard();

  // ------------------ Forms ---------------------

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach(item => {
    bindPostData(item);
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

  // ---------- with JSON ------------- and fetch----

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    });
    return await res.json();
  };

  function bindPostData (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText =  `
        display: block;
        margin: 0 auto; 
      `;

      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));
     

      postData('http://localhost:3000/requests', json)
      .then(data => {
        console.log(data);
        showThanksModal(message.success);
        statusMessage.remove();
      })
      .catch(() => {
        showThanksModal(message.failure);
      })
      .finally(() => {
        form.reset();
      })

      // не надо для fetch:
      // request.addEventListener('load', () => {
      //   if(request.status === 200) {
      //     console.log(request.response);
      //     // statusMessage.textContent = message.success;
      //     showThanksModal(message.success);
      //     form.reset();
      //     // setTimeout(() => {
      //     //   statusMessage.remove();
      //     // }, 3000);
      //     statusMessage.remove();
      //   } else {
      //     // statusMessage.textContent = message.failure;
      //     showThanksModal(message.failure);
      //   }
      // });
    })
  }
  function showThanksModal (message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  // fetch('http://localhost:3000/menu')
  //   .then(data => data.json())
  //   .then(res => console.log(res));

  // ------------------ Slider ---------------------
   
  const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width,
        slider = document.querySelector('.offer__slider');
  let slideIndex = 1;
  let offset = 0;

  // var 2 of slider, like carousel ----------------

  if(slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
  } else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
  }

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
    slide.style.width = width;
  });

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
        dots = [];
  indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
  `;
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.style.cssText = `
      box-sizing: content-box;
      flex: 0 1 auto;
      width: 30px;
      height: 6px;
      margin-right: 3px;
      margin-left: 3px;
      cursor: pointer;
      background-color: #fff;
      background-clip: padding-box;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      opacity: .5;
      transition: opacity .6s ease;
    `;
    if (i == 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  } 

  next.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;
    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    if (slideIndex < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }

    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;
  }); 

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    if (slideIndex < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }

    dots.forEach(dot => dot.style.opacity = '.5');
    dots[slideIndex - 1].style.opacity = 1;

  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');

      slideIndex = slideTo;
      offset = +width.slice(0, width.length - 2) * (slideIndex - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;

      if(slides.length < 10) {
        current.textContent = `0${slideIndex}`;
      } else {
        current.textContent = slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex - 1].style.opacity = 1;
    });
  });

  // ------------------ calculator ----------------

  const result = document.querySelector('.calculating__result span');
  let sex = 'female', 
      height, weight, age, 
      ratio = 1.375;

  function calcTotal() {
    if(!sex || !height || !weight || !age || !ratio) {
      result.textContent = '____';
      return;
    }

    if(sex === 'female') {
      result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    } else {
      result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    }
  }

  calcTotal();

  function getStaticInformation(parentSelector, activeClass) {
    const elements = document.querySelectorAll(`${parentSelector} div`);

    elements.forEach(elem => {
      elem.addEventListener('click', (e) => {
        if(e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
        } else {
          sex = e.target.getAttribute('id');
        }
        console.log(ratio, sex);
  
        elements.forEach(elem => {
          elem.classList.remove(activeClass);
        })
        e.target.classList.add(activeClass);
        calcTotal();
      });
    });
  }

  getStaticInformation('#gender', 'calculating__choose-item_active');
  getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

  function getDynamicInf(selector) {
    const input = document.querySelector(selector);

    input.addEventListener('input',  () => {
      switch(input.getAttribute('id')) {
        case 'height':
          height = +input.value;
          break;
        case 'weight':
          weight = +input.value;
          break;
        case 'age':
          age = +input.value;
          break;  
      }
      calcTotal();
    });
  }

  getDynamicInf('#height');
  getDynamicInf('#weight');
  getDynamicInf('#age');

  // ---- my var 1 of slider -----
  // current.textContent = `0${slideIndex}`;

  // if(slides.length < 10) {
  //   total.textContent = `0${slides.length}`;
  // } else {
  //   total.textContent = slides.length;
  // }

  // function hideSlide() {
  //   slides.forEach(item => {
  //     item.classList.add('hide');
  //     item.classList.remove('show')
  //   });
  // }
  // // hideSlide();
  // showSlide(slideIndex);  

  // function showSlide(n) {
  //   slides.forEach(item => {
  //     item.classList.add('hide');
  //     item.classList.remove('show')
  //   });
  //   slides[n-1].classList.add('show');
  //   slides[n-1].classList.remove('hide');
  //   // slides.forEach((item, i) => {
  //   //   if(i == slideIndex) {
  //   //     item.classList.add('show');
  //   //     item.classList.remove('hide');
  //   //   }
  //   // });
  // }

  // prev.addEventListener('click', () => {
  //   slideIndex = slideIndex - 1;
  //   if(slideIndex <= 0) {
  //     slideIndex = slides.length ;
  //   }
  //   showSlide(slideIndex);
  //   if(slideIndex < 10) {
  //     current.textContent = `0${slideIndex}`;
  //   } else {
  //     current.textContent = slideIndex;
  //   }
    
  // });

  // next.addEventListener('click', () => {
  //   slideIndex = slideIndex + 1;
  //   if(slideIndex > slides.length) {
  //     slideIndex = 1;
  //   }
  //   showSlide(slideIndex);
  //   if(slideIndex < 10) {
  //     current.textContent = `0${slideIndex}`;
  //   } else {
  //     current.textContent = slideIndex;
  //   }
  // });
  // ---- end my var of slider ----

  

});

