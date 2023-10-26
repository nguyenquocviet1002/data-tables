import React from 'react';
import './index.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import TabBar from './components/TabBar/TabBar';
import View from './components/View/View';
import Tables from './components/Tables/Tables';

function App() {
  return (
    <BrowserRouter basename="cp/tuyen-dung">
      <Routes>
        <Route
          element={
            <div className="container-full">
              <TabBar />
              <Outlet />
            </div>
          }
        >
          <Route path="/" element={<Tables />} />
          <Route path="/view" element={<View />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
