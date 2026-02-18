import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './main.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import User from './pages/User';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
