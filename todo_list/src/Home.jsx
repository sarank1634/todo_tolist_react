import { useEffect, useState } from "react";
import Create from './Create';
import axios from "axios";
function Home() {

    const [todos, setTodos] = useState([])
    const fetchTodos = () => {
        axios.get('http://localhost:3000/todos')
        .then(result => setTodos(result.data))
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
                    todos.map((todo, index) => (
                    <div key={index} style={{display: 'flex', justifyContent: 'space-between',  alignItems: 'center', marginBottom: '10px'  }}>
                    <span>{todo.task}</span>   
                    <button type="button" onClick={() => handleUpdate(todo)}>Update</button> 
                    <button type="button" onClick={() => handleDelete(todo)}>Delete</button> 
        </div>
                ))
            )
}
</div>
);
}

export default Home;