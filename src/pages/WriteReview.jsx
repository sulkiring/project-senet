import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertReview } from "../supabase/table/reviews_db";
import BasicHeader from "../components/BasicHeader";

function WriteReview() {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [games, setGames] = useState([{ name: "", memo: "" }]);

  const handleGameChange = (index, field, value) => {
    const newGames = [...games];
    newGames[index][field] = value;
    setGames(newGames);
  };

  const addGame = () => {
    setGames([...games, { name: "", memo: "" }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await insertReview({ title, content, games, nickname, password });

      alert("모임후기가 성공적으로 등록되었습니다.");
      navigate("/review");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mx-auto pb-24 px-6">
      <BasicHeader title="모임후기 작성" navigateTo="/review" />
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
        <div>
          <label className="block text-lg font-medium text-gray-700">
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            비밀번호 (4자리)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxLength="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">
            진행한 게임
          </label>
          {games.map((game, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                placeholder="게임 이름"
                value={game.name}
                onChange={(e) =>
                  handleGameChange(index, "name", e.target.value)
                }
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <input
                type="text"
                placeholder="메모 (선택)"
                value={game.memo}
                onChange={(e) =>
                  handleGameChange(index, "memo", e.target.value)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addGame}
            className="mt-2 bg-[#008CFF] text-white px-2 py-1 rounded-md"
          >
            게임 추가
          </button>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#3b82f6] font-semibold text-lg text-white py-2.5 px-4 rounded-md"
        >
          등록
        </button>
      </form>
    </div>
  );
}

export default WriteReview;
