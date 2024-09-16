import { useEffect, useState } from "react";
import EventDetails from "../event/event-details";

interface Event {
  id: string;
  name: string;
  StartDate: string;
  EndDate: string;
}

interface ShowEventsProps {
  eventAdded: boolean;
  setEventAdded: (value: boolean) => void;
}

export const ShowEvents: React.FC<ShowEventsProps> = ({ eventAdded, setEventAdded }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = () => {
    fetch("/api/events/getEvents")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEvents(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError("An error occurred while fetching events.");
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventAdded) {
      fetchEvents();
      setEventAdded(false);
    }
  }, [eventAdded, setEventAdded]);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleCloseEventDetails = () => {
    setSelectedEventId(null);
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  if (error) return <p>{error}</p>;

  return (
    <>
      {events.map((event) => (
        <div
          className="w-full h-20 flex-shrink-0 bg-white/30 rounded-lg flex flex-row-reverse items-center justify-between px-5 cursor-pointer mb-2"
          key={event.id}
          onClick={() => handleEventClick(event.id)}
        >
          <div className="flex items-center flex-row-reverse gap-2">
            <div className="flex flex-col text-right">
              <span className="font-semibold">{event.name}</span>
              <span className="text-sm">
              {formatDate(event.StartDate)} - {formatDate(event.EndDate)}
              </span>
            </div>
          </div>
        </div>
      ))}
      {selectedEventId && (
        <EventDetails
          eventId={selectedEventId}
          onClose={handleCloseEventDetails}
        />
      )}
    </>
  );
};