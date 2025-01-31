import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import moment from 'moment';

export default function UserBookedSlots() {
  const db = getDatabase();
  const [bookedSlots, setBookedSlots] = useState({});
  const weekDays = Array.from({ length: 7 }, (_, i) => moment().startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD'));

  useEffect(() => {
    const bookingsRef = ref(db, 'bookedSlots');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setBookedSlots(data);
    });
  }, [db]);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4">Weekly Slots Overview</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              {weekDays.map(day => (
                <TableCell key={day}>{moment(day).format('ddd, MMM D')}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(bookedSlots).map((category) => (
              <TableRow key={category}>
                <TableCell component="th" scope="row">{category}</TableCell>
                {weekDays.map(day => (
                  <TableCell key={day}>
                    {bookedSlots[category] && bookedSlots[category][day]
                      ? bookedSlots[category][day].join(', ')
                      : 'No slots'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
