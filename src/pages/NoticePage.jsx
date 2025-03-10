import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNotices } from "../supabase/table/notice_db";
import BasicHeader from "../components/BasicHeader";
import LoadingIndicator from "../components/LoadingIndicator";

function NoticePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await fetchNotices();
        setNotices(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotices();
  }, []);

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const formatContent = (content) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center text-xl h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-xl text-red-500 h-screen">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto pb-6 px-6">
      <BasicHeader title="공지사항" navigateTo="/" />
      <div className="space-y-4">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white border border-gray-300 rounded-lg shadow-md p-4"
            >
              <h2 className="text-lg font-semibold text-blue-600">
                {notice.title}
              </h2>
              <p className="text-sm text-gray-600">{notice.date}</p>
              <div className="mt-2 text-gray-800">
                {expanded === notice.id ? (
                  <div>
                    {formatContent(notice.content)}
                    <button
                      className="text-blue-500 mt-2"
                      onClick={() => handleToggle(notice.id)}
                    >
                      접기
                    </button>
                  </div>
                ) : (
                  <div>
                    <p
                      className="text-gray-800"
                      style={{ maxHeight: "3em", overflow: "hidden" }}
                    >
                      {formatContent(notice.content)}
                    </p>
                    <button
                      className="text-blue-500 mt-2"
                      onClick={() => handleToggle(notice.id)}
                    >
                      더보기
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg">공지사항이 없어요.</p>
        )}
      </div>
    </div>
  );
}

export default NoticePage;
