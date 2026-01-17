import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckSquare,
  Code2,
  Cpu,
  Database,
  Edit3,
  FileCode,
  Layers,
  LayoutDashboard,
  Menu,
  Plus,
  ScrollText,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';

// Drag and Drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// Import API service
import { tabsApi, subtopicsApi, itemsApi, checklistApi, applicationsApi, activityApi, dashboardApi } from './services/api';
import { CodeAvatar, LoadingSpinner, ErrorMessage, SortableTopicSection, SortableAccordionItem, AppModals, ChecklistView, ApplicationTrackerView, JournalView, HabitsView } from './components';

// Icon mapping
const IconMap = {
  Database, Layers, Code2, Cpu, FileCode, BookOpen, Sparkles
};

function App() {
  // State
  const [tabs, setTabs] = useState([]);
  const [tabsWithSubtopics, setTabsWithSubtopics] = useState([]);
  const [currentTabData, setCurrentTabData] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [habits, setHabits] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  
  const [activeTab, setActiveTab] = useState(null);
  const [activeTopNav, setActiveTopNav] = useState('todo');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openAccordions, setOpenAccordions] = useState({});
  const [openSubtopics, setOpenSubtopics] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DnD Sensors - must be at top level, not conditional
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load tab data when activeTab changes
  useEffect(() => {
    if (activeTab) {
      loadTabData(activeTab);
    }
  }, [activeTab]);

  // Load data based on active top nav
  useEffect(() => {
    if (activeTopNav === 'checklist') {
      loadChecklist();
    } else if (activeTopNav === 'tracker') {
      loadApplications();
    } else if (activeTopNav === 'journal') {
      loadActivityLog();
    } else if (activeTopNav === 'habits') {
      loadHabits();
    } else if (activeTopNav === 'dashboard') {
      loadDashboardStats();
    }
  }, [activeTopNav]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tabsData, tabsWithSubtopicsData, statsData] = await Promise.all([
        tabsApi.getAll(),
        tabsApi.getTabsWithSubtopics(),
        dashboardApi.getStats()
      ]);
      
      setTabs(tabsData);
      setTabsWithSubtopics(tabsWithSubtopicsData);
      setDashboardStats(statsData);
      
      if (tabsData.length > 0) {
        setActiveTab(tabsData[0].id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tabId) => {
    try {
      const data = await tabsApi.getWithData(tabId);
      setCurrentTabData(data);
    } catch (err) {
      console.error('Failed to load tab data:', err);
    }
  };

  const loadChecklist = async () => {
    try {
      const data = await checklistApi.getAll();
      setChecklist(data);
    } catch (err) {
      console.error('Failed to load checklist:', err);
    }
  };

  const loadApplications = async () => {
    try {
      const data = await applicationsApi.getAll();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  const loadActivityLog = async () => {
    try {
      const data = await activityApi.getAll();
      setActivityLog(data);
    } catch (err) {
      console.error('Failed to load activity log:', err);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setDashboardStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    }
  };

  // Check if tab has subtopics
  const hasSubtopics = useCallback((tabId) => {
    return tabsWithSubtopics.includes(tabId);
  }, [tabsWithSubtopics]);

  // Calculate progress for a tab
  const calculateProgress = useCallback((tabId) => {
    if (dashboardStats) {
      const cat = dashboardStats.categoryProgress?.find(c => c.tabId === tabId);
      return cat?.progress || 0;
    }
    return 0;
  }, [dashboardStats]);

  // Toggle accordion
  const toggleAccordion = (itemId) => {
    setOpenAccordions(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Toggle subtopic accordion
  const toggleSubtopic = (subtopicId) => {
    setOpenSubtopics(prev => ({
      ...prev,
      [subtopicId]: !prev[subtopicId]
    }));
  };

  // Toggle item completion
  const toggleItemComplete = async (itemId) => {
    try {
      await itemsApi.toggleCompletion(itemId);
      await loadTabData(activeTab);
      // Always refresh dashboard stats to update sidebar progress
      await loadDashboardStats();
    } catch (err) {
      console.error('Failed to toggle item:', err);
    }
  };

  // Add new item
  const addItem = async (tabId, subtopicId = null) => {
    try {
      const newItem = {
        title: 'New Question',
        completed: false,
        content: '# New Question\n\nAdd your notes here...',
        code: '',
        codeLanguage: 'javascript',
        tabId,
        subtopicId
      };
      
      const created = await itemsApi.create(newItem);
      await loadTabData(activeTab);
      setOpenAccordions(prev => ({ ...prev, [created.id]: true }));
      setEditingItem(created.id);
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  // Add new subtopic
  const addSubtopic = (tabId) => {
    setModalData({ tabId, name: '', color: '#4ecdc4' });
    setShowModal('addSubtopic');
  };

  // Save new subtopic
  const saveNewSubtopic = async () => {
    if (!modalData.name.trim()) return;
    try {
      const newSubtopic = {
        name: modalData.name,
        color: modalData.color,
        tabId: modalData.tabId
      };
      const created = await subtopicsApi.create(newSubtopic);
      await loadTabData(activeTab);
      setShowModal(null);
      setOpenSubtopics(prev => ({ ...prev, [created.id]: true }));
    } catch (err) {
      console.error('Failed to create subtopic:', err);
    }
  };

  // Delete subtopic
  const deleteSubtopic = async (subtopicId) => {
    try {
      await subtopicsApi.delete(subtopicId);
      await loadTabData(activeTab);
    } catch (err) {
      console.error('Failed to delete subtopic:', err);
    }
  };

  // Reorder subtopics
  const handleReorderSubtopics = async (oldIndex, newIndex) => {
    if (oldIndex === newIndex) return;
    
    const reordered = arrayMove(currentSubtopics, oldIndex, newIndex);
    
    // Optimistic update
    setCurrentTabData(prev => ({
      ...prev,
      subtopics: reordered
    }));
    
    // Save to backend
    try {
      const updates = reordered.map((subtopic, index) => ({
        id: subtopic.id,
        sortOrder: index
      }));
      await subtopicsApi.reorder(updates);
    } catch (err) {
      console.error('Failed to reorder subtopics:', err);
      await loadTabData(activeTab); // Revert on error
    }
  };

  // Reorder items within a subtopic or tab
  const handleReorderItems = async (subtopicId, oldIndex, newIndex) => {
    if (oldIndex === newIndex) return;
    
    // Find items to reorder
    let itemsToReorder;
    if (subtopicId) {
      const subtopic = currentSubtopics.find(s => s.id === subtopicId);
      itemsToReorder = subtopic?.items || [];
    } else {
      itemsToReorder = currentItems;
    }
    
    const reordered = arrayMove(itemsToReorder, oldIndex, newIndex);
    
    // Optimistic update
    if (subtopicId) {
      setCurrentTabData(prev => ({
        ...prev,
        subtopics: prev.subtopics.map(s => 
          s.id === subtopicId ? { ...s, items: reordered } : s
        )
      }));
    } else {
      setCurrentTabData(prev => ({
        ...prev,
        items: reordered
      }));
    }
    
    // Save to backend
    try {
      const updates = reordered.map((item, index) => ({
        id: item.id,
        sortOrder: index
      }));
      await itemsApi.reorder(updates);
    } catch (err) {
      console.error('Failed to reorder items:', err);
      await loadTabData(activeTab); // Revert on error
    }
  };

  // Update item
  const updateItem = async (itemId, updates) => {
    try {
      await itemsApi.update(itemId, updates);
      await loadTabData(activeTab);
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  // Delete item
  const deleteItem = async (itemId) => {
    try {
      await itemsApi.delete(itemId);
      await loadTabData(activeTab);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Add new tab
  const addTab = () => {
    setModalData({ name: '', icon: 'BookOpen', color: '#4ecdc4' });
    setShowModal('addTab');
  };

  // Save new tab
  const saveNewTab = async () => {
    if (!modalData.name.trim()) return;
    try {
      const newTab = {
        name: modalData.name,
        icon: modalData.icon,
        color: modalData.color,
        hasSubtopics: false
      };
      const created = await tabsApi.create(newTab);
      const updatedTabs = await tabsApi.getAll();
      setTabs(updatedTabs);
      setShowModal(null);
      setActiveTab(created.id);
    } catch (err) {
      console.error('Failed to create tab:', err);
    }
  };

  // Edit tab
  const editTab = (tab) => {
    setModalData({ ...tab });
    setShowModal('editTab');
  };

  // Save edited tab
  const saveEditedTab = async () => {
    try {
      await tabsApi.update(modalData.id, {
        name: modalData.name,
        icon: modalData.icon,
        color: modalData.color
      });
      const updatedTabs = await tabsApi.getAll();
      setTabs(updatedTabs);
      setShowModal(null);
    } catch (err) {
      console.error('Failed to update tab:', err);
    }
  };

  // Delete tab
  const deleteTab = async (tabId) => {
    if (tabs.length <= 1) return;
    try {
      await tabsApi.delete(tabId);
      const updatedTabs = await tabsApi.getAll();
      setTabs(updatedTabs);
      if (activeTab === tabId && updatedTabs.length > 0) {
        setActiveTab(updatedTabs[0].id);
      }
    } catch (err) {
      console.error('Failed to delete tab:', err);
    }
  };

  // Checklist functions
  const toggleChecklistItem = async (itemId) => {
    try {
      await checklistApi.toggle(itemId);
      await loadChecklist();
    } catch (err) {
      console.error('Failed to toggle checklist item:', err);
    }
  };

  const addChecklistItem = async () => {
    try {
      await checklistApi.create({ text: 'New task', completed: false });
      await loadChecklist();
    } catch (err) {
      console.error('Failed to add checklist item:', err);
    }
  };

  const updateChecklistItem = async (itemId, text) => {
    try {
      await checklistApi.update(itemId, { text });
      await loadChecklist();
    } catch (err) {
      console.error('Failed to update checklist item:', err);
    }
  };

  const deleteChecklistItem = async (itemId) => {
    try {
      await checklistApi.delete(itemId);
      await loadChecklist();
    } catch (err) {
      console.error('Failed to delete checklist item:', err);
    }
  };

  // Application tracker functions
  const addApplication = () => {
    setModalData({ company: '', role: '', status: 'APPLIED', date: new Date().toISOString().split('T')[0] });
    setShowModal('addApplication');
  };

  const saveApplication = async () => {
    if (!modalData.company.trim()) return;
    try {
      await applicationsApi.create(modalData);
      await loadApplications();
      setShowModal(null);
    } catch (err) {
      console.error('Failed to create application:', err);
    }
  };

  const deleteApplication = async (appId) => {
    try {
      await applicationsApi.delete(appId);
      await loadApplications();
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  // Habit tracker functions
  const loadHabits = () => {
    const savedHabits = localStorage.getItem('preptracker_habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  };

  const saveHabitsToStorage = (newHabits) => {
    localStorage.setItem('preptracker_habits', JSON.stringify(newHabits));
    setHabits(newHabits);
  };

  const addHabit = () => {
    const name = prompt('Enter habit name:');
    if (name && name.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: name.trim(),
        completedDates: [], // Array of YYYY-MM-DD strings
        createdAt: new Date().toISOString()
      };
      saveHabitsToStorage([...habits, newHabit]);
    }
  };

  const logHabitActivity = async (habitName, dateStr) => {
    try {
      await activityApi.create({
        date: dateStr,
        itemTitle: habitName,
        type: 'HABIT_COMPLETED',
        tabName: 'Habit Tracker',
        tabColor: '#ff6b6b'
      });
      if (activeTopNav === 'journal') {
        loadActivityLog();
      }
    } catch (err) {
      console.error('Failed to log habit activity:', err);
    }
  };

  const toggleHabitDate = (habitId, dateStr) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = [...habit.completedDates];
        const index = completedDates.indexOf(dateStr);
        if (index > -1) {
          completedDates.splice(index, 1);
        } else {
          completedDates.push(dateStr);
          logHabitActivity(habit.name, dateStr);
        }
        return { ...habit, completedDates };
      }
      return habit;
    });
    saveHabitsToStorage(updatedHabits);
  };

  const deleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const updatedHabits = habits.filter(h => h.id !== habitId);
      saveHabitsToStorage(updatedHabits);
    }
  };

  // Get chart data
  const getChartData = () => {
    if (dashboardStats?.categoryProgress) {
      return dashboardStats.categoryProgress.map(cat => ({
        name: cat.name,
        progress: cat.progress,
        fill: cat.color
      }));
    }
    return [];
  };

  // Render icon component
  const renderIcon = (iconName, size = 20) => {
    const Icon = IconMap[iconName] || BookOpen;
    return <Icon size={size} />;
  };

  // Get current tab data
  const currentTab = tabs.find(t => t.id === activeTab);
  const isNestedTab = hasSubtopics(activeTab);
  const currentItems = currentTabData?.items || [];
  const currentSubtopics = currentTabData?.subtopics || [];

  // Loading state
  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Connecting to server..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ErrorMessage message={error} onRetry={loadInitialData} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Overlay - closes sidebar when clicked */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <CodeAvatar />
            <div className="logo">
              <span>PrepTracker</span>
              <span className="logo-tagline">Code • Learn • Grow</span>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            className="sidebar-close" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Categories</div>
          
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-item-icon" style={{ color: tab.color }}>
                {renderIcon(tab.icon)}
              </span>
              <span>{tab.name}</span>
              <span className="nav-item-progress">{calculateProgress(tab.id)}%</span>
              <div className="nav-item-actions" onClick={(e) => e.stopPropagation()}>
                <button className="nav-action-btn" onClick={() => editTab(tab)}>
                  <Edit3 size={14} />
                </button>
                <button className="nav-action-btn delete" onClick={() => deleteTab(tab.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <button className="add-tab-btn" onClick={addTab}>
            <Plus size={18} />
            Add Category
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-wrapper">
        {/* Top Navbar */}
        <header className="topbar">
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="topbar-nav">
            <button
              className={`topbar-nav-item ${activeTopNav === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTopNav('todo')}
            >
              <BookOpen size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              To-Do
            </button>
            <button
              className={`topbar-nav-item ${activeTopNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTopNav('dashboard')}
            >
              <LayoutDashboard size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Dashboard
            </button>
            <button
              className={`topbar-nav-item ${activeTopNav === 'checklist' ? 'active' : ''}`}
              onClick={() => setActiveTopNav('checklist')}
            >
              <CheckSquare size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Checklist
            </button>
            <button
              className={`topbar-nav-item ${activeTopNav === 'tracker' ? 'active' : ''}`}
              onClick={() => setActiveTopNav('tracker')}
            >
              <Briefcase size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Application Tracker
            </button>
            <button
              className={`topbar-nav-item ${activeTopNav === 'habits' ? 'active' : ''}`}
              onClick={() => setActiveTopNav('habits')}
            >
              <Calendar size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Habit Tracker
            </button>
            <button
              className={`topbar-nav-item ${activeTopNav === 'journal' ? 'active' : ''}`}
              onClick={() => setActiveTopNav('journal')}
            >
              <ScrollText size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Journal
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="main-content">
          <AnimatePresence mode="wait">
            {/* To-Do View */}
            {activeTopNav === 'todo' && (
              <motion.div
                key="todo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h1 className="content-title">
                    <div className="content-title-icon" style={{ background: `linear-gradient(135deg, ${currentTab?.color || '#4ecdc4'}, ${currentTab?.color || '#4ecdc4'}88)` }}>
                      {currentTab && renderIcon(currentTab.icon, 28)}
                    </div>
                    {currentTab?.name || 'Topics'}
                  </h1>
                  <p className="content-subtitle">Track your learning progress in {currentTab?.name}</p>
                </div>

                {/* Progress Overview */}
                <div className="progress-overview">
                  <div className="progress-header">
                    <span className="progress-label">Overall Progress</span>
                    <span className="progress-value">{currentTabData?.progress || 0}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <motion.div
                      className="progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentTabData?.progress || 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="progress-stats">
                    <div className="progress-stat">
                      <span className="progress-stat-dot completed"></span>
                      {isNestedTab 
                        ? currentSubtopics.reduce((acc, s) => acc + s.items.filter(i => i.completed).length, 0)
                        : currentItems.filter(i => i.completed).length} completed
                    </div>
                    <div className="progress-stat">
                      <span className="progress-stat-dot pending"></span>
                      {isNestedTab 
                        ? currentSubtopics.reduce((acc, s) => acc + s.items.filter(i => !i.completed).length, 0)
                        : currentItems.filter(i => !i.completed).length} remaining
                    </div>
                  </div>
                </div>

                {/* Topics with collapsible sections (for DSA-like tabs) */}
                {isNestedTab ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => {
                      const { active, over } = event;
                      if (over && active.id !== over.id) {
                        const oldIndex = currentSubtopics.findIndex(s => s.id === active.id);
                        const newIndex = currentSubtopics.findIndex(s => s.id === over.id);
                        handleReorderSubtopics(oldIndex, newIndex);
                      }
                    }}
                  >
                    <SortableContext items={currentSubtopics.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="topics-container">
                        {currentSubtopics.map((topic) => (
                          <SortableTopicSection
                            key={topic.id}
                            topic={topic}
                            tabId={activeTab}
                            isOpen={openSubtopics[topic.id]}
                            openAccordions={openAccordions}
                            editingItem={editingItem}
                            progress={topic.progress || 0}
                            onToggle={() => toggleSubtopic(topic.id)}
                            onToggleAccordion={toggleAccordion}
                            onToggleComplete={(itemId) => toggleItemComplete(itemId)}
                            onUpdateItem={(itemId, updates) => updateItem(itemId, updates)}
                            onDeleteItem={(itemId) => deleteItem(itemId)}
                            onEditItem={(itemId) => setEditingItem(editingItem === itemId ? null : itemId)}
                            onAddItem={() => addItem(activeTab, topic.id)}
                            onDeleteTopic={() => deleteSubtopic(topic.id)}
                            onReorderItems={handleReorderItems}
                          />
                        ))}

                        {currentSubtopics.length === 0 && (
                          <div className="empty-state">
                            <div className="empty-state-icon">
                              <Layers size={32} />
                            </div>
                            <h3 className="empty-state-title">No topics yet</h3>
                            <p className="empty-state-text">Add topics to organize your questions</p>
                          </div>
                        )}

                        <button className="add-topic-btn" onClick={() => addSubtopic(activeTab)}>
                          <Plus size={18} />
                          Add Topic
                        </button>
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  /* Regular Accordion List (for tabs without subtopics) */
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => {
                      const { active, over } = event;
                      if (over && active.id !== over.id) {
                        const oldIndex = currentItems.findIndex(i => i.id === active.id);
                        const newIndex = currentItems.findIndex(i => i.id === over.id);
                        handleReorderItems(null, oldIndex, newIndex);
                      }
                    }}
                  >
                    <SortableContext items={currentItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
                      <div className="accordion-list">
                        {currentItems.map((item) => (
                          <SortableAccordionItem
                            key={item.id}
                            item={item}
                            isOpen={openAccordions[item.id]}
                            isEditing={editingItem === item.id}
                            onToggle={() => toggleAccordion(item.id)}
                            onToggleComplete={() => toggleItemComplete(item.id)}
                            onUpdate={(updates) => updateItem(item.id, updates)}
                            onDelete={() => deleteItem(item.id)}
                            onEdit={() => setEditingItem(editingItem === item.id ? null : item.id)}
                          />
                        ))}

                        {currentItems.length === 0 && (
                          <div className="empty-state">
                            <div className="empty-state-icon">
                              <BookOpen size={32} />
                            </div>
                            <h3 className="empty-state-title">No topics yet</h3>
                            <p className="empty-state-text">Start adding topics to track your progress</p>
                          </div>
                        )}

                        <button className="add-item-btn" onClick={() => addItem(activeTab)}>
                          <Plus size={20} />
                          Add New Topic
                        </button>
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </motion.div>
            )}

            {/* Dashboard View */}
            {activeTopNav === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h1 className="content-title">
                    <div className="content-title-icon">
                      <LayoutDashboard size={28} />
                    </div>
                    Dashboard
                  </h1>
                  <p className="content-subtitle">Overview of your preparation progress</p>
                </div>

                {/* Stats Cards */}
                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <div className="dashboard-card-header">
                      <span className="dashboard-card-title">Overall Progress</span>
                    </div>
                    <div className="dashboard-card-value">{dashboardStats?.overallProgress || 0}%</div>
                  </div>
                  <div className="dashboard-card">
                    <div className="dashboard-card-header">
                      <span className="dashboard-card-title">Total Questions</span>
                    </div>
                    <div className="dashboard-card-value">{dashboardStats?.totalQuestions || 0}</div>
                  </div>
                  <div className="dashboard-card">
                    <div className="dashboard-card-header">
                      <span className="dashboard-card-title">Completed</span>
                    </div>
                    <div className="dashboard-card-value">{dashboardStats?.completedQuestions || 0}</div>
                  </div>
                  <div className="dashboard-card">
                    <div className="dashboard-card-header">
                      <span className="dashboard-card-title">Categories</span>
                    </div>
                    <div className="dashboard-card-value">{dashboardStats?.totalCategories || 0}</div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="chart-container">
                  <h3 className="chart-title">Progress by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: '#1a2234',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                      />
                      <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                        {getChartData().map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="chart-container">
                  <h3 className="chart-title">Completion Overview</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: dashboardStats?.completedQuestions || 0, fill: '#10b981' },
                          { name: 'Remaining', value: (dashboardStats?.totalQuestions || 0) - (dashboardStats?.completedQuestions || 0), fill: '#64748b' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#1a2234',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Checklist View */}
            {activeTopNav === 'checklist' && (
              <ChecklistView
                checklist={checklist}
                addChecklistItem={addChecklistItem}
                toggleChecklistItem={toggleChecklistItem}
                updateChecklistItem={updateChecklistItem}
                deleteChecklistItem={deleteChecklistItem}
              />
            )}

            {/* Application Tracker View */}
            {activeTopNav === 'tracker' && (
              <ApplicationTrackerView
                applications={applications}
                addApplication={addApplication}
                deleteApplication={deleteApplication}
              />
            )}

            {/* Journal View */}
            {activeTopNav === 'journal' && (
              <JournalView activityLog={activityLog} />
            )}

            {/* Habit Tracker View */}
            {activeTopNav === 'habits' && (
              <HabitsView
                habits={habits}
                addHabit={addHabit}
                deleteHabit={deleteHabit}
                toggleHabitDate={toggleHabitDate}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <AppModals
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
        saveNewTab={saveNewTab}
        saveEditedTab={saveEditedTab}
        saveNewSubtopic={saveNewSubtopic}
        saveApplication={saveApplication}
      />
    </div>
  );
}

export default App;
