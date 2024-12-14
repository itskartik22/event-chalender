import { addEvent, deleteEvent, editEvent } from "@/store/reducers/eventSlice";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MdDelete } from "react-icons/md";
import { FiEdit, FiPlus } from "react-icons/fi";

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

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false); // New state
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);

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
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditEvent = () => {
    if (!eventToEdit) return;
    dispatch(
      editEvent({
        ...eventToEdit,
        name: newEventName,
        time: newEventTime,
        type: newEventType,
        description: newEventDescription,
      })
    );
    setIsEditing(false);
    resetForm();
  };

  const handleEditButtonClick = (event: Event) => {
    setIsEditing(true);
    setEventToEdit(event);
    setNewEventName(event.name);
    setNewEventTime(event.time || { start: "", end: "" });
    setNewEventType(event.type);
    setNewEventDescription(event.description || "");
  };

  const resetForm = () => {
    setNewEventName("");
    setNewEventTime({ start: "", end: "" });
    setNewEventType(EventType.Personal);
    setNewEventDescription("");
    setEventToEdit(null);
  };

  return (
    <div className="sticky top-0 left-0 w-80 h-screen overflow-scroll-auto p-4 bg-gray-50 border-r border-gray-200">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">
          {selectedDay
            ? format(selectedDay, "d MMMM yyyy")
            : "No Date Selected"}{" "}
          Events
        </h2>
        {/* Add Event Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2">
              <FiPlus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
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
                value={newEventType}
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
                <div>
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
                <div>
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
      <div className="mt-2 bg-white h-[calc(100%-3rem)] rounded-lg p-2">
        {events[date] && events[date].length > 0 ? (
          events[date].map((event: Event) => (
            <div
              key={event.id}
              className={`min-h-20 flex justify-between h-auto relative p-2 border rounded-lg mt-2 text-white ${
                event.type === "Work"
                  ? "bg-red-500"
                  : event.type === "Personal"
                  ? "bg-green-500"
                  : "bg-slate-500"
              }`}
            >
              <div>
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-sm">{event.description}</p>
                <div className="text-xs flex gap-2">
                  <p>Start: {event.time?.start}</p>
                  <p>End: {event.time?.end}</p>
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => dispatch(deleteEvent(event))}
                  className="py-2 px-[0.3rem] bg-white text-red-500"
                >
                  <MdDelete />
                </button>
                <button
                  onClick={() => handleEditButtonClick(event)}
                  className="py-2 px-[0.3rem] bg-white text-blue-500 mt-1"
                >
                  <FiEdit />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center font-semibold text-lg text-gray-800/80">
            No Event
          </div>
        )}
      </div>
      {/* Edit Event Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
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
              value={newEventType}
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
              <div>
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
              <div>
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
            <Button onClick={handleEditEvent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventSidebar;
