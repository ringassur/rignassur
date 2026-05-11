/**
 * RingAssur Pro - Premium JavaScript Features
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initHeroBgSlider();
    initMicroInteractions();
    initCustomCursor();
    initScrollReveal();
    initStatsCounter();
    initFAQ();
    initMultiStepForm();
    initFormSubmission();
});

/**
 * Global Form Submission to Google Sheets
 */
function initFormSubmission() {
    const forms = document.querySelectorAll(".demande-form");

    forms.forEach(form => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            let message = "📩 Nouvelle Demande\n\n";
            message += `Service: ${form.dataset.service}\n\n`;

            const data = { service: form.dataset.service };
            formData.forEach((value, key) => {
                message += `${key}: ${value}\n`;
                data[key] = value;
            });

            try {
                // 1. Envoi à Telegram (Instantanné et fiable)
                const telegramPromise = fetch("https://api.telegram.org/bot8355209506:AAEmVuWTL2JFkaGtXgaWiB8Hpwq-GB66MUc/sendMessage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: "6315183878",
                        text: message
                    })
                });

                // 2. Envoi à Google Sheets (Backup / Spécifique RC Décennale)
                let sheetsUrl = "https://script.google.com/macros/s/AKfycbw2l5pOXGBuhPimez8tt9tNqD0DUxNJ4zUMeWogftHRYoc3k8owYw9Er8Ig2YZ2nrX16A/exec";
                
                // Si c'est le service RC Décennale, on utilise l'URL spécifique
                if (form.dataset.service === "RC Décennale") {
                    sheetsUrl = "https://script.google.com/macros/s/AKfycbwdlnJ43d0HrJMl0JCMMaYzaZhdCbnj6y5806gZAOJTQd-2_oP53_npTdM3M6rdKqjx/exec";
                }

                const sheetsPromise = fetch(sheetsUrl, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(data)
                });

                // On attend au moins Telegram
                await telegramPromise;

                // Design du message de succès (Premium)
                const successHTML = `
                            <div class="quote-success-state">
                                <div class="quote-success-icon"><i class="fas fa-check"></i></div>
                                <h3>Demande Reçue !</h3>
                                <p>Votre demande a été envoyée avec succès. Un conseiller RingAssur vous contactera très rapidement pour vous proposer les meilleures offres.</p>
                                <p class="quote-success-note">Notre équipe est disponible du lundi au vendredi pour vous accompagner.</p>
                                <a class="btn btn-primary btn-full" href="index.html">Retour à l'accueil</a>
                            </div>
                        `;

                const container = form.closest('.form-premium-card') || form.closest('.contact-form-container') || form.parentElement;
                
                if (container) {
                    // Animation de sortie
                    form.style.opacity = '0';
                    form.style.transform = 'translateY(-10px)';
                    form.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        container.innerHTML = successHTML;
                        
                        // Cacher la barre de progression si on est sur quote.html
                        const progressMinimal = document.querySelector('.form-progress-minimal');
                        if (progressMinimal) progressMinimal.style.display = 'none';

                        window.scrollTo({ top: container.offsetTop - 100, behavior: 'smooth' });
                    }, 300);
                } else {
                    alert("Votre demande a été envoyée avec succès !");
                    form.reset();
                }

            } catch (error) {
                console.error(error);
                alert("حدث خطأ");
            }
        });
    });
}

/**
 * Partners logos auto switch every 3 seconds
 */
/**
 * Hero background image slider (smooth crossfade, same cover area)
 */
function initHeroBgSlider() {
    const slider = document.getElementById('hero-bg-slider');
    if (!slider) return;

    const gradient = 'linear-gradient(to right, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.2) 100%)';
    const urls = [
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80',
       
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80'
    ];

    const layers = slider.querySelectorAll('.hero-bg-slide');
    if (layers.length < 2) return;

    let currentIdx = 0;
    let front = 0;

    function setLayerBg(layer, index) {
        const u = urls[index % urls.length];
        layer.style.backgroundImage = `${gradient}, url('${u}')`;
    }

    setLayerBg(layers[0], 0);
    setLayerBg(layers[1], 1);

    setInterval(() => {
        const nextIdx = (currentIdx + 1) % urls.length;
        const hidden = 1 - front;
        setLayerBg(layers[hidden], nextIdx);
        layers[front].classList.remove('is-active');
        layers[hidden].classList.add('is-active');
        front = hidden;
        currentIdx = nextIdx;
    }, 3000);
}

function initPartnersSwitcher() {
    const partnerLogos = document.querySelectorAll('.partner-logo-img');
    if (!partnerLogos.length) return;

    let showAltSet = false;

    setInterval(() => {
        showAltSet = !showAltSet;

        partnerLogos.forEach((logo) => {
            const defaultSrc = logo.dataset.defaultSrc || logo.getAttribute('src');
            const defaultAlt = logo.dataset.defaultAlt || logo.getAttribute('alt');
            const altSrc = logo.dataset.altSrc;
            const altName = logo.dataset.altName || defaultAlt;

            if (!logo.dataset.defaultSrc) {
                logo.dataset.defaultSrc = defaultSrc;
                logo.dataset.defaultAlt = defaultAlt;
            }

            logo.classList.add('is-switching');

            setTimeout(() => {
                if (showAltSet && altSrc) {
                    logo.setAttribute('src', altSrc);
                    logo.setAttribute('alt', altName);
                } else {
                    logo.setAttribute('src', logo.dataset.defaultSrc);
                    logo.setAttribute('alt', logo.dataset.defaultAlt);
                }
                logo.classList.remove('is-switching');
            }, 200);
        });
    }, 3000);
}

