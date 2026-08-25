function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      className="quick-action"
      onClick={onClick}
    >
      <div className="quick-action-icon">
        {icon}
      </div>

      <div className="quick-action-content">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </button>
  );
}

export default QuickAction;