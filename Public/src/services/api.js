import store from './store.js';

const URL = '/api';

const token = store.getToken();
if(!token && location.pathname !== '/auth.html') {
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname);
    location = `auth.html?${searchParams.toString()}`;
}

function fetchWithError(url, options) {
    if(token) {
        options = options || {};
        options.headers = options.headers || {};
        options.headers.Authorization = token;
    }

    return fetch(url, options)
        .then(response => {
            console.log(response);
            if(response.ok) {
                return response.json();
            }
            else {
                return response.json().then(json => {
                    throw json.error;
                });
            }
        });
}

export function getTypes(options) {
    const showAll = options && options.showAll;
    const url = `${URL}/types${showAll ? '?show=all' : ''}`;
    return fetchWithError(url);
}

export function addType(type) {
    const url = `${URL}/types`;
    return fetchWithError(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(type)
    });
        
}

export function updateType(type) {
    const url = `${URL}/types/${type.id}`;
    return fetchWithError(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(type)
    });
}

export function removeType(id) {
    const url = `${URL}/types/${id}`;
    return fetchWithError(url, {
        method: 'DELETE'
    });
}

export function signUp(user) {
    const url = `${URL}/auth/signup`;
    return fetchWithError(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
}
    
export function signIn(credentials) {
    const url = `${URL}/auth/signin`;
    return fetchWithError(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    });
}

