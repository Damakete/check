# ✅ Check - React Task Management App

A modern task management app built with React, Vite, and Tailwind CSS. It allows users to add, complete, and delete tasks in a clean and interactive interface.

---

## 🧠 Project Description

### 🎯 Goal
Provide users with a simple, intuitive interface to manage tasks with real-time feedback and responsive UI.

### 👥 Target Audience
Individuals seeking a lightweight, fast, and modern to-do list — perfect for students, professionals, or personal productivity.

### 🚀 Features
- ✅ Add new tasks
- ✅ Delete existing tasks
- ✅ Mark tasks as completed
- ✅ Responsive and dynamic interface with visual feedback
- ✅ Styled using Tailwind CSS

---

## ⚙️ Technologies Used

| Technology     | Purpose                                 |
|----------------|------------------------------------------|
| **React**      | UI component structure and interactivity |
| **Vite**       | Super-fast development/build tool        |
| **TailwindCSS**| Utility-first CSS framework              |
| **ESLint**     | Code linting for better quality          |
| **React Hooks**| State and side-effect management         |
| **Git + GitHub** | Version control and project hosting     |

---

## 🧑‍💻 Getting Started

1. **Clone the repository**:

```bash
git clone https://github.com/Damakete/check.git
cd check
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run the app in development (both backend and frontend/check)**:

```bash
npm run dev
```

4. **Build for production**:

```bash
npm run build
```

---

## 🧪 Testing (Manual)

### ✅ Test Plan

| Function              | Expected Result                             | Status |
|-----------------------|----------------------------------------------|--------|
| Add Task              | Task is appended to the list                | ✅     |
| Prevent empty task    | Empty input is ignored                      | ✅     |
| Mark task as complete | Task gets visual strike-through             | ✅     |
| Delete task           | Task is removed from the list               | ✅     |
| UI responsiveness     | Works on desktop and mobile                 | ✅     |
| Download task reports | Be able to download an Excel report file    | ✅     |

Tested on:
- Chrome (desktop + mobile emulation)
- Firefox
- Edge

---

## 🧠 Algorithm & Data Structure

- React `useState` hook is used to manage a **list (array)** of task objects.
- Basic logic includes:
  - Dynamic rendering with `.map()`
  - Filtering and conditional rendering
  - Updating states without mutation (immutability)

---

## 📄 Future Improvements

- Persist tasks with `localStorage` or backend
- Filter by completed / pending
- Task priority levels
- Dark mode support
- Drag & drop reordering

---

## 👨‍🏫 Author

Developed by **@Damakete**  
Licensed under the **MIT License**

---
