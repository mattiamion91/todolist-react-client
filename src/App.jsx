import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState([])

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

  return (
    <div>
      <h1>La mia Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.titolo}</li>
        ))}
      </ul>
    </div>
  )
}

export default App