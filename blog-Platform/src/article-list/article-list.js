import React, { useEffect, useState } from 'react';
import ArticleCard from '../article-card/article-card';

const ArticleList = ({ currentPage, pageSize, setTotalArticles }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArticles = async () => {
            setLoading(true);
            try {
                const offset = (currentPage - 1) * pageSize;
                const res = await fetch(`https://blog-platform.kata.academy/api/articles?limit=${pageSize}&offset=${offset}`);
                const data = await res.json();
                setArticles(data.articles);
                setTotalArticles(data.articlesCount);
            } catch (error) {
                console.error('Ошибка загрузки статей:', error);
            } finally {
                setLoading(false);
            }
        };

        loadArticles();
    }, [currentPage, pageSize, setTotalArticles]);

    if (loading) return <div>Loading articles...</div>;

    return (
        <div>
            {articles.map(article => (
                <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
    );
};

export default ArticleList;