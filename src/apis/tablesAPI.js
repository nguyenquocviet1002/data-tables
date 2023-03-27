const baseURL = 'https://61a1fe86014e1900176de816.mockapi.io';

const getData = () => {
    return fetch(`${baseURL}/tables`)
}

const updateData = (id, data) => {
    return fetch(`${baseURL}/tables/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    })
}

const removeData = (id) => {
    return fetch(`${baseURL}/tables/${id}`, {
        method: 'DELETE'
    })
}

export { getData, updateData, removeData };