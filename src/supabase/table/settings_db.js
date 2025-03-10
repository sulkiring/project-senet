import { supabase } from "../supabaseClient";

const dayKeys = [1, 2, 3, 4, 5, 6, 0];
const dayColumns = [
  "monday_time_options",
  "tuesday_time_options",
  "wednesday_time_options",
  "thursday_time_options",
  "friday_time_options",
  "saturday_time_options",
  "sunday_time_options",
];

export const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
};

export const saveSettingsToDB = async (localActiveDays, timeOptions) => {
  const time_options = dayKeys.reduce((acc, day) => {
    acc[dayColumns[dayKeys.indexOf(day)]] = timeOptions[day] || [];
    return acc;
  }, {});

  const { error } = await supabase.from("settings").upsert([
    {
      active_days: localActiveDays,
      ...time_options,
      created_at: new Date().toISOString(),
    },
  ]);

  return { error };
};
