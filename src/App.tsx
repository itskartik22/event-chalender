import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage.tsx";
import EventPage from "./pages/EventPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Main Calendar Page */}
            <Route path="/" element={<CalendarPage />} />

            {/* Event Details Page */}
            <Route path="/events/:date" element={<EventPage />} />

            {/* 404 Not Found Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
