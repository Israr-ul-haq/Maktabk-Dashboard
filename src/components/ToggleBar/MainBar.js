   
            document.getElementByClassName("userdropdownli").addEventListener('click', (e) => {
    document.getElementByClassName("userdropdownmenu").classList.toggle("userdropdownmenu-active");
    document.getElementByClassName("userdropdowncontainer").classList.toggle("userdropdowncontainer-active");
    $('body').append(
      document.getElementByClassName("userdropdownmenu").css({
        position: 'fixed',
        left: '95px',
        top:
          document.getElementByClassName("userdropdownli")[0].getBoundingClientRect().top +
          window['scrollTop'](),
      });
    );
  });
  document
    .querySelector('.main-menu .scroll')
    .addEventListener('scroll', function () {
      document.getElementByClassName("userdropdownmenu").css({
        position: 'fixed',
        left: '95px',
        top:
          document.getElementByClassName("userdropdownli")[0].getBoundingClientRect().top +
          window['scrollTop'](),
      });
    });
  
  
  document.click(function () {
    document.getElementByClassName("userdropdownmenu").classList.remove("userdropdownmenu-active");
  });
  
  
  document.getElementByClassName("userdropdownmenu").click(function (e) {
    e.stopPropagation();
  });
  
  document.getElementByClassName("userdropdownli").click(function (e) {
    e.stopPropagation();
  });
    )
}


