/**
 * All of the site's words live in this file. Edit it and push; no layout code
 * needs to change. `**text**` in a bullet or paragraph renders as bold.
 *
 * Search for "TODO" to find everything that still needs your input. TODOs are
 * comments only, so nothing unfinished shows on the page:
 *   - `live: null` hides the Live link.
 *   - `photo: null` leaves the photo out of the hero.
 */
import type { ImageMetadata } from 'astro';

import whodunitBisect from '../assets/projects/whodunit-bisect.png';
import whodunitDesk from '../assets/projects/whodunit-idle-desk.png';
import whodunitNewspaper from '../assets/projects/whodunit-newspaper.png';
import galleyAttention from '../assets/projects/galley-attention.png';
import transcribeMate from '../assets/projects/transcribemate.png';

/* Types ------------------------------------------------------------------ */

export type Media =
  | { kind: 'image'; src: ImageMetadata; alt: string; caption?: string; contain?: boolean }
  /** A replayed terminal session. Lines starting with "$ " or "> " are input. */
  | { kind: 'terminal'; title: string; lines: string[]; previewLines?: number; caption?: string }
  /** A chart or plot served from public/, shown whole on a white background. */
  | { kind: 'figure'; src: string; alt: string; width: number; height: number; caption?: string };

export interface ArchitectureBox {
  title: string;
  detail?: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One line for the card. */
  tagline: string;
  context: string;
  tech: string[];
  code: string;
  live: string | null;
  /** One concrete result, shown on the card. */
  proof?: string;
  /** Extra links, such as a report or slides. `type` is the analytics link_type. */
  links?: Array<{ label: string; href: string; type: string }>;
  /** Teammates, shown under the project's context. */
  credit?: string;
  media: Media;
  gallery?: Media[];
  caseStudy: {
    problem: string[];
    built: string[];
    /** What you personally built on a team project. */
    myPart?: string[];
    /** Rows run top to bottom. Several boxes in a row happen side by side. */
    architecture: ArchitectureBox[][];
    how: string[];
    results: string[];
    learned: string[];
  };
}

/* About ------------------------------------------------------------------ */

export const person = {
  name: 'Elhadji Sall',
  initials: 'ES',
  intro: 'CS student at UNBC building backend, systems and AI software.',
  /** The home page types these one after another. The first also shows without JavaScript. */
  roles: [
    'CS student at UNBC',
    'Software Engineer Intern at Microsoft',
    'Building backend, systems and AI software',
  ],
  bio: "I'm studying Computer Science at the University of Northern British Columbia, with a minor in Mathematics, graduating May 2028. I love building, tinkering and learning new things.",
  // TODO: add a photo. Save it to src/assets/, import it at the top of this
  // file, and use it here, e.g. `photo: myPhoto`. Square, at least 320px.
  photo: null as ImageMetadata | null,
  email: 'elhadjisall2005@gmail.com',
  github: 'https://github.com/elhadjisall',
  linkedin: 'https://linkedin.com/in/elhadjisall',
  resume: '/resume.pdf',
  jobTitle: 'Software Engineer Intern',
  employer: 'Microsoft',
  school: 'University of Northern British Columbia',
};

/* Experience ------------------------------------------------------------- */

export const experience = [
  {
    company: 'Microsoft',
    team: 'Activision / Demonware',
    role: 'Software Engineer Intern',
    dates: 'May 2026 – Dec 2026',
    location: 'Vancouver, BC',
    summary: 'Call of Duty login and authentication services.',
    url: 'https://www.microsoft.com',
    logo: '/logos/microsoft.svg',
    bullets: [
      'Optimized the C++ game-client login state machine and retry/exponential backoff, cutting authentication handshake latency **15%** and failed-reconnection time **20%** for **90M+** players across PC, Xbox and PlayStation',
      'Shipped Python REST features in the login and banning services: MFA fixes, per-title endpoint routing that isolates dedicated game servers from DDoS traffic ahead of a **30M+** player beta, TPM-based hardware-ban enforcement, and audit telemetry',
      'Built a fault-tolerant fallback so clients never receive stale endpoints during upstream outages; rolled out services with Kubernetes, Docker and Helm across **five** environments',
    ],
    tech: ['Python', 'C++', 'Kubernetes', 'Docker', 'Helm', 'Jenkins', 'pytest', 'Grafana', 'Kibana', 'Linux'],
  },
  {
    company: 'UNBC Robotics Lab',
    team: '',
    role: 'Software Engineer Intern',
    dates: 'June 2025 – Feb 2026',
    location: 'Prince George, BC',
    summary: 'Real-time coaching for an autonomous QTrobot.',
    url: 'https://www.unbc.ca',
    // TODO: this is a neutral monogram. Replace public/logos/unbc.svg if you
    // have an approved UNBC or lab logo.
    logo: '/logos/unbc.svg',
    bullets: [
      'Trained a TensorFlow 3D CNN on **200+** videos to classify **11** exercise types (**92%** accuracy) for an autonomous QTrobot coaching system',
      'Built a C++ MediaPipe pose-tracking pipeline (**95%** accuracy, **sub-100ms** latency on live 30 FPS video)',
      'Streamed live skeletal metrics through Django REST and WebSockets to a React front end, cutting app latency **19%**',
    ],
    tech: ['Python', 'C++', 'TensorFlow', 'MediaPipe', 'OpenCV', 'Django', 'WebSockets', 'React', 'ROS'],
  },
];

