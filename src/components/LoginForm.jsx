import React, { useState } from 'react';

// Define your GraphQL endpoint from WordPress
import {GRAPHQL_ENDPOINT} from "../utils/graphql.js"

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                query: `
                    mutation LoginUser {
                      login(input: {
                        clientMutationId: "uniqueId",
                        username: "${username}",
                        password: "${password}"
                      }) {
                        authToken
                        user {
                          id
                          name
                        }
                      }
                    }
                  `,
                }),
            });

            const data = await response.json();

            console.log('Login Response', data);

            if (response.ok) {
                const { user, authToken } = data.data.login;
                const username = user.name;
                console.log('Uaer', user.name);

                localStorage.setItem('jwtToken', authToken);
                localStorage.setItem('userName', username);

                setIsLoading(false);
                setError(null);

                window.location.href = '/';

            } else {
                setError('Invalid credentials. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-200"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
