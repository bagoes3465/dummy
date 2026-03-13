/**
 * API Service for AI Photobooth Kota Madiun
 * Backend Integration Layer
 */

// Backend API base URL - adjust for your environment
const API_BASE_URL = 'http://127.0.0.1:8001/api'; // FastAPI backend

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.request('/health');
  }

  /**
   * Create new photobooth session
   */
  async createSession() {
    const response = await this.request('/photobooth/session', {
      method: 'POST',
    });

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to create session');
    }
  }

  /**
   * Upload photo to session
   */
  async uploadPhoto(sessionId, imageDataUrl) {
    // Convert data URL to Blob
    function dataURLToBlob(dataURL) {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }

    const blob = dataURLToBlob(imageDataUrl);

    // Create FormData
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('photo', blob, 'photo.png');

    const uploadResponse = await fetch(`${this.baseURL}/photobooth/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      console.error('Upload validation errors:', errorData.errors);
      throw new Error(errorData.message || 'Upload failed');
    }

    const result = await uploadResponse.json();
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  }

  /**
   * Process photo with customizations
   */
  async processPhoto(photoId, backgroundId, mascotId, filters = []) {
    const response = await this.request('/photobooth/process', {
      method: 'POST',
      body: JSON.stringify({
        photo_id: photoId,
        background_id: backgroundId,
        mascot_id: mascotId,
        filters: filters,
      }),
    });

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Processing failed');
    }
  }

  /**
   * Get session details
   */
  async getSession(sessionId) {
    const response = await this.request(`/photobooth/session/${sessionId}`);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get session');
    }
  }

  /**
   * Get photo details
   */
  async getPhoto(photoId) {
    const response = await this.request(`/photobooth/photo/${photoId}`);

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Failed to get photo');
    }
  }

  /**
   * Download photo by code
   */
  async downloadByCode(downloadCode) {
    // This will redirect to the file, so we don't use our request wrapper
    window.open(`${this.baseURL}/photobooth/download/${downloadCode}`, '_blank');
  }

  /**
   * Get all backgrounds
   */
  async getBackgrounds() {
    const response = await this.request('/backgrounds');

    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.message || 'Failed to get backgrounds');
    }
  }

  /**
   * Get all mascots
   */
  async getMascots() {
    const response = await this.request('/mascots');

    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.message || 'Failed to get mascots');
    }
  }

  /**
   * Get all AI filters
   */
  async getFilters() {
    const response = await this.request('/filters');

    if (response.success) {
      return response.data || [];
    } else {
      throw new Error(response.message || 'Failed to get filters');
    }
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for testing
export { ApiService };
