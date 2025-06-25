import React, { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user-context';
import './edit-profile.css';

const EditProfile = () => {
    const { user, login } = useContext(UserContext);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (user) {
            setValue('username', user.username);
            setValue('email', user.email);
            setValue('image', user.image || '');
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch('https://blog-platform.kata.academy/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${user.token}`,
                },
                body: JSON.stringify({
                    user: {
                        username: data.username,
                        email: data.email,
                        password: data.password || undefined,
                        image: data.image,
                    },
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw result;
            }

            login(result.user); // Обновляем контекст
            navigate('/');
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="form-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Username
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: 'Username is required' }}
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
                    New password
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input.Password {...field} placeholder="New password" />
                        )}
                    />
                </label>

                <label>
                    Avatar image (url)
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Avatar image" />
                        )}
                    />
                </label>

                <Button type="primary" htmlType="submit" className="submit-button" block>
                    Save
                </Button>
            </form>
        </div>
    );
};

export default EditProfile;