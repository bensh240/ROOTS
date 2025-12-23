// Health Form JavaScript
const detailsMapping = {
    'epilepsy': 'epilepsy_details',
    'respiratory': 'respiratory_details',
    'spine': 'spine_details',
    'fractures': 'fractures_details',
    'joints': 'joints_details',
    'muscles': 'muscles_details',
    'injury': 'injury_details',
    'surgery': 'surgery_details',
    'heart': 'heart_details',
    'treatment': 'treatment_details',
    'liver_kidney': 'liver_kidney_details',
    'digestive': 'digestive_details',
    'diabetes': 'diabetes_details',
    'allergy': 'allergy_details',
    'skin': 'skin_details',
    'migraine': 'migraine_details',
    'depression': 'depression_details',
    'cancer': 'cancer_details',
    'hormonal': 'hormonal_details',
    'smoking': 'smoking_details',
    'alcohol': 'alcohol_details'
};

function toggleDetailsField(fieldName, show) {
    const detailsFieldId = detailsMapping[fieldName];
    if (detailsFieldId) {
        const detailsField = document.getElementById(detailsFieldId);
        if (detailsField) {
            if (show) {
                detailsField.classList.add('show');
            } else {
                detailsField.classList.remove('show');
                const textarea = detailsField.querySelector('textarea');
                if (textarea) {
                    textarea.value = '';
                }
            }
        }
    }
}

