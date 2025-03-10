import { supabase } from "../supabaseClient";

export const fetchLatestNotice = async () => {
  const { data, error } = await supabase
    .from("notice")
    .select("*")
    .order("date", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error fetching latest notice:", error);
    return null;
  } else {
    return data[0] || null;
  }
};

export const fetchNotices = async () => {
  try {
    let { data, error } = await supabase
      .from("notice")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching notices:", error);
    throw error;
  }
};

export const insertNotice = async (title, content) => {
  try {
    const { error } = await supabase.from("notice").insert([
      {
        title,
        content,
        date: new Date().toISOString().split("T")[0],
      },
    ]);

    if (error) throw new Error(error.message);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
