<div align="center">

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                          HERO SECTION                                  -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

<br>

```
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║          ◆  P R I M ' S   M S T   ◆                      ║
    ║          Interactive Simulation Engine                     ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
```

<br>

<img src="https://img.shields.io/badge/Algorithm-Prim's_MST-059669?style=for-the-badge&logo=graphql&logoColor=white" alt="Prim's MST">
<img src="https://img.shields.io/badge/Type-Interactive_Simulation-2563eb?style=for-the-badge&logo=webcomponentsdotorg&logoColor=white" alt="Interactive">
<img src="https://img.shields.io/badge/Stack-Vanilla_JS_+_CSS-f59e0b?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JS">
<img src="https://img.shields.io/badge/Theme-Light_%26_Dark-7c3aed?style=for-the-badge&logo=css3&logoColor=white" alt="Themes">
<img src="https://img.shields.io/badge/Zero-Dependencies-dc2626?style=for-the-badge&logo=npm&logoColor=white" alt="Zero Dependencies">

<br><br>

**A breathtaking, zero-dependency interactive simulation** that teaches Prim's Minimum Spanning Tree algorithm step by step — with animated graph visualizations, real-time state tracking, and a built-in educational walkthrough.

*Built for SPPU Third Year AI Lab (310253) | Semester VI*

<br>

---

<br>

