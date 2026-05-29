import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import PresentationPage from './pages/PresentationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="present/:projectId" element={<PresentationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
