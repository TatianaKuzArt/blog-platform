import React from 'react';
import './app.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArticleList from '../article-list/article-list';
import PageArticle from '../page-article/page-article';
import Header from '../header/header';
import FormSignIn from '../form-sign-in';
import FormSignUp from '../form-sign-up';
import EditProfile from "../edit-profile";
import CreateArticle from '../create-article/create-article';
import PrivateRoute from '../privat-routes';
import EditArticle from "../edit-article";

function App() {
    return (
        <BrowserRouter>
            <div className='App'>
                <Header />
                <Routes>
                    <Route path='/' element={<ArticleList pageSize={5} />} />
                    <Route path='/articles/:slug' element={<PageArticle />} />
                    <Route path='/sign-in' element={<FormSignIn />} />
                    <Route path='/sign-up' element={<FormSignUp />} />
                    <Route path='/profile' element={<EditProfile />} />
                    <Route path='/new-article' element={<PrivateRoute><CreateArticle /></PrivateRoute>} />
                    <Route path='/articles/:slug/edit' element={<PrivateRoute><EditArticle /></PrivateRoute>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;