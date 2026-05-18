/* ==========================================================
   Section content — Carlos Manuel Hernández portfolio
   ========================================================== */

const { useEffect, useRef, useState } = React;

/* -------- HOME (home.py) — with live typing -------- */
function HomeSection({ onOpen }) {
  const fullName = "Carlos Manuel\nHernández";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    // re-types every time the user opens home.py
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i++;
      setTyped(fullName.slice(0, i));
      if (i >= fullName.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, []);

  const lines = typed.split("\n");
  const done = typed.length >= fullName.length;

  return (
    <div className="page" style={{ position: "relative", overflow: "hidden" }}>
      <NeuralBg />
      <ScanLine />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-greet">
          <span className="comment"># // ¡Hola mundo! Welcome to my portfolio</span>
        </div>

        <h1 className="hero-name" style={{ display: "block" }}>
          {lines.map((l, i) => (
            <span key={i} style={{ display: "block", whiteSpace: "pre" }}>
              {l}
              {!done && i === lines.length - 1 && <span className="caret-blink"/>}
            </span>
          ))}
        </h1>

        <div className="role-chips">
          <span className="chip"><span className="d" style={{background:"var(--acc-mint)"}}></span>AI-Driven Software Engineer</span>
          <span className="chip"><span className="d" style={{background:"var(--acc-violet)"}}></span>ML Engineer in Progress</span>
          <span className="chip"><span className="d" style={{background:"var(--acc-blue)"}}></span>Data Scientist</span>
        </div>

        <p className="hero-sub">
          I live at the crossroads of <em style={{color:"var(--accent)", fontStyle:"normal"}}>AI/ML</em>, backend engineering, and data science.
          I build systems that are genuinely intelligent, scalable, and production-ready —
          from real-world deployments at Cuba's national telecom to LLM-powered agents.
        </p>

        <div className="cta-row">
          <button className="btn primary" onClick={() => onOpen("projects.ipynb")}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/>
            </svg>
            Projects
          </button>
          <button className="btn" onClick={() => onOpen("about.md")}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/>
            </svg>
            About me
          </button>
          <button className="btn" onClick={() => onOpen("contact.css")}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>
            </svg>
            Contact
          </button>
        </div>

        <div style={{ marginTop: 56, fontSize: 12, color: "var(--fg-muted)", display: "grid", gridTemplateColumns: "36px 1fr", gap: 0, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.8 }}>
          <Lns count={11} />
          <div>
            <span className="comment"># run me</span><br/>
            <span className="kw">from</span> portfolio <span className="kw">import</span> Carlos<br/>
            <br/>
            me <span className="op">=</span> <span className="fn">Carlos</span>(<br/>
            {"  "}<span className="id">title</span><span className="op">=</span><span className="str">"AI-Driven Software Engineer"</span>,<br/>
            {"  "}<span className="id">focus</span><span className="op">=</span>[<span className="str">"LLMs"</span>, <span className="str">"MLOps"</span>, <span className="str">"deep learning"</span>],<br/>
            {"  "}<span className="id">currently</span><span className="op">=</span><span className="str">"learning AI one commit at a time"</span>,<br/>
            {"  "}<span className="id">stack</span><span className="op">=</span>(<span className="str">"Python"</span>, <span className="str">"PyTorch"</span>, <span className="str">"Django"</span>),<br/>
            )<br/>
            me.<span className="fn">say_hi</span>()  <span className="comment"># &rarr; hello</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lns({ count }) {
  return (
    <div style={{ color: "var(--fg-faint)", textAlign: "right", paddingRight: 16, userSelect: "none" }}>
      {Array.from({ length: count }, (_, i) => <div key={i}>{i + 1}</div>)}
    </div>
  );
}

function ScanLine() {
  return <div className="scan-line" aria-hidden="true"/>;
}

function NeuralBg() {
  const nodes = [
    [0.10, 0.15], [0.22, 0.42], [0.18, 0.78],
    [0.45, 0.20], [0.50, 0.55], [0.42, 0.85],
    [0.72, 0.18], [0.80, 0.48], [0.75, 0.80],
    [0.95, 0.30], [0.92, 0.65]
  ];
  const edges = [
    [0,1],[0,3],[1,3],[1,4],[1,2],[2,5],[3,4],[3,6],[4,5],[4,7],[5,8],[6,7],[6,9],[7,8],[7,9],[8,10],[9,10],[4,8]
  ];
  return (
    <svg className="neural-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
      {edges.map(([a,b], i) => (
        <line key={i}
          x1={nodes[a][0]*100} y1={nodes[a][1]*100}
          x2={nodes[b][0]*100} y2={nodes[b][1]*100}
          stroke="currentColor" strokeWidth="0.1" />
      ))}
      {nodes.map(([x,y], i) => (
        <circle key={i} cx={x*100} cy={y*100} r="0.5" fill="currentColor" />
      ))}
    </svg>
  );
}

/* -------- ABOUT (about.md) -------- */
function AboutSection() {
  return (
    <div className="page">
      <h1 className="md-h1"><span className="hash">#</span>About</h1>
      <p className="md-p">
        Hi, <strong>Carlos here!</strong> I'm a <strong>4th-year Computer Science student</strong> at
        Universidad Central "Marta Abreu" de Las Villas (UCLV), Cuba. I'm building an end-to-end
        <span className="kbd-tool"> AI/ML portfolio</span> from scratch — covering the full lifecycle:
        <span className="kbd-domain"> data engineering</span> → <span className="kbd-model">deep learning</span> → <span className="kbd-tool">MLOps</span>.
      </p>
      <p className="md-p">
        I'm <strong>resourceful</strong>, detail-oriented, and have a strong drive to learn. I have hands-on
        experience deploying production systems (at <strong>ETECSA</strong>, Cuba's national telecom) and building
        AI-powered automation tools for real businesses. I love bridging theory and practice — turning math and
        models into things that work in the real world.
      </p>

      <h2 className="md-h2"><span className="hash">##</span>Highlights</h2>
      <ul className="md-list">
        <li>Built <strong>production systems at ETECSA</strong> — reduced manual processing by <span className="kbd-keyword">95%</span></li>
        <li>Architected an <strong>AI-powered Telegram bot</strong> that cut data entry time by <span className="kbd-keyword">40%</span></li>
        <li>Hands-on with <span className="kbd-tool">LLMs</span>, <span className="kbd-tool">RAG</span>, <span className="kbd-tool">Transformers</span>, and ML pipelines</li>
        <li>Building scalable systems that go from <span className="kbd-domain">data → model → deployment</span></li>
        <li>Actively seeking <strong>AI/ML internships</strong>, research, and remote opportunities</li>
      </ul>

      <h2 className="md-h2"><span className="hash">##</span>What I'm focused on right now</h2>
      <p className="md-p">
        Deepening my work on <span className="kbd-tool">LLM agents</span> and <span className="kbd-tool">RAG</span> systems, polishing my{" "}
        <span className="kbd-keyword">MLOps</span> chops (CI/CD, MLflow, Docker), and shipping the kind of projects
        that prove I can take a model from a notebook all the way into production.
      </p>

      <p className="md-p" style={{ marginTop: 20, color: "var(--fg-muted)", fontStyle: "italic" }}>
        "Learning AI one commit at a time."
      </p>
    </div>
  );
}

/* -------- PROJECTS (projects.ipynb) -------- */
function ProjectsSection() {
  return (
    <div className="page">
      <h2 style={{ marginTop: 0, color: "var(--fg-muted)", fontSize: 11, letterSpacing: ".14em" }}>
        projects.ipynb — selected work
      </h2>

      <NbCell tag="[1]" kind="markdown">
        <ProjectTag color="mint">PRODUCTION</ProjectTag>
        <h3>ETECSA Asset Sync</h3>
        <div className="nb-sub">Production system deployed at Cuba's national telecom (ETECSA Cienfuegos). Cross-references OCS Inventory + Finance Excel + HR classifier, auto-generates `Building-Office` tags, runs z-score anomaly detection and data-quality scoring (A–F).</div>
      </NbCell>
      <NbCell tag="[2]" kind="code">
        <div className="nb-row">
          <span className="tech-pill py">Python</span>
          <span className="tech-pill web">Django 5.1</span>
          <span className="tech-pill data">Pandas</span>
          <span className="tech-pill infra">Docker</span>
          <span className="tech-pill data">MySQL</span>
          <span className="tech-pill infra">GitHub Actions</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.6 }}>
          <span className="comment"># real IT asset reconciliation across 3 source systems</span><br/>
          report <span className="op">=</span> AssetSync.<span className="fn">reconcile</span>(ocs_db, finance_xlsx, hr_csv)<br/>
          report.<span className="fn">score</span>()  <span className="comment"># A–F grade · entropy · anomalies</span>
        </div>
        <div className="nb-output">
          <div>
            <div style={{ color: "var(--acc-mint)", marginBottom: 4 }}>Out [2]:</div>
            <div>manual_processing <span style={{ color: "var(--acc-amber)" }}>− 95%</span> · errors <span style={{ color: "var(--acc-amber)" }}>0</span></div>
            <div style={{ color: "var(--fg-muted)", marginTop: 4 }}>45+ pytest tests · full CI/CD pipeline</div>
            <ProjectLinks links={[
              ["GitHub", "https://github.com/cmhh22/etecsa-asset-sync"],
              ["Live demo", "https://cmhh22.pythonanywhere.com"],
            ]}/>
          </div>
          <ConfMatrixViz />
        </div>
      </NbCell>

      <NbCell tag="[3]" kind="markdown">
        <ProjectTag color="blue">BIG DATA</ProjectTag>
        <h3>NYC Taxi ML Pipeline</h3>
        <div className="nb-sub">End-to-end ML pipeline predicting taxi trip duration on <strong>1.5M+ records</strong>. Distributed processing with Dask, model comparison (XGBoost / LightGBM / RF / GBM), SHAP interpretability.</div>
      </NbCell>
      <NbCell tag="[4]" kind="code">
        <div className="nb-row">
          <span className="tech-pill py">Python</span>
          <span className="tech-pill data">Dask</span>
          <span className="tech-pill ml">XGBoost</span>
          <span className="tech-pill ml">LightGBM</span>
          <span className="tech-pill ml">SHAP</span>
          <span className="tech-pill web">Streamlit</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.6 }}>
          <span className="comment"># XGBoost won; LightGBM deployed for inference speed</span><br/>
          xgb_r2 <span className="op">=</span> <span className="num">0.8234</span>   <span className="comment"># RMSE 0.3053</span><br/>
          shap.<span className="fn">summary_plot</span>(model, X_val)  <span className="comment"># haversine ≈ 78% of importance</span>
        </div>
        <div className="nb-output">
          <div>
            <div style={{ color: "var(--acc-mint)", marginBottom: 4 }}>Out [4]:</div>
            <div>R² <span style={{ color: "var(--acc-amber)" }}>0.8234</span> · LightGBM live on Streamlit</div>
            <div style={{ color: "var(--fg-muted)", marginTop: 4 }}>1.5M rows processed end-to-end on a laptop</div>
            <ProjectLinks links={[
              ["GitHub", "https://github.com/cmhh22/ml-bigdata"],
              ["Streamlit App", "https://ml-bigdata.streamlit.app"],
            ]}/>
          </div>
          <ForecastViz />
        </div>
      </NbCell>

      <NbCell tag="[5]" kind="markdown">
        <ProjectTag color="violet">LLM AGENT</ProjectTag>
        <h3>Minecraft LLM Agent — "Bartolo"</h3>
        <div className="nb-sub">AI-powered Minecraft bot that builds structures, gathers resources, crafts, and chats — all driven by LLMs generating live JavaScript. Cheerful Spanish-speaking personality. Lint + SES sandbox before executing AI-generated code.</div>
      </NbCell>
      <NbCell tag="[6]" kind="code">
        <div className="nb-row">
          <span className="tech-pill web">Node.js</span>
          <span className="tech-pill ml">GPT-4.1</span>
          <span className="tech-pill ml">Mistral</span>
          <span className="tech-pill ml">Grok-3</span>
          <span className="tech-pill web">Socket.io</span>
          <span className="tech-pill infra">SES Sandbox</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.6 }}>
          <span className="comment"># multi-model orchestration: gpt-4o · grok-3 · deepseek-r1 · mistral</span><br/>
          bot.<span className="fn">execute</span>(<span className="str">"build me a small house with a torch outside"</span>)
        </div>
        <div className="nb-output">
          <div>
            <div style={{ color: "var(--acc-mint)", marginBottom: 4 }}>Out [6]:</div>
            <div>spatial reasoning · code-as-action · web UI with live chat</div>
            <div style={{ color: "var(--fg-muted)", marginTop: 4 }}>Mineflayer + GitHub Models API + Socket.io</div>
            <ProjectLinks links={[
              ["GitHub", "https://github.com/cmhh22/minecraft-llm-agent"],
            ]}/>
          </div>
          <PulseViz />
        </div>
      </NbCell>

      <NbCell tag="[7]" kind="markdown">
        <ProjectTag color="amber">NLP / RAG</ProjectTag>
        <h3>Transformer Experiments — BERT vs Qwen + RAG</h3>
        <div className="nb-sub">
          Two-in-one: (a) fine-tuned <strong>BERT vs Qwen</strong> on 6-class emotion data — BERT 6× faster, Qwen 0.14% more accurate, both ~92.6% acc.
          (b) <strong>RAG with ChromaDB</strong> + Sentence Transformers (all-MiniLM-L6-v2) and TinyLlama / Groq / Gemini back-ends, with source citation.
        </div>
      </NbCell>
      <NbCell tag="[8]" kind="code">
        <div className="nb-row">
          <span className="tech-pill ml">PyTorch</span>
          <span className="tech-pill ml">HuggingFace</span>
          <span className="tech-pill ml">LangChain</span>
          <span className="tech-pill data">ChromaDB</span>
          <span className="tech-pill ml">Sentence Transformers</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.6 }}>
          <span className="comment"># RAG query with citation</span><br/>
          answer, sources <span className="op">=</span> rag.<span className="fn">ask</span>(<span className="str">"What is contrastive learning?"</span>)<br/>
          <span className="comment"># bert_acc=0.926 · qwen_acc=0.927 · bert_t=1x · qwen_t=6x</span>
        </div>
        <ProjectLinks links={[["GitHub", "https://github.com/cmhh22/transformer-experiments"]]}/>
      </NbCell>

      <NbCell tag="[9]" kind="markdown">
        <ProjectTag color="rose">DEEP LEARNING</ProjectTag>
        <h3>PyTorch Deep Learning Portfolio</h3>
        <div className="nb-sub">Three end-to-end implementations from scratch: MLP on MNIST (~98%), EfficientNet-B0 transfer learning on CIFAR-10 (~98%), Bi-LSTM + Attention on IMDB (~88%).</div>
      </NbCell>
      <NbCell tag="[10]" kind="code">
        <div className="nb-row">
          <span className="tech-pill ml">PyTorch</span>
          <span className="tech-pill ml">TorchVision</span>
          <span className="tech-pill ml">EfficientNet</span>
          <span className="tech-pill ml">LSTM + Attention</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.6 }}>
          <span className="comment"># mnist_mlp = 0.98 · cifar_effnet = 0.98 · imdb_bilstm = 0.88</span><br/>
          model <span className="op">=</span> <span className="fn">BiLSTMAttention</span>(vocab_size, embed_dim<span className="op">=</span><span className="num">128</span>, hidden<span className="op">=</span><span className="num">256</span>)
        </div>
        <ProjectLinks links={[["GitHub", "https://github.com/cmhh22/pytorch-deep-learning"]]}/>
      </NbCell>

      <NbCell tag="[11]" kind="markdown">
        <ProjectTag color="amber">DATA STORYTELLING</ProjectTag>
        <h3>EDA Storytelling — Airbnb NYC</h3>
        <div className="nb-sub">Interactive Streamlit dashboard with 7+ visualizations and real-time filters. Geographic heatmaps, temporal patterns, K-means segmentation, Pareto revenue analysis.</div>
      </NbCell>
      <NbCell tag="[12]" kind="code">
        <div className="nb-row">
          <span className="tech-pill data">Pandas</span>
          <span className="tech-pill data">Plotly</span>
          <span className="tech-pill data">Folium</span>
          <span className="tech-pill web">Streamlit</span>
          <span className="tech-pill ml">K-means + PCA</span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-dim)", lineHeight: 1.6 }}>
          <span className="comment"># key insights</span><br/>
          manhattan_share <span className="op">=</span> <span className="num">0.44</span>  <span className="comment"># 44% of listings</span><br/>
          superhost_revenue <span className="op">=</span> <span className="num">0.40</span>  <span className="comment"># 40% of bookings from 20% of hosts</span><br/>
          top_10pct_hosts <span className="op">=</span> <span className="num">0.50</span>  <span className="comment"># 50% of revenue</span>
        </div>
        <ProjectLinks links={[
          ["GitHub", "https://github.com/cmhh22/eda-storytelling"],
          ["Live Demo", "https://eda-storytelling.streamlit.app"],
        ]}/>
      </NbCell>
    </div>
  );
}

