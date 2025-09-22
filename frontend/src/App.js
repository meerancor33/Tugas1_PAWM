import { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.location.href = process.env.PUBLIC_URL + '/pages/welcome.html';
  }, []);

  return null;
}

export default App;
