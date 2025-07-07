document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Gabriel AI - Initializing...');
    
    // Mobile sidebar toggles
    const leftSidebar = document.querySelector('.sidebar-left');
    const rightSidebar = document.querySelector('.sidebar-right');
    
    if (leftSidebar) {
        leftSidebar.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('expanded');
                if (rightSidebar) rightSidebar.classList.remove('expanded');
            }
        });
    }
    
    if (rightSidebar) {
        rightSidebar.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('expanded');
                if (leftSidebar) leftSidebar.classList.remove('expanded');
            }
        });
    }
    
    // Close sidebars when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const clickedSidebar = e.target.closest('.sidebar-left') || e.target.closest('.sidebar-right');
            if (!clickedSidebar) {
                if (leftSidebar) leftSidebar.classList.remove('expanded');
                if (rightSidebar) rightSidebar.classList.remove('expanded');
            }
        }
    });
    
    console.log('✅ Platform initialized');
});
