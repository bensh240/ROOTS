// ============================================
// ROOTS Footer Component - Simple & Clean
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Footer HTML - פשוט וקומפקטי
    const footerHTML = `
        <div id="roots_simple_footer" style="text-align: center;background: #ffffff;">
            <!-- Brown Line - Full Width -->
            <div style="width: 100%; max-width: 1000px; height: 2px; background: #8B6F47; margin: 0 auto 25px;"></div>
            
            <!-- Social Icons -->
            <div style="margin-bottom: 20px;">
                <a href="https://instagram.com" target="_blank" style="display: inline-block; margin: 0 10px; color: #999; font-size: 24px; text-decoration: none;">
                    <span class="icon-instagramm"></span>
                </a>
                <a href="https://wa.me/972542207200" target="_blank" style="display: inline-block; margin: 0 10px; color: #999; font-size: 24px; text-decoration: none;">
                    <span class="icon-phone"></span>
                </a>
            </div>
            
            <!-- Copyright -->
            <p style="color: #999; font-size: 13px; margin: 0 0 8px 0;">
                ROOTS - © 2025 כל הזכויות שמורות
            </p>
            <p style="margin: 0 0 8px 0;">
                <a href="privacy-policy.html" style="color: #6B8E23; font-size: 12px; text-decoration: underline;">תנאי שימוש ומדיניות פרטיות</a>
            </p>
            <p style="margin: 0; direction: rtl; font-size: 12px; color: #333;">
                נבנה ע״י <a href="https://100x.co.il" target="_blank" style="color: #6B8E23; text-decoration: none; font-weight: bold;">100x.co.il</a>
            </p>
        </div>
    `;
    
    // Remove existing footer elements
    const existingFooter = document.querySelector('footer.footer_wrap');
    const existingCopyright = document.querySelector('.copyright_wrap');
    const existingRootsFooter = document.getElementById('roots_simple_footer');
    
    if (existingFooter) existingFooter.remove();
    if (existingCopyright) existingCopyright.remove();
    if (existingRootsFooter) existingRootsFooter.remove();
    
    // Insert footer at the very end, just before </body>
    document.body.insertAdjacentHTML('beforeend', footerHTML);
});

