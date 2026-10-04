// Scripted "brief → system" orchestration run for the homepage.
// Pure DOM, no dependencies. Each brief is a list of timed steps that
// mutate the diagram, the log and the pipeline indicator.

type Stage = 'brief' | 'design' | 'build' | 'review' | 'ship';
type NodeState = 'idle' | 'design' | 'build' | 'reject' | 'done' | 'ext' | 'locked';
type Who = 'alex' | 'agent' | 'review' | 'reject' | 'ship';

interface DemoNode {
  id: string;
  label: string;
  lane: 0 | 1 | 2;
}

interface Step {
  wait: number;
  stage?: Stage;
  log?: [Who, string, string?]; // [who, text, label override]
  nodes?: Record<string, NodeState>;
  agents?: Record<string, string>;
  pr?: number;
  caught?: number;
}

interface Brief {
  id: string;
  tab: string;
  brief: string;
  lanes: [string, string, string];
  nodes: DemoNode[];
  steps: Step[];
}

const STAGES: Stage[] = ['brief', 'design', 'build', 'review', 'ship'];

export const BRIEFS: Brief[] = [
  {
    id: 'reorder',
    tab: 'One-tap reorder',
    brief: 'Our customers keep buying the same things. Let them reorder from their phone in one tap.',
    lanes: ['Client', 'Services', 'Data & external'],
    nodes: [
      { id: 'app', label: 'Mobile app', lane: 0 },
      { id: 'orders', label: 'Orders API', lane: 1 },
      { id: 'pay', label: 'Payments adapter', lane: 1 },
      { id: 'inv', label: 'Inventory', lane: 2 },
      { id: 'psp', label: 'Payment provider', lane: 2 },
    ],
    steps: [
      { wait: 600, log: ['alex', 'What it actually means: repeat the last order, saved payment, zero forms. And it must never charge twice.'] },
      { wait: 1300, stage: 'design', nodes: { app: 'design', orders: 'design', pay: 'design', inv: 'design', psp: 'ext' },
        log: ['alex', 'Five components, one new endpoint. Contract: POST /orders/reorder, idempotent per request key.'] },
      { wait: 1300, log: ['alex', 'Boundary: only the payments adapter talks to the provider. Nothing else.'] },
      { wait: 1100, stage: 'build', nodes: { orders: 'build' }, agents: { orders: 'agent·01' }, log: ['agent', 'Implementing Orders API against contract v1', 'agent·01'] },
      { wait: 500, nodes: { pay: 'build' }, agents: { pay: 'agent·02' }, log: ['agent', 'Wiring saved payment methods through the adapter', 'agent·02'] },
      { wait: 500, nodes: { app: 'build' }, agents: { app: 'agent·03' }, log: ['agent', 'Building the reorder button + confirmation sheet', 'agent·03'] },
      { wait: 500, nodes: { inv: 'build' }, agents: { inv: 'agent·04' }, log: ['agent', 'Stock check before the order is placed', 'agent·04'] },
      { wait: 1500, stage: 'review', nodes: { orders: 'done' }, pr: 1, log: ['review', 'PR #41 Orders API: matches the contract. Approved.'] },
      { wait: 1100, nodes: { pay: 'reject' }, pr: 1, caught: 1,
        log: ['reject', 'PR #42 Payments: a timeout triggers a retry with no idempotency key. Customers get charged twice. Sent back.'] },
      { wait: 1700, nodes: { pay: 'build' }, log: ['agent', 'Reworked: idempotency key on every charge, retries are now safe', 'agent·02'] },
      { wait: 1200, nodes: { pay: 'done', inv: 'done' }, pr: 1, log: ['review', 'PR #42 + #43: approved.'] },
      { wait: 900, nodes: { app: 'done' }, pr: 1, log: ['review', 'PR #44 Mobile app: approved.'] },
      { wait: 1000, stage: 'ship', log: ['ship', 'Shipped. 4 agents, 4 PRs, 1 double charge caught before it cost anyone money.'] },
      { wait: 900, log: ['alex', 'Signed off. I own this release.', 'sign-off'] },
    ],
  },
  {
    id: 'dunning',
    tab: 'Invoices that chase themselves',
    brief: 'Late invoices eat our team’s week. Chase late payers automatically, but politely.',
    lanes: ['Triggers', 'Services', 'Data & external'],
    nodes: [
      { id: 'sched', label: 'Scheduler', lane: 0 },
      { id: 'rules', label: 'Reminder rules', lane: 1 },
      { id: 'invoice', label: 'Invoice service', lane: 1 },
      { id: 'ledger', label: 'Ledger', lane: 2 },
      { id: 'mail', label: 'Email gateway', lane: 2 },
    ],
    steps: [
      { wait: 600, log: ['alex', 'What it actually means: reminders on a schedule, a firmer tone each time, and they stop the moment someone pays.'] },
      { wait: 1300, stage: 'design', nodes: { sched: 'design', rules: 'design', invoice: 'design', ledger: 'locked', mail: 'ext' },
        log: ['alex', 'The ledger is the only source of truth for “paid”. Nothing else gets a vote.'] },
      { wait: 1300, log: ['alex', 'Reminder rules are data, not code, so finance can change the wording without a deploy.'] },
      { wait: 1100, stage: 'build', nodes: { sched: 'build', rules: 'build' }, agents: { sched: 'agent·01', rules: 'agent·01' },
        log: ['agent', 'Scheduler + escalation rules engine', 'agent·01'] },
      { wait: 500, nodes: { invoice: 'build' }, agents: { invoice: 'agent·02' }, log: ['agent', 'Overdue-invoice queries + reminder history', 'agent·02'] },
      { wait: 500, nodes: { mail: 'build' }, agents: { mail: 'agent·03' }, log: ['agent', 'Templates and sending through the email gateway', 'agent·03'] },
      { wait: 1500, stage: 'review', nodes: { invoice: 'done', mail: 'done' }, pr: 2, log: ['review', 'PR #16 + #18: approved.'] },
      { wait: 1100, nodes: { rules: 'reject', sched: 'reject' }, pr: 1, caught: 1,
        log: ['reject', 'PR #17 Rules: checks “paid” against a cache that refreshes nightly. Someone who paid this morning still gets chased. Read the ledger. Sent back.'] },
      { wait: 1800, nodes: { rules: 'build', sched: 'build' }, log: ['agent', 'Reworked: payment status is read from the ledger right before every send', 'agent·01'] },
      { wait: 1200, nodes: { rules: 'done', sched: 'done' }, log: ['review', 'PR #17: approved.'] },
      { wait: 1000, stage: 'ship', log: ['ship', 'Shipped. 3 agents, 3 PRs, and no reminders sent to people who already paid.'] },
      { wait: 900, log: ['alex', 'Signed off. I own this release.', 'sign-off'] },
    ],
  },
  {
    id: 'partners',
    tab: 'Partner API, core untouched',
    brief: 'Partners want access to our catalog. Give it to them without putting our core system at risk.',
    lanes: ['Edge', 'Services', 'Data'],
    nodes: [
      { id: 'gw', label: 'API gateway', lane: 0 },
      { id: 'keys', label: 'API keys', lane: 0 },
      { id: 'limit', label: 'Rate limiter', lane: 1 },
      { id: 'read', label: 'Catalog read-model', lane: 1 },
      { id: 'events', label: 'Event stream', lane: 2 },
      { id: 'core', label: 'Core DB', lane: 2 },
    ],
    steps: [
      { wait: 600, log: ['alex', 'What it actually means: read-only, isolated, metered. If partners spike, customers must not notice.'] },
      { wait: 1300, stage: 'design', nodes: { gw: 'design', keys: 'design', limit: 'design', read: 'design', events: 'design', core: 'locked' },
        log: ['alex', 'Boundary: partners never touch the core DB. They read a separate model, fed by events.'] },
      { wait: 1300, log: ['alex', 'Per-key quotas at the edge. The core never finds out partners exist.'] },
      { wait: 1100, stage: 'build', nodes: { gw: 'build', keys: 'build' }, agents: { gw: 'agent·01', keys: 'agent·01' },
        log: ['agent', 'Gateway, key issuing, auth middleware', 'agent·01'] },
      { wait: 500, nodes: { limit: 'build' }, agents: { limit: 'agent·02' }, log: ['agent', 'Token-bucket rate limiting per key', 'agent·02'] },
      { wait: 500, nodes: { read: 'build', events: 'build' }, agents: { read: 'agent·03', events: 'agent·03' },
        log: ['agent', 'Read-model projection from catalog events', 'agent·03'] },
      { wait: 1500, stage: 'review', nodes: { gw: 'done', keys: 'done', limit: 'done' }, pr: 2, log: ['review', 'PR #7 + #9: approved.'] },
      { wait: 1100, nodes: { read: 'reject', core: 'reject' }, pr: 1, caught: 1,
        log: ['reject', 'PR #8 Read-model: queries the core DB directly “for freshness”. That’s exactly the coupling we designed out. Use the event stream. Sent back.'] },
      { wait: 1800, nodes: { read: 'build', core: 'locked' }, log: ['agent', 'Reworked: read-model fed by the event stream only, freshness under a second', 'agent·03'] },
      { wait: 1200, nodes: { read: 'done', events: 'done' }, log: ['review', 'PR #8: approved.'] },
      { wait: 1000, stage: 'ship', log: ['ship', 'Shipped. Partners are live, and the core never knew they arrived.'] },
      { wait: 900, log: ['alex', 'Signed off. I own this release.', 'sign-off'] },
    ],
  },
];

