import './StatsBar.css';

/**
 * StatsBar Component - Displays quick statistics about current movie selection
 */
const StatsBar = ({ movies }) => {
  if (!movies || movies.length === 0) return null;

  // Calculate stats
  const totalMovies = movies.length;
  const avgRating = (movies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / totalMovies).toFixed(1);
  const highlyRated = movies.filter(m => m.vote_average >= 7).length;
  const recentMovies = movies.filter(m => {
    const year = new Date(m.release_date).getFullYear();
    return year >= new Date().getFullYear() - 2;
  }).length;

  const stats = [
    { icon: '🎬', label: 'Total Movies', value: totalMovies },
    { icon: '⭐', label: 'Avg Rating', value: avgRating },
    { icon: '🏆', label: 'Highly Rated', value: highlyRated },
    { icon: '🆕', label: 'Recent', value: recentMovies }
  ];

  return (
    <div className="stats-bar">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;