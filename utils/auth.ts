import {TokenKey} from './enum'

export function getToken() {
    return sessionStorage.getItem(TokenKey) || '';
}

export function setToken(token: string) {
    sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
    sessionStorage.setItem(TokenKey, '');
}
