document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menu-button.w-nav-button');
    const navMenu = document.querySelector('.nav-menu.w-nav-menu');
    const navOverlay = document.querySelector('.w-nav-overlay');
    
    if (menuButton && navMenu && navOverlay) {
        menuButton.addEventListener('click', function() {
            // Toggle aria-expanded
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle menu visibility
            navMenu.classList.toggle('w--open');
            navOverlay.classList.toggle('w--open');
            
            // Toggle menu button state
            menuButton.classList.toggle('w--open');
        });
        
        // Close menu when clicking outside
        navOverlay.addEventListener('click', function() {
            menuButton.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('w--open');
            navOverlay.classList.remove('w--open');
            menuButton.classList.remove('w--open');
        });
    }
}); 