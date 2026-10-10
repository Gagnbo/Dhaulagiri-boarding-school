/**
 * Dhaulagiri Boarding School - Main JavaScript
 * Handles Theme Toggling, Mobile Navigation, and Form Submissions.
 */

(function () {
  'use strict';

  // --- Theme Toggle ---
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme');

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.checked = theme === 'dark';
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }

  // Apply theme immediately
  applyTheme(getPreferredTheme());

  if (themeBtn) {
    themeBtn.addEventListener('change', () => {
      applyTheme(themeBtn.checked ? 'dark' : 'light');
    });
  }

  // --- Mobile Navigation ---
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menu');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove('open');
      }
    });

    // Close mobile nav on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        nav.classList.remove('open');
      }
    });
  }

  // --- Active Nav Highlighting ---
  const navLinks = document.querySelectorAll('#nav a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('on');
    }
  });

  // --- Forms Handling ---
  const forms = document.querySelectorAll('[data-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const okMsg = form.querySelector('.ok');
      if (okMsg) {
        okMsg.style.display = 'block';
      }
      form.reset();
      setTimeout(() => {
        if (okMsg) {
          // Keep it visible or auto hide after 6 seconds
          setTimeout(() => {
            okMsg.style.display = 'none';
          }, 6000);
        }
      }, 500);
    });
  });
})();

