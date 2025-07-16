import axiosInstance from '../axiosInstance';

/**
 * 관리자 정산 관리 API
 * 백엔드: AdminSettlementController
 */

const ADMIN_SETTLEMENT_API_BASE = '/admin/settlements';

const approveSettlement = async (settlementId) => {
  const response = await axiosInstance.post(`${ADMIN_SETTLEMENT_API_BASE}/${settlementId}/approve`);
  return response.data;
};

const adminSettlementAPI = {
  approveSettlement
};

export default adminSettlementAPI;
