import axiosInstance from '../axiosInstance';

/**
 * 관리자 시스템 설정 API
 * 백엔드: SystemSettingAdminController (/api/admin/settings)
 */

const ADMIN_SETTING_API_BASE = '/api/admin/settings';

export const adminSystemSettingAPI = {
  getAllSettings: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTING_API_BASE}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSettingsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTING_API_BASE}/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSetting: async (settingKey) => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTING_API_BASE}/${settingKey}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSetting: async (settingKey, settingValue, description = null) => {
    try {
      const response = await axiosInstance.put(`${ADMIN_SETTING_API_BASE}/${settingKey}`, {
        settingValue,
        description
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSetting: async (settingData) => {
    try {
      const response = await axiosInstance.post(`${ADMIN_SETTING_API_BASE}`, settingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSetting: async (settingKey) => {
    try {
      const response = await axiosInstance.delete(`${ADMIN_SETTING_API_BASE}/${settingKey}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSettingsStats: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTING_API_BASE}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBusinessSettings: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTING_API_BASE}/business`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSystemSettings: async () => {
    try {
      const response = await axiosInstance.get(`${ADMIN_SETTING_API_BASE}/system`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPaymentSettings: async () => {
    return await adminSystemSettingAPI.getSettingsByCategory('PAYMENT');
  },

  getSecuritySettings: async () => {
    return await adminSystemSettingAPI.getSettingsByCategory('SECURITY');
  },

  getNotificationSettings: async () => {
    return await adminSystemSettingAPI.getSettingsByCategory('NOTIFICATION');
  },

  getMaintenanceSettings: async () => {
    return await adminSystemSettingAPI.getSettingsByCategory('MAINTENANCE');
  },

  updateSettings: async (settingsMap) => {
    try {
      const promises = Object.entries(settingsMap).map(([key, value]) =>
        adminSystemSettingAPI.updateSetting(key, value)
      );
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },

  resetSetting: async (settingKey) => {
    try {
      const setting = await adminSystemSettingAPI.getSetting(settingKey);
      const defaultValue = setting.data.defaultValue || '';
      return await adminSystemSettingAPI.updateSetting(settingKey, defaultValue);
    } catch (error) {
      throw error;
    }
  },

  resetCategorySettings: async (category) => {
    try {
      const settings = await adminSystemSettingAPI.getSettingsByCategory(category);
      const promises = settings.data.settings.map((setting) =>
        adminSystemSettingAPI.resetSetting(setting.settingKey)
      );
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },

  backupSettings: async () => {
    try {
      const allSettings = await adminSystemSettingAPI.getAllSettings();
      const backup = {
        timestamp: new Date().toISOString(),
        settings: allSettings.data.settings
      };

      const dataStr = JSON.stringify(backup, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileName = `studio-pick-settings-backup-${new Date().toISOString().split('T')[0]}.json`;

      const link = document.createElement('a');
      link.setAttribute('href', dataUri);
      link.setAttribute('download', exportFileName);
      link.click();

      return backup;
    } catch (error) {
      throw error;
    }
  },

  restoreSettings: async (backupData) => {
    try {
      const promises = backupData.settings.map((setting) =>
        adminSystemSettingAPI.updateSetting(setting.settingKey, setting.settingValue, setting.description)
      );
      return await Promise.all(promises);
    } catch (error) {
      throw error;
    }
  },

  validateSetting: async (settingKey, value) => {
    try {
      const setting = await adminSystemSettingAPI.getSetting(settingKey);
      const settingInfo = setting.data;

      if (settingInfo.dataType === 'INTEGER') {
        const intValue = parseInt(value);
        if (isNaN(intValue)) throw new Error('정수 값이 필요합니다.');
        return intValue;
      }

      if (settingInfo.dataType === 'BOOLEAN') {
        if (value !== 'true' && value !== 'false') throw new Error('true 또는 false 값이 필요합니다.');
        return value === 'true';
      }

      if (settingInfo.dataType === 'STRING') {
        if (typeof value !== 'string') throw new Error('문자열 값이 필요합니다.');
        return value;
      }

      return value;
    } catch (error) {
      throw error;
    }
  },

  searchSettings: async (keyword) => {
    try {
      const allSettings = await adminSystemSettingAPI.getAllSettings();
      const filtered = allSettings.data.settings.filter(
        (setting) =>
          setting.settingKey.toLowerCase().includes(keyword.toLowerCase()) ||
          setting.description.toLowerCase().includes(keyword.toLowerCase())
      );

      return {
        success: true,
        data: { settings: filtered },
        message: `${filtered.length}개의 설정을 찾았습니다.`
      };
    } catch (error) {
      throw error;
    }
  },

  exportCategorySettings: async (category) => {
    try {
      const settings = await adminSystemSettingAPI.getSettingsByCategory(category);
      const exportData = {
        category,
        timestamp: new Date().toISOString(),
        settings: settings.data.settings
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileName = `studio-pick-${category.toLowerCase()}-settings-${new Date().toISOString().split('T')[0]}.json`;

      const link = document.createElement('a');
      link.setAttribute('href', dataUri);
      link.setAttribute('download', exportFileName);
      link.click();

      return exportData;
    } catch (error) {
      throw error;
    }
  },

  checkSystemStatus: async () => {
    try {
      const [businessSettings, systemSettings, stats] = await Promise.all([
        adminSystemSettingAPI.getBusinessSettings(),
        adminSystemSettingAPI.getSystemSettings(),
        adminSystemSettingAPI.getSettingsStats()
      ]);

      return {
        businessSettings: businessSettings.data,
        systemSettings: systemSettings.data,
        stats: stats.data,
        status: 'healthy'
      };
    } catch (error) {
      throw error;
    }
  }
};

export default adminSystemSettingAPI;
