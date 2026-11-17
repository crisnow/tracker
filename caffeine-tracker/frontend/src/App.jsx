import { useEffect, useState } from 'react';
import './App.css';
import api from './api';
import AddDrinkForm from './components/AddDrinkForm';
import CaffeineInsights from './components/CaffeineInsights';
import CaffeineRecommendation from './components/CaffeineRecommendation';
import DrinkList from './components/DrinkList';

const emptySummary = { today_total: 0, week_total: 0, avg_daily: 0 };
const getTracker = () => Promise.all([api.get('/drinks'), api.get('/summary')]);

const App = () => {
  const [drinks, setDrinks] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const refreshTracker = async () => {
    setStatus('loading');
    setError('');

    try {
      const [drinksResponse, summaryResponse] = await getTracker();
      setDrinks(drinksResponse.data.drinks);
      setSummary(summaryResponse.data);
      setStatus('ready');
      return true;
    } catch {
      setError('Could not connect to the tracker. Make sure the backend is running on port 8000.');
      setStatus('error');
      return false;
    }
  };

  useEffect(() => {
    const loadInitialTracker = async () => {
      try {
        const [drinksResponse, summaryResponse] = await getTracker();
        setDrinks(drinksResponse.data.drinks);
        setSummary(summaryResponse.data);
        setStatus('ready');
      } catch {
        setError('Could not connect to the tracker. Make sure the backend is running on port 8000.');
        setStatus('error');
      }
    };

    loadInitialTracker();
  }, []);

  const addDrink = async (drink, photo) => {
    setError('');

    try {
      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        const uploadResponse = await api.post('/uploads', formData);
        drink.photo_url = uploadResponse.data.url;
      }

      await api.post('/drinks', drink);
      return refreshTracker();
    } catch {
      setError('The drink could not be saved. Please try again.');
      return false;
    }
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    document.getElementById('drink-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="app-shell">
      <header>
        <p className="eyebrow">Daily caffeine tracker</p>
        <h1>Know what&apos;s keeping you going.</h1>
        <p className="intro">Log a drink and keep an eye on your caffeine intake.</p>
      </header>
      <main>
        {error && <p className="error-message" role="alert">{error}</p>}

        <section className="summary-grid" aria-label="Caffeine summary">
          <article>
            <span>Today</span>
            <strong>{summary.today_total.toFixed(0)} <small>mg</small></strong>
          </article>
          <article>
            <span>Last 7 days</span>
            <strong>{summary.week_total.toFixed(0)} <small>mg</small></strong>
          </article>
          <article>
            <span>Daily average</span>
            <strong>{summary.avg_daily.toFixed(0)} <small>mg</small></strong>
          </article>
        </section>

        <CaffeineRecommendation todayTotal={summary.today_total} />

        {status !== 'loading' && <CaffeineInsights drinks={drinks} onSelectDate={selectDate} />}

        <section className="panel" id="drink-form">
          <h2>Log a drink</h2>
          <AddDrinkForm onAddDrink={addDrink} selectedDate={selectedDate} />
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Recent drinks</h2>
            <button className="secondary-button" type="button" onClick={refreshTracker}>Refresh</button>
          </div>
          {status === 'loading' ? <p className="empty-state">Loading tracker…</p> : <DrinkList drinks={drinks} />}
        </section>
      </main>
    </div>
  );
};

export default App;
