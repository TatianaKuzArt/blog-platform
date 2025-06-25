import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import './form-sign-in.css';
import { UserContext } from '../context/user-context';

const FormSignIn = () => {
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const onSubmit = async (data) => {
        const { email, password } = data;

        try {
            const response = await fetch('https://blog-platform.kata.academy/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        email,
                        password,
                    },
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors?.['email or password']) {
                    setError('email', {
                        type: 'server',
                        message: Object.entries(result.errors)[0].join(' '),
                    });
                    setError('password', {
                        type: 'server',
                        message: Object.entries(result.errors)[0].join(' '),
                    });
                } else {
                    console.error('Unexpected error:', result);
                }
                return;
            }


            login(result.user);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + (error?.message || 'Unknown error'));
        }
    };

    return (
        <div className="form-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Email address
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email address',
                            },
                        }}
                        render={({ field }) => (
                            <Input {...field} placeholder="Email address" />
                        )}
                    />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </label>

                <label>
                    Password
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters',
                            },
                        }}
                        render={({ field }) => (
                            <Input.Password {...field} placeholder="Password" />
                        )}
                    />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </label>

                <Button type="primary" htmlType="submit" className="submit-button">
                    Login
                </Button>
            </form>

            <p>
                Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
            </p>
        </div>
    );
};

export default FormSignIn;