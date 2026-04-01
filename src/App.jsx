import { useState, useEffect } from "react";

export default function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("stitch-projects");
    return saved ? JSON.parse(saved) : [];
  });
  const [selected, setSelected] = useState(null);
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    localStorage.setItem("stitch-projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!newProject) return;
    setProjects([
      ...projects,
      {
        id: Date.now(),
        name: newProject,
        checklist: [],
        updates: [],
        links: [],
      },
    ]);
    setNewProject("");
  };

  const addChecklistItem = (id, text) => {
    setProjects(projects.map(p =>
      p.id === id
        ? { ...p, checklist: [...p.checklist, { text, done: false }] }
        : p
    ));
  };

  const toggleChecklist = (id, index) => {
    setProjects(projects.map(p =>
      p.id === id
        ? {
            ...p,
            checklist: p.checklist.map((item, i) =>
              i === index ? { ...item, done: !item.done } : item
            ),
          }
        : p
    ));
  };

  const addUpdate = (id, text) => {
    setProjects(projects.map(p =>
      p.id === id
        ? { ...p, updates: [...p.updates, text] }
        : p
    ));
  };

  const project = projects.find(p => p.id === selected);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Stitch Story</h1>

      {!selected && (
        <>
          <input
            placeholder="New project"
            value={newProject}
            onChange={e => setNewProject(e.target.value)}
          />
          <button onClick={addProject}>Add</button>

          <ul>
            {projects.map(p => (
              <li key={p.id} onClick={() => setSelected(p.id)}>
                {p.name}
              </li>
            ))}
          </ul>
        </>
      )}

      {project && (
        <>
          <button onClick={() => setSelected(null)}>← Back</button>
          <h2>{project.name}</h2>

          <h3>Checklist</h3>
          <Checklist project={project} add={addChecklistItem} toggle={toggleChecklist} />

          <h3>Updates</h3>
          <Updates project={project} add={addUpdate} />
        </>
      )}
    </div>
  );
}

function Checklist({ project, add, toggle }) {
  const [text, setText] = useState("");
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => { add(project.id, text); setText(""); }}>Add</button>
      <ul>
        {project.checklist.map((item, i) => (
          <li key={i} onClick={() => toggle(project.id, i)}>
            {item.done ? "✅" : "⬜"} {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function Updates({ project, add }) {
  const [text, setText] = useState("");
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => { add(project.id, text); setText(""); }}>Add</button>
      <ul>
        {project.updates.map((u, i) => (
          <li key={i}>{u}</li>
        ))}
      </ul>
    </>
  );
}
