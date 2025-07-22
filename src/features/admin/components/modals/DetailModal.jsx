import React, { useState } from 'react';
import { formatDate } from '../../../../lib/admin';

const DetailModal = ({ item, onClose, onApprove, onReject, loading }) => {
  const [reason, setReason] = useState('');

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{item.name} 상세보기</h2>
        <p><strong>대표자:</strong> {item.ownerInfo?.name || '알 수 없음'}</p>
        <p><strong>카테고리:</strong> {item.category || '기타'}</p>
        <p><strong>위치:</strong> {item.location || '알 수 없음'}</p>
        <p><strong>등록일:</strong> {formatDate(item.createdAt)}</p>
        <p><strong>상태:</strong> {item.status}</p>
        <textarea
          className="w-full border p-2 mt-2"
          rows="3"
          placeholder="거부 사유 입력"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
            <button
            disabled={loading || !item?.id}
            onClick={() => {
                console.log('승인 클릭 - 전달되는 item:', item);
                if (item?.id) onApprove(item.id);
            }}
            className="bg-teal-600 text-white px-3 py-1 rounded"
            >
            승인
            </button>
          <button disabled={loading || !reason} onClick={() => onReject(item.id, reason)} className="bg-red-600 text-white px-3 py-1 rounded">거부</button>
          <button onClick={onClose} className="border px-3 py-1 rounded">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
