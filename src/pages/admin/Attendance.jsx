import React, { useEffect, useState } from "react";
import Select from "react-select";
import { format, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import { fetchUsers } from "../../supabase/table/users_db";
import { fetchPreviousMeetings } from "../../supabase/table/meetings_db";
import { fetchAttendance } from "../../supabase/table/attendance_db";
import BasicHeader from "../../components/BasicHeader";

function Attendance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers();

        const meetingsData = await fetchPreviousMeetings({
          sortTimeAscending: true,
        });

        const attendanceData = await fetchAttendance();

        setUsers(usersData);
        setMeetings(meetingsData);

        const initialAttendance = {};
        usersData.forEach((user) => {
          initialAttendance[user.user_id] = {};
          meetingsData.forEach((meeting) => {
            const userAttendance = attendanceData.find(
              (att) =>
                att.user_id === user.user_id &&
                att.meeting_id === meeting.meeting_id
            );
            initialAttendance[user.user_id][meeting.meeting_id] = userAttendance
              ? userAttendance.status
              : "absent";
          });
        });
        setAttendance(initialAttendance);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAttendanceChange = async (userId, meetingId, selectedOption) => {
    const value = selectedOption.value;

    setAttendance((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [meetingId]: value,
      },
    }));

    try {
      const { error } = await supabase.from("attendance").upsert({
        user_id: userId,
        meeting_id: meetingId,
        status: value,
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (date) => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const day = getDay(new Date(date));
    return format(new Date(date), "M/d", { locale: ko }) + `(${dayNames[day]})`;
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour);
    const period = hourInt < 12 ? "오전" : "오후";
    const adjustedHour = hourInt % 12 || 12;
    return `${period} ${adjustedHour}시`;
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

  const options = [
    { value: "absent", label: "불참" },
    { value: "attended", label: "참석" },
    { value: "cancelled", label: "취소" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "30px",
      height: "30px",
      fontSize: "14px",
      border: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "4px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "30px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px",
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  return (
    <div className="flex flex-col items-center pb-24 px-6 h-screen">
      <BasicHeader title="참여현황" navigateTo="/admin" />
      <div className="w-full h-full overflow-auto">
        <table className="min-w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white z-10 w-20 px-2 py-2 border">
                회원명
              </th>
              {meetings.map((meeting) => (
                <th
                  key={meeting.meeting_id}
                  className="text-[16px] py-1 border bg-gray-100"
                >
                  {formatDate(meeting.date)}
                  <br />
                  {formatTime(meeting.time)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="sticky text-[14px] left-0 bg-white z-10 px-2 py-2 border max-w-40 overflow-x-auto whitespace-nowrap">
                  {user.nickname}
                </td>
                {meetings.map((meeting) => (
                  <td
                    key={meeting.meeting_id}
                    className="text-[14px] px-2 min-w-24 border"
                  >
                    <Select
                      value={options.find(
                        (option) =>
                          option.value ===
                          attendance[user.user_id][meeting.meeting_id]
                      )}
                      onChange={(selectedOption) =>
                        handleAttendanceChange(
                          user.user_id,
                          meeting.meeting_id,
                          selectedOption
                        )
                      }
                      options={options}
                      isSearchable={false}
                      styles={customStyles}
                      className="w-full"
                      classNamePrefix="react-select"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;
