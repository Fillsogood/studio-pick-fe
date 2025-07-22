import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Phone, Users, Calendar } from "lucide-react";

const generateTimeSlots = (start, end) => {
  const slots = [];
  let [sh] = start.split(":").map(Number);
  let [eh] = end.split(":").map(Number);
  for (let h = sh; h <= eh; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
};

const weekdayLabels = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

const StudioReservationModal = ({ isOpen, onClose, studio, onSuccess }) => {
  const [reservationDate, setReservationDate] = useState(null);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);

  if (!isOpen || !studio) return null;

  const today = new Date();
  const maxPeople = studio.maxPeople || 10;
  const openTime = studio?.operatingHours?.[0]?.openTime || "09:00";
  const closeTime = studio?.operatingHours?.[0]?.closeTime || "22:00";
  const timeSlots = generateTimeSlots(openTime, closeTime);
  const availableWeekdays = studio.operatingHours?.map((op) =>
    op.weekday.toLowerCase()
  );

  const isWeekend = () => {
    if (!reservationDate) return false;
    const date = new Date(reservationDate);
    return [0, 6].includes(date.getDay());
  };

  const isDateAllowed = (date) => {
    if (!availableWeekdays?.length) return true;
    const weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
      date.getDay()
    ];
    return availableWeekdays.includes(weekday);
  };

  const calcTotalAmount = () => {
    if (!selectedStart || !selectedEnd || !reservationDate) return 0;
    const start = parseInt(selectedStart.split(":"), 10);
    const end = parseInt(selectedEnd.split(":"), 10);
    let hours = end - start;
    if (hours < 1) return 0; // 최소 1시간 예약 가능
    const baseRate = isWeekend() ? studio.weekendPrice : studio.hourlyBaseRate;
    const overPeople = Math.max(0, peopleCount - maxPeople);
    return baseRate * hours + overPeople * (studio.perPersonRate || 0);
  };

  const totalAmount = calcTotalAmount();

  const handleTimeSelect = (slot) => {
    if (!selectedStart) {
      setSelectedStart(slot);
      setSelectedEnd(null);
    } else if (!selectedEnd && slot > selectedStart) {
      setSelectedEnd(slot);
    } else {
      setSelectedStart(slot);
      setSelectedEnd(null);
    }
  };

  const handlePayment = () => {
    if (!reservationDate || !isDateAllowed(reservationDate)) {
      setError("선택한 날짜는 운영하지 않는 요일입니다.");
      return;
    }
    if (totalAmount <= 0) {
      setError("시간과 인원을 선택해주세요");
      return;
    }
    setError("");
    setPaymentDone(true);
  };

  const handleReservation = async () => {
    setLoading(true);
    setError("");
    try {
      const parseTime = (t) => {
        const [hour, minute] = t.split(":".map(Number));
        return { hour, minute, second: 0, nano: 0 };
      };
      const payload = {
        studioId: studio.id,
        reservationDate: reservationDate.toISOString().split("T")[0],
        startTime: parseTime(selectedStart),
        endTime: parseTime(selectedEnd),
        peopleCount,
        totalAmount,
      };
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "예약 실패");
      onSuccess(data.data);
    } catch (e) {
      setError(e.message || "예약 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-200">
          <h2 className="text-lg font-bold">스튜디오 예약</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={studio.thumbnailImage}
              alt="썸네일"
              className="w-16 h-16 rounded object-cover border"
            />
            <div className="text-sm">
              <div className="font-bold text-base text-gray-800">
                {studio.name}
              </div>
              <div className="text-gray-600">
                요금: ₩{studio.hourlyBaseRate?.toLocaleString()} / 시간
              </div>
              <div className="text-gray-600">
                운영 요일:{" "}
                {availableWeekdays?.map((w) => weekdayLabels[w]).join(", ")}
              </div>
              <div className="text-gray-600">
                운영 시간: {openTime} ~ {closeTime}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">날짜</label>
            <DatePicker
              selected={reservationDate}
              onChange={(date) => {
                setReservationDate(date);
                setSelectedStart(null);
                setSelectedEnd(null);
              }}
              minDate={today}
              filterDate={isDateAllowed}
              dateFormat="yyyy-MM-dd"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">시간 선택</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelect(slot)}
                  className={`px-2 py-1 border rounded text-sm transition-colors
                    ${slot === selectedStart ? "bg-lime-300 text-black" : ""}
                    ${
                      selectedStart &&
                      selectedEnd &&
                      slot > selectedStart &&
                      slot < selectedEnd
                        ? "bg-lime-100"
                        : ""
                    }
                    ${slot === selectedEnd ? "bg-lime-300 text-black" : ""}
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
            {selectedStart && selectedEnd && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedStart} ~ {selectedEnd}까지 예약합니다.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">인원 수</label>
            <input
              type="number"
              min={1}
              value={peopleCount}
              onChange={(e) => setPeopleCount(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              최대 {maxPeople}명 (초과 시 추가 요금 발생)
            </p>
          </div>

          <div className="flex justify-between border-t pt-4 text-base font-medium">
            <span>결제 금액</span>
            <span className="text-green-600">
              ₩{totalAmount.toLocaleString()}
            </span>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {!paymentDone ? (
            <button
              onClick={handlePayment}
              className="w-full bg-lime-300 hover:bg-lime-200 text-black py-3 rounded-lg font-semibold mt-2"
            >
              결제하기
            </button>
          ) : (
            <button
              onClick={handleReservation}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold mt-2"
            >
              {loading ? "예약 중..." : "예약하기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioReservationModal;
