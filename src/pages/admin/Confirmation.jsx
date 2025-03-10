import React, { useEffect, useState } from "react";
import { isBefore, format } from "date-fns";
import { fetchAllReservations } from "../../supabase/table/reservation_db";
import {
  fetchAllMeetings,
  insertMeeting,
  deleteMeeting,
} from "../../supabase/table/meetings_db";
import BasicHeader from "../../components/BasicHeader";

function Confirmation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [confirmedMeetings, setConfirmedMeetings] = useState([]);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locations, setLocations] = useState({});

  useEffect(() => {
    const loadReservationsAndMeetings = async () => {
      try {
        const [reservationsData, meetingsData] = await Promise.all([
          fetchAllReservations(),
          fetchAllMeetings(),
        ]);

        setReservations(reservationsData);
        setConfirmedMeetings(meetingsData);

        const initialLocations = meetingsData.reduce((acc, meeting) => {
          const key = `${meeting.date} ${meeting.time}`;
          acc[key] = meeting.meeting_place || "데블다이스 1호점";
          return acc;
        }, {});
        setLocations(initialLocations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservationsAndMeetings();
  }, []);

  const handleConfirm = async (date, time) => {
    const filteredReservations = reservations.filter(
      (reservation) => reservation.date === date && reservation.time === time
    );

    const key = `${date} ${time}`;
    const location = locations[key] || "데블다이스 1호점";
    const participantNames = filteredReservations.map((res) => res.name);

    try {
      await insertMeeting(date, time, location, participantNames);
      setConfirmedMeetings((prev) => [
        ...prev,
        { date, time, meeting_place: location, participants: participantNames },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnconfirm = async (date, time) => {
    try {
      await deleteMeeting(date, time);
      setConfirmedMeetings((prev) =>
        prev.filter(
          (meeting) => !(meeting.date === date && meeting.time === time)
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditLocation = (key) => {
    setEditingLocation(key);
  };

  const handleLocationChange = (key, value) => {
    setLocations((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocationSave = (key) => {
    setEditingLocation(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center text-xl">Loading...</div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center text-xl text-red-500">
        Error: {error}
      </div>
    );

  const today = new Date();
  const filteredReservations = reservations.filter((reservation) =>
    isBefore(today, new Date(reservation.date))
  );

  const groupedReservations = filteredReservations.reduce(
    (acc, reservation) => {
      const key = `${reservation.date} ${reservation.time}`;
      if (!acc[key]) {
        acc[key] = { count: 0, date: reservation.date, time: reservation.time };
      }
      acc[key].count += 1;
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col pb-24 px-6">
      <BasicHeader title="모임확정" navigateTo="/admin" />
      {Object.keys(groupedReservations).length > 0 ? (
        <div>
          {Object.keys(groupedReservations).map((key) => {
            const { date, time } = groupedReservations[key];
            const isConfirmed = confirmedMeetings.some(
              (meeting) => meeting.date === date && meeting.time === time
            );

            return (
              <div key={key} className="mb-4">
                <h2 className="text-xl font-semibold">
                  {format(new Date(date), "yyyy-MM-dd")} {time}
                </h2>
                <table className="w-full border border-gray-300 rounded-lg mt-2">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-2 py-2 text-center text-sm font-medium text-gray-700">
                        총 인원
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-medium text-gray-700">
                        장소
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-2 py-2 text-center text-sm text-gray-600">
                        {groupedReservations[key].count}
                      </td>
                      <td className="px-2 py-2 text-sm text-gray-600">
                        {editingLocation === key ? (
                          <>
                            <input
                              type="text"
                              value={locations[key] || "데블다이스 1호점"}
                              onChange={(e) =>
                                handleLocationChange(key, e.target.value)
                              }
                              className="border border-gray-300 rounded-md w-24 px-2 py-1"
                            />
                            <button
                              onClick={() => handleLocationSave(key)}
                              className="ml-2 text-green-500"
                            >
                              완료
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{locations[key] || "데블다이스 1호점"}</span>
                            <button
                              onClick={() => handleEditLocation(key)}
                              className="ml-2 text-blue-500"
                            >
                              편집
                            </button>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {isConfirmed ? (
                          <button
                            onClick={() => handleUnconfirm(date, time)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                          >
                            확정됨
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConfirm(date, time)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                          >
                            확정
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-lg">확정할 예약이 없습니다.</p>
      )}
    </div>
  );
}

export default Confirmation;
