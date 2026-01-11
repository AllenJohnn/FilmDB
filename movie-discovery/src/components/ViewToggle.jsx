import './ViewToggle.css';

/**
 * ViewToggle Component - Toggle between grid and compact list view
 */
const ViewToggle = ({ view, onViewChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`}
        onClick={() => onViewChange('grid')}
        title="Grid View"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="2" width="7" height="7" rx="1"/>
          <rect x="11" y="2" width="7" height="7" rx="1"/>
          <rect x="2" y="11" width="7" height="7" rx="1"/>
          <rect x="11" y="11" width="7" height="7" rx="1"/>
        </svg>
        <span>Grid</span>
      </button>
      <button
        className={`view-toggle-btn ${view === 'compact' ? 'active' : ''}`}
        onClick={() => onViewChange('compact')}
        title="Compact View"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="3" width="16" height="3" rx="1"/>
          <rect x="2" y="8" width="16" height="3" rx="1"/>
          <rect x="2" y="13" width="16" height="3" rx="1"/>
        </svg>
        <span>Compact</span>
      </button>
    </div>
  );
};

export default ViewToggle;