import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import moment from 'moment';

export default function UserDashboard() {
  const [currentWeek, setCurrentWeek] = useState(moment());
  const [bookedSlots, setBookedSlots] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const bookingsRef = ref(db, `users/${userId}/bookedSlots`);
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      setBookedSlots(data || {});
    });
  }, [db, auth]);

  const startWeek = currentWeek.clone().startOf('isoWeek');
  const endWeek = startWeek.clone().endOf('isoWeek');
  const daysArray = [];
  let day = startWeek.clone().subtract(1, 'day');

  while (day.isBefore(endWeek, 'day')) {
    daysArray.push(day.add(1, 'day').clone());
  }

  const previousWeek = () => {
    setCurrentWeek((prev) => prev.clone().subtract(1, 'week'));
  };

  const nextWeek = () => {
    setCurrentWeek((prev) => prev.clone().add(1, 'week'));
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}:00`);

  const bookSlot = (day, slot) => {
    const user = auth.currentUser;
    if (!user) return;

    const formattedDay = day.format('YYYY-MM-DD');
    const userId = user.uid;

    const updatedSlots = { ...bookedSlots, [formattedDay]: [...(bookedSlots[formattedDay] || []), slot] };
    setBookedSlots(updatedSlots);
    set(ref(db, `users/${userId}/bookedSlots`), updatedSlots);
  };

  const handleSlotClick = (day, slot) => {
    setSelectedSlot({ day, slot });
    setOpenDialog(true);
  };

  const cancelBooking = () => {
    const user = auth.currentUser;
    if (!user) return;

    const formattedDay = selectedSlot.day.format('YYYY-MM-DD');
    const userId = user.uid;

    const updatedSlots = { ...bookedSlots, [formattedDay]: bookedSlots[formattedDay].filter((s) => s !== selectedSlot.slot) };
    setBookedSlots(updatedSlots);
    set(ref(db, `users/${userId}/bookedSlots`), updatedSlots);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Button onClick={previousWeek}>&laquo; Prev Week</Button>
        <Typography variant="h6">{`${startWeek.format('MMM DD')} - ${endWeek.format('MMM DD, YYYY')}`}</Typography>
        <Button onClick={nextWeek}>Next Week &raquo;</Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {daysArray.map((day, index) => (
          <Box key={index} sx={{ width: '14%', textAlign: 'center', marginBottom: '10px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: day.isSame(moment(), 'day') ? 'bold' : 'normal' }}>
              {day.format('ddd DD')}
            </Typography>
            {timeSlots.map((slot, slotIndex) => (
              <Button
                key={slotIndex}
                variant={bookedSlots[day.format('YYYY-MM-DD')]?.includes(slot) ? 'contained' : 'outlined'}
                color={bookedSlots[day.format('YYYY-MM-DD')]?.includes(slot) ? 'primary' : 'default'}
                onClick={() => handleSlotClick(day, slot)}
                sx={{ margin: '2px', width: '90%' }}
              >
                {slot}
              </Button>
            ))}
          </Box>
        ))}
      </Box>
      {openDialog && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Cancel Booking</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You have booked {selectedSlot.slot} on {selectedSlot.day.format('ddd, MMM DD')}. Would you like to cancel this booking?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelBooking}>Cancel Booking</Button>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