function saveToLocalStorage(data) {
    try {
        const timestamp = new Date().toISOString();
        const key = `health_statement_${timestamp}`;
        localStorage.setItem(key, JSON.stringify({
            ...data,
            timestamp: timestamp
        }));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// 2. עיצוב PDF משודרג עם צבעי פסטל וגבולות
async function generatePDF(data) {
    let pdfTemplate = null;
    try {
        pdfTemplate = document.createElement('div');
        pdfTemplate.id = 'pdf-template-temp';
        
        // הגדרות עיצוב כלליות עם צבעי פסטל וגבולות
        // שימוש ב-padding גדול יותר למניעת חיתוך בשוליים
        pdfTemplate.style.cssText = `
            position: fixed; left: -9999px; top: 0; width: 210mm; 
            background: #ffffff !important; padding: 20mm; 
            box-sizing: border-box; font-family: Assistant, sans-serif; 
            direction: rtl; color: #444 !important;
        `;
        
        const medicalQuestions = [
            ['pregnancy', 'היריון'], 
            ['epilepsy', 'אפילפסיה / אירועים מוחיים'],
            ['respiratory', 'מחלות נשימה / אסתמה'], 
            ['spine', 'שלד / עמוד שדרה / אורתופדיה'],
            ['fractures', 'שברים / נקעים'], 
            ['joints', 'כאבי / דלקות פרקים'],
            ['muscles', 'בעיות שרירים (כאבים כרוניים / ניוון / דלקות)'], 
            ['injury', 'פציעות ספורט / אחר'],
            ['surgery', 'ניתוחים (3 שנים אחרונות)'], 
            ['heart', 'מחלות לב / כלי דם / קרישה / לחץ דם'],
            ['treatment', 'טיפול רפואי בהווה (מערבי / משלים)'], 
            ['liver_kidney', 'מחלות כבד / כליות / דרכי השתן'],
            ['digestive', 'בעיות עיכול'], 
            ['diabetes', 'סוכרת'],
            ['allergy', 'אלרגיות'], 
            ['skin', 'מחלות עור'],
            ['migraine', 'כאבי ראש / מיגרנות'], 
            ['depression', 'דיכאון / חרדה'],
            ['cancer', 'סרטן / טיפולי כימותרפיה'], 
            ['hormonal', 'בעיות הורמונליות'],
            ['smoking', 'עישון קבוע'], 
            ['alcohol', 'אלכוהול קבוע'],
            ['otherProblems', 'פירוט תשובות חיוביות / מידע נוסף'], 
            ['medications', 'תרופות ותוספי תזונה קבועים']
        ];
        
        let medicalContent = '';
        medicalQuestions.forEach(([key, label]) => {
            let value = (data[key] === 'yes') ? 'כן' : (data[key] === 'no' ? 'לא' : (data[key] || 'לא צוין'));
            const detailsKey = key + '_details';
            const details = data[detailsKey] ? ` - ${data[detailsKey]}` : '';
            
            medicalContent += `
                <div style="margin-bottom: 4px; border-bottom: 1px dashed #e0e0e0; padding-bottom: 2px;">
                    <span style="color:#8B6F47; font-weight:bold; width: 280px; display: inline-block; vertical-align: top;">${label}:</span> 
                    <span style="display: inline-block; width: calc(100% - 290px);">${value}${details}</span>
                </div>`;
        });

        // Build approvals content
        const approvalItems = [
            'אני מאשר/ת שכל המידע שמסרתי במסמך זה הינו נכון, מלא ומדויק למיטב ידיעתי.',
            'אני מבין/ה כי הטיפול אינו מהווה תחליף לייעוץ רפואי או לטיפול רפואי קונבנציונלי.',
            'אני מאשר/ת כי קראתי את הצהרת הפרטיות ואני מסכים/ה לשמירת הנתונים שלי במערכת.',
            'אני לוקח/ת אחריות מלאה על בריאותי ומצהיר/ה כי התייעצתי עם רופא במידת הצורך לפני הטיפול.'
        ];
        
        let approvalsContent = '';
        approvalItems.forEach(text => {
            approvalsContent += `<div style="margin-bottom: 6px; display: flex; align-items: flex-start;"><span style="font-size: 12px; margin-left: 8px; color: #6b8e23;">☑</span><span>${text}</span></div>`;
        });

        // בניית ה-HTML של ה-PDF עם גבול דקורטיבי וצבעי פסטל
        pdfTemplate.innerHTML = `
            <div style="border: 2px solid #d1d9ce; padding: 12mm; position: relative; background: #fafafa; display: flex; flex-direction: column; gap: 15px;">
                <div style="text-align: center; background: #f4f7f2; padding: 15px; border-radius: 10px; margin-bottom: 10px;">
                    <img src="images/logo2.jpeg" style="height: 50px; margin-bottom: 8px;">
                    <h1 style="color: #6b8e23 !important; margin: 0; font-size: 22pt;">הצהרת בריאות - ROOTS</h1>
                    <p style="margin: 3px 0; font-size: 10pt; color: #888;">תאריך חתימה: ${new Date().toLocaleDateString('he-IL')}</p>
                </div>

                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-right: 5px solid #e2d1b3; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <h2 style="color: #8b6f47; font-size: 14pt; margin-top: 0; border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 5px;">פרטים אישיים</h2>
                    <table style="width: 100%; font-size: 10.5pt; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 6px; width: 50%;"><strong>שם מלא:</strong> ${data.fullName}</td>
                            <td style="padding: 6px; width: 50%;"><strong>ת.ז:</strong> ${data.idNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px;"><strong>טלפון:</strong> ${data.phone}</td>
                            <td style="padding: 6px;"><strong>אימייל:</strong> ${data.email}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="padding: 6px;"><strong>כתובת:</strong> ${data.address}</td>
                        </tr>
                    </table>
                </div>

                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-right: 5px solid #d1d9ce; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <h2 style="color: #6b8e23; font-size: 14pt; margin-top: 0; border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 5px;">נתונים רפואיים</h2>
                    <div style="font-size: 10pt; line-height: 1.5;">
                        ${medicalContent}
                    </div>
                </div>

                <div style="background: #ffffff; padding: 15px; border-radius: 8px; border-right: 5px solid #f0ead2; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <h2 style="color: #8B6F47; font-size: 13pt; margin-top: 0; border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 5px;">אישורים והצהרות</h2>
                    <div style="font-size: 9pt; line-height: 1.4;">
                        ${approvalsContent}
                    </div>
                </div>

                <div style="margin-top: auto; padding-top: 15px; text-align: center; border-top: 1px solid #eee; font-size: 9.5pt;">
                    <p style="margin-bottom: 3px; font-weight: bold; color: #6b8e23;">הצהרה זו נחתמה דיגיטלית ואושרה על ידי הלקוח.</p>
                    <p style="color: #888;">ROOTS - טיפולים הוליסטיים | 054-220-7200</p>
                </div>
            </div>
        `;

        document.body.appendChild(pdfTemplate);
        
        const canvas = await html2canvas(pdfTemplate, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // חישוב גובה התמונה ב-PDF (עם שמירה על שוליים)
        const margin = 10; 
        const innerWidth = pdfWidth - (margin * 2);
        const innerHeight = pdfHeight - (margin * 2);
        const imgHeight = (canvas.height * innerWidth) / canvas.width;
        
        // מנגנון חיתוך משופר למניעת "הידבקות" לקווי החיתוך
        if (imgHeight <= innerHeight) {
            pdf.addImage(imgData, 'JPEG', margin, margin, innerWidth, imgHeight);
        } else {
            let heightLeft = imgHeight;
            let position = 0; // נתחיל מ-0 כדי להשתמש בשוליים של התבנית עצמה
            
            // עמוד ראשון
            pdf.addImage(imgData, 'JPEG', margin, margin, innerWidth, imgHeight);
            heightLeft -= (pdfHeight - margin);
            
            // עמודים נוספים עם תיקון מיקום למניעת חיתוך שורות
            while (heightLeft > 0) {
                position = heightLeft - imgHeight + margin;
                pdf.addPage();
                // הוספת "לבן" קטן למעלה כדי שלא יחתוך שורה באמצע
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, pdfWidth, margin, 'F');
                pdf.addImage(imgData, 'JPEG', margin, position, innerWidth, imgHeight);
                heightLeft -= (pdfHeight - margin);
            }
        }
        
        document.body.removeChild(pdfTemplate);
        return pdf.output('dataurlstring').split(',')[1];
        
    } catch (error) {
        console.error('PDF Error:', error);
        if (pdfTemplate) document.body.removeChild(pdfTemplate);
        return null;
    }
}

// Check if all checkboxes are checked
function checkFormValidity() {
    const confirmAccuracy = document.getElementById('confirmAccuracy');
    const confirmUnderstanding = document.getElementById('confirmUnderstanding');
    const confirmPrivacy = document.getElementById('confirmPrivacy');
    const confirmResponsibility = document.getElementById('confirmResponsibility');
    const submitBtn = document.getElementById('submitBtn');
    
    if (confirmAccuracy && confirmUnderstanding && confirmPrivacy && confirmResponsibility && submitBtn) {
        const allChecked = confirmAccuracy.checked && confirmUnderstanding.checked && 
                           confirmPrivacy.checked && confirmResponsibility.checked;
        
        if (allChecked) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Initialize radio toggle listeners
    Object.keys(detailsMapping).forEach(fieldName => {
        const yesRadio = document.getElementById(`${fieldName}_yes`);
        const noRadio = document.getElementById(`${fieldName}_no`);
        
        if (yesRadio && noRadio) {
            yesRadio.addEventListener('change', function() {
                toggleDetailsField(fieldName, this.checked);
            });
            
            noRadio.addEventListener('change', function() {
                toggleDetailsField(fieldName, !this.checked);
            });
        }
    });

    // 2. Initialize checkbox listeners
    const checkboxes = ['confirmAccuracy', 'confirmUnderstanding', 'confirmPrivacy', 'confirmResponsibility'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', checkFormValidity);
        }
    });
    checkFormValidity();

    // 3. Form submit listener
    const healthForm = document.getElementById('healthForm');
    if (healthForm) {
        healthForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // גלילה חלקה למעלה כדי שהמשתמש יראה את הודעת הסטטוס
            window.scrollTo({ top: 0, behavior: 'smooth' });

            const confirmAccuracy = document.getElementById('confirmAccuracy');
            const confirmUnderstanding = document.getElementById('confirmUnderstanding');
            const confirmPrivacy = document.getElementById('confirmPrivacy');
            const confirmResponsibility = document.getElementById('confirmResponsibility');
            
            if (!confirmAccuracy.checked || !confirmUnderstanding.checked || 
                !confirmPrivacy.checked || !confirmResponsibility.checked) {
                alert('נא לאשר את כל התנאים לפני שליחת ההצהרה');
                return;
            }
            
            const formDataForSending = new FormData(this);
            const data = {};
            formDataForSending.forEach((value, key) => { data[key] = value; });
            
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            
            try {
                const saved = saveToLocalStorage(data);
                if (saved) {
                    successMessage.textContent = 'מייצר PDF ומעבד נתונים...';
                    successMessage.style.display = 'block';
                    
                    generatePDF(data).then(pdfBase64 => {
                        if (!pdfBase64) throw new Error('שגיאה ביצירת ה-PDF');
                        
                        successMessage.textContent = '...שולח את ההצהרה';
                        
                        const formData = new FormData();
                        formData.append('fullName', data.fullName || '');
                        formData.append('email', data.email || '');
                        formData.append('phone', data.phone || '');
                        formData.append('pdf', pdfBase64);
                        formData.append('formData', JSON.stringify(data));
                        
                        return fetch('send-health-form.php', {
                            method: 'POST',
                            body: formData
                        });
                    })
                    .then(response => response.text())
                    .then(responseText => {
                        let serverData = JSON.parse(responseText);
                        if (serverData.success) {
                            successMessage.textContent = serverData.message;
                            this.reset();
                            checkFormValidity();
                        } else {
                            throw new Error(serverData.message);
                        }
                    })
                    .catch(err => {
                        errorMessage.textContent = 'שגיאה: ' + err.message;
                        errorMessage.style.display = 'block';
                        successMessage.style.display = 'none';
                    });
                }
            } catch (error) {
                console.error(error);
            }
        });
    }
});

