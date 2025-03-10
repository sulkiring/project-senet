import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "../contexts/AuthContext";
import { fetchNextMeeting } from "../supabase/table/meetings_db";
import { fetchLatestNotice } from "../supabase/table/notice_db";
import kakao from "../assets/images/kakao.png";
import carrot from "../assets/images/carrot.png";

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [latestNotice, setLatestNotice] = useState(null);
  const [nextMeeting, setNextMeeting] = useState(null);

  useEffect(() => {
    const loadMeeting = async () => {
      const meeting = await fetchNextMeeting();
      setNextMeeting(meeting);
    };

    loadMeeting();
  }, []);

  useEffect(() => {
    const loadNotice = async () => {
      const notice = await fetchLatestNotice();
      setLatestNotice(notice);
    };

    loadNotice();
  }, []);

  const formatMeetingDateTime = (date, time) => {
    const formattedDate = format(new Date(date), "yyyy년 M월 d일 E요일", {
      locale: ko,
    });
    const parsedTime = parse(time, "hh:mm a", new Date());
    const formattedTime = format(parsedTime, "a h시", { locale: ko });
    return `${formattedDate} ${formattedTime}`;
  };

  const handleClick = (buttonType) => {
    switch (buttonType) {
      case "예약하기":
        navigate("/reservation");
        break;
      case "예약현황":
        navigate("/booking");
        break;
      case "예약변경":
        navigate("/reschedule");
        break;
      case "모임후기":
        navigate("/review");
        break;
    }
  };

  return (
    <div className="pt-4 pb-24 px-7">
      <div className="text-center text-[#222222] text-[40px] leading-none mt-10 font-bold font-pyeongchang">
        보드게임 모임
      </div>
      <div className="text-center text-[#008CFF] text-[40px] leading-none mb-10 font-bold font-pyeongchang">
        세네트
      </div>
      {latestNotice && (
        <div
          className="mt-4 px-2 py-1 bg-white shadow-custom-light rounded-2xl border border-[#008CFF] flex items-center gap-3"
          onClick={() => navigate("/notice")}
        >
          <div className="text-sm font-semibold mx-2">NEW</div>
          <div className="text-base font-normal">{latestNotice.title}</div>
        </div>
      )}
      <div className="mt-5 mb-7">
        {nextMeeting ? (
          <>
            <div className="text-[#222222] text-[24px] font-500 mb-[2px] font-pretendard">
              다가오는 모임은,
            </div>
            <span className="text-[#222222] text-[24px] font-700 leading-none font-pretendard">
              {formatMeetingDateTime(nextMeeting.date, nextMeeting.time)},&nbsp;
            </span>
            <span className="text-[#008CFF] text-[24px] font-700 leading-none font-pretendard">
              {nextMeeting.meeting_place || "데블다이스 1호점"}
            </span>
            <span className="text-[#222222] text-[24px] font-500 leading-none font-pretendard break-words">
              이에요!
            </span>
          </>
        ) : (
          <div>예정된 모임이 아직 없어요</div>
        )}
      </div>
      <div className="p-2 bg-white shadow-custom-medium rounded-xl border border-white my-6 flex justify-center items-center">
        <div
          className="text-[20px] text-[#008CFF] font-700 font-pretendard cursor-pointer"
          onClick={() => navigate("/confirmed")}
        >
          그 외 확정된 모임 확인하기
        </div>
      </div>
      <div className="flex flex-row justify-around mt-8">
        <Button
          gradientClass="blue-bg"
          text="예약하기"
          onClick={() => handleClick("예약하기")}
        />
        <Button
          gradientClass="blue-border"
          text="예약현황"
          onClick={() => handleClick("예약현황")}
        />
      </div>
      <div className="flex flex-row justify-around my-5">
        <Button
          gradientClass="blue-border"
          text="예약변경"
          onClick={() => handleClick("예약변경")}
        />
        <Button
          gradientClass="blue-border"
          text="모임후기"
          onClick={() => handleClick("모임후기")}
        />
      </div>
      <div className="mt-8 mb-3 text-[16  px]">외부링크</div>
      <div className="flex flex-row">
        <a
          href="https://www.daangn.com/kr/groups/nPNR2Q2P"
          target="_blank"
          rel="noopener noreferrer"
          className="shadow-custom-gray rounded-2xl items-center mr-3"
        >
          <img src={carrot} className="w-12 h-12" alt="Carrot" />
        </a>
        <a
          href="https://open.kakao.com/o/gBBo0Msg"
          target="_blank"
          rel="noopener noreferrer"
          className="shadow-custom-gray rounded-2xl items-center"
        >
          <img src={kakao} className="w-12 h-12" alt="Kakao" />
        </a>
      </div>
      <div className="text-center text-[14px] mt-8 ">
        <a href={"/admin"} className="text-[#73B7FA]">
          관리자 페이지
        </a>
      </div>
    </div>
  );
}

const Button = ({ text, onClick, gradientClass }) => (
  <div
    className={`shadow__btn ${gradientClass} flex justify-center items-center cursor-pointer `}
    onClick={onClick}
  >
    <div className="text-[24px] font-bold text-center">{text}</div>
  </div>
);

export default HomePage;
