import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user-context';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './header.css';

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className='header'>
            <div className='title'>
                <Link to="/" className="title-link">Realworld Blog</Link>
            </div>
            <nav className='nav'>
                {user ? (
                    <>
                        <button
                            className="create-article"
                            onClick={() => navigate('/new-article')}>
                            Create article
                        </button>
                        <span
                            className='nav-link username'
                            onClick={() => navigate('/profile')}
                            style={{cursor: 'pointer'}}>
              {user.username}
            </span>
                        <Avatar
                            src={user.image || null}
                            icon={!user.image && <UserOutlined/>}
                            style={{marginLeft: 8, cursor: 'pointer'}}
                            onClick={() => navigate('/profile')}
                        />
                        <button className='nav-link logout-button' onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/sign-in" className='nav-link'>Sign In</Link>
                        <Link to="/sign-up" className='nav-link sign-up'>Sign Up</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;