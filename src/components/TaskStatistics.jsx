export default function TaskStatistics({ stats }) {
  return (
    <div className="statistics-grid">
      <div className="stat-card">
        <p>Total Tasks</p>
        <h2>{stats.total}</h2>
      </div>

      <div className="stat-card">
        <p>Pending</p>
        <h2>{stats.pending}</h2>
      </div>

      <div className="stat-card">
        <p>In Progress</p>
        <h2>{stats.inProgress}</h2>
      </div>

      <div className="stat-card">
        <p>Completed</p>
        <h2>{stats.completed}</h2>
      </div>
    </div>
  );
}
