/* --- 1. DATA CENTER (Global Scope) --- */
const postsData = [
    {
        id: 1,
        title: "Notice from Progoti House",
        author: " Bayazid Hasan",
        date: "Feb 25, 2026",
        category: "Announcement",
        image: "img/IMG_20260226_005307.webp",
        short: "As-Salāmu ‘Alaikum, tomorrow we will arrange a meeting at 7:00 pm, insha'Allah.",
        content: "As-Salāmu ‘Alaikum, tomorrow we will arrange a meeting at 7:00 pm, insha'Allah. All the members are requested to join the meeting at time. It's urgent to discuss about everything. Hope all the members participate spontaneously. Thank you all in advanced. We will enjoy the journey together, insha-allah. Location : helipad road er age footpath"
    },
    {
        id: 2,
        title: "Official House Jerseys Revealed",
        author: "Tanvir Ahmad Rakib",
        date: "Feb 20, 2026",
        category: "Sports",
        image: "img/various-sport-equipment-gear.webp",
        short: "The new jerseys for Balaka, Progoti, Atlas, and Oikantik have been revealed today.",
        content: "The committee has unveiled the official kits for this year. Balaka will be donning the Royal Blue, Progoti in Emerald Green, Digonto in Fiery Red, and Dishari in Mystic Purple. The jerseys feature breathable fabric suitable for the intense April heat. Captains are requested to collect the team kits from the gym on ****."
    },
    {
        id: 3,
        title: "Spiritual Harmony: Quran, Hamd & Naat Competition",
        author: "مْ كِ أ سُمْرَتْ",
        date: "Feb 15, 2026",
        category: "Highlights",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
        short: "Faculty members confirm their participation in the friendly Cricket match on Day 2.",
        content: "Registration is now open for Tilawat, Hamd, and Naat competitions. Elevate your soul this Cultural Week. ``Verily, in the remembrance of Allah do hearts find rest.`` (13:28). We are honored to announce the addition of the Islamic Cultural Segment to KYAMC Cultural Week 2026. This is a unique opportunity for students from Batches KYA18 through KYA21 to showcase their beautiful voices and spiritual devotion. Categories for Participation: Tilawat-e-Quran: Recitation with Tajweed (Surah selection will be announced 1 day prior). Hamd-e-Bari Ta'ala: Solo performance praising the Almighty. Naat-e-Rasool (SAW): Solo performance expressing love for the Prophet. Event Details: Venue: College Auditorium. Time: Day 01, Post-Asr (Tentative). Judges: Distinguished guests and senior faculty members. Interested participants are requested to submit their names to the Cultural Secretary or their respective House Captains (Balaka, Progoti, Atlas, Oikantik) by February 28th. Let us begin our week of festivities with the blessings of the Almighty"
    },
    {
        id: 4,
        title: "Living With Taqwa: With Allah in the Heart, Mercy in the Manners",
        author: "Dr. Muhammad Erag Goshih",
        date: "Feb 10, 2026",
        category: "Reflection",
        image: "img/IMG_20260226_025412.webp",
        short: "“Ima'an (Faith) is both light and power. Yes, one who has acquired true Ima'an (Faith) can challenge the entire universe and by the strength of his Ima'an (Faith) he/she can survive the stress of various events.”",
        content: "This(attached) hadith brings our whole way of living into three simple commitments.Let us have taqwa of Allah wherever we are, not only in public worship, but in private choices, hidden thoughts, and quiet moments when no one is watching.It also keeps us realistic.We will slip.We will make mistakes.But we do not stay stuck in them.We follow a bad deed with a good one, quickly and sincerely, trusting that Allah allows good to erase what was wrong. Then it turns outward and makes the test practical: let us deal with people with beautiful character.Faith is not complete in isolation.It shows up in our tone, patience, and restraint.When this settles in us, we stop treating religion as only personal rituals and start living it as a steady way of being, with Allah in our hearts and mercy in our manners."
    },
    {
        id: 5,
        title: "Crying: A Natural Reset for Mind and Body",
        author: "Rasmiyah Jahan Eva",
        date: "Feb 26, 2026",
        category: "Medical Science",
        image: "img/IMG_20260226_030545_902.webp",
        short: "Crying isn’t weakness — it’s a natural and healthy release of emotional stress and tension. Tears help the body reset, cleanse the eyes, relieve pressure, and promote both mental and physical balance.",
        content: "WHY is it healthy to cry? The truth is, crying is not only possible, but necessary. And there are plenty of various reasons for that: ✅  Most people feel a little better and happier after crying. All accumulated emotions and tension are released. ✅ Tears cleanse the body of harmful substances from stress. No coincidence, all these fluids have been created to get all the bad stuff out of us. Tears are part of the system. A vital and necessary part. Cleaning the nose. Especially relevant when mucus has accumulated in the nose and is making it hard to breathe. No need for medicine when there are tears.  ✅  Interestingly, tears can even lower your blood pressure.  ✅  Cleaning the eyes themselves from bacteria and dust."
    }
];

