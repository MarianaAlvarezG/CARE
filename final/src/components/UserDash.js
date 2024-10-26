import React, { useEffect, useState } from 'react';
import './UserDash.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const UserDash = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([
    {
      title: '2nd Package Drop!',
      date: '2024-10-24'
    },
    {
      title: 'First Day of Winter Trimester!',
      date: '2024-11-12'
    }
  ]);

  useEffect(() => {
    document.title = 'User Dashboard';

    const fetchUserData = async () => {
      console.log('Fetching user data...');
      try {
        const response = await fetch('/auth/dashboard/user', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/auth/error2';
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo"></div>
        <span className="title">CARE</span>
      </header>

      <div className="responsive">
        <div className="button active">Button 1</div>
        <div className="button inactive">Button 2</div>
        <div className="button inactive">Button 3</div>
      </div>

      <section className="section">
        <h2>Calendar</h2>
        <p>This is a draft of the calendar functionalities users will have. This will allow them to better see when the next drops will go live!</p>
      </section>

      <div className="calendar">
        <FullCalendar 
          plugins={[dayGridPlugin]} 
          initialView="dayGridMonth" 
          events={events} 
        />
      </div>

      <form action="/auth/logout" method="POST">
        <button type="submit" className="logout-btn">Logout</button>
      </form>
    </div>
  );
};

export default UserDash;
