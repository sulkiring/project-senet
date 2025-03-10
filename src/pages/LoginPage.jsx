import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BasicHeader from "../components/BasicHeader";

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signIn(email, password);
      alert("로그인에 성공했습니다.");
      navigate("/admin", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mx-auto pb-6 px-6">
      <BasicHeader title="로그인" navigateTo="/" />
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
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
        {error && <p className="text-center text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent shadow-sm text-lg font-medium rounded-lg text-white bg-[#008CFF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          로그인
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