const WHO_LABEL: Record<Who, string> = {
  alex: 'alex',
  agent: 'agent',
  review: 'review',
  reject: 'review',
  ship: 'ship',
};

export function initOrchestratorDemo(root: HTMLElement) {
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector(sel) as T;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-brief]'));
  const briefText = $<HTMLElement>('[data-brief-text]');
  const lanesEl = $<HTMLElement>('[data-lanes]');
  const logEl = $<HTMLElement>('[data-log]');
  const stagesEls = Array.from(root.querySelectorAll<HTMLElement>('[data-stage]'));
  const statAgents = $<HTMLElement>('[data-stat="agents"]');
  const statPrs = $<HTMLElement>('[data-stat="prs"]');
  const statCaught = $<HTMLElement>('[data-stat="caught"]');
  const replay = $<HTMLButtonElement>('[data-replay]');
  const titleEl = $<HTMLElement>('[data-title]');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let runId = 0;
  let current = 0;
  const nodeEls = new Map<string, HTMLElement>();
  const nodeStates = new Map<string, NodeState>();
  const nodeAgents = new Map<string, string>();
  let prs = 0;
  let caught = 0;

  const sleep = (ms: number, id: number) =>
    new Promise<boolean>((resolve) => {
      if (reduced) return resolve(id === runId);
      setTimeout(() => resolve(id === runId), ms);
    });

  function setStage(stage: Stage) {
    const idx = STAGES.indexOf(stage);
    stagesEls.forEach((el, i) => {
      el.classList.toggle('done', i < idx);
      el.classList.toggle('active', i === idx);
    });
    root.dataset.stage = stage;
  }

  function renderDiagram(brief: Brief) {
    lanesEl.innerHTML = '';
    nodeEls.clear();
    nodeStates.clear();
    nodeAgents.clear();
    brief.lanes.forEach((name, lane) => {
      const col = document.createElement('div');
      col.className = 'lane';
      const h = document.createElement('div');
      h.className = 'lane-name';
      h.textContent = name;
      col.appendChild(h);
      brief.nodes
        .filter((n) => n.lane === lane)
        .forEach((n) => {
          const el = document.createElement('div');
          el.className = 'node s-idle';
          el.innerHTML = `<span class="node-label"></span><span class="node-tag"></span>`;
          (el.querySelector('.node-label') as HTMLElement).textContent = n.label;
          col.appendChild(el);
          nodeEls.set(n.id, el);
          nodeStates.set(n.id, 'idle');
        });
      lanesEl.appendChild(col);
    });
  }

  function setNode(id: string, state: NodeState, agent?: string) {
    const el = nodeEls.get(id);
    if (!el) return;
    el.className = `node s-${state}`;
    nodeStates.set(id, state);
    const tag = el.querySelector('.node-tag') as HTMLElement;
    if (agent) nodeAgents.set(id, agent);
    if (state === 'build') tag.textContent = nodeAgents.get(id) ?? 'agent';
    else if (state === 'done') tag.textContent = '✓';
    else if (state === 'reject') tag.textContent = '✗';
    else if (state === 'locked') tag.textContent = 'protected';
    else if (state === 'ext') tag.textContent = 'external';
    else tag.textContent = '';
  }

  function updateStats() {
    const active = new Set<string>();
    nodeStates.forEach((state, id) => {
      if (state === 'build') active.add(nodeAgents.get(id) ?? id);
    });
    statAgents.textContent = String(active.size);
    statPrs.textContent = String(prs);
    statCaught.textContent = String(caught);
    statCaught.parentElement?.classList.toggle('hot', caught > 0);
  }

  function addLog(who: Who, text: string, label?: string) {
    const line = document.createElement('div');
    line.className = `log-line w-${who}`;
    const w = document.createElement('span');
    w.className = 'log-who';
    w.textContent = label ?? WHO_LABEL[who];
    const t = document.createElement('span');
    t.className = 'log-text';
    t.textContent = text;
    line.append(w, t);
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  async function typeBrief(text: string, id: number) {
    briefText.textContent = '';
    briefText.classList.add('typing');
    if (reduced) {
      briefText.textContent = text;
    } else {
      for (let i = 0; i < text.length; i++) {
        if (id !== runId) return false;
        briefText.textContent = text.slice(0, i + 1);
        await new Promise((r) => setTimeout(r, 18 + Math.random() * 22));
      }
    }
    briefText.classList.remove('typing');
    return id === runId;
  }

  async function run(index: number) {
    const id = ++runId;
    current = index;
    const brief = BRIEFS[index];

    tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === index)));
    titleEl.textContent = `brief-0${index + 1} · ${brief.id}`;
    root.classList.remove('finished');
    logEl.innerHTML = '';
    prs = 0;
    caught = 0;
    renderDiagram(brief);
    setStage('brief');
    updateStats();

    if (!(await typeBrief(brief.brief, id))) return;

    for (const step of brief.steps) {
      if (!(await sleep(step.wait, id))) return;
      if (step.stage) setStage(step.stage);
      if (step.nodes) {
        for (const [nid, st] of Object.entries(step.nodes)) setNode(nid, st, step.agents?.[nid]);
      }
      if (step.pr) prs += step.pr;
      if (step.caught) caught += step.caught;
      if (step.log) addLog(...step.log);
      updateStats();
    }

    // Mark ship stage as completed too
    stagesEls.forEach((el) => {
      el.classList.add('done');
      el.classList.remove('active');
    });
    root.classList.add('finished');
  }

  tabs.forEach((tab, i) => tab.addEventListener('click', () => run(i)));
  replay?.addEventListener('click', () => run(current));

  // Prepare the first brief's diagram so the panel isn't empty before it scrolls in
  renderDiagram(BRIEFS[0]);

  // Start when the panel scrolls into view
  let started = false;
  const io = new IntersectionObserver(
    (entries) => {
      if (!started && entries.some((e) => e.isIntersecting)) {
        started = true;
        io.disconnect();
        run(0);
      }
    },
    { threshold: 0.35 }
  );
  io.observe(root);

  return () => {
    runId++;
    io.disconnect();
  };
}
