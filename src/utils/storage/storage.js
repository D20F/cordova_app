
export const setStorage = (key, data) => {
    return localStorage.setItem(key, JSON.stringify(data))
}

export const getStorage = (key) => {
    return new Promise((resolve, reject) => {
        let val = localStorage.getItem(key);
        if (val == null) {
            reject('err')
        } else {
            resolve(JSON.parse(val))
        }
    })
}

export const removeStorage = (key) => {
    return localStorage.removeItem(key);
}
export const clearStorage = () => {
    return localStorage.clear();
}