/* --- 2. PRELOADER LOGIC (The Fix) --- */
function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Attempt 1: Remove when page is fully loaded
window.addEventListener('load', removePreloader);

// Attempt 2: FORCE REMOVE after 3 seconds (The Failsafe)
setTimeout(removePreloader, 3000);


/* --- 3. MAIN LOGIC --- */
document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if(hamburger){
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // Countdown Timer (Only runs if element exists)
    if(document.getElementById("days")) {
        const eventDate = new Date("April 10, 2026 09:00:00").getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const gap = eventDate - now;

            if (gap < 0) {
                clearInterval(timer);
                return;
            }
            
            // Safe update check
            if(document.getElementById("days")) document.getElementById("days").innerText = Math.floor(gap / (1000 * 60 * 60 * 24));
            if(document.getElementById("hours")) document.getElementById("hours").innerText = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if(document.getElementById("minutes")) document.getElementById("minutes").innerText = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
            if(document.getElementById("seconds")) document.getElementById("seconds").innerText = Math.floor((gap % (1000 * 60)) / 1000);
        }, 1000);
    }

    // Scroll Progress Bar
    window.addEventListener("scroll", () => {
        const progressBar = document.getElementById("myBar");
        if(progressBar) {
            let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            let scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }
        handleScrollAnimation();
    });

    // Tab Logic (Attached to window so HTML can see it)
    window.openTab = function(evt, tabName) {
        const tabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = "none";
            tabContents[i].classList.remove("active-tab");
        }
        const tabBtns = document.getElementsByClassName("tab-btn");
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].className = tabBtns[i].className.replace(" active", "");
        }
        const target = document.getElementById(tabName);
        if(target) {
            target.style.display = "block";
            evt.currentTarget.className += " active";
            setTimeout(() => target.classList.add("active-tab"), 10);
        }
    };

    /* --- 4. POSTS PAGE LOGIC --- */
    const postsContainer = document.getElementById("postsContainer");
    
    if (postsContainer) {
        renderPosts(postsData);
        
        // Search Filter
        const searchInput = document.getElementById('searchInput');
        if(searchInput){
            searchInput.addEventListener('keyup', () => {
                const input = searchInput.value.toLowerCase();
                const filtered = postsData.filter(post => 
                    post.title.toLowerCase().includes(input) || 
                    post.content.toLowerCase().includes(input) ||
                    post.category.toLowerCase().includes(input)
                );
                renderPosts(filtered);
            });
        }

        // Check URL for ID (e.g. posts.html?id=1)
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        if(postId) {
            openModal(postId);
        }
    }
});

// Helper: Render Posts
function renderPosts(data) {
    const container = document.getElementById("postsContainer");
    const noResults = document.getElementById("noResults");
    
    if(!container) return;
    
    container.innerHTML = "";
    
    if(data.length === 0) {
        if(noResults) noResults.style.display = "block";
    } else {
        if(noResults) noResults.style.display = "none";
        data.forEach(post => {
            const postHTML = `
                <div class="post-card scroll-element scrolled">
                    <div class="post-img" style="background-image: url('${post.image}');"></div>
                    <div class="post-content">
                       <span class="date">${post.author} || </span>   <span class="date">${post.date}</span>
                        <h4>${post.title}</h4>
                        <p>${post.short}</p>
                        <button  onclick="openModal(${post.id})" class="read-more-btn">Read more <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            `;
            container.innerHTML += postHTML;
        });
    }
}

// Helper: Modal Logic
function openModal(id) {
    const modal = document.getElementById("postModal");
    const post = postsData.find(p => p.id == id);
    
    if(!post || !modal) return;

    if(document.getElementById("modalImg")) document.getElementById("modalImg").src = post.image;
    if(document.getElementById("modalTitle")) document.getElementById("modalTitle").innerText = post.title;
    if(document.getElementById("modalDate")) document.getElementById("modalDate").innerText = post.date;
    if(document.getElementById("modalCategory")) document.getElementById("modalCategory").innerText = post.category;
    if(document.getElementById("modalContent")) document.getElementById("modalContent").innerText = post.content;

    modal.style.display = "block";

    // Close logic
    const closeBtn = document.querySelector(".close-modal");
    if(closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            history.pushState(null, null, 'posts.html'); // Clean URL
        }
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            history.pushState(null, null, 'posts.html');
        }
    }
}

