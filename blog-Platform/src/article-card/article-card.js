import React, { useContext, useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './article-card.css';
import { UserContext } from '../context/user-context';
import { message } from 'antd';

const ArticleCard = ({ article: initialArticle }) => {
    const { user } = useContext(UserContext);
    const [favorited, setFavorited] = useState(initialArticle.favorited);
    const [favoritesCount, setFavoritesCount] = useState(initialArticle.favoritesCount);

    const toggleLike = async () => {
        if (!user) {
            message.info('Войдите, чтобы поставить лайк');
            return;
        }

        const method = favorited ? 'DELETE' : 'POST';

        try {
            const res = await fetch(
                `https://blog-platform.kata.academy/api/articles/${initialArticle.slug}/favorite`,
                {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${user.token}`,
                    },
                }
            );

            if (!res.ok) throw new Error('Ошибка при изменении лайка');

            const data = await res.json();
            setFavorited(data.article.favorited);
            setFavoritesCount(data.article.favoritesCount);
        } catch (err) {
            console.error(err);
            message.error('Не удалось изменить лайк');
        }
    };

    return (
        <div className='article-card'>
            <div className='card-left'>
                <div className='card-header'>
                    <Link to={`/articles/${initialArticle.slug}`} className='article-title'>
                        {initialArticle.title}
                    </Link>
                    {favorited ? (
                        <HeartFilled className="like-icon liked" onClick={toggleLike} />
                    ) : (
                        <HeartOutlined className="like-icon" onClick={toggleLike} />
                    )}
                    <div className='likes'>{favoritesCount}</div>
                </div>

                {initialArticle.tagList.map((tag, index) => (
                    <span key={tag + index} className='tag'>{tag}</span>
                ))}

                <p className='article-description'>{initialArticle.description}</p>
            </div>

            <div className='card-footer'>
                <img
                    className='avatar'
                    src={initialArticle.author.image || 'https://www.svgrepo.com/show/170710/avatar.svg'}
                    alt='avatar'
                />
                <div className='author-info'>
                    <span className='author-name'>{initialArticle.author.username}</span>
                    <span className='article-date'>
                        {new Date(initialArticle.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;