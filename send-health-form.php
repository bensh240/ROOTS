<?php
header('Content-Type: application/json; charset=utf-8');

// Load configuration
require_once(__DIR__ . '/config.php');

// Load PHPMailer and DomPDF
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once(__DIR__ . '/vendor/autoload.php');

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

// Validate required fields
if (empty($data['fullName']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'נא למלא את כל השדות הנדרשים']);
    exit;
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'כתובת מייל לא תקינה']);
    exit;
}

// Generate PDF content (if possible)
$pdfPath = null;
$pdfFilename = null;

try {
    $pdfContent = generateHealthFormPDF($data);
    if ($pdfContent) {
        $pdfFilename = 'health_declaration_' . date('Y-m-d_His') . '_' . uniqid() . '.pdf';
        $pdfPath = sys_get_temp_dir() . '/' . $pdfFilename;
        file_put_contents($pdfPath, $pdfContent);
    }
} catch (Exception $e) {
    error_log("PDF generation failed: " . $e->getMessage());
    // Continue without PDF
}

$companySent = false;
$clientSent = false;
$hasPDF = ($pdfPath !== null);

// Send email to company
try {
    $companySent = sendEmailWithAttachment(
        SMTP_TO,
        'הצהרת בריאות חדשה - ' . htmlspecialchars($data['fullName']),
        generateEmailBody($data, false, $hasPDF),
        $pdfPath,
        $pdfFilename
    );
} catch (Exception $e) {
    error_log("Company email failed: " . $e->getMessage());
}

// Send email to client
try {
    $clientSent = sendEmailWithAttachment(
        $data['email'],
        'העתק הצהרת בריאות - ROOTS',
        generateEmailBody($data, true, $hasPDF),
        $pdfPath,
        $pdfFilename
    );
} catch (Exception $e) {
    error_log("Client email failed: " . $e->getMessage());
}

// Delete temporary PDF
if (file_exists($pdfPath)) {
    unlink($pdfPath);
}

if ($companySent && $clientSent) {
    $message = 'ההצהרה נשלחה בהצלחה! ';
    $message .= $hasPDF ? 'קיבלת עותק PDF למייל.' : 'קיבלת אישור למייל.';
    echo json_encode([
        'success' => true,
        'message' => $message
    ]);
} elseif ($companySent) {
    $message = 'ההצהרה נשלחה בהצלחה! ';
    $message .= $hasPDF ? '(לא ניתן היה לשלוח עותק PDF למייל שלך)' : '(לא ניתן היה לשלוח אישור למייל שלך)';
    echo json_encode([
        'success' => true,
        'message' => $message
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'אירעה שגיאה בשליחת ההצהרה. אנא נסה שוב או צור איתנו קשר בטלפון.'
    ]);
}

