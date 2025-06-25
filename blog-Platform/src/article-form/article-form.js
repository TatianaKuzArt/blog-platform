import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input, Button } from 'antd';
import '../create-article/create-article.css';

const ArticleForm = ({ initialData = {}, isEdit = false, onSubmit }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            body: initialData.body || '',
            tags: (initialData.tagList || ['']).map(tag => ({ value: tag }))
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags',
    });

    const onFormSubmit = (data) => {
        const cleanedTags = data.tags
            .map(tag => tag.value.trim())
            .filter(tag => tag !== '');
        const payload = {
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: cleanedTags,
        };
        onSubmit(payload);
    };

    return (
        <div className="create-article-container">
            <h2>{isEdit ? 'Edit article' : 'Create new article'}</h2>

            <label>
                Title
                <Controller
                    control={control}
                    name="title"
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => <Input {...field} placeholder="Title" />}
                />
                {errors.title && <p className="error-message">{errors.title.message}</p>}
            </label>

            <label>
                Short description
                <Controller
                    control={control}
                    name="description"
                    rules={{ required: 'Short description is required' }}
                    render={({ field }) => <Input {...field} placeholder="Short description" />}
                />
                {errors.description && <p className="error-message">{errors.description.message}</p>}
            </label>

            <label>
                Text
                <Controller
                    control={control}
                    name="body"
                    rules={{ required: 'Text is required' }}
                    render={({ field }) => <Input.TextArea rows={6} {...field} placeholder="Text" />}
                />
                {errors.body && <p className="error-message">{errors.body.message}</p>}
            </label>

            <label>Tags</label>
            <div className="tags">
                {fields.map((field, index) => (
                    <div key={field.id} className="tag-row">
                        <Controller
                            control={control}
                            name={`tags.${index}.value`}
                            render={({ field }) => <Input {...field} placeholder="Tag" />}
                        />
                        <Button danger onClick={() => remove(index)} style={{ marginLeft: 8 }}>
                            Delete
                        </Button>
                    </div>
                ))}
                <Button type="dashed" onClick={() => append({ value: '' })} style={{ marginTop: 10 }}>
                    Add tag
                </Button>
            </div>

            <Button
                type="primary"
                onClick={handleSubmit(onFormSubmit)}
                style={{ marginTop: 20 }}
                block
            >
                {isEdit ? 'Save changes' : 'Send'}
            </Button>
        </div>
    );
};

export default ArticleForm;