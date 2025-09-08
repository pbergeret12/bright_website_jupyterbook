// BRIGHT Lab – custom carousel logic

document.addEventListener("DOMContentLoaded", () => {
  const carouselTrack = document.querySelector(".carousel-track");
  const modal = document.querySelector(".publication-modal");
  const modalContent = modal.querySelector(".modal-content");
  const modalTitle = modal.querySelector(".modal-title");
  const modalAuthors = modal.querySelector(".modal-authors");
  const modalYear = modal.querySelector(".modal-year");
  const modalLink = modal.querySelector(".modal-link");
  const modalImage = modal.querySelector(".modal-image");
  const closeModalBtn = modal.querySelector(".modal-close");

  let currentIndex = 0;
  let data = [];

const jsonScript = document.getElementById("pub-data");
if (jsonScript) {
try {
    data = JSON.parse(jsonScript.textContent);
    buildCards();
    updateCarousel();
} catch (e) {
    console.error("Failed to parse inline publication data", e);
}
}

  // Build cards dynamically
  function buildCards() {
    data.forEach((pub, index) => {
      const card = document.createElement("div");
      card.className = "publication-card";
      card.dataset.index = index;

      if (pub.image) {
        const img = document.createElement("img");
        img.src = "assets/images/" + pub.image;
        img.alt = pub.title;
        card.appendChild(img);
      }

      const title = document.createElement("h3");
      title.textContent = pub.title;
      card.appendChild(title);

      const authors = document.createElement("p");
      authors.textContent = pub.authors;
      card.appendChild(authors);

      const year = document.createElement("p");
      year.textContent = pub.year;
      card.appendChild(year);

      const link = document.createElement("p");
      link.innerHTML = `<a href="${pub.link}" target="_blank">🔗 Read more</a>`;
      card.appendChild(link);

      // Event: open modal on click
      card.addEventListener("click", () => openModal(index));

      carouselTrack.appendChild(card);
    });
  }

  // Carousel navigation
  document.querySelector(".carousel-btn.prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + data.length) % data.length;
    updateCarousel();
  });

  document.querySelector(".carousel-btn.next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % data.length;
    updateCarousel();
  });

  // Update visible cards
  function updateCarousel() {
    const offset = currentIndex * 320; // 300px + gap
    carouselTrack.style.transform = `translateX(-${offset}px)`;
  }

  // Modal logic
  function openModal(index) {
    const pub = data[index];
    modalTitle.textContent = pub.title;
    modalAuthors.textContent = pub.authors;
    modalYear.textContent = pub.year;
    modalLink.innerHTML = `<a href="${pub.link}" target="_blank">🔗 Read more</a>`;

    if (pub.image) {
      modalImage.src = "assets/images/" + pub.image;
      modalImage.alt = pub.title;
      modalImage.style.display = "block";
    } else {
      modalImage.style.display = "none";
    }

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % data.length;
      updateCarousel();
    }
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + data.length) % data.length;
      updateCarousel();
    }
  });

  // Optional: auto-rotate
  // setInterval(() => {
  //   currentIndex = (currentIndex + 1) % data.length;
  //   updateCarousel();
  // }, 5000);
});
