import { supabase } from "../supabaseClient";
import { format, isToday, parseISO } from "date-fns";

export const insertReservation = async (
  formattedDate,
  selectedTime,
  name,
  phone
) => {
  const { data, error } = await supabase.from("reservation").insert([
    {
      date: formattedDate,
      time: selectedTime,
      name: name,
      phone_number: phone,
    },
  ]);

  if (error) throw error;
  return data;
};

export const fetchUpcomingReservations = async () => {
  const { data, error } = await supabase
    .from("reservation")
    .select("*")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    throw error;
  }
  return data;
};

export const fetchUserReservations = async (name, phoneNumber, MASTER_KEY) => {
  try {
    const today = new Date();
    let actualPhoneNumber = phoneNumber;

    if (phoneNumber === MASTER_KEY) {
      const { data, error } = await supabase
        .from("reservation")
        .select("*")
        .eq("name", name);

      if (error) throw new Error(error.message);
      actualPhoneNumber = data[0]?.phone_number || phoneNumber;
    }

    const { data, error } = await supabase
      .from("reservation")
      .select("*")
      .eq("name", name)
      .eq("phone_number", actualPhoneNumber)
      .gte("date", format(today, "yyyy-MM-dd"))
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelReservation = async (reservationId, reservationDate) => {
  try {
    const parsedDate = parseISO(reservationDate);

    if (isToday(parsedDate)) {
      throw new Error("당일에는 취소할 수 없어요. 직접 문의해 주세요.");
    }

    const { error } = await supabase
      .from("reservation")
      .delete()
      .eq("reservation_id", reservationId);

    if (error) throw new Error(error.message);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAllReservations = async () => {
  try {
    const { data, error } = await supabase
      .from("reservation")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
