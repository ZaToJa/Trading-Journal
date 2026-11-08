import { useState } from "react";

const STORAGE_KEY = "trading-journal-todos";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function save(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // brak dostępu do localStorage – lista działa tylko do odświeżenia strony
  }
}

// Lista zadań zapisywana w przeglądarce (nie na backendzie)
export default function TodoList() {
  const [todos, setTodos] = useState(load);
  const [text, setText] = useState("");

  function update(next) {
    setTodos(next);
    save(next);
  }

  function handleAdd(e) {
    e.preventDefault();
    if (text.trim() === "") return;
    update([...todos, { id: Date.now(), text: text.trim(), done: false }]);
    setText("");
  }

  return (
    <div className="todo">
      <ul className="todo-list">
        {todos.map((t) => (
          <li key={t.id} className={t.done ? "todo-done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  update(
                    todos.map((x) =>
                      x.id === t.id ? { ...x, done: !x.done } : x,
                    ),
                  )
                }
              />
              <span>{t.text}</span>
            </label>
            <button
              type="button"
              className="todo-remove"
              aria-label="Usuń zadanie"
              onClick={() => update(todos.filter((x) => x.id !== t.id))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <div className="empty">Brak zadań</div>}

      <form className="todo-form" onSubmit={handleAdd}>
        <input
          placeholder="Nowe zadanie…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>
    </div>
  );
}
