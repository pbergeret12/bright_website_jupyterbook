document.addEventListener('DOMContentLoaded', function () {
  if (typeof NEWS_DATA === 'undefined') return;

  const container = document.getElementById('latest-news-container');
  if (!container) return;

  // Sort by date descending and take the 3 most recent
  const sorted = [...NEWS_DATA].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sorted.slice(0, 3);

  latest.forEach(entry => {
    const card = createIntroNewsCard(entry);
    container.appendChild(card);
  });

  // --- CARD CREATION ---
  function createIntroNewsCard(entry) {
    const card = document.createElement('div');
    card.className = 'news-card-standard';
    card.setAttribute('data-date', entry.date || '');

    const topicText = capitalize(entry.topic || '');
    const dateText = formatDate(entry.date || '');

    // --- LINKS ---
    let linksHtml = '';
    if (Array.isArray(entry.link)) {
      linksHtml = entry.link.map(obj => {
        if (typeof obj === 'string') {
          return `<a href="${obj}" target="_blank">Read more</a>`;
        } else if (obj?.url) {
          return `<a href="${obj.url}" target="_blank">${obj.label || 'Read more'}</a>`;
        }
        return '';
      }).join('<br>');
    } else if (typeof entry.link === 'object' && entry.link?.url) {
      linksHtml = `<a href="${entry.link.url}" target="_blank">${entry.link.label || 'Read more'}</a>`;
    } else if (typeof entry.link === 'string') {
      linksHtml = `<a href="${entry.link}" target="_blank">Read more</a>`;
    }

    // --- IMAGE(S) ---
    const imageContainer = document.createElement('div');
    imageContainer.className = 'news-image-container';

    function makeImgElement(src) {
      const img = document.createElement('img');
      img.className = 'news-img-standard';
      img.alt = entry.title || '';
      img.src = src;

      img.onerror = function () {
        console.warn('Image failed to load:', src);
        this.onerror = null;
        this.src = 'data:image/svg+xml;utf8,' +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
               <rect width="100%" height="100%" fill="#eee"/>
               <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#999">Image not found</text>
             </svg>`
          );
        this.classList.add('news-img-broken');
      };
      return img;
    }

    if (Array.isArray(entry.image)) {
      entry.image.forEach(src => {
        if (src && src.trim() !== '') {
          imageContainer.appendChild(makeImgElement(src));
        }
      });
    } else if (typeof entry.image === 'string' && entry.image.trim() !== '') {
      imageContainer.appendChild(makeImgElement(entry.image));
    } else {
      // no image provided
      imageContainer.appendChild(makeImgElement('data:image/svg+xml;utf8,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
             <rect width="100%" height="100%" fill="#fafafa"/>
             <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#bbb">No image</text>
           </svg>`
        )));
    }

    // --- TEXT ---
    const textDiv = document.createElement('div');
    textDiv.className = 'news-text';
    textDiv.innerHTML = `
      <p class="news-topic">
        <a href="news.html?topic=${entry.topic}" class="news-topic-link" data-topic="${entry.topic}">
          ${topicText}
        </a>
      </p>
      <p class="news-date">${dateText}</p>
      <h3 class="news-title">${entry.title}</h3>
      <p class="news-description">${entry.description}</p>
      <p class="news-link">${linksHtml}</p>
    `;

    card.appendChild(textDiv);
    card.appendChild(imageContainer);

    return card;
  }

  // --- HELPERS ---
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }
});
