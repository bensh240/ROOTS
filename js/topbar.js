// ============================================
// ROOTS Top Bar Component - Centralized
// עדכון קובץ זה ישפיע על כל הדפים באתר
// ============================================

(function() {
    const topBarHTML = `
        <div class="roots_top_bar_wrapper">
            <div class="content_wrap clearfix roots_top_bar" style="display: flex !important; justify-content: flex-start !important; direction: rtl !important;">
                <div class="roots_top_content" style="display: flex; align-items: center; gap: 20px;">
                    <div class="top_panel_top_contact_area">
                        <span class="icon-location"></span>
                        <span>השדרה האקדמית 2, קרית אונו</span>
                    </div>
                    <div class="roots_social_icons">
                        <a href="https://instagram.com" target="_blank" title="Instagram">
                            <span class="icon-instagramm"></span>
                        </a>
                        <a href="https://wa.me/972542207200" target="_blank" title="WhatsApp">
                            <span class="icon-phone"></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject top bar when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Remove ALL existing top bars first to prevent duplicates
        const existingTopBars = document.querySelectorAll('.roots_top_bar_wrapper');
        existingTopBars.forEach(bar => bar.remove());
        
        // Find the best insertion point
        let topPanelInner = document.querySelector('.top_panel_wrap_inner');
        
        if (topPanelInner) {
            // Insert at the beginning of top_panel_wrap_inner
            topPanelInner.insertAdjacentHTML('afterbegin', topBarHTML);
        }
    });
})();
