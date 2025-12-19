import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import {
  BookOpen, Code2, Database, Layers, Cpu, Plus, ChevronDown,
  Check, Trash2, Edit3, X, LayoutDashboard, CheckSquare, Briefcase,
  Menu, Bold, Italic, List, Link2, FileCode,
  Eye, PenTool, Sparkles, ScrollText, Zap,
  Loader2, WifiOff, RefreshCw
} from 'lucide-react';

// Import API service
import { tabsApi, subtopicsApi, itemsApi, checklistApi, applicationsApi, activityApi, dashboardApi } from './services/api';

// Animated Code Ninja Avatar Component
function CodeAvatar() {
  return (
    <div className="code-avatar">
      {/* Orbiting code symbols */}
      <div className="orbit orbit-1">
        <span className="code-symbol symbol-1">{'<>'}</span>
      </div>
      <div className="orbit orbit-2">
        <span className="code-symbol symbol-2">{'/>'}</span>
      </div>
      <div className="orbit orbit-3">
        <span className="code-symbol symbol-3">{'{ }'}</span>
      </div>
      
      {/* Main avatar circle */}
      <div className="avatar-ring">
        <div className="avatar-inner">
          <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Katana sword - behind ninja, over right shoulder */}
            <g className="katana">
              {/* Blade */}
              <rect x="35" y="-2" width="2.5" height="38" rx="0.5" fill="url(#bladeGradient)" className="blade" transform="rotate(20 36 18)"/>
              
              {/* Blade shine */}
              <line x1="36.2" y1="0" x2="36.2" y2="34" stroke="white" strokeWidth="0.5" opacity="0.9" className="blade-shine" transform="rotate(20 36 18)"/>
              
              {/* Blade tip */}
              <path d="M35 -2 L36.25 -6 L37.5 -2" fill="url(#bladeGradient)" transform="rotate(20 36 18)"/>
              
              {/* Guard (tsuba) */}
              <ellipse cx="36.25" cy="36" rx="3.5" ry="1.8" fill="url(#guardGradient)" className="sword-guard" transform="rotate(20 36 18)"/>
              
              {/* Handle */}
              <rect x="35" y="37" width="2.5" height="10" rx="0.5" fill="#2d1f0f" transform="rotate(20 36 18)"/>
              <line x1="35" y1="39" x2="37.5" y2="39" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
              <line x1="35" y1="41" x2="37.5" y2="41" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
              <line x1="35" y1="43" x2="37.5" y2="43" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
              <line x1="35" y1="45" x2="37.5" y2="45" stroke="#1a1209" strokeWidth="0.8" transform="rotate(20 36 18)"/>
            </g>
            
            {/* Head base */}
            <circle cx="25" cy="22" r="14" fill="#e8b89a"/>
            
            {/* Ninja mask - covers head and lower face */}
            <path d="M11 18 Q11 10 25 10 Q39 10 39 18 L39 22 Q39 26 35 28 L33 28 L33 30 Q33 34 25 34 Q17 34 17 30 L17 28 L15 28 Q11 26 11 22 Z" fill="#1a1a2e" className="ninja-mask"/>
            
            {/* Mask texture lines */}
            <path d="M13 20 Q25 22 37 20" stroke="#252538" strokeWidth="0.5" fill="none" opacity="0.5"/>
            <path d="M14 24 Q25 26 36 24" stroke="#252538" strokeWidth="0.5" fill="none" opacity="0.5"/>
            
            {/* Eye opening in mask */}
            <path d="M14 17 Q25 14 36 17 L36 23 Q25 26 14 23 Z" fill="#e8b89a"/>
            
            {/* Headband */}
            <rect x="10" y="13" width="30" height="5" fill="#0f1520"/>
            <rect x="10" y="13" width="30" height="5" fill="url(#headbandGradient)"/>
            
            {/* Headband knot */}
            <circle cx="38" cy="15.5" r="3" fill="#0f1520"/>
            <circle cx="38" cy="15.5" r="3" fill="url(#headbandGradient)"/>
            
            {/* Headband tails flowing */}
            <path d="M39 18 Q44 22 42 30" stroke="url(#headbandGradient)" strokeWidth="3" fill="none" strokeLinecap="round" className="headband-tail tail-1"/>
            <path d="M40 17 Q46 20 45 28" stroke="url(#headbandGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" className="headband-tail tail-2"/>
            
            {/* Headband shine */}
            <line x1="12" y1="14" x2="20" y2="14" stroke="#00d9ff" strokeWidth="0.8" opacity="0.6"/>
            
            {/* Headband symbol - code bracket */}
            <text x="25" y="17" textAnchor="middle" fill="#00d9ff" fontSize="5" fontFamily="monospace" fontWeight="bold" className="headband-symbol">{'</>'}</text>
            
            {/* Intense Ninja Eyes - no glasses! */}
            <ellipse cx="19.5" cy="19" rx="2.5" ry="2" fill="#1a1a2e" className="eye"/>
            <ellipse cx="30.5" cy="19" rx="2.5" ry="2" fill="#1a1a2e" className="eye"/>
            
            {/* Eye glow - cyan ninja power */}
            <ellipse cx="19.5" cy="19" rx="1.5" ry="1.2" fill="#00d9ff" opacity="0.3" className="eye-glow"/>
            <ellipse cx="30.5" cy="19" rx="1.5" ry="1.2" fill="#00d9ff" opacity="0.3" className="eye-glow"/>
            
            {/* Pupils */}
            <ellipse cx="19.5" cy="19" rx="1" ry="0.8" fill="#0a0a0a"/>
            <ellipse cx="30.5" cy="19" rx="1" ry="0.8" fill="#0a0a0a"/>
            
            {/* Eye shine */}
            <circle cx="20.2" cy="18.3" r="0.6" fill="white"/>
            <circle cx="31.2" cy="18.3" r="0.6" fill="white"/>
            
            {/* Determined eyebrows */}
            <path d="M15 16 L22 17.5" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M28 17.5 L35 16" stroke="#1a1a2e" strokeWidth="2" fill="none" strokeLinecap="round"/>
            
            {/* Ninja outfit - cyber style */}
            <g className="ninja-outfit">
              {/* Base outfit */}
              <path d="M15 34 Q12 40 11 50 L39 50 Q38 40 35 34 Q25 31 15 34" fill="#0a0f18"/>
              
              {/* Collar / neck area */}
              <path d="M18 34 L25 38 L32 34" stroke="#00d9ff" strokeWidth="1" fill="none" opacity="0.6"/>
              <path d="M20 35 L25 37 L30 35" stroke="#00ff94" strokeWidth="0.5" fill="none" opacity="0.4"/>
              
              {/* Chest armor plate */}
              <path d="M18 36 L25 40 L32 36 L32 44 L25 48 L18 44 Z" fill="#0f1822" stroke="#00d9ff" strokeWidth="0.5" opacity="0.8"/>
              
              {/* Glowing lines on armor */}
              <line x1="25" y1="40" x2="25" y2="48" stroke="#00d9ff" strokeWidth="0.5" opacity="0.6" className="armor-line"/>
              <line x1="20" y1="38" x2="20" y2="45" stroke="#00d9ff" strokeWidth="0.3" opacity="0.4"/>
              <line x1="30" y1="38" x2="30" y2="45" stroke="#00d9ff" strokeWidth="0.3" opacity="0.4"/>
              
              {/* Shoulder pads */}
              <ellipse cx="14" cy="36" rx="4" ry="2" fill="#0f1822"/>
              <ellipse cx="14" cy="36" rx="3" ry="1.5" fill="none" stroke="#00d9ff" strokeWidth="0.4" opacity="0.5"/>
              <ellipse cx="36" cy="36" rx="4" ry="2" fill="#0f1822"/>
              <ellipse cx="36" cy="36" rx="3" ry="1.5" fill="none" stroke="#00d9ff" strokeWidth="0.4" opacity="0.5"/>
              
              {/* Belt */}
              <rect x="16" y="46" width="18" height="2" fill="#1a1209"/>
              <rect x="23" y="45.5" width="4" height="3" rx="0.5" fill="url(#guardGradient)" className="belt-buckle"/>
            </g>
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="headbandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d9ff"/>
                <stop offset="50%" stopColor="#00ff94"/>
                <stop offset="100%" stopColor="#00d9ff"/>
              </linearGradient>
              <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a8b5c4"/>
                <stop offset="30%" stopColor="#e8eef5"/>
                <stop offset="50%" stopColor="#ffffff"/>
                <stop offset="70%" stopColor="#e8eef5"/>
                <stop offset="100%" stopColor="#a8b5c4"/>
              </linearGradient>
              <linearGradient id="guardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700"/>
                <stop offset="50%" stopColor="#ffed4a"/>
                <stop offset="100%" stopColor="#b8860b"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      
      {/* Ninja stars */}
      <div className="ninja-star star-1">✦</div>
      <div className="ninja-star star-2">✦</div>
    </div>
  );
}

