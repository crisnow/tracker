const FDA_CAFFEINE_GUIDANCE = 'https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much';

const getRecommendation = (todayTotal) => {
  if (todayTotal === 0) {
    return {
      title: 'A calm start',
      message: 'No caffeine is logged today. Add a drink when you have one to see a tailored daily recommendation.',
    };
  }

  if (todayTotal <= 300) {
    return {
      title: 'A sensible stopping point',
      message: `${todayTotal.toFixed(0)} mg is a moderate amount for most healthy adults. Consider making 300 mg your stopping point today—more caffeine, especially later in the day, may make sleep harder if you are sensitive to it.`,
    };
  }

  if (todayTotal < 400) {
    return {
      title: 'Consider switching to decaf',
      message: `You are at ${todayTotal.toFixed(0)} mg today. That is below the general 400 mg daily reference for most healthy adults, but you are past the 300 mg stopping point. Consider skipping more caffeine today, particularly close to bedtime.`,
    };
  }

  return {
    title: 'Time to pause caffeine today',
    message: `You have logged ${todayTotal.toFixed(0)} mg today, which meets or exceeds the general 400 mg daily reference for most healthy adults. Avoid additional caffeine today and use a lower personal limit if you notice unwanted effects.`,
  };
};

const CaffeineRecommendation = ({ todayTotal }) => {
  const recommendation = getRecommendation(todayTotal);

  return (
    <aside className="recommendation" aria-label="Caffeine recommendation">
      <div className="recommendation-icon" aria-hidden="true">☕</div>
      <div>
        <p className="eyebrow">Today&apos;s guidance</p>
        <h2>{recommendation.title}</h2>
        <p>{recommendation.message}</p>
        <a href={FDA_CAFFEINE_GUIDANCE} target="_blank" rel="noreferrer">About the 400 mg reference</a>
      </div>
    </aside>
  );
};

export default CaffeineRecommendation;
