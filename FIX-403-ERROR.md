# 🔴 פתרון שגיאת 403 Forbidden

## אפשרות 1: שימוש ב-.htaccess מינימלי (מומלץ!)

1. **מחק את הקובץ `.htaccess` הנוכחי**
2. **שנה שם של `.htaccess-minimal` ל-`.htaccess`**
3. **רענן את הדפדפן**

---

## אפשרות 2: בדוק הרשאות קבצים

ב-cPanel File Manager:

### שלב 1: בדוק הרשאות תיקייה
- קליק ימני על התיקייה הראשית
- Permissions → **755**

### שלב 2: בדוק הרשאות קבצים HTML
- בחר את כל קבצי ה-HTML (index.html, about-us.html וכו')
- Permissions → **644**

### שלב 3: בדוק הרשאות .htaccess
- קליק ימני על `.htaccess`
- Permissions → **644**

---

## אפשרות 3: מחק את .htaccess זמנית

אם כלום לא עוזר:
1. **מחק את `.htaccess` לגמרי**
2. **בדוק אם האתר עובד**
3. אם כן - הבעיה היא ב-.htaccess
4. השתמש ב-`.htaccess-minimal` במקום

---

## אפשרות 4: בדוק נתיב העלאה

וודא שהעלאת את הקבצים ל:
- ✅ `public_html/index.html` (נכון - קבצים ישירות ב-root)
- ❌ `public_html/ROOTS/index.html` (לא נכון)

אם העלאת לתוך תת-תיקייה:
- פתח `.htaccess`
- שנה `RewriteBase /` ל-`RewriteBase /שם-התיקייה/`

---

## אפשרות 5: צור index.html פשוט לבדיקה

צור קובץ `test.html` עם:
```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>It Works!</h1></body>
</html>
```

נסה לגשת ל-`yoursite.com/test.html`
- אם עובד = הבעיה ב-.htaccess
- אם לא עובד = בעיית הרשאות

---

## 📞 פתרון מהיר

**אם אתה לחוץ להפעיל את האתר מהר:**

1. **מחק `.htaccess`**
2. **הקישורים באתר יעבדו עם `.html` בסוף** (index.html, about-us.html)
3. **הכל יעבד, פשוט בלי clean URLs**

---

## ⚙️ בדיקת Apache Modules

אם יש לך גישה ל-SSH, בדוק:
```bash
php -m | grep rewrite
```

או שאל את ספק האחסון לוודא ש-**mod_rewrite מופעל**.

---

## ✅ השאר לי הודעה

אם כלום לא עוזר, תגיד לי:
1. איפה העלאת את הקבצים? (public_html / תיקייה אחרת)
2. מה הכתובת המלאה של האתר?
3. האם אתה יכול לגשת ל-`yoursite.com/index.html`?

