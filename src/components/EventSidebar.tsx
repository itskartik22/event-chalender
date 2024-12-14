import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button"; // Using Shadcn's button component
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDispatch } from "react-redux";
import { addEvent, deleteEvent } from "@/store/reducers/eventSlice";
import EventEdit from "./EventEdit";
import { v4 as uuidv4 } from "uuid";

type EventTime = {
  start: string;
  end: string;
};

enum EventType {
  Personal = "Personal",
  Work = "Work",
  Others = "Others",
}

type Event = {
  id: string;
  name: string;
  date: string; // In format "yyyy-MM-dd"
  time?: EventTime;
  type: EventType;
  description?: string;
};

type EventMap = {
  [key: string]: Event[];
};

type SidebarProps = {
  events: EventMap;
  selectedDay: Date;
};

const EventSidebar: React.FC<SidebarProps> = ({ events, selectedDay }) => {
  const dispatch = useDispatch();
  const date: string = format(selectedDay, "yyyy-MM-dd");

  const [newEventTime, setNewEventTime] = useState<EventTime>({
    start: "",
    end: "",
  });
  const [newEventName, setNewEventName] = useState<string>("");
  const [newEventType, setNewEventType] = useState<EventType>(
    EventType.Personal
  );
  const [newEventDescription, setNewEventDescription] = useState<string>("");

  const handleAddEvent = () => {
    if (!newEventName) return;
    dispatch(
      addEvent({
        id: uuidv4(),
        name: newEventName,
        date: format(selectedDay, "yyyy-MM-dd"),
        time: newEventTime,
        type: newEventType,
        description: newEventDescription,
      })
    );
    setNewEventDescription("");
    setNewEventName("");
    setNewEventTime({ start: "", end: "" });
  };

  return (
    <div className="sticky top-0 left-0 w-80 h-screen overflow-scroll-auto f p-4 bg-gray-50 border-r border-gray-200">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">
          {selectedDay
            ? format(selectedDay, "d MMMM yyyy")
            : "No Date Selected"}{" "}
          Events
        </h2>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                <FiPlus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Event</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Label className="font-semibold">
                  Date: {selectedDay && format(selectedDay, "d MMMM yyyy")}
                </Label>
                <Input
                  placeholder="Event Name"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                />
                <Textarea
                  placeholder="Event Description"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                />
                <Select
                  onValueChange={(value: EventType) => setNewEventType(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <div className="flex gap-2">
                    <Label>Start Time</Label>
                    <input
                      type="time"
                      value={newEventTime.start}
                      onChange={(e) =>
                        setNewEventTime({
                          ...newEventTime,
                          start: e.target.value,
                        })
                      }
                      className="bg-black/60 text-white rounded px-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Label>End Time</Label>
                    <input
                      type="time"
                      value={newEventTime.end}
                      onChange={(e) =>
                        setNewEventTime({
                          ...newEventTime,
                          end: e.target.value,
                        })
                      }
                      className="bg-black/60 text-white rounded px-1"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-4 bg-white">
        {events[date] && events[date].length > 0 ? (
          events[date].map((event: Event) => (
            <div
              key={event.id}
              className={`min-h-20 flex justify-between h-auto relative p-2 border rounded-lg mt-21 text-white ${
                event.type === "Work"
                  ? "bg-red-500"
                  : event.type === "Personal"
                  ? "bg-green-500"
                  : "bg-slate-500"
              }`}
            >
              {/* Edit event */}

              <div>
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm">{event.description}</p>
                <div className="text-xs flex gap-2">
                  <p>Start: {event.time?.start}</p>
                  <p className="text-red-500">End: {event.time?.end}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => dispatch(deleteEvent(event))}
                  className="py-2 px-[0.3rem] bg-white text-red-500"
                >
                  <MdDelete />
                </button>
                <EventEdit event={event} selectedDay={selectedDay} />
              </div>
            </div>
          ))
        ) : (
          <div className="left-0 right-0 flex items-center justify-center font-semibold text-lg text-gray-800/80">
            No Event
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSidebar;
