// navbar.js — mobile menu toggle, search focus and active link highlighting
(function(){
  const hamburger = document.getElementById('nav-hamburger');
  const navCenter = document.getElementById('nav-center');
  const navLinks = document.getElementById('nav-links');

  if(hamburger && navCenter){
    hamburger.addEventListener('click', ()=>{
      navCenter.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  // mark active nav link (exact match)
  try{
    const pathname = window.location.pathname || '/';
    Array.from(navLinks.querySelectorAll('a')).forEach(a=>{
      const href = a.getAttribute('href') || '/';
      if(href === pathname){
        a.classList.add('active');
      }
    });
  }catch(e){}
})();
