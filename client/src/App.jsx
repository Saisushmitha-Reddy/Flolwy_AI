import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import CapturePage from "./pages/CapturePage.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

export default function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 40, maxWidth: "calc(100vw - 240px)" }}>
        <Routes>
          <Route path="/" element={<CapturePage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
