import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { PageProvider, PageContext } from './contexts/PageContext.jsx';
import LoadingOverlay from './pages/LoadingOverlay.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageProvider>
        <AuthProvider>
          <PageContext.Consumer>
            {({ globalLoading }) => <>{globalLoading && <LoadingOverlay />}<App /></>}
          </PageContext.Consumer>
        </AuthProvider>
      </PageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
