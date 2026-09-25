/*
 * The Drafting Table: shared site script
 * Mobile nav disclosure + reveal-on-scroll. Safe on any page.
 */
document.documentElement.classList.add('js');

(function(){
  "use strict";
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if(!toggle || !menu) return;

  function setOpen(open){
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function(){
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ setOpen(false); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !menu.hidden){ setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', function(e){
    var header = document.querySelector('header.nav');
    if(!menu.hidden && header && !header.contains(e.target)) setOpen(false);
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function(e){
    if(e.matches) setOpen(false);
  });
})();

(function(){
  "use strict";
  var els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, {threshold:.12});
  els.forEach(function(el){ observer.observe(el); });
})();

/* Enlarge images: <a class="zoom" href="full.png"><img alt="..."></a>
   Without JS (or <dialog> support) the link simply opens the image. */
(function(){
  "use strict";
  var links = document.querySelectorAll('a.zoom');
  if(!links.length || typeof HTMLDialogElement !== 'function') return;

  var dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Enlarged image');
  dlg.innerHTML = '<button type="button" aria-label="Close enlarged image">&times;</button><img alt=""><p></p>';
  document.body.appendChild(dlg);
  var img = dlg.querySelector('img'), cap = dlg.querySelector('p');

  dlg.querySelector('button').addEventListener('click', function(){ dlg.close(); });
  dlg.addEventListener('click', function(e){ if(e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function(){ img.removeAttribute('src'); });

  links.forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var thumb = a.querySelector('img');
      img.src = a.href;
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = a.getAttribute('data-caption') || '';
      cap.hidden = !cap.textContent;
      dlg.showModal();
    });
  });
})();
