import storage from 'good-storage'

const TOKEN_KEY = "tokenKey"

const AUTO_LOGIN = "autoLogin"

export function setToken(token) {
  storage.set(TOKEN_KEY,token)
}

export function getToken() {
  return storage.get(TOKEN_KEY)
}

export function setAutoLogin(isAutoLogin) {
  storage.set(AUTO_LOGIN,isAutoLogin)
}

export function getAutoLogin() {
  return storage.get(AUTO_LOGIN)
}

