import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// API calls untuk Photobooth
export const photoboothAPI = {
  // Backgrounds
  getBackgrounds: () => api.get('/backgrounds'),
  
  // Filters
  getFilters: () => api.get('/filters'),
  
  // Mascots
  getMascots: () => api.get('/mascots'),
  
  // Photos
  createSession: (data) => api.post('/photos/session', data),
  uploadPhoto: (formData) => api.post('/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  processPhoto: (data) => api.post('/photos/process', data),
  getPhoto: (photoId) => api.get(`/photos/${photoId}`),
  
  // Downloads
  generateQRCode: (data) => api.post('/downloads/generate', data),
  getDownloadLink: (photoId) => api.get(`/downloads/${photoId}`),
}

export default api
