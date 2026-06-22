document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. HANDLE LOADING SCREEN ---
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    const app = document.getElementById('app-content');
    
    if (loader && app) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.classList.add('hidden');
        app.classList.remove('hidden');
      }, 500);
    }
  }, 1500);

  // --- 2. SEGMENT CONTROL TOGGLE ---
  const btnHome = document.getElementById('btn-home');
  const btnTasks = document.getElementById('btn-tasks');
  const viewHome = document.getElementById('view-home');
  const viewTasks = document.getElementById('view-tasks');

  if (btnTasks && btnHome) {
    btnTasks.addEventListener('click', () => {
      btnTasks.classList.add('active');
      btnHome.classList.remove('active');
      viewHome.classList.add('hidden');
      viewTasks.classList.remove('hidden');
    });

    btnHome.addEventListener('click', () => {
      btnHome.classList.add('active');
      btnTasks.classList.remove('active');
      viewTasks.classList.add('hidden');
      viewHome.classList.remove('hidden');
      
      // FIX: Force the graph to redraw 10 milliseconds AFTER the tab becomes visible
      setTimeout(() => {
        if (typeof drawLineGraph === 'function') {
          drawLineGraph();
        }
      }, 10);
    });
  }

  // --- 3. TASKS: HABITS MANAGER & LIVE SYNC ---
  const habitContainer = document.getElementById('habit-container');
  const habitInput = document.getElementById('new-habit-input');
  const btnAddHabit = document.getElementById('btn-add-habit');
  const btnViewMoreHabits = document.getElementById('btn-view-more-habits');

  let myHabits = JSON.parse(localStorage.getItem('gceya7_habits')) || [];

  // Midnight Reset Check
  const todayDateString = new Date().toDateString();
  const lastLoginDate = localStorage.getItem('gceya7_last_login');

  if (lastLoginDate !== todayDateString) {
    myHabits.forEach(habit => habit.completed = false);
    localStorage.setItem('gceya7_last_login', todayDateString);
    localStorage.setItem('gceya7_habits', JSON.stringify(myHabits));
  }

  // Live Dashboard Sync
  function syncDashboard() {
    const realHabitPercent = parseFloat(localStorage.getItem('gceya7_today_habit_percent')) || 0;
    const todayData = MomentumEngine.calculateTodayScore(realHabitPercent, 0, 0);

    const ringHabits = document.querySelector('.ring-habits');
    if (ringHabits) {
      ringHabits.style.strokeDashoffset = 188 - (Math.min(100, todayData.raw.habits) / 100) * 188;
    }

    const scoreText = document.getElementById('score-value');
    if (scoreText) scoreText.innerText = todayData.points;

    const svg = document.getElementById('line-graph-svg');
    if (svg && svg.clientWidth > 0) {
      drawLineGraph();
    }
  }

  function saveAndRenderHabits() {
    localStorage.setItem('gceya7_habits', JSON.stringify(myHabits));
    if (habitContainer) habitContainer.innerHTML = '';
    let completedCount = 0;

    myHabits.forEach(habit => {
      if (habit.completed) completedCount++;

      const habitDiv = document.createElement('div');
      habitDiv.className = `habit-item ${habit.completed ? 'completed' : ''}`;
      
      habitDiv.innerHTML = `
        <div class="custom-checkbox"></div>
        <span class="habit-text">${habit.text}</span>
        <button class="delete-habit-btn" data-id="${habit.id}">×</button>
      `;

      habitDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-habit-btn')) return; 
        habit.completed = !habit.completed;
        saveAndRenderHabits(); 
      });

      const deleteBtn = habitDiv.querySelector('.delete-habit-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          myHabits = myHabits.filter(h => h.id !== habit.id);
          saveAndRenderHabits();
        });
      }

      if (habitContainer) habitContainer.appendChild(habitDiv);
    });

    if (btnViewMoreHabits) {
      if (myHabits.length > 4) {
        btnViewMoreHabits.classList.remove('hidden');
      } else {
        btnViewMoreHabits.classList.add('hidden');
      }
    }

    const habitPercentage = myHabits.length === 0 ? 0 : (completedCount / myHabits.length) * 100;
    localStorage.setItem('gceya7_today_habit_percent', habitPercentage);
    
    syncDashboard();
  }

  if (btnAddHabit && habitInput) {
    btnAddHabit.addEventListener('click', () => {
      const text = habitInput.value.trim();
      if (text !== '') {
        myHabits.push({ id: Date.now(), text: text, completed: false });
        habitInput.value = '';
        saveAndRenderHabits();
      }
    });
  }

  if (btnViewMoreHabits && habitContainer) {
    btnViewMoreHabits.addEventListener('click', () => {
      habitContainer.classList.toggle('collapsed');
      btnViewMoreHabits.innerText = habitContainer.classList.contains('collapsed') ? "View More" : "View Less";
    });
  }

  saveAndRenderHabits();


  // --- 4. DRAW LINE GRAPH FUNCTION ---
  function drawLineGraph() {
    const svg = document.getElementById('line-graph-svg');
    const labelsContainer = document.getElementById('graph-labels');
    if (!svg || !labelsContainer) return;

    svg.innerHTML = '';
    labelsContainer.innerHTML = '';

    const history = MomentumEngine.getWeeklyHistory();
    const width = svg.clientWidth || 200; 
    const height = svg.clientHeight || 80; 

    const gap = width / 6; 
    let pathString = "";

    history.forEach((data, index) => {
      const isToday = index === 6;
      const x = index * gap;
      const y = height - (data.score / 100 * height);

      if (index === 0) pathString += `M ${x} ${y} `;
      else pathString += `L ${x} ${y} `;

      if (isToday && data.score > 0) {
        const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bar.setAttribute("x", x - 4); 
        bar.setAttribute("y", y);
        bar.setAttribute("width", 8);
        bar.setAttribute("height", height - y);
        bar.setAttribute("class", "today-bar");
        svg.appendChild(bar);
      }

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 4);
      dot.setAttribute("class", isToday ? "graph-dot today-dot" : "graph-dot");
      svg.appendChild(dot);

      const label = document.createElement('div');
      label.className = 'day-label';
      label.style.color = isToday ? 'var(--accent-mint)' : 'var(--text-muted)';
      label.innerText = data.day;
      labelsContainer.appendChild(label);
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathString);
    path.setAttribute("class", "graph-line");
    svg.prepend(path);
  }

  // --- 5. DYNAMIC TIME GREETING ---
  const currentHour = new Date().getHours();
  let greetingText = "Good Evening";
  
  if (currentHour >= 5 && currentHour < 12) {
    greetingText = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greetingText = "Good Afternoon";
  }
  const greetingEl = document.getElementById('dynamic-greeting');
  if (greetingEl) greetingEl.innerText = greetingText;


  // --- 6. MOMENTUM SYSTEM ANIMATION SEQUENCE ---
  const ringHabits = document.querySelector('.ring-habits');
  const ringAcademics = document.querySelector('.ring-academics');
  const ringSkills = document.querySelector('.ring-skills');
  const centerTextBox = document.getElementById('center-text-box');
  const messageBoard = document.getElementById('momentum-message');
  const graphContainerSection = document.getElementById('weekly-graph-container');

  function animateRings(habitsRaw, academicsRaw, skillsRaw) {
    if(ringHabits) ringHabits.style.strokeDashoffset = 188 - (Math.min(100, habitsRaw) / 100) * 188;
    if(ringAcademics) ringAcademics.style.strokeDashoffset = 440 - (Math.min(100, academicsRaw) / 100) * 440;
    if(ringSkills) ringSkills.style.strokeDashoffset = 314 - (Math.min(100, skillsRaw) / 100) * 314;
  }

  if (centerTextBox && messageBoard) {
      centerTextBox.innerHTML = ``;
      messageBoard.innerHTML = `<span style="font-size: 20px; color: var(--text-main); font-weight: 600; letter-spacing: 1px;">Welcome back.</span>`;
      animateRings(0, 0, 0);

      setTimeout(() => {
        const yesterdayHistory = MomentumEngine.getWeeklyHistory()[5]; // index 5 is yesterday
        const yesterdayPoints = yesterdayHistory ? yesterdayHistory.score : 0;
        const motivationMessage = yesterdayPoints < 50 ? "Time to lock in today." : "Keep the momentum going.";

        centerTextBox.innerHTML = `
          <span id="score-value" style="color: var(--text-muted);">${yesterdayPoints}</span>
          <span class="score-label">pts</span>
        `;
        
        messageBoard.innerHTML = `
          <span style="font-size: 14px; color: var(--accent-mint); font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Yesterday's Progress</span>
          <span style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">${motivationMessage}</span>
        `;
        
        // Spin rings based on yesterday's points (approximate visual)
        animateRings(yesterdayPoints, 0, 0); 

        setTimeout(() => {
          const realHabitPercent = parseFloat(localStorage.getItem('gceya7_today_habit_percent')) || 0;
          const todayData = MomentumEngine.calculateTodayScore(realHabitPercent, 0, 0);

          messageBoard.style.opacity = '0';

          setTimeout(() => {
            messageBoard.classList.add('hidden');
            if (graphContainerSection) {
                graphContainerSection.classList.remove('hidden');
                drawLineGraph(); 
                setTimeout(() => graphContainerSection.style.opacity = '1', 50);
            }

            centerTextBox.innerHTML = `
              <span id="score-value">0</span>
              <span class="score-label">pts</span>
            `;
            
            animateRings(todayData.raw.habits, todayData.raw.academics, todayData.raw.skills);
            
            const scoreText = document.getElementById('score-value');
            let currentScore = 0;
            const targetPoints = todayData.points;
            
            if (targetPoints > 0 && scoreText) {
                const scoreInterval = setInterval(() => {
                  if (currentScore >= targetPoints) {
                    clearInterval(scoreInterval);
                  } else {
                    currentScore++;
                    scoreText.innerText = currentScore;
                  }
                }, 25);
            } else if (scoreText) {
                scoreText.innerText = 0;
            }

          }, 500); 
        }, 4000); 
      }, 1500); 
  }

  // --- 7. HOME: CALENDAR TRACKER ---
  const calendarTrack = document.getElementById('calendar-track');
  const currentMonthLabel = document.getElementById('current-month');
  
  if (calendarTrack && currentMonthLabel) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      const today = new Date();
      currentMonthLabel.innerText = months[today.getMonth()];

      for (let i = -10; i <= 20; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);
        
        const dayName = days[targetDate.getDay()];
        const dateNum = targetDate.getDate();
        
        const pill = document.createElement('div');
        pill.className = `date-pill ${i === 0 ? 'active' : ''}`;
        if (i === 0) pill.id = 'today-pill'; 
        
        pill.innerHTML = `
          <div class="day">${dayName}</div>
          <div class="date">${dateNum}</div>
        `;
        calendarTrack.appendChild(pill);
      }

      setTimeout(() => {
        const todayPill = document.getElementById('today-pill');
        if (todayPill) {
          calendarTrack.scrollTo({
            left: todayPill.offsetLeft - (calendarTrack.offsetWidth / 2) + (todayPill.offsetWidth / 2),
            behavior: 'smooth'
          });
        }
      }, 100);
  }

});