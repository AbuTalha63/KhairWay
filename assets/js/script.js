/* Khairway interactions: navigation, dropdown behavior, video carousel, and back-to-top. */
(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const chatDropdown = document.querySelector(".nav-dropdown");

  const closeChatDropdown = () => {
    if (chatDropdown?.open) chatDropdown.removeAttribute("open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) closeChatDropdown();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        closeChatDropdown();
      });
    });
  }

  /* Native <details> keeps keyboard support; these handlers make it dismiss like a menu. */
  if (chatDropdown) {
    document.addEventListener("pointerdown", (event) => {
      if (chatDropdown.open && !chatDropdown.contains(event.target)) closeChatDropdown();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeChatDropdown();
    });

    window.addEventListener("scroll", closeChatDropdown, { passive: true });
  }

  document.querySelectorAll("[data-video-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-video-track]");
    const slides = Array.from(carousel.querySelectorAll(".video-slide"));
    const videos = slides.map((slide) => slide.querySelector("video")).filter(Boolean);
    const previous = carousel.querySelector("[data-video-prev]");
    const next = carousel.querySelector("[data-video-next]");
    const currentLabel = carousel.querySelector("[data-video-current]");
    const totalLabel = carousel.querySelector("[data-video-total]");
    let index = 0;

    if (!track || slides.length === 0) return;
    if (totalLabel) totalLabel.textContent = String(slides.length);

    const showSlide = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      videos.forEach((video) => video.pause());
      track.style.transform = `translateX(-${index * 100}%)`;
      if (currentLabel) currentLabel.textContent = String(index + 1);
    };

    previous?.addEventListener("click", () => showSlide(index - 1));
    next?.addEventListener("click", () => showSlide(index + 1));

    showSlide(0);
  });

  document.querySelectorAll("[data-back-to-top]").forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
