import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  fetchReviews,
  deleteReview,
  updateReview,
} from "../supabase/table/reviews_db";
import BasicHeader from "../components/BasicHeader";

function Review() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy년 M월 d일 EEEE HH:mm", { locale: ko });
  };

  const handleDelete = async (id) => {
    if (!password) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    try {
      await deleteReview(id);
      setReviews(reviews.filter((review) => review.id !== id));
      setPassword("");
      setShowPasswordInput(false);
      setCurrentReview(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (!password) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    try {
      await updateReview(currentReview.id, {
        title: currentReview.title,
        content: currentReview.content,
        games: currentReview.games,
      });
      setReviews(
        reviews.map((review) =>
          review.id === currentReview.id ? { ...currentReview } : review
        )
      );
      setEditMode(false);
      setCurrentReview(null);
      setPassword("");
      setShowPasswordInput(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleExpand = (id) => {
    setExpandedReviewId(expandedReviewId === id ? null : id);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="mx-auto pb-6 px-6">
      <BasicHeader title="모임후기" navigateTo="/" />
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate("/writereview")}
          className="bg-[#008CFF] font-medium text-white px-3 py-1 rounded-md"
        >
          작성하기
        </button>
      </div>
      {editMode && currentReview ? (
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              제목
            </label>
            <input
              type="text"
              value={currentReview.title}
              onChange={(e) =>
                setCurrentReview({ ...currentReview, title: e.target.value })
              }
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              내용
            </label>
            <textarea
              value={currentReview.content}
              onChange={(e) =>
                setCurrentReview({ ...currentReview, content: e.target.value })
              }
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows="6"
            ></textarea>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              진행한 게임
            </label>
            {currentReview.games.map((game, index) => (
              <div key={index} className="flex flex-row items-center mb-2">
                <div className="flex-1 mr-4">
                  <input
                    type="text"
                    placeholder="게임 이름"
                    value={game.name}
                    onChange={(e) =>
                      setCurrentReview({
                        ...currentReview,
                        games: currentReview.games.map((g, i) =>
                          i === index ? { ...g, name: e.target.value } : g
                        ),
                      })
                    }
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="메모"
                    value={game.memo}
                    onChange={(e) =>
                      setCurrentReview({
                        ...currentReview,
                        games: currentReview.games.map((g, i) =>
                          i === index ? { ...g, memo: e.target.value } : g
                        ),
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#3b82f6] font-bold text-lg text-white py-2.5 px-4 rounded-md "
          >
            수정 완료
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-300 rounded-lg shadow-md p-4"
              >
                <h2 className="text-lg font-semibold text-blue-600">
                  {review.title}
                </h2>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">
                    {formatDate(review.created_at)}
                  </p>
                  <p className="text-sm text-black">{review.nickname}</p>
                </div>
                <button
                  onClick={() => toggleExpand(review.id)}
                  className="mt-2 text-blue-500 hover:underline"
                >
                  {expandedReviewId === review.id ? "접기" : "펼치기"}
                </button>
                {expandedReviewId === review.id && (
                  <>
                    <p className="mt-2 text-gray-800">{review.content}</p>
                    <div className="mt-4">
                      <h3 className="text-md my-3 font-semibold">
                        진행한 게임
                      </h3>
                      {review.games.map((game, index) => (
                        <div
                          key={index}
                          className="flex flex-row items-center mb-1"
                        >
                          <div className="mr-5" style={{ maxWidth: "150px" }}>
                            <p
                              className="font-medium text-black flex-shrink-0"
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {game.name}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-black">{game.memo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-sm text-blue-400 py-1 rounded-md"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          setCurrentReview(review);
                          setShowPasswordInput(true);
                        }}
                        className="text-sm text-red-500 py-1 rounded-md"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-lg">모임후기가 없습니다.</p>
          )}
        </div>
      )}
      {showPasswordInput && currentReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">비밀번호 입력</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPasswordInput(false);
                  setCurrentReview(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(currentReview.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Review;
