const URL = 'api';

function fetchWithError(url, options) {
    return fetch(url, options)
        .then(response => {
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
    console.log(url);
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
    

