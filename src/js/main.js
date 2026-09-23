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
        if (progress) progress.style.width = scrolled + "%";
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

    // ===== Hero: título palavra a palavra + fade dos demais elementos =====
    const hero = document.querySelector(".hero");
    const title = document.querySelector(".hero__title");
    if (hero && title) {
        // atribui delay escalonado a cada palavra
        title.querySelectorAll(".hero__word").forEach((w, i) => {
            w.style.setProperty("--wd", `${0.15 + i * 0.08}s`);
        });
        const heroIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        hero.classList.add("in-view");
                        heroIO.unobserve(hero);
                    }
                });
            },
            { threshold: 0.25 }
        );
        heroIO.observe(hero);
    }

    // ===== Marquee de fotos: duplica para loop contínuo =====
    const marquee = document.getElementById("heroMarquee");
    if (marquee) {
        marquee.innerHTML += marquee.innerHTML;
    }

    // ===== Ticker com loop contínuo =====
    const track = document.getElementById("tickerTrack");
    if (track) {
        // duplica o conteúdo para o loop transladar perfeitamente
        track.innerHTML += track.innerHTML;
    }

    // ===== Cardápio tabs =====
    const days = $$(".cardapio__day");
    const panels = $$(".cardapio__panel");

    // Ativa a aba correspondente ao dia da semana (1..6 = Seg a Sáb).
    const today = new Date().getDay();
    let startDay = today >= 1 && today <= 6 ? today - 1 : 0;

    days.forEach((day) => {
        day.addEventListener("click", () => {
            setDay(parseInt(day.dataset.day, 10));
        });
    });

    function setDay(i) {
        days.forEach((d) => d.classList.toggle("active", parseInt(d.dataset.day, 10) === i));
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

    // ===== Animated counters (números) =====
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

    // ===== Smooth anchor (offset do navbar + topbar) =====
    $$('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const target = $(a.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            const offset = 84; // navbar + topbar
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: "smooth",
            });
        });
    });
})();