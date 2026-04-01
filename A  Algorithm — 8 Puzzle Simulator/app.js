// ===== A* Algorithm for 8-Puzzle — Interactive Simulation =====
// SPPU | Third Year | Sem VI | 310253 — Artificial Intelligence
// Initial: [2,8,3,1,6,4,7,0,5]  Goal: [1,2,3,8,0,4,7,6,5]  (0 = blank)

(function () {
  'use strict';

  // ===== Problem Definition =====
  const INITIAL = [2, 8, 3, 1, 6, 4, 7, 0, 5];
  const GOAL    = [1, 2, 3, 8, 0, 4, 7, 6, 5];

  // ===== State Helpers =====
  function stateKey(s) { return s.join(','); }

  function findBlank(s) { return s.indexOf(0); }

  // Returns array of possible neighbor states
  function getNeighbors(state) {
    const blank = findBlank(state);
    const row = Math.floor(blank / 3);
    const col = blank % 3;
    const moves = [];

    // Up
    if (row > 0) moves.push({ dir: 'Up', pos: blank - 3 });
    // Down
    if (row < 2) moves.push({ dir: 'Down', pos: blank + 3 });
    // Left
    if (col > 0) moves.push({ dir: 'Left', pos: blank - 1 });
    // Right
    if (col < 2) moves.push({ dir: 'Right', pos: blank + 1 });

    return moves.map(m => {
      const next = state.slice();
      next[blank] = next[m.pos];
      next[m.pos] = 0;
      return { state: next, move: m.dir, movedTile: state[m.pos] };
    });
  }

  // Heuristic: misplaced tiles (not counting blank)
  function heuristic(state) {
    let count = 0;
    for (let i = 0; i < 9; i++) {
      if (state[i] !== 0 && state[i] !== GOAL[i]) count++;
    }
    return count;
  }

  function isGoal(state) { return stateKey(state) === stateKey(GOAL); }

  // ===== Helper: list misplaced tile numbers =====
  function getMisplacedTiles(state) {
    const tiles = [];
    for (let i = 0; i < 9; i++) {
      if (state[i] !== 0 && state[i] !== GOAL[i]) tiles.push(state[i]);
    }
    return tiles;
  }

  // ===== Helper: describe blank position =====
  function blankPosDesc(state) {
    const b = findBlank(state);
    const row = Math.floor(b / 3);
    const col = b % 3;
    return `[${row},${col}]`;
  }

  // ===== Helper: describe which tiles can slide =====
  function describeSlideable(state) {
    const blank = findBlank(state);
    const row = Math.floor(blank / 3);
    const col = blank % 3;
    const parts = [];
    if (row > 0) parts.push(`tile ${state[blank - 3]} (above blank, slide Down)`);
    if (row < 2) parts.push(`tile ${state[blank + 3]} (below blank, slide Up)`);
    if (col > 0) parts.push(`tile ${state[blank - 1]} (left of blank, slide Right)`);
    if (col < 2) parts.push(`tile ${state[blank + 1]} (right of blank, slide Left)`);
    return parts;
  }

  // ===== Pre-compute the A* Solution =====
  // We record every "algorithm step" so we can replay it
  function solveAStar() {
    const steps = [];
    const openList = [];
    const closedSet = new Set();
    const gScores = {};
    const parents = {};

    const startKey = stateKey(INITIAL);
    const h0 = heuristic(INITIAL);
    gScores[startKey] = 0;

    openList.push({
      state: INITIAL,
      g: 0,
      h: h0,
      f: h0,
      key: startKey,
      move: null,
      movedTile: null
    });

    const misplacedStart = getMisplacedTiles(INITIAL);

    // Step 0: Initial state — ENHANCED explanation
    steps.push({
      type: 'init',
      currentState: INITIAL,
      g: 0, h: h0, f: h0,
      openSnapshot: openList.map(n => ({ ...n })),
      closedSnapshot: [],
      explanation: `<strong>Step 1 — Initialize:</strong> We place the <strong>initial state</strong> into the OPEN list. ` +
        `The blank tile is at position ${blankPosDesc(INITIAL)} (row ${Math.floor(findBlank(INITIAL)/3)}, column ${findBlank(INITIAL)%3}, counting from 0).<br><br>` +
        `<strong>Let's calculate h(n):</strong> Comparing each position to the goal — ` +
        `tiles <strong>${misplacedStart.join(', ')}</strong> are not in their correct positions, ` +
        `so <span class="highlight-h">h(n) = ${h0}</span> misplaced tiles.<br><br>` +
        `We calculate: <span class="highlight-g">g(n) = 0</span> (no moves yet), ` +
        `<span class="highlight-h">h(n) = ${h0}</span>, ` +
        `so <span class="highlight-f">f(n) = 0 + ${h0} = ${h0}</span>.<br><br>` +
        `The OPEN list now has 1 state. The CLOSED list is empty. A* will next pick the state with the lowest f(n) from OPEN.`
    });

    let found = false;

    while (openList.length > 0) {
      // Sort OPEN by f, then h as tiebreaker
      openList.sort((a, b) => a.f - b.f || a.h - b.h);

      // Pick the best node
      const current = openList.shift();
      const curKey = current.key;

      if (closedSet.has(curKey)) continue;
      closedSet.add(curKey);

      const closedArr = [];
      closedSet.forEach(k => {
        const s = k.split(',').map(Number);
        closedArr.push({ state: s, g: gScores[k], h: heuristic(s), f: gScores[k] + heuristic(s), key: k });
      });

      // Step: Pick from OPEN — ENHANCED explanation
      steps.push({
        type: 'pick',
        currentState: current.state,
        g: current.g, h: current.h, f: current.f,
        move: current.move,
        movedTile: current.movedTile,
        openSnapshot: openList.filter(n => !closedSet.has(n.key)).map(n => ({ ...n })),
        closedSnapshot: closedArr,
        explanation: generatePickExplanation(current, openList, closedArr)
      });

      if (isGoal(current.state)) {
        // Reconstruct path
        const path = [];
        let key = curKey;
        while (parents[key]) {
          path.unshift(parents[key]);
          key = parents[key].parentKey;
        }

        // ENHANCED solved explanation
        const totalExplored = closedArr.length;
        steps.push({
          type: 'solved',
          currentState: current.state,
          g: current.g, h: 0, f: current.f,
          openSnapshot: openList.filter(n => !closedSet.has(n.key)).map(n => ({ ...n })),
          closedSnapshot: closedArr,
          path: path,
          explanation: `<strong>🎉 Goal Reached!</strong> The current state matches the goal state — ` +
            `<span class="highlight-h">h(n) = 0</span> means <strong>zero misplaced tiles</strong>. Every tile is exactly where it should be!<br><br>` +
            `The solution took <span class="highlight-g">${current.g} moves</span> and A* explored only ` +
            `<strong>${totalExplored} states</strong> total (much less than trying all possibilities blindly).<br><br>` +
            `<strong>Why is this optimal?</strong> The misplaced tiles heuristic is <em>admissible</em> — it never overestimates the true cost. ` +
            `A* with an admissible heuristic is guaranteed to find the shortest solution path.`
        });
        found = true;
        break;
      }

      // Expand: get neighbors
      const neighbors = getNeighbors(current.state);
      const newNeighbors = [];

      for (const nb of neighbors) {
        const nbKey = stateKey(nb.state);
        const tentG = current.g + 1;

        if (closedSet.has(nbKey)) continue;

        if (gScores[nbKey] === undefined || tentG < gScores[nbKey]) {
          gScores[nbKey] = tentG;
          const nbH = heuristic(nb.state);
          const nbF = tentG + nbH;
          parents[nbKey] = { parentKey: curKey, move: nb.move, movedTile: nb.movedTile, state: nb.state };

          openList.push({
            state: nb.state,
            g: tentG,
            h: nbH,
            f: nbF,
            key: nbKey,
            move: nb.move,
            movedTile: nb.movedTile
          });

          newNeighbors.push({ state: nb.state, g: tentG, h: nbH, f: nbF, move: nb.move, movedTile: nb.movedTile });
        }
      }

      // Step: Expand — ENHANCED explanation
      const updatedClosedArr = [];
      closedSet.forEach(k => {
        const s = k.split(',').map(Number);
        updatedClosedArr.push({ state: s, g: gScores[k], h: heuristic(s), f: gScores[k] + heuristic(s), key: k });
      });

      steps.push({
        type: 'expand',
        currentState: current.state,
        g: current.g, h: current.h, f: current.f,
        neighbors: newNeighbors,
        openSnapshot: openList.filter(n => !closedSet.has(n.key)).map(n => ({ ...n })),
        closedSnapshot: updatedClosedArr,
        explanation: generateExpandExplanation(current, neighbors, newNeighbors, openList.filter(n => !closedSet.has(n.key)), closedSet)
      });
    }

    if (!found) {
      steps.push({
        type: 'fail',
        explanation: 'The OPEN list is empty and the goal was not reached. This puzzle is unsolvable.'
      });
    }

    return steps;
  }

  // ENHANCED pick explanation
  function generatePickExplanation(current, openAfter, closedArr) {
    const moveDesc = current.move
      ? `We moved tile <span class="highlight-move">${current.movedTile}</span> <span class="highlight-move">${current.move}</span> (swapped with the blank).`
      : '';

    const openRemaining = openAfter.filter(n => true).length;
    const misplaced = getMisplacedTiles(current.state);
    const misplacedDesc = misplaced.length > 0
      ? `Tiles <strong>${misplaced.join(', ')}</strong> are still misplaced.`
      : `All tiles are in their correct positions!`;

    return `<strong>Pick from OPEN:</strong> A* always picks the state with the <strong>smallest f(n)</strong> because this state looks most promising — it has the best balance of "moves already made" and "estimated moves remaining."<br><br>` +
      `${moveDesc ? moveDesc + '<br><br>' : ''}` +
      `For this state: <span class="highlight-g">g(n) = ${current.g}</span> (${current.g} move${current.g !== 1 ? 's' : ''} from start), ` +
      `<span class="highlight-h">h(n) = ${current.h}</span> (${current.h} misplaced tile${current.h !== 1 ? 's' : ''}), ` +
      `<span class="highlight-f">f(n) = ${current.g} + ${current.h} = ${current.f}</span>. ${misplacedDesc}<br><br>` +
      `OPEN has ${openRemaining} state${openRemaining !== 1 ? 's' : ''} remaining. CLOSED has ${closedArr.length} state${closedArr.length !== 1 ? 's' : ''}.`;
  }

  // ENHANCED expand explanation — now receives ALL neighbors (including skipped) for full context
  function generateExpandExplanation(current, allNeighbors, newNeighbors, openAfter, closedSet) {
    const slideable = describeSlideable(current.state);
    const skippedCount = allNeighbors.length - newNeighbors.length;

    let skippedDesc = '';
    if (skippedCount > 0) {
      // Find which neighbors were skipped (already in CLOSED)
      const skippedNeighbors = allNeighbors.filter(nb => {
        const nbKey = stateKey(nb.state);
        return closedSet.has(nbKey);
      });
      if (skippedNeighbors.length > 0) {
        skippedDesc = `<br><br><strong>${skippedNeighbors.length} neighbor${skippedNeighbors.length > 1 ? 's were' : ' was'} skipped</strong> — ` +
          `already in CLOSED (${skippedNeighbors.map(n => `tile ${n.movedTile} ${n.move}`).join(', ')}). ` +
          `A* never revisits states already explored.`;
      }
    }

    if (newNeighbors.length === 0) {
      return `<strong>Expand:</strong> The blank is at position ${blankPosDesc(current.state)}. ` +
        `Tiles that can slide: ${slideable.join('; ')}.<br><br>` +
        `However, all possible neighbors are already in the CLOSED list (already visited). ` +
        `No new states added to OPEN.${skippedDesc}`;
    }

    const neighborDescs = newNeighbors.map(nb => {
      const misplaced = getMisplacedTiles(nb.state);
      return `Move tile <span class="highlight-move">${nb.movedTile}</span> <span class="highlight-move">${nb.move}</span>: ` +
        `<span class="highlight-g">g=${nb.g}</span>, <span class="highlight-h">h=${nb.h}</span> (${misplaced.length > 0 ? 'tiles ' + misplaced.join(',') + ' misplaced' : 'all correct!'}), ` +
        `<span class="highlight-f">f=${nb.f}</span>`;
    });

    return `<strong>Expand:</strong> The blank is at position ${blankPosDesc(current.state)}. ` +
      `Tiles that can slide into the blank: ${slideable.join('; ')}.<br><br>` +
      `States already in CLOSED are skipped.${skippedDesc}<br><br>` +
      `<strong>New states added to OPEN:</strong><br>` +
      neighborDescs.map(d => `&nbsp;&nbsp;• ${d}`).join('<br>') +
      `<br><br>OPEN now has <strong>${openAfter.length}</strong> state${openAfter.length !== 1 ? 's' : ''} to explore. ` +
      `Next, A* will pick the one with the smallest f(n).`;
  }

  // ===== Pre-compute =====
  const allSteps = solveAStar();

  // Extract the solution path steps (only 'pick' steps that lead to goal)
  const solutionPath = [];
  for (const step of allSteps) {
    if (step.type === 'pick' || step.type === 'init') {
      solutionPath.push(step);
    }
  }

  // ===== UI State =====
  let currentStepIndex = 0;
  let isAnimating = false;
  let solveInterval = null;

  // ===== DOM Elements =====
  const currentGridEl = document.getElementById('currentGrid');
  const goalGridEl = document.getElementById('goalGrid');
  const currentCostEl = document.getElementById('currentCost');
  const explanationTextEl = document.getElementById('explanationText');
  const openListEl = document.getElementById('openList');
  const closedListEl = document.getElementById('closedList');
  const openCountEl = document.getElementById('openCount');
  const closedCountEl = document.getElementById('closedCount');
  const moveHistoryEl = document.getElementById('moveHistory');
  const stepNumEl = document.getElementById('stepNum');
  const totalStepsEl = document.getElementById('totalSteps');
  const progressFillEl = document.getElementById('progressFill');
  const btnNext = document.getElementById('btnNextStep');
  const btnSolve = document.getElementById('btnSolve');
  const btnReset = document.getElementById('btnReset');

  // ===== Render Functions =====
  function renderGrid(container, state, goalState, movedTileValue) {
    container.innerHTML = '';
    container.classList.remove('solved');

    state.forEach((val, idx) => {
      const tile = document.createElement('div');
      tile.className = 'tile';

      if (val === 0) {
        tile.classList.add('empty');
        tile.textContent = '';
      } else {
        tile.textContent = val;
        if (goalState && val === goalState[idx]) {
          tile.classList.add('correct');
        } else {
          tile.classList.add('wrong');
        }
        if (movedTileValue !== null && movedTileValue !== undefined && val === movedTileValue) {
          tile.classList.add('just-moved');
        }
      }

      container.appendChild(tile);
    });
  }

  function renderGoalGrid() {
    renderGrid(goalGridEl, GOAL, GOAL, null);
  }

  function renderCosts(g, h, f) {
    currentCostEl.innerHTML =
      `<span class="cost-g">g(n)=${g}</span> + ` +
      `<span class="cost-h">h(n)=${h}</span> = ` +
      `<span class="cost-f">f(n)=${f}</span>`;
  }

  function renderMiniGrid(state) {
    let html = '<div class="mini-grid">';
    state.forEach(val => {
      if (val === 0) {
        html += '<div class="mini-tile mini-empty"></div>';
      } else {
        html += `<div class="mini-tile">${val}</div>`;
      }
    });
    html += '</div>';
    return html;
  }

  function renderListItems(container, items, activeKey) {
    if (!items || items.length === 0) {
      container.innerHTML = '<div class="list-empty">Empty</div>';
      return;
    }

    // Show latest items first, limit display
    const display = items.slice(0, 30);
    container.innerHTML = display.map(item => {
      const isActive = activeKey && item.key === activeKey;
      return `<div class="list-item ${isActive ? 'active' : ''}">
        ${renderMiniGrid(item.state)}
        <div class="item-costs">
          <span class="cost-g-val">g=${item.g}</span>
          <span class="cost-h-val">h=${item.h}</span>
          <span class="cost-f-val">f=${item.f}</span>
        </div>
      </div>`;
    }).join('');
  }

  function renderMoveHistory(steps, currentIdx) {
    // Collect the path of pick steps up to current
    const picks = [];
    for (let i = 0; i <= currentIdx; i++) {
      if (allSteps[i].type === 'pick' && allSteps[i].move) {
        picks.push(allSteps[i]);
      }
    }

    if (picks.length === 0) {
      moveHistoryEl.innerHTML = '<div class="list-empty">Solution path will appear here</div>';
      return;
    }

    moveHistoryEl.innerHTML = picks.map((p, idx) => {
      const isCurrent = idx === picks.length - 1;
      return `<div class="move-item ${isCurrent ? 'current' : ''}">
        <span class="move-num">${idx + 1}</span>
        <span>Move tile <strong>${p.movedTile}</strong> ${p.move} → f=${p.f}</span>
      </div>`;
    }).join('');

    moveHistoryEl.scrollTop = moveHistoryEl.scrollHeight;
  }

  function renderStep(index) {
    if (index < 0 || index >= allSteps.length) return;

    const step = allSteps[index];

    // Update grid
    const movedTile = (step.type === 'pick' && step.movedTile) ? step.movedTile : null;
    renderGrid(currentGridEl, step.currentState || INITIAL, GOAL, movedTile);

    // Costs
    renderCosts(step.g || 0, step.h || 0, step.f || 0);

    // Explanation
    explanationTextEl.innerHTML = step.explanation;

    // OPEN / CLOSED lists
    const openItems = step.openSnapshot || [];
    const closedItems = step.closedSnapshot || [];

    // Sort open by f for display
    openItems.sort((a, b) => a.f - b.f || a.h - b.h);

    renderListItems(openListEl, openItems, null);
    renderListItems(closedListEl, closedItems, step.type === 'pick' ? stateKey(step.currentState) : null);

    openCountEl.textContent = openItems.length;
    closedCountEl.textContent = closedItems.length;

    // Move history
    renderMoveHistory(allSteps, index);

    // Step counter
    stepNumEl.textContent = index;
    totalStepsEl.textContent = allSteps.length - 1;
    const pct = allSteps.length > 1 ? (index / (allSteps.length - 1)) * 100 : 0;
    progressFillEl.style.width = pct + '%';

    // If solved
    if (step.type === 'solved') {
      currentGridEl.classList.add('solved');
      btnNext.disabled = true;
      btnSolve.disabled = true;
    }
  }

  // ===== Controls =====
  function nextStep() {
    if (isAnimating) return;
    if (currentStepIndex >= allSteps.length - 1) return;
    currentStepIndex++;
    renderStep(currentStepIndex);
  }

  function solveCompletely() {
    if (isAnimating) return;
    if (currentStepIndex >= allSteps.length - 1) return;

    isAnimating = true;
    btnNext.disabled = true;
    btnSolve.disabled = true;

    solveInterval = setInterval(() => {
      if (currentStepIndex >= allSteps.length - 1) {
        clearInterval(solveInterval);
        isAnimating = false;
        renderStep(currentStepIndex);
        return;
      }
      currentStepIndex++;
      renderStep(currentStepIndex);
    }, 600);
  }

  function reset() {
    if (solveInterval) clearInterval(solveInterval);
    isAnimating = false;
    currentStepIndex = 0;
    btnNext.disabled = false;
    btnSolve.disabled = false;
    renderStep(0);
  }

  // ===== Event Listeners =====
  btnNext.addEventListener('click', nextStep);
  btnSolve.addEventListener('click', solveCompletely);
  btnReset.addEventListener('click', reset);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextStep();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      solveCompletely();
    } else if (e.key === 'r' || e.key === 'R') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        reset();
      }
    }
  });

  // ===== Theme Toggle =====
  (function(){
    const t = document.querySelector('[data-theme-toggle]');
    const r = document.documentElement;
    let d = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    r.setAttribute('data-theme', d);
    updateToggleIcon();

    t && t.addEventListener('click', () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      updateToggleIcon();
    });

    function updateToggleIcon() {
      if (!t) return;
      t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
      t.innerHTML = d === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  })();

  // ===== Initialize =====
  renderGoalGrid();
  renderStep(0);


  // ============================================================
  //  CONCEPTS SECTION — Expand/Collapse Logic
  // ============================================================

  const conceptsSection = document.getElementById('conceptsSection');
  const conceptsToggle = document.getElementById('conceptsToggle');
  const conceptsBody = document.getElementById('conceptsBody');
  const btnStartSim = document.getElementById('btnStartSim');

  // Concepts start expanded by default

  // --- Toggle entire section ---
  conceptsToggle.addEventListener('click', () => {
    const isCollapsed = conceptsSection.classList.toggle('collapsed');
    conceptsToggle.setAttribute('aria-expanded', !isCollapsed);
    // State stored in DOM class only
  });

  // --- Individual card expand/collapse ---
  document.querySelectorAll('.concept-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.concept-card');
      const isCollapsed = card.classList.toggle('collapsed');
      header.setAttribute('aria-expanded', !isCollapsed);
    });
  });

  // --- "Start Simulation" button ---
  btnStartSim.addEventListener('click', () => {
    // Collapse the concepts section
    conceptsSection.classList.add('collapsed');
    conceptsToggle.setAttribute('aria-expanded', 'false');
    // Smooth scroll to the simulation
    const simSection = document.getElementById('simulationSection');
    setTimeout(() => {
      simSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  // --- Keyboard shortcut: S key to start simulation ---
  document.addEventListener('keydown', (e) => {
    if ((e.key === 's' || e.key === 'S') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      // Only trigger if concepts section is expanded
      if (!conceptsSection.classList.contains('collapsed')) {
        e.preventDefault();
        btnStartSim.click();
      }
    }
  });

})();
