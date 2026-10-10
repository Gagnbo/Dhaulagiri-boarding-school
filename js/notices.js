/**
 * Dhaulagiri Boarding School - Notices & Events JavaScript
 */

(function () {
  'use strict';

  // Notices Data: [Day, Month, Title, Description]
  const notices = [
    [12, 'Nov', 'School Holiday', 'The school will remain closed on Friday, 15th November.'],
    [8, 'Nov', 'Exam Routine Published', 'Routine for the upcoming second term examination is available.'],
    [3, 'Nov', 'Admission Open 2026/27', 'Admissions are now open for Nursery to Class IX for the new academic session.'],
    [28, 'Oct', 'Annual Sports Meet', 'Annual sports day and athletic meet will be held on 12th November.'],
    [19, 'Oct', 'Parent-Teacher Conference', 'Quarterly meeting to discuss student academic progress and growth.'],
    [10, 'Oct', 'Science Exhibition Participation', 'Registration open for student science and robotics projects.']
  ];

  // Events Data: [Day, Month, Title, Location/Time]
  const events = [
    [15, 'Nov', 'Parent-Teacher Meeting', '9:00 AM – 12:00 PM · School Auditorium'],
    [22, 'Nov', 'Annual Sports Meet', 'School Sports Ground'],
    [25, 'Nov', 'Cultural & Dance Program', 'Auditorium Hall'],
    [5, 'Dec', 'Inter-School Science Exhibition', 'Main Campus Hall'],
    [18, 'Dec', 'Winter Term Final Examinations', 'Respective Classrooms']
  ];

  const noticesListEl = document.getElementById('nl');
  const searchInputEl = document.getElementById('ns');
  const eventsListEl = document.getElementById('ev');

  function renderNotices(query = '') {
    if (!noticesListEl) return;
    const lowerQ = query.trim().toLowerCase();
    const filtered = notices.filter(([day, month, title, desc]) =>
      (title + ' ' + desc).toLowerCase().includes(lowerQ)
    );

    if (filtered.length === 0) {
      noticesListEl.innerHTML = '<p class="lead" style="padding: 10px 0;">No notices match your search.</p>';
      return;
    }

    noticesListEl.innerHTML = filtered
      .map(
        ([day, month, title, desc]) => `
        <div class="row">
          <div class="date">
            <b>${day}</b>${month}
          </div>
          <div>
            <b>${title}</b>
            <small>${desc}</small>
          </div>
          <button class="small-btn" onclick="alert('Downloading notice: ${title.replace(/'/g, "\\'")}...')">Download</button>
        </div>`
      )
      .join('');
  }

  function renderEvents() {
    if (!eventsListEl) return;
    eventsListEl.innerHTML = events
      .map(
        ([day, month, title, loc]) => `
        <div class="row">
          <div class="date">
            <b>${day}</b>${month}
          </div>
          <div>
            <b>${title}</b>
            <small>${loc}</small>
          </div>
        </div>`
      )
      .join('');
  }

  // Initial Renders
  renderNotices();
  renderEvents();

  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      renderNotices(e.target.value);
    });
  }
})();

