import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import EvanSweeper from './screens/EvanSweeper';  
import Home from './screens/Home';
import Layout from './layout';
import NotFound from './screens/notFound';

function RootApp() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App onAuthenticate={() => setAuthenticated(true)} />} />
        <Route element={<Layout />}>
          <Route 
            path="/EvanSweeper" 
            element={
              authenticated ? <EvanSweeper /> : <Navigate to="/" replace />
            } 
          />

          <Route 
            path="/Home" 
            element={
              authenticated ? <Home /> : <Navigate to="/" replace />
            } 
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
