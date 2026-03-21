import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import RaadhyamHomepage from './WelcomePages/WelcomePage'
import AboutUs from './WelcomePages/AboutUsPage'
import LoginPage from './Auth/Login'
import RegisterPage from './Auth/Register'
import ContactPage from './WelcomePages/Contect'
import MusicNotesPage from './WelcomePages/NotesPage'
import MainDashboardAdmin from './AdminDashboard/AdminMain'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<RaadhyamHomepage />} />
        <Route path="/About-Us" element={<AboutUs />} />
        <Route path="/Contact-Us" element={<ContactPage />} />


        <Route path="/dashboard/admin" element={<MainDashboardAdmin />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Notes" element={<MusicNotesPage />} />
        <Route path="/music-notes/:noteId" element={<MusicNotesPage />} />

        
      </Routes>
    </Router>
    </>

  )
}

export default App
