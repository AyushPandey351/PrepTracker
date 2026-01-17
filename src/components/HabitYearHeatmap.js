import React, { useState } from 'react';

// Habit Tracker Heatmap Component (LeetCode style)
function HabitYearHeatmap({ habit, onToggle }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState('last12');

  const localFormatDate = (d) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Get available years from habit data
  const availableYears = (() => {
    const years = new Set();
    years.add(currentYear);
    (habit.completedDates || []).forEach(dateStr => {
      const year = parseInt(dateStr.split('-')[0]);
      if (!isNaN(year)) years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  })();

  // Calculate stats
  const completedDatesSet = new Set(habit.completedDates || []);

  // Filter dates based on selected year for total count
  const filteredDatesCount = Array.from(completedDatesSet).filter(dateStr => {
    if (selectedYear === 'last12') {
      const d = new Date(dateStr);
      const oneYearAgo = new Date();
      oneYearAgo.setDate(today.getDate() - 365);
      return d >= oneYearAgo && d <= today;
    } else {
      return dateStr.startsWith(selectedYear.toString());
    }
  }).length;

  const totalActiveDays = filteredDatesCount;

  // Calculate streaks
  let maxStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  if (completedDatesSet.size > 0) {
    if (selectedYear === 'last12') {
      // Max streak in last 365 days
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(today.getDate() - (364 - i));
        const dateStr = localFormatDate(d);
        if (completedDatesSet.has(dateStr)) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Current streak (always from today backwards)
      let checkDate = new Date();
      while (true) {
        const dateStr = localFormatDate(checkDate);
        if (completedDatesSet.has(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          if (currentStreak === 0) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yestStr = localFormatDate(yesterday);
            if (completedDatesSet.has(yestStr)) {
              checkDate = yesterday;
              continue;
            }
          }
          break;
        }
      }
    } else {
      // Specific year stats
      const isLeap = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      const daysInYear = isLeap(selectedYear) ? 366 : 365;

      for (let i = 0; i < daysInYear; i++) {
        const d = new Date(selectedYear, 0, 1 + i);
        const dateStr = localFormatDate(d);
        if (completedDatesSet.has(dateStr)) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Current streak only makes sense if current year is selected or if we want to show it regardless
      if (selectedYear === currentYear) {
        let checkDate = new Date();
        while (true) {
          const dateStr = localFormatDate(checkDate);
          if (completedDatesSet.has(dateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            if (currentStreak === 0) {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const yestStr = localFormatDate(yesterday);
              if (completedDatesSet.has(yestStr)) {
                checkDate = yesterday;
                continue;
              }
            }
            break;
          }
        }
      }
    }
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Group weeks by month
  const monthsData = [];

  if (selectedYear === 'last12') {
    const currentMonthIdx = today.getMonth();
    const currentYearVal = today.getFullYear();

    for (let i = 11; i >= 0; i--) {
      let m = currentMonthIdx - i;
      let y = currentYearVal;
      if (m < 0) {
        m += 12;
        y -= 1;
      }

      const firstDay = new Date(y, m, 1);
      const lastDay = new Date(y, m + 1, 0);
      const weeks = [];
      let currentWeek = Array(firstDay.getDay()).fill(null);
      for (let d = 1; d <= lastDay.getDate(); d++) {
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
        currentWeek.push(new Date(y, m, d));
      }
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
      }
      monthsData.push({ name: monthNames[m], weeks });
    }
  } else {
    // Specific Year View
    for (let m = 0; m < 12; m++) {
      const firstDay = new Date(selectedYear, m, 1);
      const lastDay = new Date(selectedYear, m + 1, 0);
      const weeks = [];
      let currentWeek = Array(firstDay.getDay()).fill(null);
      for (let d = 1; d <= lastDay.getDate(); d++) {
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
        currentWeek.push(new Date(selectedYear, m, d));
      }
      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
      }
      monthsData.push({ name: monthNames[m], weeks });
    }
  }

  const todayStr = localFormatDate(today);

  return (
    <div className="habit-heatmap-container">
      <div className="heatmap-header-row">
        <div className="submissions-count">
          <span className="count-big">{totalActiveDays}</span>
          <span className="count-label">
            {selectedYear === 'last12' ? 'submissions in the past one year' : `submissions in ${selectedYear}`}
          </span>
        </div>

        <div className="heatmap-controls-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <select
            className="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'last12' ? 'last12' : parseInt(e.target.value))}
            style={{
              background: '#1a1d23',
              color: '#adbac7',
              border: '1px solid #444c56',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              height: '32px'
            }}
          >
            <option value="last12">Last 12 Months</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <div className="heatmap-summary-stats">
            <div className="summary-stat">
              <span className="summary-label">Total active days:</span>
              <span className="summary-value">{totalActiveDays}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Max streak:</span>
              <span className="summary-value">{maxStreak}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Current:</span>
              <span className="summary-value">{currentStreak}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="heatmap-main-area-segmented">
        <div className="heatmap-grid-segmented">
          {monthsData.map((month, mIdx) => (
            <div key={mIdx} className="month-block">
              <div className="month-weeks">
                {month.weeks.map((week, wIdx) => (
                  <div key={wIdx} className="heatmap-column">
                    {week.map((date, dIdx) => {
                      const dateStr = localFormatDate(date);
                      const isCompleted = dateStr && completedDatesSet.has(dateStr);
                      const isToday = dateStr === todayStr;

                      return (
                        <div
                          key={dIdx}
                          className={`heatmap-cell ${isCompleted ? 'active' : ''} ${isToday ? 'today' : ''} ${!date ? 'empty' : ''}`}
                          title={date ? `${date.toDateString()}${isCompleted ? ' (Completed)' : ''}` : ''}
                          onClick={() => date && onToggle(dateStr)}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="month-label-bottom">{month.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap-footer-simple">
        <div className="heatmap-legend">
          <span>Less</span>
          <div className="legend-cells">
            <div className="legend-cell empty"></div>
            <div className="legend-cell active"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default HabitYearHeatmap;

