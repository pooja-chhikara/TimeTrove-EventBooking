import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Button, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import app from "../firebase";
import "../App.css";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AuthForm from "./AuthForm";

function Home() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [navigateTo, setNavigateTo] = useState("");

  useEffect(() => {
    // Listen for user authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleNavigation = (path) => {
    if (user) {
      // Check if the user is an admin and trying to access the user dashboard or vice versa
      if ((user.email.includes("admin") && path === '/user') || (!user.email.includes("admin") && path === '/admin')) {
        alert("Access restricted: Admins cannot log in as users and vice versa.");
        return;
      }
      
      setNavigateTo(path);
      setDialogOpen(true); // Show confirmation pop-up
    } else {
      navigate(path); // Direct navigation if not logged in
    }
  };

  const confirmNavigation = () => {
    if (user) {
      signOut(auth).then(() => {
        setUser(null);
        navigate(navigateTo);
      });
    } else {
      navigate(navigateTo);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* App Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TimeTrove - Event Booking
          </Typography>

          {/* Centered Dashboard Title */}
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: '' }}>
            {user ? (user.email.includes("admin") ? "Admin Dashboard" : "User Dashboard") : ""}
          </Typography>

          {/* Navigation to User/Admin with Confirmation */}
          <Button color="inherit" onClick={() => handleNavigation('/user')}>User</Button>
          <Button color="inherit" onClick={() => handleNavigation('/admin')}>Admin</Button>
        </Toolbar>
      </AppBar>

      {/* Main Container for Routing */}
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={user ? (
            user.email.includes("admin") ? <AdminDashboard /> : <UserDashboard />
          ) : (
            <AuthForm />
          )} />
          <Route path="/user" element={<AuthForm userType="user" />} />
          <Route path="/admin" element={<AuthForm userType="admin" />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Container>

      {/* Confirmation Dialog for Navigation */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          {`Are you sure you want to switch to ${navigateTo === "/user" ? "User" : "Admin"}? You will be logged out from the current session.`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmNavigation} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;