// Helper: Scroll Animation
function handleScrollAnimation() {
    const scrollElements = document.querySelectorAll(".scroll-element");
    scrollElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop <= (window.innerHeight * 1.25)) {
            el.classList.add("scrolled");
        }
    });
}

// --- ADD THIS TO YOUR EXISTING SCRIPT.JS ---

/* --- 5. GALLERY LOGIC --- */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-card');

if (filterBtns.length > 0) {
    // Filter Functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.add('hide');
                    item.classList.remove('show');
                }
            });
        });
    });
    
    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const isVideo = item.getAttribute('data-video');
            
            lightbox.style.display = 'flex';
            
            if (isVideo) {
                // For demo, we just show the image. In real life, show Youtube Iframe
                lightboxImg.src = img.src;
                alert("Video Player would open here. (Demo Mode)");
            } else {
                lightboxImg.src = img.src;
            }
        });
    });
    
    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
}


/* --- ADD TO YOUR SCRIPT.JS --- */

/* 1. PREDICTIVE ANALYTICS (POLL LOGIC) */
const houses = [
    { id: 'balaka', name: 'Balaka', color: '#3b82f6', votes: 45 },
    { id: 'progoti', name: 'Progoti', color: '#22c55e', votes: 38 },
    { id: 'dishari', name: 'Dishari', color: '#ef4444', votes: 62 },
    { id: 'diganto', name: 'Diganto', color: '#a855f7', votes: 51 }
];

const pollOptions = document.getElementById('poll-options');
const pollResults = document.getElementById('poll-results');

if (pollOptions) {
    // Check if already voted
    const hasVoted = localStorage.getItem('hasVoted');
    
    if (hasVoted) {
        showResults();
    } else {
        renderOptions();
    }
}

function renderOptions() {
    pollOptions.innerHTML = "";
    houses.forEach(house => {
        pollOptions.innerHTML += `
            <div class="poll-option" onclick="vote('${house.id}')">
                <span>${house.name}</span>
                <i class="fa-solid fa-circle-check" style="color: #555;"></i>
            </div>
        `;
    });
}

function vote(houseId) {
    // Save to local storage
    localStorage.setItem('hasVoted', 'true');
    localStorage.setItem('votedHouse', houseId);
    
    // Simulate backend update
    const house = houses.find(h => h.id === houseId);
    house.votes++;
    
    showToast("Vote Recorded", `You predicted ${house.name} to win!`);
    showResults();
}

function showResults() {
    pollOptions.style.display = 'none';
    pollResults.style.display = 'block';
    
    // Calculate total
    const totalVotes = houses.reduce((acc, curr) => acc + curr.votes, 0);
    
    pollResults.innerHTML = "";
    houses.sort((a, b) => b.votes - a.votes).forEach(house => {
        const percent = Math.round((house.votes / totalVotes) * 100);
        
        pollResults.innerHTML += `
            <div class="poll-bar-container">
                <div class="poll-label">
                    <span>${house.name}</span>
                    <span>${percent}% (${house.votes})</span>
                </div>
                <div class="poll-track">
                    <div class="poll-fill" style="width: ${percent}%; background: ${house.color};"></div>
                </div>
            </div>
        `;
    });
}