/* Projects --------------------------------------------------------------- */

/*
 * TODO: the case studies below are drafted from each repo's README and from
 * running the code. Facts and numbers are real, but the "learned" sections are
 * my reading of the work, so rewrite them in your own words.
 *
 * Terminal media is real output, captured in November 2026.
 */

export const projects: Project[] = [
  {
    slug: 'whodunit',
    title: 'Whodunit',
    tagline:
      'Git bisect with a brain. A Gemini agent turns a plain-English bug report into a reproduction test and finds the culprit commit, even when the test is flaky.',
    context: 'Solo, Hack the North 2026',
    tech: ['TypeScript', 'Gemini', 'Elasticsearch', 'Node.js', 'React'],
    code: 'https://github.com/elhadjisall/whodunit',
    live: null, // TODO: add a demo video or hosted simulation URL.
    media: {
      kind: 'image',
      src: whodunitBisect,
      alt: 'Whodunit mid-investigation: suspect commits pinned to a board with probabilities, a timeline of the posterior, and live Elasticsearch queries.',
    },
    gallery: [
      {
        kind: 'image',
        src: whodunitDesk,
        alt: 'The Whodunit complaint desk, where you describe the bug in one sentence.',
        caption: 'You start by describing what broke, in one sentence.',
      },
      {
        kind: 'image',
        src: whodunitNewspaper,
        alt: 'A newspaper-styled verdict naming commit 4c58cb3 as the culprit.',
        caption: 'The verdict cites the evidence behind commit 4c58cb3.',
      },
    ],
    caseStudy: {
      problem: [
        '`git bisect` treats every commit as equally suspicious and trusts the test every time. That makes it a slow midpoint search, and a single flaky run can blame an innocent commit.',
        'The commit that looks guilty is often a red herring, too. I wanted a bisect that reads the diffs, CI logs and issue threads first, weighs the suspects, and still works when the test lies.',
      ],
      built: [
        'You type what broke. A Gemini tool-calling agent searches the history, writes a reproduction test and runs a Bayesian bisect to find the culprit. It then writes a cited verdict and can commit a fix if the reproduction and `npm test` both pass.',
        'The interface streams the investigation live over SSE, and a simulated case replays real history in the browser if the Wi-Fi or APIs fail mid-demo.',
      ],
      architecture: [
        [{ title: 'Bug report', detail: 'One plain-English sentence' }],
        [{ title: 'Gemini agent', detail: 'Tool loop: investigate, reproduce, fix' }],
        [
          { title: 'BM25', detail: 'Keyword search' },
          { title: 'Gemini embeddings', detail: '768-d kNN search' },
        ],
        [{ title: 'Reciprocal Rank Fusion', detail: 'Elasticsearch: commits, hunks, CI logs, issues' }],
        [{ title: 'Bayesian bisect', detail: 'Probes the weighted median of the posterior' }],
        [{ title: 'Git worktree oracle', detail: 'Runs the repro; the result updates the posterior' }],
        [{ title: 'Cited verdict', detail: 'Optional verified fix' }],
      ],
      how: [
        'Search evidence sets a prior over every commit, so probes are spent where the suspicion is. Each step tests the weighted median of the posterior, rather than the midpoint.',
        'The test is modelled as noisy: every result updates the posterior using a flake rate ε instead of ruling commits out for good. Every probe runs in its own git worktree, and the same engine runs in Node and in the browser simulation.',
      ],
      results: [
        'On a **108-commit** demo repository, it names `4c58cb3`: `Math.floor` became `Math.trunc`, so negative money rounds the wrong way by one cent. The credit-note feature is the red herring.',
        'Search evidence alone cut uncertainty from **6.74 bits** to **4.17 bits** before any test ran.',
        'With the flaky oracle turned on, classic bisect derails while the Bayesian search still closes on the culprit.',
      ],
      learned: [
        'A demo has to survive the venue, so quota fallback and an offline simulation mattered as much as the model did.',
        'Treating a test as evidence rather than truth makes the search both faster and more honest about what it knows.',
      ],
    },
  },
  {
    slug: 'dsm',
    title: 'DSM Optimizer',
    tagline: "Reorders a project's task-dependency matrix to cut rework loops, in C++17.",
    context: 'Team project · CPSC 482, UNBC',
    tech: ['C++17', 'graphs', 'sparse matrices'],
    code: 'https://github.com/elhadjisall/DSM',
    live: null,
    links: [
      { label: 'Report', href: '/dsm/report.pdf', type: 'report' },
      { label: 'Slides', href: '/dsm/slides.pdf', type: 'slides' },
    ],
    credit: 'With Simon Kraft and Joshua Payne.',
    proof: 'Feedback marks **6,063 → 192** on a 9,664-task matrix; **84%** average reduction across 10 benchmarks.',
    media: {
      kind: 'figure',
      src: '/images/dsm/California.png',
      width: 1603,
      height: 775,
      alt: 'Two matrix plots of the California benchmark. Before: dots scattered across the whole matrix, with 6,063 feedback marks. After: nearly all dots below the diagonal, with 192 feedback marks.',
      caption: 'The California benchmark before and after: 6,063 feedback marks down to 192.',
    },
    gallery: [
      {
        kind: 'figure',
        src: '/images/dsm/optimization_stage_average.png',
        width: 1500,
        height: 900,
        alt: 'Bar chart of average reduction by stage across 10 matrices. Topological sort alone reaches about 76% for FBM and 95% for TFBD. Tearing raises FBM to about 84%. Banding changes little.',
        caption: 'Average reduction after each stage, across all 10 matrices.',
      },
      {
        kind: 'figure',
        src: '/images/dsm/scaling.png',
        width: 1500,
        height: 900,
        alt: 'Log-log plot of mean runtime against vertices plus edges for each pipeline stage, with an O(V+E) reference line.',
        caption: 'Runtime of each stage against V + E, on log-log axes, with an O(V+E) reference line.',
      },
    ],
    caseStudy: {
      problem: [
        'A Design Structure Matrix lists the tasks in a project, with a mark wherever one task depends on another. Marks above the diagonal are feedback marks: a task that depends on work scheduled after it, which means rework.',
        'Reordering the tasks can remove many of those marks. We measured two things: the number of feedback marks (FBM), and their total distance from the diagonal (TFBD).',
      ],
      built: [
        'A six-stage pipeline in C++17 that reads a sparse matrix and returns a reordered one. We tested it on 10 benchmark matrices, from 11×11 up to 27,770×27,770.',
      ],
      // TODO(elhadji): list exactly what you built and what Simon and Joshua built.
      myPart: [],
      architecture: [
        [{ title: 'Parse', detail: 'Matrix Market into compressed sparse columns' }],
        [{ title: 'SCC decomposition', detail: "Tarjan's and Kosaraju-Sharir's algorithms" }],
        [{ title: 'Condense and sort', detail: "Contract each SCC, then Kahn's topological sort" }],
        [{ title: 'Tearing', detail: 'Eades-Lin-Smyth Algorithm GR inside each SCC' }],
        [{ title: 'Banding', detail: 'Reverse Cuthill-McKee, then adjacent-swap hill climbing' }],
        [{ title: 'Permute', detail: 'Apply P^T A P and verify the result' }],
      ],
      how: [
        'Tasks in a strongly connected component depend on each other, so no ordering can clear every feedback mark among them. Contracting each component gives a DAG, and a topological sort of that DAG leaves feedback marks only inside the components.',
        'Tearing then approximates a minimum feedback arc set inside each component. The hill climbing step accepts a swap only if TFBD drops and FBM does not rise.',
      ],
      results: [
        '**84%** average FBM reduction and **94.54%** average TFBD reduction across the 10 matrices.',
        'On California (9,664 tasks), FBM fell from **6,063** to **192** and TFBD from **18,810,564** to **669**.',
        'Tarjan ran about **1.8×** faster than Kosaraju.',
        'Most of the gain came from SCC condensation plus topological sort; tearing added about 8 points of FBM reduction, and banding barely moved either metric.',
      ],
      // TODO(elhadji): explain why topological sort did most of the work. Be ready
      // to answer this in an interview. It may also be worth saying that average
      // TFBD reduction was 95.21% after the sort and 94.54% at the end.
      learned: [],
    },
  },
  {
    slug: 'wharf',
    title: 'Wharf',
    tagline:
      'A Linux container runtime in Python with namespaces, an overlay root filesystem, cgroup v2 limits and a Docker-style CLI.',
    context: 'Personal project',
    tech: ['Python', 'Linux', 'namespaces', 'cgroups'],
    code: 'https://github.com/elhadjisall/Wharf',
    live: null,
    media: {
      kind: 'terminal',
      title: 'wharf',
      previewLines: 9,
      lines: [
        '$ wharf pull tools:latest --host /bin/sh /bin/echo /bin/sleep /bin/ls',
        'tools:latest',
        '$ wharf run tools:latest /bin/echo hello from a container',
        'hello from a container',
        '$ wharf run -d --name nap --memory 64m --cpu 0.5 --pids 64 tools:latest /bin/sleep 300',
        '0cb542f06c8a',
        '$ wharf ps',
        'id            name  image         status   pid    command',
        '0cb542f06c8a  nap   tools:latest  running  54372  /bin/sleep 300',
        '$ wharf exec nap /bin/ls /proc/1/ns',
        'cgroup  ipc  mnt  net  pid  pid_for_children  time  time_for_children  user  uts',
        '$ wharf stop nap',
        '0cb542f06c8a exited',
      ],
      caption:
        'A real session. The CLI module is still named rubberdocker in the repo, shown here as wharf for readability, and the ps and exec output is condensed.',
    },
    caseStudy: {
      problem: [
        "Containers are often explained as lightweight VMs, but they're ordinary Linux processes with a restricted view of the system. I wanted to understand that by building the whole path myself, from `unshare` to a running process in its own root filesystem.",
      ],
      built: [
        'Wharf gives a process its own user, mount, UTS, PID, IPC and network namespaces, then pivots it onto an overlay root filesystem. It stores images locally and enforces cgroup v2 memory, CPU and pids limits.',
        'A Docker-style CLI covers `pull`, `run`, `ps`, `exec`, `logs`, `stop` and more, and a small control page lists what is running.',
      ],
      architecture: [
        [{ title: 'CLI', detail: 'run, ps, exec, logs, stop' }],
        [{ title: 'Supervisor', detail: 'Unshares a user namespace and writes the id map' }],
        [
          { title: 'Namespaces', detail: 'Mount, UTS, PID, IPC, network' },
          { title: 'cgroup v2', detail: 'memory.max, cpu.max, pids.max' },
        ],
        [{ title: 'Overlay rootfs', detail: 'Orders lowerdirs, applies OCI whiteouts' }],
        [{ title: 'pivot_root', detail: 'Mounts, pivots and detaches the old root' }],
        [{ title: 'Container process', detail: 'setns lets exec join it later' }],
      ],
      how: [
        'The supervisor unshares a user namespace first and maps container root onto the calling user, so `run` needs no root when unprivileged user namespaces are enabled.',
        '`pivot_root` is called directly as a syscall, `exec` enters a running container with `setns`, and layers resolve in overlay order with OCI whiteouts applied.',
      ],
      results: [
        'It runs real containers end to end: detached workloads with **memory, CPU and pids** limits, `exec` into a live container, and clean stops.',
        'The full `ps` and `exec` flow above was run from a fresh clone on WSL2.',
        'The limits are explicit: there is no registry client, daemon, seccomp profile, capability bounding set or veth bridge. This is a learning runtime, not Docker.',
      ],
      learned: [
        'Order is everything. The id map, mounts, pivot and cgroup writes each depend on what has already happened, and getting one out of order fails in confusing ways.',
        'Designing for rootless use forced me to learn which privileges a container really needs.',
      ],
    },
  },
  {
    slug: 'marconi',
    title: 'Marconi',
    tagline:
      'Redis from scratch: an in-memory data server in Go with RESP, TTL expiry, an append-only file and PSYNC replication.',
    context: 'Personal project',
    tech: ['Go', 'TCP', 'RESP'],
    code: 'https://github.com/elhadjisall/RedisFromScratch',
    live: null,
    media: {
      kind: 'terminal',
      title: 'redis-cli',
      previewLines: 10,
      lines: [
        '> SET book byor',
        'OK',
        '> GET book',
        '"byor"',
        '> HSET user name elhadji',
        '(integer) 1',
        '> RPUSH q a b c',
        '(integer) 3',
        '> EXPIRE book 60',
        '(integer) 1',
        '> TTL book',
        '(integer) 59',
        '# server restarted; the AOF replays',
        '> HGETALL user',
        '1) "name"',
        '2) "elhadji"',
      ],
      caption: 'A real session: state survives a restart because the append-only file is replayed.',
    },
    caseStudy: {
      problem: [
        'Redis looks simple from the outside, but the hard parts are hidden: how a protocol is parsed from a stream, how keys expire without slowing every read, and how durability and replication work. Building a smaller version was the fastest way to learn them.',
      ],
      built: [
        'Marconi speaks RESP, so it works with a Redis-style client. It stores strings, hashes, lists and sets, supports `EXPIRE` and `TTL`, persists writes to an append-only file, and can sync a read-only replica.',
        'It ships with a small CLI and a web key browser backed by a JSON API.',
      ],
      architecture: [
        [{ title: 'TCP connections', detail: 'One RESP reader and writer per client' }],
        [{ title: 'Command dispatch', detail: 'GET, SET, HSET, LPUSH, SADD, EXPIRE and more' }],
        [
          { title: 'Store', detail: 'Hashtable and expiry heap' },
          { title: 'Append-only file', detail: 'Append, replay, rewrite' },
        ],
        [{ title: 'Replication', detail: 'PSYNC, empty RDB frame, snapshot as commands, live writes' }],
      ],
      how: [
        'Expiry sits on a heap, so the server can find the next key to expire without scanning the keyspace. Writes are appended to the AOF and replayed on start, and a rewrite compacts the log.',
        'A replica sync runs `PSYNC`, receives an empty RDB frame and a snapshot of current keys as commands, then follows live writes.',
      ],
      results: [
        'Works with a RESP client across **four** data types, including TTL expiry.',
        'State survives a restart through AOF replay, as shown in the session above.',
        'The limits are explicit: one database, no sorted sets, streams, pub/sub, transactions, Lua, ACLs or eviction. It is not a drop-in Redis.',
      ],
      learned: [
        'Durability is a design decision that touches every write path, not something to add at the end.',
        'Keeping the first replication handshake small made the moving parts easier to reason about.',
      ],
    },
  },
  {
    slug: 'galley',
    title: 'Galley',
    tagline:
      'A small GPT-style transformer built from scratch in PyTorch, with a workbench for inspecting tokens, attention and loss.',
    context: 'Personal project',
    tech: ['Python', 'PyTorch'],
    code: 'https://github.com/elhadjisall/Galley',
    live: null,
    media: {
      kind: 'image',
      src: galleyAttention,
      contain: true,
      alt: 'Attention heatmap from the Galley workbench, showing a causal triangle over the tokens of a short sentence.',
      caption: 'One attention head in the Galley workbench. The triangle is the causal mask at work.',
    },
    caseStudy: {
      problem: [
        "It's easy to use a language model without knowing what happens inside one. I wanted to write each part myself and be able to see it working, from raw bytes to generated text.",
      ],
      built: [
        'Galley covers a byte-level BPE tokenizer, causal multi-head attention, transformer blocks, a training loop with a cosine schedule, checkpoints, and greedy, temperature and top-k sampling. There is also code for LoRA and instruction fine-tuning.',
        'A browser workbench shows the prompt, token spans, any attention head and the loss curve.',
      ],
      architecture: [
        [{ title: 'Byte-level BPE tokenizer', detail: 'Trained on the built-in paragraph' }],
        [{ title: 'Sliding-window batches', detail: 'Token ids to inputs and targets' }],
        [
          { title: 'Embeddings', detail: 'Tokens and positions' },
          { title: 'Causal attention', detail: 'Multi-head, masked' },
        ],
        [{ title: 'Transformer blocks', detail: 'The GPT stack' }],
        [
          { title: 'Training', detail: 'Cosine schedule, checkpoints' },
          { title: 'Sampling', detail: 'Greedy, temperature, top-k' },
        ],
        [{ title: 'Workbench', detail: 'Tokens, attention, loss' }],
      ],
      how: [
        'The default debug config is deliberately tiny, so a full train and inspect loop runs on a laptop CPU: **2 layers, 4 heads**, embedding width 32, context 32 and vocabulary 384.',
        'A separate config matches the 124M GPT-2 tensor shapes, so an external checkpoint can be copied across.',
      ],
      results: [
        'The debug model has **50,880** parameters. A 40-step training run took the loss from **5.97** to **4.92** on CPU.',
        'The workbench exposes real attention weights for each layer and head.',
        'The limit is explicit: it trains on one short paragraph, so the samples are not useful prose. Understanding was the goal, not output quality.',
      ],
      learned: [
        'Seeing the attention matrix made masking concrete in a way the equations never did.',
        'A tiny model that trains in seconds is a far better debugging tool than a large one.',
      ],
    },
  },
  {
    slug: 'transcribemate',
    title: 'TranscribeMate',
    tagline:
      'Speech-to-text in the browser, backed by a local PyTorch Whisper service that streams partial transcripts as it works.',
    context: 'Personal project',
    tech: ['Python', 'PyTorch', 'Whisper', 'React'],
    code: 'https://github.com/elhadjisall/TranscribeMate',
    live: null, // TODO: add a hosted demo URL if you deploy one.
    media: {
      kind: 'image',
      src: transcribeMate,
      alt: 'The TranscribeMate front page, with options to record from the microphone or upload an audio file.',
    },
    caseStudy: {
      problem: [
        'Waiting for a whole recording to finish before seeing any text feels slow, and sending audio to a hosted API is not always what you want. I wanted transcripts that appear as they are ready, from a model running on my own machine.',
      ],
      built: [
        'You record or upload audio in the browser, and PCM streams to a local Python service. The service runs Whisper in PyTorch and sends partial text back as each window finishes, with no API key involved.',
      ],
      architecture: [
        [{ title: 'React app', detail: 'Records or uploads audio, posts PCM' }],
        [{ title: 'Chunker', detail: '30-second windows with 5 seconds of overlap' }],
        [{ title: 'Bounded worker pool', detail: 'Read, resample to 16 kHz, build mel spectrograms' }],
        [{ title: 'Whisper tiny.en', detail: 'One model and one forward path per process' }],
        [{ title: 'Ordered partials', detail: 'Newline-delimited JSON back to the browser' }],
      ],
      how: [
        'Windows are yielded as soon as they are full. Preparation runs in a bounded thread pool, so slow audio work cannot stall the model thread, and ready mel windows are stacked into one batch.',
        'Partial text is emitted in order over `POST /v1/transcribe` as newline-delimited JSON. On a GPU the forward pass uses FP16 autocast; otherwise the same process runs on CPU in FP32.',
      ],
      results: [
        'Partial text reaches the browser before the rest of the audio has finished processing.',
        'Unit tests cover chunk overlap, batch planning, the bounded queue, ordered partials and FP16 selection, and a real CPU forward pass runs on a `(2, 80, 3000)` mel batch.',
        'The limit is explicit: the GPU path is covered by mocked tests but has not been run on a GPU yet.',
      ],
      learned: [
        'Perceived speed comes from the pipeline as much as the model. Streaming and backpressure changed the experience more than any tuning did.',
        'Keeping one forward path made CPU and GPU behaviour much simpler to test.',
      ],
    },
  },
  {
    slug: 'bifocal',
    title: 'Bifocal',
    tagline:
      'Flags abusive and manipulative messages with a multi-task classifier, and offers guidance through hybrid RAG with Gemini.',
    context: 'Team project, HackAI',
    tech: ['Python', 'PyTorch', 'FAISS', 'Gemini', 'Flask', 'React', 'TypeScript'],
    code: 'https://github.com/elhadjisall/bifocal',
    live: null, // TODO: add a hosted demo URL if you deploy one.
    media: {
      kind: 'terminal',
      title: 'artifacts/metrics.json',
      lines: [
        '# held_out accuracy, rounded',
        '{',
        '  "incident_type": 0.741,',
        '  "emotional_state": 0.685,',
        '  "severity_score": 0.481,',
        '  "potential_crime": 0.824',
        '}',
      ],
      caption: 'Held-out accuracy for each task, rounded, from the checkpoint committed to the repo.',
    },
    caseStudy: {
      problem: [
        'Manipulation and coercive control can be hard to see from inside a conversation, especially one message at a time. Our team wanted a tool that could flag those patterns and suggest a useful next step.',
      ],
      built: [
        'Paste a conversation and Bifocal classifies each message, gives the conversation a 0–100 risk score, recommends next steps for flagged messages and answers safety questions from a grounded knowledge base.',
        'The model is served through Flask to a React and TypeScript app.',
      ],
      architecture: [
        [{ title: 'React and TypeScript app', detail: 'Paste a conversation' }],
        [{ title: 'Flask API', detail: 'analyze, recommend, ask' }],
        [
          { title: 'MiniLM encoder and task heads', detail: 'Incident, emotion, severity, potential crime' },
          { title: 'Hybrid RAG', detail: 'Dense and BM25 retrieval' },
        ],
        [
          { title: 'Risk scoring', detail: 'Message and conversation, 0–100' },
          { title: 'Gemini guidance', detail: 'Extractive fallback without a key' },
        ],
      ],
      how: [
        'A pretrained sentence encoder feeds four task heads, trained with a class-weighted multi-task loss on **540** labeled messages. Temperature scaling calibrates the probabilities the API returns.',
        'Guidance comes from hybrid retrieval over a digital-safety knowledge base, with Gemini generating the answer and an extractive fallback when no API key is set.',
      ],
      results: [
        '**74%** held-out accuracy across 9 incident types, and **93%** held-out on the simpler concerning-versus-safe split.',
        'Local CPU serving: single-message p95 of about **12 ms**, and about **69 ms** for a full recommendation with RAG.',
        'A **33-test** pytest suite and GitHub Actions CI cover the service.',
      ],
      learned: [
        'On a small, sensitive dataset, calibrated probabilities and honest held-out numbers matter more than a headline score.',
        'Mapping a model output to a useful next step is a product problem as much as a modelling one.',
      ],
    },
  },
];

