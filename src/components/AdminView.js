import React, { useState } from 'react';
import { Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function AdminView() {
    const [timeSlots, setTimeSlots] = useState([]);

    const addTimeSlot = () => {
        // Mock function to add time slot
        const newTimeSlot = {
            id: timeSlots.length + 1,
            day: 'Friday',
            time: '01:00 PM',
            category: 'Cat 3',
            isBooked: false
        };
        setTimeSlots([...timeSlots, newTimeSlot]);
    };

    return (
        <div>
            <Button variant="contained" onClick={addTimeSlot}>Add Time Slot</Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Day</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeSlots.map((slot) => (
                            <TableRow key={slot.id}>
                                <TableCell>{slot.day}</TableCell>
                                <TableCell>{slot.time}</TableCell>
                                <TableCell>{slot.category}</TableCell>
                                <TableCell>{slot.isBooked ? 'Booked' : 'Available'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AdminView;
