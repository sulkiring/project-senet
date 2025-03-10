import React, { useEffect, useState } from "react";
import { fetchPreviousMeetings } from "../supabase/table/meetings_db";
import BasicHeader from "../components/BasicHeader";
import LoadingIndicator from "../components/LoadingIndicator";

function ConfirmedMeeting() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const meetings = await fetchPreviousMeetings();
        setMeetings(meetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center text-xl">
        <LoadingIndicator />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center text-xl text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="flex flex-col pb-6 px-6">
      <BasicHeader title="확정된 모임" navigateTo="/" />
      <div className="flex-grow overflow-auto">
        {meetings.length > 0 ? (
          <div>
            {meetings.map((meeting) => (
              <div key={`${meeting.date} ${meeting.time}`} className="my-4">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === `${meeting.date} ${meeting.time}`
                        ? null
                        : `${meeting.date} ${meeting.time}`
                    )
                  }
                  className="w-full text-left bg-[#3b82f6]
                  text-white px-4 py-2 font-medium rounded-md focus:outline-none"
                >
                  {meeting.date} &nbsp;
                  {meeting.time} &nbsp;
                  {meeting.meeting_place}
                </button>
                {openDropdown === `${meeting.date} ${meeting.time}` && (
                  <div className="mt-2 bg-gray-100 rounded-md shadow-md px-4 py-3 leading-none">
                    <p className="text-sm text-black">
                      {meeting.participants.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg">확정된 모임이 없어요.</p>
        )}
      </div>
    </div>
  );
}

export default ConfirmedMeeting;
