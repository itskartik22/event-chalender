import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";

import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useDispatch } from "react-redux";
import { editEvent } from "@/store/reducers/eventSlice";

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

type EventEditProps = {
  event: Event;
  selectedDay: Date;
};
const EventEdit: React.FC<EventEditProps> = ({ event }) => {
  const dispatch = useDispatch();
  const [oldEvent, setOldEvent] = useState<Event>(event);

  const handleEditEvent = () => {
    if (!oldEvent.name) return;
    dispatch(editEvent(oldEvent));
  };
  return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-1 p-1">
            <MdModeEditOutline className="text-black" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label className="font-semibold">
              {/* Date: {selectedDay && format(selectedDay, "d MMMM yyyy")} */}
            </Label>
            <Input
              placeholder="Event Name"
              value={oldEvent.name}
              onChange={(e) =>
                setOldEvent({
                  ...oldEvent,
                  name: e.target.value,
                })
              }
            />
            <Textarea
              placeholder="Event Description"
              value={oldEvent.description}
              onChange={(e) =>
                setOldEvent({
                  ...oldEvent,
                  description: e.target.value,
                })
              }
            />
            <Select
              onValueChange={(value: EventType) =>
                setOldEvent({
                  ...oldEvent,
                  type: value,
                })
              }
            >
              <SelectTrigger className="w-[80px] p-1">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 text-sm">
              <div className="flex gap-2">
                <Label>Start Time</Label>
                <input
                  type="time"
                  value={oldEvent.time?.start}
                  onChange={(e) => {
                    setOldEvent({
                      ...oldEvent,
                      time: {
                        ...oldEvent.time,
                        start: e.target.value || "",
                        end: oldEvent.time?.end || "",
                      },
                    });
                  }}
                  className="bg-black/60 text-white rounded px-1 py-0"
                />
              </div>
              <div className="flex gap-2">
                <Label>End Time</Label>
                <input
                  type="time"
                  onChange={(e) => {
                    setOldEvent({
                      ...oldEvent,
                      time: {
                        ...oldEvent.time,
                        end: e.target.value || "",
                        start: oldEvent.time?.end || "",
                      },
                    });
                  }}
                  className="bg-black/60 text-white rounded px-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button onClick={handleEditEvent}>Edit Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default EventEdit;
