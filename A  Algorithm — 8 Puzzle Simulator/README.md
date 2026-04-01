<div align="center">

# 🧩 A* Algorithm — 8 Puzzle Simulator

### An Interactive Visual Walkthrough of the A* Search Algorithm

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**· Artificial Intelligence**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-blue?style=for-the-badge)](https://rajeshkanaka.github.io/A-Star-8-Puzzle/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/rajeshkanaka/A-Star-8-Puzzle)

<br/>

```
┌───┬───┬───┐         ┌───┬───┬───┐
│ 2 │ 8 │ 3 │         │ 1 │ 2 │ 3 │
├───┼───┼───┤   A*    ├───┼───┼───┤
│ 1 │ 6 │ 4 │  ───►   │ 8 │   │ 4 │
├───┼───┼───┤         ├───┼───┼───┤
│ 7 │   │ 5 │         │ 7 │ 6 │ 5 │
└───┴───┴───┘         └───┴───┴───┘
  Initial State          Goal State
```

<br/>

[🚀 Getting Started](#-getting-started) · [✨ Features](#-features) · [🧠 How It Works](#-how-the-a-algorithm-works) · [⌨️ Controls](#️-keyboard-shortcuts) · [📁 Project Structure](#-project-structure)

---

</div>

## 📖 About

This project is a **fully interactive, browser-based simulator** that visualizes the **A\* (A-Star) search algorithm** solving the classic **8-Puzzle problem** — a fundamental topic in Artificial Intelligence coursework.

Instead of just reading about OPEN lists, CLOSED lists, and heuristic functions in a textbook, this simulator lets you **watch the algorithm think**, step by step, with rich visual feedback and real-time explanations.

> **Built for** students of Savitribai Phule Pune University (SPPU) **Artificial Intelligence**.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Core Functionality
- **Step-by-step execution** of the A* algorithm
- **Animated auto-solve** with configurable playback
- **Real-time OPEN & CLOSED list** visualization
- **Solution path tracking** with move history
- **Progress bar** showing algorithm advancement

</td>
<td width="50%">

### 🎨 Design & UX
- **🌗 Light/Dark mode** with system preference detection
- **Responsive layout** — works on desktop, tablet & mobile
- **Tile animations** — pop effects on tile moves
- **🎉 Celebration animation** when the puzzle is solved
- **Color-coded cost values** — `g(n)`, `h(n)`, `f(n)`

</td>
</tr>
</table>

### 🔍 Educational Highlights

| Feature | Description |
|---|---|
| **Live Explanation Panel** | Every single step is narrated in plain English — what the algorithm is doing and *why* |
| **Mini-Grid Previews** | Each state in the OPEN/CLOSED list shows a tiny visual grid so you can see the board layout |
| **Cost Breakdown** | Each state displays its `g(n)`, `h(n)`, and `f(n)` values with distinct color coding |
| **Heuristic Visualization** | Tiles are colored 🟢 **green** (correct position) or 🔵 **blue/dark** (misplaced) in real-time |
| **Move Highlighting** | The most recently moved tile gets a distinct animation and glow |

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- *(Optional)* [Node.js](https://nodejs.org/) — only if you want to use a local server

### Option 1 — Just Open It (Simplest)

```bash
# Simply double-click index.html or open it in your browser
open index.html
```

### Option 2 — Local Development Server

```bash
# Clone the repository
git clone https://github.com/rajeshkanaka/A-Star-8-Puzzle.git
cd A-Star-8-Puzzle

# Serve with any static file server
npx -y http-server . -p 8080

# Open in browser
open http://localhost:8080
```

> 💡 **Tip:** A local server is recommended to avoid potential CORS issues with some browsers.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|:---:|---|
| `→` / `↓` | Advance to the next algorithm step |
| `Enter` | Auto-solve with animation |
| `R` | Reset the simulation |

---

## 🧠 How the A* Algorithm Works

The A* algorithm uses an **evaluation function** to determine the most promising state to explore next:

```
f(n) = g(n) + h(n)
```

| Symbol | Meaning | In This Simulator |
|:---:|---|---|
| **g(n)** | Cost from start to current state | Number of tile moves made so far |
| **h(n)** | Heuristic estimate to goal | Count of misplaced tiles (excluding blank) |
| **f(n)** | Total estimated cost | Sum of g(n) + h(n) — lower is better |

### Algorithm Flow

```
┌─────────────────────────────────────────────────┐
│  1. Place initial state in OPEN list            │
│  2. Pick state with lowest f(n) from OPEN       │
│  3. Move it to CLOSED list                      │
│  4. If it's the GOAL → Done! 🎉                 │
│  5. Generate neighbors (slide tiles)            │
│  6. For each neighbor not in CLOSED:            │
│     → Calculate g(n), h(n), f(n)                │
│     → Add to OPEN list                          │
│  7. Repeat from step 2                          │
└─────────────────────────────────────────────────┘
```

### Why A* is Optimal

The **misplaced tiles heuristic** is **admissible** — it never overestimates the true cost to reach the goal. This guarantees that A* finds the **optimal (shortest) solution path**.

---

## 📁 Project Structure

```
A* Algorithm — 8 Puzzle Simulator/
│
├── index.html       # Main HTML structure & semantic markup
├── style.css        # Complete design system with CSS custom properties
├── app.js           # A* algorithm engine + UI rendering logic
└── README.md        # You are here!
```

| File | Lines | Description |
|---|:---:|---|
| `index.html` | 223 | Semantic HTML5 with accessible SVG icons, dark mode toggle, and responsive layout |
| `style.css` | 674 | Full design token system, light/dark themes, animations, and mobile breakpoints |
| `app.js` | 501 | Pure JS implementation — A* solver, step replay engine, and DOM rendering |

---

## 🎨 Design System

The UI is built on a **CSS custom property design token architecture** for maximum maintainability:

```css
/* Typography */
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Color-coded algorithm values */
--color-g: #2563eb;   /* 🔵 g(n) — path cost     */
--color-h: #d97706;   /* 🟠 h(n) — heuristic      */
--color-f: #7c3aed;   /* 🟣 f(n) — total estimate  */
```

### Theme Support

| | Light Mode | Dark Mode |
|---|---|---|
| **Background** | `#f4f6f9` | `#0f1419` |
| **Surface** | `#ffffff` | `#1a2332` |
| **Primary** | `#2563eb` | `#60a5fa` |
| **Accent** | `#059669` | `#34d399` |

The theme automatically detects your system preference via `prefers-color-scheme` and can be toggled manually with the 🌙/☀️ button in the header.

---

## 🔧 Technical Details

- **Zero dependencies** — Pure HTML, CSS, and JavaScript
- **No build step** — Open `index.html` and it just works
- **Pre-computed solution** — The A* algorithm runs on page load and records every step, enabling instant step-by-step replay
- **~1,400 total lines of code** across 3 files
- **Accessible** — Proper ARIA labels, semantic HTML, keyboard navigation

---

## 📚 References

| Resource | Description |
|---|---|
| [A* Search Algorithm — Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm) | Comprehensive overview of the A* algorithm |
| [8-Puzzle Problem — GeeksforGeeks](https://www.geeksforgeeks.org/8-puzzle-problem-using-branch-and-bound/) | 8-Puzzle solved with various search strategies |
| [SPPU Syllabus — AI (310253)](http://www.unipune.ac.in/) | Official SPPU Third Year Computer Engineering syllabus |
| [Artificial Intelligence: A Modern Approach](https://aima.cs.berkeley.edu/) | Russell & Norvig — the definitive AI textbook |

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas for improvement:

- [ ] Add **Manhattan Distance** heuristic as an alternative to misplaced tiles
- [ ] Allow **custom initial states** via user input
- [ ] Add a **tree visualization** showing the search space explored
- [ ] Implement **algorithm comparison** (BFS vs DFS vs A*)
- [ ] Add **step-back** functionality to revisit previous steps

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ for SPPU AI**

*Subject Code: 310253 · Artificial Intelligence*

<br/>

⭐ **Star this repo if it helped you understand A\* better!** ⭐

</div>	
