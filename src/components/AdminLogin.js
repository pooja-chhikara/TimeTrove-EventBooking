import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Box, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Admin Credentials
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "123456";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setDialogMessage("Access Denied! Only Admin can log in.");
      setDialogOpen(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("adminSession", Date.now().toString());
      setDialogMessage("Admin login successful!");
      setDialogOpen(true);
      setTimeout(() => {
        setDialogOpen(false);
        navigate("/admin/dashboard");
      }, 2000);
    } catch (error) {
      setDialogMessage(error.message);
      setDialogOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Admin Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Admin Email"
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

      {/* Pop-up Message */}
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
