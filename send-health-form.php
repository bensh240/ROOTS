<?php
header('Content-Type: application/json; charset=utf-8');

// Load configuration
require_once(__DIR__ . '/config.php');

// Load PHPMailer
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
$fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$pdfBase64 = isset($_POST['pdf']) ? $_POST['pdf'] : '';
$formDataJson = isset($_POST['formData']) ? $_POST['formData'] : '';

// Parse the full form data for email body
$data = json_decode($formDataJson, true);
if (!$data) {
    $data = [];
}

// Debug: Log received data
error_log("Health Form - Received from: {$fullName} ({$email})");
error_log("Health Form - PDF received: " . (!empty($pdfBase64) ? 'Yes' : 'No'));

// Validate required fields
if (empty($fullName) || empty($email)) {
    http_response_code(400);
    error_log("Health Form - Validation failed: fullName or email missing");
    echo json_encode(['success' => false, 'message' => 'נא למלא את כל השדות הנדרשים']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'כתובת מייל לא תקינה']);
    exit;
}

// Validate PDF
if (empty($pdfBase64)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'שגיאה ביצירת קובץ PDF']);
    exit;
}

// Decode PDF from base64
$pdfContent = base64_decode($pdfBase64);

// Build email content for company
$emailSubject = 'הצהרת בריאות חדשה - ' . htmlspecialchars($fullName);
$emailBody = generateSimpleEmailBody($fullName, $email, $phone, false);

// Build email content for client
$clientEmailSubject = 'העתק הצהרת בריאות - ROOTS';
$clientEmailBody = generateSimpleEmailBody($fullName, $email, $phone, true);

$companySent = false;
$clientSent = false;

// Send email to company with PDF
$companySent = sendEmailWithPDF(SMTP_TO, $emailSubject, $emailBody, $pdfContent, $fullName, $email, $fullName);

// Send email to client with PDF
$clientSent = sendEmailWithPDF($email, $clientEmailSubject, $clientEmailBody, $pdfContent, $fullName);

// Log results
error_log("Health Form - Company email sent: " . ($companySent ? 'Yes' : 'No'));
error_log("Health Form - Client email sent: " . ($clientSent ? 'Yes' : 'No'));

if ($companySent && $clientSent) {
    echo json_encode([
        'success' => true,
        'message' => 'ההצהרה נשלחה בהצלחה! קיבלת אישור למייל.'
    ]);
} elseif ($companySent) {
    echo json_encode([
        'success' => true,
        'message' => 'ההצהרה נשלחה בהצלחה! (לא ניתן היה לשלוח אישור למייל שלך)'
    ]);
} else {
    http_response_code(500);
    error_log("Health Form - Both emails failed!");
    echo json_encode([
        'success' => false,
        'message' => 'אירעה שגיאה בשליחת ההצהרה. אנא בדוק את חיבור האינטרנט ונסה שוב, או צור איתנו קשר בטלפון: 054-220-7200'
    ]);
}

// Function to generate simple email body (PDF is attached)
function generateSimpleEmailBody($fullName, $email, $phone, $isClient) {
    if ($isClient) {
        $greeting = "שלום " . htmlspecialchars($fullName);
        $message = "תודה שמילאת את הצהרת הבריאות.<br><br>מצורף להלן עותק של ההצהרה שלך בפורמט PDF.";
    } else {
        $greeting = "הצהרת בריאות חדשה התקבלה";
        $message = "התקבלה הצהרת בריאות חדשה מהלקוח/ה: <strong>" . htmlspecialchars($fullName) . "</strong><br><br>מצורף קובץ PDF עם פרטי ההצהרה המלאים.";
    }
    
    $phoneDisplay = !empty($phone) ? htmlspecialchars($phone) : 'לא צוין';
    
    return "
    <html dir='rtl'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; background: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6B8E23 0%, #8BA73E 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .info-box { background: #f9f9f9; padding: 20px; border-radius: 8px; border-right: 4px solid #6B8E23; margin: 20px 0; }
            .info-item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .info-item:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #6B5435; }
            .value { color: #333; margin-top: 5px; }
            .pdf-icon { background: #ff6b6b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1 style='margin: 0; font-size: 26px;'>{$greeting}</h1>
            </div>
            <div class='content'>
                <p style='font-size: 16px; line-height: 1.6;'>{$message}</p>
                
                <div class='info-box'>
                    <div class='info-item'>
                        <div class='label'>שם:</div>
                        <div class='value'>" . htmlspecialchars($fullName) . "</div>
                    </div>
                    <div class='info-item'>
                        <div class='label'>אימייל:</div>
                        <div class='value'>" . htmlspecialchars($email) . "</div>
                    </div>
                    <div class='info-item'>
                        <div class='label'>טלפון:</div>
                        <div class='value'>{$phoneDisplay}</div>
                    </div>
                    <div class='info-item'>
                        <div class='label'>תאריך:</div>
                        <div class='value'>" . date('d/m/Y H:i:s') . "</div>
                    </div>
                </div>
                
                <div class='pdf-icon'>
                    📄 קובץ PDF מצורף להודעה זו
                </div>
            </div>
            <div class='footer'>
                <p><strong>ROOTS - טיפולים הוליסטיים</strong><br>
                054-220-7200 | info@rutvaknin.co.il</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

// Function to send email with PDF attachment
function sendEmailWithPDF($to, $subject, $body, $pdfContent, $pdfFilename, $replyToEmail = null, $replyToName = null) {
    $mail = null;
    
    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->SMTPDebug = (defined('SMTP_DEBUG') && SMTP_DEBUG) ? 2 : 0;
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = SMTP_PORT;
        $mail->CharSet = 'UTF-8';
        
        // Recipients
        $mail->setFrom(SMTP_FROM, 'ROOTS - הצהרת בריאות');
        $mail->addAddress($to);
        
        if ($replyToEmail) {
            $mail->addReplyTo($replyToEmail, $replyToName);
        }
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        
        // Attach PDF
        $mail->addStringAttachment($pdfContent, $pdfFilename . '_health_form.pdf', 'base64', 'application/pdf');
        
        $mail->send();
        error_log("Health Form - Email with PDF sent successfully to: " . $to);
        return true;
    } catch (Exception $e) {
        error_log("Health Form - Email with PDF failed to {$to}: " . $e->getMessage());
        if ($mail !== null && isset($mail->ErrorInfo)) {
            error_log("Health Form - PHPMailer Error Info: " . $mail->ErrorInfo);
        }
        return false;
    }
}
?>

