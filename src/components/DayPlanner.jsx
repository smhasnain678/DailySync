import { useState, useEffect } from 'react';
import ActivityCard from './ActivityCard';

function DayPlanner({ day, activities, setActivities }) {
  const [newActivity, setNewActivity] = useState({
    name: '',
    startTime: getDefaultTime(), // Planned Start Time
    endTime: getDefaultTime(1),  // Planned End Time
    actualStart: '',             // Actual Start Time
    actualEnd: '',               // Actual End Time
    category: 'Work',
  });
  const [showSummary, setShowSummary] = useState(false);

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (newActivity.name && newActivity.startTime && newActivity.endTime) {
      const plannedStart = new Date(`1970-01-01T${newActivity.startTime}:00`);
      const plannedEnd = new Date(`1970-01-01T${newActivity.endTime}:00`);
      if (plannedEnd > plannedStart) {
        setActivities([...activities, { ...newActivity }]);
        setNewActivity({
          name: '',
          startTime: getDefaultTime(),
          endTime: getDefaultTime(1),
          actualStart: '',
          actualEnd: '',
          category: 'Work',
        });
      } else {
        alert('End time must be after start time.');
      }
    }
  };

  const handleUpdateActivity = (index, updatedActivity) => {
    const newActivities = [...activities];
    newActivities[index] = updatedActivity;
    setActivities(newActivities);
  };

  const calculateDeviation = (plannedStart, plannedEnd, actualStart, actualEnd) => {
    if (!actualStart || !actualEnd) return 0;
    const plannedDuration = (new Date(`1970-01-01T${plannedEnd}:00`) - new Date(`1970-01-01T${plannedStart}:00`)) / (1000 * 60);
    const actualDuration = (new Date(`1970-01-01T${actualEnd}:00`) - new Date(`1970-01-01T${actualStart}:00`)) / (1000 * 60);
    return actualDuration - plannedDuration;
  };

  const getStatus = (plannedStart, plannedEnd, actualStart, actualEnd) => {
    if (!actualStart || !actualEnd) return 'Not Completed';
    const plannedStartTime = new Date(`1970-01-01T${plannedStart}:00`).getTime();
    const actualStartTime = new Date(`1970-01-01T${actualStart}:00`).getTime();
    const diff = (actualStartTime - plannedStartTime) / (1000 * 60); // Difference in minutes
    if (diff === 0) return 'On Time';
    return diff < 0 ? 'Early' : 'Late';
  };

  const efficiency = activities.length > 0 ? (activities.filter(a => a.actualStart && a.actualEnd).length / activities.length) * 100 : 0;

  function getDefaultTime(hoursToAdd = 0) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const newHours = (now.getHours() + hoursToAdd) % 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes}`;
  }

  return (
    <div className="day-planner">
      <h2>{day}</h2>
      <form onSubmit={handleAddActivity} className="activity-form">
        <input
          type="text"
          placeholder="Activity name"
          value={newActivity.name}
          onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
        />
        <div className="time-inputs">
          <label>Planned Start:</label>
          <input
            type="time"
            value={newActivity.startTime}
            onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
          />
        </div>
        <div className="time-inputs">
          <label>Planned End:</label>
          <input
            type="time"
            value={newActivity.endTime}
            onChange={(e) => setNewActivity({ ...newActivity, endTime: e.target.value })}
          />
        </div>
        <div className="time-inputs">
          <label>Actual Start:</label>
          <input
            type="time"
            value={newActivity.actualStart}
            onChange={(e) => setNewActivity({ ...newActivity, actualStart: e.target.value })}
          />
        </div>
        <div className="time-inputs">
          <label>Actual End:</label>
          <input
            type="time"
            value={newActivity.actualEnd}
            onChange={(e) => setNewActivity({ ...newActivity, actualEnd: e.target.value })}
          />
        </div>
        <select
          value={newActivity.category}
          onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
        <button type="submit">Add Activity</button>
      </form>
      <button className="summary-btn" onClick={() => setShowSummary(!showSummary)}>
        {showSummary ? 'Hide Summary' : 'Show Daily Summary'}
      </button>
      <div className="activity-cards">
        {activities.map((activity, index) => (
          <ActivityCard
            key={index}
            activity={activity}
            index={index}
            onUpdate={handleUpdateActivity}
          />
        ))}
      </div>
      {showSummary && (
        <div className="daily-summary">
          <h3>Daily Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Planned Time</th>
                <th>Actual Time</th>
                <th>Deviation (min)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.name}</td>
                  <td>{`${activity.startTime} - ${activity.endTime}`}</td>
                  <td>{activity.actualStart && activity.actualEnd ? `${activity.actualStart} - ${activity.actualEnd}` : 'N/A'}</td>
                  <td>{calculateDeviation(activity.startTime, activity.endTime, activity.actualStart, activity.actualEnd)}</td>
                  <td>{getStatus(activity.startTime, activity.endTime, activity.actualStart, activity.actualEnd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="summary">
        <div className="efficiency">
          <h3>Daily Efficiency</h3>
          <div className="progress-bar">
            <div style={{ width: `${efficiency}%` }}></div>
          </div>
          <p>{efficiency.toFixed(0)}% of planned activities completed</p>
        </div>
        <div className="deviations">
          <h3>Time Deviations</h3>
          <ul>
            {activities.map((activity, index) => (
              activity.actualStart && activity.actualEnd && (
                <li key={index}>
                  {activity.name}: {calculateDeviation(activity.startTime, activity.endTime, activity.actualStart, activity.actualEnd)} min
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DayPlanner;