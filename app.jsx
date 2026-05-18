/* ==========================================================
   App shell — CMHH portfolio v3
   - VS Code default theme + 8 themes
   - resizable sidebar
   - activity bar panels (files / search / git / extensions)
   - terminal panels (Terminal / Problems / Output / Debug)
   - quote ticker
   ========================================================== */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* -------- File registry -------- */
const FILES = [
  { id: "home.py",        label: "home.py",         icon: "py",   group: "src",  render: () => <HomeSection onOpen={(f) => window.__openFile?.(f)} /> },
  { id: "about.md",       label: "about.md",        icon: "md",   group: "src",  render: () => <AboutSection /> },
  { id: "projects.ipynb", label: "projects.ipynb",  icon: "nb",   group: "src",  render: () => <ProjectsSection /> },
  { id: "skills.json",    label: "skills.json",     icon: "json", group: "data", render: () => <SkillsSection /> },
  { id: "experience.ts",  label: "experience.ts",   icon: "ts",   group: "src",  render: () => <ExperienceSection /> },
  { id: "education.yml",  label: "education.yml",   icon: "yml",  group: "data", render: () => <EducationSection /> },
  { id: "contact.css",    label: "contact.css",     icon: "css",  group: "src",  render: () => <ContactSection /> },
  { id: "README.md",      label: "README.md",       icon: "md",   group: "root", render: () => <ReadmeSection /> },
  { id: "resume.pdf",     label: "Carlos_Manuel_CV.pdf", icon: "pdf", group: "root", external: true },
];

/* -------- File icons -------- */
function FileIcon({ kind, size = 14 }) {
  const s = size;
  const common = { width: s, height: s };
  switch (kind) {
    case "py":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="6" rx="2" fill="var(--acc-blue)"/>
          <rect x="2" y="8" width="12" height="6" rx="2" fill="var(--acc-amber)"/>
          <circle cx="5" cy="5" r="1" fill="var(--bg-deep)"/>
          <circle cx="11" cy="11" r="1" fill="var(--bg-deep)"/>
        </svg>
      );
    case "md":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" fill="none" stroke="var(--acc-blue)"/>
          <path d="M3.5 10V6L5.5 9 7.5 6V10M9.5 6V10M9.5 10L11 8.5M9.5 10L12.5 7" stroke="var(--acc-blue)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "nb":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" rx="2" fill="var(--acc-amber)" opacity="0.18"/>
          <path d="M5 6h6M5 9h6M5 12h3" stroke="var(--acc-amber)" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="3.5" cy="6" r="0.6" fill="var(--acc-amber)"/>
          <circle cx="3.5" cy="9" r="0.6" fill="var(--acc-amber)"/>
          <circle cx="3.5" cy="12" r="0.6" fill="var(--acc-amber)"/>
        </svg>
      );
    case "json":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <path d="M5 3C3 3 3 5 3 6.5 3 8 2 8 2 8s1 0 1 1.5C3 11 3 13 5 13" stroke="var(--acc-mint)" fill="none" strokeWidth="1.3"/>
          <path d="M11 3c2 0 2 2 2 3.5C13 8 14 8 14 8s-1 0-1 1.5c0 1.5 0 3.5-2 3.5" stroke="var(--acc-mint)" fill="none" strokeWidth="1.3"/>
        </svg>
      );
    case "ts":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" rx="2" fill="var(--acc-blue)" opacity="0.2"/>
          <text x="3" y="11" fontFamily="JetBrains Mono" fontSize="6" fill="var(--acc-blue)" fontWeight="700">TS</text>
        </svg>
      );
    case "yml":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" rx="2" fill="var(--acc-amber)" opacity="0.2"/>
          <text x="2.5" y="11" fontFamily="JetBrains Mono" fontSize="5" fill="var(--acc-amber)" fontWeight="700">YML</text>
        </svg>
      );
    case "css":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <rect x="2" y="2" width="12" height="12" rx="2" fill="var(--acc-rose)" opacity="0.2"/>
          <text x="3" y="11" fontFamily="JetBrains Mono" fontSize="5" fill="var(--acc-rose)" fontWeight="700">CSS</text>
        </svg>
      );
    case "pdf":
      return (
        <svg {...common} viewBox="0 0 16 16">
          <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" fill="var(--acc-rose)" opacity="0.18" stroke="var(--acc-rose)"/>
          <text x="3.5" y="11" fontFamily="JetBrains Mono" fontSize="5" fill="var(--acc-rose)" fontWeight="700">PDF</text>
        </svg>
      );
    default:
      return <svg {...common} viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2" fill="var(--fg-muted)" opacity="0.2"/></svg>;
  }
}

/* -------- Activity bar icons -------- */
function ABIcon({ kind, active }) {
  const c = active ? "currentColor" : "currentColor";
  if (kind === "files") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/>
    </svg>
  );
  if (kind === "search") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>
    </svg>
  );
  if (kind === "git") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="12" r="2"/>
      <path d="M7 8v8M7 12h6M9 12a4 4 0 0 1 4-4"/>
    </svg>
  );
  if (kind === "pkg") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M4 7.5L12 12l8-4.5M12 12v9"/>
    </svg>
  );
  if (kind === "spark") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>
    </svg>
  );
  if (kind === "gear") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
  if (kind === "account") return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="9" r="3.5"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/>
    </svg>
  );
  return null;
}

/* ===================================================================== */
/* Themes registry */
const THEMES = [
  { id: "vscode",      label: "Default Dark+",   swatch: ["#1e1e1e", "#007acc", "#4fc1ff"] },
  { id: "midnight",    label: "Tokyo Night",     swatch: ["#1a1b26", "#7aa2f7", "#bb9af7"] },
  { id: "onedark",     label: "One Dark Pro",    swatch: ["#282c34", "#61afef", "#c678dd"] },
  { id: "dracula",     label: "Dracula",         swatch: ["#282a36", "#bd93f9", "#ff79c6"] },
  { id: "monokai",     label: "Monokai",         swatch: ["#272822", "#f92672", "#a6e22e"] },
  { id: "github-dark", label: "GitHub Dark",     swatch: ["#0d1117", "#58a6ff", "#d2a8ff"] },
  { id: "pinewood",    label: "Gruvbox",         swatch: ["#282828", "#fabd2f", "#fe8019"] },
  { id: "paper",       label: "Paper Mono",      swatch: ["#f6f2e7", "#6b3fa0", "#2a5599"] },
];

/* Quotes for the ticker */
const QUOTES = [
  ["Premature optimization is the root of all evil.", "Donald Knuth"],
  ["The best way to predict the future is to invent it.", "Alan Kay"],
  ["Talk is cheap. Show me the code.", "Linus Torvalds"],
  ["Machines take me by surprise with great frequency.", "Alan Turing"],
  ["Artificial intelligence is the new electricity.", "Andrew Ng"],
  ["Code is like humor. When you have to explain it, it's bad.", "Cory House"],
  ["Any sufficiently advanced technology is indistinguishable from magic.", "Arthur C. Clarke"],
  ["There are only two hard things: cache invalidation and naming things.", "Phil Karlton"],
  ["Programs must be written for people to read.", "Harold Abelson"],
  ["Simplicity is prerequisite for reliability.", "Edsger W. Dijkstra"],
  ["Stay hungry. Stay foolish.", "Steve Jobs"],
  ["Innovation distinguishes between a leader and a follower.", "Steve Jobs"],
  ["Design is not just what it looks like. Design is how it works.", "Steve Jobs"],
  ["When something is important enough, you do it even if the odds are not in your favor.", "Elon Musk"],
  ["The first step is to establish that something is possible; then probability will occur.", "Elon Musk"],
  ["The advance of technology is based on making it fit in so you don't really even notice it.", "Bill Gates"],
  ["Your most unhappy customers are your greatest source of learning.", "Bill Gates"],
  ["Software is a great combination between artistry and engineering.", "Bill Gates"],
  ["First, solve the problem. Then, write the code.", "John Johnson"],
  ["Computers are useless. They can only give you answers.", "Pablo Picasso"],
  ["Any fool can write code that a computer can understand.", "Martin Fowler"],
  ["Make it work, make it right, make it fast.", "Kent Beck"],
  ["The function of good software is to make the complex appear to be simple.", "Grady Booch"],
  ["The best error message is the one that never shows up.", "Thomas Fuchs"],
  ["Move fast and break things.", "Mark Zuckerberg"],
  ["By far the greatest danger of AI is that people conclude too early that they understand it.", "Eliezer Yudkowsky"],
  ["The real problem is not whether machines think but whether men do.", "B.F. Skinner"],
  ["It's not a bug, it's an undocumented feature.", "Anonymous"],
];

