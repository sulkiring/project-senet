import React, { useState } from "react";
import {
  fetchUserReservations,
  cancelReservation,
} from "../supabase/table/reservation_db";
import BasicHeader from "../components/BasicHeader";

function Reschedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [noReservation, setNoReservation] = useState(false);

  const MASTER_KEY = import.meta.env.VITE_MASTER_KEY;

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setNoReservation(false);
    setReservations([]);

    try {
      const data = await fetchUserReservations(name, phoneNumber, MASTER_KEY);
      if (data.length > 0) {
        setReservations(data);
      } else {
        setNoReservation(true);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleCancel = async (reservationId, reservationDate) => {
    setLoading(true);
    setError(null);
    try {
      await cancelReservation(reservationId, reservationDate);
      setReservations((prev) =>
        prev.filter((res) => res.reservation_id !== reservationId)
      );
      alert("예약이 취소되었습니다.");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col pb-24 px-6">
      <BasicHeader title="예약변경" navigateTo="/" />
      <div className="bg-white">
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">닉네임</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-8">
          <label className="block text-sm font-medium text-black">
            전화번호
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-[#3b82f6] font-semibold text-lg text-white py-2.5 px-4 rounded-md "
        >
          확인
        </button>
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && (
          <p className="text-center text-red-500 mt-4">Error: {error}</p>
        )}
        {noReservation && !loading && !error && (
          <p className="text-center text-red-500 mt-4">
            일치하는 예약이 없습니다.
          </p>
        )}
        {reservations.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">예약 현황</h2>
            {reservations.map((reservation) => (
              <div
                key={reservation.reservation_id}
                className="mb-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <strong>닉네임</strong>
                    <span>{reservation.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <strong>전화번호</strong>
                    <span>{reservation.phone_number}</span>
                  </div>
                  <div className="flex gap-2">
                    <strong>예약날짜</strong>
                    <span>{reservation.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <strong>예약시간</strong>
                    <span>{reservation.time}</span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleCancel(reservation.reservation_id, reservation.date)
                  }
                  className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  예약 취소
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reschedule;
