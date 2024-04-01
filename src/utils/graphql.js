export const GRAPHQL_ENDPOINT = 'https://astrowp.voizage.co.uk/graphql';

export const JWT_TOKEN = function () {
    return localStorage.getItem('jwtToken');
};