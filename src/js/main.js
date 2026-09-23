// SABOR IMPERIAL RESTAURANTE
(function () {
    "use strict";

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    // Ano no footer
    $("#year").textContent = new Date().getFullYear();

    // ===== Scroll progress + navbar =====
    const progress = $("#scrollProgress");
    const onScroll = () => {
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        progress.style.width = scrolled + "%";
        $("#navbar").classList.toggle("navbar--scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ===== Navbar mobile =====
    const toggle = $("#navToggle");
    const menu = $("#navMenu");
    toggle.addEventListener("click", () => {
        menu.classList.toggle("open");
        toggle.classList.toggle("active");
    });
    $$(".navbar__link").forEach((link) =>
        link.addEventListener("click", () => {
            menu.classList.remove("open");
            toggle.classList.remove("active");
        })
    );

    // ===== Hero slider =====
    const slides = $$(".hero__slide");
    const dotsWrap = $("#heroDots");
    let current = 0;
    let timer;

    slides.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.setAttribute("aria-label", "Slide " + (i + 1));
        btn.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(btn);
    });
    const dots = $$("#heroDots button");

    function goTo(i) {
        slides[current].classList.remove("active");
        dots[current].classList.remove("active");
        current = (i + slides.length) % slides.length;
        slides[current].classList.add("active");
        dots[current].classList.add("active");
    }

    function autoPlay() {
        timer = setInterval(() => goTo(current + 1), 5000);
    }
    goTo(0);
    autoPlay();

    // ===== Cardápio tabs =====
    const tabs = $$(".cardapio__tab");
    const panels = $$(".cardapio__panel");

    // Ativa a aba correspondente ao dia da semana (0=domingo ... 6=sábado).
    // Como o restaurante abre de segunda a sábado (1..6), usa 1=Segunda.
    const today = new Date().getDay();
    let startDay = today >= 1 && today <= 6 ? today - 1 : 0;

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            setDay(parseInt(tab.dataset.day, 10));
        });
    });

    function setDay(i) {
        tabs.forEach((t) => t.classList.toggle("active", parseInt(t.dataset.day, 10) === i));
        panels.forEach((p) => {
            p.classList.remove("active");
            if (parseInt(p.dataset.panel, 10) === i) {
                p.classList.add("active");
                p.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            }
        });
    }
    setDay(startDay);

    // ===== Reveal on scroll =====
    const animateables = $$("[data-animate]");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("in-view");
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        animateables.forEach((el) => io.observe(el));
    } else {
        animateables.forEach((el) => el.classList.add("in-view"));
    }

    // ===== Animated counters (destaques) =====
    const counters = $$(".count");
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const dur = 1600;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window && counters.length) {
        const cio = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        animateCount(e.target);
                        cio.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.6 }
        );
        counters.forEach((c) => cio.observe(c));
    } else {
        counters.forEach((c) => { c.textContent = c.dataset.count; });
    }

    // ===== Smooth anchor (offset do navbar) =====
    $$('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const target = $(a.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 74,
                behavior: "smooth",
            });
        });
    });
})();