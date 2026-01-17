import React, { useState } from 'react';

// Activity Heatmap Component (Reusable for Journal)
function ActivityHeatmap({ activities }) {
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

  // Group activities by date and count them
  const activityCountsByDate = activities.reduce((acc, activity) => {
    if (activity.date) {
      acc[activity.date] = (acc[activity.date] || 0) + 1;
    }
    return acc;
  }, {});

  // Find max activity count for normalization
  const maxActivityCount = Math.max(1, ...Object.values(activityCountsByDate));

  // Function to get color based on activity count
  const getCellColor = (count) => {
    if (count === 0) return 'transparent';
    if (count >= 1 && count <= 3) return 'rgba(0, 217, 255, 0.6)'; // Light Cyan
    if (count > 3 && count <= 7) return 'var(--accent-primary)';   // Pure Cyan
    return 'var(--accent-orange)';                               // Neon Orange (7+)
  };

  // Get available years from activities data
  const availableYears = (() => {
    const years = new Set();
    years.add(currentYear);
    activities.forEach(activity => {
      if (activity.date) {
        const year = parseInt(activity.date.split('-')[0]);
        if (!isNaN(year)) years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  })();

  // Extract unique dates from activities
  const completedDatesSet = new Set(Object.keys(activityCountsByDate));

  // Filter activities based on selected year for count
  const filteredActivitiesCount = activities.filter(activity => {
    if (selectedYear === 'last12') {
      const d = new Date(activity.date);
      const oneYearAgo = new Date();
      oneYearAgo.setDate(today.getDate() - 365);
      return d >= oneYearAgo && d <= today;
    } else {
      return activity.date && activity.date.startsWith(selectedYear.toString());
    }
  }).length;

  // Filter unique dates for total active days stat
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

      // Current streak
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
    <div className="habit-heatmap-container" style={{ marginBottom: '30px' }}>
      <div className="heatmap-header-row">
        <div className="submissions-count">
          <span className="count-big">{filteredActivitiesCount}</span>
          <span className="count-label">
            {selectedYear === 'last12' ? 'activities in the past year' : `activities in ${selectedYear}`}
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
                      const count = activityCountsByDate[dateStr] || 0;
                      const isCompleted = count > 0;
                      const isToday = dateStr === todayStr;

                      return (
                        <div
                          key={dIdx}
                          className={`heatmap-cell ${isCompleted ? 'active' : ''} ${isToday ? 'today' : ''} ${!date ? 'empty' : ''}`}
                          style={isCompleted ? { background: getCellColor(count) } : {}}
                          title={date ? `${date.toDateString()}${isCompleted ? ` (${count} Activities)` : ''}` : ''}
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
            <div className="legend-cell empty" style={{ background: '#1e293b' }}></div>
            <div className="legend-cell" style={{ background: 'rgba(0, 217, 255, 0.6)', title: '1-3 activities' }}></div>
            <div className="legend-cell" style={{ background: 'var(--accent-primary)', title: '3-7 activities' }}></div>
            <div className="legend-cell" style={{ background: 'var(--accent-orange)', title: '7+ activities' }}></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;

