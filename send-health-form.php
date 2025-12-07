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

// Get form data (same as contact form)
$data = $_POST;

// Debug: Log received data (remove in production)
error_log("Health Form - Received POST data: " . print_r($_POST, true));

// Validate required fields
if (empty($data['fullName']) || empty($data['email'])) {
    http_response_code(400);
    error_log("Health Form - Validation failed: fullName or email missing");
    echo json_encode(['success' => false, 'message' => 'נא למלא את כל השדות הנדרשים']);
    exit;
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'כתובת מייל לא תקינה']);
    exit;
}

// Build email content for company
$emailSubject = 'הצהרת בריאות חדשה - ' . htmlspecialchars($data['fullName']);
$emailBody = generateEmailBody($data, false);

// Build email content for client
$clientEmailSubject = 'העתק הצהרת בריאות - ROOTS';
$clientEmailBody = generateEmailBody($data, true);

$companySent = false;
$clientSent = false;

// Send email to company
$companySent = sendEmail(SMTP_TO, $emailSubject, $emailBody, $data['email'], $data['fullName']);

// Send email to client  
$clientSent = sendEmail($data['email'], $clientEmailSubject, $clientEmailBody);

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

// Function to generate email body
function generateEmailBody($data, $isClient) {
    if ($isClient) {
        $greeting = "שלום " . htmlspecialchars($data['fullName']) . ",";
        $message = "תודה שמילאת את הצהרת הבריאות.<br>מצורף להלן עותק של ההצהרה שלך.";
    } else {
        $greeting = "הצהרת בריאות חדשה התקבלה";
        $message = "התקבלה הצהרת בריאות חדשה מ: <strong>" . htmlspecialchars($data['fullName']) . "</strong>";
    }
    
    return "
    <html dir='rtl'>
    <head>
        <meta charset='UTF-8'>
        <style>
            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; }
            .container { max-width: 700px; margin: 0 auto; background: #f8f8f8; padding: 20px; }
            .header { background: linear-gradient(135deg, #6B8E23 0%, #8BA73E 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 25px; padding: 20px; background: #f9f9f9; border-radius: 8px; border-right: 4px solid #6B8E23; }
            .section-title { font-size: 18px; font-weight: bold; color: #6B5435; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e5e5e5; }
            .field { margin-bottom: 12px; padding: 10px; background: white; border-radius: 5px; }
            .label { font-weight: bold; color: #6B5435; margin-bottom: 5px; }
            .value { color: #333; margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #888; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1 style='margin: 0; font-size: 24px;'>{$greeting}</h1>
            </div>
            <div class='content'>
                <p style='font-size: 16px; margin-bottom: 20px;'>{$message}</p>
                
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
                    <div class='section-title'>מידע רפואי</div>
                    " . generateMedicalQuestionsHTML($data) . "
                </div>
                
                <div style='margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; text-align: center;'>
                    <p style='margin: 0; color: #2e7d32; font-weight: bold;'>תאריך שליחה: " . date('d/m/Y H:i:s') . "</p>
                </div>
            </div>
            <div class='footer'>
                <p><strong>ROOTS - טיפולים הוליסטיים</strong><br>
                השדרה האקדמית 2, קרית אונו<br>
                054-220-7200 | info@rutvaknin.co.il</p>
            </div>
        </div>
    </body>
    </html>
    ";
}

// Function to generate medical questions HTML
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
    
    $html = '';
    $hasData = false;
    
    foreach ($questions as $key => $label) {
        if (isset($data[$key]) && !empty($data[$key]) && $data[$key] !== 'no') {
            $html .= "<div class='field'>
                <div class='label'>{$label}:</div>
                <div class='value'>" . nl2br(htmlspecialchars($data[$key])) . "</div>
            </div>";
            $hasData = true;
        }
    }
    
    if (!$hasData) {
        $html = "<div class='field'><em style='color: #888;'>אין מידע רפואי נוסף.</em></div>";
    }
    
    return $html;
}

// Function to send email using PHPMailer
function sendEmail($to, $subject, $body, $replyToEmail = null, $replyToName = null) {
    $mail = null; // Initialize to avoid undefined variable error
    
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
        
        $mail->send();
        error_log("Health Form - Email sent successfully to: " . $to);
        return true;
    } catch (Exception $e) {
        error_log("Health Form - Email failed to {$to}: " . $e->getMessage());
        // Only access ErrorInfo if $mail was successfully created
        if ($mail !== null && isset($mail->ErrorInfo)) {
            error_log("Health Form - PHPMailer Error Info: " . $mail->ErrorInfo);
        }
        return false;
    }
}
?>