**[`LIVE DEMO`](https://rajeshkanaka.github.io/Prims-MST-Interactive-Simulation/)**&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;**[`FEATURES`](#-features)**&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;**[`HOW IT WORKS`](#-how-it-works)**&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;**[`KEYBOARD SHORTCUTS`](#-keyboard-shortcuts)**&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;**[`TECH`](#-tech-stack)**

<br>

</div>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                           HIGHLIGHTS                                   -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Highlights

<table>
<tr>
<td width="50%">

### 🎨 Light Mode
Crisp, clean interface with a professional educational palette — deep blues, emerald greens, and warm amber highlights.

</td>
<td width="50%">

### 🌙 Dark Mode
Gorgeous dark theme that respects your system preference — every color, shadow, and accent retuned for dark backgrounds.

</td>
</tr>
</table>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                            FEATURES                                    -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Features

<table>
<tr>
<td width="60">🔬</td>
<td><strong>Step-by-Step Execution</strong><br>Walk through Prim's algorithm one edge at a time. Each step explains <em>what</em> is happening and <em>why</em>.</td>
</tr>
<tr>
<td>🎬</td>
<td><strong>Animated Auto-Solve</strong><br>Hit <kbd>Enter</kbd> and watch the algorithm solve itself with timed 1.2-second transitions between steps.</td>
</tr>
<tr>
<td>📊</td>
<td><strong>Live State Panels</strong><br>Real-time tracking of MST Set, Candidate Edges (sorted by weight), Solution Path, and running MST weight.</td>
</tr>
<tr>
<td>🎯</td>
<td><strong>SVG Graph Visualization</strong><br>Nodes glow as they join the MST. Candidate edges pulse with dashed orange lines. Selected edges blaze blue with a glow filter.</td>
</tr>
<tr>
<td>📖</td>
<td><strong>Built-In Learning Module</strong><br>6 expandable concept cards teach Greedy Algorithms, Spanning Trees, MST, and Prim's algorithm — all before you touch the simulation.</td>
</tr>
<tr>
<td>⌨️</td>
<td><strong>Full Keyboard Control</strong><br>Arrow keys, Enter, R, S — every action is keyboard-accessible for power users and accessibility.</td>
</tr>
<tr>
<td>🌗</td>
<td><strong>Light/Dark Theme Toggle</strong><br>One-click theme switching with system preference auto-detection. Every element recolors seamlessly.</td>
</tr>
<tr>
<td>📱</td>
<td><strong>Fully Responsive (4 Breakpoints)</strong><br>960px tablet, 700px small tablet, 600px phone, and 390px small phone — with touch-optimized targets (48px min), reduced padding, and compact layouts at every size.</td>
</tr>
<tr>
<td>⚡</td>
<td><strong>Zero Dependencies</strong><br>Pure HTML + CSS + JavaScript. No frameworks, no build tools, no npm. Just open the file.</td>
</tr>
</table>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                          HOW IT WORKS                                  -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ How It Works

<div align="center">

```
                              THE GRAPH
                          ╭─────────────╮
                     4    │             │    
                A ────── B              │    
                │ ╲    ╱ │              │    
              4 │  2  ╱  │ 3            │    
                │  ╱     │              │    
                C ────── D              │    
                │ ╲    ╱ │              │    
              6 │  5 7   │ 8            │    
                │    ╲   │              │    
                E ────── F              │    
                     9    │             │    
                          ╰─────────────╯

              6 Vertices  ·  10 Edges
```

</div>

### Prim's Algorithm — The Greedy Strategy

> *"Always pick the cheapest edge that reaches a new vertex."*

| Step  | Action                                              | Edge Selected | New Vertex | MST Weight |
|:-----:|-----------------------------------------------------|:-------------:|:----------:|:----------:|
| **0** | Initialize with vertex A                            |       —       |     A      |   **0**    |
| **1** | Pick cheapest from {A-B(4), A-C(4)}                 |  `A → B (4)`  |     B      |   **4**    |
| **2** | Pick cheapest from {A-C(4), B-C(2), B-D(3), B-E(5)} |  `B → C (2)`  |     C      |   **6**    |
| **3** | Pick cheapest from {B-D(3), B-E(5), C-D(1), C-E(6)} |  `C → D (1)`  |     D      |   **7**    |
| **4** | Pick cheapest from {B-E(5), C-E(6), D-E(7), D-F(8)} |  `B → E (5)`  |     E      |   **12**   |
| **5** | Pick cheapest from {D-F(8), E-F(9)}                 |  `D → F (8)`  |     F      |   **20**   |

<div align="center">

```
              ╔══════════════════════════════════════════╗
              ║                                          ║
              ║   MST EDGES: A-B(4) B-C(2) C-D(1)       ║
              ║              B-E(5) D-F(8)               ║
              ║                                          ║
              ║   TOTAL WEIGHT: 20  ✓  OPTIMAL           ║
              ║                                          ║
              ╚══════════════════════════════════════════╝
```

</div>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                       KEYBOARD SHORTCUTS                               -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Keyboard Shortcuts

<div align="center">

|             Key              | Action                                       |
|:----------------------------:|----------------------------------------------|
| <kbd>→</kbd> or <kbd>↓</kbd> | Next Step                                    |
|       <kbd>Enter</kbd>       | Solve Completely (animated)                  |
|         <kbd>R</kbd>         | Reset Simulation                             |
|         <kbd>S</kbd>         | Start Simulation (collapse learning section) |

</div>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                          QUICK START                                   -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Quick Start

```bash
# Clone or download this folder, then simply open in your browser:
open index.html

# Or serve locally for the full experience:
python3 -m http.server 8765
# Then visit → http://localhost:8765
```

> **That's it.** No `npm install`. No build step. No config files. Just HTML, CSS, and JS working in harmony.

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                          TECH STACK                                    -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Tech Stack

<div align="center">

|     Layer     | Technology                               | Purpose                                                  |
|:-------------:|------------------------------------------|----------------------------------------------------------|
| **Structure** | HTML5 Semantic                           | Accessible, screen-reader-friendly markup                |
|  **Styling**  | CSS Custom Properties + Fluid Typography | Design tokens, `clamp()` scaling, theme system           |
| **Graphics**  | Inline SVG                               | Animated graph with glow filters and CSS transitions     |
|   **Logic**   | Vanilla JavaScript (IIFE)                | Zero-dependency algorithm engine with pre-computed steps |
|   **Fonts**   | Inter + JetBrains Mono                   | Professional body text + crisp monospace for code/data   |

</div>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                         PROJECT STRUCTURE                              -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Project Structure

```
Prim's MST Algorithm — Interactive Simulation/
│
├── index.html          → Main entry point with full page structure
│                         Educational section (6 concept cards) +
│                         Simulation section (graph + controls + panels)
│
├── style.css           → 1,128 lines of hand-crafted CSS
│                         Design tokens · Light/Dark themes · Fluid typography
│                         Graph edge animations · Responsive breakpoints
│
├── app.js              → 622 lines of pure JavaScript
│                         Prim's algorithm engine · SVG graph renderer
│                         Step-by-step state management · Keyboard controls
│
└── README.md           → You are here ✦
```

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                        VISUAL LANGUAGE                                 -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Visual Language

The simulation uses a carefully designed color system to encode algorithm state:

<div align="center">

| Element                |    Color    | Meaning                                 |
|------------------------|:-----------:|-----------------------------------------|
| 🟢 Green nodes         |  `#059669`  | Vertices already in the MST             |
| ⚪ Gray nodes           |  `#94a3b8`  | Vertices not yet in the MST             |
| 🟠 Orange dashed edges |  `#d97706`  | Candidate edges (available to pick)     |
| 🔵 Blue glowing edge   |  `#2563eb`  | Currently selected cheapest edge        |
| 🟢 Green thick edges   |  `#059669`  | Edges that are part of the final MST    |
| ⚫ Faded edges          | 30% opacity | Discarded edges (both endpoints in MST) |

</div>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                        LEARNING MODULE                                 -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Built-In Learning Module

Before the simulation, students encounter **6 progressive concept cards**:

```
┌─ 1. What is a Greedy Algorithm?      ← Foundation concept
├─ 2. What is a Spanning Tree?         ← Graph theory basics + mini SVG demo
├─ 3. What is a Minimum Spanning Tree? ← The optimization goal
├─ 4. Prim's Algorithm Steps           ← Step-by-step breakdown
├─ 5. Key Terms: MST Set vs Candidates ← Algorithm state explained
└─ 6. Why is Prim's Greedy?            ← Connecting it all together
```

Each card includes:
- **Clear definitions** with bold key terms
- **Everyday analogies** (shopping, road networks) in amber callout boxes
- **Visual examples** with inline SVG graphs
- **Key insight callouts** in blue highlight boxes

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                         COMPLEXITY                                     -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Algorithm Complexity

<div align="center">

| Metric                 |               Value                |
|------------------------|:----------------------------------:|
| **Time Complexity**    | \(O(V^2)\) — simple adjacency scan |
| **Space Complexity**   |            \(O(V + E)\)            |
| **Vertices**           |          6 (A through F)           |
| **Edges**              |     10 (weighted, undirected)      |
| **MST Edges**          |             5 (V - 1)              |
| **Optimal MST Weight** |               **20**               |

</div>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                         BROWSER SUPPORT                                -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Browser Support

<div align="center">

|    Browser    |     Status      |
|:-------------:|:---------------:|
|  Chrome 90+   | Fully Supported |
|  Firefox 90+  | Fully Supported |
|  Safari 15+   | Fully Supported |
|   Edge 90+    | Fully Supported |
| Mobile Chrome | Fully Supported |
| Mobile Safari | Fully Supported |

</div>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                            CREDITS                                     -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

## ✦ Academic Context

<div align="center">

|                     |                                             |
|---------------------|---------------------------------------------|
| **University**      | Savitribai Phule Pune University (SPPU)     |
| **Program**         | B.E. Artificial Intelligence & Data Science |
| **Year / Semester** | Third Year / Semester VI                    |
| **Subject Code**    | 310253 — Artificial Intelligence            |
| **Lab Component**   | Greedy Search — Prim's MST Algorithm        |

</div>

<br>

<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!--                            FOOTER                                      -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

<div align="center">

---

<br>

```
     ◆ ─── ◆ ─── ◆
     │             │
     ◆      ◆      ◆
      \   / | \   /
       ◆ ──┼── ◆
           ◆
```

<sub>

**Prim's MST Algorithm — Interactive Simulation**
*Where greedy meets optimal.*

Made with precision for the love of algorithms.

</sub>

<br>

</div>