/* 2. HOSPITAL PAGING (TOAST NOTIFICATIONS) */
function showToast(title, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    
    toast.innerHTML = `
        <i class="fa-solid fa-tower-broadcast"></i>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Trigger a welcome toast on load
window.addEventListener('load', () => {
    setTimeout(() => {
        showToast("Access is granted!", "Welcome to KYAMC Cultural Week 2026 Portal. Curiosity → Questions → Learning → Understanding → Growth ");
    }, 4000); // Shows after preloader
});

/* 3. REGISTRATION MODAL LOGIC */
const regModal = document.getElementById('regModal');

function openRegModal() {
    regModal.style.display = 'block';
}

function closeRegModal() {
    regModal.style.display = 'none';
}

function handleRegistration(e) {
    e.preventDefault();
    // In a real app, send data to backend here.
    
    closeRegModal();
    
    // Simulate Success
    showToast("Registration Successful", "Your data has been logged in the Cultural Database.");
    
    // Clear form
    document.getElementById('regForm').reset();
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target == regModal) {
        regModal.style.display = "none";
    }
}


/* --- ADD TO YOUR SCRIPT.JS --- */

/* 1. DNA SCROLL TO TOP LOGIC */
window.addEventListener('scroll', () => {
    const dnaBtn = document.getElementById('dna-top-btn');
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        dnaBtn.classList.add('show-dna');
    } else {
        dnaBtn.classList.remove('show-dna');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* 2. CONFETTI CELEBRATION LOGIC (Pure JS) */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
const confettiColors = ['#00f2ff', '#ef4444', '#3b82f6', '#a855f7', '#ffffff'];

function createConfettiPiece() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 5 + 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1
    };
}

function startConfetti() {
    confetti = [];
    for (let i = 0; i < 100; i++) {
        confetti.push(createConfettiPiece());
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;
    
    confetti.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        
        if (p.y < canvas.height) {
            activeParticles++;
        }
    });
    
    if (activeParticles > 0) {
        requestAnimationFrame(animateConfetti);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/* 3. INTEGRATE CONFETTI WITH EXISTING FUNCTIONS */

// Update your existing vote() function from the previous step
// Find function vote(houseId) and ADD 'startConfetti()' inside it.
/*
function vote(houseId) {
    // ... existing code ...
    showToast("Vote Recorded", ...);
    showResults();
    startConfetti(); // <--- ADD THIS LINE
}
*/

// Update your existing handleRegistration() function
/*
function handleRegistration(e) {
    e.preventDefault();
    closeRegModal();
    showToast("Registration Successful", ...);
    startConfetti(); // <--- ADD THIS LINE
    document.getElementById('regForm').reset();
}
*/

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

/* --- ADD TO YOUR SCRIPT.JS --- */

/* 1. IDENTITY MATRIX LOGIC */
function updateCard() {
    const nameInput = document.getElementById('idName').value;
    const batchInput = document.getElementById('idBatch').value;
    const houseInput = document.getElementById('idHouse').value;
    
    // Update Text
    document.getElementById('cardName').innerText = nameInput ? nameInput : "Student Name";
    document.getElementById('cardBatch').innerText = "BATCH: " + batchInput;
    
    // Update House Badge Color/Text
    const badge = document.getElementById('cardHouse');
    badge.innerText = houseInput.toUpperCase();
    
    // Remove old classes
    badge.classList.remove('balaka-bg', 'progoti-bg', 'atlas-bg', 'oikantik-bg');
    
    // Add new class
    badge.classList.add(houseInput + '-bg');
}

/* 2. BIO-SCAN DIAGNOSIS LOGIC */
function runBioScan() {
    const resultDisplay = document.getElementById('scan-result');
    const btn = document.querySelector('.scan-btn');
    
    // 1. Scanning State
    resultDisplay.style.color = "#00f2ff";
    resultDisplay.innerText = "SCANNING YOUR BODY...";
    btn.classList.add('fa-spin'); // FontAwesome spin animation
    
    // 2. Result State (After 2 seconds)
    setTimeout(() => {
        btn.classList.remove('fa-spin');
        
        const diagnoses = [
            "Diagnosis: Severe Case of Cricket Fever!",
            "Diagnosis: 100% Cultural Energy Detected.",
            "Diagnosis: Infected with 'Progo House' Loyalty.",
            "Diagnosis: Needs Urgent Dose of Qur'an Recitation.",
            "Diagnosis: Vitals Stable. Ready to Win.",
            "Diagnosis: High Adrenaline Levels."
        ];
        
        const randomDiag = diagnoses[Math.floor(Math.random() * diagnoses.length)];
        
        resultDisplay.style.color = "#22c55e"; // Green for success
        resultDisplay.innerText = randomDiag;
        
        // Trigger Toast (from previous step feature)
        if (typeof showToast === "function") {
            showToast("Scan Complete", randomDiag);
        }
        
    }, 2000);
}

/* --- ADD TO YOUR SCRIPT.JS --- */

/* 1. PRAYER SYNC LOGIC (SIRAJGANJ TIME) */
function updateClockAndPrayer() {
    const now = new Date();
    
    // Update Digital Clock
    const timeString = now.toLocaleTimeString('en-US', { hour12: true });
    const clockDisplay = document.getElementById('clock-display');
    if (clockDisplay) clockDisplay.innerText = timeString;
    
    // Standard Prayer Times for Sirajganj (Approximate for Feb/March)
    // In a real app, use an API (e.g., Aladhan API)
    const prayers = [
        { id: 'fajr', name: 'Fajr', time: '05:20' },
        { id: 'dhuhr', name: 'Dhuhr', time: '13:30' },
        { id: 'asr', name: 'Asr', time: '16:45' },
        { id: 'maghrib', name: 'Maghrib', time: '18:18' },
        { id: 'isha', name: 'Isha', time: '20:00' }
    ];
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let nextPrayerFound = false;
    
    prayers.forEach(p => {
        const el = document.getElementById(p.id);
        if (!el) return;
        
        // Convert prayer time to minutes
        const [h, m] = p.time.split(':');
        const pMinutes = parseInt(h) * 60 + parseInt(m);
        
        // Reset Styles
        el.classList.remove('active-prayer');
        
        // Logic to highlight next prayer
        if (!nextPrayerFound && pMinutes > currentMinutes) {
            el.classList.add('active-prayer');
            document.getElementById('next-prayer-msg').innerText = `Next: ${p.name} at ${tConvert(p.time)}`;
            nextPrayerFound = true;
        }
    });
    
    if (!nextPrayerFound) {
        // If all passed, next is Fajr tomorrow
        document.getElementById('fajr').classList.add('active-prayer');
        document.getElementById('next-prayer-msg').innerText = "Next: Fajr (Tomorrow)";
    }
}

// Helper to convert 24h to 12h
function tConvert(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
        time = time.slice(1);
        time[5] = +time[0] < 12 ? ' AM' : ' PM';
        time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
}

// Update every minute
setInterval(updateClockAndPrayer, 1000);
updateClockAndPrayer(); // Run on load


/* 2. VOICE OF CAMPUS (SHOUTBOX) */
function loadShouts() {
    const stream = document.getElementById('shout-stream');
    if (!stream) return;
    
    // Get from LocalStorage
    const shouts = JSON.parse(localStorage.getItem('kyamc_shouts')) || [];
    
    // Clear current except default
    stream.innerHTML = `<div class="shout-bubble"><strong>System:</strong> Be respectful! Positive Thinking + Positive Action = Successful LIFE! <span class="time">Now</span></div>`;
    
    // Add saved shouts (reverse order to show newest)
    shouts.reverse().forEach(s => {
        const div = document.createElement('div');
        div.classList.add('shout-bubble');
        div.innerHTML = `<strong>${s.name}:</strong> ${s.msg} <span class="time">${s.time}</span>`;
        stream.prepend(div);
    });
}

function postShout() {
    const nameInput = document.getElementById('shoutName');
    const msgInput = document.getElementById('shoutMsg');
    
    const name = nameInput.value.trim() || "Anonymous";
    const msg = msgInput.value.trim();
    
    if (msg === "") {
        alert("Please write a message!");
        return;
    }
    
    const newShout = {
        name: name,
        msg: msg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Save to LocalStorage
    let shouts = JSON.parse(localStorage.getItem('kyamc_shouts')) || [];
    shouts.push(newShout);
    
    // Keep only last 20 messages
    if (shouts.length > 20) shouts.shift();
    
    localStorage.setItem('kyamc_shouts', JSON.stringify(shouts));
    
    // Reload stream and clear input
    loadShouts();
    msgInput.value = "";
    
    // Celebration confetti from previous step
    if (typeof startConfetti === "function") startConfetti();
}

// Load shouts on page load
if (document.getElementById('shout-stream')) {
    loadShouts();
}


/* 3. RAPID RESPONSE TOGGLE */
function toggleRapidMenu() {
    document.getElementById('rapidOptions').classList.toggle('show');
    document.querySelector('.rapid-main-btn').classList.toggle('open');
}


/* --- DOWNLOAD ID CARD LOGIC --- */
function downloadIdCard() {
    const cardElement = document.getElementById('holoCard');
    
    // 1. Notify User
    if (typeof showToast === "function") {
        showToast("System Processing", "Generating High-Res Hologram...");
    } else {
        alert("Generating ID Card...");
    }
    
    // 2. Use html2canvas to render
    html2canvas(cardElement, {
        scale: 3, // High resolution (3x)
        backgroundColor: "#0f172a", // Force dark background so it looks good
        useCORS: true, // Allow loading external fonts/icons
        logging: false
    }).then(canvas => {
        // 3. Create a fake link to trigger download
        const link = document.createElement('a');
        link.download = 'KYAMC_CW26_Pass.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        // 4. Success Message
        if (typeof showToast === "function") {
            setTimeout(() => {
                showToast("Download Complete", "Access Pass saved to device.");
            }, 1000);
        }
    });
}