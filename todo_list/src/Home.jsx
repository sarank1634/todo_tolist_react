import { useEffect, useState } from "react";
import Create from './Create';
import axios from "axios";
function Home() {
    const [todos, setTodos] = useState([])
    useEffect(() => {
        axios.get('http://localhost:3000/todos')
        .then(result => setTodos(result.data))
        .catch(err => console.error("Error fetching todos:", err))
    }, [])
    return (
        <div>
            <h2>todolist</h2>
            <Create />{/*  */}
            {
                todos.length === 0 ? (
                    <div>
                        <h2>No records</h2>
                    </div>
                ) : todos.map((todo, index) => (
                    <div key={index}>
                        {todo.task}
                    </div>
                ))
            }
        </div>
    )
}

export default Home;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import Create from "./Create";

// function Home() {
//   const [todos, setTodos] = useState([]);

//   const fetchTodos = () => {
//     axios.get("http://localhost:3000/todos")
//       .then(res => setTodos(res.data))
//       .catch(err => console.error("Fetch error:", err));
//   };

//   const handleDelete = (id) => {
//     axios.delete(`http://localhost:3000/delete/${id}`)
//       .then(() => fetchTodos())
//       .catch(err => console.error("Delete error:", err));
//   };

//   const handleUpdate = (id, newTask) => {
//     const updated = prompt("Edit task:", newTask);
//     if (updated && updated.trim()) {
//       axios.put(`http://localhost:3000/update/${id}`, { task: updated })
//         .then(() => fetchTodos())
//         .catch(err => console.error("Update error:", err));
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   return (
//     <div>
//       <h2>Todo List</h2>
//       <Create onAdd={fetchTodos} />
//       {
//         todos.length === 0 ? (
//           <p>No records</p>
//         ) : (
//           todos.map(todo => (
//             <div key={todo._id} style={{ display: 'flex', gap: '10px', margin: '5px 0' }}>
//               <span>{todo.task}</span>
//               <button onClick={() => handleUpdate(todo._id, todo.task)}>Edit</button>
//               <button onClick={() => handleDelete(todo._id)}>Delete</button>
//             </div>
//           ))
//         )
//       }
//     </div>
//   );
// }

// export default Home;