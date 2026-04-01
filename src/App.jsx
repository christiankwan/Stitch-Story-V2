import { useState } from 'react'

export default function App() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Stitch Story</h1>
      <p>Create sewing projects and track progress</p>

      <input
        placeholder="New project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => {
        if (!name) return
        setProjects([...projects, name])
        setName('')
      }}>
        Add
      </button>

      <ul>
        {projects.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  )
}
