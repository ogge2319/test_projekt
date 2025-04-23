import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Du har klickat {count} gånger</p>
      <button onClick={() => setCount(count + 1)}>Öka</button>
    </div>
  );
};

export default Counter;
