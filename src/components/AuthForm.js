import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { Box, Typography, Button, TextField, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import app from "../firebase";

export default function AuthForm({ userType }) {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const auth = getAuth();
    const database = getDatabase(app);
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        if (isSignup) {
          // Prevent admin signup in user panel
          if (userType === 'user' && email === 'admin@gmail.com') {
            setDialogMessage("You cannot sign up as admin from user panel.");
            setDialogOpen(true);
            return;
          }
  
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const userId = userCredential.user.uid;
  
          set(ref(database, 'users/' + userId), {
            email: email,
            bookedSlots: { tournament: {}, skillset: {}, musical: {} }
          });
  
          sessionStorage.setItem(`sessionStartTime_${userId}`, Date.now().toString());
          setDialogMessage('Signup successful!');
          setDialogOpen(true);
          setTimeout(() => navigate('/user/dashboard'), 2000);
  
        } else {
          // Restrict admin from logging into user panel
          if (userType === 'user' && email === 'admin@gmail.com') {
            setDialogMessage("Admin cannot log in as a user.");
            setDialogOpen(true);
            return;
          }
  
          // Restrict normal users from logging into admin panel
          if (userType === 'admin' && email !== 'admin@gmail.com') {
            setDialogMessage("Only admin can log in here.");
            setDialogOpen(true);
            return;
          }
  
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const userId = userCredential.user.uid;
  
          sessionStorage.setItem(`sessionStartTime_${userId}`, Date.now().toString());
          setDialogMessage('Login successful!');
          setDialogOpen(true);
  
          // Redirect to correct dashboard
          setTimeout(() => {
            navigate(userType === 'admin' ? '/admin/dashboard' : '/user/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        setDialogMessage(error.message);
        setDialogOpen(true);
      }
    };
  
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {userType === 'admin' ? 'Admin Login' : 'User ' + (isSignup ? 'Signup' : 'Login')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {isSignup ? 'Sign Up' : 'Log In'}
          </Button>
        </form>
        {userType !== 'admin' && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Switch checked={isSignup} onChange={() => setIsSignup(!isSignup)} />
            <Typography variant="body2">Switch to {isSignup ? 'Login' : 'Signup'}</Typography>
          </Box>
        )}
  
        {/* Success/Error Pop-up */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>{dialogMessage}</DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>OK</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  