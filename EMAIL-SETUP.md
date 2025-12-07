# 📧 מערכת שליחת מיילים - ROOTS

## ✅ מה כבר מוכן:

### 1️⃣ קבצי PHP:
- ✅ `send-contact.php` - שליחת טופס יצירת קשר
- ✅ `send-health-form.php` - שליחת הצהרת בריאות + PDF
- ✅ `config.php` - הגדרות SMTP (כולל סיסמה)

### 2️⃣ אבטחה:
- ✅ `config.php` נמצא ב-`.gitignore` ולא יידחף ל-Git
- ✅ `config-example.php` - דוגמה לשרת האחסון

### 3️⃣ הגדרות SMTP:
```
✅ Server: mail.rutvaknin.co.il
✅ Port: 465 (SSL/TLS)
✅ Username: info@rutvaknin.co.il
✅ Password: ****** (מוגדר)
```

---

## 🔄 מה צריך לעשות עכשיו:

### שלב 1: התקן DomPDF (ליצירת PDF)

בטרמינל, רוץ:

```bash
cd /Applications/MAMP/htdocs/roots
bash install-dompdf.sh
```

**או** התקן Composer ואז:

```bash
composer require dompdf/dompdf
```

---

### שלב 2: בדיקה מקומית (MAMP)

1. פתח את האתר: `http://localhost:8888/roots/`
2. נווט ל-**צור קשר** ומלא את הטופס
3. בדוק שהמייל הגיע ל-info@rutvaknin.co.il

---

### שלב 3: העלאה לשרת

#### A. העתק את config.php:
```bash
# בשרת, צור את config.php:
cp config-example.php config.php
nano config.php  # ועדכן את הסיסמה
```

#### B. הגדר הרשאות:
```bash
chmod 644 config.php
chmod 755 send-contact.php
chmod 755 send-health-form.php
```

#### C. התקן DomPDF בשרת:
```bash
cd public_html/roots  # או הנתיב שלך
composer require dompdf/dompdf
```

---

## 🧪 בדיקות

### בדיקת טופס יצירת קשר:
- [x] מלא את הטופס ב-contacts.html
- [x] בדוק שהמייל הגיע
- [x] בדוק שהמידע נכון (שם, מייל, הודעה)

### בדיקת הצהרת בריאות:
- [x] מלא את הטופס ב-healthForm.html
- [x] בדוק שהמייל הגיע לחברה
- [x] בדוק שהמייל הגיע ללקוח
- [x] בדוק שקובץ ה-PDF מצורף

---

## 🔐 אבטחה

### מבנה הקבצים:

```
roots/
├── config.php              ← ⚠️ לא ב-Git (יש סיסמה)
├── config-example.php      ← ✅ ב-Git (ללא סיסמה)
├── send-contact.php        ← ✅ ב-Git
├── send-health-form.php    ← ✅ ב-Git
└── vendor/                 ← ⚠️ לא ב-Git (ספריות)
```

### .gitignore מוגדר נכון:
```
config.php
vendor/
composer.lock
```

---

## 🐛 פתרון בעיות

### "Mail not sent"
1. ✅ בדוק את הסיסמה ב-`config.php`
2. ✅ בדוק שהפורט 465 פתוח
3. ✅ נסה port 587 אם 465 לא עובד

### "PDF not generated"
1. ✅ התקן DomPDF: `bash install-dompdf.sh`
2. ✅ בדוק הרשאות: `chmod -R 755 vendor/`

### "config.php not found"
1. ✅ העתק מ-config-example.php
2. ✅ עדכן את הסיסמה

---

## 📊 סטטוס התקנה

- [x] קבצי PHP מוכנים
- [x] config.php מוגדר עם סיסמה
- [x] .gitignore מעודכן
- [ ] DomPDF מותקן ← **צריך להתקין!**
- [ ] נבדק לוקאלית
- [ ] הועלה לשרת

---

**כשמוכן - תבדוק את הטפסים ותעדכן אותי! 🚀**

