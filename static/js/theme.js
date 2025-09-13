// theme.js — toggles light/dark theme and persists the choice
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const storageKey = 'weather-theme';

  function applyTheme(theme){
    if(theme === 'dark'){
      root.setAttribute('data-theme','dark');
      if(btn) btn.textContent = '☀️';
    } else {
      root.setAttribute('data-theme','light');
      if(btn) btn.textContent = '🌙';
    }
  }

  // init from localStorage or OS preference
  const saved = localStorage.getItem(storageKey);
  if(saved){
    applyTheme(saved);
  } else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if(btn){
    btn.addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(storageKey, next);
    });
  }
})();
