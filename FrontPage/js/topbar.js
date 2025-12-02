// Top Bar Component - Centralized for all pages
// Edit this file to update the top bar across the entire site

(function() {
    const topBarHTML = `
        <div class="roots_top_bar_wrapper">
            <div class="content_wrap clearfix roots_top_bar">
                <div class="roots_top_right">
                    <div class="roots_social_icons">
                        <a href="https://instagram.com" target="_blank" title="Instagram">
                            <span class="icon-instagramm"></span>
                        </a>
                        <a href="https://wa.me/972542207200" target="_blank" title="WhatsApp">
                            <span class="icon-phone"></span>
                        </a>
                    </div>
                </div>
                <div class="roots_top_left">
                    <div class="top_panel_top_contact_area">
                        <span class="icon-mail-1"></span>
                        <a href="mailto:info@rutvaknin.co.il">info@rutvaknin.co.il</a>
                    </div>
                    <div class="top_panel_top_contact_area">
                        <span class="icon-phone-1"></span>
                        <a href="tel:054-220-7200">054-220-7200</a>
                    </div>
                    <div class="top_panel_top_contact_area">
                        <span class="icon-clock-1"></span>
                        <span>א'-ה' 09:00 - 20:00</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Find the insertion point and inject the top bar
    document.addEventListener('DOMContentLoaded', function() {
        // Remove ALL existing top bars first
        const existingTopBars = document.querySelectorAll('.roots_top_bar_wrapper');
        existingTopBars.forEach(bar => bar.remove());
        
        // Try to find the best insertion point
        let topPanelInner = document.querySelector('.top_panel_wrap_inner');
        let topPanelTop = document.querySelector('.top_panel_top');
        
        if (topPanelInner) {
            // Insert at the beginning of top_panel_wrap_inner
            topPanelInner.insertAdjacentHTML('afterbegin', topBarHTML);
        } else if (topPanelTop) {
            // Insert inside top_panel_top
            topPanelTop.innerHTML = topBarHTML;
        }
    });
})();

