import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BasicHeader from "../components/BasicHeader";

function AdminPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleNavigation = (page) => {
    switch (page) {
      case "회원정보":
        navigate("/membership");
        break;
      case "참여현황":
        navigate("/attendance");
        break;
      case "모임확정":
        navigate("/confirmation");
        break;
      case "일정세팅":
        navigate("/settings");
        break;
      case "공지작성":
        navigate("/createnotice");
        break;
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col pb-6 px-6">
      <BasicHeader title="관리자 페이지" navigateTo="/" />
      <div className="flex flex-col gap-4">
        <Button text="회원정보" onClick={() => handleNavigation("회원정보")} />
        <Button text="참여현황" onClick={() => handleNavigation("참여현황")} />
        <Button text="모임확정" onClick={() => handleNavigation("모임확정")} />
        <Button text="일정세팅" onClick={() => handleNavigation("일정세팅")} />
        <Button text="공지작성" onClick={() => handleNavigation("공지작성")} />
      </div>
      <div className="mt-6 flex justify-center">
        <LogoutButton text="로그아웃" onClick={handleLogout} />
      </div>
    </div>
  );
}

const Button = ({ text, onClick }) => (
  <div
    className="mx-12 h-[60px] bg-[#3b82f6] text-white flex items-center justify-center rounded-lg cursor-pointer shadow-lg "
    onClick={onClick}
  >
    <div className="text-xl font-semibold">{text}</div>
  </div>
);

const LogoutButton = ({ text, onClick }) => (
  <div
    className="w-24 h-[40px] bg-red-500 text-white flex items-center justify-center rounded-md cursor-pointer shadow-md hover:bg-red-600 transition-colors duration-300"
    onClick={onClick}
  >
    <div className="text-lg font-semibold">{text}</div>
  </div>
);

export default AdminPage;
