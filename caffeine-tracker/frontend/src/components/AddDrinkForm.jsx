import { useState } from 'react';

const AddDrinkForm = ({ onAddDrink, selectedDate }) => {
  const [name, setName] = useState('');
  const [caffeineMg, setCaffeineMg] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const amount = Number(caffeineMg);
    if (!trimmedName || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const drink = {
      name: trimmedName,
      caffeine_mg: amount,
    };

    if (selectedDate) {
      drink.timestamp = `${selectedDate}T12:00:00.000Z`;
    }

    setIsSubmitting(true);
    const added = await onAddDrink(drink, photo);
    setIsSubmitting(false);

    if (added) {
      setName('');
      setCaffeineMg('');
      setPhoto(null);
      event.target.reset();
    }
  };

  return (
    <form className="drink-form" onSubmit={handleSubmit}>
      {selectedDate && <p className="selected-date">Adding to <strong>{selectedDate}</strong></p>}
      <label>
        Drink
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Coffee"
          required
        />
      </label>
      <label>
        Caffeine (mg)
        <input
          type="number"
          value={caffeineMg}
          onChange={(event) => setCaffeineMg(event.target.value)}
          min="0.1"
          step="0.1"
          placeholder="e.g. 95"
          required
        />
      </label>
      <label className="photo-input">
        Photo <span>(optional)</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={(event) => setPhoto(event.target.files?.[0] || null)}
        />
      </label>
      <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Add drink'}</button>
    </form>
  );
};

export default AddDrinkForm;
