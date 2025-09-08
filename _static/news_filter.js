document.addEventListener('DOMContentLoaded', function () {
  const data = typeof NEWS_DATA !== "undefined" ? NEWS_DATA : [];

  const container = document.getElementById('news-container');
  const cards = [];

  data.forEach(entry => {
    const card = createNewsCard(entry);
    cards.push(card);
    container.appendChild(card);
  });

  setupFiltering(cards);
});

function createNewsCard(entry) {
  const card = document.createElement('div');
  card.className = 'news-card-standard';
  card.setAttribute('data-topic', entry.topic);
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

  // Le tag ici est un <a href="#"> — pour filtrage dynamique sur la page news.html
  card.innerHTML = `
    <div class="news-text">
      <p class="news-topic">
        <a href="#" class="news-topic-link" data-topic="${entry.topic}">${topicText}</a>
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

function setupFiltering(allCards) {
  // Trier du plus récent au plus ancien
  allCards.sort((a, b) => {
    const dateA = new Date(a.getAttribute('data-date'));
    const dateB = new Date(b.getAttribute('data-date'));
    return dateB - dateA;
  });

  const parent = allCards[0]?.parentElement;
  if (parent) {
    allCards.forEach(card => parent.appendChild(card));
  }

  // Gérer les clics sur les tags (mais NE PAS bloquer les vrais liens comme "news.html")
  const topicLinks = document.querySelectorAll('.news-topic-link');
  topicLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // ✅ Si lien pointe vers une autre page (comme news.html), on laisse le lien fonctionner
      if (href && href !== '#' && href !== '') return;

      // Sinon, on applique le filtrage dynamique sur cette page
      e.preventDefault();
      const selectedTopic = this.getAttribute('data-topic');
      allCards.forEach(card => {
        card.style.display = card.getAttribute('data-topic') === selectedTopic ? 'flex' : 'none';
      });
    });
  });

  // Bouton "View All News"
  const showAllBtn = document.getElementById('show-all-topics');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', function (e) {
      e.preventDefault();
      allCards.forEach(card => {
        card.style.display = 'flex';
      });
    });
  }

  // Si ?topic=xxx dans l'URL, filtrer automatiquement au chargement
  const params = new URLSearchParams(window.location.search);
  const topicParam = params.get('topic');
  if (topicParam) {
    allCards.forEach(card => {
      const matches = card.getAttribute('data-topic') === topicParam;
      card.style.display = matches ? 'flex' : 'none';
    });
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${year}-${month}-${day}`;
}
