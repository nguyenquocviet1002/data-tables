import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import TabBar from './components/TabBar/Tabbar';
import View from './components/View/View';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={
          <div className='container-full'>
            <TabBar />
            <Outlet />
          </div>
        }>
          <Route path='/' element={<App />} />
          <Route path='/view' element={<View />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
