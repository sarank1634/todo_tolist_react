import { useEffect, useState, useCallback } from "react";
import Create from './Create';
import axios from "axios";

function Home() {
    const [todos, setTodos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalpages, setTotalpages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingTodoText, setEditingTodoText] = useState('');
    const limit = 10;

    const fetchTodos = useCallback((pageNum = 1) => {
        setLoading(true);
        axios.get(`http://localhost:3000/todos/all?page=${pageNum}&limit=${limit}`)
            .then(result => {
                setTodos(result.data.todos);
                setPage(result.data.page);
                setTotalpages(result.data.totalPages);
            })
            .catch(err => {
                console.error("Error fetching todos:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [limit]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleUpdate = (todo) => {
        setEditingTodoId(todo._id);
        setEditingTodoText(todo.task);
    };

    const handleSaveUpdate = useCallback((todoId) => {
        if (editingTodoText && editingTodoText.trim()) {
            axios.put(`http://localhost:3000/update/${todoId}`, { task: editingTodoText })
                .then(() => {
                    setTodos(prevTodos =>
                        prevTodos.map(todo =>
                            todo._id === todoId ? { ...todo, task: editingTodoText } : todo
                        )
                    );
                    setEditingTodoId(null);
                    setEditingTodoText('');
                })
                .catch(err => {
                    console.error("Error updating todo:", err);
                    fetchTodos(page);
                });
        }
    }, [editingTodoText, page, fetchTodos]);

    const handleDelete = useCallback((todoId) => {
        if (window.confirm("Are you sure you want to delete this todo?")) {
            axios.delete(`http://localhost:3000/delete/${todoId}`)
                .then(() => {
                    if (todos.length === 1 && page > 1) {
                        fetchTodos(page - 1);
                    } else {
                        fetchTodos(page);
                    }
                })
                .catch(err => console.error("Error deleting todo:", err));
        }
    }, [todos.length, page, fetchTodos]);

    const handlePrev = useCallback(() => {
        if (page > 1) {
            fetchTodos(page - 1);
        }
    }, [page, fetchTodos]);

    const handleNext = useCallback(() => {
        if (page < totalpages) {
            fetchTodos(page + 1);
        }
    }, [page, totalpages, fetchTodos]);

    const handleAdd = useCallback(() => {
        axios.get(`http://localhost:3000/todos/all?page=1&limit=9999`)
            .then(result => {
                const newTotalPages = result.data.totalPages;
                fetchTodos(newTotalPages);
            })
            .catch(err => {
                console.error("Error calculating last page:", err);
                fetchTodos();
            });
    }, [fetchTodos]);

    return (
        <div className="home">
            <h2>Todo List</h2>
            <Create onAdd={handleAdd} />
            {loading ? (
                <div><h2>Loading...</h2></div>
            ) : todos.length === 0 ? (
                <div>
                    <h2>No records</h2>
                </div>
            ) : (
                <>
                    {todos.map((todo) => (
                        <div key={todo._id} className="todo-item">
                            {editingTodoId === todo._id ? (
                                <input
                                    type="text"
                                    className="edit-input"
                                    value={editingTodoText}
                                    onChange={(e) => setEditingTodoText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveUpdate(todo._id)}
                                    autoFocus
                                />
                            ) : (
                                <span className="task-text">{todo.task}</span>
                            )}
                            <div className="todo-actions">
                                {editingTodoId === todo._id ? (
                                    <button className="save_btn" type="button" onClick={() => handleSaveUpdate(todo._id)}>Save</button>
                                ) : (
                                    <button className="update_btn" type="button" onClick={() => handleUpdate(todo)}>Update</button>
                                )}
                                <button className="delete_bnt" type="button" onClick={() => handleDelete(todo._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    <div className="pagination">
                        <button onClick={handlePrev} disabled={page <= 1}>- Prev</button>
                        <span>Page {page} of {totalpages}</span>
                        <button onClick={handleNext} disabled={page >= totalpages}>Next +</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;