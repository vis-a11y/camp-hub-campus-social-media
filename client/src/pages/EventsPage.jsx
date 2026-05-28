import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './EventsPage.css';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });

  const fetchEvents = () => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          facultyId: user.id,
          facultyName: user.fullName
        })
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewEvent({ title: '', description: '', date: '' });
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          fullName: user.fullName
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(`Successfully applied! Your Ticket Code is: ${data.ticketCode}`);
        fetchEvents();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Campus Events Hub</h2>
        {user?.role === 'faculty' && (
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create Event
          </button>
        )}
      </div>

      <div className="events-list">
        {events.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: '40px', color: 'var(--secondary-text)'}}>No upcoming events found.</p>
        ) : (
          events.map(event => {
            const hasApplied = event.attendees?.find(a => a.userId === user.id);
            const myTicket = hasApplied ? hasApplied.ticketCode : null;

            return (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p className="event-date">🗓️ {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p className="event-host">Hosted by: {event.facultyName}</p>
                <p className="event-desc">{event.description}</p>
                
                <div className="event-footer">
                  <span className="attendee-count">{event.attendees?.length || 0} attending</span>
                  {user?.role === 'student' && (
                    hasApplied ? (
                      <div className="ticket-box">
                        Ticket: <strong>{myTicket}</strong>
                      </div>
                    ) : (
                      <button className="btn-primary" onClick={() => handleApply(event.id)}>Apply & Get Ticket</button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="event-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Event</h3>
              <button className="back-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateEvent} className="event-form">
              <input 
                type="text" 
                placeholder="Event Title" 
                value={newEvent.title}
                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                required 
              />
              <textarea 
                placeholder="Event Description..." 
                value={newEvent.description}
                onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                required 
              />
              <input 
                type="datetime-local" 
                value={newEvent.date}
                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                required 
              />
              <button type="submit" className="btn-primary" style={{marginTop: '10px'}}>Publish Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
