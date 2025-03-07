// src/components/FullCalendarWidget.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../authContext.jsx"; // 
import { getEvents, createEvent, deleteEvent, updateEvent } from "../api.js";
import FullCalendar from '@fullcalendar/react'; // FullCalendar component
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Day/Week view
import interactionPlugin from '@fullcalendar/interaction'; // Drag & Drop
import '../styles/calendar.css'; // Add your custom styles
import Modal from "./Modal.jsx";
import SliderSwitch from "./SliderSwitch.jsx";
import Notification from './Notification.jsx';


const Calendar = () => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    allDay: false,
    });
  const [notification, setNotification] = useState(null); 
  
  // Sample event data (this will come from the backend later)
  // useEffect(() => {
  //   setEvents([
  //     {
  //       title: 'Sample Event 1',
  //       start: '2025-02-28T10:00:00',
  //       end: '2025-02-28T12:00:00',
  //     },
  //     {
  //       title: 'Sample Event 2',
  //       start: '2025-03-02T14:00:00',
  //       end: '2025-03-02T16:00:00',
  //     },
  //   ]);
  // }, []);

  //Use event data from server:
  useEffect(() => {
    getEvents(token)
      .then(setEvents)
      .catch(() => alert("Failed to load events"));
  }, [token]);

  const toLocalISOString = (date, isAllDay) => {
    if (!date) return "";
    
    const localDate = new Date(date);
    
    // Convert from UTC to local time properly for datetime-local input
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  // Opens modal when a date is clicked
  const handleDateClick = (selected) => {
    const currentDate = new Date(selected.date); // Convert to Date object
    currentDate.setHours(0, 0, 0, 0);    
    const formattedStartDate = currentDate.toISOString(); // Format for datetime-local
    currentDate.setHours(23, 59, 59, 999);
    const formattedEndDate = currentDate.toISOString();
  console.log(formattedStartDate);
  
    setSelectedEvent({ 
      title: "", 
      description: "", 
      start: toLocalISOString(formattedStartDate, true),
      end: formattedEndDate, 
      allDay: true 
    });
    setModalOpen(true);
  };


 // Open modal to edit an existing event
  const handleEventClick = (clickInfo) => {     
    //Extract the compatible properties from FC.clickInfo.event
    //and set the selectedEvent:    
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title || "",
      description: clickInfo.event.extendedProps?.description || "", // Ensure description is defined
      start:toLocalISOString(clickInfo.event.start, clickInfo.event.allDay),
      end: toLocalISOString(clickInfo.event.end,clickInfo.event.allDay),
      allDay: clickInfo.event.allDay || false,
    });
    setModalOpen(true);
};

   // Save changes to the event
  const handleSaveEvent = async () => {
    if (!selectedEvent.title.trim()) {
      alert("Please enter an event title.");
      return;
    }

    let formattedStart = selectedEvent.start ? new Date(selectedEvent.start) : new Date();
    let formattedEnd = selectedEvent.end ? new Date(selectedEvent.end) : null;
  
    // If all-day, set correct times
    if (selectedEvent.allDay) {
      formattedStart.setHours(0, 0, 0, 0);
      if (formattedEnd) {
        formattedEnd.setHours(23, 59, 59, 999);
      } else {
        // If no end date, set it to the same day
        formattedEnd = new Date(formattedStart);
        formattedEnd.setHours(23, 59, 59, 999);
      }
    }
    // console.log("start and end: ",formattedStart , formattedEnd); //debug
    
    const updatedEvent = {
      id: selectedEvent.id,
      title: selectedEvent.title,
      description: selectedEvent.description,
      start: formattedStart.toISOString(),
      end: formattedEnd ? formattedEnd.toISOString() : formattedStart.toISOString(),
      allDay: selectedEvent.allDay,
    };
    try{
      if(updatedEvent.id){
        //Edit event: 
        //Storage: calling api function 
        const event = await updateEvent(updatedEvent, token);
        showNotification(`"${event.title}" updated successfully!`, "success");
        // alert(mesg.id);
      }else{
        //New event: set timestamp as id:
        const newEvent = {...updatedEvent, id:Date.now().toString()}; 
        showNotification(`"${newEvent.title}" added successfully!`, "success");
        //Storage: calling api function  
        await createEvent(newEvent, token);   
      }
    }catch(error){
      console.log("handleSaveEvent: ",error);
      alert("Error saving event: " + error.message);
    }
    // Fetch updated events from the server
    const updatedEvents = await getEvents(token);
    setEvents(updatedEvents);
    console.log(updatedEvents);
    
    setModalOpen(false);
  };

  //Delete an event
  const handleDeleteEvent = async () => {
    if(selectedEvent.id == "") return;
    await deleteEvent(selectedEvent, token);
    const updatedEvents = await getEvents(token);
    setEvents(updatedEvents);
    showNotification(`"${selectedEvent.title}" deleted!`, "success");
    
    setModalOpen(false);
  };
  
  // Update event when drag and drop
  const handleEventDrop = async (eventDropInfo) => {
    const event = eventDropInfo.event;
    
    let formattedStart = event.start ? new Date(event.start) : new Date();
    let formattedEnd = event.end ? new Date(event.end) : null;
    // If all-day, set correct times
    if (event.allDay) {
      formattedStart.setHours(0, 0, 0, 0);
      if (formattedEnd) {
        formattedEnd.setHours(23, 59, 59, 999);
      } else {
        // If no end date, set it to the same day
        formattedEnd = new Date(formattedStart);
        formattedEnd.setHours(23, 59, 59, 999);
      }
    }
    const updatedEvent = {
      id: event.id,
      title: event.title,
      description: event.extendedProps?.description || "",
      start: formattedStart.toISOString(),
      end: formattedEnd.toISOString(),
      allDay: event.allDay,
    };
    // console.log(updatedEvent);
    
    try {
      await updateEvent(updatedEvent, token);
      setEvents((prevEvents) =>
        prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
      );
      showNotification(`"${updatedEvent.title}" updated successfully!`, "success");

      // handleSaveEvent();
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="calendar">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
                left: 'today prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick} // Date click handler
            eventClick={handleEventClick} // Event click handler
            eventDrop={handleEventDrop} // Event drop handler
            editable={true} // Allow drag and drop
            droppable={true} // Allow event dropping
        />
        <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
        >
        <h2>{selectedEvent.id ? "Edit Event" : "New Event"}</h2>
        <input
            type="text"
            placeholder="Event Title *"
            value={selectedEvent.title || ""}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={selectedEvent.description ?? ""}
          onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
        />
        <SliderSwitch 
          id="allDayToggle" 
          label="All Day Event" 
          defaultChecked={selectedEvent.allDay}
          onToggle={() => setSelectedEvent({ ...selectedEvent, allDay: !selectedEvent.allDay, end: "" })} 
        />

        {selectedEvent.allDay ? (
          // Show only start date for all-day events
          <input
            type="datetime-local"
            value={selectedEvent.start ?? ""}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
          />
        ) : (
        <>
          {/* Show start datetime-local for timed events */}
          <input
            type="datetime-local"
            value={selectedEvent.start ?? ""}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, start: e.target.value })}
          />
          
          {/* Show end datetime-local for timed events */}
          <input
            type="datetime-local"
            value={selectedEvent.end ?? ""}
            onChange={(e) => setSelectedEvent({ ...selectedEvent, end: e.target.value })}
          />
        </>
        )}
        </Modal>
        {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
    </div>
  );
};

export default Calendar;
