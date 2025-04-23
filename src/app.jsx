import Counter from './components/Counter';
import MovieList from './components/MovieList';

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Testapplikation med Counter och MovieList</h1>
      <Counter />
      <hr style={{ margin: '2rem 0' }} />
      <MovieList />
    </div>
  );
};

export default App;

