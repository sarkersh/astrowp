// utils/auth.js
export const isLoggedInAstro = () => {
    if (import.meta.env.MODE === 'browser') {
        const token = localStorage.getItem('jwtToken');
        return !!token;
    }
    return false; // Assume not logged in during build
};

export const isLoggedIn = () => {
    const token = localStorage.getItem('jwtToken');
    return !!token;
};