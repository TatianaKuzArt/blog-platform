import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArticleForm from '../article-form/article-form';

const EditArticle = () => {
    const { slug } = useParams();
    const [articleData, setArticleData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`);
                const data = await res.json();
                setArticleData({
                    title: data.article.title,
                    description: data.article.description,
                    body: data.article.body,
                    tagList: data.article.tagList,
                });
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [slug]);

    const handleEdit = async (updatedData) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ article: updatedData }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate(`/articles/${data.article.slug}`);
            } else {
                console.error(data.errors);
            }
        } catch (error) {
            console.error('Edit error:', error);
        }
    };

    return (
        articleData && (
            <ArticleForm
                initialData={{
                    title: articleData.title,
                    description: articleData.description,
                    body: articleData.body,
                    tagList: articleData.tagList,
                }}
                isEdit={true}
                onSubmit={handleEdit}
            />
        )
    );
};

export default EditArticle;