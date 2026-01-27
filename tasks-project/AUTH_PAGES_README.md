# מערכת ניהול משימות - Angular 20

## סטטוס הפרויקט - שלב 1 הושלם ✅

### מה הושלם:

#### 1. תשתית אבטחה ואימות (Authentication)
- ✅ מודלים: User, AuthResponse
- ✅ Auth Service עם Angular Signals
- ✅ Auth Interceptor (מוסיף Authorization headers)
- ✅ Auth Guard (הגנה על נתיבים)
- ✅ Environment configuration

#### 2. רכיבי ממשק (Components)
- ✅ **עמוד התחברות (Login)** - [/auth/login](http://localhost:4200/auth/login)
  - טופס עם אימייל וסיסמה
  - ולידציות
  - הצגת שגיאות
  - עיצוב מודרני עם Material Design

- ✅ **עמוד הרשמה (Register)** - [/auth/register](http://localhost:4200/auth/register)
  - טופס עם שם, אימייל, סיסמה ואימות סיסמה
  - ולידציות כולל התאמת סיסמאות
  - הצגת שגיאות
  - עיצוב מודרני עם Material Design

- ✅ **עמוד בית (Home)** - [/auth/home](http://localhost:4200/home)
  - מוגן ע"י Auth Guard
  - הצגת שם המשתמש
  - כפתור התנתקות

#### 3. תשתית
- ✅ Angular Material Modules
- ✅ Routing מוגדר
- ✅ HTTP Interceptor פעיל
- ✅ אנימציות

---

## הוראות הפעלה

### 1. התקנת תלויות
\`\`\`bash
npm install
\`\`\`

### 2. הפעלת השרת
\`\`\`bash
npm start
\`\`\`

האפליקציה תהיה זמינה בכתובת: [http://localhost:4200](http://localhost:4200)

---

## ניווט באפליקציה

- **התחברות**: [http://localhost:4200/auth/login](http://localhost:4200/auth/login)
- **הרשמה**: [http://localhost:4200/auth/register](http://localhost:4200/auth/register)
- **עמוד בית**: [http://localhost:4200/home](http://localhost:4200/home) (דורש אימות)

---

## טכנולוגיות

- **Angular 20** - Framework
- **Angular Material 20** - UI Components
- **Angular Signals** - State Management
- **RxJS** - Reactive Programming
- **TypeScript** - Programming Language
- **SCSS** - Styling

---

## מבנה הקוד

\`\`\`
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          # הגנה על נתיבים
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # הוספת JWT לבקשות
│   ├── services/
│   │   └── auth.service.ts        # ניהול אימות
│   └── models/
│       ├── user.model.ts          # מודל משתמש
│       └── auth-response.model.ts # מודל תגובת שרת
├── features/
│   └── auth/
│       ├── login/                 # רכיב התחברות
│       ├── register/              # רכיב הרשמה
│       └── auth.routes.ts         # נתיבי אימות
├── home/
│   └── home.component.ts          # עמוד בית
├── shared/
│   └── material.module.ts         # Material modules
└── environments/
    ├── environment.ts             # הגדרות סביבה
    └── environment.development.ts
\`\`\`

---

## שלבים הבאים (לא מומש)

עמודים שיווספו בשלבים הבאים:
1. ❌ ניהול קבוצות (Teams)
2. ❌ ניהול פרויקטים (Projects)
3. ❌ לוח משימות (Task Board)
4. ❌ פרטי משימה
5. ❌ תגובות למשימות

---

## הערות חשובות

⚠️ **דרישה: שרת Backend**
- האפליקציה מצפה לשרת Node.js ב: \`http://localhost:3000\`
- נתיבים נדרשים:
  - \`POST /api/auth/register\` - הרשמה
  - \`POST /api/auth/login\` - התחברות
  - Authorization: Bearer Token

⚠️ **ללא שרת Backend פעיל, פונקציות האימות לא יעבדו**

---

## Features מיושמים

### Angular Signals
- ✅ \`currentUser\` signal - מצב המשתמש המחובר
- ✅ \`isAuthenticated\` computed - האם המשתמש מחובר

### Reactive Forms
- ✅ FormBuilder
- ✅ Validators (required, email, minLength)
- ✅ Custom Validators (password match)
- ✅ Error handling ותצוגת שגיאות

### Material Design
- ✅ Cards
- ✅ Form Fields
- ✅ Buttons
- ✅ Icons
- ✅ Snackbars
- ✅ Progress Spinner
- ✅ Toolbar

### Routing
- ✅ Lazy Loading
- ✅ Route Guards
- ✅ Redirects
- ✅ Query Parameters

---

## ליצור קשר / תמיכה

הפרויקט נוצר לפי התכנון במסמך \`plan-angularTaskManagement.md\`

**סטטוס**: שלב 1 הושלם בהצלחה ✅
**גרסה**: 0.1.0
**תאריך**: ינואר 2026
