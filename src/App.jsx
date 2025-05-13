import { useState } from 'react';
import './App.css';
import DayPlanner from './components/DayPlanner';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function App() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [weeklyActivities, setWeeklyActivities] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  return (
    <div className="app-container">
      <h1>DailySync Organizer</h1>
      <p className="slogan">Plan, Track, and Master Your Day!</p>
      <div className="day-nav">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className={selectedDay === day ? 'active' : ''}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </button>
        ))}
      </div>
      <DayPlanner
        day={selectedDay}
        activities={weeklyActivities[selectedDay]}
        setActivities={(newActivities) =>
          setWeeklyActivities({ ...weeklyActivities, [selectedDay]: newActivities })
        }
      />
    </div>
  );
}

export default App;