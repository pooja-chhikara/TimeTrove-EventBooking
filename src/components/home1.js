import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Button, Container, TextField, Box, Switch } from '@mui/material';
import { getDatabase, ref, set } from 'firebase/database';
import app from "../firebase"
import  "../App.css"
import CalendarView from './CalendarView';
import UserDashboard from "./UserDashboard"
import AdminDashboard from './AdminDashboard';
function Home() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              TimeTrove - Event Booking
            </Typography>
            <Button color="inherit" component={Link} to="/user">User</Button>
            <Button color="inherit" component={Link} to="/admin">Admin</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/user" element={<AuthForm userType="user" />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

function AuthForm({ userType }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const database = getDatabase(app)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      // Initialize user data in Firebase Realtime Database
      set(ref(database, 'users/' + userId), {
        email: email,
        bookedSlots: {
          tournament: {},
          skillset: {},
          musical: {}
        }
      });

        alert('Signup successful!');
        navigate('/user/dashboard');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('User login successful!');
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        User {isSignup ? 'Signup' : 'Login'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          {isSignup ? 'Sign Up' : 'Log In'}
        </Button>
      </form>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Switch checked={isSignup} onChange={() => setIsSignup(!isSignup)} />
        <Typography variant="body2">Switch to {isSignup ? 'Login' : 'Signup'}</Typography>
      </Box>
    </Box>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Log In
        </Button>
      </form>
    </Box>
  );
}




export default Home;
