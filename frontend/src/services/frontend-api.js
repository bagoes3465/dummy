/**
 * Frontend API Service for Electron App
 * AI Photobooth Kota Madiun - Version 2.0
 * 
 * Save this file as: src/services/api.js
 * 
 * Updated to match new database schema with:
 * - photo_sessions (not photobooth_sessions)
 * - photos table (separate from session)
 * - photo_processing tracking
 * - download_links with QR codes
 */

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    /**
     * Health check - test API connection
     */
    async health() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Health check failed:', error);
            throw error;
        }
    },
    
    /**
     * Create new photobooth session
     * Returns: { session_id, session_name, created_at }
     */
    async createSession() {
        try {
            const response = await fetch(`${API_BASE_URL}/photobooth/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to create session');
            }
            
            console.log('✅ Session created:', data.data);
            return data.data;
            
        } catch (error) {
            console.error('❌ Create session failed:', error);
            throw error;
        }
    },
    
    /**
     * Upload photo to session
     * @param {string} sessionId - UUID of the session
     * @param {string} photoDataUrl - Base64 data URL from canvas
     * Returns: { photo_id, session_id, photo_url, photo_number }
     */
    async uploadPhoto(sessionId, photoDataUrl) {
        try {
            // Convert data URL to blob
            const blob = await fetch(photoDataUrl).then(r => r.blob());
            
            // Create form data
            const formData = new FormData();
            formData.append('session_id', sessionId);
            formData.append('photo', blob, 'photo.jpg');
            
            const response = await fetch(`${API_BASE_URL}/photobooth/upload`, {
                method: 'POST',
                body: formData,
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to upload photo');
            }
            
            console.log('✅ Photo uploaded:', data.data);
            return data.data;
            
        } catch (error) {
            console.error('❌ Upload photo failed:', error);
            throw error;
        }
    },
    
    /**
     * Process photo with customization
     * @param {string} photoId - UUID of the photo
     * @param {string} backgroundId - UUID of background template
     * @param {string} mascotId - UUID of mascot
     * @param {array} filterIds - Array of filter UUIDs (optional)
     * Returns: { photo_id, processed_url, download_code, download_url, qr_code_url }
     */
    async processPhoto(photoId, backgroundId, mascotId, filterIds = []) {
        try {
            const response = await fetch(`${API_BASE_URL}/photobooth/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    photo_id: photoId,
                    background_id: backgroundId,
                    mascot_id: mascotId,
                    filters: filterIds,
                }),
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to process photo');
            }
            
            console.log('✅ Photo processed:', data.data);
            return data.data;
            
        } catch (error) {
            console.error('❌ Process photo failed:', error);
            throw error;
        }
    },
    
    /**
     * Get session details with all photos
     * @param {string} sessionId - UUID of the session
     */
    async getSession(sessionId) {
        try {
            const response = await fetch(`${API_BASE_URL}/photobooth/session/${sessionId}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to get session');
            }
            
            return data.data;
            
        } catch (error) {
            console.error('❌ Get session failed:', error);
            throw error;
        }
    },
    
    /**
     * Get photo details
     * @param {string} photoId - UUID of the photo
     */
    async getPhoto(photoId) {
        try {
            const response = await fetch(`${API_BASE_URL}/photobooth/photo/${photoId}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to get photo');
            }
            
            return data.data;
            
        } catch (error) {
            console.error('❌ Get photo failed:', error);
            throw error;
        }
    },
    
    /**
     * Get all background templates
     * Returns: Array of { id, template_name, category, image_url, thumbnail_url }
     */
    async getBackgrounds() {
        try {
            const response = await fetch(`${API_BASE_URL}/backgrounds`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to get backgrounds');
            }
            
            return data.data;
            
        } catch (error) {
            console.error('❌ Get backgrounds failed:', error);
            throw error;
        }
    },
    
    /**
     * Get all mascots
     * Returns: Array of { id, mascot_name, image_url, thumbnail_url }
     */
    async getMascots() {
        try {
            const response = await fetch(`${API_BASE_URL}/mascots`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to get mascots');
            }
            
            return data.data;
            
        } catch (error) {
            console.error('❌ Get mascots failed:', error);
            throw error;
        }
    },
    
    /**
     * Get all AI filters
     * Returns: Array of { id, filter_name, description, filter_config }
     */
    async getFilters() {
        try {
            const response = await fetch(`${API_BASE_URL}/filters`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to get filters');
            }
            
            return data.data;
            
        } catch (error) {
            console.error('❌ Get filters failed:', error);
            throw error;
        }
    },
    
    /**
     * Legacy method for backward compatibility
     * @deprecated Use getFilters() instead
     */
    async getEffects() {
        return this.getFilters();
    },
};

export default api;

/**
 * USAGE EXAMPLE IN REACT COMPONENT:
 * 
 * import { api } from '../services/api';
 * 
 * // In your component:
 * async function handlePhotoFlow() {
 *   try {
 *     // 1. Create session
 *     const session = await api.createSession();
 *     
 *     // 2. Upload photo
 *     const photo = await api.uploadPhoto(session.session_id, capturedImageDataUrl);
 *     
 *     // 3. Get customization options
 *     const [backgrounds, mascots, filters] = await Promise.all([
 *       api.getBackgrounds(),
 *       api.getMascots(),
 *       api.getFilters(),
 *     ]);
 *     
 *     // 4. Process photo
 *     const result = await api.processPhoto(
 *       photo.photo_id,
 *       selectedBackgroundId,
 *       selectedMascotId,
 *       [selectedFilterId]
 *     );
 *     
 *     // 5. Show result with QR code
 *     console.log('Processed photo URL:', result.processed_url);
 *     console.log('QR Code URL:', result.qr_code_url);
 *     console.log('Download code:', result.download_code);
 *     
 *   } catch (error) {
 *     console.error('Photo flow error:', error);
 *     alert('Terjadi kesalahan: ' + error.message);
 *   }
 * }
 */
