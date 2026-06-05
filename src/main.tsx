import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { installClientFriction } from './security'
import { AuthProvider } from './auth/AuthContext'
import { SiteContentProvider } from './content/SiteContentProvider'

installClientFriction()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </AuthProvider>
  </React.StrictMode>,
)