function ProjectTag({ color, children }) {
  const map = {
    mint: "var(--acc-mint)", blue: "var(--acc-blue)", violet: "var(--acc-violet)",
    amber: "var(--acc-amber)", rose: "var(--acc-rose)",
  };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 10, letterSpacing: "0.12em",
      padding: "2px 8px",
      borderRadius: 4,
      color: map[color],
      border: `1px solid ${map[color]}`,
      marginBottom: 8,
      fontFamily: "JetBrains Mono, monospace",
      fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: map[color] }}/>
      {children}
    </div>
  );
}
function ProjectLinks({ links }) {
  return (
    <div style={{ marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap" }}>
      {links.map(([label, url]) => (
        <a key={url} href={url} target="_blank" rel="noopener"
           style={{ color: "var(--acc-blue)", textDecoration: "underline", textDecorationColor: "var(--fg-muted)", textUnderlineOffset: 3, fontSize: 11.5 }}>
          {label} ↗
        </a>
      ))}
    </div>
  );
}

function NbCell({ tag, kind, children }) {
  return (
    <div className="nb-cell">
      <div className="nb-tag">{tag}</div>
      <div className="nb-card" data-kind={kind}>{children}</div>
    </div>
  );
}

function ConfMatrixViz() {
  return (
    <div className="viz">
      <svg viewBox="0 0 160 84">
        {Array.from({length: 6}, (_, r) =>
          Array.from({length: 12}, (_, c) => {
            const v = r === c % 6 ? 0.9 : Math.max(0, 0.18 - Math.abs((c%6)-r)*0.05);
            return (
              <rect key={`${r}-${c}`} x={c*13+2} y={r*13+2} width="11" height="11"
                fill="var(--acc-mint)" opacity={v} rx="1" />
            );
          })
        )}
      </svg>
    </div>
  );
}
function ForecastViz() {
  const pts = "0,60 16,52 32,55 48,40 64,42 80,28 96,32 112,22 128,30 144,18 160,24";
  const pred = "0,62 16,54 32,53 48,42 64,40 80,30 96,30 112,24 128,28 144,20 160,22";
  return (
    <div className="viz">
      <svg viewBox="0 0 160 84">
        <polyline points={pts} fill="none" stroke="var(--acc-blue)" strokeWidth="1.5" />
        <polyline points={pred} fill="none" stroke="var(--acc-amber)" strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    </div>
  );
}
function PulseViz() {
  let path = "M0,42 ";
  for (let x = 0; x < 160; x += 4) {
    const y = 42 + Math.sin(x/8)*8;
    path += `L${x},${y.toFixed(1)} `;
  }
  return (
    <div className="viz">
      <svg viewBox="0 0 160 84">
        <path d={path} fill="none" stroke="var(--acc-violet)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/* -------- SKILLS (skills.json) — fixed grid -------- */
function SkillsSection() {
  const cats = [
    { name: "Languages", color: "rose", items: [
      ["Python", 92], ["SQL", 85], ["JavaScript", 78],
      ["TypeScript", 72], ["C++", 68], ["HTML / CSS", 80],
    ]},
    { name: "AI / ML / Deep Learning", color: "mint", items: [
      ["PyTorch", 88], ["Scikit-learn", 90], ["XGBoost / LightGBM", 87],
      ["TensorFlow", 75], ["HuggingFace", 85], ["SHAP", 80],
    ]},
    { name: "GenAI & LLM Engineering", color: "violet", items: [
      ["LangChain", 85], ["RAG Pipelines", 87], ["ChromaDB", 82],
      ["LLM Agents", 80], ["Prompt Engineering", 86], ["OpenAI / GH Models", 84],
    ]},
    { name: "Backend & APIs", color: "amber", items: [
      ["Django", 90], ["FastAPI", 87], ["Node.js", 75],
      ["RESTful APIs", 88], ["WebSockets", 78],
    ]},
    { name: "Data engineering & DBs", color: "blue", items: [
      ["Pandas / NumPy", 92], ["PySpark / Dask", 78],
      ["PostgreSQL / MySQL", 82], ["SQLite", 85], ["ChromaDB", 80],
    ]},
    { name: "MLOps & DevOps", color: "cyan", items: [
      ["Docker", 85], ["GitHub Actions / CI", 82],
      ["MLflow", 72], ["Git", 90], ["Streamlit", 88],
    ]},
  ];

  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 120); return () => clearTimeout(t); }, []);

  return (
    <div className="page">
      <div className="json-line">
        <span className="brace">{"{ "}</span>
        <span className="key">"status"</span>: <span className="val">"always_learning"</span>
        <span className="brace">, </span>
        <span className="key">"passion"</span>: <span className="val">"immeasurable"</span>
        <span className="brace">, </span>
        <span className="key">"currently_studying"</span>: <span className="val">"Deep Learning + MLOps"</span>
        <span className="brace">{" }"}</span>
      </div>

      <div className="skills-grid">
        {cats.map(c => (
          <div className="skill-cat" data-color={c.color} key={c.name}>
            <h4>
              <span className="cat-dot"/>
              {c.name}
            </h4>
            {c.items.map(([k, v]) => (
              <div className="skill-row" key={k}>
                <div className="skill-name" title={k}>{k}</div>
                <div className="bar"><div className="bar-fill" style={{ width: visible ? `${v}%` : 0 }} /></div>
                <div className="pct">{v}%</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------- EXPERIENCE (experience.ts) -------- */
function ExperienceSection() {
  return (
    <div className="page">
      <div className="ts-block" style={{ fontFamily: "JetBrains Mono, monospace" }}>
        <span className="kw">interface</span> <span className="ty">Role</span> <span className="op">{"{"}</span><br/>
        <span className="indent"><span className="id">period</span>: <span className="ty">string</span>; <span className="id">title</span>: <span className="ty">string</span>; <span className="id">company</span>: <span className="ty">string</span>;</span><br/>
        <span className="indent"><span className="id">project</span>: <span className="ty">string</span>; <span className="id">highlights</span>: <span className="ty">string</span>[]; <span className="id">stack</span>: <span className="ty">string</span>[];</span><br/>
        <span className="op">{"}"}</span><br/>
        <br/>
        <span className="kw">const</span> <span className="id">experience</span>: <span className="ty">Role</span>[] <span className="op">=</span> [
      </div>

      <RoleCard
        title="AI-Driven Software Engineer"
        org="Freelance · Remote"
        years="Nov 2025 — Present"
        project="AI-Powered Financial Bot"
        stack={["Python", "asyncio", "SQLite", "OpenAI API", "Telegram Bot API"]}
        bullets={[
          "Built production-grade Telegram bot for automated accounting and inventory management across multiple business units.",
          "Integrated OpenAI API for NLP processing of financial transactions — reduced manual data entry by 40%.",
          "Architected async Python backend with SQLite, generating real-time PDF / Excel financial reports.",
          "Implemented role-based access control and multi-currency support for distributed cash flow management.",
        ]}
      />
      <RoleCard
        title="University Intern"
        org="ETECSA — Telecommunications Company of Cuba"
        years="Sept — Oct 2024"
        project="Asset Sync Inventory Automation"
        stack={["Python", "Django", "Pandas", "NumPy", "Docker", "GitHub Actions", "MySQL"]}
        bullets={[
          "Led development of an asset synchronization system reconciling financial DBs and operational inventories.",
          "Built bulk-update algorithms with Python + Django — reduced manual processing time by 95%, eliminated human errors.",
          "Designed an analytical engine with Pandas / NumPy for real-time anomaly detection and data quality metrics.",
          "Set up CI/CD pipelines with Docker and GitHub Actions for reliable production deployments.",
        ]}
      />

      <div className="ts-block" style={{ fontFamily: "JetBrains Mono, monospace", marginTop: 8 }}>
        <span className="op">];</span> <span className="comment">// + open-source contributions and side projects (see projects.ipynb)</span>
      </div>
    </div>
  );
}
function RoleCard({ title, org, years, project, stack, bullets }) {
  return (
    <div className="role-card">
      <h3>{title}</h3>
      <div className="org">{org}</div>
      <div className="when">{years}{project ? ` · ${project}` : ""}</div>
      <div className="nb-row" style={{ marginBottom: 4 }}>
        {stack.map(s => <span className="tech-pill" key={s}>{s}</span>)}
      </div>
      <ul>{bullets.map((b,i) => <li key={i}>{b}</li>)}</ul>
    </div>
  );
}

/* -------- EDUCATION (education.yml) -------- */
function EducationSection() {
  const certs = [
    "HackerRank — Python (Basic)",
    "HackerRank — SQL (Basic)",
    "Kaggle — Python",
    "Kaggle — Pandas",
    "Kaggle — Intro to Machine Learning",
    "Kaggle — Intermediate Machine Learning",
    "HuggingFace NLP Course (in progress)",
  ];
  const langs = [
    ["Spanish", "Native"],
    ["English", "Professional Working Proficiency"],
  ];

  return (
    <div className="page">
      <div style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.8 }}>
        <span className="kw">education</span><span className="op">:</span><br/>
        <span className="indent"><span style={{color:"var(--acc-blue)"}}>degree</span><span className="op">:</span> <span className="str">"B.S. in Computer Science"</span></span><br/>
        <span className="indent"><span style={{color:"var(--acc-blue)"}}>institution</span><span className="op">:</span> <span className="str">"Universidad Central 'Marta Abreu' de Las Villas (UCLV)"</span></span><br/>
        <span className="indent"><span style={{color:"var(--acc-blue)"}}>location</span><span className="op">:</span> <span className="str">"Cuba"</span></span><br/>
        <span className="indent"><span style={{color:"var(--acc-blue)"}}>period</span><span className="op">:</span> <span className="str">"2021 — Present"</span></span><br/>
        <span className="indent"><span style={{color:"var(--acc-blue)"}}>status</span><span className="op">:</span> <span className="str">"4th Year"</span></span><br/>
        <br/>
        <span className="kw">certifications</span><span className="op">:</span><br/>
        {certs.map(c => (
          <React.Fragment key={c}>
            <span className="indent"><span className="op">-</span> <span className="str">"{c}"</span></span><br/>
          </React.Fragment>
        ))}
        <br/>
        <span className="kw">languages</span><span className="op">:</span><br/>
        {langs.map(([l, lvl]) => (
          <React.Fragment key={l}>
            <span className="indent"><span className="op">-</span> {"{ "}<span style={{color:"var(--acc-blue)"}}>lang</span><span className="op">:</span> <span className="str">"{l}"</span>, <span style={{color:"var(--acc-blue)"}}>level</span><span className="op">:</span> <span className="str">"{lvl}"</span>{" }"}</span><br/>
          </React.Fragment>
        ))}
      </div>

      <div className="role-card" style={{ marginTop: 28, borderLeftColor: "var(--acc-violet)" }}>
        <h3>UCLV · B.S. in Computer Science</h3>
        <div className="org">Universidad Central "Marta Abreu" de Las Villas — Cuba</div>
        <div className="when">2021 — Present · 4th Year</div>
        <ul>
          <li>Core: algorithms, data structures, DBs, OS, computer networks, software engineering.</li>
          <li>Electives & self-study: machine learning, deep learning, NLP, distributed systems.</li>
          <li>Building an end-to-end AI/ML portfolio alongside coursework.</li>
        </ul>
      </div>
    </div>
  );
}

/* -------- CONTACT (contact.css) -------- */
function ContactSection() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText("carlosmanuelhdezhdez@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="page">
      <div className="contact-block">
        <div><span className="sel">.contact</span> <span className="br">{"{"}</span></div>
        <div className="css-prop"><span className="prop-k">email</span><a href="mailto:carlosmanuelhdezhdez@gmail.com" className="prop-v lnk">carlosmanuelhdezhdez@gmail.com</a><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div className="css-prop"><span className="prop-k">phone</span><span className="prop-v">"+53 56658638"</span><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div className="css-prop"><span className="prop-k">location</span><span className="prop-v">"Cuba"</span><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div className="css-prop"><span className="prop-k">github</span><a href="https://github.com/cmhh22" target="_blank" rel="noopener" className="prop-v lnk">github.com/cmhh22</a><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div className="css-prop"><span className="prop-k">linkedin</span><a href="https://linkedin.com/in/cmhh22" target="_blank" rel="noopener" className="prop-v lnk">linkedin.com/in/cmhh22</a><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div className="css-prop"><span className="prop-k">status</span><span className="prop-v">"open-to-opportunities"</span><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div><span className="br">{"}"}</span></div>
      </div>

      <div className="contact-block">
        <div><span className="sel">.looking-for</span> <span className="br">{"{"}</span></div>
        <div className="css-prop"><span className="prop-k">options</span><span className="prop-v">["Internships", "Research", "Remote AI/ML Positions", "Open Source Collaborations"]</span><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div className="css-prop"><span className="prop-k">response-time</span><span className="prop-v">"within 24h"</span><span style={{color:"var(--fg-muted)"}}>;</span></div>
        <div><span className="br">{"}"}</span></div>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href="mailto:carlosmanuelhdezhdez@gmail.com" className="btn primary">Send email</a>
        <a href="https://github.com/cmhh22" target="_blank" rel="noopener" className="btn">GitHub</a>
        <a href="https://linkedin.com/in/cmhh22" target="_blank" rel="noopener" className="btn">LinkedIn</a>
        <button className="btn" onClick={copy}>{copied ? "✓ Copied" : "Copy email"}</button>
      </div>
    </div>
  );
}

/* -------- README -------- */
function ReadmeSection() {
  return (
    <div className="page readme">
      <h1># cmhh22 / portfolio</h1>
      <div style={{ marginBottom: 14 }}>
        <span className="badge">build passing</span>
        <span className="badge">coverage 88%</span>
        <span className="badge">made with care</span>
      </div>
      <p className="md-p">
        This is the source for my portfolio. It's shaped like an IDE because that's where I actually live.
        Click any file in the sidebar to "open" it. Press <kbd className="kbd-keyword">Ctrl/⌘ + K</kbd> for the
        command palette, <kbd className="kbd-keyword">Ctrl/⌘ + J</kbd> to toggle the terminal, and{" "}
        <kbd className="kbd-keyword">Ctrl/⌘ + I</kbd> to chat with my Copilot.
      </p>

      <h2 className="md-h2"><span className="hash">##</span>Structure</h2>
      <ul className="md-list">
        <li><strong>home.py</strong> — landing & quick intro</li>
        <li><strong>about.md</strong> — long-form bio</li>
        <li><strong>projects.ipynb</strong> — 6 selected projects, notebook-style</li>
        <li><strong>skills.json</strong> — what I work with day-to-day</li>
        <li><strong>experience.ts</strong> — roles, typed</li>
        <li><strong>education.yml</strong> — degree, certifications, languages</li>
        <li><strong>contact.css</strong> — how to reach me</li>
      </ul>

      <h2 className="md-h2"><span className="hash">##</span>Stack</h2>
      <p className="md-p">
        React (no framework). JetBrains Mono. The Copilot is a thin wrapper around an LLM briefed on me.
        The terminal is fake but opinionated. Themes ship from the gear icon — try Dracula or Monokai.
      </p>

      <p className="md-p" style={{ marginTop: 20, color: "var(--fg-muted)", fontStyle: "italic" }}>
        Learning AI one commit at a time.
      </p>
    </div>
  );
}

/* Expose to window */
Object.assign(window, {
  HomeSection, AboutSection, ProjectsSection,
  SkillsSection, ExperienceSection, EducationSection,
  ContactSection, ReadmeSection,
});
