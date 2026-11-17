const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDailyTotals = (drinks) => drinks.reduce((totals, drink) => {
  if (!drink.timestamp) return totals;

  const key = toDateKey(new Date(drink.timestamp));
  totals[key] = (totals[key] || 0) + drink.caffeine_mg;
  return totals;
}, {});

const formatDay = (date) => new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date);

const CaffeineChart = ({ totals }) => {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return { date, total: totals[toDateKey(date)] || 0 };
  });
  const maximum = Math.max(...days.map((day) => day.total), 1);

  return (
    <section className="panel chart-panel">
      <div className="section-heading">
        <div>
          <h2>Last 7 days</h2>
          <p className="section-description">Caffeine logged per day</p>
        </div>
      </div>
      <div className="bar-chart" aria-label="Caffeine totals for the last seven days">
        {days.map(({ date, total }) => (
          <div className="bar-column" key={toDateKey(date)}>
            <span className="bar-value">{total > 0 ? `${total.toFixed(0)} mg` : ''}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ height: `${Math.max((total / maximum) * 100, total ? 8 : 0)}%` }} />
            </div>
            <span>{formatDay(date)}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const CaffeineCalendar = ({ totals, onSelectDate }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstDay.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
  ];
  const monthName = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(today);
  const todayKey = toDateKey(today);

  return (
    <section className="panel calendar-panel">
      <div className="section-heading">
        <div>
          <h2>{monthName}</h2>
          <p className="section-description">Your caffeine calendar</p>
        </div>
      </div>
      <div className="weekday-labels" aria-hidden="true">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="calendar-grid">
        {cells.map((date, index) => {
          if (!date) return <div className="calendar-day blank" key={`blank-${index}`} />;

          const key = toDateKey(date);
          const total = totals[key] || 0;
          const className = `calendar-day${key === todayKey ? ' today' : ''}${total > 0 ? ' has-caffeine' : ''}`;
          return (
            <button
              aria-label={`Add a drink to ${key}${total > 0 ? `, ${total.toFixed(0)} mg logged` : ''}`}
              className={className}
              key={key}
              onClick={() => onSelectDate(key)}
              type="button"
            >
              <span>{date.getDate()}</span>
              {total > 0 && <b>{total.toFixed(0)} mg</b>}
            </button>
          );
        })}
      </div>
    </section>
  );
};

const CaffeineInsights = ({ drinks, onSelectDate }) => {
  const totals = getDailyTotals(drinks);

  return (
    <div className="insights-grid">
      <CaffeineChart totals={totals} />
      <CaffeineCalendar totals={totals} onSelectDate={onSelectDate} />
    </div>
  );
};

export default CaffeineInsights;
