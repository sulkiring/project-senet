import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import { insertReservation } from "../supabase/table/reservation_db";
import { fetchSettings } from "../supabase/table/settings_db";
import BasicHeader from "../components/BasicHeader";
import "../styles/calendar.css";

const dayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function Reservation() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [activeDays, setActiveDays] = useState([]);
  const [timeOptions, setTimeOptions] = useState({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        const {
          active_days,
          monday_time_options,
          tuesday_time_options,
          wednesday_time_options,
          thursday_time_options,
          friday_time_options,
          saturday_time_options,
          sunday_time_options,
        } = data;

        setActiveDays(
          active_days.map((day) =>
            typeof day === "number" ? dayNames[day] : day.toLowerCase()
          )
        );

        setTimeOptions({
          monday: monday_time_options,
          tuesday: tuesday_time_options,
          wednesday: wednesday_time_options,
          thursday: thursday_time_options,
          friday: friday_time_options,
          saturday: saturday_time_options,
          sunday: sunday_time_options,
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const handleDateChange = (date) => {
    setDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formattedDate = format(date, "yyyy-MM-dd");

    try {
      await insertReservation(formattedDate, selectedTime, name, phone);
      alert(
        `예약이 완료되었습니다. ${name}님, ${formattedDate}에 ${selectedTime}으로 예약되었습니다.`
      );
      navigate("/");
    } catch (error) {
      console.error("Error inserting reservation:", error);
      alert("예약 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getYesterdayMidnight = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate());
    yesterday.setHours(0, 0, 0, 0);
    return yesterday;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const day = date.getDay();
      const dayName = dayNames[day];

      const yesterdayMidnight = getYesterdayMidnight();

      if (!activeDays.includes(dayName) || date < yesterdayMidnight) {
        return "react-calendar__tile--disabled";
      }

      if (format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
        return "react-calendar__tile--today";
      }
    }
    return null;
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const day = date.getDay();
      const dayName = dayNames[day];

      const yesterdayMidnight = getYesterdayMidnight();

      return !activeDays.includes(dayName) || date < yesterdayMidnight;
    }
    return false;
  };

  const getTimeOptionsForSelectedDate = () => {
    const dayName = dayNames[date.getDay()];
    return timeOptions[dayName] || [];
  };

  return (
    <div className="flex flex-col pb-24 px-6">
      <BasicHeader title="예약하기" navigateTo="/" />
      <div className="w-full flex justify-center items-center">
        <Calendar
          onChange={handleDateChange}
          value={date}
          locale="ko-KR"
          className="w-full"
          formatDay={(locale, date) => format(date, "d")}
          prev2Label={null}
          next2Label={null}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
        />
      </div>
      {date && getTimeOptionsForSelectedDate().length > 0 && (
        <div className="my-6">
          <h2 className="text-xl font-semibold mb-2">시간 선택</h2>
          <div className="flex flex-wrap justify-center">
            {getTimeOptionsForSelectedDate().map((time, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(time)}
                className={`m-1 px-4 py-2 border rounded-md ${
                  selectedTime === time ? "bg-[#008CFF] text-white" : "bg-white"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
      {selectedTime && (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-[16px] font-medium text-black"
            >
              닉네임
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="phone"
              className="block text-[16px] font-medium text-black"
            >
              전화번호
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] font-semibold text-lg text-white py-2.5 px-4 rounded-md"
          >
            예약하기
          </button>
        </form>
      )}
    </div>
  );
}

export default Reservation;
