import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../article-form/article-form';
import { UserContext } from '../context/user-context';

const CreateArticle = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleCreate = async (articleData) => {
        try {
            const res = await fetch('https://blog-platform.kata.academy/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${user.token}`,
                },
                body: JSON.stringify({ article: articleData }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Failed to create article');
            }

            const result = await res.json();
            navigate(`/articles/${result.article.slug}`);
        } catch (err) {
            console.error(err);
            alert('Failed to create article');
        }
    };

    return (
        <ArticleForm
            isEdit={false}
            onSubmit={handleCreate}
        />
    );
};

export default CreateArticle;