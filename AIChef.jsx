import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import './AIChef.css';

function LoadingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span>Φτιάχνω τη συνταγή σας{dots} ⏳</span>;
}

export default function AIChef() {
  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) return alert("Παρακαλώ εισάγετε υλικά!");
    setLoading(true);
    setRecipe('');

    try {
      const backendUrl = "https://script.google.com/macros/s/AKfycby9f-vrXbSHaviCZ-DrlmDMWH5WqqotPWMGduXShiVFm8aqrP4o03xdJ_jC9fXzA2VlUg/exec";
      const url = `${backendUrl}?ingredients=${encodeURIComponent(ingredients)}&diet=${encodeURIComponent(diet)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Σφάλμα στο API");
      const text = await response.text();
      setRecipe(text);
    } catch (error) {
      setRecipe(`Σφάλμα: ${error.message}`);
    }

    setLoading(false);
  };

  const renderRecipe = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.endsWith(':')) {
        return <h3 key={idx}>{line}</h3>; 
      } else if (line.startsWith('- ')) {
        return <ul key={idx}><li>{line.slice(2)}</li></ul>;
      } else if (/^\d+\./.test(line)) {
        const stepNumber = line.match(/^\d+/)[0];
        const stepText = line.replace(/^\d+\.\s*/, '');
        return (
          <ol key={idx}>
            <li>
              <span className="step-badge">Step {stepNumber}</span>
              {stepText}
            </li>
          </ol>
        );
      } else {
        return <p key={idx}>{line}</p>;
      }
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to bottom, #fef3c7, #fee2e2, #fce7f3)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '700px', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c', marginBottom: '1rem' }}>AI Chef 👨‍🍳</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '1rem' }}>
          Πληκτρολογήστε τα υλικά σας και το AI θα σας φτιάξει μια συνταγή!
        </p>

        <textarea
          placeholder="Π.χ. ντομάτες, αυγά, λεμόνι... 🥚🍅🍋"
          rows={3}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem' }}
        />

        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem', border: '1px solid #ddd', fontSize: '1rem' }}
        >
          <option value="">Καμία διατροφική προτίμηση</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Χωρίς γλουτένη</option>
          <option value="low-fat">Χαμηλά λιπαρά</option>
        </select>

        <button
          onClick={generateRecipe}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e74c3c', color: '#fff', fontWeight: 'bold', cursor: 'pointer', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '1rem', border: 'none', marginBottom: '1rem' }}
        >
          {loading ? <LoadingDots /> : 'Δημιουργία Συνταγής'}
          {!loading && <Send style={{ marginLeft: '0.5rem', width: '1.25rem', height: '1.25rem' }} />}
        </button>

        {recipe && (
          <div className="recipe-box">
            <div className="recipe-text">{renderRecipe(recipe)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
