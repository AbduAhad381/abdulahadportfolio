/* Main site scripts — preloader, typing, projects, mobile menu, contact form */

(function () {
    'use strict';

    // --- Preloader ---
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        var body = document.body;
        if (!preloader) {
            initTypingAnimation();
            return;
        }

        var totalLoadTime = 3500;
        setTimeout(function () {
            preloader.style.opacity = '0';
            setTimeout(function () {
                preloader.style.display = 'none';
                if (body) body.classList.remove('no-scroll');
                initTypingAnimation();
            }, 500);
        }, totalLoadTime);
    });

    // --- Typing animation ---
    function initTypingAnimation() {
        var typingTextElement = document.getElementById('typing-text');
        if (!typingTextElement) return;

        var words = [
            'Full-Stack Developer',
            'Laravel Developer',
            'React Developer',
            'API Integrator',
            'Web Application Builder'
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

            loadMoreButton.textContent = '<< HIDE PROJECTS';
            loadMoreButton.classList.remove('text-neon', 'border-neon', 'hover:bg-neon', 'hover:text-gray-900', 'shadow-neon');
            loadMoreButton.classList.add('bg-gray-700', 'text-gray-400', 'border-gray-700', 'hover:bg-gray-700/80', 'shadow-lg');
            allProjectsLoaded = true;
        } else {
            allExtraProjects.forEach(function (project) {
                project.classList.add('project-hidden');
            });

            loadMoreButton.textContent = 'VIEW ALL >>';
            loadMoreButton.classList.remove('bg-gray-700', 'text-gray-400', 'border-gray-700', 'hover:bg-gray-700/80', 'shadow-lg');
            loadMoreButton.classList.add('text-neon', 'border-neon', 'hover:bg-neon', 'hover:text-gray-900', 'shadow-neon');
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

            // Append structured inquiry fields to message body for EmailJS template
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
                    submitButton.textContent = 'SUBMIT INQUIRY >>';
                });
        });
    }

    // Initialize EmailJS when available
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('mbxUJJfUrV8luhFyL');
            initContactForm();
        }

        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                disable: 'mobile'
            });
        }
    });
})();
