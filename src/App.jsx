import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  Camera,
  Check,
  ChevronRight,
  Circle,
  ExternalLink,
  FolderPlus,
  Home,
  Moon,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

const STORAGE_KEY = 'stitch-story-full-v2'
const DARK_KEY = 'stitch-story-dark-v2'

const seedProjects = [
  {
    id: crypto.randomUUID(),
    name: 'Linen Camp Shirt',
    category: 'Garment',
    due: '2026-04-08',
    status: 'In Progress',
    progress: 60,
    notes: 'Front and back panels are assembled. Collar is next. Need to test the hem finish.',
    checklist: [
      { id: crypto.randomUUID(), title: 'Cut fabric', done: true },
      { id: crypto.randomUUID(), title: 'Join shoulder seams', done: true },
      { id: crypto.randomUUID(), title: 'Attach sleeves', done: true },
      { id: crypto.randomUUID(), title: 'Construct collar', done: false },
      { id: crypto.randomUUID(), title: 'Hem shirt', done: false },
    ],
    updates: [
      {
        id: crypto.randomUUID(),
        type: 'Journal',
        title: 'Much cleaner today',
        body: 'Taking my time with pressing made the whole shirt sit better. I should really do this every time.',
        date: '2026-03-30',
        image: null,
        link: '',
      },
    ],
    resources: [
      { id: crypto.randomUUID(), title: 'Camp collar tutorial', url: 'https://example.com/collar' },
      { id: crypto.randomUUID(), title: 'Flat felled seam guide', url: 'https://example.com/felled' },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: 'Quilted Tote',
    category: 'Accessory',
    due: '2026-04-18',
    status: 'Planning',
    progress: 33,
    notes: 'Still deciding the strap width and whether to add an inside pocket.',
    checklist: [
      { id: crypto.randomUUID(), title: 'Choose outer fabric', done: true },
      { id: crypto.randomUUID(), title: 'Pick interfacing', done: true },
      { id: crypto.randomUUID(), title: 'Finalize dimensions', done: false },
    ],
    updates: [],
    resources: [
      { id: crypto.randomUUID(), title: 'Boxed corners walkthrough', url: 'https://example.com/boxed' },
    ],
  },
]

function usePersistentState(key, fallback) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {}
  }, [key, state])

  return [state, setState]
}

function formatDate(dateString) {
  if (!dateString) return 'No due date'
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

function calculateProject(project) {
  const total = project.checklist.length
  const done = project.checklist.filter((item) => item.done).length
  const progress = total > 0 ? Math.round((done / total) * 100) : project.progress || 0

  let status = 'Planning'
  if (progress === 100) status = 'Completed'
  else if (progress >= 85) status = 'Finishing'
  else if (progress > 0) status = 'In Progress'

  return { ...project, progress, status }
}

function TopBar({ title, subtitle, right }) {
  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {right}
    </div>
  )
}

function GlassCard({ children, className = '' }) {
  return <div className={`card ${className}`.trim()}>{children}</div>
}

function ProgressBar({ value }) {
  return (
    <div className="progress-shell">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  )
}

function ProjectCard({ project, onClick }) {
  return (
    <button className="project-card button-reset" onClick={onClick}>
      <div className="row between start">
        <div>
          <div className="project-title">{project.name}</div>
          <div className="muted">{project.category} • {project.status}</div>
          <div className="tiny">Due {formatDate(project.due)}</div>
        </div>
        <ChevronRight size={16} className="icon-muted" />
      </div>
      <div className="row between tiny mt-16">
        <span>Progress</span>
        <span>{project.progress}%</span>
      </div>
      <div className="mt-8">
        <ProgressBar value={project.progress} />
      </div>
    </button>
  )
}