/**
 * Multi-step Form & Dynamic Content for Quote Page
 */
function initMultiStepForm() {
    const quoteForm = document.getElementById('multi-step-quote-form');
    if (!quoteForm) return;

    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const progressFill = document.getElementById('progress-fill');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const successState = document.getElementById('quote-success');
    const currentStepNum = document.getElementById('current-step-num');
    const pSteps = document.querySelectorAll('.p-step');
    
    let currentStep = 1;

    // Configuration for different insurance types
    const insuranceConfigs = {
        'auto': {
            title: 'Assurance Auto',
            icon: 'fa-car',
            bg: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
            step2Title: 'Détails du véhicule',
            fields: [
                { label: 'Marque du véhicule', type: 'text', placeholder: 'Ex: Peugeot' },
                { label: 'Modèle', type: 'text', placeholder: 'Ex: 208' },
                { label: 'Année de mise en circulation', type: 'number', placeholder: '2020' },
                { label: 'Type d\'usage', type: 'select', options: ['Usage privé', 'Usage Pro'] }
            ]
        },
        'moto': {
            title: 'Assurance Moto',
            icon: 'fa-motorcycle',
            bg: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
            step2Title: 'Détails de la moto',
            fields: [
                { label: 'Cylindrée', type: 'text', placeholder: 'Ex: 600cc' },
                { label: 'Marque', type: 'text', placeholder: 'Ex: Yamaha' },
                { label: 'Type de permis', type: 'select', options: ['A', 'A1', 'A2'] }
            ]
        },
        'habitation': {
            title: 'Assurance Habitation',
            icon: 'fa-home',
            bg: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
            step2Title: 'Détails du logement',
            fields: [
                { label: 'Type de logement', type: 'select', options: ['Appartement', 'Maison'] },
                { label: 'Nombre de pièces', type: 'number', placeholder: '3' },
                { label: 'Surface (m²)', type: 'number', placeholder: '60' },
                { label: 'Code Postal', type: 'text', placeholder: '75000' }
            ]
        },
        'mutuelle': {
            title: 'Mutuelle Santé',
            icon: 'fa-heartbeat',
            bg: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528',
            step2Title: 'Votre profil santé',
            fields: [
                { label: 'Régime social', type: 'select', options: ['Salarié', 'Indépendant', 'Sans emploi', 'Retraité'] },
                { label: 'Nombre de personnes à assurer', type: 'number', placeholder: '1' },
                { label: 'Niveau de couverture souhaité', type: 'select', options: ['Économique', 'Standard', 'Premium'] }
            ]
        },
        'decennale': {
            title: 'RC Décennale',
            icon: 'fa-tools',
            bg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
            step2Title: 'Votre activité',
            fields: [
                { label: 'Activité principale', type: 'text', placeholder: 'Ex: Maçonnerie' },
                { label: 'Chiffre d\'affaires annuel', type: 'number', placeholder: '50000' },
                { label: 'Date de création entreprise', type: 'date' }
            ]
        },
        'animaux': {
            title: 'Assurance Animaux',
            icon: 'fa-paw',
            bg: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e',
            step2Title: 'Votre compagnon',
            fields: [
                { label: 'Type d\'animal', type: 'select', options: ['Chien', 'Chat', 'Autre'] },
                { label: 'Nom de l\'animal', type: 'text', placeholder: 'Ex: Rex' },
                { label: 'Âge de l\'animal', type: 'number', placeholder: '3' }
            ]
        },
        'rachat-credit': {
            title: 'Rachat de Crédit',
            icon: 'fa-hand-holding-usd',
            bg: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
            step2Title: 'Votre situation financière',
            fields: [
                { label: 'Montant total des crédits', type: 'number', placeholder: '20000' },
                { label: 'Mensualité actuelle souhaitée', type: 'number', placeholder: '500' },
                { label: 'Type de rachat', type: 'select', options: ['Consommation', 'Immobilier', 'Mixte'] }
            ]
        },
        'regroupement-credit': {
            title: 'Regroupement Crédit',
            icon: 'fa-piggy-bank',
            bg: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572',
            step2Title: 'Détails du regroupement',
            fields: [
                { label: 'Nombre de crédits à regrouper', type: 'number', placeholder: '2' },
                { label: 'Revenus mensuels du foyer', type: 'number', placeholder: '3000' },
                { label: 'Statut professionnel', type: 'select', options: ['CDI', 'CDD', 'Indépendant', 'Retraité'] }
            ]
        }
    };

    // Initialize dynamic content based on URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'auto';
    const config = insuranceConfigs[type] || insuranceConfigs['auto'];

    const titleEl = document.getElementById('quote-title');
    const iconEl = document.getElementById('quote-icon');
    const bgEl = document.getElementById('quote-bg');
    const step2TitleEl = document.getElementById('step-2-title');
    const step2Content = document.getElementById('step-2-content');

    if (titleEl) titleEl.innerText = config.title;
    if (iconEl) iconEl.innerHTML = `<i class="fas ${config.icon}"></i>`;
    if (bgEl) bgEl.style.backgroundImage = `url('${config.bg}')`;
    if (step2TitleEl) step2TitleEl.innerText = config.step2Title;

    // Set data-service dynamically for the multi-step form
    quoteForm.dataset.service = config.title;

    if (step2Content) {
        step2Content.innerHTML = ''; // Clear existing
        config.fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.innerText = field.label;
            group.appendChild(label);

            const fieldName = field.label.toLowerCase().replace(/[^a-z0-9]/g, '_');

            if (field.type === 'select') {
                const select = document.createElement('select');
                select.name = fieldName;
                field.options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.toLowerCase();
                    o.innerText = opt;
                    select.appendChild(o);
                });
                group.appendChild(select);
            } else {
                const input = document.createElement('input');
                input.type = field.type;
                input.name = fieldName;
                if (field.placeholder) input.placeholder = field.placeholder;
                input.required = true;
                group.appendChild(input);
            }
            step2Content.appendChild(group);
        });
    }

    // Step navigation logic
    function updateStep(n) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === n - 1);
        });
        
        if (pSteps.length > 0) {
            pSteps.forEach((pStep, index) => {
                pStep.classList.toggle('active', index === n - 1);
            });
        }

        if (currentStepNum) currentStepNum.innerText = n;
        
        if (progressFill) {
            progressFill.style.width = `${(n / steps.length) * 100}%`;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < steps.length) {
                currentStep++;
                updateStep(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStep(currentStep);
            }
        });
    });

    // Form submission is handled by the global initFormSubmission handler
}

