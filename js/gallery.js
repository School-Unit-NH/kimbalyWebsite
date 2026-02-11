(() => {
  const grid = document.getElementById("gallery-grid");
  const pagination = document.getElementById("gallery-pagination");
  const searchInput = document.getElementById("gallery-search");
  const perPageSelect = document.getElementById("gallery-per-page");
  const emptyState = document.getElementById("gallery-empty");

  if (!grid || !pagination || !searchInput || !perPageSelect || !emptyState) {
    return;
  }

  const featured = Array.from({ length: 6 }, (_, i) => ({
    src: `img/course/course-photo-${String(i + 1).padStart(2, "0")}.webp`,
    title: `Featured Moment ${i + 1}`,
    tag: "Featured"
  }));

  const gallery = Array.from({ length: 84 }, (_, i) => {
    const index = i + 1;
    const bucket = index <= 28 ? "Classroom" : index <= 56 ? "Activities" : "Campus";
    return {
      src: `img/course/course-gallery-${String(index).padStart(3, "0")}.webp`,
      title: `School Life ${index}`,
      tag: bucket
    };
  });

  const allImages = [...featured, ...gallery];
  let currentPage = 1;
  let perPage = Number(perPageSelect.value) || 12;
  let keyword = "";

  function filteredImages() {
    const q = keyword.trim().toLowerCase();
    if (!q) return allImages;
    return allImages.filter((item) => {
      return item.title.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
    });
  }

  function totalPages(totalItems) {
    return Math.max(1, Math.ceil(totalItems / perPage));
  }

  function renderGrid(items) {
    if (!items.length) {
      grid.innerHTML = "";
      emptyState.classList.remove("d-none");
      return;
    }

    emptyState.classList.add("d-none");
    grid.innerHTML = items
      .map(
        (item, idx) => `
          <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <article class="gallery-card h-100">
              <img loading="lazy" decoding="async" class="gallery-image" src="${item.src}" alt="${item.title}">
              <div class="gallery-card-body">
                <span class="gallery-tag">${item.tag}</span>
                <h6 class="gallery-title mb-0">${item.title}</h6>
                <small class="text-muted">Photo ${idx + 1 + (currentPage - 1) * perPage}</small>
              </div>
            </article>
          </div>
        `
      )
      .join("");
  }

  function pageButton(label, page, disabled = false, active = false) {
    return `
      <li class="page-item${disabled ? " disabled" : ""}${active ? " active" : ""}">
        <button class="page-link gallery-page-link" data-page="${page}" ${disabled ? "disabled" : ""}>${label}</button>
      </li>
    `;
  }

  function renderPagination(totalItems) {
    const pages = totalPages(totalItems);
    if (pages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    const windowSize = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(pages, start + windowSize - 1);
    if (end - start < windowSize - 1) {
      start = Math.max(1, end - windowSize + 1);
    }

    let html = pageButton("&laquo;", currentPage - 1, currentPage === 1);
    for (let p = start; p <= end; p += 1) {
      html += pageButton(String(p), p, false, p === currentPage);
    }
    html += pageButton("&raquo;", currentPage + 1, currentPage === pages);
    pagination.innerHTML = html;
  }

  function render() {
    const all = filteredImages();
    const pages = totalPages(all.length);
    if (currentPage > pages) {
      currentPage = pages;
    }

    const start = (currentPage - 1) * perPage;
    const pageItems = all.slice(start, start + perPage);
    renderGrid(pageItems);
    renderPagination(all.length);
  }

  pagination.addEventListener("click", (event) => {
    const target = event.target.closest(".gallery-page-link");
    if (!target) return;
    const page = Number(target.dataset.page);
    if (Number.isNaN(page) || page < 1) return;
    currentPage = page;
    render();
    window.scrollTo({ top: 320, behavior: "smooth" });
  });

  searchInput.addEventListener("input", () => {
    keyword = searchInput.value || "";
    currentPage = 1;
    render();
  });

  perPageSelect.addEventListener("change", () => {
    perPage = Number(perPageSelect.value) || 12;
    currentPage = 1;
    render();
  });

  render();
})();
