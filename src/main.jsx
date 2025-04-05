import React, { Fragment, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './layouts/App'
import './index.scss'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouterData } from './commondata/routingdata';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';
import Auth from './layouts/auth/auth';
import Authlogin from './layouts/auth/authlogin';
import { PermissionsProvider } from './commondata/PermissionContext';
import ResetEmail from './layouts/auth/resetEmail';
import ChangePassword from './layouts/auth/changePassword';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <PermissionsProvider>
      <BrowserRouter>
        <Provider store={store}>
          <Routes >
            <Route path={`${import.meta.env.BASE_URL}`} element={<Auth />} >
              <Route index element={<Authlogin />} />
              <Route path={`${import.meta.env.BASE_URL}reset-password`} element={<ResetEmail />} />
              <Route path={`${import.meta.env.BASE_URL}change-password`} element={<ChangePassword />} />
              <Route path={`${import.meta.env.BASE_URL}auth/authlogin`} element={<Authlogin />} />
            </Route>
            {RouterData.map((idx) => (
              <Route path={`${import.meta.env.BASE_URL}`} element={<App />} key={Math.random()}>
                <Route path={idx.path} element={idx.element} />
              </Route>
            ))};
          </Routes>
          <Toaster />
        </Provider>
      </BrowserRouter>
    </PermissionsProvider>
  </>
);
