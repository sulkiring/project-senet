import { supabase } from "../supabaseClient";

export const fetchReviews = async () => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const deleteReview = async (id) => {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

export const updateReview = async (id, updatedFields) => {
  const { error } = await supabase
    .from("reviews")
    .update(updatedFields)
    .eq("id", id);
  if (error) throw new Error(error.message);
};

export const insertReview = async ({
  title,
  content,
  games,
  nickname,
  password,
}) => {
  const { error } = await supabase.from("reviews").insert([
    {
      title,
      content,
      games,
      nickname,
      password,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) throw new Error(error.message);
};
