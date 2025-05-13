import { useState } from 'react';

function ActivityCard({ activity, index, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);

  const handleSave = () => {
    onUpdate(index, editedActivity);
    setIsEditing(false);
  };

  const calculateDeviation = () => {
    if (!editedActivity.actualStart || !editedActivity.actualEnd) return 0;
    const plannedDuration = (new Date(`1970-01-01T${editedActivity.endTime}:00`) - new Date(`1970-01-01T${editedActivity.startTime}:00`)) / (1000 * 60);
    const actualDuration = (new Date(`1970-01-01T${editedActivity.actualEnd}:00`) - new Date(`1970-01-01T${editedActivity.actualStart}:00`)) / (1000 * 60);
    return actualDuration - plannedDuration;
  };

  return (
    <div className="activity-card">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedActivity.name}
            onChange={(e) => setEditedActivity({ ...editedActivity, name: e.target.value })}
          />
          <input
            type="time"
            value={editedActivity.startTime}
            onChange={(e) => setEditedActivity({ ...editedActivity, startTime: e.target.value })}
          />
          <input
            type="time"
            value={editedActivity.endTime}
            onChange={(e) => setEditedActivity({ ...editedActivity, endTime: e.target.value })}
          />
          <input
            type="time"
            value={editedActivity.actualStart || ''}
            onChange={(e) => setEditedActivity({ ...editedActivity, actualStart: e.target.value })}
          />
          <input
            type="time"
            value={editedActivity.actualEnd || ''}
            onChange={(e) => setEditedActivity({ ...editedActivity, actualEnd: e.target.value })}
          />
          <select
            value={editedActivity.category}
            onChange={(e) => setEditedActivity({ ...editedActivity, category: e.target.value })}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="card-content">
          <h4 className={editedActivity.category === 'Work' ? 'work' : 'personal'}>
            {editedActivity.name}
          </h4>
          <p><strong>Planned:</strong> {editedActivity.startTime} - {editedActivity.endTime}</p>
          <p><strong>Actual:</strong> {editedActivity.actualStart || 'N/A'} - {editedActivity.actualEnd || 'N/A'}</p>
          <p><strong>Deviation:</strong> {calculateDeviation()} min</p>
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default ActivityCard;