/**
 * Navbar Scroll Effect
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link on scroll
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileBtn || !navMenu) return;

    const navLinks = document.querySelectorAll('.nav-link');
    
    // Create backdrop if it doesn't exist
    let backdrop = document.querySelector('.menu-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.appendChild(backdrop);
    }

    function closeMobileMenu() {
        if (navMenu) navMenu.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (mobileBtn) {
            mobileBtn.classList.remove('active');
            mobileBtn.style.opacity = '1';
            mobileBtn.style.visibility = 'visible';
            mobileBtn.style.pointerEvents = 'auto';
        }
        document.body.style.overflow = 'auto';
    }

    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            if (navMenu) navMenu.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            if (mobileBtn) mobileBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
    });
    if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

    // Handle all links inside the menu to close it after click (except dropdown parents)
    const allMenuLinks = navMenu.querySelectorAll('a');
    allMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isDropdownParent = link.parentElement.classList.contains('dropdown');
            
            if (window.innerWidth <= 768) {
                if (isDropdownParent) {
                    // It's a dropdown toggle, don't close the menu
                    e.preventDefault();
                    e.stopPropagation(); // Stop bubbling to backdrop
                    link.parentElement.classList.toggle('active');
                    
                    // Rotate icon
                    const icon = link.querySelector('i');
                    if (icon) {
                        icon.style.transform = link.parentElement.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                } else {
                    // It's a normal link or a sub-menu link, close the menu
                    closeMobileMenu();
                }
            }
        });
    });
}

/**
 * Custom Cursor
 */
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;

    // Check if device is touch-enabled
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Smooth follower
        setTimeout(() => {
            follower.style.left = e.clientX - 16 + 'px';
            follower.style.top = e.clientY - 16 + 'px';
        }, 50);
    });

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .service-card, .faq-question');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(3)';
            cursor.style.background = 'rgba(0, 82, 255, 0.2)';
            follower.style.transform = 'scale(1.5)';
            follower.style.background = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--primary)';
            follower.style.transform = 'scale(1)';
            follower.style.background = 'rgba(0, 82, 255, 0.05)';
        });
    });
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const baseDelay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
                const viewportFactor = Math.min(Math.max(window.innerWidth / 1440, 0.75), 1.1);
                const delay = Math.round(baseDelay * viewportFactor);
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px'
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));
}

/**
 * Micro-interactions for cards and buttons
 */
function initMicroInteractions() {
    const cards = document.querySelectorAll('.service-card, .advantage-item-new, .faq-item, .timeline-content');
    cards.forEach((card) => {
        card.classList.add('interactive-card');
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/**
 * Statistics Counter
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const count = parseInt(el.innerText);
        const speed = 2000 / target; // Adjust duration

        if (count < target) {
            el.innerText = Math.ceil(count + (target / 100));
            setTimeout(() => countUp(el), speed);
        } else {
            el.innerText = target;
        }
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Independent toggle: only clicked item changes state
            item.classList.toggle('active');
        });
    });
}


