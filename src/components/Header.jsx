import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const UserMenu = ({title}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');


    // Toggle dropdown open/close
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('jwtToken'); // Remove JWT token from localStorage
        window.location.href = '/login'; // Redirect to login page
    };

    useEffect(() => {

        const token = localStorage.getItem('jwtToken');
        const userName = localStorage.getItem('userName');
        if (token) {
            setIsLoggedIn(true);
            setUserName(userName);
        } else {
            // Redirect non-logged-in users to the login page
            window.location.href = '/login';
        }

    }, [isLoggedIn]);


    // Close the dropdown if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-between items-center bg-white p-4 shadow-md">

            <h1 className="text-2xl font-700">
                { title || 'AstroWP' }
            </h1>

            <div className="flex items-center relative" ref={dropdownRef}>
                <span className="hidden sm:block ml-2">Welcome! {userName}</span>
                <UserCircleIcon className="h-8 w-8 text-gray-500 ml-2" />
                <ChevronDownIcon
                    className="h-5 w-5 text-gray-500 ml-1 cursor-pointer"
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="absolute top-8 z-40 mt-4 w-48 bg-white rounded-md shadow-lg py-1">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>My Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Account Settings</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout} >Log Out</a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;
