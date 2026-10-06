# Student Event Tracker

> A lightweight browser-based event tracker for students to manage exams, assignments, and deadlines.

![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📌 Overview
Student Event Tracker is a simple tool designed to help students organize their academic schedules. It tracks upcoming exams, assignment deadlines, and study meetings, automatically calculating the remaining days and providing visual urgency indicators to keep you on track.

## ✨ Key Features
- **Add, Edit & Delete:** Easily manage your academic events.
- **Smart Sorting:** Events are automatically sorted chronologically.
- **Countdown & Urgency:** Calculates days left and highlights urgent or overdue items.
- **Categorization:** Filter events by type (Exams, Deadlines, Meetings, Social).
- **Persistent Storage:** Saves your data directly in your browser using `localStorage`.

## 🛠 Tech Stack
- **Core Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Wrapper:** A Next.js scaffold is currently used solely as a wrapper to serve the application via a Python HTTP server during development.

## 📂 Project Structure
```text
student-event-tracker/
├── sol6.1/              # Core vanilla JS application source code
│   ├── index.html       
│   ├── script.js        
│   ├── style.css        
│   └── EXPLANATION.md   
├── app/                 # Next.js wrapper (optional/unused in core logic)
└── package.json         # Project dependencies and scripts
```

## 🚀 Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/jenish30503/student-event-tracker.git
   cd student-event-tracker
   ```
2. **Install Dependencies:**
   ```bash
   pnpm install
   ```
3. **Run the Development Server:**
   ```bash
   pnpm run dev
   ```
   This will start a local Python HTTP server serving the core app from the `sol6.1` directory.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---
*Created by [jenish30503](https://github.com/jenish30503)*
