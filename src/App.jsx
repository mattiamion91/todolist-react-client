import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [nuovoTitolo, setNuovoTitolo] = useState('')

  useEffect(() => {
    const caricaTodos = async () => {
      try {
        const res = await fetch('http://localhost:8080/todos')
        if (!res.ok) {
          throw new Error(`Errore HTTP: ${res.status}`)
        }
        const data = await res.json()
        setTodos(data)
      } catch (errore) {
        console.error('Errore nel caricamento dei todo:', errore)
      }
    }

    caricaTodos()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (nuovoTitolo.trim() === '') return

    try {
      const res = await fetch('http://localhost:8080/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titolo: nuovoTitolo, completato: false })
      })

      if (!res.ok) {
        throw new Error(`Errore HTTP: ${res.status}`)
      }

      const todoCreato = await res.json()
      setTodos([...todos, todoCreato])
      setNuovoTitolo('')
    } catch (errore) {
      console.error('Errore nella creazione del todo:', errore)
    }
  }

  const toggleCompletato = async (todo) => {
    try {
      const res = await fetch(`http://localhost:8080/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completato: !todo.completato })
      })

      if (!res.ok) {
        throw new Error(`Errore HTTP: ${res.status}`)
      }

      const todoAggiornato = await res.json()
      setTodos(todos.map(t => (t.id === todoAggiornato.id ? todoAggiornato : t)))
    } catch (errore) {
      console.error('Errore nell\'aggiornamento del todo:', errore)
    }
  }

    const eliminaTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/todos/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error(`Errore HTTP: ${res.status}`)
      }

      setTodos(todos.filter(t => t.id !== id))
    } catch (errore) {
      console.error('Errore nell\'eliminazione del todo:', errore)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <h1 className="mb-4">La mia Todo List</h1>

      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Nuovo todo..."
          value={nuovoTitolo}
          onChange={(e) => setNuovoTitolo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Aggiungi
        </button>
      </form>

      <ul className="list-group">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={todo.completato}
                onChange={() => toggleCompletato(todo)}
              />
              <label
                className="form-check-label"
                style={{ textDecoration: todo.completato ? 'line-through' : 'none' }}
              >
                {todo.titolo}
              </label>
            </div>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => eliminaTodo(todo.id)}
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App