# SPPU AI Algorithms — Simple Pseudocode & Explanations

> **Subject:** 310253 — Artificial Intelligence | Third Year | Semester VI
>
> Three algorithms explained in plain English with step-by-step pseudocode.

---

## 1. Prim's MST Algorithm (Unit 2 — Greedy Search)

### What it does
Finds the **cheapest way to connect all nodes** in a graph. Like building roads between villages using the least total cost.

### Plain English Steps
1. Pick any starting node. Add it to your "connected" group.
2. Look at ALL edges going from your connected group to nodes NOT yet connected.
3. Pick the **cheapest** edge.
4. Add that edge and the new node to your connected group.
5. Repeat steps 2-4 until every node is connected.

### Pseudocode

```
PRIM'S ALGORITHM (Graph G, Start node s)
─────────────────────────────────────────
MST = empty set          // edges we've picked
Connected = {s}          // nodes in our tree
TotalCost = 0

WHILE Connected does NOT include all nodes:
    
    // Find all edges from Connected → Not Connected
    candidates = []
    FOR each node u IN Connected:
        FOR each edge (u, v, weight) from u:
            IF v is NOT in Connected:
                Add (u, v, weight) to candidates
    
    // Pick the cheapest one
    best = candidate with MINIMUM weight
    
    // Add it
    Add best to MST
    Add best.v to Connected
    TotalCost = TotalCost + best.weight
    
    PRINT "Added edge", best.u, "→", best.v, "cost:", best.weight

RETURN MST, TotalCost
```

### Key Rules
- **Greedy:** Always pick the cheapest edge — never look back
- **No cycles:** Only connect to nodes NOT already in the tree
- **Result:** V-1 edges for V nodes (e.g., 6 nodes → 5 edges)
- **Optimal:** This greedy approach gives the EXACT minimum cost

---

## 2. A* Algorithm — 8 Puzzle (Unit 2 — Informed Search)

### What it does
Finds the **shortest path** from a start state to a goal state. Uses a smart "estimate" (heuristic) to search efficiently.

### The Formula
```
f(n) = g(n) + h(n)

g(n) = moves made so far (like your odometer)
h(n) = estimated moves remaining (like GPS distance)
f(n) = total estimated cost (odometer + GPS)
```

### Plain English Steps
1. Put the start state in the OPEN list (to-do list).
2. Pick the state with the **smallest f(n)** from OPEN.
3. If it's the goal → DONE! Trace back the path.
4. Otherwise, generate all neighbor states (slide tiles into the blank).
5. For each neighbor: calculate g, h, f. Add to OPEN if not already explored.
6. Move current state to CLOSED list (done list).
7. Go back to step 2.

### Pseudocode

```
A-STAR ALGORITHM (start, goal)
───────────────────────────────
OPEN  = [start]        // states to explore (priority queue by f)
CLOSED = []            // states already explored

g[start] = 0
h[start] = count misplaced tiles (compared to goal)
f[start] = g[start] + h[start]

WHILE OPEN is not empty:

    current = state in OPEN with LOWEST f value
    Remove current from OPEN
    Add current to CLOSED

    IF current == goal:
        RETURN "Solution found!" + trace path back
    
    // Generate neighbors (slide a tile into the blank)
    FOR each neighbor of current:
        IF neighbor is in CLOSED:
            SKIP (already explored)
        
        tentative_g = g[current] + 1    // one more move
        
        IF neighbor not in OPEN  OR  tentative_g < g[neighbor]:
            g[neighbor] = tentative_g
            h[neighbor] = count misplaced tiles
            f[neighbor] = g[neighbor] + h[neighbor]
            parent[neighbor] = current
            
            IF neighbor not in OPEN:
                Add neighbor to OPEN

RETURN "No solution exists"
```

### Heuristic: Misplaced Tiles
```
Compare each position to goal (skip the blank):
  Position has tile 2, goal wants tile 1 → MISPLACED
  Position has tile 3, goal wants tile 3 → CORRECT
  
h(n) = total count of misplaced tiles
```

### Key Rules
- **OPEN list:** States waiting to be explored (sorted by f)
- **CLOSED list:** States already explored (never revisit)
- **Admissible heuristic:** h(n) never overestimates → guarantees optimal solution
- **f = g + h:** Balances "how far we've come" with "how far we think we need to go"

