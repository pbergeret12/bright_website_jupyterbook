// BRIGHT Lab – Generate publication cards from embedded JSON

document.addEventListener('DOMContentLoaded', () => {
    createPublicationCards();
});

async function getLatestPublications() {
    const pubDataScript = document.getElementById("pub-data");
    if (!pubDataScript) {
        console.error("Publication data script not found.");
        return [];
    }

    try {
        const data = JSON.parse(pubDataScript.textContent);
        return data.map(pub => ({
            title: pub.title,
            link: pub.link,
            date: pub.year,
            description: '', // Optional: add this in JSON if needed
            source: '',      // Optional: for journal name
            authors: pub.authors.split(",").map(s => s.trim()),
            image: pub.image || null,
            doi: pub.link.includes("doi.org/") ? pub.link.split("doi.org/")[1] : null
        }));
    } catch (e) {
        console.error("Error parsing publication data:", e);
        return [];
    }
}

function formatAuthors(authorsArray) {
    if (!authorsArray || authorsArray.length === 0) return '';
    if (authorsArray.length > 7) {
        return `${authorsArray[0]} et al.`;
    }
    return authorsArray.join(', ');
}

function formatJournal(journal) {
    if (!journal) return '';
    return journal.split(' : ')[0];
}

function createPublicationCards() {
    const publicationsList = document.querySelector('.publications-list');

    if (publicationsList) {
        publicationsList.innerHTML = '';

        getLatestPublications().then(publications => {
            publications.forEach((pub, index) => {
                const card = document.createElement('div');
                card.className = 'publication-card';
                card.setAttribute('data-card-id', index);

                if (pub.image) {
                    const img = document.createElement('img');
                    img.src = '_static/images/' + pub.image;
                    img.alt = pub.title;
                    img.style.width = '100%';
                    img.style.borderRadius = '8px';
                    img.style.marginBottom = '10px';
                    card.appendChild(img);
                }

                const title = document.createElement('p');
                title.className = 'publication-title';
                title.textContent = pub.title;

                const separator = document.createElement('span');
                separator.className = 'pub-sep';

                const authors = document.createElement('p');
                authors.className = 'publication-authors';
                authors.textContent = formatAuthors(pub.authors);

                const sourceDiv = document.createElement('div');
                sourceDiv.className = 'pub-source';

                const journal = document.createElement('span');
                journal.className = 'publication-journal';
                journal.textContent = formatJournal(pub.source);

                const year = document.createElement('span');
                year.className = 'publication-year';
                year.textContent = pub.date;

                sourceDiv.appendChild(journal);
                if (pub.source && pub.date) {
                    sourceDiv.appendChild(document.createTextNode(' - '));
                }
                sourceDiv.appendChild(year);

                card.appendChild(title);
                card.appendChild(separator);
                card.appendChild(authors);
                card.appendChild(sourceDiv);

                publicationsList.appendChild(card);
            });

            if (typeof initPublicationCarousel === 'function') {
                initPublicationCarousel();
            }
        }).catch(error => {
            console.error('Error while getting publications:', error);
        });
    }
}
