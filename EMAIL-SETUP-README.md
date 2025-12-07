# 📧 מדריך הגדרת מערכת המיילים - ROOTS

## 📋 סקירה כללית

המערכת כוללת שליחת מיילים אוטומטית עבור:
1. **טופס יצירת קשר** (`contacts.html`) - שליחת הודעה למייל החברה
2. **הצהרת בריאות** (`healthForm.html`) - שליחת PDF לחברה ולמשתמש

---

## 🔧 דרישות מקדימות

### 1. שרת PHP
- PHP 7.4 ומעלה
- הרשאות לשליחת מיילים
- גישה ל-SMTP

### 2. ספריית PDF (עבור הצהרת בריאות)
להתקנת ספריית DomPDF:

```bash
cd /Applications/MAMP/htdocs/roots
composer require dompdf/dompdf
```

**או** הורד ידנית:
```bash
mkdir -p vendor
cd vendor
git clone https://github.com/dompdf/dompdf.git
```

---

## ⚙️ הגדרות SMTP

### שלב 1: עדכון סיסמת SMTP

ערוך את שני הקבצים הבאים והוסף את סיסמת המייל:

#### `send-contact.php` (שורה 9):
```php
define('SMTP_PASSWORD', 'הסיסמה_שלך_כאן');
```

#### `send-health-form.php` (שורה 9):
```php
define('SMTP_PASSWORD', 'הסיסמה_שלך_כאן');
```

### שלב 2: הגדרות השרת

**כבר מוגדר בקבצים:**
- **Username**: info@rutvaknin.co.il
- **Outgoing Server**: mail.rutvaknin.co.il
- **SMTP Port**: 465 (SSL)
- **From Email**: info@rutvaknin.co.il

---

## 📝 הוראות התקנה מפורטות

### A. עבור MAMP (פיתוח מקומי)

1. **התקן Composer** (אם עדיין לא מותקן):
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

2. **התקן DomPDF**:
```bash
cd /Applications/MAMP/htdocs/roots
composer require dompdf/dompdf
```

3. **עדכן את הסיסמאות** בקבצי PHP

4. **בדיקה**:
   - פתח http://localhost:8888/roots/contacts.html
   - מלא את הטופס ובדוק שליחה

---

### B. עבור שרת אחסון (cPanel)

1. **העלה את הקבצים**:
   - `send-contact.php`
   - `send-health-form.php`
   - תיקיית `vendor/` (אם השתמשת ב-Composer)

2. **הגדר הרשאות**:
```bash
chmod 755 send-contact.php
chmod 755 send-health-form.php
chmod -R 755 vendor/
```

3. **בדיקת PHP**:
   - וודא ש-PHP 7.4+ מותקן
   - בcPanel: Software → Select PHP Version

4. **התקן DomPDF דרך SSH**:
```bash
cd public_html/roots  # או הנתיב שלך
composer require dompdf/dompdf
```

**אם אין לך SSH**, העלה את תיקיית `vendor/` שיצרת לוקאלית.

---

## 🧪 בדיקת התקנה

### בדיקת טופס יצירת קשר:

1. פתח `contacts.html`
2. מלא את כל השדות
3. לחץ "שליחה"
4. בדוק שהגיע מייל ל-info@rutvaknin.co.il

### בדיקת הצהרת בריאות:

1. פתח `healthForm.html`
2. מלא את הטופס המלא
3. סמן את כל האישורים
4. לחץ "שליחת ההצהרה"
5. בדוק:
   - מייל עם PDF הגיע לחברה
   - מייל עם PDF הגיע למשתמש

---

## 🔐 אבטחה

### חשוב! הגנה על הסיסמאות

**אל תדחוף את הקבצים עם הסיסמאות לGit!**

הוסף ל-`.gitignore`:
```
send-contact.php
send-health-form.php
vendor/
```

או השתמש בקובץ הגדרות נפרד:

**`config.php`:**
```php
<?php
define('SMTP_HOST', 'mail.rutvaknin.co.il');
define('SMTP_PORT', 465);
define('SMTP_USERNAME', 'info@rutvaknin.co.il');
define('SMTP_PASSWORD', 'הסיסמה_שלך');
?>
```

**ב-`.gitignore`:**
```
config.php
```

---

## 🐛 פתרון בעיות

### 1. "Mail not sent"
- ✅ בדוק שהסיסמה נכונה
- ✅ וודא ש-PHP יכול לשלוח מיילים: `php -i | grep mail`
- ✅ בדוק שהפורט 465 לא חסום

### 2. "PDF not generated"
- ✅ וודא ש-DomPDF מותקן: `ls -la vendor/dompdf`
- ✅ בדוק הרשאות כתיבה: `chmod -R 755 vendor/`

### 3. "SMTP connection failed"
- ✅ נסה פורט 587 במקום 465
- ✅ פנה לחברת האחסון לוודא ש-SMTP מופעל

### 4. "Headers already sent"
- ✅ וודא שאין רווחים/שורות ריקות לפני `<?php`
- ✅ שמור קבצים ב-UTF-8 ללא BOM

---

## 📞 תמיכה

אם נתקלת בבעיות:
1. בדוק את ה-error log של PHP
2. בMAMP: `/Applications/MAMP/logs/php_error.log`
3. בcPanel: Error Log בFile Manager

---

## ✅ רשימת ביקורת

- [ ] התקנתי PHP 7.4+
- [ ] התקנתי Composer
- [ ] התקנתי DomPDF (`composer require dompdf/dompdf`)
- [ ] עדכנתי את הסיסמאות ב-`send-contact.php` ו-`send-health-form.php`
- [ ] הגדרתי הרשאות קבצים (755)
- [ ] בדקתי שליחת מייל מטופס יצירת קשר
- [ ] בדקתי שליחת מייל + PDF מהצהרת בריאות
- [ ] הוספתי את הקבצים ל-`.gitignore` (אופציונלי)

---

**🎉 אם כל הביקורות מסומנות - המערכת מוכנה לשימוש!**

