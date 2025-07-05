import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchTodos = useCallback((currentPage) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`http://localhost:3000/todos/all?page=${currentPage}&limit=5`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(result => {
            setTodos(result.data.todos);
            setTotalPages(result.data.totalPages);
            setPage(result.data.currentPage);
        })
        .catch(err => console.error(err));
    }, [navigate]);

    useEffect(() => {
        fetchTodos(page);
    }, [fetchTodos, page]);

    const handleAdd = () => {
        if (task.trim() === '') return;
        axios.post('http://localhost:3000/add', { task: task }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            setTask('');
            if (page === 1) {
                fetchTodos(1);
            } else {
                setPage(1);
            }
        })
        .catch(err => console.error(err));
    };

    const handleEdit = (id) => {
        axios.put(`http://localhost:3000/update/${id}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            setTodos(prevTodos => 
                prevTodos.map(todo => todo._id === id ? { ...todo, done: !todo.done } : todo)
            );
        })
        .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/delete/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            if (todos.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchTodos(page);
            }
        })
        .catch(err => console.error(err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className='home_page'>
            <div className='container'>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My To-Do List</h2>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <form className="create_form" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                <input 
                    type="text" 
                    placeholder='What do you need to do?' 
                    value={task} 
                    onChange={(e) => setTask(e.target.value)} 
                />
                <button type="submit">Add Task</button>
            </form>

            <ul className="task_list">
                {todos.length > 0 ? (
                    todos.map(todo => (
                        <li key={todo._id} className={`task_item ${todo.done ? 'completed' : ''}`}>
                            <div className='checkbox' onClick={() => handleEdit(todo._id)}>
                                {todo.done ? 
                                    <BsFillCheckCircleFill className='icon' /> : 
                                    <BsCircleFill className='icon' />
                                }
                                <p>{todo.task}</p>
                            </div>
                            <div className="btn_container">
                                <button className="delete_btn" onClick={() => handleDelete(todo._id)}>Delete</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li><h2>No tasks yet. Great job!</h2></li>
                )}
            </ul>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
                </div>
            )}
            </div>
        </div>
    );
}

export default Home;