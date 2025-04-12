/**
 * Homesalid: Realms of the Forgotten Path
 * Interactive JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('D&D Campaign Site Initialized');
    initNavigation();
    initTooltips();
    initAccordions();
    initImageGalleries();
});

/**
 * Initialize responsive navigation
 */
function initNavigation() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', function() {
            navContainer.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Add dropdown functionality for touch devices
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        if ('ontouchstart' in window) {
            const link = dropdown.querySelector('a');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (link && content) {
                link.addEventListener('click', function(e) {
                    // Only prevent default if dropdown has content
                    if (content.children.length > 0) {
                        e.preventDefault();
                        
                        // Close all other dropdowns
                        dropdowns.forEach(other => {
                            if (other !== dropdown) {
                                other.querySelector('.dropdown-content')?.classList.remove('active');
                            }
                        });
                        
                        // Toggle this dropdown
                        content.classList.toggle('active');
                    }
                });
            }
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.classList.remove('active');
            });
        }
    });
}

/**
 * Initialize tooltips for game terms and references
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.classList.add('tooltip-trigger');
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        element.appendChild(tooltip);
        
        // Position tooltip on hover/focus
        element.addEventListener('mouseenter', positionTooltip);
        element.addEventListener('focus', positionTooltip);
    });
    
    function positionTooltip() {
        const tooltip = this.querySelector('.tooltip');
        if (!tooltip) return;
        
        // Reset position to calculate correct dimensions
        tooltip.style.left = '0';
        tooltip.style.top = '0';
        
        // Get dimensions
        const triggerRect = this.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Position tooltip centered and above the element
        let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + scrollLeft;
        let top = triggerRect.top - tooltipRect.height - 10 + scrollTop;
        
        // Keep tooltip within viewport
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        
        // If tooltip would appear above viewport, show it below the element instead
        if (top < scrollTop + 10) {
            top = triggerRect.bottom + 10 + scrollTop;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }
}

/**
 * Initialize accordion elements for collapsible content
 */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const headers = accordion.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                
                // Toggle this content
                this.classList.toggle('active');
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                
                // If accordion has 'single-open' class, close other sections
                if (accordion.classList.contains('single-open')) {
                    headers.forEach(otherHeader => {
                        if (otherHeader !== header) {
                            otherHeader.classList.remove('active');
                            otherHeader.nextElementSibling.style.maxHeight = null;
                        }
                    });
                }
            });
        });
        
        // Open the first item by default if accordion has 'first-open' class
        if (accordion.classList.contains('first-open') && headers.length > 0) {
            headers[0].click();
        }
    });
}

/**
 * Initialize image galleries with lightbox functionality
 */
function initImageGalleries() {
    const galleries = document.querySelectorAll('.image-gallery');
    
    // Create lightbox elements if they don't exist
    let lightbox = document.getElementById('lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&lsaquo;</button>
                <button class="lightbox-next">&rsaquo;</button>
                <div class="lightbox-image-container">
                    <img class="lightbox-image" src="" alt="">
                </div>
                <div class="lightbox-caption"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Close lightbox when clicking close button or outside the image
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox('prev');
                    break;
                case 'ArrowRight':
                    navigateLightbox('next');
                    break;
            }
        });
        
        // Navigation buttons
        lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
            navigateLightbox('prev');
        });
        
        lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
            navigateLightbox('next');
        });
    }
    
    // Process each gallery
    galleries.forEach(gallery => {
        const galleryImages = gallery.querySelectorAll('img');
        
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                openLightbox(gallery, index);
            });
            
            // Make images keyboard accessible
            img.setAttribute('tabindex', '0');
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(gallery, index);
                }
            });
        });
    });
    
    function openLightbox(gallery, index) {
        const images = gallery.querySelectorAll('img');
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        // Store current gallery and index
        lightbox.dataset.gallery = Array.from(galleries).indexOf(gallery);
        lightbox.dataset.index = index;
        
        // Set image and caption
        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt;
        caption.textContent = images[index].getAttribute('data-caption') || '';
        
        // Show lightbox
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
        
        // Update navigation visibility
        updateLightboxNav(gallery, index);
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }
    
    function navigateLightbox(direction) {
        const galleryIndex = parseInt(lightbox.dataset.gallery);
        let currentIndex = parseInt(lightbox.dataset.index);
        const gallery = galleries[galleryIndex];
        const images = gallery.querySelectorAll('img');
        
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % images.length;
        } else {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
        }
        
        openLightbox(gallery, currentIndex);
    }
    
    function updateLightboxNav(gallery, index) {
        const images = gallery.querySelectorAll('img');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        // Hide navigation buttons if only one image
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        
        // Show both buttons
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

/**
 * Dice roller functionality for interactive elements
 */
class DiceRoller {
    constructor() {
        this.diceTypes = [4, 6, 8, 10, 12, 20, 100];
        this.initRollers();
    }
    
    initRollers() {
        const rollerElements = document.querySelectorAll('.dice-roller');
        
        rollerElements.forEach(roller => {
            // Create dice buttons
            const diceContainer = document.createElement('div');
            diceContainer.className = 'dice-container';
            
            this.diceTypes.forEach(diceType => {
                const diceBtn = document.createElement('button');
                diceBtn.className = 'dice-btn';
                diceBtn.textContent = `d${diceType}`;
                diceBtn.setAttribute('data-dice', diceType);
                
                diceBtn.addEventListener('click', () => {
                    this.rollDice(diceType, roller);
                });
                
                diceContainer.appendChild(diceBtn);
            });
            
            // Create result display
            const resultDisplay = document.createElement('div');
            resultDisplay.className = 'dice-result';
            resultDisplay.innerHTML = '<span>Roll the dice!</span>';
            
            // Add elements to roller
            roller.appendChild(diceContainer);
            roller.appendChild(resultDisplay);
        });
    }
    
    rollDice(sides, rollerElement) {
        const result = Math.floor(Math.random() * sides) + 1;
        const resultDisplay = rollerElement.querySelector('.dice-result');
        
        // Animate result
        resultDisplay.innerHTML = '';
        resultDisplay.classList.add('rolling');
        
        // Display random numbers during animation
        let animationCount = 0;
        const animationInterval = setInterval(() => {
            resultDisplay.innerHTML = `<span>${Math.floor(Math.random() * sides) + 1}</span>`;
            animationCount++;
            
            if (animationCount >= 10) {
                clearInterval(animationInterval);
                resultDisplay.classList.remove('rolling');
                
                // Show final result with styling based on roll quality
                let resultClass = '';
                if (result === sides) {
                    resultClass = 'critical-success';
                } else if (result === 1) {
                    resultClass = 'critical-fail';
                } else if (result >= sides * 0.7) {
                    resultClass = 'good-roll';
                } else if (result <= sides * 0.3) {
                    resultClass = 'poor-roll';
                }
                
                resultDisplay.innerHTML = `
                    <span class="${resultClass}">
                        ${result}
                    </span>
                    <small>d${sides}</small>
                `;
            }
        }, 50);
    }
}

// Initialize dice roller if elements exist
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dice-roller')) {
        new DiceRoller();
    }
});

