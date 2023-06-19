import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { GamePage } from './pages/Game';
import 'src/styles/main.css';

const BASE_ROUTE = '/crawlg';
const router = createBrowserRouter([{ path: `${BASE_ROUTE}/`, element: <GamePage /> }]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
        <RouterProvider router={router} />
    // </React.StrictMode>
);
