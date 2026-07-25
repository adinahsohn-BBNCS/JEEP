(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox__img");
  const closeBtn = lightbox?.querySelector(".lightbox__close");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery__item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-full");
      const img = btn.querySelector("img");
      if (src) openLightbox(src, img?.alt);
    });
  });

  closeBtn?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });

  const revealTargets = document.querySelectorAll(
    ".section--story .wrap, .section--power .split, .section--build .wrap, .section--proof .wrap, .section--included .wrap, .section--cabin .split, .section--gallery .wrap, .section--inquire .wrap"
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
