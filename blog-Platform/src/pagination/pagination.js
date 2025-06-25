import React from 'react';
import { Pagination } from 'antd';
import './pagination.css';

const BlogPagination = ({ currentPage, total, pageSize, onPageChange }) => {
    return (
        <div className='pagination'>
            <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger={false}
            />
        </div>
    );
};

export default BlogPagination;