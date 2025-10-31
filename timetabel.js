document.addEventListener('DOMContentLoaded', () => {

    // --- QR SCANNER LOGIC ---

    const scanButton = document.getElementById('scan-qr-btn');
    const qrModal = document.getElementById('qr-scanner-modal');
    const closeModalButton = document.getElementById('close-scanner-btn');
    
    // This variable will hold our scanner instance
    let scanner; 

    // What to do when a QR code is successfully scanned
    const onScanSuccess = (decodedText, decodedResult) => {
        console.log(`QR Code Scanned: ${decodedText}`);
        
        // Stop the camera
        scanner.stop().then(() => {
            // Hide the modal
            qrModal.style.display = 'none';
            // Show a success message
            alert(`Attendance code scanned: ${decodedText}`);
            
             sendAttendanceCodeToBackend(decodedText);
            
        }).catch(err => {
            console.error("Error stopping the scanner", err);
        });
    };

    // Optional: what to do if scanning fails
    const onScanFailure = (error) => {
        // You can ignore this or log it for debugging
        // console.warn(`QR scan error: ${error}`);
    };

    // --- EVENT LISTENERS ---

    // 1. When you click the "Scan" button
    scanButton.addEventListener('click', () => {
        qrModal.style.display = 'flex'; // Show the modal
        
        // Create a new scanner instance
        scanner = new Html5Qrcode("qr-reader");
        
        // Start the scanner
        scanner.start(
            { facingMode: "environment" }, // Use the back camera
            {
                fps: 10, // Frames per second
                qrbox: { width: 250, height: 250 } // Size of the scanning box
            },
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error("Unable to start scanning.", err);
            alert("Error: Could not start camera. Please grant permission.");
        });
    });

    // 2. When you click the "Cancel" button
    closeModalButton.addEventListener('click', () => {
        if (scanner) {
            scanner.stop().then(() => {
                console.log("Scanner stopped.");
            }).catch(err => {
                console.error("Error stopping the scanner", err);
            });
        }
        qrModal.style.display = 'none'; // Hide the modal
    });

    // --- END OF QR SCANNER LOGIC ---

    // The rest of your existing timetabel.js code can go here...
    // For example, the renderDailyTimetable() function and its related code.

});
// --- 1. TIMETABLE DATA MODEL (Multiple Divisions) ---
const timetableData = {
    // Note: 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    A: {
        1: { // MONDAY
            day: "Monday",
            schedule: [
                { time: "9:00 - 10:00", subject: "M-I" },
                { time: "10:00 - 11:00", subject: "BEE" },
                { time: "11:00 - 11:15", subject: "LUNCH", isBreak: true },
                { time: "11:15 - 1:15", subject: "A1-M-I / A2-BEE / A3-PHY" },
                { time: "01:15 - 02:00", subject: "LUNCH", isBreak: true },
                { time: "02:00 - 04:00", subject: "A1-M-I / A2-FPL / A3-PCS" },
            ]
        },
        2: { // TUESDAY
            day: "Tuesday",
            schedule: [
                { time: "9:00 - 10:00", subject: "FPL" },
                { time: "10:00 - 11:00", subject: "EM" },
                { time: "11:00 - 11:15", subject: "LUNCH", isBreak: true },
                { time: "11:15 - 12:15", subject: "PHY" },
                { time: "12:15 - 01:15", subject: "M-I" },
                { time: "01:15 - 02:00", subject: "Long Break", isBreak: true },
                { time: "02:00 - 03:00", subject: "DTIL" },
                { time: "03:00 - 04:00", subject: "BEE" },
            ]
        },
        3: { // WEDNESDAY
            day: "Wednesday",
            schedule: [
                { time: "09:00 - 10:00", subject: "EM" },
                { time: "10:00 - 11:00", subject: "PHY" },
                { time: "11:00 - 11:15", subject: "LUNCH", isBreak: true },
                { time: "11:15 - 01:15", subject: "A1-PCS / A2-M-I / A3-FPL" },
                { time: "01:15 - 02:00", subject: "Long Break", isBreak: true },
                { time: "02:00 - 03:00", subject: "M-I" },
                { time: "03:00 - 04:00", subject: "EM" }, 
            ]
        },
        4: { // THURSDAY
            day: "Thursday",
            schedule: [
                { time: "09:00 - 11:00", subject: "A1-BEE / A2-PHY / A3-EM" },
                { time: "11:00 - 11:15", subject: "LUNCH", isBreak: true },
                { time: "11:15 - 01:15", subject: "A1-PHY / A2-EM / A3-BEE" },
                { time: "01:15 - 02:00", subject: "Short Break", isBreak: true },
                { time: "02:00 - 03:00", subject: "DTIL" },
                { time: "03:00 - 04:00", subject: "Extra" },
            ]
        },
        5: { // FRIDAY
            day: "Friday",
            schedule: [
                { time: "9:00 - 10:00", subject: "BEE" },
                { time: "10:00 - 11:00", subject: "PHY" },
                { time: "11:00 - 11:15", subject: "Short Break", isBreak: true },
                { time: "11:15 - 01:15", subject: "A1-FPL / A2-PCS / A3-M-I" },
                { time: "01:30 - 02:00", subject: "LUNCH", isBreak: true },
                { time: "02:00 - 03:00", subject: "FPL" },
                { time: "03:00 - 04:00", subject: "TG" },
            ]
        },
        6: { // SATURDAY
            day: "Saturday",
            schedule: [
                { time: "09:00 - 04:00", subject: "CCC-I" },
            ]
        },
        0: { // SUNDAY (Correct key)
            day: "Sunday",
            schedule: [
                { time: "All Day", subject: "Weekend Holiday!" }
            ]
        }
    },
    
    // --- Division B Schedule ---
    B: {
        1: { // MONDAY
            day: "Monday",
            schedule: [
                { time: "9:00 - 10:00", subject: "EM" },
                { time: "10:00 - 11:00", subject: "FPL" },
                { time: "11:00 - 11:15", subject: "Morning Break", isBreak: true },
                { time: "11:15 - 12:15", subject: "PHY" },
                { time: "12:15 - 01:15", subject: "M-I" },
                { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
                { time: "02:00 - 04:00", subject: "A1-EM/A2-BEE/A3-PHY" },
            ]
        },
        2: { // TUESDAY
            day: "Tuesday",
            schedule: [
                { time: "9:00 - 11:00", subject: "A1-BEE/A2-PHY/A3-EM" },
                { time: "11:00 - 11:15", subject: "Break", isBreak: true },
                { time: "11:15 - 12:15", subject: "M-I" },
                { time: "12:15 - 01:15", subject: "PHY" },
                { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
                { time: "02:00 - 04:00", subject: "A1-M-I/A2-PCS/A3-FPL" },
            ]
        },
        3: 
        { day: "Wednesday", schedule: 
          [
            { time: "9:00 - 11:00", subject: "B1-FPL/B2-Lib/B3-PHY" },
            { time: "11:00 - 11:15", subject: "Break", isBreak: true },
            { time: "11:15 - 12:15", subject: "PHY" },
            { time: "12:15 - 01:15", subject: "BEE"},
            { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
            { time: "02:00 - 03:00", subject: "EM"}, // Corrected missing comma
            { time: "03:00 - 04:00", subject: "M-I"},
          ] 
        },
        4: 
        { day: "Thursday", schedule: 
          [
            { time: "9:00 - 10:00", subject: "FPL" },
            { time: "10:00 - 11:00", subject: "M-I" },
            { time: "11:00 - 11:15", subject: "Break", isBreak: true },
            { time: "11:15 - 01:15", subject: "B1-PCS/B2-FPL/B3-M-I" },
            { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
            { time: "02:00 - 4:00", subject:"BEE"}, 
          ]
        },
        5:
          { day: "Friday", 
           schedule:
             [
            { time: "9:00 - 10:00", subject: "EM" },
            { time: "10:00 - 11:00", subject: "BEE" },
            { time: "11:00 - 11:15", subject: "Break", isBreak: true },
            { time: "11:15 - 01:15", subject: "B1-PHY/B2-EM/B3-BEE" },
            { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
            { time: "02:00 - 4:00", subject:"DTIL"},
             ]
          },
        6:
        { day: "Saturday", schedule:
            [
              { time: "All Day", subject: "CCC-I" }
            ]
          },
        0: 
        { day: "Sunday", schedule: [{ time: "All Day", subject: "Weekend Holiday!" }] }
    },

    // --- Division C Schedule ---
    C: {
        1: { // MONDAY
            day: "Monday",
            schedule: [
                { time: "9:00 - 10:00", subject: "PHY" },
                { time: "10:00 - 11:00", subject: "M-I" },
                { time: "11:00 - 11:15", subject: "Break", isBreak: true },
                { time: "11:15 - 01:15", subject: "C1-Lib/C2-FPL/C3-PCS" },
                { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
                { time: "02:00 - 03:00", subject: "DTIL" },
                { time: "03:00 - 04:00", subject: "BEE" },
            ]
        },
        2:
          { day:
            "Tuesday", 
           schedule:
            [
              { time: "9:00 - 11:00", subject: "C1-FPL/C2-PCS/C3-Lib" },
              { time: "11:00 - 11:15", subject: "Break", isBreak: true },
              { time: "11:15 - 12:15", subject: "PHY" },
              { time: "12:15 - 01:15", subject: "BEE" },
              { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
              { time: "02:15 - 04:00", subject: "C1-BEE/C2-PHY/C3-EM" },
            ] 
          },
        3:
          { day:
            "Wednesday",
           schedule:
             [
               { time: "9:00 - 11:00", subject: "C1-PHY/C2-EM/C3-BEE" },
               { time: "11:00 - 11:15", subject: "Break", isBreak: true },
               { time: "11:15 - 12:15", subject: "EM" },
               { time: "12:15 - 01:15", subject: "FPL" },
               { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
               { time: "2:00 - 4:00", subject: "C1-PCS/C2-M-I/C3-FPL"},              
             ]
          },
        4: {
          day:
            "Thursday", schedule:
            [
              { time: "9:00 - 10:00", subject: "M-I" },
              { time: "10:00 - 11:00", subject: "BEE" },
              { time: "11:00 - 11:15", subject: "Break", isBreak: true },
              { time: "11:15 - 01:15", subject: "C1-EM/C2-BEE/C3-PHY" },
              { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
              { time: "02:00 - 3:00", subject: "FPL" },
              { time: "3:00 - 4:00", subject: "EM"},              
            ]
        },
        5: { day:
          "Friday",
            schedule:
              [
                { time: "9:00 - 10:00", subject: "PHY" },
                { time: "10:00 - 11:00", subject: "EM" }, // Fixed duplicate 9:00 time slot
                { time: "11:00 - 11:15", subject: "Break", isBreak: true },
                { time: "11:15 - 12:15", subject: "M-I" },
                { time: "12:15 - 01:15", subject: "DTIL" },
                { time: "01:15 - 02:00", subject: "Lunch", isBreak: true },
                { time: "02:00 - 3:00", subject: "TG/EXTRA" },
              ]
           },
        6: { day: "Saturday", schedule: [{ time: "All Day", subject: "CCC-I" }] },
        0: { day: "Sunday", schedule: [{ time: "All Day", subject: "Weekend Holiday" }] } // Correct key
    }
};

// --- 2. DYNAMIC RENDERING FUNCTION ---
function renderDailyTimetable() {
    // 1. Get the selected division from the dropdown
    const divisionSelector = document.getElementById('divisionSelector');
    // Default to 'A' if selector isn't found, otherwise use the selected value
    const selectedDivision = divisionSelector ? divisionSelector.value : 'A';

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // 2. Correctly access the nested data: Division -> DayOfWeek
    const dailyData = timetableData[selectedDivision]?.[dayOfWeek];
    
    const heading = document.getElementById('todayScheduleDay');
    const container = document.getElementById('scheduleContainer');
    
    // Handle missing elements or data
    if (!heading || !container) {
        console.error("Timetable HTML elements not found.");
        return;
    }

    if (!dailyData) {
        heading.innerText = `Timetable for Division ${selectedDivision}`;
        container.innerHTML = '<div class="slot" style="color:var(--muted)">No schedule data available for this day.</div>';
        return;
    }

    // 3. Update the heading text with the correct day and division
    heading.innerText = `${dailyData.day}'s Class Timings (Division ${selectedDivision})`;
    
    // Clear any existing content
    container.innerHTML = '';

    // Generate the HTML for each class slot
    dailyData.schedule.forEach(slot => {
        const breakStyle = slot.isBreak ? 'style="background:var(--glass); color:var(--muted);"' : '';
        
        const slotHTML = `
            <div class="slot" ${breakStyle}>
                <div class="time">${slot.time}</div>
                <div class="sub">${slot.subject}</div>
            </div>
        `;
        container.innerHTML += slotHTML;
    });
}



// --- Remaining dashboard JS starts here (Modified Initialization) ---

// 3. INITIALIZATION AND EVENT LISTENER
document.addEventListener('DOMContentLoaded', () => {
    // Set the current year
    document.getElementById('year').innerText = new Date().getFullYear();
    
    // Call the function on load to display the default timetable
    renderDailyTimetable(); 
    
    // Add an event listener to the selector to re-render when the division changes
    const divisionSelector = document.getElementById('divisionSelector');
    if (divisionSelector) {
        divisionSelector.addEventListener('change', renderDailyTimetable);
    }

    // mobile sidebar toggle
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    let mobileOpen = false;
    hamburger?.addEventListener('click', ()=>{
      mobileOpen = !mobileOpen;
      if(window.innerWidth <= 880){
        sidebar.classList.toggle('mobile-open', mobileOpen);
        // add backdrop
        if(mobileOpen){
          const back = document.createElement('div');
          back.id = 'mobile-backdrop';
          back.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:90';
          back.addEventListener('click', ()=>{ mobileOpen=false; sidebar.classList.remove('mobile-open'); back.remove();});
          document.body.appendChild(back);
        } else {
          const existing = document.getElementById('mobile-backdrop'); if(existing) existing.remove();
        }
      }
    });

    // profile dropdown
    const avatarBtn = document.getElementById('avatarBtn');
    const profileMenu = document.getElementById('profileMenu');
    avatarBtn?.addEventListener('click', (e)=>{
      profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    });
    window.addEventListener('click', (e)=>{
      if(!avatarBtn.contains(e.target) && !profileMenu.contains(e.target)){
        profileMenu.style.display = 'none';
      }
    });

    // theme toggle
    const themeBtn = document.getElementById('themeToggle');
    themeBtn?.addEventListener('click', ()=>{
      document.body.classList.toggle('light-theme');
    });

    // nav items selection (client-side)
    document.querySelectorAll('.nav-item').forEach(item=>{
      item.addEventListener('click', ()=>{
        document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
        item.classList.add('active');
        // optionally you can load different sections here
      });
    });

    // small: clicking icons can show simple toasts (example)
    document.getElementById('notifBtn').addEventListener('click', ()=> alert('No new notifications'));
    document.getElementById('calendarBtn').addEventListener('click', ()=> alert('Open calendar (placeholder)'));
});
// --- 2. DYNAMIC RENDERING FUNCTION ---

// =======================================================
// === END OF DYNAMIC TIMETABLE CODE ===
// =======================================================
    document.getElementById('year').innerText = new Date().getFullYear();

    // mobile sidebar toggle
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    let mobileOpen = false;
    hamburger?.addEventListener('click', ()=>{
      mobileOpen = !mobileOpen;
      if(window.innerWidth <= 880){
        sidebar.classList.toggle('mobile-open', mobileOpen);
        // add backdrop
        if(mobileOpen){
          const back = document.createElement('div');
          back.id = 'mobile-backdrop';
          back.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:90';
          back.addEventListener('click', ()=>{ mobileOpen=false; sidebar.classList.remove('mobile-open'); back.remove();});
          document.body.appendChild(back);
        } else {
          const existing = document.getElementById('mobile-backdrop'); if(existing) existing.remove();
        }
      }
    });

    // profile dropdown
    const avatarBtn = document.getElementById('avatarBtn');
    const profileMenu = document.getElementById('profileMenu');
    avatarBtn?.addEventListener('click', (e)=>{
      profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
    });
    window.addEventListener('click', (e)=>{
      if(!avatarBtn.contains(e.target) && !profileMenu.contains(e.target)){
        profileMenu.style.display = 'none';
      }
    });

    // theme toggle
    const themeBtn = document.getElementById('themeToggle');
    themeBtn?.addEventListener('click', ()=>{
      document.body.classList.toggle('light-theme');
    });

    // nav items selection (client-side)
    document.querySelectorAll('.nav-item').forEach(item=>{
      item.addEventListener('click', ()=>{
        document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
        item.classList.add('active');
      
      });
    });

    // small: clicking icons can show simple toasts (example)
    document.getElementById('notifBtn').addEventListener('click', ()=> alert('No new notifications'));
    document.getElementById('calendarBtn').addEventListener('click', ()=> alert('Open calendar (placeholder)'));
