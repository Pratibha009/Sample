// Optional carousel handlers (guarded by null checks)
const sections = document.querySelector('.sections');
const sectionItems = document.querySelectorAll('.section1');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentIndex = 0;

function showSection(index) {
    if (!sections) return;
    const totalWidth = sections.clientWidth;
    sections.style.transform = `translateX(-${index * totalWidth}px)`;
}

if (prevButton && nextButton && sections && sectionItems.length) {
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : sectionItems.length - 1;
        showSection(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < sectionItems.length - 1) ? currentIndex + 1 : 0;
        showSection(currentIndex);
    });

    // Initial display
    showSection(currentIndex);
}

// Hero stats counter animation
function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * (target - start) + start);
        element.textContent = value.toString();
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statSpans = document.querySelectorAll('.hero-stats .stat span[data-count]');
if (statSpans.length) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statSpans.forEach(span => {
                    const target = parseInt(span.getAttribute('data-count') || '0', 10);
                    animateCounter(span, target);
                });
                obs.disconnect();
            }
        });
    }, { threshold: 0.2 });

    const hero = document.querySelector('.hero');
    if (hero) observer.observe(hero);
}

// Subtle tilt/parallax effect on hero image
const heroImage = document.querySelector('.hero-image img');
const supportsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroImage && !supportsReducedMotion) {
    const container = heroImage.closest('.hero-image');
    if (container) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroImage.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
            heroImage.style.transition = 'transform .06s ease-out';
        });
        container.addEventListener('mouseleave', () => {
            heroImage.style.transform = 'none';
            heroImage.style.transition = 'transform .25s ease';
        });
    }
}

// Tabs behavior in hero
const tabServices = document.getElementById('tab-services');
const tabCareers = document.getElementById('tab-careers');
const panelServices = document.getElementById('panel-services');
const panelCareers = document.getElementById('panel-careers');

function activateTab(target) {
    if (!tabServices || !tabCareers || !panelServices || !panelCareers) return;
    const isServices = target === 'services';
    tabServices.classList.toggle('active', isServices);
    tabCareers.classList.toggle('active', !isServices);
    tabServices.setAttribute('aria-selected', String(isServices));
    tabCareers.setAttribute('aria-selected', String(!isServices));
    panelServices.classList.toggle('active', isServices);
    panelCareers.classList.toggle('active', !isServices);
}

if (tabServices && tabCareers) {
    tabServices.addEventListener('click', () => activateTab('services'));
    tabCareers.addEventListener('click', () => activateTab('careers'));
}

// Search action (basic behavior)
const heroSearch = document.querySelector('.hero-search');
if (heroSearch) {
    const input = heroSearch.querySelector('input');
    const button = heroSearch.querySelector('button');
    const go = () => {
        if (!input) return;
        const q = (input.value || '').trim().toLowerCase();
        if (!q) return;
        if (q.includes('track')) {
            window.location.href = 'services.html#tracking';
        } else if (q.includes('career') || q.includes('job')) {
            window.location.href = 'careers.html';
        } else {
            window.location.href = 'services.html';
        }
    };
    if (button) button.addEventListener('click', go);
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
}
