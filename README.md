# Preparation Tracker

A beautiful, modern preparation tracker to help you track learning progress across multiple topics like DSA, Design, Java, Spring Boot, and JavaScript.

![PrepTracker](https://img.shields.io/badge/PrepTracker-v1.0-4ecdc4)

## Features

### 🧭 Layout & Navigation
- **Vertical Sidebar**: Fixed navigation with customizable categories (DSA, Design, Java, Spring Boot, JavaScript)
- **Dynamic Tabs**: Add, edit, and delete categories on the fly
- **Horizontal Top Navbar**: Quick access to ToDo, Dashboard, Checklist, and Application Tracker

### 📂 Core Features
- **Accordion-Based Items**: Expandable/collapsible topic items with smooth animations
- **Progress Tracking**: Real-time checkbox updates with visual progress indicators
- **Rich Text Editor**: Markdown support with live preview
- **Code Editor**: Syntax highlighting for multiple languages (Java, JavaScript, Python, TypeScript, C++, SQL)

### 📊 Dashboard
- Overall progress percentage
- Progress by category (bar chart)
- Completion overview (doughnut chart)
- Statistics cards

### ✅ Checklist
- Quick task management
- Mark tasks as complete
- Edit/delete functionality

### 💼 Application Tracker
- Track job applications
- Status management (Applied, Interview, Offered, Rejected)
- Date tracking

## Tech Stack

- **React 18** - UI Framework
- **Framer Motion** - Animations
- **Recharts** - Charts & visualizations
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Beautiful icons
- **LocalStorage** - Data persistence

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding a Category
1. Click "Add Category" in the sidebar
2. Enter a name, select an icon, and choose a color
3. Click "Add Category" to save

### Adding a Topic
1. Select a category from the sidebar
2. Click "Add New Topic" at the bottom
3. Edit the title and content
4. Add code snippets with syntax highlighting

### Tracking Progress
- Click the checkbox next to any topic to mark it complete
- View progress in the Dashboard
- Charts update automatically

### Managing Applications
1. Go to "Application Tracker" in the top navbar
2. Click "Add Application"
3. Fill in company, role, status, and date
4. Track your job search progress

## Data Persistence

All data is automatically saved to LocalStorage, so your progress persists between sessions.

## License

MIT License - feel free to use and modify for your own projects!

