import React, { useState } from 'react';  

const EventModal = ({ date, events, onAddEvent, onClose }) => {  
  const [newEvent, setNewEvent] = useState({ name: '', start: '', end: '', description: '' });  

  const handleSubmit = () => {  
    onAddEvent(date, newEvent);  
    onClose();  
  };  

  return (  
    <div className="modal">  
      <h2>Events for {date}</h2>  
      <ul>  
        {events.map((event, index) => (  
          <li key={index}>{event.name}</li>  
        ))}  
      </ul>  

      <input  
        type="text"  
        placeholder="Event Name"  
        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}  
      />  

      <button onClick={handleSubmit}>Add Event</button>  
      <button onClick={onClose}>Close</button>  
    </div>  
  );  
};  

export default EventModal;  
