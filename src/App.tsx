import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Generator from './pages/Generator';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/generator' element={<Generator/>} />
          <Route path='*' element={<Navigate to='/generator' />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
