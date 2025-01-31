import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function CalendarView() {
    const [selectedSlot, setSelectedSlot] = useState({});
    const hours = Array.from({length: 24}, (_, i) => `${i}:00 - ${i+1}:00`); // Generates slots from "00:00 - 01:00" to "23:00 - 24:00"

    const handleSlotChange = (event, day) => {
        setSelectedSlot({ ...selectedSlot, [day]: event.target.value });
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="weekly calendar">
                <TableHead>
                    <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Time Slots</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <TableRow key={day}>
                            <TableCell component="th" scope="row">{day}</TableCell>
                            <TableCell>
                                <FormControl fullWidth>
                                    <InputLabel id={`${day}-label`}>Time Slot</InputLabel>
                                    <Select
                                        labelId={`${day}-label`}
                                        id={`${day}-select`}
                                        value={selectedSlot[day] || ''}
                                        label="Time Slot"
                                        onChange={(e) => handleSlotChange(e, day)}
                                    >
                                        {hours.map((slot, index) => (
                                            <MenuItem key={index} value={slot}>{slot}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CalendarView;