function UpdateCard({ update, onDelete }) {
  return (
    <GlassCard>
      <div className="row between start">
        <div>
          <div className="update-title">{update.title}</div>
          <div className="tiny">{update.type} • {formatDate(update.date)}</div>
        </div>
        {onDelete ? (
          <button className="icon-button button-reset" onClick={onDelete}>
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>
      {update.image ? <img src={update.image} alt={update.title} className="update-image" /> : null}
      {update.body ? <p className="update-body">{update.body}</p> : null}
      {update.link ? (
        <a href={update.link} target="_blank" rel="noreferrer" className="inline-link">
          <ExternalLink size={14} />
          Open linked tip
        </a>
      ) : null}
    </GlassCard>
  )
}

function TabButton({ active, icon: Icon, label, onClick }) {
  return (
    <button className={`tab-button button-reset ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon size={16} />
      <span>{label}</span>
    </button>
  )
}

function TabBar({ tab, setTab }) {
  return (
    <div className="tabbar-wrap">
      <div className="tabbar">
        <TabButton active={tab === 'home'} icon={Home} label="Home" onClick={() => setTab('home')} />
        <TabButton active={tab === 'projects'} icon={BookOpen} label="Projects" onClick={() => setTab('projects')} />
        <TabButton active={tab === 'add'} icon={Plus} label="Add" onClick={() => setTab('add')} />
        <TabButton active={tab === 'journal'} icon={Pencil} label="Journal" onClick={() => setTab('journal')} />
        <TabButton active={tab === 'settings'} icon={Settings} label="Settings" onClick={() => setTab('settings')} />
      </div>
    </div>
  )
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="row between start">
          <div className="modal-title">{title}</div>
          <button className="icon-button button-reset" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="mt-16">{children}</div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="tiny">{label}</div>
    </div>
  )
}

function ProjectDetail({
  project,
  onBack,
  onToggleChecklist,
  onAddChecklist,
  onDeleteUpdate,
  onDeleteProject,
  onAddResource,
  onEditProject,
  onAddUpdate,
}) {
  const [checklistText, setChecklistText] = useState('')
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceUrl, setResourceUrl] = useState('')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(project.name)
  const [editCategory, setEditCategory] = useState(project.category)
  const [editDue, setEditDue] = useState(project.due || '')
  const [editNotes, setEditNotes] = useState(project.notes || '')

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateType, setUpdateType] = useState('Journal')
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateBody, setUpdateBody] = useState('')
  const [updateLink, setUpdateLink] = useState('')
  const [updateImage, setUpdateImage] = useState(null)
  const updateFileRef = useRef(null)

  function readUpdateImage(file) {
    const reader = new FileReader()
    reader.onload = () => setUpdateImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    setEditName(project.name)
    setEditCategory(project.category)
    setEditDue(project.due || '')
    setEditNotes(project.notes || '')
  }, [project])

  return (
    <div className="screen">
      <div className="detail-actions">
        <button className="secondary-btn button-reset" onClick={onBack}>Back</button>
        <div className="row gap-8">
          <button className="secondary-btn button-reset" onClick={() => setEditing(true)}>Edit</button>
          <button className="secondary-btn danger button-reset" onClick={onDeleteProject}>Delete</button>
        </div>
      </div>

      <GlassCard className="hero-card">
        <div className="row between start">
          <div>
            <div className="hero-title">{project.name}</div>
            <div className="muted">{project.category} • {project.status} • Due {formatDate(project.due)}</div>
          </div>
          <div className="pill">{project.progress}%</div>
        </div>
        <div className="mt-16">
          <ProgressBar value={project.progress} />
        </div>
        <p className="update-body mt-16">{project.notes || 'No notes yet.'}</p>
      </GlassCard>

      <GlassCard>
        <div className="section-title"><Target size={18} /> Checklist</div>
        <div className="stack">
          {project.checklist.map((item) => (
            <button
              key={item.id}
              className="check-item button-reset"
              onClick={() => onToggleChecklist(item.id)}
            >
              {item.done ? <Check size={16} className="done-icon" /> : <Circle size={16} className="icon-muted" />}
              <span>{item.title}</span>
            </button>
          ))}
        </div>
        <div className="row gap-8 mt-16">
          <input
            className="input grow"
            value={checklistText}
            onChange={(e) => setChecklistText(e.target.value)}
            placeholder="Add checklist item"
          />
          <button
            className="primary-btn button-reset"
            onClick={() => {
              const trimmed = checklistText.trim()
              if (!trimmed) return
              onAddChecklist(trimmed)
              setChecklistText('')
            }}
          >
            Add
          </button>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="row between start">
          <div className="section-title"><Camera size={18} /> Timeline</div>
          <button
            className="secondary-btn button-reset"
            onClick={() => setShowUpdateModal(true)}
          >
            <Plus size={16} /> Add Update
          </button>
        </div>

        <div className="stack">
          {project.updates.length === 0 ? (
            <div className="empty-note">No updates yet. Add one below.</div>
          ) : (
            project.updates.map((update) => (
              <UpdateCard
                key={update.id}
                update={update}
                onDelete={() => onDeleteUpdate(update.id)}
              />
            ))
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="section-title"><Sparkles size={18} /> Linked tips</div>
        <div className="stack">
          {project.resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="resource-link"
            >
              <div>
                <div className="resource-title">{resource.title}</div>
                <div className="tiny">{resource.url}</div>
              </div>
              <ExternalLink size={16} className="icon-muted" />
            </a>
          ))}
        </div>
        <div className="stack mt-16">
          <input
            className="input"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            placeholder="Tip title"
          />
          <input
            className="input"
            value={resourceUrl}
            onChange={(e) => setResourceUrl(e.target.value)}
            placeholder="https://..."
          />
          <button
            className="primary-btn button-reset"
            onClick={() => {
              const title = resourceTitle.trim()
              const url = resourceUrl.trim()
              if (!title || !url) return
              onAddResource(title, url)
              setResourceTitle('')
              setResourceUrl('')
            }}
          >
            Add resource
          </button>
        </div>
      </GlassCard>

      <Modal open={editing} title="Edit Project" onClose={() => setEditing(false)}>
        <div className="stack">
          <input
            className="input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Project name"
          />
          <select
            className="input"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
          >
            <option>Garment</option>
            <option>Accessory</option>
            <option>Mending</option>
            <option>Quilting</option>
            <option>Other</option>
          </select>
          <input
            className="input"
            type="date"
            value={editDue}
            onChange={(e) => setEditDue(e.target.value)}
          />
          <textarea
            className="input textarea"
            rows="5"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Notes"
          />
          <button
            className="primary-btn button-reset"
            onClick={() => {
              onEditProject({
                name: editName.trim(),
                category: editCategory,
                due: editDue,
                notes: editNotes,
              })
              setEditing(false)
            }}
          >
            Save Changes
          </button>
        </div>
      </Modal>

      <Modal open={showUpdateModal} title="Add Update" onClose={() => setShowUpdateModal(false)}>
        <div className="stack">
          <select
            className="input"
            value={updateType}
            onChange={(e) => setUpdateType(e.target.value)}
          >
            <option>Journal</option>
            <option>Photo</option>
            <option>Note</option>
          </select>

          <input
            className="input"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
            placeholder="Update title"
          />

          <textarea
            className="input textarea"
            rows="5"
            value={updateBody}
            onChange={(e) => setUpdateBody(e.target.value)}
            placeholder="What happened today?"
          />

          <input
            className="input"
            value={updateLink}
            onChange={(e) => setUpdateLink(e.target.value)}
            placeholder="https://..."
          />

          <input
            ref={updateFileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) readUpdateImage(file)
            }}
          />

          {updateImage ? (
            <div className="stack">
              <img src={updateImage} alt="Preview" className="update-image" />
              <div className="row gap-8">
                <button
                  className="secondary-btn button-reset"
                  onClick={() => updateFileRef.current?.click()}
                >
                  <Upload size={16} /> Replace
                </button>
                <button
                  className="secondary-btn button-reset"
                  onClick={() => setUpdateImage(null)}
                >
                  <X size={16} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              className="secondary-btn button-reset"
              onClick={() => updateFileRef.current?.click()}
            >
              <Camera size={16} /> Add Photo
            </button>
          )}

          <button
            className="primary-btn button-reset"
            onClick={() => {
              if (!updateTitle.trim()) return

              onAddUpdate({
                id: crypto.randomUUID(),
                type: updateType,
                title: updateTitle.trim(),
                body: updateBody.trim(),
                date: new Date().toISOString().slice(0, 10),
                image: updateImage,
                link: updateLink.trim(),
              })

              setUpdateType('Journal')
              setUpdateTitle('')
              setUpdateBody('')
              setUpdateLink('')
              setUpdateImage(null)
              setShowUpdateModal(false)
            }}
          >
            Save Update
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default function App() {
  const [projects, setProjects] = usePersistentState(STORAGE_KEY, seedProjects)
  const [dark, setDark] = usePersistentState(DARK_KEY, true)
  const [tab, setTab] = useState('home')
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  const [projectSearch, setProjectSearch] = useState('')
  const [journalSearch, setJournalSearch] = useState('')
  const [showNewProject, setShowNewProject] = useState(false)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Garment')
  const [due, setDue] = useState('')
  const [notes, setNotes] = useState('')

  const [captureProjectId, setCaptureProjectId] = useState('')
  const [captureType, setCaptureType] = useState('Journal')
  const [captureTitle, setCaptureTitle] = useState('')
  const [captureBody, setCaptureBody] = useState('')
  const [captureLink, setCaptureLink] = useState('')
  const [captureImage, setCaptureImage] = useState(null)
  const fileInputRef = useRef(null)
  const importFileRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', !!dark)
  }, [dark])

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  )

  const activeProjects = useMemo(() => projects.filter((p) => p.status !== 'Completed'), [projects])

  const allUpdates = useMemo(
    () =>
      projects
        .flatMap((project) =>
          project.updates.map((update) => ({
            ...update,
            projectName: project.name,
            projectId: project.id,
          })),
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [projects],
  )

  const filteredProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((project) =>
      [project.name, project.category, project.status, project.notes].join(' ').toLowerCase().includes(q),
    )
  }, [projectSearch, projects])

  const filteredJournal = useMemo(() => {
    const q = journalSearch.trim().toLowerCase()
    if (!q) return allUpdates
    return allUpdates.filter((u) =>
      [u.title, u.body, u.type, u.projectName].join(' ').toLowerCase().includes(q),
    )
  }, [journalSearch, allUpdates])

  const completedCount = useMemo(() => projects.filter((p) => p.status === 'Completed').length, [projects])
  const totalUpdates = useMemo(() => projects.reduce((sum, p) => sum + p.updates.length, 0), [projects])

  function createProject() {
    const trimmedName = name.trim()
    if (!trimmedName) return
    const project = calculateProject({
      id: crypto.randomUUID(),
      name: trimmedName,
      category,
      due,
      status: 'Planning',
      progress: 0,
      notes,
      checklist: [],
      updates: [],
      resources: [],
    })
    setProjects((prev) => [project, ...prev])
    setShowNewProject(false)
    setName('')
    setCategory('Garment')
    setDue('')
    setNotes('')
    setSelectedProjectId(project.id)
  }

  function readImage(file) {
    const reader = new FileReader()
    reader.onload = () => setCaptureImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  function addUpdate() {
    if (!captureProjectId || !captureTitle.trim()) return
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== captureProjectId) return project
        const update = {
          id: crypto.randomUUID(),
          type: captureType,
          title: captureTitle.trim(),
          body: captureBody.trim(),
          date: new Date().toISOString().slice(0, 10),
          image: captureImage,
          link: captureLink.trim(),
        }
        return { ...project, updates: [update, ...project.updates] }
      }),
    )
    setCaptureProjectId('')
    setCaptureType('Journal')
    setCaptureTitle('')
    setCaptureBody('')
    setCaptureLink('')
    setCaptureImage(null)
    setTab('journal')
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(projects, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stitch-story-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportBackup(file) {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)

        if (!Array.isArray(data)) {
          alert('Invalid backup file')
          return
        }

        setProjects(data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        alert('Backup imported successfully')
      } catch {
        alert('Error importing backup')
      }
    }

    reader.readAsText(file)
  }

  function resetApp() {
    setProjects(seedProjects)
    setSelectedProjectId(null)
    setTab('home')
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            onBack={() => setSelectedProjectId(null)}
            onToggleChecklist={(itemId) => {
              setProjects((prev) =>
                prev.map((project) => {
                  if (project.id !== selectedProject.id) return project
                  return calculateProject({
                    ...project,
                    checklist: project.checklist.map((item) =>
                      item.id === itemId ? { ...item, done: !item.done } : item,
                    ),
                  })
                }),
              )
            }}
            onAddChecklist={(title) => {
              setProjects((prev) =>
                prev.map((project) =>
                  project.id === selectedProject.id
                    ? calculateProject({
                        ...project,
                        checklist: [...project.checklist, { id: crypto.randomUUID(), title, done: false }],
                      })
                    : project,
                ),
              )
            }}
            onDeleteUpdate={(updateId) => {
              setProjects((prev) =>
                prev.map((project) =>
                  project.id === selectedProject.id
                    ? { ...project, updates: project.updates.filter((u) => u.id !== updateId) }
                    : project,
                ),
              )
            }}
            onDeleteProject={() => {
              setProjects((prev) => prev.filter((project) => project.id !== selectedProject.id))
              setSelectedProjectId(null)
            }}
            onAddResource={(title, url) => {
              setProjects((prev) =>
                prev.map((project) =>
                  project.id === selectedProject.id
                    ? { ...project, resources: [...project.resources, { id: crypto.randomUUID(), title, url }] }
                    : project,
                ),
              )
            }}
            onEditProject={(payload) => {
              setProjects((prev) =>
                prev.map((project) =>
                  project.id === selectedProject.id ? calculateProject({ ...project, ...payload }) : project,
                ),
              )
            }}
            onAddUpdate={(newUpdate) => {
              setProjects((prev) =>
                prev.map((project) =>
                  project.id === selectedProject.id
                    ? { ...project, updates: [newUpdate, ...project.updates] }
                    : project,
                ),
              )
            }}
          />
        ) : (
          <>
            {tab === 'home' && (
              <div className="screen">
                <TopBar
                  title="Jada's Sewing Journal"
                  subtitle="Track your sewing projects, progress photos, notes, and helpful links in one place."
                  right={
                    <button className="icon-toggle button-reset" onClick={() => setDark(!dark)}>
                      {dark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  }
                />
                <GlassCard className="hero-card">
                  <div className="tiny">Jada's Sewing Journal</div>
                  <div className="hero-subtitle">A sewing journal that actually lets you do things.</div>
                  <div className="stats-grid">
                    <Stat label="Projects" value={projects.length} />
                    <Stat label="Done" value={completedCount} />
                    <Stat label="Updates" value={totalUpdates} />
                  </div>
                  <div className="dual-grid">
                    <button className="primary-btn button-reset" onClick={() => setShowNewProject(true)}>
                      <FolderPlus size={16} /> New project
                    </button>
                    <button className="secondary-btn button-reset" onClick={() => setTab('add')}>
                      <Plus size={16} /> Add update
                    </button>
                  </div>
                </GlassCard>

                <div className="section-header">
                  <div className="section-big">Active Projects</div>
                  <button className="link-button button-reset" onClick={() => setTab('projects')}>See all</button>
                </div>

                <div className="stack">
                  {activeProjects.length === 0 ? (
                    <GlassCard><div className="empty-note">No projects yet. Create your first one.</div></GlassCard>
                  ) : (
                    activeProjects.slice(0, 3).map((project) => (
                      <ProjectCard key={project.id} project={project} onClick={() => setSelectedProjectId(project.id)} />
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'projects' && (
              <div className="screen">
                <TopBar
                  title="Projects"
                  subtitle="Open, manage, and update all your sewing work."
                  right={
                    <button className="small-primary button-reset" onClick={() => setShowNewProject(true)}>
                      <Plus size={16} />
                    </button>
                  }
                />
                <input
                  className="input"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search projects"
                />
                <div className="stack mt-16">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => setSelectedProjectId(project.id)} />
                  ))}
                </div>
              </div>
            )}

            {tab === 'add' && (
              <div className="screen">
                <TopBar title="New Update" subtitle="Add a photo, note, or journal entry to a project." />
                <GlassCard>
                  <div className="stack">
                    <div>
                      <div className="field-label">Project</div>
                      <select className="input" value={captureProjectId} onChange={(e) => setCaptureProjectId(e.target.value)}>
                        <option value="">Select project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="field-label">Type</div>
                      <select className="input" value={captureType} onChange={(e) => setCaptureType(e.target.value)}>
                        <option>Journal</option>
                        <option>Photo</option>
                        <option>Note</option>
                      </select>
                    </div>

                    <div>
                      <div className="field-label">Title</div>
                      <input className="input" value={captureTitle} onChange={(e) => setCaptureTitle(e.target.value)} placeholder="What happened today?" />
                    </div>

                    <div>
                      <div className="field-label">Thoughts</div>
                      <textarea className="input textarea" rows="5" value={captureBody} onChange={(e) => setCaptureBody(e.target.value)} placeholder="Write progress notes, fit thoughts, or what you learned today." />
                    </div>

                    <div>
                      <div className="field-label">Helpful Link</div>
                      <input className="input" value={captureLink} onChange={(e) => setCaptureLink(e.target.value)} placeholder="https://..." />
                    </div>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) readImage(file)
                        }}
                      />
                      {captureImage ? (
                        <div className="stack">
                          <img src={captureImage} alt="Preview" className="update-image" />
                          <div className="dual-grid">
                            <button className="secondary-btn button-reset" onClick={() => fileInputRef.current?.click()}>
                              <Upload size={16} /> Replace
                            </button>
                            <button className="secondary-btn button-reset" onClick={() => setCaptureImage(null)}>
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="upload-box button-reset" onClick={() => fileInputRef.current?.click()}>
                          <div className="upload-icon"><Camera size={18} /></div>
                          <div className="upload-title">Add a progress photo</div>
                          <div className="tiny">Use your camera or library from Safari.</div>
                        </button>
                      )}
                    </div>

                    <button className="primary-btn button-reset" onClick={addUpdate}>Save update</button>
                  </div>
                </GlassCard>
              </div>
            )}

            {tab === 'journal' && (
              <div className="screen">
                <TopBar title="Journal" subtitle="All your notes and progress history in one feed." />
                <input
                  className="input"
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  placeholder="Search notes"
                />
                <div className="stack mt-16">
                  {filteredJournal.length === 0 ? (
                    <GlassCard><div className="empty-note">No journal entries yet.</div></GlassCard>
                  ) : (
                    filteredJournal.map((update) => (
                      <div key={update.id}>
                        <button className="project-jump button-reset" onClick={() => setSelectedProjectId(update.projectId)}>
                          {update.projectName}
                        </button>
                        <UpdateCard update={update} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'settings' && (
              <div className="screen">
                <TopBar title="Settings" subtitle="Appearance, backups, and reset." />
                <GlassCard>
                  <div className="stack">
                    <div className="row between start">
                      <div>
                        <div className="project-title">Appearance</div>
                        <div className="muted">{dark ? 'Dark mode' : 'Light mode'}</div>
                      </div>
                      <button className="secondary-btn button-reset" onClick={() => setDark(!dark)}>
                        {dark ? <Sun size={16} /> : <Moon size={16} />}
                      </button>
                    </div>

                    <button className="primary-btn button-reset" onClick={exportBackup}>
                      <Upload size={16} /> Export backup
                    </button>

                    <input
                      ref={importFileRef}
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImportBackup(file)
                          e.target.value = ''
                        }
                      }}
                    />

                    <button
                      className="secondary-btn button-reset"
                      onClick={() => importFileRef.current?.click()}
                    >
                      <Upload size={16} /> Import backup
                    </button>

                    <button className="secondary-btn button-reset" onClick={resetApp}>Reset sample data</button>

                    <div className="help-box">
                      To save it like an app on iPhone, open it in Safari, tap Share, then tap <strong>Add to Home Screen</strong>.
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </>
        )}

        {!selectedProject ? <TabBar tab={tab} setTab={setTab} /> : null}

        <Modal open={showNewProject} title="New Project" onClose={() => setShowNewProject(false)}>
          <div className="stack">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Garment</option>
              <option>Accessory</option>
              <option>Mending</option>
              <option>Quilting</option>
              <option>Other</option>
            </select>
            <input className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            <textarea className="input textarea" rows="5" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes, goals, or ideas" />
            <button className="primary-btn button-reset" onClick={createProject}>Create Project</button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
