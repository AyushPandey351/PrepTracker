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

### Frontend
- **React 18** - UI Framework
- **Framer Motion** - Animations
- **Recharts** - Charts & visualizations
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Beautiful icons

### Backend
- **Spring Boot 3.2.0** - Java backend framework
- **H2 Database** - File-based database for data persistence
- **Spring Data JPA** - Database access layer
- **Maven** - Build tool and dependency management

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or yarn
- **Java 17+** (for backend)
- **Maven 3.6+** (for backend)

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. The backend uses Maven and will download dependencies automatically when you run it.

## Running the Application

### Frontend (React)

Start the React development server:
```bash
npm start
```

The frontend will run on **http://localhost:3000**

### Backend (Spring Boot)

**Option 1: Using Maven (Recommended for development)**
```bash
cd backend
C:\Users\ayush\OneDrive\Desktop\Tracker\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

**Option 2: Using the JAR file (After building)**
```bash
cd backend
java -jar target\prep-tracker-backend-1.0.0.jar
```

The backend will run on **http://localhost:8080**

### Running Both Services

Open **two separate terminal windows**:

**Terminal 1 - Frontend:**
```bash
npm start
```

**Terminal 2 - Backend:**
```bash
cd backend
C:\Users\ayush\OneDrive\Desktop\Tracker\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

### Building the Backend

If you need to build the backend JAR file first:
```bash
cd backend
C:\Users\ayush\OneDrive\Desktop\Tracker\apache-maven-3.9.6\bin\mvn.cmd clean package -DskipTests
```

Then run the JAR:
```bash
java -jar target\prep-tracker-backend-1.0.0.jar
```

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

The application uses an **H2 file-based database** stored at `backend/data/preptracker.mv.db`. All your data (tabs, items, checklist, applications) is automatically persisted and will be available between sessions.

You can access the H2 database console at **http://localhost:8080/h2-console** when the backend is running.

## License

MIT License - feel free to use and modify for your own projects!

