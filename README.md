# 🎓 Student Management System (Admin + Student Portal)

This is a full-stack web application for managing students, courses, and enrollments. It supports authentication for both **admin** and **student** roles, role-based routing, and secure CRUD operations on all entities.

Built with:

- ⚡ [Next.js 14](https://nextjs.org/)
- 🧪 [Supabase](https://supabase.com/) (PostgreSQL)
- 🧑‍💻 React Table (for dynamic data tables)
- 🎨 Tailwind CSS (via shadcn/ui)
- 🔒 HTTP-only cookies for authentication
- 🧠 Zod for schema validation

---

## ✨ Features

- ✅ Admin & Student login
- ✅ Role-based routing middleware
- ✅ Dashboard metrics
- ✅ CRUD operations for:
  - Students
  - Courses
  - Enrollments
  - Admins
- ✅ Secure HTTP-only session management
- ✅ Clean modular API routes
- ✅ Server-side data fetching with `no-store` caching
- ✅ Supabase relational joins (e.g., `student -> enrollments -> course`)
- ✅ Error boundaries and graceful fallbacks

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/prathamdedhiya17/studentManagementSystem.git
cd studentManagementSystem-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Development Server

```bash
npm run dev
```
Visit `http://localhost:3000` to see the app.

### 5. Build for Production
```bash
npm run build
```


---
## 🗃️ Folder Structure
```
app/
  ├── admin                    		# Admin Pages
  ├── student                    	# Student Pages
  ├── api/ admin                    # API routes (REST-style)
  │    		└── students/
  │    		└── courses/
  │    		└── enrollmentData/
  │    		└── adminUsers/
  │    		└── route.ts		    # Dashboard Route
  ├── student/                 # Student dashboard page
  └── login/                   # Shared login route
  └── logout/                  # logout route

components/                    # Reusable UI components
lib/                           # Supabase client
utils/                         # Custom Hooks and Loading Utils
middleware.ts                  # Role-based route enforcement
```

---
## 🧪 Test Users

### Admin:

-   **Email:** `admin@sms.com`
    
-   **Password:** `Admin@123`
    

### Student:

-   **Email:** `alice@sms.com`
    
-   **Password:** `Alice@123`

---

## Contributors
- Pratham Dedhiya (pdedhiya)
- Nitin Tewari (nitewari)


## License
This project is built as part of **SP25: APPLIED DATABASE TECHNOLOGIES: 10430** (Spring 2025), Indiana University Bloomington.