import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        axios.post('http://localhost:3000/register', data)
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" {...register('username', { required: true })} />
                    {errors.username && <span className="error">Username is required</span>}
                </div>
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
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Register;
