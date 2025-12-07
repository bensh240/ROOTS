<?php
header('Content-Type: application/json; charset=utf-8');

// Load configuration from external file (more secure)
require_once(__DIR__ . '/config.php');

// Override FROM_NAME for health form
if (!defined('SMTP_FROM_NAME')) {
    define('SMTP_FROM_NAME', 'ROOTS - הצהרת בריאות');
}

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

// Generate PDF content
$pdfContent = generateHealthFormPDF($data);

// Save PDF temporarily
$pdfFilename = 'health_declaration_' . date('Y-m-d_His') . '_' . uniqid() . '.pdf';
$pdfPath = sys_get_temp_dir() . '/' . $pdfFilename;
file_put_contents($pdfPath, $pdfContent);

// Send email to company
$companySent = sendEmailWithAttachment(
    SMTP_TO,
    'הצהרת בריאות חדשה - ' . htmlspecialchars($data['fullName']),
    generateEmailBody($data, false),
    $pdfPath,
    $pdfFilename
);

// Send email to client
$clientSent = sendEmailWithAttachment(
    $data['email'],
    'העתק הצהרת בריאות - ROOTS',
    generateEmailBody($data, true),
    $pdfPath,
    $pdfFilename
);

// Delete temporary PDF
unlink($pdfPath);

if ($companySent && $clientSent) {
    echo json_encode([
        'success' => true,
        'message' => 'ההצהרה נשלחה בהצלחה! קיבלת עותק למייל.'
    ]);
} elseif ($companySent) {
    echo json_encode([
        'success' => true,
        'message' => 'ההצהרה נשלחה בהצלחה! (לא ניתן היה לשלוח עותק למייל שלך)'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'אירעה שגיאה בשליחת ההצהרה. אנא נסה שוב.'
    ]);
}

// Function to generate PDF content
function generateHealthFormPDF($data) {
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
                <div class='value'>" . htmlspecialchars($data['idNumber']) . "</div>
            </div>
            <div class='field'>
                <div class='label'>אימייל:</div>
                <div class='value'>" . htmlspecialchars($data['email']) . "</div>
            </div>
            <div class='field'>
                <div class='label'>טלפון:</div>
                <div class='value'>" . htmlspecialchars($data['phone']) . "</div>
            </div>
            <div class='field'>
                <div class='label'>כתובת:</div>
                <div class='value'>" . htmlspecialchars($data['address']) . "</div>
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
    
    // Use DomPDF or similar library to convert HTML to PDF
    // For now, return HTML (you'll need to install a PDF library)
    require_once(__DIR__ . '/vendor/autoload.php'); // Composer autoload
    
    try {
        $dompdf = new \Dompdf\Dompdf(['enable_html5_parser' => true]);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        return $dompdf->output();
    } catch (Exception $e) {
        // Fallback: return HTML if PDF generation fails
        return $html;
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
        if (isset($data[$key]) && !empty($data[$key])) {
            $html .= "<div class='field'>
                <div class='label'>{$label}:</div>
                <div class='value'>" . nl2br(htmlspecialchars($data[$key])) . "</div>
            </div>";
        }
    }
    
    return $html;
}

// Function to generate email body
function generateEmailBody($data, $isClient) {
    if ($isClient) {
        $greeting = "שלום " . htmlspecialchars($data['fullName']) . ",";
        $message = "תודה שמילאת את הצהרת הבריאות.<br>מצורף עותק של ההצהרה שלך.";
    } else {
        $greeting = "הצהרת בריאות חדשה התקבלה";
        $message = "התקבלה הצהרת בריאות חדשה מ: <strong>" . htmlspecialchars($data['fullName']) . "</strong><br>מצורף קובץ PDF של ההצהרה.";
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
                    <li>טלפון: " . htmlspecialchars($data['phone']) . "</li>
                    <li>תאריך: " . date('d/m/Y H:i:s') . "</li>
                </ul>
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

// Function to send email with attachment
function sendEmailWithAttachment($to, $subject, $body, $attachmentPath, $attachmentName) {
    $boundary = md5(time());
    
    $headers = "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM . ">\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";
    
    $message = "--{$boundary}\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $message .= $body . "\r\n\r\n";
    
    // Attach PDF
    if (file_exists($attachmentPath)) {
        $fileContent = chunk_split(base64_encode(file_get_contents($attachmentPath)));
        $message .= "--{$boundary}\r\n";
        $message .= "Content-Type: application/pdf; name=\"{$attachmentName}\"\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n";
        $message .= "Content-Disposition: attachment; filename=\"{$attachmentName}\"\r\n\r\n";
        $message .= $fileContent . "\r\n";
    }
    
    $message .= "--{$boundary}--";
    
    ini_set('SMTP', SMTP_HOST);
    ini_set('smtp_port', SMTP_PORT);
    
    return mail($to, $subject, $message, $headers);
}
?>

