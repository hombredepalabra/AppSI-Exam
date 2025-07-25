// src/utils/initApp.js
import { initApi } from '../services/api.js'

export const initializeApp = async () => {
  try {
    await initApi.createAdmin()
    console.log('App inicializada correctamente')
    return true
  } catch (error) {
    console.error('Error al inicializar app:', error)
    return false
  }
}