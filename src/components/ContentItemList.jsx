// ContentList.jsx
import React, { useState } from 'react';
import ContentItem from './ContentItem';

const ContentItemList = ({ initialItems, contentType }) => {

    const postItems = initialItems.map(item => {

        return Object.assign(
            {},
            item,
            {author: item.author?.node?.name},
            {featuredImage: item.featuredImage?.node?.sourceUrl}
        )

    });


    const [items, setItems] = useState(postItems);

    return (
        <div>

            <div className="flex justify-between items-center p-4 bg-gray-200 border-b border-gray-500">
                <div className="flex items-center w-1/4">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"/>
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-800">Title</p>
                    </div>
                </div>
                <div className="flex items-center w-1/4">
                    <span className="text-sm text-gray-700 font-semibold" >Author</span>
                </div>
                <div className="flex items-center w-1/4">
                    <span className="text-sm text-gray-500 font-semibold">Status</span>
                </div>
                <div className="flex items-center w-1/4">
                    <span className="text-sm text-gray-500 font-semibold">Date</span>
                </div>
                <div className="flex items-end w-1/4  font-semibold justify-end px-4">
                    Action
                </div>
            </div>


            {items.map(item => (
                <ContentItem
                    key={item.postId} {...item}
                    contentType={contentType}

                />
            ))}
        </div>
    );
};

export default ContentItemList;


