// ===== Wumpus World Problem — Interactive Simulation =====
// SPPU | Third Year | Sem VI | 310253 — AI | Unit 4: Knowledge
// Two modes: Watch & Learn (guided walkthrough) + Play Yourself (interactive)
// Note: All innerHTML usage is with hardcoded/trusted content only — no user input is rendered as HTML.

(function () {
  'use strict';

  // ===== World Definition (Classic Textbook Layout) =====
  // Grid: (col, row) where (1,1) is bottom-left, (4,4) is top-right
  // Internal storage: [row][col] where row 0 = top (row 4 in display), row 3 = bottom (row 1 in display)

  const GRID_SIZE = 4;

  // Convert display coords (col, row) to internal (r, c)
  function toInternal(col, row) { return { r: GRID_SIZE - row, c: col - 1 }; }
  function toDisplay(r, c) { return { col: c + 1, row: GRID_SIZE - r }; }
  function coordStr(col, row) { return '(' + col + ',' + row + ')'; }
  function internalStr(r, c) { var d = toDisplay(r, c); return coordStr(d.col, d.row); }

  // Classic textbook Wumpus World layout
  function createClassicWorld() {
    return {
      wumpus: toInternal(1, 3),    // Wumpus at (1,3)
      gold: toInternal(2, 3),      // Gold at (2,3)
      pits: [
        toInternal(3, 1),          // Pit at (3,1)
        toInternal(3, 3),          // Pit at (3,3)
        toInternal(4, 4)           // Pit at (4,4)
      ],
      wumpusDead: false,
      goldGrabbed: false
    };
  }

  function hasPit(world, r, c) {
    return world.pits.some(function(p) { return p.r === r && p.c === c; });
  }

  function getAdjacent(r, c) {
    var adj = [];
    if (r > 0) adj.push({ r: r - 1, c: c });
    if (r < GRID_SIZE - 1) adj.push({ r: r + 1, c: c });
    if (c > 0) adj.push({ r: r, c: c - 1 });
    if (c < GRID_SIZE - 1) adj.push({ r: r, c: c + 1 });
    return adj;
  }

  function getPercepts(world, r, c) {
    var percepts = { stench: false, breeze: false, glitter: false };
    var adj = getAdjacent(r, c);
    for (var i = 0; i < adj.length; i++) {
      var a = adj[i];
      if (a.r === world.wumpus.r && a.c === world.wumpus.c && !world.wumpusDead) {
        percepts.stench = true;
      }
      if (hasPit(world, a.r, a.c)) {
        percepts.breeze = true;
      }
    }
    if (r === world.gold.r && c === world.gold.c && !world.goldGrabbed) {
      percepts.glitter = true;
    }
    return percepts;
  }

  // ===== Watch & Learn Mode — Pre-scripted Exploration =====
  function generateWatchSteps() {
    var world = createClassicWorld();
    var steps = [];
    var visited = new Set();
    var safe = new Set();
    var dangerous = new Set();
    var kb = [];
    var score = 0, actions = 0;
    var hasArrow = true, hasGold = false;
    var agentR, agentC;

    function posKey(r, c) { return r + ',' + c; }
    function markVisited(r, c) { visited.add(posKey(r, c)); }
    function markSafe(r, c) { safe.add(posKey(r, c)); }
    function markDangerous(r, c) { dangerous.add(posKey(r, c)); }
    function addKB(fact) { if (kb.indexOf(fact) === -1) kb.push(fact); }

    function snapshot() {
      return {
        visited: new Set(visited), safe: new Set(safe), dangerous: new Set(dangerous),
        kb: kb.slice(), score: score, actions: actions,
        hasArrow: hasArrow, hasGold: hasGold,
        agentR: agentR, agentC: agentC,
        wumpusDead: world.wumpusDead, goldGrabbed: world.goldGrabbed
      };
    }

    // Step 0: Start at (1,1) — internal (3,0)
    agentR = 3; agentC = 0;
    markVisited(agentR, agentC);
    markSafe(agentR, agentC);
    var p0 = getPercepts(world, agentR, agentC);
    addKB('Agent starts at (1,1)');
    addKB('(1,1): No stench, no breeze — safe');
    markSafe(3, 1); // (2,1)
    markSafe(2, 0); // (1,2)
    addKB('(2,1) is safe — no stench/breeze at (1,1)');
    addKB('(1,2) is safe — no stench/breeze at (1,1)');

    steps.push({
      type: 'init', percepts: p0, ...snapshot(),
      explanation:
        '<strong>Step 1 — Start at (1,1):</strong> The agent enters the cave at <span class="highlight-agent">(1,1)</span> — the bottom-left room.<br><br>' +
        '<strong>Percepts:</strong> Nothing! No stench, no breeze, no glitter. A calm, safe room.<br><br>' +
        '<strong>TELL KB:</strong> "(1,1) is safe. No percepts detected."<br>' +
        '<strong>Inference:</strong> No stench means Wumpus is NOT adjacent. No breeze means no pits adjacent.<br>' +
        'Therefore: <span class="highlight-safe">(2,1)</span> and <span class="highlight-safe">(1,2)</span> are both <strong>confirmed safe</strong>!<br><br>' +
        '<strong>ASK KB:</strong> "Where should I go?" — Agent chooses to move right to (2,1).<br><br>' +
        'Score: <span class="highlight-score">0</span> | Actions: 0'
    });

    // Step 1: Move to (2,1)
    agentR = 3; agentC = 1;
    actions++; score--;
    markVisited(agentR, agentC);
    var p1 = getPercepts(world, agentR, agentC);
    addKB('Moved to (2,1)');
    addKB('(2,1): BREEZE detected!');
    addKB('Breeze at (2,1) — pit could be at (3,1) or (2,2)');
    addKB('(1,1) visited, safe — no pit there');

    steps.push({
      type: 'move', percepts: p1, ...snapshot(),
      explanation:
        '<strong>Step 2 — Move to (2,1):</strong> Agent moves right to <span class="highlight-agent">(2,1)</span>. Cost: -1.<br><br>' +
        '<strong>Percepts:</strong> <span class="highlight-breeze">BREEZE!</span> The agent feels a draft of cool air. No stench, no glitter.<br><br>' +
        '<strong>TELL KB:</strong> "Breeze at (2,1)."<br>' +
        '<strong>Inference:</strong> A breeze means a pit is in an adjacent room.<br>' +
        'Adjacent rooms: (1,1), (3,1), (2,2).<br>' +
        '(1,1) was visited — no pit. So the pit could be at <strong>(3,1)</strong> or <strong>(2,2)</strong>.<br><br>' +
        'No stench at (2,1) — Wumpus is NOT adjacent to (2,1). This fact will be useful later!<br><br>' +
        'Agent decides to go back and try (1,2) instead — it was confirmed safe.<br><br>' +
        'Score: <span class="highlight-score">' + score + '</span> | Actions: ' + actions
    });

    // Step 2: Move back to (1,1) then to (1,2)
    agentR = 2; agentC = 0; // (1,2)
    actions += 2; score -= 2;
    markVisited(agentR, agentC);
    var p2 = getPercepts(world, agentR, agentC);
    addKB('Moved back to (1,1), then up to (1,2)');
    addKB('(1,2): STENCH detected!');
    addKB('Stench at (1,2) — Wumpus could be at (1,1), (2,2), or (1,3)');
    addKB('(1,1) is safe, visited — no Wumpus');
    addKB('No stench at (2,1) — Wumpus NOT at (2,2)');
    addKB('Therefore: Wumpus MUST be at (1,3)!');
    markDangerous(1, 0); // (1,3)
    addKB('No breeze at (1,2) — no pit adjacent');
    addKB('Therefore: (2,2) has NO pit — pit must be at (3,1)');
    markSafe(2, 1); // (2,2) confirmed safe
    markDangerous(3, 2); // (3,1) has pit

    steps.push({
      type: 'move', percepts: p2, ...snapshot(),
      explanation:
        '<strong>Step 3 — Move to (1,2):</strong> Agent returns to (1,1) then moves up to <span class="highlight-agent">(1,2)</span>. Cost: -2.<br><br>' +
        '<strong>Percepts:</strong> <span class="highlight-stench">STENCH!</span> A horrible smell fills the room. No breeze though.<br><br>' +
        '<strong>This is the KEY reasoning step — propositional logic in action!</strong><br><br>' +
        '<strong>TELL KB:</strong> "Stench at (1,2). No breeze at (1,2)."<br><br>' +
        '<strong>Inference Chain:</strong><br>' +
        '1. Stench at (1,2) means Wumpus is adjacent: (1,1), (2,2), or (1,3)<br>' +
        '2. (1,1) was visited — no Wumpus there<br>' +
        '3. No stench at (2,1) means Wumpus is NOT at (2,2) (we would have smelled it)<br>' +
        '4. <strong>Therefore: Wumpus is at <span class="highlight-danger">(1,3)</span>!</strong><br><br>' +
        '<strong>Bonus inference:</strong> No breeze at (1,2) means no pits adjacent. So (2,2) has NO pit. Combined with Step 2: pit must be at <span class="highlight-danger">(3,1)</span>.<br><br>' +
        'Score: <span class="highlight-score">' + score + '</span> | Actions: ' + actions
    });

    // Step 3: Move to (2,2)
    agentR = 2; agentC = 1; // (2,2)
    actions++; score--;
    markVisited(agentR, agentC);
    var p3 = getPercepts(world, agentR, agentC);
    addKB('Moved to (2,2) — confirmed safe');
    addKB('(2,2): STENCH and BREEZE');
    addKB('Stench confirms Wumpus at (1,3)');
    addKB('Breeze: pit could be at (2,3) or (3,2)');

    steps.push({
      type: 'move', percepts: p3, ...snapshot(),
      explanation:
        '<strong>Step 4 — Move to (2,2):</strong> Agent moves to <span class="highlight-agent">(2,2)</span> (confirmed safe). Cost: -1.<br><br>' +
        '<strong>Percepts:</strong> <span class="highlight-stench">STENCH</span> and <span class="highlight-breeze">BREEZE</span>! Both dangers are nearby.<br><br>' +
        '<strong>Inference:</strong><br>' +
        'Stench confirms Wumpus at (1,3) — consistent with our deduction.<br>' +
        'Breeze means a pit is adjacent. Unvisited adjacent rooms: (2,3) and (3,2).<br><br>' +
        'The agent decides to be strategic — shoot the Wumpus first to eliminate one danger, then move toward the gold!<br><br>' +
        'Score: <span class="highlight-score">' + score + '</span> | Actions: ' + actions
    });

    // Step 4: Shoot arrow
    actions++; score -= 10;
    hasArrow = false;
    world.wumpusDead = true;
    addKB('SHOT ARROW toward (1,3)!');
    addKB('SCREAM heard — Wumpus is DEAD!');
    addKB('Arrow used — cost: -10');
    markSafe(1, 0); // (1,3) now safe

    steps.push({
      type: 'shoot', percepts: { stench: false, breeze: true, glitter: false, scream: true }, ...snapshot(),
      explanation:
        '<strong>Step 5 — Shoot Arrow!</strong> Agent fires the arrow toward <span class="highlight-danger">(1,3)</span>.<br><br>' +
        '<strong>Percept:</strong> <span class="highlight-danger">SCREAM!</span> The Wumpus lets out a death cry. <strong>It is dead!</strong><br><br>' +
        '<strong>TELL KB:</strong> "Wumpus killed. Arrow used. (1,3) is now safe."<br><br>' +
        'Cost: -10 points for using the arrow, but the Wumpus is eliminated. The stench will linger but the danger is gone.<br><br>' +
        'Now the agent can safely move toward the gold!<br><br>' +
        'Score: <span class="highlight-score">' + score + '</span> | Actions: ' + actions
    });

    // Step 5: Move to (2,3) — find gold!
    agentR = 1; agentC = 1; // (2,3)
    actions++; score--;
    markVisited(agentR, agentC);
    markSafe(agentR, agentC);
    addKB('Moved to (2,3)');
    addKB('(2,3): GLITTER detected! Gold is HERE!');

    steps.push({
      type: 'move', percepts: { stench: true, breeze: true, glitter: true }, ...snapshot(),
      explanation:
        '<strong>Step 6 — Move to (2,3):</strong> Agent moves up to <span class="highlight-agent">(2,3)</span>. Cost: -1.<br><br>' +
        '<strong>Percepts:</strong> <span class="highlight-gold">GLITTER!</span> The room sparkles with golden light! (Also stench from dead wumpus area and breeze from nearby pit.)<br><br>' +
        '<strong>TELL KB:</strong> "Glitter at (2,3) — GOLD IS HERE!"<br><br>' +
        'The agent has found the treasure! Now it needs to <strong>grab the gold</strong> and retrace its path back to (1,1).<br><br>' +
        'Score: <span class="highlight-score">' + score + '</span> | Actions: ' + actions
    });

    // Step 6: Grab gold
    actions++; score--;
    score += 1000;
    hasGold = true;
    world.goldGrabbed = true;
    addKB('GRABBED the gold! +1000 points!');

    steps.push({
      type: 'grab', percepts: { stench: false, breeze: true, glitter: false }, ...snapshot(),
      explanation:
        '<strong>Step 7 — Grab Gold!</strong> The agent grabs the <span class="highlight-gold">GOLD</span>! <strong>+1000 points!</strong><br><br>' +
        '<strong>TELL KB:</strong> "Gold collected. Objective achieved."<br><br>' +
        'Now retrace: (2,3) to (2,2) to (1,2) to (1,1) then Climb!<br><br>' +
        'Score: <span class="highlight-score">' + score + '</span> | Actions: ' + actions
    });

    // Step 7: Retrace to (1,1)
    agentR = 3; agentC = 0; // (1,1)
    actions += 3; score -= 3;
    addKB('Retracing: (2,3) to (2,2) to (1,2) to (1,1)');

    steps.push({
      type: 'move', percepts: { stench: false, breeze: false, glitter: false }, ...snapshot(),
      explanation:
        '<strong>Step 8 — Retrace Path:</strong> Agent returns: (2,3) to (2,2) to (1,2) to <span class="highlight-agent">(1,1)</span>. Cost: -3.<br><br>' +
        'Every room on this path was already confirmed safe. No risks on the return journey!<br><br>' +
        'Score: <span class="highlight-score">' + score + '</span> | Actions: ' + actions
    });

    // Step 8: Climb out
    actions++; score--;
    addKB('CLIMBED OUT at (1,1) — VICTORY!');

    steps.push({
      type: 'done', percepts: {}, ...snapshot(),
      explanation:
        '<strong>VICTORY! Agent Escaped with the Gold!</strong><br><br>' +
        'The agent climbs out of the cave at (1,1) with the gold!<br><br>' +
        '<strong>Final Score Breakdown:</strong><br>' +
        'Gold collected: <span class="highlight-safe">+1000</span><br>' +
        'Arrow used: <span class="highlight-danger">-10</span><br>' +
        'Total actions (' + actions + '): <span class="highlight-danger">-' + actions + '</span><br>' +
        '<strong>Final Score: <span class="highlight-score">' + score + '</span></strong><br><br>' +
        '<strong>Key Takeaways for Exams:</strong><br>' +
        '1. The agent used <em>logical inference</em> to deduce the Wumpus location from stench patterns<br>' +
        '2. It combined evidence from multiple rooms to resolve uncertainty about pits<br>' +
        '3. It made a strategic decision to shoot the Wumpus before approaching the gold<br>' +
        '4. This is exactly how a <strong>Knowledge-Based Agent</strong> works: perceive, TELL, infer, ASK, act!'
    });

    return steps;
  }

  var watchSteps = generateWatchSteps();

  // ===== Play Mode — Interactive Game Logic =====
  function createPlayGame(worldOverride) {
    var world = worldOverride || createClassicWorld();
    return {
      world: world,
      agentR: 3, agentC: 0,
      score: 0, actions: 0,
      hasArrow: true, hasGold: false,
      alive: true, escaped: false,
      visited: new Set(['3,0']),
      safe: new Set(['3,0']),
      dangerous: new Set(),
      kb: ['Agent at (1,1). Room is safe.'],
      log: []
    };
  }

  function playMoveAgent(game, dr, dc) {
    if (!game.alive || game.escaped) return null;
    var newR = game.agentR + dr;
    var newC = game.agentC + dc;

    if (newR < 0 || newR >= GRID_SIZE || newC < 0 || newC >= GRID_SIZE) {
      game.log.push('Bump! Hit a wall.');
      return { bump: true };
    }

    game.agentR = newR;
    game.agentC = newC;
    game.actions++;
    game.score--;
    game.visited.add(newR + ',' + newC);

    var d = toDisplay(newR, newC);
    game.log.push('Moved to ' + coordStr(d.col, d.row));

    // Death checks
    if (newR === game.world.wumpus.r && newC === game.world.wumpus.c && !game.world.wumpusDead) {
      game.alive = false;
      game.score -= 1000;
      game.log.push('EATEN by the Wumpus! -1000');
      game.kb.push(coordStr(d.col, d.row) + ': WUMPUS! Agent is dead.');
      return { dead: 'wumpus' };
    }

    if (hasPit(game.world, newR, newC)) {
      game.alive = false;
      game.score -= 1000;
      game.log.push('Fell into a PIT! -1000');
      game.kb.push(coordStr(d.col, d.row) + ': PIT! Agent fell.');
      return { dead: 'pit' };
    }

    var percepts = getPercepts(game.world, newR, newC);
    var perceptStrs = [];
    if (percepts.stench) perceptStrs.push('Stench');
    if (percepts.breeze) perceptStrs.push('Breeze');
    if (percepts.glitter) perceptStrs.push('Glitter');
    if (perceptStrs.length === 0) perceptStrs.push('Nothing');

    game.kb.push(coordStr(d.col, d.row) + ': ' + perceptStrs.join(', '));
    game.safe.add(newR + ',' + newC);

    if (!percepts.stench && !percepts.breeze) {
      var adj = getAdjacent(newR, newC);
      for (var i = 0; i < adj.length; i++) {
        game.safe.add(adj[i].r + ',' + adj[i].c);
      }
    }

    return { percepts: percepts };
  }

  function playGrabGold(game) {
    if (!game.alive || game.escaped) return false;
    game.actions++;
    game.score--;
    if (game.agentR === game.world.gold.r && game.agentC === game.world.gold.c && !game.world.goldGrabbed) {
      game.hasGold = true;
      game.world.goldGrabbed = true;
      game.score += 1000;
      game.log.push('GRABBED the gold! +1000');
      game.kb.push('Gold collected!');
      return true;
    }
    game.log.push('Grabbed... nothing here.');
    return false;
  }

  function playShootArrow(game, dr, dc) {
    if (!game.alive || game.escaped || !game.hasArrow) return null;
    game.hasArrow = false;
    game.actions++;
    game.score -= 10;
    game.log.push('Shot arrow! -10');

    var ar = game.agentR + dr;
    var ac = game.agentC + dc;
    while (ar >= 0 && ar < GRID_SIZE && ac >= 0 && ac < GRID_SIZE) {
      if (ar === game.world.wumpus.r && ac === game.world.wumpus.c && !game.world.wumpusDead) {
        game.world.wumpusDead = true;
        game.log.push('SCREAM! Wumpus is dead!');
        game.kb.push('Wumpus killed!');
        return { scream: true };
      }
      ar += dr;
      ac += dc;
    }
    game.log.push('Arrow missed...');
    return { scream: false };
  }

  function playClimbOut(game) {
    if (!game.alive || game.escaped) return false;
    if (game.agentR !== 3 || game.agentC !== 0) {
      game.log.push('Can only climb out at (1,1)!');
      return false;
    }
    game.actions++;
    game.score--;
    game.escaped = true;
    game.log.push(game.hasGold ? 'Climbed out WITH gold! Victory!' : 'Climbed out without gold.');
    return true;
  }

  function generateRandomWorld() {
    var world = { pits: [], wumpusDead: false, goldGrabbed: false };
    var occupied = new Set();
    occupied.add('3,0');

    var wr, wc;
    do { wr = Math.floor(Math.random() * 4); wc = Math.floor(Math.random() * 4); }
    while (occupied.has(wr + ',' + wc));
    world.wumpus = { r: wr, c: wc };
    occupied.add(wr + ',' + wc);

    var gr, gc;
    do { gr = Math.floor(Math.random() * 4); gc = Math.floor(Math.random() * 4); }
    while (occupied.has(gr + ',' + gc));
    world.gold = { r: gr, c: gc };
    occupied.add(gr + ',' + gc);

    var numPits = 2 + Math.floor(Math.random() * 2);
    for (var i = 0; i < numPits; i++) {
      var pr, pc, attempts = 0;
      do { pr = Math.floor(Math.random() * 4); pc = Math.floor(Math.random() * 4); attempts++; }
      while (occupied.has(pr + ',' + pc) && attempts < 50);
      if (attempts < 50) {
        world.pits.push({ r: pr, c: pc });
        occupied.add(pr + ',' + pc);
      }
    }
    return world;
  }

  // ===== UI State =====
  var currentMode = 'watch';
  var watchStepIndex = 0;
  var isAnimating = false;
  var solveInterval = null;
  var playGame = createPlayGame();
  var shootMode = false;

  // ===== DOM Elements =====
  var wumpusGridEl = document.getElementById('wumpusGrid');
  var explanationTextEl = document.getElementById('explanationText');
  var perceptsListEl = document.getElementById('perceptsList');
  var kbListEl = document.getElementById('kbList');
  var kbCountEl = document.getElementById('kbCount');
  var actionLogEl = document.getElementById('actionLog');
  var scoreValueEl = document.getElementById('scoreValue');
  var actionsValueEl = document.getElementById('actionsValue');
  var arrowStatusEl = document.getElementById('arrowStatus');
  var gameStatusEl = document.getElementById('gameStatus');
  var stepNumEl = document.getElementById('stepNum');
  var totalStepsEl = document.getElementById('totalSteps');
  var progressFillEl = document.getElementById('progressFill');
  var btnNext = document.getElementById('btnNextStep');
  var btnSolve = document.getElementById('btnSolve');
  var btnReset = document.getElementById('btnReset');
  var watchControlsEl = document.getElementById('watchControls');
  var playControlsEl = document.getElementById('playControls');
  var stepCounterEl = document.getElementById('stepCounter');
  var tabWatch = document.getElementById('tabWatch');
  var tabPlay = document.getElementById('tabPlay');
  var gridLabelEl = document.getElementById('gridLabel');

  // ===== Safe DOM helpers (no user input rendered as HTML) =====
  // All content passed to these is hardcoded/trusted from the simulation logic.
  function setHTML(el, trustedHTML) { el.innerHTML = trustedHTML; }

  // ===== Grid Rendering =====
  function renderGrid(state) {
    wumpusGridEl.textContent = '';

    for (var r = 0; r < GRID_SIZE; r++) {
      for (var c = 0; c < GRID_SIZE; c++) {
        var cell = document.createElement('div');
        cell.className = 'cell';
        var d = toDisplay(r, c);
        var key = r + ',' + c;

        var coord = document.createElement('span');
        coord.className = 'cell-coord';
        coord.textContent = coordStr(d.col, d.row);
        cell.appendChild(coord);

        var isAgentHere = r === state.agentR && c === state.agentC;
        var isVis = state.visited.has(key);
        var isSafeCell = state.safe.has(key);
        var isDanger = state.dangerous.has(key);
        var showContents = isVis || state.type === 'done' || state.type === 'death' || !state.alive;

        if (!showContents && currentMode === 'play') {
          cell.classList.add('fog');
          wumpusGridEl.appendChild(cell);
          continue;
        }

        if (!showContents && currentMode === 'watch') {
          if (!isSafeCell && !isDanger) {
            cell.classList.add('fog');
            wumpusGridEl.appendChild(cell);
            continue;
          }
        }

        if (isAgentHere) cell.classList.add('current');
        else if (isVis) cell.classList.add('visited');

        if (isDanger && !isAgentHere) cell.classList.add('danger-cell');
        else if (isSafeCell && !isVis && !isAgentHere) cell.classList.add('safe-cell');

        if (!state.alive && isAgentHere) cell.classList.add('death-cell');
        if (state.type === 'done' && isAgentHere) cell.classList.add('win-cell');

        // Build icons with DOM methods
        var icons = document.createElement('div');
        icons.className = 'cell-icons';

        if (isAgentHere && state.alive !== false) {
          var agentIcon = document.createElement('span');
          agentIcon.className = 'icon-agent';
          agentIcon.textContent = '\u265F'; // chess pawn
          icons.appendChild(agentIcon);
        }

        var isWumpusRoom = r === state.world.wumpus.r && c === state.world.wumpus.c;
        if (isWumpusRoom && (isVis || !state.alive || state.type === 'done')) {
          var wIcon = document.createElement('span');
          wIcon.className = state.wumpusDead ? 'icon-dead-wumpus' : 'icon-wumpus';
          wIcon.textContent = '\u2620'; // skull
          icons.appendChild(wIcon);
        }

        if (hasPit(state.world, r, c) && (isVis || !state.alive || state.type === 'done')) {
          var pIcon = document.createElement('span');
          pIcon.className = 'icon-pit';
          pIcon.textContent = '\u25CC'; // dotted circle
          icons.appendChild(pIcon);
        }

        if (r === state.world.gold.r && c === state.world.gold.c && !state.goldGrabbed && (isVis || state.type === 'done')) {
          var gIcon = document.createElement('span');
          gIcon.className = 'icon-gold';
          gIcon.textContent = '\u2605'; // star
          icons.appendChild(gIcon);
        }

        if (isAgentHere && state.alive === false) {
          var deadIcon = document.createElement('span');
          deadIcon.className = 'icon-agent';
          deadIcon.style.opacity = '0.4';
          deadIcon.textContent = '\u2620';
          icons.appendChild(deadIcon);
        }

        cell.appendChild(icons);

        // Percept badges
        if (isVis || state.type === 'done') {
          var percepts = getPercepts(state.world, r, c);
          var badges = document.createElement('div');
          badges.className = 'cell-percepts';

          if (percepts.stench) {
            var sb = document.createElement('span');
            sb.className = 'percept-badge percept-stench';
            sb.textContent = 'S';
            badges.appendChild(sb);
          }
          if (percepts.breeze) {
            var bb = document.createElement('span');
            bb.className = 'percept-badge percept-breeze';
            bb.textContent = 'B';
            badges.appendChild(bb);
          }
          if (percepts.glitter && !state.goldGrabbed) {
            var gb = document.createElement('span');
            gb.className = 'percept-badge percept-glitter';
            gb.textContent = 'G';
            badges.appendChild(gb);
          }

          if (badges.childNodes.length > 0) cell.appendChild(badges);
        }

        wumpusGridEl.appendChild(cell);
      }
    }
  }

  // ===== Render State Panel =====
  function renderPercepts(percepts) {
    if (!percepts || Object.keys(percepts).length === 0) {
      perceptsListEl.textContent = '';
      var emptyDiv = document.createElement('div');
      emptyDiv.className = 'list-empty';
      emptyDiv.textContent = 'No percepts';
      perceptsListEl.appendChild(emptyDiv);
      return;
    }

    var items = [];
    if (percepts.stench) items.push({ cls: 'percept', badge: 'percept-stench', letter: 'S', text: 'Stench — Wumpus is nearby!' });
    if (percepts.breeze) items.push({ cls: 'percept', badge: 'percept-breeze', letter: 'B', text: 'Breeze — Pit is nearby!' });
    if (percepts.glitter) items.push({ cls: 'percept', badge: 'percept-glitter', letter: 'G', text: 'Glitter — Gold is HERE!' });
    if (percepts.scream) items.push({ cls: 'danger', badge: null, letter: null, text: 'SCREAM — Wumpus killed!' });
    if (items.length === 0) items.push({ cls: 'safe', badge: null, letter: null, text: 'Nothing — This room is calm' });

    perceptsListEl.textContent = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var div = document.createElement('div');
      div.className = 'list-item ' + item.cls;
      if (item.badge) {
        var span = document.createElement('span');
        span.className = 'percept-badge ' + item.badge;
        span.textContent = item.letter;
        div.appendChild(span);
        div.appendChild(document.createTextNode(' ' + item.text));
      } else {
        div.textContent = item.text;
      }
      perceptsListEl.appendChild(div);
    }
  }

  function renderKB(kb) {
    kbCountEl.textContent = kb.length;
    kbListEl.textContent = '';

    if (kb.length === 0) {
      var emptyDiv = document.createElement('div');
      emptyDiv.className = 'list-empty';
      emptyDiv.textContent = 'Empty';
      kbListEl.appendChild(emptyDiv);
      return;
    }

    var display = kb.slice(-20).reverse();
    for (var i = 0; i < display.length; i++) {
      var fact = display[i];
      var div = document.createElement('div');
      var cls = '';
      if (fact.indexOf('safe') !== -1 || fact.indexOf('Safe') !== -1) cls = 'safe';
      if (fact.indexOf('WUMPUS') !== -1 || fact.indexOf('MUST') !== -1 || fact.indexOf('pit must') !== -1 || fact.indexOf('DEAD') !== -1 || fact.indexOf('dead') !== -1) cls = 'danger';
      if (fact.indexOf('GOLD') !== -1 || fact.indexOf('gold') !== -1 || fact.indexOf('GRABBED') !== -1 || fact.indexOf('Victory') !== -1) cls = 'active';
      div.className = 'list-item ' + cls;
      div.textContent = fact;
      kbListEl.appendChild(div);
    }
  }

  function renderActionLog(log) {
    actionLogEl.textContent = '';

    if (log.length === 0) {
      var emptyDiv = document.createElement('div');
      emptyDiv.className = 'list-empty';
      emptyDiv.textContent = 'Actions will appear here';
      actionLogEl.appendChild(emptyDiv);
      return;
    }

    var display = log.slice(-15);
    for (var i = 0; i < display.length; i++) {
      var div = document.createElement('div');
      div.className = 'move-item' + (i === display.length - 1 ? ' current' : '');
      var numSpan = document.createElement('span');
      numSpan.className = 'move-num';
      numSpan.textContent = log.length - display.length + i + 1;
      var textSpan = document.createElement('span');
      textSpan.textContent = display[i];
      div.appendChild(numSpan);
      div.appendChild(textSpan);
      actionLogEl.appendChild(div);
    }

    actionLogEl.scrollTop = actionLogEl.scrollHeight;
  }

  function renderScoreBar(score, actions, hasArrow, status) {
    scoreValueEl.textContent = score;
    scoreValueEl.className = 'score-value' + (score > 0 ? ' positive' : score < 0 ? ' negative' : '');
    actionsValueEl.textContent = actions;
    arrowStatusEl.textContent = hasArrow ? 'Available' : 'Used';
    gameStatusEl.textContent = status;
  }

  // ===== Watch Mode Rendering =====
  function renderWatchStep(index) {
    if (index < 0 || index >= watchSteps.length) return;
    var step = watchSteps[index];

    var gridState = {
      agentR: step.agentR, agentC: step.agentC,
      visited: step.visited, safe: step.safe, dangerous: step.dangerous,
      world: createClassicWorld(),
      wumpusDead: step.wumpusDead, goldGrabbed: step.goldGrabbed,
      alive: true, type: step.type
    };
    gridState.world.wumpusDead = step.wumpusDead;
    gridState.world.goldGrabbed = step.goldGrabbed;

    renderGrid(gridState);
    renderPercepts(step.percepts);
    renderKB(step.kb);
    var actionItems = step.kb.filter(function(k) {
      return k.indexOf('Moved') === 0 || k.indexOf('SHOT') === 0 || k.indexOf('GRABBED') === 0 || k.indexOf('CLIMBED') === 0 || k.indexOf('Retracing') === 0;
    });
    renderActionLog(actionItems);
    renderScoreBar(step.score, step.actions, step.hasArrow, step.type === 'done' ? 'Victory!' : 'Exploring');

    // Explanation uses trusted hardcoded HTML strings only
    setHTML(explanationTextEl, step.explanation);

    stepNumEl.textContent = index;
    totalStepsEl.textContent = watchSteps.length - 1;
    var pct = watchSteps.length > 1 ? (index / (watchSteps.length - 1)) * 100 : 0;
    progressFillEl.style.width = pct + '%';

    if (step.type === 'done') {
      btnNext.disabled = true;
      btnSolve.disabled = true;
    }
  }

  // ===== Learning Intelligence — Analyze clues & generate feedback =====

  // Find which visited rooms had percepts that warned about the death room
  function findMissedClues(game, deathR, deathC) {
    var clues = [];
    var dStr = internalStr(deathR, deathC);
    var visitedRooms = [];
    game.visited.forEach(function(key) {
      var parts = key.split(',');
      visitedRooms.push({ r: parseInt(parts[0]), c: parseInt(parts[1]) });
    });

    for (var i = 0; i < visitedRooms.length; i++) {
      var vr = visitedRooms[i].r, vc = visitedRooms[i].c;
      if (vr === deathR && vc === deathC) continue;
      var adj = getAdjacent(vr, vc);
      var isAdj = adj.some(function(a) { return a.r === deathR && a.c === deathC; });
      if (!isAdj) continue;

      var p = getPercepts(game.world, vr, vc);
      var vStr = internalStr(vr, vc);
      if (p.breeze && hasPit(game.world, deathR, deathC)) {
        clues.push('You felt a <span class="highlight-breeze">Breeze</span> at ' + vStr + ' — this warned that a pit was adjacent, including ' + dStr + '.');
      }
      if (p.stench && deathR === game.world.wumpus.r && deathC === game.world.wumpus.c && !game.world.wumpusDead) {
        clues.push('You smelled <span class="highlight-stench">Stench</span> at ' + vStr + ' — this warned that the Wumpus was adjacent, including ' + dStr + '.');
      }
    }
    return clues;
  }

  // Find safe rooms the agent could have gone to instead
  function findSafeAlternatives(game) {
    var alternatives = [];
    var adj = getAdjacent(game.agentR, game.agentC);
    // Use the state BEFORE the fatal move — check from previous position
    game.visited.forEach(function(key) {
      var parts = key.split(',');
      var vr = parseInt(parts[0]), vc = parseInt(parts[1]);
      var vadj = getAdjacent(vr, vc);
      for (var i = 0; i < vadj.length; i++) {
        var a = vadj[i];
        var aKey = a.r + ',' + a.c;
        if (game.safe.has(aKey) && !game.visited.has(aKey)) {
          var aStr = internalStr(a.r, a.c);
          if (alternatives.indexOf(aStr) === -1) alternatives.push(aStr);
        }
      }
    });
    return alternatives;
  }

  // Generate a detailed death explanation
  function generateDeathExplanation(game) {
    var deathR = game.agentR, deathC = game.agentC;
    var dStr = internalStr(deathR, deathC);
    var isWumpus = deathR === game.world.wumpus.r && deathC === game.world.wumpus.c && !game.world.wumpusDead;
    var isPit = hasPit(game.world, deathR, deathC);
    var cause = isWumpus ? 'the Wumpus' : 'a Pit';

    var html = '<strong>Game Over!</strong> You were killed by <span class="highlight-danger">' + cause + '</span> at ' + dStr + '!<br><br>';

    // Missed clues analysis
    var clues = findMissedClues(game, deathR, deathC);
    if (clues.length > 0) {
      html += '<div class="death-box"><strong>Clues you missed:</strong><br>';
      for (var i = 0; i < clues.length; i++) {
        html += '&bull; ' + clues[i] + '<br>';
      }
      html += '</div>';
    }

    // What you should have done
    html += '<div class="lesson-box"><strong>What you should have done:</strong><br>';
    if (isWumpus) {
      html += '&bull; When you smell <span class="highlight-stench">Stench</span>, the Wumpus is in one of the adjacent rooms.<br>';
      html += '&bull; Cross-reference stench from multiple rooms to pinpoint the Wumpus location.<br>';
      html += '&bull; Use your arrow to <strong>shoot the Wumpus</strong> before entering its room.<br>';
      html += '&bull; If you hear a <strong>Scream</strong>, the Wumpus is dead and the room is safe!';
    } else {
      html += '&bull; When you feel <span class="highlight-breeze">Breeze</span>, a pit is in one of the adjacent rooms.<br>';
      html += '&bull; Never enter an unvisited room adjacent to a breezy room unless you can confirm it is safe from another direction.<br>';
      html += '&bull; Visit other rooms first to gather more information and narrow down pit locations.';
    }
    html += '</div>';

    // Reasoning tip
    html += '<div class="lesson-box"><strong>Key reasoning principle:</strong><br>';
    html += 'A Knowledge-Based Agent combines evidence from <em>multiple</em> rooms. If Room A has breeze and Room B (adjacent to the same unknown room) has NO breeze, then the unknown room is safe from pits (from B\'s side). Always cross-reference!';
    html += '</div>';

    html += '<br>Score: <span class="highlight-score">' + game.score + '</span>. Press <strong>New Game (R)</strong> to try again with this knowledge!';
    return html;
  }

  // Generate a hint based on current KB
  function generateHint(game) {
    var g = game;
    var dd = toDisplay(g.agentR, g.agentC);
    var percepts = getPercepts(g.world, g.agentR, g.agentC);
    var html = '<div class="hint-box"><strong>Hint:</strong><br>';

    // Check for glitter
    if (percepts.glitter) {
      html += 'You see <span class="highlight-gold">Glitter</span>! The gold is in THIS room. Press <strong>G</strong> to grab it!</div>';
      return html;
    }

    // Check if has gold — should go back
    if (g.hasGold) {
      html += 'You have the gold! Now retrace your steps back to <strong>(1,1)</strong> and press <strong>C</strong> to climb out and win!</div>';
      return html;
    }

    // Analyze safe unvisited neighbors
    var adj = getAdjacent(g.agentR, g.agentC);
    var safeUnvisited = [];
    var riskyUnvisited = [];
    var visitedAdj = [];

    for (var i = 0; i < adj.length; i++) {
      var a = adj[i];
      var aKey = a.r + ',' + a.c;
      var aStr = internalStr(a.r, a.c);
      if (g.visited.has(aKey)) {
        visitedAdj.push(aStr);
      } else if (g.safe.has(aKey)) {
        safeUnvisited.push(aStr);
      } else {
        riskyUnvisited.push(aStr);
      }
    }

    if (safeUnvisited.length > 0) {
      html += 'Safe rooms to explore: <strong>' + safeUnvisited.join(', ') + '</strong>. These have been confirmed safe by your observations.<br>';
    }

    if (riskyUnvisited.length > 0) {
      html += '<span class="highlight-danger">Risky rooms: ' + riskyUnvisited.join(', ') + '</span> — you don\'t have enough info to confirm these are safe.<br>';
    }

    // Specific percept advice
    if (percepts.stench && !g.world.wumpusDead) {
      html += '<br><strong>Stench detected!</strong> The Wumpus is adjacent. ';
      if (g.hasArrow) {
        html += 'Consider using your arrow (<strong>Space</strong>) to shoot in the direction you suspect the Wumpus is. ';
      }
      html += 'Visit other safe rooms to narrow down which room has the Wumpus.';
    }

    if (percepts.breeze) {
      html += '<br><strong>Breeze detected!</strong> A pit is adjacent. Do NOT enter unknown rooms from here. Go to a different safe room and approach from another angle to cross-reference.';
    }

    if (!percepts.stench && !percepts.breeze && safeUnvisited.length === 0 && riskyUnvisited.length > 0) {
      html += '<br>No percepts here means all adjacent rooms are safe from immediate danger. Try exploring one of the adjacent unvisited rooms!';
    }

    if (safeUnvisited.length === 0 && riskyUnvisited.length === 0) {
      html += 'All adjacent rooms are already visited. Backtrack to a room that has safe unvisited neighbors.';
    }

    html += '</div>';
    return html;
  }

  // Generate educational explanation for each move
  function generateMoveExplanation(game) {
    var g = game;
    var dd = toDisplay(g.agentR, g.agentC);
    var percepts = getPercepts(g.world, g.agentR, g.agentC);
    var html = 'Agent is at <span class="highlight-agent">' + coordStr(dd.col, dd.row) + '</span>. ';

    // Percepts
    var perceptStrs = [];
    if (percepts.stench) perceptStrs.push('<span class="highlight-stench">Stench</span>');
    if (percepts.breeze) perceptStrs.push('<span class="highlight-breeze">Breeze</span>');
    if (percepts.glitter) perceptStrs.push('<span class="highlight-gold">Glitter</span>');
    var perceptText = perceptStrs.length > 0 ? perceptStrs.join(', ') : 'Nothing';
    html += 'Percepts: ' + perceptText + '.<br><br>';

    // Educational guidance based on percepts
    if (percepts.glitter) {
      html += '<div class="warning-box"><strong>Gold found!</strong> Press <strong>G</strong> to grab it, then retrace to (1,1) and press <strong>C</strong> to escape!</div>';
    } else if (percepts.stench && percepts.breeze) {
      html += '<div class="warning-box"><strong>Both Stench and Breeze!</strong> This is dangerous territory. The Wumpus AND a pit are both nearby. Be very careful about which room you enter next. Use the <strong>Hint (H)</strong> button if unsure.</div>';
    } else if (percepts.stench && !g.world.wumpusDead) {
      html += '<div class="warning-box"><strong>Stench!</strong> The Wumpus is in an adjacent room. Don\'t enter unknown rooms from here without reasoning first. Visit other rooms to figure out exactly where the Wumpus is, then shoot it!</div>';
    } else if (percepts.breeze) {
      html += '<div class="warning-box"><strong>Breeze!</strong> A pit is in an adjacent room. Avoid entering unknown rooms from here. Try approaching from a different direction to narrow down the pit\'s location.</div>';
    } else if (!percepts.stench && !percepts.breeze) {
      var adj = getAdjacent(g.agentR, g.agentC);
      var newSafe = [];
      for (var i = 0; i < adj.length; i++) {
        if (!g.visited.has(adj[i].r + ',' + adj[i].c)) {
          newSafe.push(internalStr(adj[i].r, adj[i].c));
        }
      }
      if (newSafe.length > 0) {
        html += '<div class="lesson-box"><strong>No danger nearby!</strong> Since there is no stench or breeze, all adjacent rooms are safe: <strong>' + newSafe.join(', ') + '</strong>. This is a great position to explore from!</div>';
      }
    }

    // Has gold reminder
    if (g.hasGold) {
      html += '<div class="lesson-box"><strong>You have the gold!</strong> Head back to (1,1) using rooms you\'ve already visited (safe path) and press <strong>C</strong> to climb out!</div>';
    }

    html += '<br>Controls: <strong>Arrow keys</strong> = move, <strong>G</strong> = grab, <strong>Space</strong> = shoot, <strong>C</strong> = climb, <strong>H</strong> = hint';
    return html;
  }

  // ===== Play Mode Rendering =====
  function renderPlayState() {
    var g = playGame;
    var percepts = g.alive ? getPercepts(g.world, g.agentR, g.agentC) : {};

    var gridState = {
      agentR: g.agentR, agentC: g.agentC,
      visited: g.visited, safe: g.safe, dangerous: g.dangerous,
      world: g.world, wumpusDead: g.world.wumpusDead, goldGrabbed: g.world.goldGrabbed,
      alive: g.alive,
      dead: !g.alive ? (g.log.length > 0 && g.log[g.log.length - 1].indexOf('Wumpus') !== -1 ? 'wumpus' : 'pit') : null,
      type: g.escaped ? 'done' : 'play'
    };

    renderGrid(gridState);
    renderPercepts(g.alive ? percepts : {});
    renderKB(g.kb);
    renderActionLog(g.log);

    var status = 'Exploring';
    if (!g.alive) status = 'DEAD!';
    if (g.escaped && g.hasGold) status = 'Victory!';
    if (g.escaped && !g.hasGold) status = 'Escaped (no gold)';
    renderScoreBar(g.score, g.actions, g.hasArrow, status);

    // Build explanation with learning intelligence
    var explanationHTML = '';
    if (!g.alive) {
      explanationHTML = generateDeathExplanation(g);
    } else if (g.escaped) {
      explanationHTML = g.hasGold
        ? '<strong>Victory!</strong> You escaped with the <span class="highlight-gold">gold</span>!<br><br>' +
          '<div class="lesson-box"><strong>Great job!</strong> You used logical reasoning like a real Knowledge-Based Agent:<br>' +
          '&bull; Perceived the environment through sensors<br>' +
          '&bull; Built a Knowledge Base of facts<br>' +
          '&bull; Used inference to determine safe rooms<br>' +
          '&bull; Made strategic decisions based on evidence</div>' +
          'Final score: <span class="highlight-score">' + g.score + '</span>. Press <strong>New Game (R)</strong> to play again!'
        : 'You escaped but <strong>without the gold</strong>. Score: <span class="highlight-score">' + g.score + '</span>.<br><br>' +
          '<div class="lesson-box">Remember: the goal is to find the gold (look for <span class="highlight-gold">Glitter</span>), grab it with <strong>G</strong>, return to (1,1), and climb out with <strong>C</strong>.</div>';
    } else if (shootMode) {
      explanationHTML = '<strong>Shoot Mode:</strong> Press an <strong>arrow key</strong> to choose the direction to fire your arrow. The arrow travels in a straight line until it hits the Wumpus or a wall.<br><br>' +
        '<div class="lesson-box">If you hear a <strong>SCREAM</strong>, the Wumpus is dead! If nothing happens, you missed. You only have ONE arrow, so choose wisely based on your stench observations!</div>' +
        'Press <strong>Escape</strong> to cancel.';
    } else {
      explanationHTML = generateMoveExplanation(g);
    }
    setHTML(explanationTextEl, explanationHTML);

    var gameOver = !g.alive || g.escaped;
    document.getElementById('btnUp').disabled = gameOver;
    document.getElementById('btnDown').disabled = gameOver;
    document.getElementById('btnLeft').disabled = gameOver;
    document.getElementById('btnRight').disabled = gameOver;
    document.getElementById('btnGrab').disabled = gameOver;
    document.getElementById('btnShoot').disabled = gameOver || !g.hasArrow;
    document.getElementById('btnClimb').disabled = gameOver;
    document.getElementById('btnHint').disabled = gameOver;
  }

  // ===== Mode Switching =====
  function switchMode(mode) {
    currentMode = mode;
    tabWatch.classList.toggle('active', mode === 'watch');
    tabPlay.classList.toggle('active', mode === 'play');
    watchControlsEl.classList.toggle('hidden', mode !== 'watch');
    playControlsEl.classList.toggle('hidden', mode !== 'play');
    stepCounterEl.classList.toggle('hidden', mode !== 'watch');

    if (mode === 'watch') {
      gridLabelEl.textContent = 'Wumpus World — 4x4 Cave (Guided)';
      renderWatchStep(watchStepIndex);
    } else {
      gridLabelEl.textContent = 'Wumpus World — 4x4 Cave (Interactive)';
      renderPlayState();
    }
  }

  // ===== Watch Mode Controls =====
  function watchNext() {
    if (isAnimating || currentMode !== 'watch') return;
    if (watchStepIndex >= watchSteps.length - 1) return;
    watchStepIndex++;
    renderWatchStep(watchStepIndex);
  }

  function watchSolve() {
    if (isAnimating || currentMode !== 'watch') return;
    if (watchStepIndex >= watchSteps.length - 1) return;
    isAnimating = true;
    btnNext.disabled = true;
    btnSolve.disabled = true;
    solveInterval = setInterval(function() {
      if (watchStepIndex >= watchSteps.length - 1) {
        clearInterval(solveInterval);
        isAnimating = false;
        renderWatchStep(watchStepIndex);
        return;
      }
      watchStepIndex++;
      renderWatchStep(watchStepIndex);
    }, 1800);
  }

  function watchResetFn() {
    if (solveInterval) clearInterval(solveInterval);
    isAnimating = false;
    watchStepIndex = 0;
    btnNext.disabled = false;
    btnSolve.disabled = false;
    renderWatchStep(0);
  }

  // ===== Play Mode Handlers =====
  function handlePlayMove(dr, dc) {
    if (currentMode !== 'play' || !playGame.alive || playGame.escaped) return;
    if (shootMode) {
      playShootArrow(playGame, dr, dc);
      shootMode = false;
      renderPlayState();
      return;
    }
    playMoveAgent(playGame, dr, dc);
    renderPlayState();
  }

  function handlePlayGrab() {
    if (currentMode !== 'play') return;
    playGrabGold(playGame);
    renderPlayState();
  }

  function handlePlayShoot() {
    if (currentMode !== 'play' || !playGame.hasArrow) return;
    shootMode = true;
    renderPlayState();
  }

  function handlePlayClimb() {
    if (currentMode !== 'play') return;
    playClimbOut(playGame);
    renderPlayState();
  }

  function handlePlayHint() {
    if (currentMode !== 'play' || !playGame.alive || playGame.escaped) return;
    var hint = generateHint(playGame);
    var dd = toDisplay(playGame.agentR, playGame.agentC);
    var percepts = getPercepts(playGame.world, playGame.agentR, playGame.agentC);
    var perceptStrs = [];
    if (percepts.stench) perceptStrs.push('<span class="highlight-stench">Stench</span>');
    if (percepts.breeze) perceptStrs.push('<span class="highlight-breeze">Breeze</span>');
    if (percepts.glitter) perceptStrs.push('<span class="highlight-gold">Glitter</span>');
    var perceptText = perceptStrs.length > 0 ? perceptStrs.join(', ') : 'Nothing';
    var html = 'Agent at <span class="highlight-agent">' + coordStr(dd.col, dd.row) + '</span>. Percepts: ' + perceptText + '.<br><br>' + hint;
    setHTML(explanationTextEl, html);
  }

  var playGameCount = 0; // Track how many games played

  function handlePlayReset() {
    playGameCount++;
    // First game uses classic layout for learning; subsequent games always randomize
    var world = playGameCount <= 1 ? createClassicWorld() : generateRandomWorld();
    playGame = createPlayGame(world);
    shootMode = false;
    renderPlayState();
  }

  // ===== Event Listeners =====
  btnNext.addEventListener('click', watchNext);
  btnSolve.addEventListener('click', watchSolve);
  btnReset.addEventListener('click', watchResetFn);

  tabWatch.addEventListener('click', function() { switchMode('watch'); });
  tabPlay.addEventListener('click', function() { switchMode('play'); });

  document.getElementById('btnUp').addEventListener('click', function() { handlePlayMove(-1, 0); });
  document.getElementById('btnDown').addEventListener('click', function() { handlePlayMove(1, 0); });
  document.getElementById('btnLeft').addEventListener('click', function() { handlePlayMove(0, -1); });
  document.getElementById('btnRight').addEventListener('click', function() { handlePlayMove(0, 1); });
  document.getElementById('btnGrab').addEventListener('click', handlePlayGrab);
  document.getElementById('btnShoot').addEventListener('click', handlePlayShoot);
  document.getElementById('btnClimb').addEventListener('click', handlePlayClimb);
  document.getElementById('btnHint').addEventListener('click', handlePlayHint);
  document.getElementById('btnPlayReset').addEventListener('click', function() { handlePlayReset(); });

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape' && shootMode) {
      shootMode = false;
      renderPlayState();
      return;
    }

    if (currentMode === 'watch') {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); watchNext(); }
      else if (e.key === 'Enter') { e.preventDefault(); watchSolve(); }
      else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); watchResetFn(); }
    } else if (currentMode === 'play') {
      if (e.key === 'ArrowUp') { e.preventDefault(); handlePlayMove(-1, 0); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); handlePlayMove(1, 0); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handlePlayMove(0, -1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); handlePlayMove(0, 1); }
      else if (e.key === 'g' || e.key === 'G') { e.preventDefault(); handlePlayGrab(); }
      else if (e.key === ' ') { e.preventDefault(); handlePlayShoot(); }
      else if (e.key === 'c' || e.key === 'C') { e.preventDefault(); handlePlayClimb(); }
      else if (e.key === 'h' || e.key === 'H') { e.preventDefault(); handlePlayHint(); }
      else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); handlePlayReset(); }
    }
  });

  // T key to switch modes
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      switchMode(currentMode === 'watch' ? 'play' : 'watch');
    }
  });

  // ===== Theme Toggle =====
  (function(){
    var t = document.querySelector('[data-theme-toggle]');
    var root = document.documentElement;
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', d);
    updateIcon();

    t && t.addEventListener('click', function() {
      d = d === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', d);
      updateIcon();
    });

    function updateIcon() {
      if (!t) return;
      t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
      // Trusted SVG content for theme toggle icon
      setHTML(t, d === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>');
    }
  })();

  // ===== Concepts Section =====
  var conceptsSection = document.getElementById('conceptsSection');
  var conceptsToggle = document.getElementById('conceptsToggle');
  var btnStartSim = document.getElementById('btnStartSim');

  conceptsToggle.addEventListener('click', function() {
    var isCollapsed = conceptsSection.classList.toggle('collapsed');
    conceptsToggle.setAttribute('aria-expanded', !isCollapsed);
  });

  document.querySelectorAll('.concept-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var card = header.closest('.concept-card');
      var isCollapsed = card.classList.toggle('collapsed');
      header.setAttribute('aria-expanded', !isCollapsed);
    });
  });

  btnStartSim.addEventListener('click', function() {
    conceptsSection.classList.add('collapsed');
    conceptsToggle.setAttribute('aria-expanded', 'false');
    var simSection = document.getElementById('simulationSection');
    setTimeout(function() {
      simSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  document.addEventListener('keydown', function(e) {
    if ((e.key === 's' || e.key === 'S') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (!conceptsSection.classList.contains('collapsed')) {
        e.preventDefault();
        btnStartSim.click();
      }
    }
  });

  // ===== Initialize =====
  switchMode('watch');
  renderWatchStep(0);

})();