/**
 * Character sheet interactive elements
 */
class CharacterSheet {
    constructor(formElement) {
        this.form = formElement;
        this.initializeForm();
        this.attachEventListeners();
    }
    
    initializeForm() {
        // Calculate derived stats on load
        this.calculateModifiers();
        this.calculateSavingThrows();
        this.calculateSkillModifiers();
    }
    
    attachEventListeners() {
        // Update modifiers when ability scores change
        const abilityInputs = this.form.querySelectorAll('.ability-score');
        abilityInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.calculateModifiers();
                this.calculateSavingThrows();
                this.calculateSkillModifiers();
            });
        });
        
        // Update proficiency-dependent values when proficiency bonus changes
        const profBonusInput = this.form.querySelector('#proficiency-bonus');
        if (profBonusInput) {
            profBonusInput.addEventListener('change', () => {
                this.calculateSavingThrows();
                this.calculateSkillModifiers();
            });
        }
        
        // Update skill modifiers when proficiency checkboxes change
        const profCheckboxes = this.form.querySelectorAll('.skill-proficiency');
        profCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.calculateSkillModifiers();
            });
        });
    }
    
    calculateModifiers() {
        const abilityInputs = this.form.querySelectorAll('.ability-score');
        
        abilityInputs.forEach(input => {
            const score = parseInt(input.value) || 10;
            const modifier = Math.floor((score - 10) / 2);
            const modifierDisplay = input.closest('.ability-block').querySelector('.ability-modifier');
            
            if (modifierDisplay) {
                modifierDisplay.textContent = modifier >= 0 ? `+${modifier}` : modifier;
            }
        });
    }
    
    calculateSavingThrows() {
        const abilityInputs = this.form.querySelectorAll('.ability-score');
        const profBonus = parseInt(this.form.querySelector('#proficiency-bonus')?.value) || 2;
        
        abilityInputs.forEach(input => {
            const ability = input.id.replace('score-', '');
            const score = parseInt(input.value) || 10;
            const modifier = Math.floor((score - 10) / 2);
            
            const saveProficient = this.form.querySelector(`#save-${ability}-prof`)?.checked || false;
            const saveModifier = saveProficient ? modifier + profBonus : modifier;
            
            const saveDisplay = this.form.querySelector(`#save-${ability}`);
            if (saveDisplay) {
                saveDisplay.textContent = saveModifier >= 0 ? `+${saveModifier}` : saveModifier;
            }
        });
    }
    
    calculateSkillModifiers() {
        const skillElements = this.form.querySelectorAll('.skill-item');
        const profBonus = parseInt(this.form.querySelector('#proficiency-bonus')?.value) || 2;
        
        skillElements.forEach(skillElement => {
            const skillAbility = skillElement.getAttribute('data-ability');
            const isProficient = skillElement.querySelector('.skill-proficiency')?.checked || false;
            const isExpertise = skillElement.querySelector('.skill-expertise')?.checked || false;
            
            // Get the ability modifier
            const abilityScore = parseInt(this.form.querySelector(`#score-${skillAbility}`)?.value) || 10;
            const abilityMod = Math.floor((abilityScore - 10) / 2);
            
            // Calculate skill modifier
            let skillMod = abilityMod;
            if (isExpertise) {
                skillMod += (profBonus * 2);
            } else if (isProficient) {
                skillMod += profBonus;
            }
            
            // Update display
            const modDisplay = skillElement.querySelector('.skill-modifier');
            if (modDisplay) {
                modDisplay.textContent = skillMod >= 0 ? `+${skillMod}` : skillMod;
            }
        });
    }
}

// Initialize character sheets if they exist
document.addEventListener('DOMContentLoaded', function() {
    const characterSheets = document.querySelectorAll('.character-sheet-form');
    characterSheets.forEach(sheet => {
        new CharacterSheet(sheet);
    });
});