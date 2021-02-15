document.addEventListener('DOMContentLoaded', () => {
  //console.log('IronGenerator JS imported successfully!');
}, false);

window.onload = () => {
  const appNameElem = document.getElementById('app-name');
  if(appNameElem) {
    appNameElem.classList.add('big-text');
  }

  const updateScroll = () => {
    if(window.scrollY <= 10) {
      appNameElem.classList.add('big-text');
    } else {
      appNameElem.classList.remove('big-text');
    }
  };
  
  window.addEventListener('scroll', updateScroll);
};