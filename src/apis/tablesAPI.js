const baseURL = 'https://app.scigroupvn.com/vote/public/api';

const getData = () => {
    return fetch(`${baseURL}/get-uservotes`)
}

const updateData = (data) => {
    return fetch(`${baseURL}/update?id=${data.id}&name=${data.name}&phone=${data.phone}&email=${data.email}&position=${data.position}&cv=${data.cv}&description=${data.description}`)
}

const removeData = (id) => {
    return fetch(`${baseURL}/delete-uservotes/${id}`, {
        method: 'DELETE'
    })
}

export { getData, updateData, removeData };