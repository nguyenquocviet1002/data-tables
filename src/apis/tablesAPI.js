const getData = () => {
    return fetch("https://61a1fe86014e1900176de816.mockapi.io/tables")
}

const updateData = (id, data) => {
    return fetch(`https://61a1fe86014e1900176de816.mockapi.io/tables/${id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    })
}

const removeData = (id) => {
    return fetch(`https://61a1fe86014e1900176de816.mockapi.io/tables/${id}`, {
        method: 'DELETE'
    })
}

export { getData, updateData, removeData };