/* ===================================================================== */
function App() {
  const [activeFile, setActiveFile] = useState("home.py");
  const [openTabs, setOpenTabs] = useState(["home.py", "about.md", "projects.ipynb", "skills.json"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [activityBarVisible, setActivityBarVisible] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalTab, setTerminalTab] = useState("terminal");
  const [terminalHeight, setTerminalHeight] = useState(220);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [theme, setTheme] = useState("vscode");
  const [activityTab, setActivityTab] = useState("files");
  const [searchQ, setSearchQ] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState({});

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-w", sidebarWidth + "px");
  }, [sidebarWidth]);

  useEffect(() => {
    window.__openFile = (id) => openFile(id);
    window.__toggleSidebar = () => setSidebarOpen(s => !s);
    window.__toggleTerminal = () => setTerminalOpen(t => !t);
    window.__openPalette = () => setPaletteOpen(true);
    window.__toggleFullscreen = async () => {
      const el = document.documentElement;
      try {
        const isFs = document.fullscreenElement || document.webkitFullscreenElement;
        if (!isFs) {
          const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          if (req) await req.call(el);
        } else {
          const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
          if (exit) await exit.call(document);
        }
      } catch (e) {
        // iframe preview blocks fullscreen — open in new tab as fallback
        try { window.top.location.href = window.location.href; } catch (_) {
          window.open(window.location.href, "_blank");
        }
      }
    };
    return () => {
      delete window.__openFile;
      delete window.__toggleSidebar;
      delete window.__toggleFullscreen;
      delete window.__toggleTerminal;
      delete window.__openPalette;
    };
  });

  const openFile = useCallback((id) => {
    const f = FILES.find(x => x.id === id);
    if (!f) return;
    if (f.external) {
      window.open("uploads/Carlos_Manuel_CV_v2-6a0482d3.pdf", "_blank", "noopener");
      return;
    }
    setActiveFile(id);
    setOpenTabs(t => t.includes(id) ? t : [...t, id]);
    setPaletteOpen(false);
    setSettingsOpen(false);
    setMenuOpen(null);
  }, []);

  const closeTab = (id, e) => {
    e?.stopPropagation();
    setOpenTabs(t => {
      const next = t.filter(x => x !== id);
      if (id === activeFile && next.length) setActiveFile(next[next.length - 1]);
      if (!next.length) setActiveFile(null);
      return next;
    });
  };

  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(p => !p); }
      else if (mod && e.key.toLowerCase() === "p") { e.preventDefault(); setPaletteOpen(true); }
      else if (mod && e.key.toLowerCase() === "b") { e.preventDefault(); setSidebarOpen(s => !s); }
      else if (mod && e.key.toLowerCase() === "j") { e.preventDefault(); setTerminalOpen(t => !t); }
      else if (mod && e.key.toLowerCase() === "i") { e.preventDefault(); setCopilotOpen(c => !c); }
      else if (mod && e.key.toLowerCase() === ",") { e.preventDefault(); setSettingsOpen(s => !s); }
      else if (e.key === "F11") { e.preventDefault(); window.__toggleFullscreen?.(); }
      else if (e.key === "Escape") { setPaletteOpen(false); setSettingsOpen(false); setMenuOpen(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const activeFileObj = FILES.find(f => f.id === activeFile);

  const fileTypeLabel = useMemo(() => {
    if (!activeFileObj) return "—";
    return {
      py: "Python", md: "Markdown", nb: "Jupyter", json: "JSON",
      ts: "TypeScript", css: "CSS", pdf: "PDF", yml: "YAML",
    }[activeFileObj.icon] || "Text";
  }, [activeFileObj]);

  const toggleGroup = (g, force) => {
    if (g === "__set_src") return setCollapsedGroups(c => ({ ...c, src: force }));
    if (g === "__set_data") return setCollapsedGroups(c => ({ ...c, data: force }));
    if (g === "__set_root") return setCollapsedGroups(c => ({ ...c, root: force }));
    setCollapsedGroups(c => ({ ...c, [g]: !c[g] }));
  };

  /* Sidebar resize — collapses below threshold */
  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const onMove = (ev) => {
      ev.preventDefault();
      const newW = ev.clientX - 48;
      if (newW < 140) {
        setSidebarOpen(false);
      } else {
        if (!sidebarOpen) setSidebarOpen(true);
        setSidebarWidth(Math.min(500, Math.max(180, newW)));
      }
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      document.body.classList.remove("resizing-ew");
    };
    document.body.style.userSelect = "none";
    document.body.classList.add("resizing-ew");
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="app">
      <TitleBar />
      <MenuBar
        openFile={openFile}
        toggleSidebar={() => setSidebarOpen(s => !s)}
        toggleTerminal={() => setTerminalOpen(t => !t)}
        toggleCopilot={() => setCopilotOpen(c => !c)}
        openPalette={() => setPaletteOpen(true)}
        openSettings={() => setSettingsOpen(true)}
        openTabs={openTabs}
        closeTab={closeTab}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <div className="body" data-sidebar={sidebarOpen} data-copilot={copilotOpen} data-activity={activityBarVisible}>
        {activityBarVisible && (
          <ActivityBar
            activity={activityTab}
            setActivity={(k) => { setActivityTab(k); setSidebarOpen(true); }}
            onSettings={() => setSettingsOpen(true)}
            onCopilot={() => setCopilotOpen(c => !c)}
            copilotOpen={copilotOpen}
            onHide={() => setActivityBarVisible(false)}
          />
        )}
        {!activityBarVisible && (
          <button className="activity-restore" title="Show activity bar" onClick={() => setActivityBarVisible(true)}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        )}

        {sidebarOpen && (
          <Sidebar
            activeFile={activeFile}
            openFile={openFile}
            onCopilot={() => setCopilotOpen(c => !c)}
            activityTab={activityTab}
            collapsedGroups={collapsedGroups}
            toggleGroup={toggleGroup}
            searchQ={searchQ}
            setSearchQ={setSearchQ}
          />
        )}

        {sidebarOpen && <div className="resize-handle" onMouseDown={startResize}/>}

        <Editor
          openTabs={openTabs}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          closeTab={closeTab}
          terminalOpen={terminalOpen}
          setTerminalOpen={setTerminalOpen}
          terminalTab={terminalTab}
          setTerminalTab={setTerminalTab}
          terminalHeight={terminalHeight}
          setTerminalHeight={setTerminalHeight}
          openFile={openFile}
          activeFileObj={activeFileObj}
          setTheme={setTheme}
        />

        {copilotOpen && (
          <CopilotPanel onClose={() => setCopilotOpen(false)} />
        )}
      </div>

      <Ticker />

      <StatusBar
        fileType={fileTypeLabel}
        theme={theme}
        onThemeClick={() => setSettingsOpen(true)}
        copilotOpen={copilotOpen}
      />

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          openFile={openFile}
          toggleTerminal={() => setTerminalOpen(t => !t)}
          toggleSidebar={() => setSidebarOpen(s => !s)}
          toggleCopilot={() => setCopilotOpen(c => !c)}
          setTheme={setTheme}
        />
      )}

      {settingsOpen && (
        <SettingsPanel
          theme={theme}
          setTheme={setTheme}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

/* -------- TitleBar -------- */
function TitleBar() {
  return (
    <div className="titlebar">
      <div className="traffic">
        <span className="dot red" title="Close"/>
        <span className="dot yellow" title="Minimize"/>
        <span className="dot green" title="Zoom"/>
      </div>
      <div className="titlebar-center">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--fg-muted)"}}>
          <circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="12" r="2"/>
          <path d="M7 8v8M7 12h6M9 12a4 4 0 0 1 4-4"/>
        </svg>
        <span><span className="branch-mark">cmhh22</span> · portfolio</span>
        <span className="kbd-hint">⌘K</span>
      </div>
      <div className="titlebar-right">
        <button className="tb-icon-btn" title="Toggle sidebar (⌘B)" onClick={() => window.__toggleSidebar?.()}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <line x1="9" y1="4" x2="9" y2="20"/>
          </svg>
        </button>
        <button className="tb-icon-btn" title="Toggle fullscreen (F11)" onClick={() => window.__toggleFullscreen?.()}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>
          </svg>
        </button>
        <span className="live-dot"/>
        <span>v3.0 · live</span>
      </div>
    </div>
  );
}

/* -------- MenuBar -------- */
function MenuBar({ openFile, toggleSidebar, toggleTerminal, toggleCopilot, openPalette, openSettings, openTabs, closeTab, menuOpen, setMenuOpen }) {
  const menus = {
    "File": [
      { label: "New tab", kbd: "⌘T" },
      { label: "Open file…", kbd: "⌘P", action: openPalette },
      { label: "Close tab", kbd: "⌘W", action: () => activeClose(openTabs, closeTab) },
      { type: "divider" },
      { type: "section", label: "Open recent" },
      { label: "home.py", action: () => openFile("home.py") },
      { label: "projects.ipynb", action: () => openFile("projects.ipynb") },
      { label: "experience.ts", action: () => openFile("experience.ts") },
      { type: "divider" },
      { label: "Download CV", action: () => openFile("resume.pdf") },
    ],
    "Edit": [
      { label: "Undo", kbd: "⌘Z" }, { label: "Redo", kbd: "⌘⇧Z" },
      { type: "divider" }, { label: "Cut", kbd: "⌘X" }, { label: "Copy", kbd: "⌘C" }, { label: "Paste", kbd: "⌘V" },
      { type: "divider" }, { label: "Find", kbd: "⌘F" },
    ],
    "View": [
      { label: "Toggle sidebar", kbd: "⌘B", action: toggleSidebar },
      { label: "Toggle terminal", kbd: "⌘J", action: toggleTerminal },
      { label: "Toggle Copilot", kbd: "⌘I", action: toggleCopilot },
      { label: "Toggle fullscreen", kbd: "F11", action: () => window.__toggleFullscreen?.() },
      { type: "divider" },
      { label: "Settings", kbd: "⌘,", action: openSettings },
    ],
    "Go": [
      { label: "Go to file", kbd: "⌘P", action: openPalette },
      { label: "Command palette", kbd: "⌘K", action: openPalette },
      { type: "divider" },
      { label: "Go to home.py", action: () => openFile("home.py") },
      { label: "Go to README.md", action: () => openFile("README.md") },
    ],
    "Help": [
      { label: "Keyboard shortcuts", action: openPalette },
      { label: "About this site", action: () => openFile("README.md") },
      { label: "GitHub ↗", action: () => window.open("https://github.com/cmhh22", "_blank", "noopener") },
    ],
    "Copilot": [
      { label: "Open Copilot panel", kbd: "⌘I", action: toggleCopilot },
      { label: "Ask about Carlos", action: () => { toggleCopilot(); setTimeout(() => window.__copilotAsk?.("Tell me about Carlos"), 80); } },
      { label: "Ask about projects", action: () => { toggleCopilot(); setTimeout(() => window.__copilotAsk?.("What projects has Carlos built?"), 80); } },
      { label: "Ask about ETECSA", action: () => { toggleCopilot(); setTimeout(() => window.__copilotAsk?.("Tell me about his ETECSA experience"), 80); } },
    ],
  };

  return (
    <div className="menubar" onMouseLeave={() => setMenuOpen(null)}>
      {Object.keys(menus).map(name => (
        <div key={name} className="menu-item"
             data-open={menuOpen === name}
             onClick={() => setMenuOpen(menuOpen === name ? null : name)}
             onMouseEnter={() => menuOpen && setMenuOpen(name)}>
          {name}
          {menuOpen === name && (
            <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
              {menus[name].map((row, i) => {
                if (row.type === "divider") return <div key={i} className="menu-divider"/>;
                if (row.type === "section") return <div key={i} className="menu-section">{row.label}</div>;
                return (
                  <div key={i} className="menu-row" onClick={() => { row.action?.(); setMenuOpen(null); }}>
                    <span>{row.label}</span>
                    {row.kbd && <span className="kbd">{row.kbd}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
function activeClose(openTabs, closeTab) {
  const last = openTabs[openTabs.length - 1];
  if (last) closeTab(last);
}

/* -------- ActivityBar -------- */
function ActivityBar({ activity, setActivity, onSettings, onCopilot, copilotOpen }) {
  return (
    <div className="activity">
      <button className={`ab-btn ${activity === "files" ? "active" : ""}`} title="Explorer" onClick={() => setActivity("files")}>
        <ABIcon kind="files" active={activity === "files"}/>
      </button>
      <button className={`ab-btn ${activity === "search" ? "active" : ""}`} title="Search" onClick={() => setActivity("search")}>
        <ABIcon kind="search" active={activity === "search"}/>
      </button>
      <button className={`ab-btn ${activity === "git" ? "active" : ""}`} title="Source Control" onClick={() => setActivity("git")}>
        <ABIcon kind="git" active={activity === "git"}/>
        <span className="badge">2</span>
      </button>
      <button className={`ab-btn ${activity === "pkg" ? "active" : ""}`} title="Extensions" onClick={() => setActivity("pkg")}>
        <ABIcon kind="pkg" active={activity === "pkg"}/>
      </button>
      <button className={`ab-btn ${copilotOpen ? "active" : ""}`} title="Copilot (⌘I)" onClick={onCopilot}>
        <ABIcon kind="spark" active={copilotOpen}/>
      </button>
      <div className="spacer"/>
      <button className="ab-btn" title="Account" onClick={() => window.open("https://github.com/cmhh22", "_blank", "noopener")}>
        <ABIcon kind="account" active={false}/>
      </button>
      <button className="ab-btn" title="Settings (⌘,)" onClick={onSettings}>
        <ABIcon kind="gear" active={false}/>
      </button>
    </div>
  );
}

/* -------- Sidebar -------- */
function Sidebar({ activeFile, openFile, onCopilot, activityTab, collapsedGroups, toggleGroup, searchQ, setSearchQ }) {
  if (activityTab === "search") return <SearchPane openFile={openFile} searchQ={searchQ} setSearchQ={setSearchQ}/>;
  if (activityTab === "git") return <GitPane openFile={openFile}/>;
  if (activityTab === "pkg") return <ExtensionsPane/>;

  // default: files
  const allCollapsed = collapsedGroups.src && collapsedGroups.data && collapsedGroups.root;
  const toggleAll = () => {
    const next = !allCollapsed;
    toggleGroup("__set_src", next);
    toggleGroup("__set_data", next);
    toggleGroup("__set_root", next);
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="title-row">
          <span>Explorer</span>
        </div>
        <div className="actions">
          <span className="icon-btn" title="New file">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </span>
          <span className="icon-btn" title={allCollapsed ? "Expand all" : "Collapse all"} onClick={toggleAll}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {allCollapsed
                ? <path d="M6 9l6 6 6-6"/>
                : <path d="M6 15l6-6 6 6"/>}
            </svg>
          </span>
        </div>
      </div>
      <div className="sidebar-tree">
        <div className={`tree-group root-group ${allCollapsed ? "collapsed" : ""}`} onClick={toggleAll}>
          <span className="chev">▾</span> CMHH22-PORTFOLIO
        </div>

        <TreeGroup label="src" collapsed={collapsedGroups.src} onToggle={() => toggleGroup("src")}>
          {FILES.filter(f => f.group === "src").map(f => (
            <FileRow key={f.id} f={f} active={activeFile === f.id} onClick={() => openFile(f.id)} />
          ))}
        </TreeGroup>

        <TreeGroup label="data" collapsed={collapsedGroups.data} onToggle={() => toggleGroup("data")}>
          {FILES.filter(f => f.group === "data").map(f => (
            <FileRow key={f.id} f={f} active={activeFile === f.id} onClick={() => openFile(f.id)} />
          ))}
        </TreeGroup>

        <TreeGroup label="root" collapsed={collapsedGroups.root} onToggle={() => toggleGroup("root")}>
          {FILES.filter(f => f.group === "root").map(f => (
            <FileRow key={f.id} f={f} active={activeFile === f.id} onClick={() => openFile(f.id)} />
          ))}
        </TreeGroup>
      </div>

      <div className="copilot-launcher" onClick={onCopilot}>
        <span className="sparkle">✦</span>
        <div>
          <div>CMHH's Copilot</div>
          <div style={{ color: "var(--fg-muted)", fontSize: 10 }}>Ask anything</div>
        </div>
        <span className="meta">AI</span>
      </div>
    </aside>
  );
}

function TreeGroup({ label, collapsed, onToggle, children }) {
  return (
    <>
      <div className={`tree-group ${collapsed ? "collapsed" : ""}`} onClick={onToggle}>
        <span className="chev">▾</span> {label}
      </div>
      {!collapsed && children}
    </>
  );
}

function FileRow({ f, active, onClick }) {
  // mock git status
  const mod = (f.id === "projects.ipynb" || f.id === "skills.json") ? "M" : null;
  return (
    <div className={`file-row ${active ? "active" : ""}`} onClick={onClick}>
      <FileIcon kind={f.icon}/>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", color: mod ? "var(--acc-amber)" : "inherit" }}>{f.label}</span>
      {mod && <span className="git-mark">{mod}</span>}
    </div>
  );
}

/* -------- Search Pane -------- */
const SEARCHABLE = [
  { file: "home.py", text: "Carlos Manuel Hernández AI-Driven Software Engineer ML Engineer Data Scientist UCLV Cuba LLMs MLOps deep learning Python PyTorch Django" },
  { file: "about.md", text: "4th-year Computer Science student UCLV Universidad Central Marta Abreu Las Villas AI ML portfolio ETECSA telecom Telegram bot LLMs RAG Transformers" },
  { file: "projects.ipynb", text: "ETECSA Asset Sync Django Pandas Docker NYC Taxi XGBoost LightGBM SHAP Dask Streamlit Minecraft LLM Agent Bartolo GPT-4 Mistral Grok Socket.io Transformer BERT Qwen RAG ChromaDB PyTorch MLP CNN EfficientNet LSTM Attention EDA Airbnb K-means" },
  { file: "skills.json", text: "Python SQL JavaScript TypeScript C++ PyTorch Scikit-learn XGBoost LightGBM TensorFlow HuggingFace SHAP LangChain RAG ChromaDB LLM Agents OpenAI Django FastAPI Node Socket.io Pandas NumPy Polars Dask PostgreSQL MySQL Docker GitHub Actions MLflow Git Streamlit" },
  { file: "experience.ts", text: "AI-Driven Software Engineer Freelance Telegram bot OpenAI ETECSA University Intern Asset Sync Django Pandas Docker GitHub Actions MySQL" },
  { file: "education.yml", text: "B.S. Computer Science UCLV Universidad Central Marta Abreu Las Villas Cuba HackerRank Kaggle HuggingFace NLP Course Spanish English" },
  { file: "contact.css", text: "email carlosmanuelhdezhdez@gmail.com phone +53 56658638 Cuba github.com/cmhh22 linkedin.com/in/cmhh22 internships research remote AI ML positions" },
  { file: "README.md", text: "cmhh22 portfolio IDE VS Code sidebar command palette terminal Copilot themes Dracula Monokai" },
];

function SearchPane({ openFile, searchQ, setSearchQ }) {
  const results = useMemo(() => {
    const q = searchQ.trim();
    if (!q) return [];
    const re = new RegExp(escapeRegex(q), "gi");
    return SEARCHABLE.map(s => {
      const matches = [];
      let m;
      const local = new RegExp(escapeRegex(q), "gi");
      while ((m = local.exec(s.text)) && matches.length < 4) {
        const start = Math.max(0, m.index - 24);
        const end = Math.min(s.text.length, m.index + q.length + 28);
        matches.push((start > 0 ? "…" : "") + s.text.slice(start, end) + (end < s.text.length ? "…" : ""));
      }
      return { file: s.file, matches };
    }).filter(r => r.matches.length);
  }, [searchQ]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="title-row"><span>Search</span></div>
      </div>
      <div className="search-pane">
        <div className="search-input">
          <span className="sp-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>
            </svg>
          </span>
          <input autoFocus placeholder="Search…" value={searchQ} onChange={e => setSearchQ(e.target.value)}/>
          {searchQ && <span onClick={() => setSearchQ("")} className="sp-clear" title="Clear">×</span>}
        </div>
        <div className="search-results">
          {searchQ && !results.length && (
            <div className="empty-state">No results for "{searchQ}"</div>
          )}
          {!searchQ && (
            <div className="empty-state">Type to search across all files.</div>
          )}
          {results.map(r => (
            <div className="search-file-group" key={r.file}>
              <div className="file-head" onClick={() => openFile(r.file)}>
                <FileIcon kind={FILES.find(f => f.id === r.file)?.icon}/>
                <span>{r.file}</span>
                <span className="count">{r.matches.length}</span>
              </div>
              {r.matches.map((m, i) => (
                <div key={i} className="search-snippet" onClick={() => openFile(r.file)}
                     dangerouslySetInnerHTML={{ __html: highlight(m, searchQ) }}/>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function highlight(s, q) {
  if (!q.trim()) return s;
  const re = new RegExp("(" + escapeRegex(q) + ")", "gi");
  return s.replace(/[<>&]/g, c => ({"<":"&lt;",">":"&gt;","&":"&amp;"}[c])).replace(re, "<mark>$1</mark>");
}

/* -------- Git Pane -------- */
function GitPane({ openFile }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="title-row"><span>Source Control</span></div>
        <div className="actions">
          <span className="icon-btn" title="Pull">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v12M6 10l6 6 6-6M4 20h16"/>
            </svg>
          </span>
          <span className="icon-btn" title="Push">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V8M6 14l6-6 6 6M4 4h16"/>
            </svg>
          </span>
          <span className="icon-btn" title="Refresh">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 15-6.7M21 4v5h-5M21 12a9 9 0 0 1-15 6.7M3 20v-5h5"/>
            </svg>
          </span>
        </div>
      </div>
      <div className="git-pane">
        <div className="commit-input">
          <span className="sp-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="M14 6l4 4"/>
            </svg>
          </span>
          <input placeholder="Commit message…" defaultValue="chore: update portfolio"/>
        </div>

        <div className="git-section-head">
          <span>Changes</span><span className="count">2</span>
        </div>
        <div className="git-row" onClick={() => openFile("projects.ipynb")}>
          <FileIcon kind="nb"/>
          <span>projects.ipynb</span>
          <span className="mark m">M</span>
        </div>
        <div className="git-row" onClick={() => openFile("skills.json")}>
          <FileIcon kind="json"/>
          <span>skills.json</span>
          <span className="mark m">M</span>
        </div>

        <div className="git-section-head" style={{ marginTop: 12 }}>
          <span>Recent commits</span>
        </div>
        {[
          ["9f2a1b7", "feat: add transformer experiments project"],
          ["4e8c0d3", "ship: ETECSA Asset Sync v1.0 — 95% reduction"],
          ["2bf9512", "feat: Cumulus — soil moisture forecast"],
          ["a012ff4", "init: portfolio scaffold"],
        ].map(([hash, msg]) => (
          <div className="git-commit-row" key={hash}>
            <span className="hash">{hash}</span>
            <span className="msg">{msg}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* -------- Extensions Pane -------- */
function ExtIcon({ kind }) {
  const stroke = "currentColor";
  const common = { width: 18, height: 18, fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "copilot") return (
    <svg {...common} viewBox="0 0 24 24">
      <path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3Z"/>
    </svg>
  );
  if (kind === "palette") return (
    <svg {...common} viewBox="0 0 24 24">
      <path d="M12 3a9 9 0 0 0 0 18 2 2 0 0 0 2-2c0-1 1-2 2-2h2a3 3 0 0 0 3-3 9 9 0 0 0-9-9Z"/>
      <circle cx="7" cy="12" r="1.2"/><circle cx="9.5" cy="8" r="1.2"/><circle cx="14" cy="7" r="1.2"/><circle cx="17" cy="10" r="1.2"/>
    </svg>
  );
  if (kind === "notebook") return (
    <svg {...common} viewBox="0 0 24 24">
      <rect x="5" y="4" width="14" height="16" rx="2"/>
      <line x1="5" y1="9" x2="19" y2="9"/>
      <line x1="9" y1="4" x2="9" y2="20"/>
    </svg>
  );
  if (kind === "search") return (
    <svg {...common} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>
    </svg>
  );
  if (kind === "terminal") return (
    <svg {...common} viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M7 10l3 2-3 2M13 14h4"/>
    </svg>
  );
  if (kind === "git") return (
    <svg {...common} viewBox="0 0 24 24">
      <circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="12" r="2"/>
      <path d="M7 8v8M7 12h6M9 12a4 4 0 0 1 4-4"/>
    </svg>
  );
  return null;
}

function ExtensionsPane() {
  const exts = [
    { icon: "copilot",  tint: "violet", name: "CMHH's Copilot", pub: "cmhh22", desc: "Carlos's AI assistant — answers about projects, skills, experience.", status: "installed" },
    { icon: "palette",  tint: "blue",   name: "Theme Switcher", pub: "cmhh22", desc: "8 hand-picked color themes including Default Dark+, Dracula, Monokai.", status: "installed" },
    { icon: "notebook", tint: "amber",  name: "Notebook Renderer", pub: "cmhh22", desc: "Jupyter-style cells for projects.ipynb.", status: "installed" },
    { icon: "search",   tint: "mint",   name: "Workspace Search", pub: "cmhh22", desc: "Full-text search across all portfolio files.", status: "installed" },
    { icon: "terminal", tint: "rose",   name: "Integrated Terminal", pub: "cmhh22", desc: "Fake but opinionated terminal with easter eggs.", status: "installed" },
    { icon: "git",      tint: "cyan",   name: "Source Control", pub: "cmhh22", desc: "Mock git panel — changes, recent commits.", status: "installed" },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-header"><div className="title-row"><span>Extensions</span></div></div>
      <div className="ext-pane">
        {exts.map(e => (
          <div className="ext-row" key={e.name}>
            <div className={`ext-icon tint-${e.tint}`}><ExtIcon kind={e.icon}/></div>
            <div className="ext-body">
              <div className="ext-name">{e.name}</div>
              <div className="ext-pub">{e.pub}</div>
              <div className="ext-desc">{e.desc}</div>
            </div>
            <div className={`ext-status ${e.status}`}>{e.status}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* -------- Editor -------- */
function Editor({ openTabs, activeFile, setActiveFile, closeTab, terminalOpen, setTerminalOpen, terminalTab, setTerminalTab, terminalHeight, setTerminalHeight, openFile, activeFileObj, setTheme }) {
  return (
    <main className="editor" data-terminal={terminalOpen} style={{ gridTemplateRows: `36px auto 1fr ${terminalOpen ? terminalHeight : 0}px` }}>
      <div className="tab-bar">
        {openTabs.map(id => {
          const f = FILES.find(x => x.id === id);
          if (!f) return null;
          return (
            <div key={id} className={`tab ${activeFile === id ? "active" : ""}`} onClick={() => setActiveFile(id)}>
              <FileIcon kind={f.icon}/>
              <span>{f.label}</span>
              <button className="close" onClick={(e) => closeTab(id, e)}>×</button>
            </div>
          );
        })}
        <div style={{ flex: 1 }}/>
      </div>

      <div className="breadcrumbs">
        {activeFileObj ? (
          <>
            <span className="crumb">cmhh22-portfolio</span>
            <span className="crumb">{activeFileObj.group === "root" ? "." : activeFileObj.group}</span>
            <span className="crumb">{activeFileObj.label}</span>
          </>
        ) : <span className="crumb">no file open</span>}
      </div>

      <div className="editor-content">
        {activeFileObj ? activeFileObj.render() : (
          <div style={{ padding: 64, color: "var(--fg-muted)", textAlign: "center" }}>
            No file open. Press <kbd className="kbd-keyword">⌘P</kbd> to open one.
          </div>
        )}
      </div>

      {terminalOpen && (
        <TerminalPanel
          onClose={() => setTerminalOpen(false)}
          openFile={openFile}
          terminalTab={terminalTab}
          setTerminalTab={setTerminalTab}
          setTheme={setTheme}
          terminalHeight={terminalHeight}
          setTerminalHeight={setTerminalHeight}
        />
      )}
    </main>
  );
}

/* -------- Ticker (type then erase) -------- */
function Ticker() {
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("type"); // type | hold | erase

  useEffect(() => {
    const [text] = QUOTES[qi];
    let id;
    if (phase === "type") {
      let i = typed.length;
      id = setInterval(() => {
        i++;
        setTyped(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setPhase("hold"); }
      }, 32);
    } else if (phase === "hold") {
      id = setTimeout(() => setPhase("erase"), 2400);
    } else if (phase === "erase") {
      let i = typed.length;
      id = setInterval(() => {
        i--;
        setTyped(text.slice(0, Math.max(0, i)));
        if (i <= 0) {
          clearInterval(id);
          setQi(q => (q + 1) % QUOTES.length);
          setPhase("type");
        }
      }, 18);
    }
    return () => { clearInterval(id); clearTimeout(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qi]);

  const [, attr] = QUOTES[qi];
  return (
    <div className="ticker">
      <span className="label">QUOTE</span>
      <span className="quote-text">{typed}<span className="blink-caret"/></span>
      <span className="quote-attr">{phase !== "erase" && typed.length > 0 ? `— ${attr}` : ""}</span>
    </div>
  );
}

/* -------- StatusBar -------- */
function StatusBar({ fileType, theme, onThemeClick, copilotOpen }) {
  const themeLabel = THEMES.find(t => t.id === theme)?.label || "Theme";
  const now = useClock();
  return (
    <div className="statusbar">
      <div className="sb-item accent-block" onClick={() => window.open("https://github.com/cmhh22", "_blank", "noopener")}>
        ⎇ main
      </div>
      <div className="sb-item">↑1 ↓0</div>
      <div className="sb-item">⚠ 0  ✗ 0</div>
      <div className="sb-item" style={{ color: "inherit", opacity: 0.85 }}>cmhh22's portfolio</div>
      <div className="spacer"/>
      <div className="sb-item">{copilotOpen ? "✦ Copilot · on" : "✦ Copilot"}</div>
      <div className="sb-item">{fileType}</div>
      <div className="sb-item">UTF-8</div>
      <div className="sb-item">LF</div>
      <div className="sb-item" onClick={onThemeClick}>{themeLabel}</div>
      <div className="sb-item" style={{ paddingRight: 12 }}>{now}</div>
    </div>
  );
}
function useClock() {
  const [t, setT] = useState(() => fmtClock(new Date()));
  useEffect(() => {
    const id = setInterval(() => setT(fmtClock(new Date())), 30 * 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}
function fmtClock(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

/* -------- Terminal Panel (with tabs) -------- */
function TerminalPanel({ onClose, openFile, terminalTab, setTerminalTab, setTheme, terminalHeight, setTerminalHeight }) {
  const handleRef = useRef(null);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    const onDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startH = terminalHeight;
      const onMove = (ev) => {
        ev.preventDefault();
        const delta = startY - ev.clientY;
        const newH = startH + delta;
        if (newH < 60) {
          onClose();
          cleanup();
        } else {
          setTerminalHeight(Math.max(80, Math.min(window.innerHeight - 160, newH)));
        }
      };
      const cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        document.body.style.userSelect = "";
        document.body.classList.remove("resizing-ns");
      };
      const onUp = () => cleanup();
      document.body.style.userSelect = "none";
      document.body.classList.add("resizing-ns");
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
    handle.addEventListener("mousedown", onDown);
    return () => handle.removeEventListener("mousedown", onDown);
  }, [terminalHeight, onClose, setTerminalHeight]);

  return (
    <div className="terminal">
      <div className="terminal-resize" ref={handleRef} title="Drag to resize">
        <span className="grip-dot"/>
        <span className="grip-dot"/>
        <span className="grip-dot"/>
      </div>
      <div className="terminal-tabs">
        <div className={`tt ${terminalTab === "terminal" ? "active" : ""}`} onClick={() => setTerminalTab("terminal")}>Terminal</div>
        <div className={`tt ${terminalTab === "problems" ? "active" : ""}`} onClick={() => setTerminalTab("problems")}>
          Problems <span className="badge">4</span>
        </div>
        <div className={`tt ${terminalTab === "output" ? "active" : ""}`} onClick={() => setTerminalTab("output")}>Output</div>
        <div className={`tt ${terminalTab === "debug" ? "active" : ""}`} onClick={() => setTerminalTab("debug")}>Debug Console</div>
        <button className="close-x" onClick={onClose} title="Close panel">×</button>
      </div>
      {terminalTab === "terminal" && <Terminal openFile={openFile} setTheme={setTheme}/>}
      {terminalTab === "problems" && <ProblemsPane openFile={openFile}/>}
      {terminalTab === "output" && <OutputPane/>}
      {terminalTab === "debug" && <DebugPane/>}
    </div>
  );
}

function Terminal({ openFile, setTheme }) {
  const [lines, setLines] = useState(() => initialLines());
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [cwd, setCwd] = useState("~");
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    window.__clearTerminal = () => setLines(initialLines());
    return () => { delete window.__clearTerminal; };
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 1e9 });
  }, [lines]);

  function append(content) {
    setLines(l => [...l, ...(Array.isArray(content) ? content : [content])]);
  }

  function runCommand(raw) {
    const cmd = raw.trim();
    setHistory(h => [...h, cmd]);
    setHistIdx(-1);
    append({ kind: "prompt", cwd, text: cmd });
    if (!cmd) return;

    const lower = cmd.toLowerCase();
    if (lower === "sudo hire me") {
      append([
        { kind: "text", text: "[sudo] authorizing recruiter privileges…", color: "ok" },
        { kind: "text", text: "✓ Permission granted. Redirecting to contact…", color: "ok" },
      ]);
      openFile("contact.css");
      return;
    }

    const [base, ...args] = cmd.split(/\s+/);
    switch (base) {
      case "help":
        append([
          { kind: "help", text: "COMMANDS" },
          { kind: "help-row", left: "ls",        right: "list files" },
          { kind: "help-row", left: "open <f>",  right: "open file in editor" },
          { kind: "help-row", left: "whoami",    right: "short bio" },
          { kind: "help-row", left: "contact",   right: "contact info" },
          { kind: "help-row", left: "resume",    right: "download CV" },
          { kind: "help-row", left: "github",    right: "open my GitHub" },
          { kind: "help-row", left: "theme <n>", right: "switch color theme" },
          { kind: "help-row", left: "copilot",   right: "✦ open AI assistant" },
          { kind: "help-row", left: "clear",     right: "clear terminal" },
          { kind: "text",     text: "" },
          { kind: "text",     text: "hidden gems: joke · coffee · sudo hire me", color: "text-muted" },
        ]);
        break;
      case "ls":
        append({ kind: "text", text: FILES.map(f => f.label).join("   "), color: "ok" });
        break;
      case "pwd":
        append({ kind: "text", text: "/home/cmhh22/portfolio" });
        break;
      case "whoami":
        append([
          { kind: "text", text: "carlos_manuel — ai-driven software engineer" },
          { kind: "text", text: "4th-year CS @ UCLV · Cuba · open to opportunities" },
        ]);
        break;
      case "cat":
      case "open": {
        const target = args[0];
        const f = FILES.find(x => x.id === target);
        if (!f) { append({ kind: "text", text: `${base}: ${target || "<file>"} not found`, color: "err" }); break; }
        openFile(target);
        append({ kind: "text", text: `→ opened ${target}`, color: "ok" });
        break;
      }
      case "skills":
        openFile("skills.json");
        append({ kind: "text", text: "→ opening skills.json", color: "ok" });
        break;
      case "experience":
        openFile("experience.ts");
        append({ kind: "text", text: "→ opening experience.ts", color: "ok" });
        break;
      case "contact":
        openFile("contact.css");
        append({ kind: "text", text: "carlosmanuelhdezhdez@gmail.com · github.com/cmhh22", color: "ok" });
        break;
      case "github":
        window.open("https://github.com/cmhh22", "_blank", "noopener");
        append({ kind: "text", text: "→ github.com/cmhh22", color: "ok" });
        break;
      case "resume":
      case "cv":
        window.open("uploads/Carlos_Manuel_CV_v2-6a0482d3.pdf", "_blank", "noopener");
        append({ kind: "text", text: "[cv] opening Carlos_Manuel_CV.pdf", color: "ok" });
        break;
      case "theme": {
        const t = args[0];
        const ok = THEMES.map(x => x.id);
        if (!ok.includes(t)) { append({ kind: "text", text: `theme: choose one of: ${ok.join(", ")}`, color: "err" }); break; }
        setTheme(t);
        append({ kind: "text", text: `✓ theme → ${t}`, color: "ok" });
        break;
      }
      case "copilot":
        append({ kind: "text", text: "✦ opening Copilot panel…", color: "ok" });
        window.__toggleCopilot?.();
        break;
      case "joke": {
        const jokes = [
          "Why do ML engineers love nature? Because of all the trees and random forests.",
          "There are only 10 types of people: those who understand binary and those who don't.",
          "My code doesn't have bugs. It develops random unsupervised features.",
          "How many prompts does it take to change a lightbulb? Just one — but it has to be very specific.",
          "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
        ];
        append({ kind: "text", text: "› " + jokes[Math.floor(Math.random() * jokes.length)], color: "acc" });
        break;
      }
      case "coffee":
        append({ kind: "text", text: "[coffee] brewing... fueling the ML pipeline", color: "ok" });
        break;
      case "clear":
        setLines([]); break;
      case "exit":
        window.__closeTerminal?.(); break;
      case "echo":
        append({ kind: "text", text: args.join(" ") });
        break;
      case "cd":
        if (!args[0] || args[0] === "~") setCwd("~");
        else if (args[0] === "..") setCwd("~");
        else setCwd(`~/${args[0]}`);
        break;
      case "date":
        append({ kind: "text", text: new Date().toString() });
        break;
      case "sudo":
        append({ kind: "text", text: "nice try.", color: "err" });
        break;
      case "rm":
        append({ kind: "text", text: "denied: this portfolio is immutable.", color: "err" });
        break;
      default:
        append({ kind: "text", text: `${base}: command not found — try 'help'`, color: "err" });
    }
  }

  const onKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); runCommand(input); setInput(""); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next); setInput(history[next]);
    }
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= history.length) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(next); setInput(history[next]); }
    }
  };

  return (
    <div className="terminal-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) => <TermLine key={i} line={l} cwd={cwd}/>)}
      <div className="term-line term-input-row">
        <Prompt cwd={cwd}/>
        <div className="term-input-wrap">
          <input ref={inputRef} className="term-input" autoFocus
                 value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
                 spellCheck="false"/>
          <span className="term-block-cursor" aria-hidden="true"
                style={{ left: `${input.length}ch` }}/>
        </div>
      </div>
    </div>
  );
}
function initialLines() {
  return [
    { kind: "text", text: "Welcome! Type 'help' to see available commands.", color: "ok" },
    { kind: "text", text: "" },
  ];
}
function Prompt({ cwd }) {
  return (
    <span className="term-line">
      <span className="prompt-user">cmhh22</span>
      <span className="prompt-arrow">@</span>
      <span className="prompt-host">portfolio</span>
      <span className="prompt-arrow">:</span>
      <span className="prompt-path">{cwd}</span>
      <span className="prompt-arrow">$ </span>
    </span>
  );
}
function TermLine({ line, cwd }) {
  if (line.kind === "prompt") {
    return (
      <div className="term-line">
        <Prompt cwd={cwd}/>
        <span className="cmd">{line.text}</span>
      </div>
    );
  }
  if (line.kind === "help") {
    return <div className="term-help-head">{line.text}</div>;
  }
  if (line.kind === "help-row") {
    return (
      <div className="term-help-row">
        <span className="hk">{line.left}</span>
        <span className="hd">{line.right}</span>
      </div>
    );
  }
  const cls = line.color === "text-muted" ? "" : (line.color || "");
  const style = line.color === "text-muted" ? { color: "var(--fg-muted)" } : undefined;
  return (
    <div className={`term-line ${cls}`} style={style}>{line.text || "\u00a0"}</div>
  );
}

/* -------- Problems / Output / Debug -------- */
const PROBLEMS = [
  { sev: "info", text: "Tip: press ⌘K for the command palette.", where: "README.md", pos: "L4:14" },
  { sev: "info", text: "Hint: try `theme dracula` in the terminal.", where: "skills.json", pos: "L1:1" },
  { sev: "warn", text: "TODO: ship Tinta cyanotype demo before summer.", where: "projects.ipynb", pos: "L42:8" },
  { sev: "warn", text: "Coffee level critically low.", where: "kitchen.yaml", pos: "L1:1" },
];

function ProblemsPane({ openFile }) {
  return (
    <div className="panel-list">
      {PROBLEMS.map((p, i) => (
        <div key={i} className="problem-row" onClick={() => {
          const f = FILES.find(x => x.id === p.where);
          if (f) openFile(p.where);
        }}>
          <span className={`sev ${p.sev}`}>{p.sev === "warn" ? "▲" : p.sev === "err" ? "✗" : "ⓘ"}</span>
          <span>{p.text}</span>
          <span className="where">{p.where}</span>
          <span className="pos">{p.pos}</span>
        </div>
      ))}
    </div>
  );
}

function OutputPane() {
  const [extra, setExtra] = useState([]);
  useEffect(() => {
    const id = setInterval(() => {
      const msgs = [
        "Heartbeat ok",
        "Indexing skills.json (cache hit)",
        "Background: refreshing about.md",
        "No file changes",
        "Watcher: idle",
      ];
      setExtra(e => [...e.slice(-12), {
        stamp: new Date().toLocaleTimeString(),
        tag: "info",
        text: msgs[Math.floor(Math.random()*msgs.length)],
      }]);
    }, 6000);
    return () => clearInterval(id);
  }, []);
  const initial = [
    { tag: "info", text: "Loaded portfolio v3.0", stamp: "11:14:02" },
    { tag: "info", text: "Mounting React tree…", stamp: "11:14:02" },
    { tag: "ok",   text: "Mount complete (1438 ms)", stamp: "11:14:03" },
    { tag: "info", text: "Theme: VSCode Default Dark+", stamp: "11:14:03" },
    { tag: "ok",   text: "Copilot ready", stamp: "11:14:04" },
  ];
  return (
    <div className="panel-list">
      {[...initial, ...extra].map((l, i) => (
        <div key={i} className="output-line">
          <span className="stamp">{l.stamp}</span>
          <span className={`tag-${l.tag}`}>[{l.tag}]</span>{" "}
          <span>{l.text}</span>
        </div>
      ))}
    </div>
  );
}

function DebugPane() {
  return (
    <div className="panel-list">
      <div className="output-line"><span className="tag-info">[debug]</span> No debug session running.</div>
      <div className="output-line">▸ Tip: run <span className="tag-ok">node portfolio.js</span> from the terminal (it'll ignore you politely).</div>
      <div className="output-line"><span className="stamp">{new Date().toLocaleTimeString()}</span> <span className="tag-info">[info]</span> idle</div>
    </div>
  );
}

function CopilotBlob() {
  return (
    <div className="blob-wrap" aria-hidden="true">
      <div className="blob-halo"/>
      <div className="blob-ring-outer"/>
      <div className="blob-ring-mid"/>
      <div className="blob-core">
        <svg className="blob-face" viewBox="0 0 40 40" width="40" height="40">
          <path className="eye" d="M10 17 L14 17"/>
          <path className="eye" d="M26 17 L30 17"/>
          <g transform="translate(20 27)">
            <circle className="ripple r1" cx="0" cy="0" r="2"/>
            <circle className="ripple r2" cx="0" cy="0" r="2"/>
            <circle className="ripple r3" cx="0" cy="0" r="2"/>
            <circle cx="0" cy="0" r="1.4" fill="#aee1ff" opacity="0.85"/>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* -------- Copilot Panel — CMHH's Copilot -------- */
const TOKEN_KEY = "cmhh-copilot-tokens";
const TOKEN_MAX = 3;
function loadTokens() {
  const v = parseInt(localStorage.getItem(TOKEN_KEY) ?? "", 10);
  return Number.isFinite(v) && v >= 0 && v <= TOKEN_MAX ? v : TOKEN_MAX;
}

function CopilotPanel({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [tokens, setTokens] = useState(loadTokens);
  const [gameOpen, setGameOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { localStorage.setItem(TOKEN_KEY, String(tokens)); }, [tokens]);

  useEffect(() => {
    window.__copilotAsk = (q) => send(q);
    window.__toggleCopilot = () => onClose();
    window.__closeTerminal = () => {};
    return () => { delete window.__copilotAsk; delete window.__toggleCopilot; };
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 1e9, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (raw) => {
    const text = (raw ?? input).trim();
    if (!text || thinking) return;
    if (tokens <= 0) { setGameOpen(true); return; }
    setTokens(t => t - 1);
    setInput("");
    setMessages(m => [...m, { role: "user", content: text }]);
    setThinking(true);

    // Push an empty assistant message we will mutate as tokens arrive
    let assistantIndex;
    setMessages(m => {
      assistantIndex = m.length;
      return [...m, { role: "assistant", content: "", streaming: true }];
    });

    const appendChunk = (chunk) => {
      setMessages(m => {
        const copy = m.slice();
        const target = copy[copy.length - 1];
        if (target && target.role === "assistant") {
          copy[copy.length - 1] = { ...target, content: target.content + chunk };
        }
        return copy;
      });
    };

    const finalize = () => {
      setMessages(m => {
        const copy = m.slice();
        const target = copy[copy.length - 1];
        if (target && target.role === "assistant") {
          copy[copy.length - 1] = { ...target, streaming: false };
        }
        return copy;
      });
    };

    const failWith = (msg) => {
      setMessages(m => {
        const copy = m.slice();
        // replace the streaming bubble with the error
        if (copy.length && copy[copy.length - 1].role === "assistant") copy.pop();
        copy.push({ role: "assistant", content: msg });
        return copy;
      });
    };

    try {
      const useServerless = !window.claude || !window.claude.complete;

      if (useServerless) {
        // -- Production path: stream from /api/chat (SSE) --
        const r = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        if (!r.ok || !r.body) throw new Error("API " + r.status);

        const reader = r.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            const dataLines = rawEvent
              .split("\n")
              .filter(l => l.startsWith("data: "))
              .map(l => l.slice(6));
            for (const dl of dataLines) {
              if (!dl) continue;
              try {
                const obj = JSON.parse(dl);
                if (obj.error) throw new Error(obj.error);
                if (obj.text) appendChunk(obj.text);
                if (obj.done) { /* end of stream */ }
              } catch (e) { /* ignore parse errors */ }
            }
          }
        }
        finalize();
      } else {
        // -- Preview path: window.claude.complete (non-streaming).
        // Simulate streaming by chunking the response word-by-word.
        const reply = await window.claude.complete({
          messages: [{
            role: "user",
            content:
`You are CMHH's Copilot — a short, friendly AI assistant embedded in Carlos Manuel Hernández's portfolio.

Briefing:
- Carlos Manuel Hernández, 4th-year CS student at UCLV (Cuba), AI-Driven Software Engineer · ML Engineer in progress · Data Scientist.
- Experience:
  * AI-Driven Software Engineer @ Freelance (Nov 2025 — present) — built a production Telegram bot for accounting/inventory using OpenAI, asyncio, SQLite — cut manual data entry by 40%.
  * University Intern @ ETECSA (Cuba's national telecom, Sept-Oct 2024) — led Asset Sync reconciling finance DBs and operational inventories. Python + Django + Pandas + Docker + GitHub Actions. Reduced manual processing by 95%.
- Projects (github.com/cmhh22):
  * etecsa-asset-sync — real production system, anomaly detection, A-F data quality, 45+ pytest tests, full CI/CD.
  * ml-bigdata — NYC Taxi 1.5M+ rows with Dask, XGBoost R²=0.8234, SHAP, LightGBM live on Streamlit.
  * minecraft-llm-agent — Node.js bot "Bartolo" driven by GPT-4.1 / Grok-3 / Mistral / DeepSeek, live JS generation, SES sandbox.
  * transformer-experiments — BERT vs Qwen emotion classification (~92.6%, BERT 6× faster) + RAG with ChromaDB.
  * pytorch-deep-learning — MLP/MNIST 98%, EfficientNet-B0/CIFAR-10 98%, Bi-LSTM+Attention/IMDB 88%.
  * eda-storytelling — Streamlit Airbnb NYC dashboard, K-means, geographic heatmaps, Pareto analysis.
- Stack: Python, SQL, JS/TS, C++. PyTorch, scikit-learn, XGBoost, LightGBM, TensorFlow, HuggingFace. LangChain, ChromaDB, RAG, LLM agents, OpenAI / GitHub Models API. Django, FastAPI, Node.js, Socket.io. Pandas, NumPy, Dask, PostgreSQL, MySQL, SQLite. Docker, GitHub Actions, MLflow, Git, Streamlit.
- Certifications: HackerRank Python & SQL, Kaggle (Python, Pandas, Intro/Intermediate ML), HuggingFace NLP (in progress).
- Languages: Spanish (native), English (professional working).
- Looking for: AI/ML internships, research, remote AI/ML positions, open-source collaborations.
- Contact: carlosmanuelhdezhdez@gmail.com · +53 56658638 · github.com/cmhh22 · linkedin.com/in/cmhh22 · Cuba.

Easter egg: if literally asked "who built this portfolio?", reply: "Carlos built it with Claude. The whole thing is a VS Code metaphor — every section is a 'file' in the editor. Pretty meta, right? 😄"

Rules:
- Only answer about Carlos. Redirect kindly otherwise.
- Reply in the same language the user uses (Spanish or English).
- Be enthusiastic but professional. Plain text only, no markdown headers. Max 3 short paragraphs.

Visitor's message:
${text}`
          }]
        });

        // Pseudo-stream: emit small chunks every ~20ms
        const tokens = reply.match(/\S+\s*|\s+/g) || [reply];
        for (const tok of tokens) {
          appendChunk(tok);
          await new Promise(r => setTimeout(r, 18));
        }
        finalize();
      }
    } catch (e) {
      // refund the token since the request failed
      setTokens(t => Math.min(TOKEN_MAX, t + 1));
      failWith("Sorry — I'm having trouble connecting right now. Try opening `projects.ipynb` or email carlosmanuelhdezhdez@gmail.com.");
    } finally {
      setThinking(false);
    }
  };

  const quick = [
    "Tell me about Carlos",
    "What projects has he built?",
    "Tell me about his ETECSA experience",
    "What's his tech stack?",
    "How can I contact Carlos?",
    "What's he looking for?",
  ];

  return (
    <aside className="copilot">
      <div className="copilot-header">
        <div className="title">
          <span className="spark-ico">✦</span>
          <span>CMHH's Copilot</span>
        </div>
        <div className="spacer"/>
        <button className="icon-btn" title="New chat" onClick={() => setMessages([])}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
        <button className="icon-btn" title="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
      </div>
      <div className="copilot-context">
        <span>Workspace</span>
        <span className="pill"><span className="dot"/> portfolio · cmhh22</span>
      </div>

      {gameOpen ? (
        <DinoGameView
          tokensMax={TOKEN_MAX}
          onWin={() => { setTokens(TOKEN_MAX); setGameOpen(false); }}
          onSkip={() => setGameOpen(false)}
        />
      ) : (
        <>
          <div className="copilot-body" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="copilot-empty">
                <CopilotBlob />
                <h3>Hi! I'm CMHH's Copilot</h3>
                <p>Ask me anything about Carlos's projects, skills, experience, or achievements. I only answer about Carlos — that's the deal.</p>
                <div className="copilot-quick">
                  {quick.map(q => (
                    <button key={q} className="q" onClick={() => send(q)}>{q}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="msg-list">
                {messages.map((m, i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    <div className="avatar">
                      {m.role === "user" ? (
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="9" r="3.2"/>
                          <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/>
                        </svg>
                      ) : "✦"}
                    </div>
                    <div className="bubble">
                      {m.content}
                      {m.streaming && !m.content && (
                        <span className="typing-dots"><span/><span/><span/></span>
                      )}
                      {m.streaming && m.content && <span className="stream-caret"/>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="copilot-input">
            {tokens > 0 ? (
              <div className="row">
                <textarea
                  placeholder="Ask about Carlos's projects, experience, skills…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                  }}
                  rows={2}
                />
                <div className="bottom">
                  <span className="quota">
                    {thinking ? "thinking…" : `${tokens} free message${tokens === 1 ? "" : "s"} left`}
                  </span>
                  <button className="send" disabled={!input.trim() || thinking} onClick={() => send()} title="Send">▸</button>
                </div>
              </div>
            ) : (
              <button className="quota-exhausted" onClick={() => setGameOpen(true)}>
                <span className="qe-tag">quota</span>
                <span className="qe-text">
                  Free tier exhausted. Run a quick task to unlock more →
                </span>
                <span className="qe-arrow">›</span>
              </button>
            )}
            <div className="disclaimer">AI can be wrong — for anything important, contact me directly.</div>
          </div>
        </>
      )}
    </aside>
  );
}

/* -------- Command Palette -------- */
function CommandPalette({ onClose, openFile, toggleTerminal, toggleSidebar, toggleCopilot, setTheme }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  const commands = useMemo(() => [
    { type: "action", id: "copilot", label: "Open CMHH's Copilot", icon: "spark", kbd: "⌘I",
      action: () => { toggleCopilot(); onClose(); }, section: "Actions" },
    { type: "action", id: "term", label: "Toggle terminal", icon: "term", kbd: "⌘J",
      action: () => { toggleTerminal(); onClose(); }, section: "Actions" },
    { type: "action", id: "side", label: "Toggle sidebar", icon: "side", kbd: "⌘B",
      action: () => { toggleSidebar(); onClose(); }, section: "Actions" },
    { type: "action", id: "resume", label: "Download CV (PDF)", icon: "pdf",
      action: () => { openFile("resume.pdf"); onClose(); }, section: "Actions" },
    ...THEMES.map(t => ({
      type: "theme", id: "theme-" + t.id, label: "Theme: " + t.label, icon: "swatch", swatch: t.swatch,
      section: "Themes",
      action: () => { setTheme(t.id); onClose(); },
    })),
    ...FILES.filter(f => !f.external).map(f => ({
      type: "file", id: f.id, label: f.label, icon: f.icon, section: "Files",
      meta: f.group === "root" ? "./" : `${f.group}/`,
      action: () => openFile(f.id),
    })),
  ], [openFile, toggleCopilot, toggleTerminal, toggleSidebar, onClose, setTheme]);

  const filtered = useMemo(() => {
    if (!q.trim()) return commands;
    const s = q.toLowerCase();
    return commands.filter(c => c.label.toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => { setIdx(0); }, [q]);

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); filtered[idx]?.action(); }
  };

  const sections = useMemo(() => {
    const map = new Map();
    filtered.forEach(c => {
      if (!map.has(c.section)) map.set(c.section, []);
      map.get(c.section).push(c);
    });
    return [...map.entries()];
  }, [filtered]);

  let cursor = 0;

  return (
    <div className="cmdp-backdrop" onClick={onClose}>
      <div className="cmdp" onClick={(e) => e.stopPropagation()}>
        <div className="cmdp-input">
          <span className="arr">›</span>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
                 placeholder="Go to file or run command…"/>
          <span className="esc">esc</span>
        </div>
        <div className="cmdp-list">
          {sections.length === 0 && (
            <div style={{ padding: 24, color: "var(--fg-muted)", textAlign: "center", fontSize: 12 }}>
              No matches for "{q}"
            </div>
          )}
          {sections.map(([title, rows]) => (
            <React.Fragment key={title}>
              <div className="cmdp-section">{title}</div>
              {rows.map(c => {
                const i = cursor++;
                const sel = i === idx;
                return (
                  <div key={c.id} className={`cmdp-row ${sel ? "selected" : ""}`}
                       onMouseEnter={() => setIdx(i)} onClick={() => c.action()}>
                    {c.icon === "spark" ? (
                      <span className="row-ico" style={{ color: "var(--accent)" }}>✦</span>
                    ) : c.icon === "term" ? (
                      <span className="row-ico" style={{ color: "var(--fg-muted)" }}>›_</span>
                    ) : c.icon === "side" ? (
                      <span className="row-ico" style={{ color: "var(--fg-muted)" }}>▭</span>
                    ) : c.icon === "swatch" ? (
                      <span className="row-ico" style={{ display: "flex", gap: 1.5 }}>
                        {c.swatch.map((col, i) => (
                          <span key={i} style={{ width: 5, height: 12, background: col, borderRadius: 1, border: "1px solid rgba(255,255,255,.06)" }}/>
                        ))}
                      </span>
                    ) : (
                      <span className="row-ico"><FileIcon kind={c.icon}/></span>
                    )}
                    <span>{c.label}</span>
                    <span className="row-meta">{c.kbd || c.meta || ""}</span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div className="cmdp-footer">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
          <span className="right">tip: try "theme"</span>
        </div>
      </div>
    </div>
  );
}

/* -------- Settings panel -------- */
function SettingsPanel({ theme, setTheme, onClose }) {
  return (
    <div className="cmdp-backdrop" onClick={onClose}>
      <div className="cmdp" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="cmdp-input">
          <span className="arr" style={{ color: "var(--accent)" }}>⚙</span>
          <span style={{ flex: 1, fontSize: 14 }}>Settings</span>
          <span className="esc" onClick={onClose} style={{ cursor: "pointer" }}>esc</span>
        </div>
        <div style={{ padding: "8px 0 12px", maxHeight: "70vh", overflow: "auto" }}>
          <div className="cmdp-section">Color theme — {THEMES.length} available</div>
          {THEMES.map(t => (
            <div key={t.id} className={`cmdp-row ${theme === t.id ? "selected" : ""}`}
                 onClick={() => setTheme(t.id)}>
              <span className="row-ico" style={{ display: "flex", gap: 1.5 }}>
                {t.swatch.map((c, i) => (
                  <span key={i} style={{ width: 5, height: 12, background: c, borderRadius: 1, border: "1px solid rgba(255,255,255,.06)" }}/>
                ))}
              </span>
              <span>{t.label}</span>
              <span className="row-meta">{theme === t.id ? "✓ current" : t.id}</span>
            </div>
          ))}
          <div className="cmdp-section">Keyboard shortcuts · click to run</div>
          {[
            ["Go to file", "⌘P", () => { onClose(); setTimeout(() => window.__openPalette?.(), 50); }],
            ["Command palette", "⌘K", () => { onClose(); setTimeout(() => window.__openPalette?.(), 50); }],
            ["Toggle terminal", "⌘J", () => { onClose(); setTimeout(() => window.__toggleTerminal?.(), 50); }],
            ["Toggle Copilot", "⌘I", () => { onClose(); setTimeout(() => window.__toggleCopilot?.(), 50); }],
            ["Toggle sidebar", "⌘B", () => { onClose(); setTimeout(() => window.__toggleSidebar?.(), 50); }],
            ["Toggle fullscreen", "F11", () => { onClose(); setTimeout(() => window.__toggleFullscreen?.(), 50); }],
            ["Download CV", "—", () => { onClose(); setTimeout(() => window.__openFile?.("resume.pdf"), 50); }],
          ].map(([l, k, action]) => (
            <div key={l} className="cmdp-row" onClick={action}>
              <span className="row-ico" style={{ color: "var(--accent)" }}>›</span>
              <span>{l}</span>
              <span className="row-meta">{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------- Dino Game View — inline in Copilot panel, IDE styled -------- */
function DinoGameView({ tokensMax = 3, target = 200, onWin, onSkip }) {
  const canvasRef = useRef(null);
  const phaseRef = useRef("idle"); // idle | playing | gameover | won
  const [, force] = useState(0);
  const tick = () => force(x => (x + 1) % 1e9);
  const scoreRef = useRef(0);
  const gameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = canvas.width = canvas.clientWidth * dpr;
    const H = canvas.height = canvas.clientHeight * dpr;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const GROUND = H - 14 * dpr;

    const fresh = () => ({
      dino: { x: 22 * dpr, y: GROUND, vy: 0, w: 16 * dpr, h: 18 * dpr },
      obstacles: [],
      speed: 1.6 * dpr,           // slower start — ramps up over time
      spawnT: 50,                  // first obstacle further away
      t: 0,
    });
    gameRef.current = fresh();
    scoreRef.current = 0;

    // read theme accent from CSS variables, so the game uses the active palette
    const getAccent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7aa2f7";
    const getAcc2   = () => getComputedStyle(document.documentElement).getPropertyValue("--accent-2").trim() || "#bb9af7";
    const getFg     = () => getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#e6e6e6";

    const jump = () => {
      const p = phaseRef.current;
      if (p === "idle" || p === "gameover") {
        gameRef.current = fresh();
        scoreRef.current = 0;
        phaseRef.current = "playing";
        tick();
        return;
      }
      if (p === "playing") {
        const g = gameRef.current;
        if (g.dino.y >= GROUND - 0.5) g.dino.vy = -10 * dpr;
      }
    };

    const onKey = (e) => {
      // only act on the spacebar/up when canvas area is focused / panel hovered
      const inPanel = document.activeElement?.closest?.(".copilot");
      if ((e.code === "Space" || e.code === "ArrowUp") && inPanel !== null && phaseRef.current !== "won") {
        // skip if user is typing
        const ae = document.activeElement;
        if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) return;
        e.preventDefault();
        jump();
      }
    };
    const onCanvasClick = () => jump();
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("click", onCanvasClick);
    canvas.addEventListener("touchstart", (e) => { e.preventDefault(); jump(); }, { passive: false });

    let raf;
    const loop = () => {
      const g = gameRef.current;
      if (phaseRef.current === "playing") {
        g.t++;
        g.dino.vy += 0.5 * dpr;
        g.dino.y += g.dino.vy;
        if (g.dino.y > GROUND) { g.dino.y = GROUND; g.dino.vy = 0; }

        g.spawnT--;
        if (g.spawnT <= 0) {
          const variant = Math.random() < 0.35 ? "tall" : "short";
          const h = (variant === "tall" ? 18 : 12) * dpr + Math.random() * 4 * dpr;
          const w = (6 + Math.random() * 4) * dpr;
          g.obstacles.push({ x: W + 10, w, h });
          // gap widens at slow speeds, tightens as we accelerate
          const base = Math.max(36, 110 - Math.floor(g.speed * 8));
          g.spawnT = base + Math.random() * 50;
        }
        g.obstacles.forEach(o => o.x -= g.speed);
        g.obstacles = g.obstacles.filter(o => o.x + o.w > -2);

        const pad = 3 * dpr;
        const dr = { x: g.dino.x + pad, y: g.dino.y - g.dino.h + pad, w: g.dino.w - 2 * pad, h: g.dino.h - pad };
        for (const o of g.obstacles) {
          const or = { x: o.x, y: GROUND - o.h, w: o.w, h: o.h };
          if (dr.x < or.x + or.w && dr.x + dr.w > or.x &&
              dr.y < or.y + or.h && dr.y + dr.h > or.y) {
            phaseRef.current = "gameover";
            tick();
            break;
          }
        }

        if (g.t % 3 === 0) {
          scoreRef.current++;
          if (scoreRef.current >= target) {
            phaseRef.current = "won";
            tick();
            setTimeout(() => onWin?.(), 1400);
          } else {
            tick();
          }
        }
        // non-linear difficulty: gentle warm-up, then accelerates
        // speed grows ~sqrt(t), capped so it stays playable
        const targetSpeed = Math.min(6.5 * dpr, 1.6 * dpr + Math.sqrt(g.t) * 0.16 * dpr);
        g.speed += (targetSpeed - g.speed) * 0.02;
      }

      drawDinoScene(ctx, W, H, GROUND, g, dpr, { accent: getAccent(), accent2: getAcc2(), fg: getFg() });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("click", onCanvasClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pad5 = (n) => String(n).padStart(5, "0");
  const phase = phaseRef.current;
  const score = scoreRef.current;

  return (
    <div className="dino-pane">
      <div className="dino-top">
        <span className="dino-kicker">// quota refill</span>
        <h3 className="dino-h">Beat the runner</h3>
        <p className="dino-info">
          Reach <code>{target} pts</code> to unlock <code>+{tokensMax}</code> messages.
        </p>
      </div>

      <div className="dino-canvas-wrap">
        <canvas ref={canvasRef} className="dino-canvas"/>
        {phase === "idle" && (
          <div className="dino-overlay">
            <div className="dino-go">press space to start</div>
          </div>
        )}
        {phase === "gameover" && (
          <div className="dino-overlay">
            <div className="dino-go err">game over</div>
            <div className="dino-retry">space to retry · score {pad5(score)}</div>
          </div>
        )}
        {phase === "won" && (
          <div className="dino-overlay won">
            <div className="dino-go ok">unlocked +{tokensMax}</div>
          </div>
        )}
      </div>

      <div className="dino-stats">
        <span className="val">{pad5(score)}</span>
        <div className="bar">
          <div className="bar-fill" style={{ width: Math.min(100, (score / target) * 100) + "%" }}/>
        </div>
        <span className="val target">{pad5(target)}</span>
      </div>

      <div className="dino-actions">
        <button className="dino-play" onClick={() => canvasRef.current?.click()}>
          <span className="dp-icon">
            {phase === "idle" ? "▶" :
             phase === "gameover" ? "↻" :
             phase === "won" ? "✓" : "·"}
          </span>
          <span className="dp-label">
            {phase === "idle" ? "start game" :
             phase === "gameover" ? "try again" :
             phase === "won" ? "unlocked" : "running"}
          </span>
        </button>
        <a className="dino-gh" href="https://github.com/cmhh22" target="_blank" rel="noopener">
          <span className="dgh-prompt">$</span>
          <span className="dgh-cmd"><span className="dgh-bin">gh</span> follow <span className="dgh-arg">@cmhh22</span></span>
          <span className="dgh-arrow">↗</span>
        </a>
        <button className="dino-skip-btn" onClick={onSkip}>← back to chat</button>
      </div>
    </div>
  );
}

function drawDinoScene(ctx, W, H, GROUND, g, dpr, theme) {
  const { accent, accent2, fg } = theme;
  // bg — uses bg-deep look but slightly darker
  ctx.fillStyle = "#0a0d14";
  ctx.fillRect(0, 0, W, H);

  // grid (subtle, VS Code minimap vibe)
  ctx.strokeStyle = "rgba(255,255,255,0.025)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const step = 20 * dpr;
  for (let x = 0; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
  for (let y = 0; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
  ctx.stroke();

  // distant dots ("stars" but subtler)
  ctx.fillStyle = `rgba(255,255,255,0.12)`;
  for (let i = 0; i < 16; i++) {
    const sx = ((i * 53 + Math.floor((g?.t || 0) * 0.2)) % W);
    const sy = (i * 13 + 5) % (GROUND - 24 * dpr);
    ctx.fillRect(sx, sy, dpr, dpr);
  }

  // ground line — theme accent
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.75;
  ctx.fillRect(0, GROUND + 1 * dpr, W, dpr);
  ctx.globalAlpha = 1;

  // glow line under ground (very subtle)
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(0, GROUND + 1 * dpr, W, 4 * dpr);
  ctx.globalAlpha = 1;

  if (g) drawDino(ctx, g.dino.x, g.dino.y, g.dino.w, g.dino.h, dpr, g.t, g.dino.vy, fg);
  if (g) g.obstacles.forEach(o => drawCactus(ctx, o.x, GROUND - o.h, o.w, o.h, dpr, accent2 || accent));
}

function drawDino(ctx, x, y, w, h, dpr, t, vy, color) {
  ctx.fillStyle = color || "#e6e6e6";
  const p = dpr;
  ctx.fillRect(x, y - h + 4 * p, w - 2 * p, h - 8 * p);
  ctx.fillRect(x + w - 6 * p, y - h, 8 * p, 6 * p);
  ctx.fillRect(x - 2 * p, y - h + 6 * p, 3 * p, 3 * p);
  const running = vy === 0;
  const phase = Math.floor(t / 5) % 2;
  if (running && phase === 0) {
    ctx.fillRect(x + 2 * p, y - 4 * p, 3 * p, 4 * p);
    ctx.fillRect(x + w - 6 * p, y - 2 * p, 3 * p, 2 * p);
  } else if (running) {
    ctx.fillRect(x + 2 * p, y - 2 * p, 3 * p, 2 * p);
    ctx.fillRect(x + w - 6 * p, y - 4 * p, 3 * p, 4 * p);
  } else {
    ctx.fillRect(x + 2 * p, y - 3 * p, 3 * p, 3 * p);
    ctx.fillRect(x + w - 6 * p, y - 3 * p, 3 * p, 3 * p);
  }
  ctx.fillStyle = "#0a0d14";
  ctx.fillRect(x + w - 2 * p, y - h + 2 * p, p, p);
}

function drawCactus(ctx, x, y, w, h, dpr, color) {
  ctx.fillStyle = color || "#bb9af7";
  const p = dpr;
  ctx.fillRect(x + Math.floor(w * 0.35), y, Math.max(p, Math.floor(w * 0.3)), h);
  ctx.fillRect(x, y + Math.floor(h * 0.4), Math.floor(w * 0.5), p * 2);
  ctx.fillRect(x + Math.floor(w * 0.5), y + Math.floor(h * 0.25), Math.floor(w * 0.5), p * 2);
  ctx.fillRect(x, y + Math.floor(h * 0.25), p * 2, Math.floor(h * 0.2));
  ctx.fillRect(x + w - p * 2, y + Math.floor(h * 0.1), p * 2, Math.floor(h * 0.2));
}

function MouseTrail() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;
    let raf = 0;
    let rx = -100, ry = -100, dx = -100, dy = -100, tx = -100, ty = -100;
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      ring.classList.remove("hidden");
      dot.classList.remove("hidden");
      const onInteractive = !!e.target?.closest?.("a, button, .btn, .file-row, .tab, .tt, .menu-item, .menu-row, .cmdp-row, .copilot-quick .q, .ab-btn, .sb-item, .copilot-launcher, .icon-btn, .ext-row, .git-row, .activity-restore, .chip, .traffic .dot, .tb-icon-btn");
      ring.classList.toggle("hover", onInteractive);
      dot.classList.toggle("hover", onInteractive);
    };
    const onLeave = () => { ring.classList.add("hidden"); dot.classList.add("hidden"); };
    const loop = () => {
      // ring lags behind for a clear "delay" feel
      rx += (tx - rx) * 0.09;
      ry += (ty - ry) * 0.09;
      // dot is the precise pointer — nearly instant
      dx += (tx - dx) * 0.55;
      dy += (ty - dy) * 0.55;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return (
    <>
      <div className="mouse-trail hidden" ref={ringRef} aria-hidden="true"/>
      <div className="mouse-dot hidden" ref={dotRef} aria-hidden="true"/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App/>
    <MouseTrail/>
  </>
);
