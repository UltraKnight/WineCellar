document.addEventListener('DOMContentLoaded', () => {
  //console.log('IronGenerator JS imported successfully!');
}, false);

window.onload = () => {
  const appNameElem = document.getElementById('app-name');
  if(appNameElem) {
    appNameElem.classList.add('big-text');
  }

  const updateScroll = (elemen) => {
    return () => {
        if(elemen) {
        if(window.scrollY <= 10) {
          elemen.classList.add('big-text');
        } else {
          elemen.classList.remove('big-text');
        }
      }
    };
  };

  const updateCopyright = () => {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').innerHTML = currentYear;
  };

  updateCopyright();
  window.addEventListener('scroll', updateScroll(appNameElem));
};

