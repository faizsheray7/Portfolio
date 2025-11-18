// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animated counter for stats
const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate stats
            if (entry.target.classList.contains('about')) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (!stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateCounter(stat, target);
                    }
                });
            }
            
            // Animate skill bars
            if (entry.target.classList.contains('skills')) {
                const skillBars = document.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    if (!bar.classList.contains('animated')) {
                        bar.classList.add('animated');
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 100);
                    }
                });
            }
        }
    });
}, observerOptions);

// Observe all sections
const sections = document.querySelectorAll('section');
sections.forEach(section => observer.observe(section));

// Form submission with EmailJS
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // EmailJS parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            to_email: 'fsheray32@gmail.com'
        };

        // Send email using EmailJS
        emailjs.send('service_oo54qyh', 'template_2lvke0c', templateParams, '0f1RgA7X_g1D8MYRu')
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                showModal(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
                contactForm.reset();
            }, (error) => {
                console.log('FAILED...', error);
                showModal('Sorry, there was an error sending your message. Please try again later or contact me directly at fsheray32@gmail.com', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Add parallax effect to hero section
let parallaxElement = document.querySelector('.hero-background');
if (parallaxElement) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElement.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// Add active state to navigation links based on scroll position
const updateActiveNavLink = () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// Add typing effect to name
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

const startSkillTyping = () => {
    const typingSkillElement = document.querySelector('.typing-skill');
    if (!typingSkillElement) return;

    const defaultSkills = [
        'HTML5 & CSS3',
        'JavaScript (ES6+)',
        'Bootstrap',
        'React.js',
        'Node.js',
        'MongoDB',
        'MySQL',
        'Express.js'
    ];

    const skills = typingSkillElement.dataset.skills
        ? typingSkillElement.dataset.skills.split('|').map(skill => skill.trim()).filter(Boolean)
        : defaultSkills;

    if (!skills.length) return;

    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentSkill = skills[skillIndex];

        if (!isDeleting) {
            charIndex++;
            typingSkillElement.textContent = currentSkill.slice(0, charIndex);

            if (charIndex === currentSkill.length) {
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, 2000);
                return;
            }
        } else {
            charIndex--;
            typingSkillElement.textContent = currentSkill.slice(0, charIndex);

            if (charIndex === 0) {
                isDeleting = false;
                skillIndex = (skillIndex + 1) % skills.length;
            }
        }

        const delay = isDeleting ? 60 : 120;
        setTimeout(type, delay);
    };

    setTimeout(type, 600);
};

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.getAttribute('data-text') || nameElement.textContent.trim();
        typeWriter(nameElement, originalText, 150);
    }

    startSkillTyping();
});

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add scroll to top button (optional enhancement)
const createScrollToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
};

// Initialize scroll to top button
createScrollToTop();

// Add reveal animation on scroll
const revealElements = () => {
    const elements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    entry.target.style.transition = 'all 0.6s ease';
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 50);
                    revealObserver.unobserve(entry.target);
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        revealObserver.observe(element);
    });
};

// Initialize reveal animations
revealElements();

// Prevent default form submission behavior
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
});

// Add animation to social links
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach((link, index) => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px) rotate(5deg)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) rotate(0)';
    });
});

// Custom Modal Functions
function showModal(message, type = 'success') {
    const modal = document.getElementById('customModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalBody = modal.querySelector('.modal-body');
    const modalIcon = modal.querySelector('.modal-icon');

    // Set message
    modalMessage.textContent = message;

    // Reset classes
    modalBody.classList.remove('success', 'error');

    // Set type-specific styling
    if (type === 'success') {
        modalBody.classList.add('success');
        modalIcon.className = 'modal-icon fas fa-check-circle';
    } else if (type === 'error') {
        modalBody.classList.add('error');
        modalIcon.className = 'modal-icon fas fa-exclamation-triangle';
    }

    // Show modal
    modal.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeModal();
    }, 5000);

    // Close modal when clicking the close button
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = closeModal;

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };
}

function closeModal() {
    const modal = document.getElementById('customModal');
    modal.style.display = 'none';
}

console.log('Portfolio loaded successfully! ');

