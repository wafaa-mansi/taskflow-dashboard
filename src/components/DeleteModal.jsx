export default function DeleteModal({
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <h2 id="delete-title">Delete Task?</h2>

        <p>
          Are you sure you want to delete this task?
          This action cannot be undone.
        </p>

        <div className="form-actions">
          <button
            type="button"
            className="delete-btn"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
