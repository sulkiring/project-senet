import { supabase } from "../supabaseClient";
import { addMonths, differenceInDays } from "date-fns";

export const fetchActiveUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("status", "active")
    .order("user_id", { ascending: true });

  if (error) throw error;

  const today = new Date();
  return data.map((member) => {
    const baseDate = member.last_participation_date || member.joined_at;
    if (baseDate) {
      const expulsionDate = addMonths(new Date(baseDate), 3);
      const daysLeft = differenceInDays(expulsionDate, today);
      return {
        ...member,
        expulsion_target:
          daysLeft >= 0 ? `${daysLeft}일 남음` : `${Math.abs(daysLeft)}일 지남`,
        isExpulsionPassed: daysLeft < 0,
      };
    }
    return {
      ...member,
      expulsion_target: "정보 없음",
      isExpulsionPassed: false,
    };
  });
};

export const deactivateUser = async (userId) => {
  const { error } = await supabase
    .from("users")
    .update({ status: "deactivated" })
    .eq("user_id", userId);
  if (error) throw error;
};

export const insertUser = async (nickname, joinedAt, source) => {
  try {
    const { error } = await supabase.from("users").insert([
      {
        nickname,
        joined_at: joinedAt,
        source,
        status: "active",
      },
    ]);

    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("user_id", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
