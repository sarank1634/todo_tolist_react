import { useEffect, useState } from "react";
import Create from './Create';
import axios from "axios";

function Home() {
const [todos, setTodos] = useState([])
const [page, setPage] = useState(1);
const [totalpages, setTotalpages] = useState(1);
const limit = 10;

    const fetchTodos = (pageNum = 1) => {
        axios.get(`http://localhost:3000/todos/all?page=${pageNum}&limit=${limit}`)
        .then(result => {
            setTodos(result.data.todos);
            setPage(result.data.page);
            setTotalpages(result.data.totalPages)
        })
        .catch(err => console.error("Error fetching todos:", err))
    };

    useEffect(() => {
        fetchTodos()
    }, [])

    const handleUpdate = (todo) => { 
        const updatedTask = prompt("Update task:", todo.task);
        if(updatedTask && updatedTask.trim()) {
            axios.put(`http://localhost:3000/update/${todo._id}`,{task: updatedTask})
            .then(() => fetchTodos())
            .catch(err => console.error("Error updating todo:", err));
        }
    };

     const handleDelete = (todo) => {
         if(window.confirm("are you sure wnat to delete this todo")) {
        axios.delete(`http://localhost:3000/delete/${todo._id}`)
            .then(() => fetchTodos())
            .catch(err => console.error("Error deleting todo:", err))
    }
};

    const handlePrev = () => {
        if(page > 1){
            fetchTodos(page-1);
        }
    };
   const handleNext = () => {
    if(page < totalpages) {
        fetchTodos(page+1);
    }
   };

    return (
        <div>
            <h2>todolist</h2>
            <Create  onAdd={fetchTodos}/>
            {
                todos.length === 0 ? (
                    <div>
                        <h2>No records</h2>
                    </div>
                ) : (
                    <> {
                    todos.map((todo, index) => (
                    <div key={index} style={{
                        display: 'flex',
                         justifyContent: 'space-between', 
                          alignItems: 'center',
                           marginBottom: '10px' 
                     }}>
                    <span>{todo.task}</span>   
                    <button type="button" onClick={() => handleUpdate(todo)}>Update</button> 
                    <button type="button" onClick={() => handleDelete(todo)}>Delete</button> 
              </div>
                ))}
            <div style={{marginTop: '20px',display: 'flex', gap:"10", justifyContent: 'center' }}>
                <button onClick={handlePrev} disabled={page === 1 }>- Prev</button>
                <span>Page {page} of {totalpages}</span>
                <button onClick={handleNext} disabled={page === totalpages}>Next +</button>
            </div>
</> )}
</div>
);
}

export default Home;