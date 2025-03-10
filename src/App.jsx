import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import NoticePage from "./pages/NoticePage";
import Reservation from "./pages/Reservation";
import BookingStatus from "./pages/BookingStatus";
import ConfirmedMeeting from "./pages/ConfirmedMeeting";
import Reschedule from "./pages/Reschedule";
import Review from "./pages/Review";
import WriteReview from "./pages/WriteReview";
import AdminPage from "./pages/AdminPage";
import Settings from "./pages/admin/Settings";
import Attendance from "./pages/admin/Attendance";
import Membership from "./pages/admin/Membership";
import AddMember from "./pages/admin/AddMember";
import Confirmation from "./pages/admin/Confirmation";
import CreateNotice from "./pages/admin/CreateNotice";
import LoginPage from "./pages/LoginPage";
import LoadingIndicator from "./components/LoadingIndicator.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <div className="outer-container">
          <div className="inner-container scrollbar-hide">
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/booking" element={<BookingStatus />} />
                <Route path="/notice" element={<NoticePage />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/confirmed" element={<ConfirmedMeeting />} />
                <Route path="/reschedule" element={<Reschedule />} />
                <Route path="/review" element={<Review />} />
                <Route path="/writereview" element={<WriteReview />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/membership"
                  element={
                    <ProtectedRoute>
                      <Membership />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addmember"
                  element={
                    <ProtectedRoute>
                      <AddMember />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    <ProtectedRoute>
                      <Attendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/createnotice"
                  element={
                    <ProtectedRoute>
                      <CreateNotice />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </div>
        </div>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
