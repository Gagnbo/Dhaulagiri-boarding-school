/**
 * Dhaulagiri Boarding School - Gallery JavaScript
 */

(function () {
  'use strict';

  // Gallery Data: [Category, Icon, PrimaryColor, Title]
  const galleryItems = [
    ['Classroom', '🧑‍🏫', '#1c3f7a', 'Interactive Teaching'],
    ['Sports', '⚽', '#1f6a35', 'Football Championship'],
    ['Classroom', '📚', '#7a4a21', 'School Library & Reading'],
    ['Events', '🎭', '#6a2a5a', 'Annual Cultural Fest'],
    ['Campus', '🏔️', '#2a6a7a', 'Mountain View Campus'],
    ['Sports', '🏃', '#2a5a2a', 'Track & Athletics'],
    ['Campus', '🏫', '#12306b', 'Academic Building'],
    ['Events', '🎉', '#7a3a21', 'Graduation Day'],
    ['Classroom', '🔬', '#2a4a7a', 'Physics & Chemistry Lab'],
    ['Sports', '🏸', '#1f6a55', 'Badminton Tournament'],
    ['Events', '🎨', '#8a2b5a', 'Art & Craft Exhibition'],
    ['Campus', '🌳', '#2a7a4a', 'School Green Playground']
  ];

  const galleryEl = document.getElementById('gal');
  const pillsEl = document.getElementById('pills');

  function renderGallery(filter = 'all') {
    if (!galleryEl) return;

    const filtered = galleryItems.filter(
      ([cat]) => filter === 'all' || cat.toLowerCase() === filter.toLowerCase()
    );

    galleryEl.innerHTML = filtered
      .map(
        ([cat, icon, color, label]) => `
        <div class="tile" style="--c: linear-gradient(135deg, ${color}, #4f86d6)" title="${label}">
          <i>${icon}</i>
          <span>${label}</span>
        </div>`
      )
      .join('');
  }

  // Initial render
  renderGallery();

  if (pillsEl) {
    pillsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const buttons = pillsEl.querySelectorAll('button');
      buttons.forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');

      renderGallery(btn.dataset.f);
    });
  }
})();

