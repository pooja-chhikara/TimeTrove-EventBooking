import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import {
  Box, Typography, Button, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import moment from 'moment';

export default function AdminDashboard() {
  const auth = getAuth();
  const db = getDatabase();
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const categories = ['Skillset', 'Musical', 'Tournament'];
  const timeSlots = Array.from({ length: 14 }, (_, i) => `${9 + i}:00`);

  // Fetch all users
  useEffect(() => {
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(Object.entries(data).map(([key, value]) => ({ id: key, email: value.email })));
      }
    });
  }, [db]);

  // Fetch all booked slots
  useEffect(() => {
    const bookingsRef = ref(db, 'users');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBookedSlots(data);
      }
    });
  }, [db]);

  // Handle user selection from dropdown
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  // Handle Booking or Cancellation
  const handleSlotClick = (time, category) => {
    if (!selectedUser) {
      setDialogMessage("Please select a user first.");
      setDialogOpen(true);
      return;
    }
    
    const userId = selectedUser.replace(/\./g, ','); // Firebase-safe ID
    const updatedSlots = { ...bookedSlots };
    const userBookings = updatedSlots[userId]?.bookedSlots || {};

    // Ensure userBookings has the required structure
    if (!userBookings[currentDate]) userBookings[currentDate] = {};
    if (!userBookings[currentDate][category]) userBookings[currentDate][category] = {};

    const isBookedBySelectedUser = userBookings[currentDate][category][time];
    const isBookedByOthers = Object.keys(bookedSlots).some(
      (user) => user !== userId && bookedSlots[user]?.bookedSlots?.[currentDate]?.[category]?.[time]
    );

    if (isBookedByOthers) {
      setDialogMessage('This slot is already booked by another user.');
      setDialogOpen(true);
      return;
    }

    if (isBookedBySelectedUser) {
      // Cancel slot
      delete userBookings[currentDate][category][time];
      set(ref(db, `users/${userId}/bookedSlots/${currentDate}/${category}/${time}`), null);
      setDialogMessage(`Slot ${time} for ${category} has been cancelled.`);
    } else {
      // Book slot
      userBookings[currentDate][category][time] = true;
      set(ref(db, `users/${userId}/bookedSlots/${currentDate}/${category}/${time}`), { bookedBy: userId });
      setDialogMessage(`Slot ${time} for ${category} has been booked.`);
    }

    updatedSlots[userId].bookedSlots = userBookings;
    setBookedSlots(updatedSlots);
    setDialogOpen(true);
  };

  // Get slot color based on booking status
  const getSlotColor = (category, time) => {
    if (!selectedUser || !bookedSlots) return 'white';
    const userId = selectedUser.replace(/\./g, ',');

    const isBookedBySelectedUser = bookedSlots[userId]?.bookedSlots?.[currentDate]?.[category]?.[time];
    const isBookedByOthers = Object.keys(bookedSlots).some(
      (user) => user !== userId && bookedSlots[user]?.bookedSlots?.[currentDate]?.[category]?.[time]
    );

    if (isBookedBySelectedUser) {
      return category === 'Skillset' ? 'blue' :
             category === 'Musical' ? 'green' :
             category === 'Tournament' ? 'orange' : 'white';
    }
    if (isBookedByOthers) return 'gray';
    return 'white';
  };

  return (
    <Box sx={{ padding: '10px', maxWidth: '1200px', margin: 'auto' }}>
      {/* Admin Dashboard Title */}
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        Admin Dashboard - Daily View
      </Typography>

      {/* User Selection Dropdown */}
      <Box sx={{ marginBottom: '10px', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: '14px' }}>Select User:</Typography>
        <Select
          value={selectedUser}
          onChange={handleUserChange}
          displayEmpty
          sx={{ minWidth: '200px', height: '35px', fontSize: '14px' }}
        >
          <MenuItem value="" disabled>Select a user</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>{user.email}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Date Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
        <Button size="small" onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'day').format('YYYY-MM-DD'))}>
          &lt; Previous
        </Button>
        <Typography
          variant="h6"
          sx={{ fontSize: '14px', cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
          onClick={() => setCurrentDate(moment().format('YYYY-MM-DD'))}
        >
          {moment(currentDate).format('ddd, MMM D')}
        </Typography>
        <Button size="small" onClick={() => setCurrentDate(moment(currentDate).add(1, 'day').format('YYYY-MM-DD'))}>
          Next &gt;
        </Button>
      </Box>

      {/* Daily Booking Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '6px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }}>Category</TableCell>
              {timeSlots.map((slot) => (
                <TableCell key={slot} align="center" sx={{ fontSize: '10px', padding: '3px' }}>{slot}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>{category}</TableCell>
                {timeSlots.map((slot) => (
                  <TableCell key={slot} align="center">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: getSlotColor(category, slot),
                        color: 'white',
                        fontSize: '12px',
                        padding: '2px',
                        minWidth: '50px',
                        margin:-1
                      }}
                      onClick={() => handleSlotClick(slot, category)}
                    >
                      {slot}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Notification Dialog */}
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
