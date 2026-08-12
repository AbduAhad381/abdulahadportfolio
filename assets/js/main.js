/* Main site scripts — preloader, typing, motion, contact form */

(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Preloader ---
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        var body = document.body;
        if (!preloader) {
            initTypingAnimation();
            initMotionSystems();
            return;
        }

        var totalLoadTime = prefersReducedMotion ? 300 : 1800;
        setTimeout(function () {
            preloader.style.opacity = '0';
            setTimeout(function () {
                preloader.style.display = 'none';
                if (body) body.classList.remove('no-scroll');
                initTypingAnimation();
                initMotionSystems();
            }, 500);
        }, totalLoadTime);
    });

    // --- Typing animation ---
    function initTypingAnimation() {
        var typingTextElement = document.getElementById('typing-text');
        if (!typingTextElement || prefersReducedMotion) {
            if (typingTextElement) typingTextElement.textContent = 'Digital Solutions';
            return;
        }

        var words = [
            'Digital Solutions',
            'Web Applications',
            'eCommerce Stores',
            'SEO & Growth',
            'Business Automation'
        ];
        var wordIndex = 0;
        var charIndex = 0;
        var isDeleting = false;

        function type() {
            var currentWord = words[wordIndex];

            if (isDeleting) {
                typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            var typeSpeed = isDeleting ? 75 : 150;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }

    // --- Load more projects ---
    var allProjectsLoaded = false;

    window.loadMoreProjects = function () {
        var allExtraProjects = document.querySelectorAll('.project-card:nth-child(n+4)');
        var loadMoreButton = document.getElementById('loadMoreButton');
        if (!loadMoreButton || !allExtraProjects.length) return;

        if (!allProjectsLoaded) {
            allExtraProjects.forEach(function (project) {
                project.classList.remove('project-hidden');
            });
            if (typeof AOS !== 'undefined') AOS.refresh();

            loadMoreButton.textContent = 'Show less';
            allProjectsLoaded = true;
        } else {
            allExtraProjects.forEach(function (project) {
                project.classList.add('project-hidden');
            });

            loadMoreButton.textContent = 'View all projects';
            allProjectsLoaded = false;

            var projectsSection = document.getElementById('projects');
            if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // --- Mobile menu ---
    window.toggleMobileMenu = function () {
        var mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) mobileMenu.classList.toggle('hidden');
    };

    // --- Contact form (EmailJS) ---
    function initContactForm() {
        var contactForm = document.getElementById('contactForm');
        if (!contactForm || typeof emailjs === 'undefined') return;

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var statusMessage = document.getElementById('statusMessage');
            var submitButton = contactForm.querySelector('button[type="submit"]');
            var messageField = document.getElementById('message');
            var originalMessage = messageField ? messageField.value : '';

            var company = document.getElementById('company');
            var projectType = document.getElementById('project_type');
            var budget = document.getElementById('budget');
            var services = document.getElementById('services_needed');

            var extraDetails = [
                company && company.value ? 'Company: ' + company.value : '',
                projectType && projectType.value ? 'Project Type: ' + projectType.value : '',
                budget && budget.value ? 'Budget: ' + budget.value : '',
                services && services.value ? 'Services: ' + services.value : ''
            ].filter(Boolean).join('\n');

            if (messageField && extraDetails) {
                messageField.value = extraDetails + '\n\n--- Project Description ---\n' + originalMessage;
            }

            statusMessage.textContent = 'STATUS: Sending...';
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            emailjs.sendForm('service_76bse1v', 'template_lzfq78a', contactForm)
                .then(function () {
                    statusMessage.textContent = 'MESSAGE SENT. We will respond within 1–2 business days.';
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.error('Contact form error:', error);
                    statusMessage.textContent = 'ERROR: Failed to send. Please email us directly.';
                    if (messageField) messageField.value = originalMessage;
                })
                .finally(function () {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Inquiry';
                });
        });
    }

    // --- Motion systems ---
    function initMotionSystems() {
        initScrollProgress();
        initHeaderScroll();
        initHeroStarfield();
        initAvatarSparkles();
        initRevealOnScroll();
        initBackToTop();
        initCardTilt();
    }

    function initScrollProgress() {
        var bar = document.getElementById('scroll-progress');
        if (!bar) return;

        function update() {
            var doc = document.documentElement;
            var scrollTop = doc.scrollTop || document.body.scrollTop;
            var height = doc.scrollHeight - doc.clientHeight;
            var progress = height > 0 ? (scrollTop / height) * 100 : 0;
            bar.style.width = progress + '%';
        }

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    function initHeaderScroll() {
        var header = document.querySelector('.site-header');
        if (!header) return;

        function update() {
            if (window.scrollY > 40) header.classList.add('is-scrolled');
            else header.classList.remove('is-scrolled');
        }

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    function initHeroStarfield() {
        if (prefersReducedMotion) return;
        var canvas = document.getElementById('hero-stars');
        var hero = document.getElementById('hero');
        if (!canvas || !hero) return;

        var ctx = canvas.getContext('2d');
        var stars = [];
        var shooting = [];
        var mouse = { x: 0.5, y: 0.5 };
        var raf;

        function resize() {
            var rect = hero.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            buildStars();
        }

        function buildStars() {
            var count = window.innerWidth < 768 ? 55 : 110;
            stars = [];
            for (var i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.8 + 0.4,
                    a: Math.random() * 0.5 + 0.25,
                    s: Math.random() * 0.4 + 0.1,
                    tw: Math.random() * Math.PI * 2,
                    depth: Math.random() * 0.6 + 0.4
                });
            }
        }

        function spawnShooting() {
            if (Math.random() > 0.012) return;
            shooting.push({
                x: Math.random() * canvas.width * 0.8,
                y: Math.random() * canvas.height * 0.4,
                len: 60 + Math.random() * 80,
                speed: 6 + Math.random() * 5,
                life: 1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var px = (mouse.x - 0.5) * 24;
            var py = (mouse.y - 0.5) * 18;

            for (var i = 0; i < stars.length; i++) {
                var st = stars[i];
                st.tw += 0.03 + st.s * 0.02;
                var twinkle = 0.55 + Math.sin(st.tw) * 0.45;
                var x = st.x + px * st.depth;
                var y = st.y + py * st.depth;
                ctx.beginPath();
                ctx.arc(x, y, st.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(15, 110, 110,' + (st.a * twinkle) + ')';
                ctx.fill();
                if (st.r > 1.2) {
                    ctx.beginPath();
                    ctx.arc(x, y, st.r * 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(120, 190, 220,' + (0.08 * twinkle) + ')';
                    ctx.fill();
                }
            }

            spawnShooting();
            for (var j = shooting.length - 1; j >= 0; j--) {
                var sh = shooting[j];
                sh.x += sh.speed;
                sh.y += sh.speed * 0.45;
                sh.life -= 0.018;
                ctx.beginPath();
                ctx.moveTo(sh.x, sh.y);
                ctx.lineTo(sh.x - sh.len, sh.y - sh.len * 0.45);
                ctx.strokeStyle = 'rgba(15, 110, 110,' + (sh.life * 0.7) + ')';
                ctx.lineWidth = 2;
                ctx.stroke();
                if (sh.life <= 0 || sh.x > canvas.width + 40) shooting.splice(j, 1);
            }

            raf = requestAnimationFrame(draw);
        }

        hero.addEventListener('mousemove', function (e) {
            var rect = hero.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) / rect.width;
            mouse.y = (e.clientY - rect.top) / rect.height;
        }, { passive: true });

        window.addEventListener('resize', resize);
        resize();
        draw();

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) cancelAnimationFrame(raf);
            else draw();
        });
    }

    function initAvatarSparkles() {
        if (prefersReducedMotion) return;
        var wrap = document.getElementById('avatar-sparkles');
        var stage = document.getElementById('avatar-stage');
        if (!wrap) return;

        var count = 16;
        for (var i = 0; i < count; i++) {
            var s = document.createElement('span');
            s.className = 'sparkle';
            var angle = (i / count) * Math.PI * 2;
            var radius = 42 + (i % 3) * 10;
            var left = 50 + Math.cos(angle) * radius;
            var top = 50 + Math.sin(angle) * radius;
            s.style.left = left + '%';
            s.style.top = top + '%';
            s.style.animationDuration = 1.6 + (i % 5) * 0.35 + 's';
            s.style.animationDelay = (i * 0.12) + 's';
            wrap.appendChild(s);
        }

        if (!stage || window.innerWidth < 768) return;
        stage.addEventListener('mousemove', function (e) {
            var rect = stage.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            stage.style.transform = 'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg)';
        });
        stage.addEventListener('mouseleave', function () {
            stage.style.transform = '';
        });
    }

    function initRevealOnScroll() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        items.forEach(function (el) { observer.observe(el); });
    }

    function initBackToTop() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;

        function update() {
            if (window.scrollY > 500) btn.classList.add('is-visible');
            else btn.classList.remove('is-visible');
        }

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    function initCardTilt() {
        if (prefersReducedMotion || window.innerWidth < 1024) return;
        var cards = document.querySelectorAll('.service-card, .project-card, .why-card');

        cards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var midX = rect.width / 2;
                var midY = rect.height / 2;
                var rotateX = ((y - midY) / midY) * -4;
                var rotateY = ((x - midX) / midX) * 4;
                card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('mbxUJJfUrV8luhFyL');
            initContactForm();
        }

        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 900,
                once: true,
                easing: 'ease-out-cubic',
                disable: prefersReducedMotion ? true : 'mobile'
            });
        }

        // If no preloader, start motion early
        if (!document.getElementById('preloader')) {
            initMotionSystems();
        }
    });
})();
