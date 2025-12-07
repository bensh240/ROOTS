# .htaccess Configuration Guide

## ✅ What This File Does

### 1. **Clean URLs** (No .html extension)
- ✅ `example.com/about` instead of `example.com/about.html`
- ✅ Automatically redirects old .html URLs to clean versions
- ✅ Works for all HTML files in your site

### 2. **Security Protection**
- 🛡️ **XSS Protection** - Blocks cross-site scripting attacks
- 🛡️ **SQL Injection Protection** - Blocks malicious SQL queries
- 🛡️ **Clickjacking Protection** - Prevents your site from being embedded in iframes
- 🛡️ **File Protection** - Blocks access to sensitive files (.env, .log, etc.)
- 🛡️ **Directory Browsing Disabled** - Prevents listing of files

### 3. **Performance**
- ⚡ GZIP Compression enabled
- ⚡ Browser caching for images and CSS/JS files

---

## 📋 How to Use

### Step 1: Upload to cPanel
1. Login to your cPanel
2. Open **File Manager**
3. Navigate to `public_html` or your root directory
4. Upload the `.htaccess` file
5. Make sure it's named **exactly** `.htaccess` (with the dot at the beginning)

### Step 2: Update Your Links
Change all your links from:
```html
<a href="about.html">About Us</a>
```

To:
```html
<a href="about">About Us</a>
```

### Step 3: Enable HTTPS (When Ready)
Open `.htaccess` and **uncomment** these lines (remove the `#`):
```apache
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Becomes:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 🧪 Testing Clean URLs

After uploading, test these URLs:
- ✅ `yoursite.com/index` (should work)
- ✅ `yoursite.com/about-us` (should work)
- ✅ `yoursite.com/contacts` (should work)
- ✅ `yoursite.com/booking` (should work)

Old URLs with `.html` will automatically redirect to clean versions.

---

## ⚠️ Troubleshooting

### Problem: 500 Internal Server Error
**Solution:** Your server might not support certain modules. Try removing these sections one by one:
1. Remove the `mod_headers` section
2. Remove the `mod_deflate` section
3. Remove the `mod_expires` section

### Problem: CSS/Images Not Loading
**Solution:** Make sure RewriteBase is set correctly:
```apache
RewriteBase /
```

### Problem: Clean URLs Not Working
**Solution:** Make sure `mod_rewrite` is enabled in cPanel (it usually is by default)

---

## 📞 Need Help?
Contact your hosting provider and ask them to:
1. Enable `mod_rewrite`
2. Enable `mod_headers`
3. Allow `.htaccess` overrides

---

## 🔒 Security Note
This file provides **basic security**. For complete protection, also:
- Keep your server software updated
- Use strong passwords
- Install SSL certificate (HTTPS)
- Regularly backup your site

