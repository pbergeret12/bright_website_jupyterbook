document.addEventListener('DOMContentLoaded', function () {
  if (typeof NEWS_DATA === 'undefined') return;

  const container = document.getElementById('latest-news-container');
  if (!container) return;

  // Trier par date décroissante et prendre les 3 dernières
  const sorted = [...NEWS_DATA].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sorted.slice(0, 3);

  latest.forEach(entry => {
    const card = createIntroNewsCard(entry);  
    container.appendChild(card);
  });

  function createIntroNewsCard(entry) {  
    const card = document.createElement('div');
    card.className = 'news-card-standard';
    card.setAttribute('data-date', entry.date);

    const topicText = capitalize(entry.topic);
    const dateText = formatDate(entry.date);

    let linksHtml = '';
    if (Array.isArray(entry.link)) {
      linksHtml = entry.link.map(obj => {
        if (typeof obj === 'string') {
          return `<a href="${obj}" target="_blank">Read more</a>`;
        } else {
          return `<a href="${obj.url}" target="_blank">${obj.label || 'Read more'}</a>`;
        }
      }).join('<br>');
    } else if (typeof entry.link === 'object' && entry.link.url) {
      linksHtml = `<a href="${entry.link.url}" target="_blank">${entry.link.label || 'Read more'}</a>`;
    } else if (typeof entry.link === 'string') {
      linksHtml = `<a href="${entry.link}" target="_blank">Read more</a>`;
    }

    card.innerHTML = `
      <div class="news-text">
        <p class="news-topic">
          <a href="news.html?topic=${entry.topic}" class="news-topic-link" data-topic="${entry.topic}">${topicText}</a>
        </p>
        <p class="news-date">${dateText}</p>
        <h3 class="news-title">${entry.title}</h3>
        <p class="news-description">${entry.description}</p>
        <p class="news-link">${linksHtml}</p>
      </div>
      <div class="news-image-container">
        <img src="${entry.image}" alt="${entry.title}" class="news-img-standard">
      </div>
    `;

    return card;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }
});
