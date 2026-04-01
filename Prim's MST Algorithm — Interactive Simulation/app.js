// ===== Prim's MST Algorithm — Interactive Simulation =====
// SPPU | Third Year | Sem VI | 310253 — Artificial Intelligence
// Graph: 6 vertices (A-F), 10 weighted undirected edges. Starting vertex: A.

(function () {
  'use strict';

  // ===== Graph Definition =====
  const VERTICES = ['A', 'B', 'C', 'D', 'E', 'F'];

  const EDGES = [
    { u: 'A', v: 'B', w: 4 },
    { u: 'A', v: 'C', w: 4 },
    { u: 'B', v: 'C', w: 2 },
    { u: 'B', v: 'D', w: 3 },
    { u: 'B', v: 'E', w: 5 },
    { u: 'C', v: 'D', w: 1 },
    { u: 'C', v: 'E', w: 6 },
    { u: 'D', v: 'E', w: 7 },
    { u: 'D', v: 'F', w: 8 },
    { u: 'E', v: 'F', w: 9 }
  ];

  // Node positions for SVG rendering
  const NODE_POS = {
    A: { x: 150, y: 80 },
    B: { x: 350, y: 80 },
    C: { x: 150, y: 230 },
    D: { x: 350, y: 230 },
    E: { x: 150, y: 380 },
    F: { x: 350, y: 380 }
  };

  const START_VERTEX = 'A';
  const TOTAL_STEPS = 5; // 5 edge selections

  // ===== Build adjacency info =====
  function getEdgesFrom(vertex) {
    return EDGES.filter(e => e.u === vertex || e.v === vertex)
      .map(e => ({
        edge: e,
        neighbor: e.u === vertex ? e.v : e.u,
        weight: e.w
      }));
  }

  function edgeKey(e) {
    return [e.u, e.v].sort().join('-');
  }

  // ===== Pre-compute Prim's MST Solution =====
  function solvePrims() {
    const steps = [];
    const mstSet = new Set();
    const mstEdges = [];
    let mstWeight = 0;
    let candidates = []; // {edge, from, to, weight}

    // Step 0 (Init): Add starting vertex
    mstSet.add(START_VERTEX);

    // Find initial candidates
    const initEdges = getEdgesFrom(START_VERTEX);
    for (const e of initEdges) {
      if (!mstSet.has(e.neighbor)) {
        candidates.push({
          edge: e.edge,
          from: START_VERTEX,
          to: e.neighbor,
          weight: e.weight
        });
      }
    }
    candidates.sort((a, b) => a.weight - b.weight || a.to.localeCompare(b.to));

    steps.push({
      type: 'init',
      mstSet: new Set(mstSet),
      mstEdges: [...mstEdges],
      mstWeight: 0,
      candidates: [...candidates],
      selectedEdge: null,
      justAddedVertex: START_VERTEX,
      discardedEdges: [],
      explanation:
        `<strong>Initialization:</strong> We start by adding vertex <span class="highlight-mst">A</span> to our MST set. ` +
        `Currently MST = {<span class="highlight-mst">A</span>}.<br><br>` +
        `We look at all edges from A: <span class="highlight-candidate">A–B (weight 4)</span> and <span class="highlight-candidate">A–C (weight 4)</span>. ` +
        `These become our candidate edges.<br><br>` +
        `MST weight so far: <span class="highlight-weight">0</span>.`
    });

    // Steps 1-5: Pick cheapest edge each time
    const stepExplanations = [
      // Step 1: Pick A-B(4)
      function(cands, selected, newVertex, newCandidates, discarded, weight) {
        return `<strong>Step 1 — Pick cheapest edge:</strong> From candidates: ` +
          `<span class="highlight-candidate">A–B(4)</span>, <span class="highlight-candidate">A–C(4)</span>. ` +
          `Both have weight 4 — we pick <span class="highlight-selected">A–B</span> (alphabetical tiebreak).<br><br>` +
          `Vertex <span class="highlight-mst">B</span> joins the MST. New candidates from B: ` +
          `<span class="highlight-candidate">B–C(2)</span>, <span class="highlight-candidate">B–D(3)</span>, <span class="highlight-candidate">B–E(5)</span>.<br><br>` +
          `MST weight: <span class="highlight-weight">${weight}</span>.`;
      },
      // Step 2: Pick B-C(2)
      function(cands, selected, newVertex, newCandidates, discarded, weight) {
        return `<strong>Step 2 — Pick cheapest edge:</strong> Candidates: ` +
          `<span class="highlight-candidate">A–C(4)</span>, <span class="highlight-candidate">B–C(2)</span>, ` +
          `<span class="highlight-candidate">B–D(3)</span>, <span class="highlight-candidate">B–E(5)</span>. ` +
          `Smallest = <span class="highlight-selected">B–C(2)</span>.<br><br>` +
          `Vertex <span class="highlight-mst">C</span> joins the MST. New candidates from C: ` +
          `<span class="highlight-candidate">C–D(1)</span>, <span class="highlight-candidate">C–E(6)</span>. ` +
          `Note: A–C is now discarded since both A and C are in the MST.<br><br>` +
          `MST weight: <span class="highlight-weight">${weight}</span>.`;
      },
      // Step 3: Pick C-D(1)
      function(cands, selected, newVertex, newCandidates, discarded, weight) {
        return `<strong>Step 3 — Pick cheapest edge:</strong> Candidates: ` +
          `<span class="highlight-candidate">B–D(3)</span>, <span class="highlight-candidate">B–E(5)</span>, ` +
          `<span class="highlight-candidate">C–D(1)</span>, <span class="highlight-candidate">C–E(6)</span>. ` +
          `Smallest = <span class="highlight-selected">C–D(1)</span>.<br><br>` +
          `Vertex <span class="highlight-mst">D</span> joins the MST. New candidates from D: ` +
          `<span class="highlight-candidate">D–E(7)</span>, <span class="highlight-candidate">D–F(8)</span>. ` +
          `Note: B–D is discarded (both in MST).<br><br>` +
          `MST weight: <span class="highlight-weight">${weight}</span>.`;
      },
      // Step 4: Pick B-E(5)
      function(cands, selected, newVertex, newCandidates, discarded, weight) {
        return `<strong>Step 4 — Pick cheapest edge:</strong> Candidates: ` +
          `<span class="highlight-candidate">B–E(5)</span>, <span class="highlight-candidate">C–E(6)</span>, ` +
          `<span class="highlight-candidate">D–E(7)</span>, <span class="highlight-candidate">D–F(8)</span>. ` +
          `Smallest = <span class="highlight-selected">B–E(5)</span>.<br><br>` +
          `Vertex <span class="highlight-mst">E</span> joins the MST. New candidates from E: ` +
          `<span class="highlight-candidate">E–F(9)</span>. ` +
          `Discarded: C–E, D–E (both endpoints in MST).<br><br>` +
          `MST weight: <span class="highlight-weight">${weight}</span>.`;
      },
      // Step 5: Pick D-F(8)
      function(cands, selected, newVertex, newCandidates, discarded, weight) {
        return `<strong>Step 5 — Pick cheapest edge:</strong> Candidates: ` +
          `<span class="highlight-candidate">D–F(8)</span>, <span class="highlight-candidate">E–F(9)</span>. ` +
          `Smallest = <span class="highlight-selected">D–F(8)</span>.<br><br>` +
          `Vertex <span class="highlight-mst">F</span> joins the MST. All vertices are now included!<br><br>` +
          `MST weight: <span class="highlight-weight">${weight}</span>.`;
      }
    ];

    for (let stepIdx = 0; stepIdx < TOTAL_STEPS; stepIdx++) {
      // Pick cheapest candidate
      candidates.sort((a, b) => a.weight - b.weight || a.to.localeCompare(b.to));
      const selected = candidates[0];
      const newVertex = selected.to;

      // Add to MST
      mstSet.add(newVertex);
      mstEdges.push(selected.edge);
      mstWeight += selected.weight;

      // Remove selected from candidates
      candidates = candidates.filter(c => c !== selected);

      // Find new candidates from the new vertex
      const newEdges = getEdgesFrom(newVertex);
      const newCandidates = [];
      for (const e of newEdges) {
        if (!mstSet.has(e.neighbor)) {
          // Check not already in candidates
          const existing = candidates.find(c => edgeKey(c.edge) === edgeKey(e.edge));
          if (!existing) {
            const cand = { edge: e.edge, from: newVertex, to: e.neighbor, weight: e.weight };
            newCandidates.push(cand);
            candidates.push(cand);
          }
        }
      }

      // Discard candidates where both endpoints are now in MST
      const discarded = candidates.filter(c => mstSet.has(c.from) && mstSet.has(c.to));
      candidates = candidates.filter(c => !(mstSet.has(c.from) && mstSet.has(c.to)));

      candidates.sort((a, b) => a.weight - b.weight || a.to.localeCompare(b.to));

      steps.push({
        type: stepIdx === TOTAL_STEPS - 1 ? 'done' : 'pick',
        mstSet: new Set(mstSet),
        mstEdges: [...mstEdges],
        mstWeight: mstWeight,
        candidates: [...candidates],
        selectedEdge: selected.edge,
        justAddedVertex: newVertex,
        discardedEdges: discarded.map(d => d.edge),
        explanation: stepExplanations[stepIdx](candidates, selected, newVertex, newCandidates, discarded, mstWeight)
      });
    }

    // Final "Done" step explanation override
    const lastStep = steps[steps.length - 1];
    lastStep.explanation +=
      `<br><br><strong>MST Complete!</strong> All 6 vertices are connected! ` +
      `MST = {<span class="highlight-mst">A–B(4)</span>, <span class="highlight-mst">B–C(2)</span>, ` +
      `<span class="highlight-mst">C–D(1)</span>, <span class="highlight-mst">B–E(5)</span>, ` +
      `<span class="highlight-mst">D–F(8)</span>}. ` +
      `Total weight: <span class="highlight-weight">20</span>.<br><br>` +
      `Prim's greedy strategy of always picking the cheapest edge guaranteed the optimal solution.`;

    return steps;
  }

  const allSteps = solvePrims();

  // ===== UI State =====
  let currentStepIndex = 0;
  let isAnimating = false;
  let solveInterval = null;

  // ===== DOM Elements =====
  const graphSvg = document.getElementById('graphSvg');
  const mstWeightDisplay = document.getElementById('mstWeightDisplay');
  const explanationTextEl = document.getElementById('explanationText');
  const mstSetListEl = document.getElementById('mstSetList');
  const candidateListEl = document.getElementById('candidateList');
  const mstCountEl = document.getElementById('mstCount');
  const candidateCountEl = document.getElementById('candidateCount');
  const solutionPathEl = document.getElementById('solutionPath');
  const stepNumEl = document.getElementById('stepNum');
  const totalStepsEl = document.getElementById('totalSteps');
  const progressFillEl = document.getElementById('progressFill');
  const btnNext = document.getElementById('btnNextStep');
  const btnSolve = document.getElementById('btnSolve');
  const btnReset = document.getElementById('btnReset');

  // ===== SVG Rendering =====
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function createSVGElement(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
    return el;
  }

  // Compute label positions for edge weights (offset from midpoint to avoid overlap)
  function getWeightLabelPos(edge) {
    const p1 = NODE_POS[edge.u];
    const p2 = NODE_POS[edge.v];
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    // Offset perpendicular to the edge for clarity
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    // Perpendicular unit vector
    const px = -dy / len;
    const py = dx / len;
    const offset = 14;

    // Some edges need special positioning to avoid overlap
    const key = edgeKey(edge);
    const specialOffsets = {
      'A-B': { ox: 0, oy: -12 },
      'A-C': { ox: -16, oy: 0 },
      'B-C': { ox: -16, oy: -4 },
      'B-D': { ox: 16, oy: 0 },
      'B-E': { ox: 14, oy: 6 },
      'C-D': { ox: 0, oy: -12 },
      'C-E': { ox: -16, oy: 0 },
      'D-E': { ox: 16, oy: 4 },
      'D-F': { ox: 16, oy: 0 },
      'E-F': { ox: 0, oy: 14 }
    };

    if (specialOffsets[key]) {
      return { x: mx + specialOffsets[key].ox, y: my + specialOffsets[key].oy };
    }

    return { x: mx + px * offset, y: my + py * offset };
  }

  function renderGraph(step) {
    graphSvg.innerHTML = '';

    const mstSet = step.mstSet;
    const mstEdgeKeys = new Set(step.mstEdges.map(e => edgeKey(e)));
    const candidateEdgeKeys = new Set(step.candidates.map(c => edgeKey(c.edge)));
    const selectedEdgeKey = step.selectedEdge ? edgeKey(step.selectedEdge) : null;
    const discardedKeys = new Set((step.discardedEdges || []).map(e => edgeKey(e)));

    // --- DEFS for glow filter ---
    const defs = createSVGElement('defs', {});
    const filter = createSVGElement('filter', { id: 'glow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    const feGauss = createSVGElement('feGaussianBlur', { stdDeviation: '3', result: 'coloredBlur' });
    const feMerge = createSVGElement('feMerge', {});
    const feMerge1 = createSVGElement('feMergeNode', { in: 'coloredBlur' });
    const feMerge2 = createSVGElement('feMergeNode', { in: 'SourceGraphic' });
    feMerge.appendChild(feMerge1);
    feMerge.appendChild(feMerge2);
    filter.appendChild(feGauss);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    graphSvg.appendChild(defs);

    // --- Render edges ---
    const edgeGroup = createSVGElement('g', { class: 'edges-group' });

    for (const edge of EDGES) {
      const p1 = NODE_POS[edge.u];
      const p2 = NODE_POS[edge.v];
      const key = edgeKey(edge);

      let className = 'graph-edge graph-edge-default';
      let extraAttrs = {};

      if (key === selectedEdgeKey) {
        className = 'graph-edge graph-edge-selected';
        extraAttrs.filter = 'url(#glow)';
      } else if (mstEdgeKeys.has(key)) {
        className = 'graph-edge graph-edge-mst';
      } else if (candidateEdgeKeys.has(key)) {
        className = 'graph-edge graph-edge-candidate';
      } else if (discardedKeys.has(key)) {
        className = 'graph-edge graph-edge-discarded';
      }

      const line = createSVGElement('line', {
        x1: p1.x, y1: p1.y,
        x2: p2.x, y2: p2.y,
        class: className,
        ...extraAttrs
      });
      edgeGroup.appendChild(line);
    }
    graphSvg.appendChild(edgeGroup);

    // --- Render weight labels ---
    const labelGroup = createSVGElement('g', { class: 'weight-labels-group' });

    for (const edge of EDGES) {
      const key = edgeKey(edge);
      const pos = getWeightLabelPos(edge);

      let weightClass = 'graph-weight-label weight-default';
      if (key === selectedEdgeKey) {
        weightClass = 'graph-weight-label weight-selected';
      } else if (mstEdgeKeys.has(key)) {
        weightClass = 'graph-weight-label weight-mst';
      } else if (candidateEdgeKeys.has(key)) {
        weightClass = 'graph-weight-label weight-candidate';
      }

      // Background rect for readability
      const bgRect = createSVGElement('rect', {
        x: pos.x - 10, y: pos.y - 10,
        width: 20, height: 20,
        class: 'graph-weight-bg',
        rx: 4, ry: 4
      });
      labelGroup.appendChild(bgRect);

      const text = createSVGElement('text', {
        x: pos.x, y: pos.y,
        class: weightClass
      });
      text.textContent = edge.w;
      labelGroup.appendChild(text);
    }
    graphSvg.appendChild(labelGroup);

    // --- Render nodes ---
    const nodeGroup = createSVGElement('g', { class: 'nodes-group' });

    for (const v of VERTICES) {
      const pos = NODE_POS[v];
      const inMst = mstSet.has(v);
      const justAdded = step.justAddedVertex === v && currentStepIndex > 0;

      const circle = createSVGElement('circle', {
        cx: pos.x, cy: pos.y, r: 22,
        class: `graph-node ${inMst ? 'graph-node-mst' : 'graph-node-default'}${justAdded ? ' graph-node-just-added' : ''}`
      });
      nodeGroup.appendChild(circle);

      const label = createSVGElement('text', {
        x: pos.x, y: pos.y,
        class: `graph-node-label ${inMst ? 'graph-node-label-mst' : 'graph-node-label-default'}`
      });
      label.textContent = v;
      nodeGroup.appendChild(label);
    }
    graphSvg.appendChild(nodeGroup);

    // If done, add celebration class
    if (step.type === 'done') {
      graphSvg.classList.add('graph-complete');
    } else {
      graphSvg.classList.remove('graph-complete');
    }
  }

  // ===== Render Sidebar =====
  function renderMstSet(step) {
    const mstArr = VERTICES.filter(v => step.mstSet.has(v));
    mstCountEl.textContent = mstArr.length;

    if (mstArr.length === 0) {
      mstSetListEl.innerHTML = '<div class="list-empty">Will be populated when algorithm starts</div>';
      return;
    }

    mstSetListEl.innerHTML = mstArr.map(v => {
      const isJust = step.justAddedVertex === v;
      return `<div class="list-item ${isJust ? 'active' : ''}">
        <span class="vertex-badge in-mst">${v}</span>
        <span class="edge-info">${v === START_VERTEX ? 'Starting vertex' : 'Added to MST'}</span>
      </div>`;
    }).join('');
  }

  function renderCandidates(step) {
    const cands = step.candidates;
    candidateCountEl.textContent = cands.length;

    if (cands.length === 0 && step.type === 'init') {
      // Show initial candidates
      candidateListEl.innerHTML = '<div class="list-empty">Will be populated when algorithm starts</div>';
      return;
    }

    if (cands.length === 0) {
      candidateListEl.innerHTML = '<div class="list-empty">No candidates — all vertices in MST</div>';
      return;
    }

    candidateListEl.innerHTML = cands.map(c => {
      return `<div class="list-item">
        <span class="vertex-badge not-mst" style="background: var(--color-warning); width: 22px; height: 22px; font-size: 0.65rem;">${c.edge.u}${c.edge.v}</span>
        <span class="edge-info">${c.edge.u}–${c.edge.v}</span>
        <span class="edge-weight">w=${c.weight}</span>
      </div>`;
    }).join('');
  }

  function renderSolutionPath(step) {
    const edges = step.mstEdges;

    if (edges.length === 0) {
      solutionPathEl.innerHTML = '<div class="list-empty">Selected MST edges will appear here</div>';
      return;
    }

    let runningWeight = 0;
    solutionPathEl.innerHTML = edges.map((e, idx) => {
      runningWeight += e.w;
      const isCurrent = idx === edges.length - 1;
      return `<div class="move-item ${isCurrent ? 'current' : ''}">
        <span class="move-num">${idx + 1}</span>
        <span>${e.u}–${e.v} (weight <strong>${e.w}</strong>) → total: ${runningWeight}</span>
      </div>`;
    }).join('');

    solutionPathEl.scrollTop = solutionPathEl.scrollHeight;
  }

  // ===== Render Full Step =====
  function renderStep(index) {
    if (index < 0 || index >= allSteps.length) return;

    const step = allSteps[index];

    // Graph
    renderGraph(step);

    // MST Weight
    mstWeightDisplay.innerHTML = `MST Weight: <span class="cost-accent">${step.mstWeight}</span>`;

    // Explanation
    explanationTextEl.innerHTML = step.explanation;

    // Sidebar
    renderMstSet(step);
    renderCandidates(step);
    renderSolutionPath(step);

    // Step counter
    stepNumEl.textContent = index;
    totalStepsEl.textContent = allSteps.length - 1;
    const pct = allSteps.length > 1 ? (index / (allSteps.length - 1)) * 100 : 0;
    progressFillEl.style.width = pct + '%';

    // Button states
    if (step.type === 'done') {
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
    }, 1200);
  }

  function reset() {
    if (solveInterval) clearInterval(solveInterval);
    isAnimating = false;
    currentStepIndex = 0;
    btnNext.disabled = false;
    btnSolve.disabled = false;
    explanationTextEl.innerHTML =
      'Press <strong>Next Step (→)</strong> to begin Prim\'s algorithm, or <strong>Solve Completely (Enter)</strong> to see the full solution animated.';
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

  // ===== Concepts Section — Expand/Collapse Logic =====
  const conceptsSection = document.getElementById('conceptsSection');
  const conceptsToggle = document.getElementById('conceptsToggle');
  const btnStartSim = document.getElementById('btnStartSim');

  // Toggle entire section
  conceptsToggle.addEventListener('click', () => {
    const isCollapsed = conceptsSection.classList.toggle('collapsed');
    conceptsToggle.setAttribute('aria-expanded', !isCollapsed);
  });

  // Individual card expand/collapse
  document.querySelectorAll('.concept-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.concept-card');
      const isCollapsed = card.classList.toggle('collapsed');
      header.setAttribute('aria-expanded', !isCollapsed);
    });
  });

  // "Start Simulation" button
  btnStartSim.addEventListener('click', () => {
    conceptsSection.classList.add('collapsed');
    conceptsToggle.setAttribute('aria-expanded', 'false');
    const simSection = document.getElementById('simulationSection');
    setTimeout(() => {
      simSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  });

  // Keyboard shortcut: S key to start simulation
  document.addEventListener('keydown', (e) => {
    if ((e.key === 's' || e.key === 'S') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (!conceptsSection.classList.contains('collapsed')) {
        e.preventDefault();
        btnStartSim.click();
      }
    }
  });

  // ===== Initialize =====
  renderStep(0);

})();