/* Skills ----------------------------------------------------------------- */

export const skills = [
  { group: 'Languages', items: ['C++', 'Python', 'Go', 'C', 'Java', 'TypeScript', 'JavaScript', 'SQL'] },
  {
    group: 'Frameworks',
    items: ['React', 'Node.js', 'Django', 'Flask', 'FastAPI', 'PyTorch', 'TensorFlow', 'OpenCV', 'MediaPipe'],
  },
  {
    group: 'Tools',
    items: ['Kubernetes', 'Docker', 'Helm', 'Linux', 'Git', 'Jenkins', 'Elasticsearch', 'PostgreSQL', 'Redis', 'Grafana', 'Kibana', 'AWS'],
  },
  { group: 'Hardware', items: ['QTrobot', 'ROS'] },
];

/* Navigation ------------------------------------------------------------- */

export const navigation = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'outside', label: 'Outside' },
  { id: 'contact', label: 'Contact' },
];

/* Outside of code --------------------------------------------------------- */

export const outside = {
  text: 'Outside of coding, I really enjoy gaming, hiking and bouldering. My most recent hike, Panorama Ridge, was my longest and most fun yet: 8 hours, 27 km and 1,621 m of elevation gain.',
  photos: [
    {
      src: '/images/hike-panorama-ridge.jpg',
      alt: 'Sitting on a rocky ledge at Panorama Ridge, looking out over a bright blue lake and snow-capped mountains.',
      width: 1600,
      height: 1200,
    },
    {
      src: '/images/hike-black-tusk.jpg',
      alt: 'Standing on a snowy ridge with the dark peak of Black Tusk in the distance.',
      width: 1200,
      height: 1500,
    },
    {
      src: '/images/hike-meadow.jpg',
      alt: 'Walking a wooden boardwalk through a green alpine meadow under a blue sky.',
      width: 1200,
      height: 1500,
    },
    {
      src: '/images/hike-lake.jpg',
      alt: 'Standing on a grassy slope above a turquoise alpine lake.',
      width: 1200,
      height: 1500,
    },
  ],
};
