import { supabase } from "../supabaseClient";

export const fetchAttendance = async () => {
  try {
    const { data, error } = await supabase.from("attendance").select("*");

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateAttendance = async (userId, meetingId, status) => {
  try {
    const { error } = await supabase.from("attendance").upsert({
      user_id: userId,
      meeting_id: meetingId,
      status,
    });

    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
