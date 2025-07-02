import { useState } from "react";
import Create from './Create';
function Home() {
    const [todos, setTodos] = useState([])
    return (
        <div>
            <h2>todolist</h2>
            <Create />
            {
                todos.lenght === 0 ?
                    <div>
                        <h2>No records</h2>
                    </div>
               : todos.map(todo => (
            <div>
                {todo}
            </div>
            ))
            }
        </div>
    )
}

export default Home;


