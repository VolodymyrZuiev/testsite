// Mobile Menu Toggle & Navigation handling
const menuBtn = document.querySelector('.menu-btn');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-link');

if (menuBtn && mainNav) {
    menuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const isExpanded = mainNav.classList.contains('active');
        menuBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Active Nav Link on Scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Cursor Animation (Only for desktop)
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2; 
let followerX = mouseX, followerY = mouseY;

if (!isTouchDevice && cursor && follower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        target.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// Canvas Background (Animated Organic Grid)
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let squares = [];
    const squareSize = 50; 

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initGrid();
    }
    window.addEventListener('resize', resize);

    function initGrid() {
        squares = [];
        const cols = Math.ceil(width / squareSize);
        const rows = Math.ceil(height / squareSize);
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                squares.push({
                    x: i * squareSize,
                    y: j * squareSize,
                    gridX: i,
                    gridY: j,
                    baseOpacity: Math.random() * 0.03, 
                    targetOpacity: Math.random() * 0.06,
                    speed: (Math.random() * 0.001) + 0.0005
                });
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        const time = Date.now();

        squares.forEach(sq => {
            if (Math.abs(sq.baseOpacity - sq.targetOpacity) < 0.01) {
                sq.targetOpacity = Math.random() * 0.06; 
            }
            if (sq.baseOpacity < sq.targetOpacity) sq.baseOpacity += sq.speed;
            else sq.baseOpacity -= sq.speed;

            let hoverGlow = 0;
            
            if (!isTouchDevice) {
                const cx = sq.x + squareSize / 2;
                const cy = sq.y + squareSize / 2;
                const dist = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2);
                const maxRadius = 320; 

                if (dist < maxRadius) {
                    const falloff = 1 - (dist / maxRadius); 
                    const noise = (Math.sin(sq.gridX * 0.6 + time * 0.002) * Math.cos(sq.gridY * 0.6 - time * 0.0015)) * 0.5 + 0.5; 
                    const randomShapeFactor = falloff * 0.6 + noise * falloff * 0.4;

                    if (randomShapeFactor > 0.15) {
                        hoverGlow = Math.pow(randomShapeFactor, 1.5) * 0.4; 
                    }
                }
            }

            const finalOpacity = Math.max(0, Math.min(1, sq.baseOpacity + hoverGlow));

            ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
            ctx.fillRect(sq.x, sq.y, squareSize - 1, squareSize - 1); 
        });

        requestAnimationFrame(animateCanvas);
    }
    resize();
    animateCanvas();
}

// Scroll Reveal Observer
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

// Accordion Logic (A11y improved)
const accordions = document.querySelectorAll('.accordion-item');
if (accordions.length > 0) {
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // Close all
            accordions.forEach(item => {
                item.classList.remove('active');
                item.setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard support
        acc.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Staggered Animations for new sections
const staggeredSections = document.querySelectorAll('#selected-work, #built-with');
if (staggeredSections.length > 0) {
    const staggerObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.stagger-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, index * 80); 
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    staggeredSections.forEach(sec => staggerObserver.observe(sec));
}