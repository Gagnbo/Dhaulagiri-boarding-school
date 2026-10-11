/**
 * Dhaulagiri Boarding School - Notices & Events JavaScript
 */

(function () {
  'use strict';

  // Notices Data: [Day, Month, Title, Description, file (optional PDF, JPG, PNG, etc.)]
  const notices = [
    [12, 'Nov', 'School Holiday', 'The school will remain closed on Friday, 15th November.', null],
    [8, 'Nov', 'Exam Routine Published', 'Routine for the upcoming second term examination is available.', 'downloads/exam-routine.pdf'],
    [3, 'Nov', 'Admission Open 2026/27', 'Admissions are now open for Nursery to Class IX for the new academic session.', 'src/Hope special school.jpeg'],
    [28, 'Oct', 'School Calendar 2026', 'Official calendar showing school terms, exam weeks, and holidays.', 'src/school-calendar-2026.jpg'],
    [19, 'Oct', 'Parent-Teacher Conference', 'Quarterly meeting to discuss student academic progress and growth.', null],
    [10, 'Oct', 'Science Exhibition Participation', 'Registration open for student science and robotics projects.', null]
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

    const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

    noticesListEl.innerHTML = filtered
      .map(
        ([day, month, title, desc, file]) => {
          let actionButtons = `<button class="small-btn" onclick="alert('${title.replace(/'/g, "\\'")}: ${desc.replace(/'/g, "\\'")}')">View Notice</button>`;

          if (file) {
            const ext = file.split('.').pop().toLowerCase();
            const isImg = imageExts.includes(ext);
            const fileName = file.split('/').pop();
            const downloadLabel = isImg ? 'Download Image' : (ext === 'pdf' ? 'Download PDF' : 'Download File');

            actionButtons = `
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <a href="${file}" target="_blank" class="small-btn">View</a>
                <a href="${file}" download="${fileName}" class="small-btn">${downloadLabel}</a>
              </div>`;
          }

          return `
            <div class="row">
              <div class="date">
                <b>${day}</b>${month}
              </div>
              <div>
                <b>${title}</b>
                <small>${desc}</small>
              </div>
              ${actionButtons}
            </div>`;
        }
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

