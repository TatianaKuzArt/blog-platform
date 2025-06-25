import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Checkbox } from 'antd';
import './form-sign-up.css';
import { UserContext } from '../context/user-context';

const FormSignUp = () => {
    const {
        control,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const password = watch('password');

    const onSubmit = async (data) => {
        const { username, email, password } = data;

        try {
            const response = await fetch('https://blog-platform.kata.academy/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: { username, email, password },
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, messages]) => {
                        setError(field, {
                            type: 'server',
                            message: messages,
                        });
                    });
                } else {
                    console.error('Unknown error:', result);
                }
                return;
            }

            login(result.user);
            navigate('/');
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Create new account</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Username
                    <Controller
                        name="username"
                        control={control}
                        rules={{
                            required: 'Username is required',
                            minLength: { value: 3, message: 'Min 3 characters' },
                            maxLength: { value: 20, message: 'Max 20 characters' },
                        }}
                        render={({ field }) => <Input {...field} placeholder="Username" />}
                    />
                    {errors.username && <p className="error">{errors.username.message}</p>}
                </label>

                <label>
                    Email address
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email format',
                            },
                        }}
                        render={({ field }) => <Input {...field} placeholder="Email address" />}
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
                            minLength: { value: 6, message: 'Min 6 characters' },
                            maxLength: { value: 40, message: 'Max 40 characters' },
                        }}
                        render={({ field }) => (
                            <Input.Password {...field} placeholder="Password" />
                        )}
                    />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </label>

                <label>
                    Repeat Password
                    <Controller
                        name="repeatPassword"
                        control={control}
                        rules={{
                            required: 'Please confirm your password',
                            validate: (value) =>
                                value === password || 'Passwords do not match',
                        }}
                        render={({ field }) => (
                            <Input.Password {...field} placeholder="Repeat Password" />
                        )}
                    />
                    {errors.repeatPassword && (
                        <p className="error">{errors.repeatPassword.message}</p>
                    )}
                </label>

                <label className="checkbox-label">
                    <Controller
                        name="agreement"
                        control={control}
                        rules={{ required: 'You must agree to continue' }}
                        render={({ field }) => (
                            <Checkbox {...field} checked={field.value}>
                                I agree to the processing of my personal information
                            </Checkbox>
                        )}
                    />
                    {errors.agreement && (
                        <p className="error">{errors.agreement.message}</p>
                    )}
                </label>

                <Button type="primary" htmlType="submit" className="submit-button" block>
                    Create
                </Button>
            </form>

            <p className="footer-text">
                Already have an account? <Link to="/sign-in">Sign In.</Link>
            </p>
        </div>
    );
};

export default FormSignUp;