const contactStore = 'contact-info';

const getContactStorage = () => {
    if (localStorage.getItem(contactStore) != null) {
        return JSON.parse(localStorage.getItem(contactStore));
    }

    return [];
}

const getDataById = (id) => {
    return getContactStorage().filter(el => el.id === id)[0];
}

const getCurrentDate = () => {
    let date = new Date();
    return date.getFullYear() + '/' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '/' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2);
}

const findMaxId = () => {
    const ids = getContactStorage().map(object => {
        return object.id;
    });

    return ids.length === 0 ? 0 : Math.max(...ids);
}

export {
    getContactStorage,
    getDataById,
    findMaxId,
    getCurrentDate,
    contactStore,
}
