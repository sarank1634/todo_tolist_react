import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from './components/AuthForm';
import Input from './components/Input';

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = (data) => {
        setServerError('');
        axios.post('http://localhost:3000/login', data)
            .then(result => {
                if (result.data.token) {
                    localStorage.setItem('token', result.data.token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
                    navigate('/home');
                } else {
                    setServerError(result.data.message || 'Login failed. Please check your credentials.');
                }
            })
            .catch(err => {
                const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
                setServerError(errorMessage);
                console.error("Login error:", err);
            });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <AuthForm 
                    title="Welcome Back!"
                    onSubmit={handleSubmit(onSubmit)}
                    serverError={serverError}
                    buttonText="Login"
                    footer={<p>Don't have an account? <Link to="/register">Register</Link></p>}
                >
                    <Input 
                        label="Email"
                        name="email"
                        type="email"
                        register={register}
                        error={errors.email}
                    />
                    <Input 
                        label="Password"
                        name="password"
                        type="password"
                        register={register}
                        error={errors.password}
                    />
                </AuthForm>
            </div>
            
        </div>
    );
}

export default Login;
