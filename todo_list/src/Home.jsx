import { useEffect, useState } from "react";
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

    const fetchTodos = (pageNum = 1) => {
        setLoading(true);
        axios.get(`http://localhost:3000/todos/all?page=${pageNum}&limit=${limit}`)
            .then(result => {
                setTodos(result.data.todos);
                setPage(result.data.page);
                setTotalpages(result.data.totalPages);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching todos:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleUpdate = (todo) => {
        setEditingTodoId(todo._id);
        setEditingTodoText(todo.task);
    };

    const handleSaveUpdate = (todoId) => {
        if (editingTodoText && editingTodoText.trim()) {
            axios.put(`http://localhost:3000/update/${todoId}`, { task: editingTodoText })
                .then(() => {
                    setEditingTodoId(null);
                    fetchTodos(page);
                })
                .catch(err => console.error("Error updating todo:", err));
        }
    };

    const handleDelete = (todo) => {
        if (window.confirm("Are you sure you want to delete this todo?")) {
            axios.delete(`http://localhost:3000/delete/${todo._id}`)
                .then(() => fetchTodos(page))
                .catch(err => console.error("Error deleting todo:", err));
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            fetchTodos(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalpages) {
            fetchTodos(page + 1);
        }
    };

    return (
        <div className="home">
            <h2>Todo List</h2>
            <Create onAdd={() => fetchTodos()} />
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
                                <button className="delete_bnt" type="button" onClick={() => handleDelete(todo)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    <div className="pagination">
                        <button onClick={handlePrev} disabled={page === 1}>- Prev</button>
                        <span>Page {page} of {totalpages}</span>
                        <button onClick={handleNext} disabled={page === totalpages}>Next +</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;