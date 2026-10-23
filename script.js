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

  document.querySelectorAll("[data-medina-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-medina-track]");
    const slides = Array.from(carousel.querySelectorAll(".medina-slide"));
    const previous = carousel.querySelector("[data-medina-prev]");
    const next = carousel.querySelector("[data-medina-next]");
    const currentLabel = carousel.querySelector("[data-medina-current]");
    const totalLabel = carousel.querySelector("[data-medina-total]");
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let autoTimer = null;
    let scrollTimer = null;
    let isVisible = true;

    if (!track || slides.length === 0) return;
    if (totalLabel) totalLabel.textContent = String(slides.length);

    const updateStatus = () => {
      if (currentLabel) currentLabel.textContent = String(index + 1);
    };

    const stopAuto = () => {
      if (autoTimer) window.clearInterval(autoTimer);
      autoTimer = null;
    };

    const startAuto = () => {
      stopAuto();
      if (!mobileQuery.matches || reduceMotionQuery.matches || !isVisible) return;
      autoTimer = window.setInterval(() => {
        showSlide(index + 1);
      }, 4200);
    };

    const showSlide = (nextIndex, behavior = "smooth") => {
      index = (nextIndex + slides.length) % slides.length;
      const left = index * track.clientWidth;
      track.scrollTo({ left, behavior: reduceMotionQuery.matches ? "auto" : behavior });
      updateStatus();
    };

    const restartAuto = () => {
      stopAuto();
      window.setTimeout(startAuto, 1800);
    };

    previous?.addEventListener("click", () => {
      showSlide(index - 1);
      restartAuto();
    });

    next?.addEventListener("click", () => {
      showSlide(index + 1);
      restartAuto();
    });

    track.addEventListener("scroll", () => {
      if (!mobileQuery.matches) return;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const width = track.clientWidth || 1;
        index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / width)));
        updateStatus();
      }, 80);
    }, { passive: true });

    track.addEventListener("touchstart", stopAuto, { passive: true });
    track.addEventListener("touchend", restartAuto, { passive: true });
    track.addEventListener("pointerdown", stopAuto, { passive: true });

    const handleViewportChange = () => {
      if (!mobileQuery.matches) {
        stopAuto();
        index = 0;
        updateStatus();
        track.scrollTo({ left: 0, behavior: "auto" });
        return;
      }
      showSlide(index, "auto");
      startAuto();
    };

    mobileQuery.addEventListener?.("change", handleViewportChange);
    reduceMotionQuery.addEventListener?.("change", startAuto);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible) startAuto();
        else stopAuto();
      }, { threshold: 0.25 });
      observer.observe(carousel);
    }

    updateStatus();
    startAuto();
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
