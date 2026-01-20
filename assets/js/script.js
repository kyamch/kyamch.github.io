/* Main script written by Mahin (SOMC'63) and
Modified by MKA SOMRAT (KYAMC'22) Licensed by iSLam OS, 911*/

    let rollNumber = '';
    let batch = '';
    let notificationsEnabled = false;
    let selectedDay = '';

    const batchRanges = {
        'A': { start: 1, end: 21 },
        'B': { start: 22, end: 42 },
        'C': { start: 43, end: 63 },
        'D': { start: 64, end: 84 },
'E': { start: 85, end: 105 }
    };

    

    const schedule = {
        Saturday: [
            { time: '08:00', duration: 90, classes: [
                { batch: 'A', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial', teacher:'Dr. Swarna Maam' },
                { batch: 'B', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial', teacher:'Dr. Arif Sir' },
                { batch: 'C', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher:'Dr. Masum Sir'},
                { batch: 'D', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial', teacher:'Dr. Ibrahim Sir' },
                { batch: 'E', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial', teacher: '' }
                
            ]},
            { time: '09:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Physiology Lecture', venue: 'Gallery-1', type: 'Lecture', teacher: 'Asst. Prof. Dr. Nur Nahar Maam' }
            ]},
            { time: '10:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Anatomy Lecture', venue: 'Gallery-1', type: 'Lecture', teacher: 'Assoc. Prof. Dr. Sabrina Sabnam Maam' }
            ]},
            { time: '12:00', duration: 150, classes: [
                { batch: 'A', subject: 'Physiology Tutorial', venue: 'Tutorial Room',
             type: 'Tutorial' , teacher: 'Dr. Naim Sir'},
                { batch: 'B', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Tapossy Maam'},
                { batch: 'C', subject:
            'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Shahnuma Tammi Maam'},
                { batch: 'D', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Shamim Sir'},
                { batch: 'E', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hafsa Maam'}
            ]}
        ],
        Sunday: [
            { time: '08:00', duration: 90, classes: [
                { batch: 'A', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Ashif Sir'},
                { batch: 'B', subject: ' Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Oishee Maam'},
                { batch: 'C', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Jerry Maam'},
                { batch: 'D', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Sohel Sir'},
                { batch: 'E', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Mim Maam'}
                
            ]},
            { time: '09:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Biochemistry Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Dr. Sabera Sultana Maam'}
            ]},
            { time: '10:30', duration: 60, classes: [
                { batch: 'ALL', subject:  'Physiology Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Prof. Dr. Ayesha Yasmin Maam'}
            ]},
            { time: '12:00', duration: 150, classes: [
                { batch: 'A', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Swarna Maam'},
                { batch: 'B', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Arif Sir'},
                { batch: 'C', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Masum Sir'},
                { batch: 'D', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Ibrahim Sir'},
                { batch: 'E', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hasib Sir'}
            ]}
        ],
        Monday: [
            { time: '08:00', duration: 90, classes: [
                { batch: 'A', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Naim Sir'},
                { batch: 'B', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Tapossy Maam'},
                { batch: 'C', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Shahnuma Tammi Maam'},
                { batch: 'D', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Shamim Sir'},
                { batch: 'E', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hafsa Maam'}
                
            ]},
            { time: '09:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Biochemistry Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Assoc. Prof. Dr. Minhaj Ahmed Sir'}
            ]},
            { time: '10:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Anatomy Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Prof. Dr. Shameem Ahmed  Sir'}
            ]},
                        { time: '12:00', duration: 150, classes: [
                { batch: 'ALL', subject: 'Histology Practical', venue: 'Lab', type: 'Practical' , teacher: ''}
            ]}
        ],
        Tuesday: [
{ time: '08:00', duration: 90, classes: [
                { batch: 'A', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Swarna Maam'},
                { batch: 'B', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Arif Sir'},
                { batch: 'C', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Masum Sir'},
                { batch: 'D', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Ibrahim Sir'},
                { batch: 'E', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hasib Sir'}
                
            ]},
            { time: '09:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Physiology Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Assoc. Prof. Dr. Habiba Akter Maam'}
            ]},
            { time: '10:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Biochemistry Lecture', venue: 'Gallery-1',  type: 'Lecture', teacher: 'Prof. Dr. Emdadul Haque Sir' }
            ]},
            { time: '12:00', duration: 150, classes: [
                { batch: 'A', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Ashif Sir'},
                { batch: 'B', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Oishee Maam'},
                { batch: 'C', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Jerry Maam'},
                { batch: 'D', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Sohel Sir'},
                { batch: 'E', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hafsa MaamDr. Mim Maam'}
            ]}
        ],
        Wednesday: [
            { time: '08:00', duration: 90, classes: [
                { batch: 'A', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Swarna Maam'},
                { batch: 'B', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Arif Sir'},
                { batch: 'C', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Masum Sir'},
                { batch: 'D', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Ibrahim Sir'},
                { batch: 'E', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hasib Sir'}
                
            ]},
            { time: '09:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Anatomy Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Asst. Prof. Dr. Opu Rani Podder Maam'}
            ]},
            { time: '10:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Physiology Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Assoc. Prof. Dr. Kamrunnahar Maam'}
            ]},
            { time: '12:00', duration: 150, classes: [
                { batch: 'A', subject:  'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Naim Sir'},
                { batch: 'B', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Tapossy Maam'},
                { batch: 'C', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Shahnuma Tammi Maam'},
                { batch: 'D', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Shamim Sir'},
                { batch: 'E', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hafsa Maam'}
            ]}
        ],
        Thursday: [
{ time: '08:00', duration: 90, classes: [
                { batch: 'A', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Ashif Sir'},
                { batch: 'B', subject: 'Biochemistry Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Oishee Maam'},
                { batch: 'C', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Shahnuma Tammi Maam'},
                { batch: 'D', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Sohel Sir'},
                { batch: 'E', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Mim Maam'}
                
            ]},
            { time: '09:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Biochemistry Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Asst. Prof. Dr. Sunjidul Haque (Tusher) Sir'}
            ]},
            { time: '10:30', duration: 60, classes: [
                { batch: 'ALL', subject: 'Anatomy Lecture', venue: 'Gallery-1', type: 'Lecture' , teacher: 'Assoc. Prof. Dr. Rashed  Sir'}
            ]},
            { time: '12:00', duration: 150, classes: [
                { batch: 'A', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Swarna Maam'},
                { batch: 'B', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Arif Sir'},
                { batch: 'C', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Masum Sir'},
                { batch: 'D', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Ibrahim Sir'},
                { batch: 'E', subject: 'Anatomy Tutorial', venue: 'Tutorial Room', type: 'Tutorial' , teacher: 'Dr. Hasib Sir'}
            ]}
        ],
        Friday: []
    };

    function init() {
        const saved = localStorage.getItem('rollNumber');
        if (saved) {
            document.getElementById('rollInput').value = saved;
            handleRollChange(saved);
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        selectedDay = today;

        createDaySelector();
        updateSchedule();
    }

    function createDaySelector() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const container = document.getElementById('daySelector');
        container.innerHTML = days.map(day => {
            const isOff = day === 'Friday';
            const active = day === selectedDay ? 'active' : '';
            const offClass = isOff ? 'off' : '';
            return `<button class="day-btn ${active} ${offClass}" onclick="selectDay('${day}')">${day.slice(0,3)}</button>`;
        }).join('');
    }

    function selectDay(day) {
        selectedDay = day;
        createDaySelector();
        updateSchedule();
    }

    document.getElementById('rollInput').addEventListener('input', (e) => {
        handleRollChange(e.target.value);
    });

    function handleRollChange(value) {
        rollNumber = value;
        const rollNum = parseInt(value);

        if (isNaN(rollNum) || rollNum < 1 || rollNum > 105) {
            document.getElementById('infoBox').style.display = 'none';
            batch = '';
            updateSchedule();
            return;
        }

        for (const [letter, range] of Object.entries(batchRanges)) {
            if (rollNum >= range.start && rollNum <= range.end) {
                batch = letter;
                break;
            }
        }


        if (batch) {
            document.getElementById('batchBadge').textContent = batch;
            
            document.getElementById('infoBox').style.display = 'block';
            localStorage.setItem('rollNumber', value);
            updateSchedule();
        }
    }

    function updateSchedule() {
        const container = document.getElementById('classList');
        
        if (!batch) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    </svg>
                    <div class="empty-state-text">Enter your roll number to see your schedule</div>
                </div>
            `;
            return;
        }

        if (selectedDay === 'Friday') {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                    <div class="empty-state-text">Friday is off - No classes today!</div>
                </div>
            `;
            return;
        }

        const daySchedule = schedule[selectedDay] || [];
        let html = '';

        daySchedule.forEach(slot => {
            slot.classes.forEach(cls => {
                if (cls.batch === 'ALL' || cls.batch === batch ) {
                    html += `
                        <div class="class-item">
                            <div class="class-header">
                                <span class="class-time">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                    </svg>
                                    ${formatTime(slot.time)}
                                </span>
                                <span class="type-badge type-${cls.type.toLowerCase()}">${cls.type}</span>
                            </div>
                            <div class="class-subject">${cls.subject}</div>
                            <div class="class-details">
                            <span class="class-detail-item">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    ${cls.teacher}
                                </span>       <span class="class-detail-item">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    ${cls.venue}
                                </span>
                                <span class="class-detail-item">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                    </svg>
                                    ${slot.duration} min
                                </span>
                            </div>
                        </div>
                    `;
                }
            });
        });

        container.innerHTML = html || `
            <div class="empty-state">
                <svg viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                </svg>
                <div class="empty-state-text">No classes scheduled for ${selectedDay}</div>
            </div>
        `;
    }

    function formatTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    function toggleNotifications() {
        if (!batch) {
            alert('Please enter your roll number first!');
            return;
        }

        notificationsEnabled = !notificationsEnabled;
        const btn = document.getElementById('notifyBtn');
        const btnText = document.getElementById('notifyBtnText');
        
        if (notificationsEnabled) {
            btnText.textContent = 'Notifications Enabled';
            btn.classList.add('enabled');
            
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Class Reminders Active', {
                            body: 'You will receive notifications before your classes',
                            icon: './img/logo.png'
                        });
                    }
                });
            }
        } else {
            btnText.textContent = 'Enable Notifications';
            btn.classList.remove('enabled');
        }
    }

    init();
