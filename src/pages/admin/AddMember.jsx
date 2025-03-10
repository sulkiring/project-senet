import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertUser } from "../../supabase/table/users_db";
import BasicHeader from "../../components/BasicHeader";

function AddMember() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nickname, setNickname] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await insertUser(nickname, joinedAt, source);
      navigate("/membership");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleSourceSelection = (selectedSource) => {
    setSource(selectedSource);
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

  return (
    <div className="flex flex-col h-full pb-24 px-6">
      <BasicHeader title="회원추가" navigateTo="/admin" />
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            가입일자
          </label>
          <input
            type="date"
            value={joinedAt}
            onChange={(e) => setJoinedAt(e.target.value)}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            유입경로
          </label>
          <div className="flex space-x-2 mt-2 mb-3">
            <button
              type="button"
              onClick={() => handleSourceSelection("당근마켓")}
              className={`px-4 py-2 rounded-md ${
                source === "당근마켓"
                  ? "bg-[#008CFF] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              당근마켓
            </button>
            <button
              type="button"
              onClick={() => handleSourceSelection("오픈채팅")}
              className={`px-4 py-2 rounded-md ${
                source === "오픈채팅"
                  ? "bg-[#008CFF] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              오픈채팅
            </button>
            <button
              type="button"
              onClick={() => handleSourceSelection("지인소개")}
              className={`px-4 py-2 rounded-md ${
                source === "지인소개"
                  ? "bg-[#008CFF] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              지인소개
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#3b82f6] font-bold text-lg text-white py-2.5 px-4 rounded-md "
        >
          회원 추가
        </button>
      </form>
    </div>
  );
}

export default AddMember;
