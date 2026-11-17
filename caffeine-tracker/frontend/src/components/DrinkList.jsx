const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
};

const DrinkList = ({ drinks }) => {
  if (drinks.length === 0) {
    return <p className="empty-state">No drinks logged yet.</p>;
  }

  return (
    <ul className="drink-list">
      {[...drinks].reverse().map((drink, index) => (
        <li key={`${drink.name}-${drink.timestamp}-${index}`}>
          <div className="drink-details">
            {drink.photo_url && <img alt={`Photo of ${drink.name}`} className="drink-photo" src={`${api.defaults.baseURL}${drink.photo_url}`} />}
            <div className="drink-meta">
              <strong>{drink.name}</strong>
              <span>{formatTimestamp(drink.timestamp)}</span>
            </div>
          </div>
          <b>{drink.caffeine_mg} mg</b>
        </li>
      ))}
    </ul>
  );
};

export default DrinkList;
import api from '../api';

