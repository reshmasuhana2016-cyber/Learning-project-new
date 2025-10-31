import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={ <ProtectedRoute><Homepage /></ProtectedRoute>  } />
        <Route path="/signup" element={  <PublicRoute><SignUp /></PublicRoute>   } />
        <Route path="/login" element={ <PublicRoute> <Login /></PublicRoute>   } />
        <Route path="/homepage" element={ <ProtectedRoute><Homepage /></ProtectedRoute>  } />
      </Routes>
    </Router>
    
  );
}

export default App;
