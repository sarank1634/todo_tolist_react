import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from './components/AuthForm';
import Input from './components/Input';

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const onSubmit = (data) => {
        setServerError('');
        axios.post('http://localhost:3000/register', data)
            .then(() => {
                navigate('/login');
            })
            .catch(err => {
                const errorMessage = err.response?.data?.message || 'An unexpected error occurred. Please try again.';
                setServerError(errorMessage);
            });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <AuthForm 
                    title="Create an Account"
                    onSubmit={handleSubmit(onSubmit)}
                    serverError={serverError}
                    buttonText="Register"
                    footer={<p>Already have an account? <Link to="/login">Login</Link></p>}
                >
                    <Input 
                        label="Username"
                        name="username"
                        register={register}
                        error={errors.username}
                    />
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

export default Register;
