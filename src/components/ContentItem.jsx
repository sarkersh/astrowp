import React, { useState } from 'react';
// Define your GraphQL endpoint from WordPress
import {GRAPHQL_ENDPOINT, JWT_TOKEN} from "../utils/graphql.js"
const ContentItem= ({  postId, postTitle, publishDate, author, status, featuredImage, contentType}) => {

    // State to trigger re-render
    const [deleted, setDeleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // State for loading


    // Function to handle post deletion
    const handleDelete = async () => {

        setIsLoading(true); // Set loading to true before request
        let mutation = ''
        if(contentType == 'post'){
            mutation = `
              mutation DeletePost($id: ID!) {
                deletePost(
                  input: { 
                     id: $id 
                  }
                ){
                    deletedId
                }
              }
            `;
        }else{
            mutation = `
              mutation DeletePage($id: ID!) {
                deletePage(
                  input: { 
                     id: $id 
                  }
                ){
                    deletedId
                }
              }
            `;

        }


        try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JWT_TOKEN()}`
                    // Add any additional headers like authorization if needed
                },
                body: JSON.stringify({
                    query: mutation,
                    variables: { id: postId },
                }),
            });

            const data = await response.json();

            setIsLoading(false);

            //console.log('Post deleted successfully', data);
            console.log('Post Response', response);

            if (data.data?.deletePost?.deletedId || data.data?.deletePage?.deletedId) {
                // Post deleted successfully
                setDeleted(true);

                //onDelete(); // Call the onDelete prop function
            }else{
                if(data?.errors[0].debugMessage.includes('invalid-jwt')){
                    const handleLogout = () => {
                        localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
                        window.location.href = '/login'; // Redirect to login page
                    };
                }
            }
            // Add any additional logic needed after deletion
        } catch (error) {
            setIsLoading(false);
            console.error('Error deleting post:', error);
        }
    };

    // If the post has been deleted, do not render this item
    if (deleted) {
        console.log("Post deleted, skipping rendering")

        return null;
    }{

        console.log("Post not deleted, rendering")
    }


    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-700"></div>
                </div>
            )}

            <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
                <div className="flex items-center w-1/4">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"/>
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-800">{postTitle}</p>
                        <p className="text-sm text-gray-500">{postId}</p>
                    </div>
                </div>
                <div className="flex items-center w-1/4">
                    <span className="text-sm text-gray-500">{author}</span>
                </div>
                <div className="flex items-center w-1/4">
                    <span className="text-sm text-gray-500">{status}</span>
                </div>
                <div className="flex items-center w-1/4">
                    <span className="text-sm text-gray-500">{publishDate}</span>
                </div>
                <div className="flex items-end w-1/4 justify-end">
                    <button className="text-sm text-gray-500 mr-2"
                            onClick={() => window.location.href = `/${contentType}/edit/?id=${postId}`}>Edit
                        <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                             fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none"
                                  d="M0 0h24v24H0z"/>
                            <path
                                d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"/>
                            <path
                                d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3"/>
                            <line x1="16" y1="5" x2="19" y2="8"/>
                        </svg>
                    </button>
                    <button className="text-sm text-gray-500 mr-2"
                            onClick={() => window.location.href = `/${contentType}/preview/?id=${postId}`}>preview
                        <svg className="h-6 w-6 text-red-500" width="24" height="24" viewBox="0 0 24 24"
                             stroke-width="2"
                             stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                stroke="none" d="M0 0h24v24H0z"/>
                            <circle cx="12" cy="12" r="2"/>
                            <path
                                d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2"/>
                            <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2"/>
                        </svg>
                    </button>
                    <button className="text-sm text-gray-500 mr-2" onClick={handleDelete}>Del
                        <svg className="h-6 w-6 text-red-500" width="24" height="24" viewBox="0 0 24 24"
                             stroke-width="2"
                             stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path
                                stroke="none" d="M0 0h24v24H0z"/>
                            <line x1="4" y1="7" x2="20" y2="7"/>
                            <line x1="10" y1="11"
                                  x2="10" y2="17"/>
                            <line
                                x1="14" y1="11" x2="14" y2="17"/>
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                            <path
                                d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
                        </svg>
                    </button>
                </div>


            </div>
        </>
    );
};

export default ContentItem;
