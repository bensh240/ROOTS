/* ============================================
   ROOTS Accessibility Widget Logic
   ============================================ */

(function() {
    console.log('♿ Accessibility Widget Script Loaded');
    
    // Default Settings
    const defaultSettings = {
        contrast: 'normal',
        grayscale: false,
        highlightLinks: false,
        stopAnimations: false,
        readableFont: false,
        fontScale: 100,
        wordSpacing: 0,
        letterSpacing: 0,
        cursor: 'normal',
        readingGuide: false
    };

    let settings = JSON.parse(localStorage.getItem('roots_acc_settings')) || { ...defaultSettings };

    // HTML Template
    const widgetHTML = `
        <div id="acc-widget-btn" class="acc-ignore" title="תפריט נגישות">
            <svg viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
        </div>
        <div id="acc-panel" class="acc-ignore">
            <div class="acc-header acc-ignore">
                <h3 class="acc-ignore">כלי נגישות</h3>
                <span class="acc-close acc-ignore">&times;</span>
            </div>
            <div class="acc-body acc-ignore">
                <div class="acc-section acc-ignore">
                    <div class="acc-section-title acc-ignore">התאמת תצוגה</div>
                    <div class="acc-grid acc-ignore">
                        <div class="acc-btn acc-ignore" data-action="contrast" data-value="high">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm1-17.93c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93V4.07z"/></svg>
                            ניגודיות גבוהה
                        </div>
                        <div class="acc-btn acc-ignore" data-action="contrast" data-value="inverted">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                            ניגודיות הפוכה
                        </div>
                        <div class="acc-btn acc-ignore" data-action="grayscale">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"/></svg>
                            גווני אפור
                        </div>
                        <div class="acc-btn acc-ignore" data-action="highlightLinks">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                            הדגשת קישורים
                        </div>
                        <div class="acc-btn acc-ignore" data-action="stopAnimations">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                            ביטול אנימציות
                        </div>
                        <div class="acc-btn acc-ignore" data-action="readableFont">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/></svg>
                            גופן קריא
                        </div>
                    </div>
                </div>

                <div class="acc-section acc-ignore">
                    <div class="acc-section-title acc-ignore">התאמת טקסט</div>
                    <div class="acc-slider-container acc-ignore">
                        <div class="acc-slider-label acc-ignore">
                            <span class="acc-ignore">גודל טקסט</span>
                            <span id="font-scale-val" class="acc-ignore">100%</span>
                        </div>
                        <input type="range" class="acc-slider acc-ignore" id="font-scale" min="80" max="150" value="100">
                    </div>
                    <div class="acc-slider-container acc-ignore">
                        <div class="acc-slider-label acc-ignore">
                            <span class="acc-ignore">ריווח בין מילים</span>
                            <span id="word-spacing-val" class="acc-ignore">0</span>
                        </div>
                        <input type="range" class="acc-slider acc-ignore" id="word-spacing" min="0" max="10" value="0">
                    </div>
                    <div class="acc-slider-container acc-ignore">
                        <div class="acc-slider-label acc-ignore">
                            <span class="acc-ignore">ריווח בין אותיות</span>
                            <span id="letter-spacing-val" class="acc-ignore">0</span>
                        </div>
                        <input type="range" class="acc-slider acc-ignore" id="letter-spacing" min="0" max="5" value="0" step="0.5">
                    </div>
                </div>

                <div class="acc-section acc-ignore">
                    <div class="acc-section-title acc-ignore">כלים נוספים</div>
                    <div class="acc-grid acc-ignore">
                        <div class="acc-btn acc-ignore" data-action="cursor" data-value="big-black">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M13.64 21.91c-.38.16-.82.01-1-.36l-2.43-5.34-2.21 2.21V2.83L18.66 14.5h-5.45l2.45 5.39c.2.37.05.82-.32 1.02l-1.7.75z"/></svg>
                            סמן גדול שחור
                        </div>
                        <div class="acc-btn acc-ignore" data-action="cursor" data-value="big-white">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M13.64 21.91c-.38.16-.82.01-1-.36l-2.43-5.34-2.21 2.21V2.83L18.66 14.5h-5.45l2.45 5.39c.2.37.05.82-.32 1.02l-1.7.75z"/></svg>
                            סמן גדול לבן
                        </div>
                        <div class="acc-btn acc-ignore" data-action="readingGuide">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>
                            מדריך קריאה
                        </div>
                        <div class="acc-btn acc-ignore acc-reset-btn" id="acc-reset">
                            <svg class="acc-ignore" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.07 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                            איפוס הגדרות
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="acc-reading-guide" class="acc-ignore"></div>
    `;

    function init() {
        if (document.getElementById('acc-widget-btn')) return;

        console.log('♿ Attempting to inject Accessibility Widget...');

        // Add CSS
        if (!document.querySelector('link[href*="accessibility.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/accessibility.css';
            document.head.appendChild(link);
        }

        const headerActions = document.querySelector('.roots_header_actions');
        const sideWrap = document.querySelector('.header_mobile .side_wrap');
        const panelTop = document.querySelector('.header_mobile .side_wrap .panel_top');
        const mobileHeader = document.querySelector('.header_mobile .content_wrap');

        // Check screen width
        const isMobile = window.innerWidth <= 1024;
        
        if (isMobile) {
            // Priority 1: Mobile Menu Dropdown
            if (sideWrap) {
                // Inject at the end of side_wrap to be at the bottom
                sideWrap.insertAdjacentHTML('beforeend', widgetHTML);
                console.log('♿ Injected into Mobile Menu (Bottom)');
                finalizeInit();
            } else if (mobileHeader) {
                // Fallback: Mobile Top Bar (header)
                mobileHeader.insertAdjacentHTML('beforeend', widgetHTML);
                console.log('♿ Injected into Mobile Header');
                finalizeInit();
            } else {
                retryInit();
            }
        } else {
            // Desktop
            if (headerActions) {
                headerActions.insertAdjacentHTML('beforeend', widgetHTML);
                console.log('♿ Injected into Desktop Header');
                finalizeInit();
            } else {
                retryInit();
            }
        }
    }

    function retryInit() {
        if (!window.acc_retry_count) window.acc_retry_count = 0;
        if (window.acc_retry_count < 15) {
            window.acc_retry_count++;
            setTimeout(init, 500);
        } else {
            // Final fallback: Body injection
            document.body.insertAdjacentHTML('beforeend', widgetHTML);
            const btn = document.getElementById('acc-widget-btn');
            if (btn) {
                btn.style.cssText = "position:fixed !important; top:100px !important; left:20px !important; z-index:2147483647 !important; display:flex !important;";
            }
            console.log('♿ Injected into Body (Final Fallback)');
            finalizeInit();
        }
    }

    function finalizeInit() {
        initWidgetEvents();
        applySettings();
    }

    function initWidgetEvents() {
        const btn = document.getElementById('acc-widget-btn');
        const panel = document.getElementById('acc-panel');
        const close = document.querySelector('.acc-close');
        const reset = document.getElementById('acc-reset');
        const guide = document.getElementById('acc-reading-guide');

        if (!btn || !panel) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            panel.classList.toggle('active');
        });

        close.addEventListener('click', () => panel.classList.remove('active'));

        document.querySelectorAll('.acc-btn').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                const value = this.dataset.value;
                if (action === 'contrast') settings.contrast = settings.contrast === value ? 'normal' : value;
                else if (action === 'cursor') settings.cursor = settings.cursor === value ? 'normal' : value;
                else settings[action] = !settings[action];
                saveAndApply();
            });
        });

        const sliders = { 'font-scale': 'fontScale', 'word-spacing': 'wordSpacing', 'letter-spacing': 'letterSpacing' };
        Object.entries(sliders).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.value = settings[key];
            document.getElementById(`${id}-val`).textContent = id === 'font-scale' ? `${settings[key]}%` : settings[key];
            el.addEventListener('input', function() {
                settings[key] = parseFloat(this.value);
                document.getElementById(`${id}-val`).textContent = id === 'font-scale' ? `${this.value}%` : this.value;
                saveAndApply();
            });
        });

        reset.addEventListener('click', () => {
            settings = { ...defaultSettings };
            saveAndApply();
            location.reload(); 
        });

        document.addEventListener('mousemove', (e) => {
            if (settings.readingGuide && guide) {
                guide.style.top = `${e.clientY}px`;
                guide.style.display = 'block';
            } else if (guide) {
                guide.style.display = 'none';
            }
        });
    }

    function saveAndApply() {
        localStorage.setItem('roots_acc_settings', JSON.stringify(settings));
        applySettings();
    }

    function applySettings() {
        const body = document.body;
        
        // --- 1. Handle Classes ---
        body.classList.remove('acc-high-contrast', 'acc-inverted-contrast', 'acc-grayscale', 'acc-highlight-links', 'acc-stop-animations', 'acc-readable-font', 'acc-big-cursor-black', 'acc-big-cursor-white');
        if (settings.grayscale) body.classList.add('acc-grayscale');
        if (settings.highlightLinks) body.classList.add('acc-highlight-links');
        if (settings.stopAnimations) body.classList.add('acc-stop-animations');
        if (settings.readableFont) body.classList.add('acc-readable-font');
        if (settings.contrast === 'high') body.classList.add('acc-high-contrast');
        if (settings.contrast === 'inverted') body.classList.add('acc-inverted-contrast');
        if (settings.cursor === 'big-black') body.classList.add('acc-big-cursor-black');
        if (settings.cursor === 'big-white') body.classList.add('acc-big-cursor-white');

        // --- 2. Handle Text Scaling & Spacing (Aggressive Injection) ---
        let accStyle = document.getElementById('roots-acc-dynamic-styles');
        if (!accStyle) {
            accStyle = document.createElement('style');
            accStyle.id = 'roots-acc-dynamic-styles';
            document.head.appendChild(accStyle);
        }

        const fontMultiplier = settings.fontScale / 100;
        
        // Target all text-bearing elements to override existing sizes
        const selectors = 'p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, input, textarea, button, label, div:not(.acc-ignore)';
        
        if (settings.fontScale === 100 && settings.wordSpacing === 0 && settings.letterSpacing === 0) {
            accStyle.innerHTML = '';
        } else {
            accStyle.innerHTML = `
                ${selectors} {
                    ${settings.fontScale !== 100 ? `font-size: calc(1em * ${fontMultiplier}) !important;` : ''}
                    ${settings.wordSpacing !== 0 ? `word-spacing: ${settings.wordSpacing}px !important;` : ''}
                    ${settings.letterSpacing !== 0 ? `letter-spacing: ${settings.letterSpacing}px !important;` : ''}
                }
                /* Ensure specific containers don't break but scale */
                .sc_services_item_title, .slide-title, .slide-subtitle {
                    font-size: calc(1.5em * ${fontMultiplier}) !important;
                }
            `;
        }

        // --- 3. Update UI ---
        document.querySelectorAll('.acc-btn').forEach(btn => {
            const action = btn.dataset.action;
            const value = btn.dataset.value;
            let active = (action === 'contrast') ? settings.contrast === value : (action === 'cursor') ? settings.cursor === value : settings[action];
            btn.classList.toggle('active', active);
        });
        const guide = document.getElementById('acc-reading-guide');
        if (guide) guide.style.display = settings.readingGuide ? 'block' : 'none';
    }

    // Initialize
    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();
