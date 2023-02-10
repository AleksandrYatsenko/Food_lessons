function tabs () {
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
}

module.exports = tabs;