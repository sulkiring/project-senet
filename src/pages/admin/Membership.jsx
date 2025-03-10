import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchActiveUsers,
  deactivateUser,
} from "../../supabase/table/users_db";
import BasicHeader from "../../components/BasicHeader";

function Membership() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchActiveUsers();
        setMembers(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };

    loadMembers();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString)
      .toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\.$/, "");
  };

  const handleDeactivateMember = async () => {
    if (!selectedMember) return;
    try {
      await deactivateUser(selectedMember.user_id);
      setMembers((prev) =>
        prev.filter((m) => m.user_id !== selectedMember.user_id)
      );
      setShowModal(false);
      setSelectedMember(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const confirmDeactivation = (member) => {
    setSelectedMember(member);
    setShowModal(true);
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
      <BasicHeader title="회원정보" navigateTo="/admin" />
      <div>
        {members.length > 0 ? (
          <div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="py-2 text-center text-sm font-medium text-gray-700">
                    번호
                  </th>
                  <th className="pl-1 py-2 text-center text-sm font-medium text-gray-700">
                    닉네임
                  </th>
                  <th className="px-1 py-2 text-center text-sm font-medium text-gray-700">
                    가입일자
                  </th>
                  <th className="px-1 py-2 text-center text-sm font-medium text-gray-700">
                    마지막 참여
                  </th>
                  <th className="px-1 py-2 text-center text-sm font-medium text-gray-700">
                    경고
                  </th>
                  <th className="px-2 py-2 text-center text-sm font-medium text-gray-700">
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.user_id} className="border-b border-gray-200">
                    <td className="px-2 py-2 text-sm text-center text-black">
                      {index + 1}
                    </td>
                    <td className="py-2 text-sm text-black">
                      {member.nickname}
                    </td>
                    <td className="px-1 py-2 text-center text-sm text-black">
                      {formatDate(member.joined_at)}
                    </td>
                    <td className="px-1 py-2 text-center text-sm text-black">
                      {member.last_participation_date
                        ? formatDate(member.last_participation_date)
                        : "정보 없음"}
                    </td>
                    <td
                      className={`px-2 py-2 text-sm text-center ${
                        (member.warning ?? 0) >= 3
                          ? "text-red-500"
                          : "text-black"
                      }`}
                    >
                      {member.warning ?? 0}
                    </td>
                    <td className="px-1 py-2 text-sm text-center">
                      <button
                        onClick={() => confirmDeactivation(member)}
                        className="bg-red-500 font-semibold text-white w-4 h-4 leading-none rounded-full"
                      >
                        ㅡ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-lg">회원이 없습니다.</p>
        )}
      </div>
      <button
        onClick={() => navigate("/addmember")}
        className="text-blue-500 font-semibold leading-none flex tems-center pt-3 pb-12"
      >
        <span className="text-lg leading-none pt-1">추가</span>
        <span className="text-2xl leading-none">+</span>
      </button>
      {/* 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              정말 회원 명단에서 제거하시겠습니까?
            </h2>
            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
              >
                취소
              </button>
              <button
                onClick={handleDeactivateMember}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Membership;
