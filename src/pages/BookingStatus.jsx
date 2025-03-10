import React, { useEffect, useState } from "react";
import { fetchUpcomingReservations } from "../supabase/table/reservation_db";
import BasicHeader from "../components/BasicHeader";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "long" }).format(
    date
  );

  return `${year}년 ${month}월 ${day}일 ${weekday}`;
};

function BookingStatus() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await fetchUpcomingReservations();
        const today = new Date().toISOString().split("T")[0];
        const filteredData = data.filter(
          (reservation) => reservation.date >= today
        );
        setReservations(filteredData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const groupByDate = (reservations) => {
    return reservations.reduce((acc, reservation) => {
      const { date } = reservation;
      if (!acc[date]) acc[date] = [];
      acc[date].push(reservation);
      return acc;
    }, {});
  };

  const groupedReservations = groupByDate(reservations);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="mx-auto pb-24 px-6">
      <BasicHeader title="예약현황" navigateTo="/" />
      {Object.keys(groupedReservations).length > 0 ? (
        <div className="mt-4">
          {Object.keys(groupedReservations).map((date) => (
            <div key={date} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{formatDate(date)}</h2>
              <div>
                {groupedReservations[date].map((reservation) => (
                  <div key={reservation.reservation_id} className="mb-2">
                    <div className="p-2 bg-gray-100 rounded-lg border border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">
                          {reservation.time}
                        </span>
                        <span className="text-sm text-gray-600">
                          {reservation.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg">예약이 없습니다.</p>
      )}
    </div>
  );
}

export default BookingStatus;
