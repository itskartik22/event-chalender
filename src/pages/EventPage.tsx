import React from "react";
import { useParams } from "react-router-dom";

const EventPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Events for {date}</h1>
      <p>Here you can manage and view all events for this date.</p>
      {/* Add event management logic here */}
    </div>
  );
};

export default EventPage;
