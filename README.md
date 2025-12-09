# 🌿 ROOTS - טיפולים הוליסטיים

אתר מקצועי לרות וקנין - מטפלת הוליסטית המתמחה בטיפולים טבעיים ורפואה משלימה.

🌐 **אתר פעיל:** [https://rutvaknin.co.il](https://rutvaknin.co.il)

---

## 📋 תוכן עניינים

- [תיאור הפרויקט](#-תיאור-הפרויקט)
- [פיצ'רים עיקריים](#-פיצרים-עיקריים)
- [טכנולוגיות](#-טכנולוגיות)
- [מבנה הפרויקט](#-מבנה-הפרויקט)
- [התקנה](#-התקנה)
- [תצורה](#-תצורה)
- [שימוש](#-שימוש)
- [קבצים חשובים](#-קבצים-חשובים)
- [פתרון בעיות](#-פתרון-בעיות)
- [יצירת קשר](#-יצירת-קשר)

---

## 🎯 תיאור הפרויקט

ROOTS הוא אתר מקצועי לטיפולים הוליסטיים המספק:
- מידע מקיף על טיפולים שונים
- מערכת קביעת תורים אונליין
- טופס הצהרת בריאות דיגיטלי
- גלריית תמונות מעוצבת
- טופס יצירת קשר

האתר בנוי בעיצוב מודרני, רספונסיבי מלא ומותאם לעברית (RTL).

---

## ✨ פיצ'רים עיקריים

### 📄 טופס הצהרת בריאות (Health Form)
- **מילוי טופס מקוון** עם שאלות רפואיות מפורטות
- **יצירת PDF אוטומטית** עם html2canvas
- **PDF מעוצב** כולל:
  - לוגו ROOTS מקצועי
  - כל הפרטים האישיים
  - כל השאלות הרפואיות (גם "כן" וגם "לא")
  - אישורים והצהרות
  - טקסט שחור וברור
- **שליחת מיילים אוטומטית**:
  - מייל למשרד (`info@rutvaknin.co.il`) עם PDF מצורף
  - מייל ללקוח עם PDF מצורף
  - תזכורת לבדוק בספאם
- **שמירה מקומית** ב-localStorage כגיבוי

### 📅 קביעת תורים (Booking)
- טופס קביעת תור אינטואיטיבי
- אינטגרציה עם Calendly
- שליחת אישור במייל

### 📧 יצירת קשר (Contact)
- טופס יצירת קשר פשוט
- שליחה ישירה למייל המשרד
- אישור אוטומטי ללקוח

### 🎨 עיצוב ו-UI/UX
- עיצוב מודרני ונקי
- רספונסיבי מלא (Desktop, Tablet, Mobile)
- אנימציות חלקות
- תמיכה מלאה ב-RTL (עברית)
- צבעי ROOTS (ירוק, חום) עקביים
- גופנים: Assistant, Alef, Heebo

---

## 🛠 טכנולוגיות

### Frontend
- **HTML5** - מבנה סמנטי
- **CSS3** - עיצוב מתקדם עם Grid & Flexbox
- **JavaScript (ES6+)** - לוגיקה צד לקוח
- **jQuery** - מניפולציות DOM
- **html2canvas** - המרת HTML ל-Canvas לייצוא PDF
- **jsPDF** - יצירת קבצי PDF

### Backend
- **PHP 7.4+** - לוגיקה צד שרת
- **PHPMailer** - שליחת מיילים מאובטחת
- **Composer** - ניהול dependencies

### שרתים ואחסון
- **Apache/Nginx** - Web Server
- **SMTP** (mail.rutvaknin.co.il:465) - שליחת מיילים
- **cPanel** - ניהול אחסון

---

## 📁 מבנה הפרויקט

```
roots/
├── index.html              # עמוד הבית
├── about-us.html          # אודות
├── contacts.html          # צור קשר
├── booking.html           # קביעת תור
├── healthForm.html        # הצהרת בריאות ⭐
├── gallery-grid.html      # גלריית תמונות
├── 404.html              # עמוד שגיאה
│
├── send-health-form.php   # שליחת טופס בריאות ⭐
├── send-contact.php       # שליחת טופס יצירת קשר
├── config.php            # הגדרות SMTP
├── config-example.php    # דוגמת קובץ הגדרות
│
├── css/                  # קבצי עיצוב
│   ├── style.css
│   ├── responsive.css
│   ├── custom.css
│   └── ...
│
├── js/                   # JavaScript
│   ├── custom/
│   ├── vendor/
│   ├── footer.js
│   └── topbar.js
│
├── images/               # תמונות ולוגואים
│   ├── logo2.jpeg       # לוגו ראשי
│   ├── roots-3.png      # לוגו mobile
│   ├── roots-32.jpg     # לוגו header
│   └── ...
│
├── vendor/               # PHPMailer (Composer)
│   └── phpmailer/
│
├── .gitignore           # קבצים להתעלמות בגיט
├── .htaccess            # Apache configuration
├── composer.json        # PHP dependencies
└── README.md           # זה! ⭐
```

---

## 🚀 התקנה

### דרישות מערכת
- **PHP 7.4** ומעלה
- **Apache/Nginx** עם mod_rewrite
- **Composer** - לניהול PHPMailer
- **SSL Certificate** - לאבטחת החיבור
- **SMTP Server** - לשליחת מיילים

### שלבי התקנה

#### 1. Clone הפרויקט
```bash
git clone https://github.com/bensh240/ROOTS.git
cd ROOTS
```

#### 2. התקנת PHPMailer
```bash
composer install
```

או באופן ידני:
```bash
composer require phpmailer/phpmailer
```

#### 3. הגדרת קובץ התצורה
העתק את `config-example.php` ל-`config.php`:
```bash
cp config-example.php config.php
```

ערוך את `config.php`:
```php
<?php
// SMTP Configuration
define('SMTP_HOST', 'mail.rutvaknin.co.il');
define('SMTP_PORT', 465);
define('SMTP_USERNAME', 'info@rutvaknin.co.il');
define('SMTP_PASSWORD', 'YOUR_PASSWORD_HERE');
define('SMTP_FROM', 'info@rutvaknin.co.il');
define('SMTP_TO', 'info@rutvaknin.co.il');
define('SMTP_DEBUG', false); // true לדיבאג
?>
```

#### 4. הגדרת הרשאות
```bash
chmod 755 *.php
chmod 644 config.php
```

#### 5. העלאה לשרת
העלה את כל הקבצים לתיקיית `public_html` או `htdocs` בשרת.

---

## ⚙️ תצורה

### הגדרות SMTP
כדי שהמיילים יישלחו, וודא:

1. **פרטי SMTP נכונים** ב-`config.php`
2. **סיסמה נכונה** לחשבון המייל
3. **SSL/TLS מופעל** (Port 465)
4. **PTR Record** - תאם עם חברת האחסון:
   ```
   IP: [Server IP]
   Domain: mail.rutvaknin.co.il
   ```

### מניעת כניסה לספאם

**בעיה:** מיילים נכנסים לספאם  
**פתרון:**
1. **SPF Record** - הוסף ל-DNS:
   ```
   v=spf1 a mx ip4:[SERVER_IP] ~all
   ```
2. **DKIM** - הגדר חתימה דיגיטלית
3. **PTR Record** - Reverse DNS
4. **אימות דומיין** ב-Gmail/Outlook

---

## 💻 שימוש

### טופס הצהרת בריאות

#### ללקוח:
1. עבור ל: `https://rutvaknin.co.il/healthForm.html`
2. מלא את כל הפרטים
3. סמן את האישורים
4. שלח - תקבל מייל עם PDF (בדוק בספאם!)

#### למטפלת:
1. קבלת מייל עם PDF מצורף
2. הצגת כל הפרטים בצורה מסודרת
3. שמירה אוטומטית במערכת המייל

### קוד לדוגמה - יצירת PDF

```javascript
// פונקציה שיוצרת PDF מהנתונים
async function generatePDF(data) {
    // 1. יצירת תבנית HTML דינמית
    const template = createPDFTemplate(data);
    document.body.appendChild(template);
    
    // 2. המרה ל-Canvas
    const canvas = await html2canvas(template, {
        scale: 3,
        backgroundColor: '#ffffff'
    });
    
    // 3. יצירת PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    
    // 4. החזרת base64
    return pdf.output('dataurlstring').split(',')[1];
}
```

---

## 📄 קבצים חשובים

### `healthForm.html`
טופס הצהרת הבריאות המלא:
- שדות קלט לפרטים אישיים
- שאלות רפואיות עם radio buttons
- צ'קבוקסים לאישורים
- JavaScript ליצירת PDF
- שליחה אסינכרונית לשרת

### `send-health-form.php`
מעבד את הטופס:
```php
// קבלת נתונים
$fullName = $_POST['fullName'];
$email = $_POST['email'];
$pdfBase64 = $_POST['pdf'];

// המרה ל-PDF
$pdfContent = base64_decode($pdfBase64);

// שליחת 2 מיילים
sendEmailWithPDF($companyEmail, ...); // למשרד
sendEmailWithPDF($clientEmail, ...);  // ללקוח
```

### `config.php`
קובץ הגדרות SMTP:
```php
define('SMTP_HOST', 'mail.rutvaknin.co.il');
define('SMTP_PORT', 465);
define('SMTP_USERNAME', 'info@rutvaknin.co.il');
define('SMTP_PASSWORD', 'YOUR_PASSWORD');
```

⚠️ **חשוב:** אל תעלה את `config.php` לגיט! (רשום ב-`.gitignore`)

---

## 🔧 פתרון בעיות

### ❌ "שגיאה ביצירת קובץ PDF"

**בעיה:** html2canvas לא נטען  
**פתרון:**
```html
<!-- וודא שיש בראש העמוד: -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

### ❌ הלקוח לא מקבל מייל

**בעיה:** המייל נכנס לספאם  
**פתרון:**
1. בדוק בתיקיית Spam/Junk
2. הוסף `info@rutvaknin.co.il` לאנשי קשר
3. תאם PTR Record עם חברת האחסון

### ❌ טקסט לבן ב-PDF

**בעיה:** CSS override  
**פתרון:** כל הטקסט עם `color: #000000 !important`

### ❌ מרווח גדול מעל הכותרת

**בעיה:** התבנית המוסתרת משפיעה על העמוד  
**פתרון:** התבנית נוצרת דינמית רק בזמן יצירת PDF

### 🔍 דיבאג

הפעל logging ב-`config.php`:
```php
define('SMTP_DEBUG', true);
```

בדוק את הקונסול בדפדפן (F12) לשגיאות JavaScript.

---

## 📊 מצב הפרויקט

### ✅ מוכן לייצור
- [x] טופס הצהרת בריאות
- [x] יצירת PDF עם html2canvas
- [x] שליחת מיילים (משרד + לקוח)
- [x] עיצוב רספונסיבי
- [x] מרווחים תקינים
- [x] טקסט שחור ב-PDF
- [x] כל השאלות מופיעות
- [x] תזכורת לבדוק בספאם

### 🔄 שיפורים עתידיים (אופציונלי)
- [ ] אינטגרציה עם מערכת CRM
- [ ] שליחת SMS נוסף למייל
- [ ] פאנל ניהול למטפלת
- [ ] אפליקציית מובייל
- [ ] תשלום אונליין

---

## 📞 יצירת קשר

**רות וקנין** - מטפלת הוליסטית

- 🌐 אתר: [https://rutvaknin.co.il](https://rutvaknin.co.il)
- 📧 מייל: [info@rutvaknin.co.il](mailto:info@rutvaknin.co.il)
- 📱 טלפון: 054-220-7200
- 📍 מיקום: [לפי תיאום](https://rutvaknin.co.il/contacts.html)

---

## 👨‍💻 פיתוח

**Developer:** Ben Shaya  
**GitHub:** [github.com/bensh240/ROOTS](https://github.com/bensh240/ROOTS)  
**גרסה:** 2.0  
**תאריך עדכון:** דצמבר 2024

---

## 📜 רישיון

© 2024 ROOTS - כל הזכויות שמורות לרות וקנין

---

## 🙏 תודות

תודה מיוחדת ל:
- **PHPMailer** - ספריית שליחת מיילים מעולה
- **html2canvas** - המרת HTML ל-Canvas
- **jsPDF** - יצירת PDF בצד הלקוח
- **Font Awesome** - אייקונים
- **Google Fonts** - גופנים עבריים

---

<div align="center">

**🌿 ROOTS - טיפולים הוליסטיים 🌿**

*"טיפול טבעי, מקצועי ואישי"*

[🌐 בקר באתר](https://rutvaknin.co.il) | [📧 צור קשר](mailto:info@rutvaknin.co.il) | [📱 התקשר](tel:054-220-7200)

</div>

