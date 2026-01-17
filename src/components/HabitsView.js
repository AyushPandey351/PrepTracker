import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Plus, Trash2 } from 'lucide-react';
import HabitYearHeatmap from './HabitYearHeatmap';

function HabitsView({ habits, addHabit, deleteHabit, toggleHabitDate }) {
  return (
    <motion.div
      key="habits"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="content-header">
        <h1 className="content-title">
          <div className="content-title-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ff9f43)' }}>
            <Flame size={28} />
          </div>
          Habit Tracker
        </h1>
        <div className="flex-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <p className="content-subtitle">Track your daily consistency (Month Wise)</p>
          <button className="btn btn-primary" onClick={addHabit}>
            <Plus size={18} />
            Add Habit
          </button>
        </div>
      </div>

      <div className="habits-container">
        {habits.length > 0 ? (
          habits.map(habit => (
            <div key={habit.id} className="habit-card">
              <div className="habit-header">
                <h3 className="habit-name">{habit.name}</h3>
                <button className="delete-habit-btn" onClick={() => deleteHabit(habit.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="habit-grid-wrapper">
                <HabitYearHeatmap
                  habit={habit}
                  onToggle={(date) => toggleHabitDate(habit.id, date)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Flame size={32} />
            </div>
            <h3 className="empty-state-title">No habits tracked yet</h3>
            <p className="empty-state-text">Start by adding a habit like 'LeetCode Daily' or 'Reading'</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={addHabit}>
              Add Your First Habit
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default HabitsView;
