
const SummaryCard = ({ label, value }) => (
  <div className="bg-WarmBeige-200 border rounded-xl p-6 shadow-sm text-center">
    <p className="text-base text-gray-600 mb-2">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default SummaryCard;
