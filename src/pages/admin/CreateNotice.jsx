import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertNotice } from "../../supabase/table/notice_db";
import BasicHeader from "../../components/BasicHeader";

function CreateNotice() {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await insertNotice(title, content);
      alert("공지사항이 성공적으로 등록되었습니다.");
      navigate("/notice");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mx-auto pb-6 px-6">
      <BasicHeader title="공지사항 작성" navigateTo="/admin" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="6"
          ></textarea>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#3b82f6] font-bold text-lg text-white py-2.5 px-4 rounded-md "
        >
          등록
        </button>
      </form>
    </div>
  );
}

export default CreateNotice;
