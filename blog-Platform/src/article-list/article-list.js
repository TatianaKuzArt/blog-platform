import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ArticleCard from '../article-card/article-card';
import Pagination from '../pagination/pagination';

const fetchArticles = async ({ pageParam = 1, pageSize }) => {
    const offset = (pageParam - 1) * pageSize;
    const res = await fetch(`https://blog-platform.kata.academy/api/articles?limit=${pageSize}&offset=${offset}`);
    if (!res.ok) throw new Error('Ошибка при загрузке статей');
    return res.json();
};

const ArticleList = ({ pageSize }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['articles', currentPage, pageSize],
        queryFn: () => fetchArticles({ pageParam: currentPage, pageSize }),
        keepPreviousData: true,
        staleTime: 1000 * 60,
    });

    if (isLoading) return <div>Loading articles...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const { articles, articlesCount } = data;

    return (
        <div>
            {articles.map(article => (
                <ArticleCard key={article.slug} article={article} />
            ))}
            <Pagination
                currentPage={currentPage}
                total={articlesCount}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ArticleList;