// Function to generate PDF content
function generateHealthFormPDF($data) {
    // Check if DomPDF is available
    if (!class_exists('\Dompdf\Dompdf')) {
        error_log("DomPDF not installed - skipping PDF generation");
        return null;
    }
    
    $html = "
    <!DOCTYPE html>
    <html dir='rtl'>
    <head>
        <meta charset='UTF-8'>
        <style>
            @page { margin: 40px; }
            body { font-family: DejaVu Sans, Arial, sans-serif; direction: rtl; text-align: right; font-size: 12px; }
            .header { background: #6B8E23; color: white; padding: 20px; text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 24px; }
            .section { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e5e5; }
            .section-title { background: #f8f8f8; padding: 10px; font-weight: bold; color: #6B5435; margin: -15px -15px 15px -15px; }
            .field { margin-bottom: 10px; padding: 8px; background: #fafafa; }
            .label { font-weight: bold; color: #6B5435; }
            .value { margin-top: 3px; color: #333; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #6B8E23; text-align: center; color: #888; font-size: 10px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>הצהרת בריאות - ROOTS</h1>
            <p>טיפולים הוליסטיים ושיקום רפואי</p>
        </div>
        
        <div class='section'>
            <div class='section-title'>פרטים אישיים</div>
            <div class='field'>
                <div class='label'>שם מלא:</div>
                <div class='value'>" . htmlspecialchars($data['fullName']) . "</div>
            </div>
            <div class='field'>
                <div class='label'>מספר ת.ז:</div>
                <div class='value'>" . htmlspecialchars($data['idNumber'] ?? '') . "</div>
            </div>
            <div class='field'>
                <div class='label'>אימייל:</div>
                <div class='value'>" . htmlspecialchars($data['email']) . "</div>
            </div>
            <div class='field'>
                <div class='label'>טלפון:</div>
                <div class='value'>" . htmlspecialchars($data['phone'] ?? '') . "</div>
            </div>
            <div class='field'>
                <div class='label'>כתובת:</div>
                <div class='value'>" . htmlspecialchars($data['address'] ?? '') . "</div>
            </div>
        </div>
        
        <div class='section'>
            <div class='section-title'>שאלות רפואיות</div>
            " . generateMedicalQuestions($data) . "
        </div>
        
        <div class='footer'>
            <p><strong>תאריך:</strong> " . date('d/m/Y H:i:s') . "</p>
            <p>ROOTS - טיפולים הוליסטיים | השדרה האקדמית 2, קרית אונו | 054-220-7200 | info@rutvaknin.co.il</p>
        </div>
    </body>
    </html>
    ";
    
    // Use DomPDF to convert HTML to PDF
    try {
        $dompdf = new \Dompdf\Dompdf(['enable_html5_parser' => true]);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        return $dompdf->output();
    } catch (Exception $e) {
        error_log("PDF generation failed: " . $e->getMessage());
        return null;
    }
}

// Function to generate medical questions HTML
function generateMedicalQuestions($data) {
    $questions = [
        'pregnancy' => 'הריון',
        'epilepsy' => 'אפילפסיה',
        'heartDisease' => 'מחלות לב',
        'cancer' => 'סרטן',
        'bloodPressure' => 'לחץ דם',
        'diabetes' => 'סוכרת',
        'breathing' => 'בעיות נשימה',
        'bloodThinners' => 'תרופות למיעוי דם',
        'chronicPain' => 'כאבים כרוניים',
        'surgeries' => 'ניתוחים',
        'allergies' => 'אלרגיות',
        'skinConditions' => 'מחלות עור',
        'medications' => 'תרופות'
    ];
    
    $html = '';
    foreach ($questions as $key => $label) {
        if (isset($data[$key]) && !empty($data[$key]) && $data[$key] !== 'no') {
            $html .= "<div class='field'>
                <div class='label'>{$label}:</div>
                <div class='value'>" . nl2br(htmlspecialchars($data[$key])) . "</div>
            </div>";
        }
    }
    
    return $html ?: "<p>אין מידע רפואי נוסף.</p>";
}

// Function to generate email body
function generateEmailBody($data, $isClient, $hasPDF = true) {
    if ($isClient) {
        $greeting = "שלום " . htmlspecialchars($data['fullName']) . ",";
        $message = "תודה שמילאת את הצהרת הבריאות.";
        if ($hasPDF) {
            $message .= "<br>מצורף עותק PDF של ההצהרה שלך.";
        }
    } else {
        $greeting = "הצהרת בריאות חדשה התקבלה";
        $message = "התקבלה הצהרת בריאות חדשה מ: <strong>" . htmlspecialchars($data['fullName']) . "</strong>";
        if ($hasPDF) {
            $message .= "<br>מצורף קובץ PDF של ההצהרה.";
        }
    }
    
    $detailsHtml = "";
    if (!$hasPDF && !$isClient) {
        // If no PDF and it's for the company, include form data in email
        $detailsHtml = "
        <div style='margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px;'>
            <h3 style='color: #6B5435; margin-bottom: 15px;'>פרטים מלאים:</h3>
            <div style='margin-bottom: 10px;'><strong>מספר ת.ז:</strong> " . htmlspecialchars($data['idNumber'] ?? '') . "</div>
            <div style='margin-bottom: 10px;'><strong>כתובת:</strong> " . htmlspecialchars($data['address'] ?? '') . "</div>
            " . generateMedicalQuestionsHTML($data) . "
        </div>";
    }
    
    return "
    <html dir='rtl'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
            .container { max-width: 600px; margin: 0 auto; background: #f8f8f8; padding: 20px; }
            .header { background: linear-gradient(135deg, #6B8E23 0%, #8BA73E 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>{$greeting}</h2>
            </div>
            <div class='content'>
                <p>{$message}</p>
                <p><strong>פרטים:</strong></p>
                <ul style='text-align: right;'>
                    <li>שם: " . htmlspecialchars($data['fullName']) . "</li>
                    <li>אימייל: " . htmlspecialchars($data['email']) . "</li>
                    <li>טלפון: " . htmlspecialchars($data['phone'] ?? '') . "</li>
                    <li>תאריך: " . date('d/m/Y H:i:s') . "</li>
                </ul>
                {$detailsHtml}
            </div>
            <div class='footer'>
                <p>ROOTS - טיפולים הוליסטיים<br>
                השדרה האקדמית 2, קרית אונו<br>
                054-220-7200 | info@rutvaknin.co.il</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

// Helper function for email body
function generateMedicalQuestionsHTML($data) {
    $questions = [
        'pregnancy' => 'הריון',
        'epilepsy' => 'אפילפסיה',
        'heartDisease' => 'מחלות לב',
        'cancer' => 'סרטן',
        'bloodPressure' => 'לחץ דם',
        'diabetes' => 'סוכרת',
        'breathing' => 'בעיות נשימה',
        'bloodThinners' => 'תרופות למיעוי דם',
        'chronicPain' => 'כאבים כרוניים',
        'surgeries' => 'ניתוחים',
        'allergies' => 'אלרגיות',
        'skinConditions' => 'מחלות עור',
        'medications' => 'תרופות'
    ];
    
    $html = '<div style="margin-top: 15px;"><strong>מידע רפואי:</strong><ul>';
    $hasData = false;
    foreach ($questions as $key => $label) {
        if (isset($data[$key]) && !empty($data[$key]) && $data[$key] !== 'no') {
            $html .= "<li><strong>{$label}:</strong> " . nl2br(htmlspecialchars($data[$key])) . "</li>";
            $hasData = true;
        }
    }
    $html .= '</ul></div>';
    
    return $hasData ? $html : '<div style="margin-top: 15px;"><em>אין מידע רפואי נוסף.</em></div>';
}

// Function to send email with attachment using PHPMailer
function sendEmailWithAttachment($to, $subject, $body, $attachmentPath = null, $attachmentName = null) {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = SMTP_PORT;
    $mail->CharSet = 'UTF-8';
    
    // Debugging (if enabled)
    if (defined('SMTP_DEBUG') && SMTP_DEBUG) {
        $mail->SMTPDebug = 2;
    }
    
    // Recipients
    $mail->setFrom(SMTP_FROM, 'ROOTS - הצהרת בריאות');
    $mail->addAddress($to);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $body;
    
    // Attach PDF if available
    if ($attachmentPath && file_exists($attachmentPath)) {
        $mail->addAttachment($attachmentPath, $attachmentName);
    }
    
    $mail->send();
    return true;
}
?>
