# PrepTracker Backend

A Spring Boot REST API backend for the PrepTracker application with MongoDB database.

## Prerequisites

- **Java 17+** - [Download JDK](https://adoptium.net/)
- **Maven 3.6+** - [Download Maven](https://maven.apache.org/download.cgi)
- **MongoDB 6.0+** - [Download MongoDB](https://www.mongodb.com/try/download/community)

## Quick Start

### 1. Start MongoDB

Make sure MongoDB is running on `localhost:27017` (default port).

**Windows:**
```bash
# If installed as a service, it should already be running
# Or start manually:
mongod
```

**Mac (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 2. Run the Application

Navigate to the backend directory and run:

```bash
cd backend

# Using Maven Wrapper (recommended)
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run

# Or using Maven directly
mvn spring-boot:run
```

The server will start on **http://localhost:8080**

## API Endpoints

### Tabs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tabs` | Get all tabs |
| GET | `/api/tabs/with-data` | Get all tabs with their items/subtopics |
| GET | `/api/tabs/{id}` | Get tab by ID |
| GET | `/api/tabs/{id}/with-data` | Get tab with all data |
| GET | `/api/tabs/{id}/progress` | Get tab progress percentage |
| POST | `/api/tabs` | Create a new tab |
| PUT | `/api/tabs/{id}` | Update a tab |
| DELETE | `/api/tabs/{id}` | Delete a tab |

### Subtopics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subtopics/tab/{tabId}` | Get subtopics by tab ID |
| GET | `/api/subtopics/tab/{tabId}/with-items` | Get subtopics with items |
| GET | `/api/subtopics/{id}` | Get subtopic by ID |
| POST | `/api/subtopics` | Create a subtopic |
| PUT | `/api/subtopics/{id}` | Update a subtopic |
| DELETE | `/api/subtopics/{id}` | Delete a subtopic |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| GET | `/api/items/{id}` | Get item by ID |
| GET | `/api/items/tab/{tabId}` | Get items by tab ID |
| GET | `/api/items/subtopic/{subtopicId}` | Get items by subtopic ID |
| POST | `/api/items` | Create an item |
| PUT | `/api/items/{id}` | Update an item |
| PATCH | `/api/items/{id}/toggle` | Toggle item completion |
| DELETE | `/api/items/{id}` | Delete an item |

### Checklist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/checklist` | Get all checklist items |
| GET | `/api/checklist/{id}` | Get checklist item by ID |
| POST | `/api/checklist` | Create a checklist item |
| PUT | `/api/checklist/{id}` | Update a checklist item |
| PATCH | `/api/checklist/{id}/toggle` | Toggle completion |
| DELETE | `/api/checklist/{id}` | Delete a checklist item |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | Get all applications |
| GET | `/api/applications/{id}` | Get application by ID |
| GET | `/api/applications/status/{status}` | Get by status |
| GET | `/api/applications/search?company=` | Search by company |
| POST | `/api/applications` | Create an application |
| PUT | `/api/applications/{id}` | Update an application |
| PATCH | `/api/applications/{id}/status` | Update status only |
| DELETE | `/api/applications/{id}` | Delete an application |

### Activity Log
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity` | Get all activity logs |
| GET | `/api/activity/date/{date}` | Get logs by date |
| GET | `/api/activity/range?startDate=&endDate=` | Get logs by date range |
| GET | `/api/activity/tab/{tabId}` | Get logs by tab |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/dashboard/export` | Export all data |

### Cache Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/api/cache` | Clear all caches |
| DELETE | `/api/cache/{cacheName}` | Clear specific cache |
| DELETE | `/api/cache/tabs` | Clear tab-related caches |
| DELETE | `/api/cache/items` | Clear item-related caches |

## Sample Request Bodies

### Create Tab
```json
{
  "name": "Python",
  "icon": "Code2",
  "color": "#3776ab",
  "hasSubtopics": false
}
```

### Create Subtopic
```json
{
  "name": "Recursion",
  "color": "#ff6b9d",
  "tabId": "tab_id_here"
}
```

### Create Item
```json
{
  "title": "Quick Sort",
  "content": "# Quick Sort\\n\\nDivide and conquer sorting algorithm.",
  "code": "function quickSort(arr) { ... }",
  "codeLanguage": "javascript",
  "tabId": "tab_id_here",
  "subtopicId": "subtopic_id_here"
}
```

### Create Checklist Item
```json
{
  "text": "Complete 100 LeetCode problems"
}
```

### Create Application
```json
{
  "company": "Microsoft",
  "role": "Software Engineer",
  "status": "APPLIED",
  "date": "2024-01-20",
  "notes": "Applied through referral",
  "url": "https://careers.microsoft.com/..."
}
```

## Caching

The backend uses a **two-level caching strategy**:

### 1. Caffeine Cache (Default - In-Memory)
- Fast, local in-memory cache
- No external dependencies required
- Best for single-instance deployments
- Configured TTLs: 2-30 minutes depending on data type

### 2. Redis Cache (Optional - Distributed)
- Distributed cache for multi-instance deployments
- Requires Redis server running on `localhost:6379`
- Enables cache sharing across multiple backend instances

### Cache Configuration

To switch between cache types, edit `application.properties`:

```properties
# Use Caffeine (default, in-memory)
spring.cache.type=caffeine

# Or use Redis (distributed)
spring.cache.type=redis
```

### Cache Names & TTLs

| Cache | Default TTL | Description |
|-------|-------------|-------------|
| `tabs` | 30 min | Tab list |
| `tabData` | 5 min | Tab with all items |
| `subtopics` | 15 min | Subtopic list |
| `items` | 5 min | Item list |
| `checklist` | 10 min | Checklist items |
| `applications` | 15 min | Job applications |
| `dashboard` | 2 min | Dashboard stats |
| `activity` | 5 min | Activity logs |

### Manual Cache Clearing

```bash
# Clear all caches
curl -X DELETE http://localhost:8080/api/cache

# Clear specific cache
curl -X DELETE http://localhost:8080/api/cache/dashboard
```

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server port
server.port=8080

# MongoDB connection
spring.data.mongodb.uri=mongodb://localhost:27017/preptracker
spring.data.mongodb.database=preptracker

# Redis connection (for distributed caching)
spring.data.redis.host=localhost
spring.data.redis.port=6379

# Cache type: 'caffeine' (in-memory) or 'redis' (distributed)
spring.cache.type=caffeine
```

## Project Structure

```
backend/
├── src/main/java/com/preptracker/
│   ├── PrepTrackerApplication.java    # Main entry point
│   ├── config/
│   │   ├── CorsConfig.java            # CORS configuration
│   │   ├── MongoConfig.java           # MongoDB configuration
│   │   ├── GlobalExceptionHandler.java # Error handling
│   │   └── DataInitializer.java       # Sample data seeder
│   ├── controller/
│   │   ├── TabController.java
│   │   ├── SubtopicController.java
│   │   ├── ItemController.java
│   │   ├── ChecklistController.java
│   │   ├── ApplicationController.java
│   │   ├── ActivityLogController.java
│   │   └── DashboardController.java
│   ├── dto/
│   │   ├── DashboardStats.java
│   │   ├── SubtopicWithItems.java
│   │   ├── TabWithData.java
│   │   └── FullDataExport.java
│   ├── model/
│   │   ├── Tab.java
│   │   ├── Subtopic.java
│   │   ├── Item.java
│   │   ├── ChecklistItem.java
│   │   ├── Application.java
│   │   └── ActivityLog.java
│   ├── repository/
│   │   └── ...Repository.java
│   └── service/
│       └── ...Service.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Development

### Build
```bash
mvn clean package
```

### Run Tests
```bash
mvn test
```

### Run with Debug
```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"
```

## Docker (Optional)

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

Build and run:
```bash
mvn clean package -DskipTests
docker build -t preptracker-backend .
docker run -p 8080:8080 preptracker-backend
```

