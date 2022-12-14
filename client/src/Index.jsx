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
import Home from './components/Home';
import Terms from './components/Terms';

import data from './data/data.json'
import Demo from './components/Demo';

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
        <Route path="auth" element={<Auth />} />
        <Route path="confirm" element={<Confirm />} />
        <Route path="forgot" element={<Forgot />} />
        <Route path="home" element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="terms" element={<Terms />} />
        <Route path="demo" element={<Demo />} />
        <Show when={global.logged}>
          <Route path="/" element={<Main />} />
          <Route path="plan" element={<Plan />} />
          <Route path="account" element={<Account />} />
          <Route path="app" element={<App />} />
          <Route path="score" element={<Score data={Array.from(data)} />} />
          <Route path="success" element={<Success />} />
        </Show>
      </Routes>
    </>
  )
}

const notLoad = ['/confirm', '/home', '/demo']
const pages = ['/auth', '/confirm', '/forgot', '/home', '/', '/plan', '/account', '/contact', '/app', '/score', '/success', '/terms', '/demo']

if (window.origin.includes('qcmed') && !window.origin.includes('www')) {
  window.location.href = 'https://www.qcmed.fr' + window.location.pathname
} else {
  if (!pages.includes(window.location.pathname)) {
    window.location.href = 'https://www.qcmed.fr/home'
  } else {
    render(() => (
      <Router>
        <Show when={!notLoad.includes(window.location.pathname)}>
          <SetupGlobal data={Array.from(data)} />
        </Show>
        <Index />
      </Router>
    ), document.getElementById('root'));
  }
}