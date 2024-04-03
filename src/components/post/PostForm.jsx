import React, { useRef, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';

import {GRAPHQL_ENDPOINT, JWT_TOKEN} from "../../utils/graphql.js"

export default function PostForm({ postId,postTitle, publishDate, status, excerpt, content, action }) {
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        postId:postId || '',
        title:postTitle || '',
        publishDate:publishDate || '',
        status:status || 'publish',
        excerpt:excerpt || '',
        content:content || ''
    });
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [error, setError] = useState(null); // State for error
    const [successMessage, setSuccessMessage] = useState(null); // State for success message

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true before request

        const editorContent = editorRef.current.getContent();

        let query = ''

        if(action === 'Update'){
            query = `
          mutation UpdatePost(
            $id: ID!, 
            $title: String, 
            $content: String
            $status: PostStatusEnum,
            $excerpt: String           
          ) {
            updatePost( 
                input: { 
                    id: $id,
                    title: $title, 
                    content: $content,
                    status: $status,
                    excerpt: $excerpt
                }) {
                   post
                   {
                        id                        
                    }
                }
           }
        `;
        }else {
            query = `
          mutation CreatePost(            
            $title: String, 
            $content: String
            $status: PostStatusEnum,
            $excerpt: String           
          ) {
            createPost( 
                input: {                    
                    title: $title, 
                    content: $content,
                    status: $status,
                    excerpt: $excerpt
                }) {
                   post
                   {
                        id                        
                    }
                }
           }
        `;
        }

        const variables = {
            id: formData.postId,
            title: formData.title,
            content: editorContent,
            status: formData.status.toUpperCase(),
            excerpt: formData.excerpt
        };

        //console.log([query, variables])

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT_TOKEN()}`
            },
            body: JSON.stringify({ query, variables })
        };

        try {
            const response = await fetch(GRAPHQL_ENDPOINT, options);
            const data = await response.json();


            setIsLoading(false); // Set loading to false after request

            if ( !data.errors && response.ok) {
                console.log('Post updated successfully:', data.data.updatePost);


                const _successMessage = (action === 'Update') ? 'Post updated successfully' : 'Post created successfully'

                // Handle successful update (e.g., clear form, show success message)
                setSuccessMessage(_successMessage); // Set success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setError(data.errors[0].message); // Set error state if response is not OK

                // Handle errors (e.g., show error message)
                window.scrollTo({ top: 0, behavior: 'smooth' });

                if(data?.errors[0].debugMessage.includes('invalid-jwt')){
                    const handleLogout = () => {
                        localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
                        window.location.href = '/login'; // Redirect to login page
                    };
                }
            }
        } catch (error) {
            setIsLoading(false); // Set loading to false in case of errors
            setError(error.message); // Set error state for network errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.error('Error Here:', error);
            // Handle network errors
        }
    };


    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6">

                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700"></div>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-200 p-2 rounded-md">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="bg-red-300 p-2 rounded-md">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-black p-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Enter title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black p-2"
                        />
                    </div>

                    <div
                        className={"lg:w-1/3 fixed bottom-0 top-22.5 z-999 flex w-[230px] -translate-x-[120%] flex-col rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark lg:static lg:translate-x-0 lg:border-none false"}>
                        <label htmlFor="image" className="block text-sm font-semibold text-black p-2">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black p-2"
                        />
                    </div>

                    <div
                        className={"lg:w-1/4 fixed bottom-0 top-22.5 z-999 flex w-[230px] -translate-x-[120%] flex-col rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark lg:static lg:translate-x-0 lg:border-none false"}>
                        <label htmlFor="status" className="block text-sm font-semibold text-black-700 p-2">
                            Status
                        </label>
                        <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black p-2"
                        >
                            <option value="">Select Status</option>
                            <option value="publish">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    <div>
                        <Editor
                            apiKey='adgspzxlx1iwm8te89ed52967fy104fl2zc01d4xq7vr0mxr'
                            onInit={(evt, editor) => (editorRef.current = editor)}
                            init={{
                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate  mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                tinycomments_mode: 'embedded',
                                /*tinycomments_author: 'Author name',
                                mergetags_list: [
                                    {value: 'First.Name', title: 'First Name'},
                                    {value: 'Email', title: 'Email'},
                                ]*/
                            }}
                            initialValue={formData.content}
                        />
                    </div>

                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-semibold text-black p-2">
                            Excerpt
                        </label>
                        <textarea
                            name="excerpt"
                            id="excerpt"
                            placeholder="Enter excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        // disabled={loading}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {/*{loading ? 'Updating...' : 'Update Post'}*/}
                        {action} Post
                    </button>
                </form>
            </div>

        </>
    );
}