export default function HostStudioCard({
  studio,
  onDelete,
  onToggle,
  onNavigate,
  onCopy,
}) {
  return (
    <div className="border rounded-xl p-4 shadow bg-white">
      <h3 className="text-xl font-bold mb-2">{studio.name}</h3>
      <p className="text-gray-600">{studio.location}</p>
      <p>\u20a9 {studio.hourlyBaseRate.toLocaleString()}</p>

      <div className="flex gap-2 mt-4">
        {studio.status === "APPROVED" && (
          <>
            <button onClick={() => onNavigate(studio.id)}>개설</button>
            <button onClick={() => onDelete(studio.id)}>삭제</button>
            <button onClick={() => onToggle(studio.id)}>숨기기</button>
          </>
        )}

        {studio.status === "ACTIVE" && (
          <>
            <button onClick={() => onNavigate(studio.id)}>수정</button>
            <button onClick={() => onDelete(studio.id)}>삭제</button>
            <button onClick={() => onToggle(studio.id)}>숨기기</button>
          </>
        )}

        {studio.status === "INACTIVE" && (
          <>
            <button onClick={() => onToggle(studio.id)}>활성화</button>
            <button onClick={() => onDelete(studio.id)}>삭제</button>
          </>
        )}

        {studio.status === "REJECTED" && (
          <button onClick={() => onCopy(studio.id)}>수정</button>
        )}
      </div>
    </div>
  );
}
