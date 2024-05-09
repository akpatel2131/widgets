export const getLocalStorage = () => {
    const localData = localStorage.getItem('treeNodes');
    return JSON.parse(localData);
}

export const setLocalStorage = (value) => {
    localStorage.setItem('treeNodes', JSON.stringify(value));
}

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const checkLocalData = () => {
    const localData = localStorage.getItem('treeNodes');
    if(localData){
        return true
    } else
        return false;
}