import React, { useState } from "react";
import { saveSettingsToDB } from "../../supabase/table/settings_db";
import BasicHeader from "../../components/BasicHeader";

const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
const dayKeys = [1, 2, 3, 4, 5, 6, 0];

function Settings() {
  const [activeDays, setActiveDays] = useState([]);
  const [localActiveDays, setLocalActiveDays] = useState([]);
  const [timeOptions, setTimeOptions] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayInput, setDayInput] = useState(
    dayKeys.reduce((acc, day) => {
      acc[day] = { newHour: "", newAmPm: "PM" };
      return acc;
    }, {})
  );

  const saveSettings = async () => {
    const { error } = await saveSettingsToDB(localActiveDays, timeOptions);

    if (error) {
      console.error("Error saving settings:", error);
    } else {
      alert("설정이 저장되었습니다.");
    }
  };

  const handleDayToggle = (day) => {
    setLocalActiveDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleAddTimeOption = (day) => {
    if (
      dayInput[day].newHour &&
      !isNaN(dayInput[day].newHour) &&
      dayInput[day].newHour >= 1 &&
      dayInput[day].newHour <= 12
    ) {
      const formattedHour = dayInput[day].newHour.padStart(2, "0");
      const formattedTime = `${formattedHour}:00 ${dayInput[day].newAmPm}`;
      setTimeOptions((prevOptions) => {
        const dayOptions = prevOptions[day] || [];
        if (!dayOptions.includes(formattedTime)) {
          return {
            ...prevOptions,
            [day]: [...dayOptions, formattedTime],
          };
        }
        return prevOptions;
      });
      setDayInput((prev) => ({
        ...prev,
        [day]: {
          newHour: "",
          newAmPm: "PM",
        },
      }));
    }
  };

  const handleDeleteTimeOption = (day, time) => {
    setTimeOptions((prevOptions) => ({
      ...prevOptions,
      [day]: prevOptions[day].filter((option) => option !== time),
    }));
  };

  const handleSave = () => {
    saveSettings();
  };

  const handleReset = () => {
    setLocalActiveDays([]);
    setTimeOptions({});
    alert("설정이 초기화되었습니다.");
  };

  const handleInputChange = (day, field, value) => {
    setDayInput((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col items-center pb-24 px-6 h-screen">
      <BasicHeader title="캘린더 세팅" navigateTo="/admin" />
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">활성화할 요일</h2>
          <div className="flex flex-wrap gap-2">
            {dayKeys.map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`p-3 border rounded-lg ${
                  localActiveDays.includes(day)
                    ? "bg-[#008CFF] text-white"
                    : "bg-white text-gray-700"
                } ${selectedDays.includes(day)}`}
              >
                {dayNames[dayKeys.indexOf(day)]}
              </button>
            ))}
          </div>
        </div>
        {selectedDays.map((day) => (
          <div key={day} className="mt-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {dayNames[dayKeys.indexOf(day)]}요일 시간대 옵션
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <input
                  value={dayInput[day]?.newHour || ""}
                  onChange={(e) =>
                    handleInputChange(day, "newHour", e.target.value)
                  }
                  placeholder="시 (1-12)"
                  min="1"
                  max="12"
                  className="w-20 p-2 border rounded-lg mr-2"
                />
                <div className="flex items-center">
                  <button
                    onClick={() => handleInputChange(day, "newAmPm", "AM")}
                    className={`p-2 border rounded-lg mr-1 ${
                      dayInput[day]?.newAmPm === "AM"
                        ? "bg-[#008CFF] text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => handleInputChange(day, "newAmPm", "PM")}
                    className={`p-2 border rounded-lg ${
                      dayInput[day]?.newAmPm === "PM"
                        ? "bg-[#008CFF] text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    PM
                  </button>
                </div>
                <button
                  onClick={() => handleAddTimeOption(day)}
                  className="w-24 py-1 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-300 ml-2"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">모든 추가된 옵션</h2>
          <div className="gap-4">
            {Object.keys(timeOptions).map(
              (day) =>
                localActiveDays.includes(parseInt(day)) && (
                  <div key={day}>
                    <h3 className="text-lg font-semibold mb-2">
                      {dayNames[dayKeys.indexOf(parseInt(day))]}요일
                    </h3>
                    {timeOptions[day].map((time, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <span className="w-full p-3 border rounded-lg bg-gray-200 mr-3">
                          {time}
                        </span>
                        <button
                          onClick={() => handleDeleteTimeOption(day, time)}
                          className="w-16 py-1 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-300"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-10">
          <button
            onClick={handleSave}
            className="w-full bg-[#3b82f6] font-bold text-lg text-white py-2.5 px-4 rounded-md "
          >
            저장
          </button>
          <button
            onClick={handleReset}
            className="w-20 bg-gray-600 text-white rounded-lg shadow-lg"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
