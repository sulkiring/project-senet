import { supabase } from "../supabaseClient";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export const fetchNextMeeting = async () => {
  const today = new Date();
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .gte("date", today.toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("time", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Error fetching next meeting:", error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const meeting = data[0];
  const formattedDate = format(new Date(meeting.date), "yyyy년 M월 d일 E요일", {
    locale: ko,
  });

  return {
    ...meeting,
    formattedDate,
  };
};

export const fetchPreviousMeetings = async ({
  sortTimeAscending = false,
} = {}) => {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("date", { ascending: false })
    .order("time", { ascending: sortTimeAscending });

  if (error) {
    throw error;
  }
  return data;
};

export const fetchAllMeetings = async () => {
  try {
    const { data, error } = await supabase.from("meetings").select("*");

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertMeeting = async (date, time, location, participants) => {
  try {
    const { error } = await supabase.from("meetings").insert({
      date,
      time,
      meeting_place: location,
      participants,
    });

    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMeeting = async (date, time) => {
  try {
    const { error } = await supabase
      .from("meetings")
      .delete()
      .match({ date, time });

    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
