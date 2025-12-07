# 📧 מדריך התקנה פשוט - PHPMailer

## 🎯 הבעיה: "הטופס נשמר מקומית בהצלחה! (לא ניתן היה לשלוח מייל)"

**הסיבה:** PHPMailer לא מותקן בשרת.

---

## ✅ **הפתרון - 3 אפשרויות:**

### **אפשרות 1: הורד PHPMailer ידנית והעלה** ⭐ (הכי פשוט!)

#### שלב 1: הורד במחשב שלך
```
https://github.com/PHPMailer/PHPMailer/releases/download/v6.8.1/PHPMailer-6.8.1.zip
```
לחץ על הקישור או הורד מ-GitHub Releases

#### שלב 2: חלץ את הקובץ
פתח את `PHPMailer-6.8.1.zip`

#### שלב 3: העלה ל-cPanel
העלה דרך File Manager:
```
PHPMailer-6.8.1/src/       → העלה ל: public_html/roots/vendor/phpmailer/phpmailer/
PHPMailer-6.8.1/language/  → העלה ל: public_html/roots/vendor/phpmailer/phpmailer/language/
```

#### שלב 4: צור autoload.php
ב-cPanel File Manager → `public_html/roots/vendor/` → New File → `autoload.php`

העתק לתוכו:
```php
<?php
spl_autoload_register(function ($class) {
    $prefix = 'PHPMailer\\PHPMailer\\';
    $base_dir = __DIR__ . '/phpmailer/phpmailer/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});
?>
```

---

### **אפשרות 2: חבילה מוכנה להעלאה**

אם קשה לך עם אפשרות 1, יצרתי לך חבילה מוכנה:

1. הורד את **vendor.zip** (אספק לך אותו)
2. העלה ל-cPanel
3. חלץ ב-File Manager ל-`public_html/roots/`
4. **זהו!**

---

### **אפשרות 3: השתמש ב-Composer בשרת**

אם יש Composer ב-cPanel:

```bash
cd public_html/roots
composer install
```

---

## ✅ **בדיקה שהכל עבד:**

לאחר ההתקנה, וודא שהקבצים האלה קיימים:

```
✓ public_html/roots/vendor/autoload.php
✓ public_html/roots/vendor/phpmailer/phpmailer/PHPMailer.php
✓ public_html/roots/vendor/phpmailer/phpmailer/SMTP.php
✓ public_html/roots/vendor/phpmailer/phpmailer/Exception.php
```

---

## 🧪 **בדיקת המערכת:**

1. פתח את `contacts.html` באתר
2. מלא את הטופס
3. שלח
4. בדוק שהגיע מייל ל-info@rutvaknin.co.il

אם עבד - נסה את `healthForm.html`!

---

## 🆘 **עדיין לא עובד?**

בדוק את השגיאות:
- cPanel → File Manager → Error Log
- או cPanel → Metrics → Errors

**צריך עזרה? תגיד לי מה השגיאה!**

