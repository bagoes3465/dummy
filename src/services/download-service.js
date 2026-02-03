const supabase = require('../database/supabase-client');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * Service untuk generate QR Code dan manage download links
 */
class DownloadService {
  /**
   * Generate random download code
   */
  generateDownloadCode() {
    return crypto.randomBytes(10).toString('hex').toUpperCase();
  }

  /**
   * Generate QR Code untuk download link
   */
  async generateQRCode(downloadLink) {
    try {
      // Generate QR Code sebagai data URL (PNG)
      const qrDataUrl = await QRCode.toDataURL(downloadLink, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 2,
        width: 300,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return { success: true, qrDataUrl };
    } catch (error) {
      console.error('Error generating QR code:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buat download link dengan QR code untuk foto
   */
  async createDownloadLink(photoId, sessionId, options = {}) {
    try {
      const downloadCode = this.generateDownloadCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (options.expiresInHours || 24));

      // URL download (adjust sesuai domain Anda)
      const baseUrl = process.env.DOWNLOAD_BASE_URL || 'http://localhost:3000';
      const downloadUrl = `${baseUrl}/download/${downloadCode}`;

      // Generate QR Code
      const qrResult = await this.generateQRCode(downloadUrl);
      if (!qrResult.success) {
        throw new Error(qrResult.error);
      }

      // Save download link ke database
      const { data, error } = await supabase
        .from('download_links')
        .insert([
          {
            photo_id: photoId,
            session_id: sessionId,
            download_code: downloadCode,
            qr_code_url: qrResult.qrDataUrl, // Bisa juga save QR code ke storage
            download_url: downloadUrl,
            password: options.password || null,
            expires_at: expiresAt,
            max_downloads: options.maxDownloads || -1, // -1 = unlimited
            is_active: true
          }
        ])
        .select();

      if (error) throw error;

      return {
        success: true,
        data: {
          ...data[0],
          qrCode: qrResult.qrDataUrl
        }
      };
    } catch (error) {
      console.error('Error creating download link:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get download link by code
   */
  async getDownloadLinkByCode(downloadCode) {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select(`
          *,
          photo:photo_id(*)
        `)
        .eq('download_code', downloadCode)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { success: false, error: 'Download link sudah expired' };
      }

      // Check if max downloads reached
      if (data.max_downloads > 0 && data.download_count >= data.max_downloads) {
        return { success: false, error: 'Download limit sudah tercapai' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching download link:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(downloadLinkId) {
    try {
      // Get current count
      const { data: link, error: getError } = await supabase
        .from('download_links')
        .select('download_count')
        .eq('id', downloadLinkId)
        .single();

      if (getError) throw getError;

      // Update count
      const { error: updateError } = await supabase
        .from('download_links')
        .update({ download_count: link.download_count + 1 })
        .eq('id', downloadLinkId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Track download analytics
   */
  async trackDownload(downloadLinkId, photoId, downloaderInfo = {}) {
    try {
      const { error } = await supabase
        .from('download_analytics')
        .insert([
          {
            download_link_id: downloadLinkId,
            photo_id: photoId,
            downloader_info: downloaderInfo,
            device_type: downloaderInfo.deviceType || 'unknown',
            ip_address: downloaderInfo.ipAddress || null
          }
        ]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error tracking download:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get download links by session
   */
  async getDownloadsBySession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('download_links')
        .select(`
          *,
          photo:photo_id(*)
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching session downloads:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get download analytics by photo
   */
  async getDownloadAnalytics(photoId) {
    try {
      const { data, error } = await supabase
        .from('download_analytics')
        .select('*')
        .eq('photo_id', photoId)
        .order('downloaded_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching download analytics:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Revoke/deactivate download link
   */
  async revokeDownloadLink(downloadLinkId) {
    try {
      const { error } = await supabase
        .from('download_links')
        .update({ is_active: false })
        .eq('id', downloadLinkId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error revoking download link:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new DownloadService();
