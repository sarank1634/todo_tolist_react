import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        axios.post('http://localhost:3000/login', data)
            .then(result => {
                if(result.data.token) {
                    localStorage.setItem('token', result.data.token);
                    navigate('/home');
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" {...register('email', { required: true })} />
                    {errors.email && <span className="error">Email is required</span>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" {...register('password', { required: true })} />
                    {errors.password && <span className="error">Password is required</span>}
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;