// Icon mapping
const IconMap = {
  Database, Layers, Code2, Cpu, FileCode, BookOpen, Sparkles
};

// Loading Spinner Component
function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <Loader2 className="loading-spinner" size={40} />
      <p>{message}</p>
    </div>
  );
}

// Error Component
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <WifiOff size={40} />
      <h3>Connection Error</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          <RefreshCw size={16} style={{ marginRight: 8 }} />
          Retry
        </button>
      )}
    </div>
  );
}

function App() {
  // State
  const [tabs, setTabs] = useState([]);
  const [tabsWithSubtopics, setTabsWithSubtopics] = useState([]);
  const [currentTabData, setCurrentTabData] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
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
                  <div className="topics-container">
                    {currentSubtopics.map((topic) => (
                      <TopicSection
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
                ) : (
                  /* Regular Accordion List (for tabs without subtopics) */
                  <div className="accordion-list">
                    {currentItems.map((item) => (
                      <AccordionItem
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
              <motion.div
                key="checklist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h1 className="content-title">
                    <div className="content-title-icon">
                      <CheckSquare size={28} />
                    </div>
                    Checklist
                  </h1>
                  <p className="content-subtitle">Quick tasks and milestones to track</p>
                </div>

                <div className="checklist-section">
                  <div className="checklist-header">
                    <h3 className="checklist-title">My Tasks</h3>
                    <button className="btn btn-primary" onClick={addChecklistItem}>
                      <Plus size={18} />
                      Add Task
                    </button>
                  </div>

                  {checklist.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      onToggle={() => toggleChecklistItem(item.id)}
                      onUpdate={(text) => updateChecklistItem(item.id, text)}
                      onDelete={() => deleteChecklistItem(item.id)}
                    />
                  ))}

                  {checklist.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <CheckSquare size={32} />
                      </div>
                      <h3 className="empty-state-title">No tasks yet</h3>
                      <p className="empty-state-text">Add tasks to keep track of your goals</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Application Tracker View */}
            {activeTopNav === 'tracker' && (
              <motion.div
                key="tracker"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h1 className="content-title">
                    <div className="content-title-icon">
                      <Briefcase size={28} />
                    </div>
                    Application Tracker
                  </h1>
                  <p className="content-subtitle">Track your job applications</p>
                </div>

                <div className="checklist-section">
                  <div className="checklist-header">
                    <h3 className="checklist-title">Applications</h3>
                    <button className="btn btn-primary" onClick={addApplication}>
                      <Plus size={18} />
                      Add Application
                    </button>
                  </div>

                  {applications.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="tracker-table">
                        <thead>
                          <tr>
                            <th>Company</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app) => (
                            <tr key={app.id}>
                              <td style={{ fontWeight: 600 }}>{app.company}</td>
                              <td>{app.role}</td>
                              <td>
                                <span className={`status-badge ${app.status?.toLowerCase()}`}>
                                  {app.status?.charAt(0) + app.status?.slice(1).toLowerCase()}
                                </span>
                              </td>
                              <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                                {app.date ? new Date(app.date).toLocaleDateString() : '-'}
                              </td>
                              <td>
                                <button
                                  className="nav-action-btn delete"
                                  onClick={() => deleteApplication(app.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Briefcase size={32} />
                      </div>
                      <h3 className="empty-state-title">No applications yet</h3>
                      <p className="empty-state-text">Start tracking your job applications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Journal View */}
            {activeTopNav === 'journal' && (
              <motion.div
                key="journal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h1 className="content-title">
                    <div className="content-title-icon" style={{ background: 'linear-gradient(135deg, #00d9ff, #bf7fff)' }}>
                      <ScrollText size={28} />
                    </div>
                    Activity Journal
                  </h1>
                  <p className="content-subtitle">Your daily learning timeline</p>
                </div>

                <JournalTimeline activityLog={activityLog} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(null)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Add/Edit Tab Modal */}
              {(showModal === 'addTab' || showModal === 'editTab') && (
                <>
                  <div className="modal-header">
                    <h3 className="modal-title">
                      {showModal === 'addTab' ? 'Add Category' : 'Edit Category'}
                    </h3>
                    <button className="modal-close" onClick={() => setShowModal(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Category name"
                        value={modalData.name || ''}
                        onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Icon</label>
                      <select
                        className="form-select"
                        value={modalData.icon || 'BookOpen'}
                        onChange={(e) => setModalData({ ...modalData, icon: e.target.value })}
                      >
                        <option value="BookOpen">Book</option>
                        <option value="Code2">Code</option>
                        <option value="Database">Database</option>
                        <option value="Layers">Layers</option>
                        <option value="Cpu">CPU</option>
                        <option value="FileCode">File Code</option>
                        <option value="Sparkles">Sparkles</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Color</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['#ff6b6b', '#4ecdc4', '#ffe66d', '#a78bfa', '#38bdf8', '#10b981', '#f59e0b'].map(color => (
                          <button
                            key={color}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: color,
                              border: modalData.color === color ? '3px solid white' : 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => setModalData({ ...modalData, color })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={showModal === 'addTab' ? saveNewTab : saveEditedTab}
                    >
                      {showModal === 'addTab' ? 'Add Category' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}

              {/* Add Topic Modal */}
              {showModal === 'addSubtopic' && (
                <>
                  <div className="modal-header">
                    <h3 className="modal-title">Add Topic</h3>
                    <button className="modal-close" onClick={() => setShowModal(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Topic Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Dynamic Programming"
                        value={modalData.name || ''}
                        onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Color</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['#ff6b6b', '#4ecdc4', '#ffe66d', '#a78bfa', '#38bdf8', '#10b981', '#f59e0b', '#ec4899'].map(color => (
                          <button
                            key={color}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              background: color,
                              border: modalData.color === color ? '3px solid white' : 'none',
                              cursor: 'pointer',
                              transition: 'transform 0.15s ease'
                            }}
                            onClick={() => setModalData({ ...modalData, color })}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveNewSubtopic}>
                      Add Topic
                    </button>
                  </div>
                </>
              )}

              {/* Add Application Modal */}
              {showModal === 'addApplication' && (
                <>
                  <div className="modal-header">
                    <h3 className="modal-title">Add Application</h3>
                    <button className="modal-close" onClick={() => setShowModal(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Company</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Company name"
                        value={modalData.company || ''}
                        onChange={(e) => setModalData({ ...modalData, company: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Job role"
                        value={modalData.role || ''}
                        onChange={(e) => setModalData({ ...modalData, role: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={modalData.status || 'APPLIED'}
                        onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFERED">Offered</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={modalData.date || ''}
                        onChange={(e) => setModalData({ ...modalData, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveApplication}>
                      Add Application
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Collapsible Topic Section (for categories like DP, Graphs, Trees)
function TopicSection({ 
  topic, 
  tabId, 
  isOpen, 
  openAccordions, 
  editingItem, 
  progress,
  onToggle, 
  onToggleAccordion,
  onToggleComplete, 
  onUpdateItem, 
  onDeleteItem, 
  onEditItem,
  onAddItem,
  onDeleteTopic
}) {
  const chevronVariants = {
    collapsed: { rotate: -90 },
    expanded: { rotate: 0 }
  };

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.15 }
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.25, delay: 0.1 }
      }
    }
  };

  return (
    <div className={`topic-section ${isOpen ? 'open' : ''}`}>
      {/* Topic Header - Simple collapsible */}
      <div className="topic-header" onClick={onToggle}>
        <motion.div
          className="topic-chevron"
          variants={chevronVariants}
          initial="collapsed"
          animate={isOpen ? "expanded" : "collapsed"}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
        
        <div className="topic-color-dot" style={{ background: topic.color }} />
        
        <span className="topic-name">{topic.name}</span>
        
        <span className="topic-badge">
          {topic.items.filter(i => i.completed).length}/{topic.items.length}
        </span>
        
        <div className="topic-progress-mini">
          <div 
            className="topic-progress-mini-fill" 
            style={{ width: `${progress}%`, background: topic.color }}
          />
        </div>
        
        <div className="topic-actions" onClick={(e) => e.stopPropagation()}>
          <button className="topic-action-btn" onClick={onAddItem} title="Add Question">
            <Plus size={14} />
          </button>
          <button className="topic-action-btn delete" onClick={onDeleteTopic} title="Delete Topic">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Questions List */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="topic-content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <div className="topic-questions">
              {topic.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <AccordionItem
                    item={item}
                    isOpen={openAccordions[item.id]}
                    isEditing={editingItem === item.id}
                    onToggle={() => onToggleAccordion(item.id)}
                    onToggleComplete={() => onToggleComplete(item.id)}
                    onUpdate={(updates) => onUpdateItem(item.id, updates)}
                    onDelete={() => onDeleteItem(item.id)}
                    onEdit={() => onEditItem(item.id)}
                    isNested={true}
                  />
                </motion.div>
              ))}

              {topic.items.length === 0 && (
                <div className="empty-questions">
                  <span>No questions yet</span>
                  <button className="add-first-btn" onClick={onAddItem}>
                    <Plus size={14} /> Add first question
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Accordion Item Component (for individual questions)
function AccordionItem({ item, isOpen, isEditing, onToggle, onToggleComplete, onUpdate, onDelete, onEdit, isNested = false }) {
  const [content, setContent] = useState(item.content);
  const [code, setCode] = useState(item.code);
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage);
  const [title, setTitle] = useState(item.title);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setContent(item.content);
    setCode(item.code);
    setCodeLanguage(item.codeLanguage);
    setTitle(item.title);
  }, [item]);

  const handleSave = () => {
    onUpdate({ content, code, codeLanguage, title });
  };

  // Smooth accordion animation variants
  const accordionVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.25, ease: "easeOut" }
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.35, delay: 0.1, ease: "easeIn" }
      }
    }
  };

  const contentVariants = {
    collapsed: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    expanded: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.35, delay: 0.15, ease: "easeOut" }
    }
  };

  const chevronVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  };

  return (
    <motion.div
      className={`accordion-item ${item.completed ? 'completed' : ''} ${isOpen ? 'open' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout="position"
    >
      <div className="accordion-header">
        <label className="accordion-checkbox" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={item.completed}
            onChange={onToggleComplete}
          />
          <motion.span 
            className="checkmark"
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Check size={14} />
          </motion.span>
        </label>

        {isEditing && isOpen ? (
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, padding: '8px 12px' }}
          />
        ) : (
          <span className="accordion-title" onClick={onToggle}>{item.title}</span>
        )}

        <div className="accordion-actions">
          <motion.button 
            className="nav-action-btn" 
            onClick={onEdit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 size={14} />
          </motion.button>
          <motion.button 
            className="nav-action-btn delete" 
            onClick={onDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={14} />
          </motion.button>
        </div>

        <motion.button 
          className="accordion-toggle" 
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            variants={chevronVariants}
            initial="collapsed"
            animate={isOpen ? "expanded" : "collapsed"}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="accordion-body"
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <motion.div 
              className="accordion-content"
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <div className="editor-container">
                <div className="editor-toolbar">
                  <button
                    className={`editor-btn ${!showPreview ? 'active' : ''}`}
                    onClick={() => setShowPreview(false)}
                    title="Edit"
                  >
                    <PenTool size={16} />
                  </button>
                  <button
                    className={`editor-btn ${showPreview ? 'active' : ''}`}
                    onClick={() => setShowPreview(true)}
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <div className="editor-divider" />
                  <button className="editor-btn" onClick={() => setContent(content + '\n## ')} title="Heading">
                    <Bold size={16} />
                  </button>
                  <button className="editor-btn" onClick={() => setContent(content + '*italic*')} title="Italic">
                    <Italic size={16} />
                  </button>
                  <button className="editor-btn" onClick={() => setContent(content + '\n- ')} title="List">
                    <List size={16} />
                  </button>
                  <button className="editor-btn" onClick={() => setContent(content + '[link](url)')} title="Link">
                    <Link2 size={16} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {showPreview ? (
                    <motion.div 
                      key="preview"
                      className="markdown-preview"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </motion.div>
                  ) : (
                    <motion.textarea
                      key="editor"
                      className="editor-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onBlur={handleSave}
                      placeholder="Write your notes in markdown..."
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Code Block */}
              <motion.div 
                className="code-block-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="code-block-header">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <FileCode size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    Code Snippet
                  </span>
                  <select
                    className="code-language-select"
                    value={codeLanguage}
                    onChange={(e) => {
                      setCodeLanguage(e.target.value);
                      onUpdate({ codeLanguage: e.target.value });
                    }}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <textarea
                  className="code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onBlur={handleSave}
                  placeholder="// Add your code here..."
                  spellCheck={false}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Journal Timeline Component
function JournalTimeline({ activityLog }) {
  const [hoveredDate, setHoveredDate] = useState(null);

  // Group activities by date
  const groupedByDate = activityLog.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return 'TODAY';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'YESTERDAY';
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    }).toUpperCase();
  };

  // Format time helper
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get unique categories with colors for a day
  const getCategories = (activities) => {
    const seen = new Set();
    return activities.filter(a => {
      if (seen.has(a.tabName)) return false;
      seen.add(a.tabName);
      return true;
    }).map(a => ({ name: a.tabName, color: a.tabColor }));
  };

  // Get count per category
  const getCategoryCounts = (activities) => {
    const counts = {};
    activities.forEach(a => {
      counts[a.tabName] = (counts[a.tabName] || 0) + 1;
    });
    return counts;
  };

  if (sortedDates.length === 0) {
    return (
      <div className="journal-empty">
        <div className="journal-empty-icon">
          <Zap size={40} />
        </div>
        <h3>No Activity Yet</h3>
        <p>Complete topics to see your progress timeline here</p>
        <div className="journal-empty-decoration">
          <div className="cyber-line"></div>
          <div className="cyber-dot"></div>
          <div className="cyber-line"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <div className="journal-timeline-v2">
        {/* The main vertical line */}
        <div className="timeline-spine">
          <div className="spine-glow"></div>
        </div>

        {sortedDates.map((date, dateIndex) => (
          <motion.div
            key={date}
            className={`timeline-row ${hoveredDate === date ? 'expanded' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: dateIndex * 0.08, duration: 0.3 }}
            onMouseEnter={() => setHoveredDate(date)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {/* Node on the line */}
            <div className="row-node">
              <div className="node-dot">
                <Zap size={10} />
              </div>
              {hoveredDate === date && <div className="node-pulse"></div>}
            </div>

            {/* Main row content */}
            <div className="row-content">
              {/* Collapsed: One line view */}
              <div className="row-summary">
                <span className="row-date">{formatDate(date)}</span>
                <div className="row-divider"></div>
                <div className="row-categories">
                  {getCategories(groupedByDate[date]).map((cat, i) => (
                    <span 
                      key={i}
                      className="category-tag"
                      style={{ 
                        background: `${cat.color}15`,
                        color: cat.color,
                        borderColor: `${cat.color}40`
                      }}
                    >
                      <span className="category-dot" style={{ background: cat.color }}></span>
                      {cat.name}
                      <span className="category-count">{getCategoryCounts(groupedByDate[date])[cat.name]}</span>
                    </span>
                  ))}
                </div>
                <div className="row-arrow">
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Expanded: Detailed view on hover */}
              <AnimatePresence>
                {hoveredDate === date && (
                  <motion.div
                    className="row-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="details-inner">
                      {groupedByDate[date].map((activity, actIndex) => (
                        <div key={activity.id} className="detail-item">
                          <div className="detail-time">{formatTime(activity.timestamp)}</div>
                          <div 
                            className="detail-indicator"
                            style={{ background: activity.tabColor }}
                          ></div>
                          <div className="detail-info">
                            <span className="detail-title">{activity.itemTitle}</span>
                            <span className="detail-meta">
                              {activity.subtopicName ? `${activity.subtopicName} · ` : ''}{activity.tabName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        {/* End marker */}
        <div className="timeline-origin">
          <div className="origin-node"></div>
          <span className="origin-label">ORIGIN</span>
        </div>
      </div>
    </div>
  );
}

// Checklist Item Component
function ChecklistItem({ item, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);

  const handleSave = () => {
    onUpdate(text);
    setIsEditing(false);
  };

  return (
    <motion.div
      className={`checklist-item ${item.completed ? 'completed' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      layout
    >
      <label className="accordion-checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={onToggle}
        />
        <span className="checkmark">
          <Check size={14} />
        </span>
      </label>

      {isEditing ? (
        <input
          type="text"
          className="form-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          style={{ flex: 1, padding: '8px 12px' }}
        />
      ) : (
        <span className="checklist-item-text" onDoubleClick={() => setIsEditing(true)}>
          {item.text}
        </span>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="nav-action-btn" onClick={() => setIsEditing(true)}>
          <Edit3 size={14} />
        </button>
        <button className="nav-action-btn delete" onClick={onDelete}>
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default App;
