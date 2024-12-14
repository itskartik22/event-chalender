import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  id: number;
  name: string;
  date: string; // In format "yyyy-MM-dd"
  time?: EventTime;
  type: EventType;
  description?: string;
};

type EventMap = {
  [key: string]: Event[];
};

const loadInitialState = (): EventMap => {
  const storedEvents = localStorage.getItem("events");
  return storedEvents ? JSON.parse(storedEvents) : {};
};

const saveToLocalStorage = (events: EventMap) => {
  localStorage.setItem("events", JSON.stringify(events));
};

const initialState: EventMap = loadInitialState();

const eventManagerSlice = createSlice({
  name: "eventManager",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      const event = action.payload;
      if (!state[event.date]) {
        state[event.date] = [];
      }
      state[event.date].push(event);
      saveToLocalStorage(state);
    },
    deleteEvent: (state, action: PayloadAction<{ id: number; date: string }>) => {
      const { id, date } = action.payload;
      if (state[date]) {
        state[date] = state[date].filter((event) => event.id !== id);
        if (state[date].length === 0) {
          delete state[date];
        }
        saveToLocalStorage(state);
      }
    },
    editEvent: (state, action: PayloadAction<Event>) => {
      const updatedEvent = action.payload;
      if (state[updatedEvent.date]) {
        const index = state[updatedEvent.date].findIndex((event) => event.id === updatedEvent.id);
        if (index !== -1) {
          state[updatedEvent.date][index] = updatedEvent;
          saveToLocalStorage(state);
        }
      }
    },
  },
});

export const { addEvent, deleteEvent, editEvent } = eventManagerSlice.actions;
export default eventManagerSlice.reducer;
