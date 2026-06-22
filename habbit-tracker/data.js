// data.js - The Brain of the Operation

const MomentumEngine = {
  rules: {
    habits: { target: 80, maxPoints: 50 },
    academics: { target: 60, maxPoints: 30 },
    skills: { target: 40, maxPoints: 20 }
  },

  // NEW: Dynamically generates the last 7 days based on today's real date
  getWeeklyHistory: function() {
    const history = [];
    const daysArr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    
    // Load saved history from phone memory
    const savedHistory = JSON.parse(localStorage.getItem('gceya7_weekly_history')) || {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toDateString(); 
      const dayLetter = daysArr[d.getDay()];

      let dayScore = 0;
      if (i === 0) {
        // TODAY: Calculate live from your current checkboxes
        const liveHabit = parseFloat(localStorage.getItem('gceya7_today_habit_percent')) || 0;
        const calculated = this.calculateTodayScore(liveHabit, 0, 0);
        dayScore = calculated.points;
      } else {
        // PAST DAYS: Pull from memory, or default to 0
        dayScore = savedHistory[dateString] || 0;
      }

      history.push({ day: dayLetter, score: dayScore, dateStr: dateString });
    }
    return history;
  },

  calculateTodayScore: function(actualHabits, actualAcademics, actualSkills) {
    const habitPoints = Math.min(this.rules.habits.maxPoints, (actualHabits / this.rules.habits.target) * this.rules.habits.maxPoints);
    const academicPoints = Math.min(this.rules.academics.maxPoints, (actualAcademics / this.rules.academics.target) * this.rules.academics.maxPoints);
    const skillPoints = Math.min(this.rules.skills.maxPoints, (actualSkills / this.rules.skills.target) * this.rules.skills.maxPoints);

    const totalPoints = Math.round(habitPoints + academicPoints + skillPoints);
    
    // Save today's final score into memory so the graph remembers it tomorrow
    const savedHistory = JSON.parse(localStorage.getItem('gceya7_weekly_history')) || {};
    savedHistory[new Date().toDateString()] = totalPoints;
    localStorage.setItem('gceya7_weekly_history', JSON.stringify(savedHistory));

    return {
      points: totalPoints,
      raw: { habits: actualHabits, academics: actualAcademics, skills: actualSkills }
    };
  }
};