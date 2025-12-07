// Roots Booking System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // State
    const bookingState = {
        currentStep: 1,
        selectedTreatment: null,
        selectedDate: null,
        selectedTime: null,
        customerDetails: {},
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear()
    };

    // Treatment names in Hebrew
    const treatmentNames = {
        'swedish': 'עיסוי שוודי',
        'medical': 'עיסוי רפואי',
        'pregnancy': 'עיסוי לנשים בהריון',
        'scalp': 'עיסוי קרקפת יפני',
        'hotstones': 'עיסוי באבנים חמות',
        'cupping': 'כוסות רוח',
        'sports': 'טיפול בפציעות ספורט'
    };

    // Hebrew month names
    const hebrewMonths = [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];

    const hebrewDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

    // Available time slots (09:00 - 20:00, every hour)
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    // Friday hours (09:00 - 14:00)
    const fridaySlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

    // Simulated booked slots (in real app, fetch from server)
    const bookedSlots = {
        // Format: 'YYYY-MM-DD': ['10:00', '14:00', ...]
    };

    // Initialize
    init();

    function init() {
        setupTreatmentSelection();
        setupCalendar();
        setupNavigation();
        setupForm();
    }

    // Step 1: Treatment Selection
    function setupTreatmentSelection() {
        const treatmentCards = document.querySelectorAll('.treatment_card');
        
        treatmentCards.forEach(card => {
            const btn = card.querySelector('.select_treatment_btn');
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                selectTreatment(card);
            });
            
            card.addEventListener('click', function() {
                selectTreatment(card);
            });
        });
    }

    function selectTreatment(card) {
        // Remove previous selection
        document.querySelectorAll('.treatment_card').forEach(c => c.classList.remove('selected'));
        
        // Select new
        card.classList.add('selected');
        
        bookingState.selectedTreatment = {
            type: card.dataset.treatment,
            name: treatmentNames[card.dataset.treatment],
            duration: parseInt(card.dataset.duration),
            price: parseInt(card.dataset.price)
        };

        // Auto advance after short delay
        setTimeout(() => {
            nextStep();
        }, 500);
    }

    // Step 2: Calendar
    function setupCalendar() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            bookingState.currentMonth--;
            if (bookingState.currentMonth < 0) {
                bookingState.currentMonth = 11;
                bookingState.currentYear--;
            }
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            bookingState.currentMonth++;
            if (bookingState.currentMonth > 11) {
                bookingState.currentMonth = 0;
                bookingState.currentYear++;
            }
            renderCalendar();
        });

        renderCalendar();
    }

    function renderCalendar() {
        const monthTitle = document.getElementById('currentMonth');
        monthTitle.textContent = `${hebrewMonths[bookingState.currentMonth]} ${bookingState.currentYear}`;

        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';

        // Add day labels
        hebrewDays.forEach(day => {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'calendar_day weekday_label';
            dayLabel.textContent = day;
            calendarGrid.appendChild(dayLabel);
        });

        const firstDay = new Date(bookingState.currentYear, bookingState.currentMonth, 1).getDay();
        const daysInMonth = new Date(bookingState.currentYear, bookingState.currentMonth + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar_day';
            calendarGrid.appendChild(emptyDay);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar_day';
            dayElement.textContent = day;

            const currentDate = new Date(bookingState.currentYear, bookingState.currentMonth, day);
            const dayOfWeek = currentDate.getDay();

            // Check if date is in the past
            if (currentDate < today) {
                dayElement.classList.add('past');
            }
            // Check if Saturday (closed)
            else if (dayOfWeek === 6) {
                dayElement.classList.add('disabled');
                dayElement.title = 'סגור בשבת';
            }
            // Available date
            else {
                dayElement.classList.add('available');
                dayElement.addEventListener('click', () => selectDate(day, currentDate));
                
                // Check if this is selected date
                if (bookingState.selectedDate && 
                    bookingState.selectedDate.getDate() === day &&
                    bookingState.selectedDate.getMonth() === bookingState.currentMonth &&
                    bookingState.selectedDate.getFullYear() === bookingState.currentYear) {
                    dayElement.classList.add('selected');
                }
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    function selectDate(day, date) {
        bookingState.selectedDate = date;
        bookingState.selectedTime = null; // Reset time selection
        renderCalendar();
        renderTimeSlots(date);
        updateStepButton();
    }

    function renderTimeSlots(date) {
        const timeslotsGrid = document.getElementById('timeslotsGrid');
        timeslotsGrid.innerHTML = '';

        const dayOfWeek = date.getDay();
        const dateString = formatDateForBooking(date);
        
        // Get appropriate slots based on day
        const slots = dayOfWeek === 5 ? fridaySlots : timeSlots;
        
        slots.forEach(time => {
            const timeslot = document.createElement('div');
            timeslot.className = 'timeslot';
            timeslot.textContent = time;

            // Check if slot is already booked
            if (bookedSlots[dateString] && bookedSlots[dateString].includes(time)) {
                timeslot.classList.add('disabled');
                timeslot.title = 'התור תפוס';
            } else {
                timeslot.addEventListener('click', () => selectTime(time, timeslot));
                
                // Check if this is selected time
                if (bookingState.selectedTime === time) {
                    timeslot.classList.add('selected');
                }
            }

            timeslotsGrid.appendChild(timeslot);
        });
    }

    function selectTime(time, element) {
        // Remove previous selection
        document.querySelectorAll('.timeslot').forEach(slot => slot.classList.remove('selected'));
        
        // Select new
        element.classList.add('selected');
        bookingState.selectedTime = time;
        updateStepButton();
    }

    function formatDateForBooking(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDateHebrew(date) {
        const day = date.getDate();
        const month = hebrewMonths[date.getMonth()];
        const year = date.getFullYear();
        const dayName = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][date.getDay()];
        return `יום ${dayName}, ${day} ב${month} ${year}`;
    }

    // Step 3: Form
    function setupForm() {
        const form = document.getElementById('bookingForm');
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            e.target.value = value;
        });
    }

    function validateForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!fullName || fullName.length < 2) {
            alert('נא להזין שם מלא');
            return false;
        }

        if (!phone || phone.length !== 10) {
            alert('נא להזין מספר טלפון תקין (10 ספרות)');
            return false;
        }

        if (!email || !email.includes('@')) {
            alert('נא להזין כתובת אימייל תקינה');
            return false;
        }

        bookingState.customerDetails = {
            fullName,
            phone,
            email,
            notes: document.getElementById('notes').value.trim()
        };

        return true;
    }

    // Step 4: Summary
    function updateSummary() {
        document.getElementById('summaryTreatment').textContent = bookingState.selectedTreatment.name;
        document.getElementById('summaryDateTime').textContent = 
            `${formatDateHebrew(bookingState.selectedDate)} בשעה ${bookingState.selectedTime}`;
        document.getElementById('summaryDuration').textContent = `${bookingState.selectedTreatment.duration} דקות`;
        document.getElementById('summaryPrice').textContent = `₪${bookingState.selectedTreatment.price}`;
        document.getElementById('summaryCustomer').innerHTML = `
            <strong>${bookingState.customerDetails.fullName}</strong><br/>
            ${bookingState.customerDetails.phone}<br/>
            ${bookingState.customerDetails.email}
        `;
    }

    // Navigation
    function setupNavigation() {
        // Back buttons
        document.querySelectorAll('.btn_back').forEach(btn => {
            btn.addEventListener('click', previousStep);
        });

        // Next buttons in step 2
        document.querySelector('.booking_step_2 .btn_next').addEventListener('click', () => {
            if (bookingState.selectedDate && bookingState.selectedTime) {
                nextStep();
            }
        });

        // Next button in step 3
        document.querySelector('.booking_step_3 .btn_next').addEventListener('click', () => {
            if (validateForm()) {
                updateSummary();
                nextStep();
            }
        });

        // Confirm button
        document.querySelector('.btn_confirm').addEventListener('click', confirmBooking);

        // New booking button
        document.querySelector('.btn_new_booking').addEventListener('click', resetBooking);
    }

    function nextStep() {
        if (bookingState.currentStep < 4) {
            bookingState.currentStep++;
            updateStepDisplay();
        }
    }

    function previousStep() {
        if (bookingState.currentStep > 1) {
            bookingState.currentStep--;
            updateStepDisplay();
        }
    }

    function updateStepDisplay() {
        // Update progress indicators
        document.querySelectorAll('.progress_step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < bookingState.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === bookingState.currentStep) {
                step.classList.add('active');
            }
        });

        // Update step visibility
        document.querySelectorAll('.booking_step').forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === bookingState.currentStep) {
                step.classList.add('active');
            }
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateStepButton() {
        const nextBtn = document.querySelector('.booking_step_2 .btn_next');
        if (bookingState.selectedDate && bookingState.selectedTime) {
            nextBtn.disabled = false;
        } else {
            nextBtn.disabled = true;
        }
    }

    function confirmBooking() {
        // In real app, send to server
        const bookingData = {
            treatment: bookingState.selectedTreatment,
            date: formatDateForBooking(bookingState.selectedDate),
            time: bookingState.selectedTime,
            customer: bookingState.customerDetails
        };

        console.log('Booking confirmed:', bookingData);

        // Add to booked slots
        const dateString = formatDateForBooking(bookingState.selectedDate);
        if (!bookedSlots[dateString]) {
            bookedSlots[dateString] = [];
        }
        bookedSlots[dateString].push(bookingState.selectedTime);

        // Show success message
        showSuccess();

        // In real app, you would send this via WhatsApp API or SMS
        const message = `תור חדש נקבע!\n\nטיפול: ${bookingState.selectedTreatment.name}\nתאריך: ${formatDateHebrew(bookingState.selectedDate)}\nשעה: ${bookingState.selectedTime}\nלקוח: ${bookingState.customerDetails.fullName}\nטלפון: ${bookingState.customerDetails.phone}`;
        console.log('WhatsApp message:', message);
    }

    function showSuccess() {
        document.querySelectorAll('.booking_step').forEach(step => step.style.display = 'none');
        document.querySelector('.booking_progress').style.display = 'none';
        
        const successDiv = document.querySelector('.booking_success');
        successDiv.style.display = 'block';
        
        document.getElementById('successDetails').innerHTML = `
            <strong>${bookingState.selectedTreatment.name}</strong><br/>
            ${formatDateHebrew(bookingState.selectedDate)}<br/>
            שעה ${bookingState.selectedTime}
        `;
    }

    function resetBooking() {
        // Reset state
        bookingState.currentStep = 1;
        bookingState.selectedTreatment = null;
        bookingState.selectedDate = null;
        bookingState.selectedTime = null;
        bookingState.customerDetails = {};
        bookingState.currentMonth = new Date().getMonth();
        bookingState.currentYear = new Date().getFullYear();

        // Reset UI
        document.querySelectorAll('.treatment_card').forEach(card => card.classList.remove('selected'));
        document.getElementById('bookingForm').reset();
        
        document.querySelector('.booking_success').style.display = 'none';
        document.querySelector('.booking_progress').style.display = 'flex';
        
        updateStepDisplay();
        renderCalendar();
    }
});

