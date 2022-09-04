import { render } from 'solid-js/web'
import { Show } from 'solid-js'
import { Router, Route, Routes } from "@solidjs/router";

import './styles/globalStyles.scss'
import './styles/styles.scss'
import './styles/slider.css'
import './styles/history.css'

import Auth from './components/Auth'
import Main from './components/Main'
import App from './components/App'
import Score from './components/Score'
import Account from './components/Account'

import SetupGlobal, { global, loading } from './globalInfo'
import Plan from './components/Plan';
import Success from './components/Success';
import Contact from './components/Contact';
import { WarningPopup } from './components/elements';
import Confirm from './components/Confirm';
import Forgot from './components/Forgot';

function Index() {
  return (
    <>
      <div className={"overlay"} id="overlay"></div>
      <WarningPopup />
      <Show when={loading() > 0}>
        <div style={{
          'z-index': '1000',
          display: 'flex',
          position: 'fixed',
          width: '100%',
          height: '100%',
          'justify-content': 'center',
          'align-items': 'center'
        }}>
          <div className="loader" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
            <svg className="circular-loader" viewBox="25 25 50 50" >
              <circle className="loader-path" style={{ stroke: 'var(--color-darker-blue)' }} cx="50" cy="50" r="20" fill="none" stroke="#70c542" stroke-width="4" />
            </svg>
          </div>
        </div>
      </Show>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/forgot" element={<Forgot />} />
        <Show when={global.logged}>
          <Route path="/" element={<Main />} />
          <Route path="plan" element={<Plan />} />
          <Route path="account" element={<Account />} />
          <Route path="contact" element={<Contact />} />
          <Route path="app" element={<App />} />
          <Route path="score" element={<Score />} />
          <Route path="success" element={<Success />} />
        </Show>
      </Routes>
    </>
  )
}

render(() => (
  <Router>
    <Show when={window.location.pathname !== '/confirm'}>
      <SetupGlobal />
    </Show>
    <Index />
  </Router>
), document.getElementById('root'));