(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox__img");
  const closeBtn = lightbox?.querySelector(".lightbox__close");
  const prevBtn = lightbox?.querySelector(".lightbox__prev");
  const nextBtn = lightbox?.querySelector(".lightbox__next");
  const items = [...document.querySelectorAll(".gallery__item")];
  let currentIndex = -1;
  let touchStartX = 0;
  let touchStartY = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !items.length) return;
    currentIndex = ((index % items.length) + items.length) % items.length;
    const btn = items[currentIndex];
    const src = btn.getAttribute("data-full");
    const img = btn.querySelector("img");
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = img?.alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.body.classList.add("is-lightbox-open");
    closeBtn?.focus();
  }

  function openByFullSrc(fullSrc) {
    const index = items.findIndex((btn) => btn.getAttribute("data-full") === fullSrc);
    if (index >= 0) {
      openLightbox(index);
      return;
    }
    if (!lightbox || !lightboxImg || !fullSrc) return;
    currentIndex = -1;
    lightboxImg.src = fullSrc;
    lightboxImg.alt = "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.body.classList.add("is-lightbox-open");
    closeBtn?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    document.body.classList.remove("is-lightbox-open");
    currentIndex = -1;
  }

  function showNext(delta) {
    if (currentIndex < 0) return;
    openLightbox(currentIndex + delta);
  }

  items.forEach((btn, index) => {
    btn.addEventListener("click", () => openLightbox(index));
  });

  document.querySelectorAll(".media--zoom[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => openByFullSrc(btn.getAttribute("data-full")));
  });

  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext(-1);
  });
  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext(1);
  });

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showNext(-1);
    if (e.key === "ArrowRight") showNext(1);
  });

  lightbox?.addEventListener(
    "touchstart",
    (e) => {
      if (e.changedTouches.length !== 1) return;
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );

  lightbox?.addEventListener(
    "touchend",
    (e) => {
      if (lightbox.hidden || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      showNext(dx < 0 ? 1 : -1);
    },
    { passive: true }
  );

  const revealTargets = document.querySelectorAll(
    ".section--story .wrap, .section--power .split, .section--build .wrap, .section--proof .wrap, .section--included .wrap, .section--facts .wrap, .section--cabin .split, .section--gallery .wrap, .section--inquire .wrap"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
})();