---

## 3. Wumpus World — Knowledge-Based Agent (Unit 4 — Knowledge)

### What it does
An agent explores a 4x4 cave to **find gold and escape alive**, avoiding a monster (Wumpus) and pits. It uses **logical reasoning** to figure out what's safe.

### The Environment
```
4x4 grid (16 rooms). Agent starts at (1,1).

DANGERS:
  Wumpus  → kills you (adjacent rooms smell: STENCH)
  Pits    → kills you (adjacent rooms feel: BREEZE)

GOAL:
  Gold    → grab it! (same room sparkles: GLITTER)

AGENT HAS:
  1 arrow → can shoot to kill Wumpus
  5 senses → Stench, Breeze, Glitter, Bump, Scream
```

### Scoring (PEAS — Performance Measure)
```
+1000  pick up gold
-1000  die (fall in pit or eaten by Wumpus)
   -1  each action (move, turn, grab, etc.)
  -10  use the arrow
```

### Plain English Steps
1. Enter a room. Sense the environment (stench? breeze? glitter?).
2. **TELL** your Knowledge Base what you sensed.
3. **Reason:** Use logic to figure out which rooms are safe or dangerous.
4. **ASK** your Knowledge Base: "Where is it safe to go?"
5. Move to a safe room. Repeat.
6. If you find glitter → GRAB gold → retrace path → CLIMB OUT at (1,1).

### Pseudocode

```
KB-AGENT (percept)
──────────────────
KB = empty knowledge base
position = (1,1)
has_gold = false
has_arrow = true

FUNCTION act(percept):
    // Step 1: TELL — add what we sensed
    TELL(KB, "At position, sensed: " + percept)
    
    // Step 2: INFER — reason about the world
    FOR each adjacent room adj:
        IF no stench at current room:
            TELL(KB, adj + " has no Wumpus")
        IF no breeze at current room:
            TELL(KB, adj + " has no Pit")
        IF stench at current room:
            TELL(KB, adj + " might have Wumpus")
        IF breeze at current room:
            TELL(KB, adj + " might have Pit")
    
    // Cross-reference: combine clues from multiple rooms
    FOR each unknown room X:
        IF every visited neighbor of X had no stench:
            TELL(KB, X + " is safe from Wumpus")
        IF every visited neighbor of X had no breeze:
            TELL(KB, X + " is safe from Pits")
    
    // Step 3: ASK — decide what to do
    IF percept contains GLITTER:
        GRAB gold
        has_gold = true
        RETRACE path to (1,1)
        CLIMB OUT → WIN!
    
    IF has_gold AND position == (1,1):
        CLIMB OUT → WIN!
    
    // Step 4: CHOOSE next move
    safe_rooms = ASK(KB, "Which adjacent rooms are confirmed safe?")
    unvisited_safe = safe_rooms that haven't been visited
    
    IF unvisited_safe is not empty:
        MOVE to nearest unvisited safe room
    ELSE IF can deduce Wumpus location AND has_arrow:
        SHOOT arrow toward Wumpus
    ELSE:
        BACKTRACK to a room with unvisited safe neighbors

REPEAT act() until escaped or dead
```

### Key Reasoning Example
```
Room (1,2) has STENCH → Wumpus at (1,1), (2,2), or (1,3)
Room (2,1) has NO STENCH → Wumpus NOT at (1,1) or (2,2)

Cross-reference:
  (1,1) → visited, no Wumpus ✓
  (2,2) → no stench at (2,1) means NOT here ✓
  (1,3) → only option left!

CONCLUSION: Wumpus MUST be at (1,3)!
```

### Environment Properties
| Property | Value | Why |
|----------|-------|-----|
| Observable | **Partially** | Agent sees only current room |
| Deterministic | **Yes** | Actions have predictable outcomes |
| Sequential | **Yes** | Current decisions affect future |
| Static | **Yes** | Wumpus and pits don't move |
| Discrete | **Yes** | Finite rooms, finite actions |
| Agents | **Single** | Wumpus is a hazard, not an agent |

---

## Visual Diagrams

See the accompanying `.excalidraw` file for visual flowcharts of each algorithm:
- `SPPU-AI-Algorithm-Diagrams.excalidraw`
