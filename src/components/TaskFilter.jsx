export default function TaskFilter({
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
}) {
  const statuses = [
    "All",
    "Pending",
    "In Progress",
    "Completed",
  ];

  return (
    <div className="filter-section">
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-buttons">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={filter === status ? "active" : ""}
            onClick={() => setFilter(status)}
          >
            {status === "All" ? "All Tasks" : status}
          </button>
        ))}
      </div>

      <select
        className="sort-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
}
