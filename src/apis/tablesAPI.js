const baseURL = 'https://scigroup.com.vn/app/recruit/api';

const getData = () => {
    return fetch(`${baseURL}/read`)
}

const updateData = (data) => {
    return fetch(`${baseURL}/update?id=${data.id}&name=${data.name}&phone=${data.phone}&email=${data.email}&position=${data.position}&cv=${data.cv}&description=${data.description}`)
}

const removeData = (id) => {
    return fetch(`${baseURL}/delete?id=${id}`)
}

export { getData, updateData, removeData };