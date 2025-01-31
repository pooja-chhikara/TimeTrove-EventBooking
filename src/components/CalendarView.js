import React, { useState } from 'react';
import { Box, FormControl, MenuItem, Select, Button, Typography, ButtonGroup, styled, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import moment from "moment";

const StyledButton = styled(Button)(({ theme, iscurrent, isselected }) => ({
  borderColor: "#ccc",
  height: '56px',  // Ensure the button is of a consistent height with the dropdown
  backgroundColor: iscurrent ? 'blue' : isselected ? 'green' : 'white',
  color: iscurrent || isselected ? 'white' : 'black',
  '&:hover': {
    backgroundColor: iscurrent ? 'darkblue' : isselected ? 'darkgreen' : theme.palette.grey[300],
  },
}));

const StyledFormControl = styled(FormControl)({
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    right: '-13px' // Adjust this value to center the dropdown arrow as needed
  }
});

function CalendarView() {
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [selectedDay, setSelectedDay] = useState(null);
    const [bookedSlots, setBookedSlots] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const startWeek = currentWeek.clone().startOf('isoWeek');
    const endWeek = startWeek.clone().endOf('isoWeek');
    const daysArray = [];
    let day = startWeek.clone().subtract(1, 'day');

    while (day.isBefore(endWeek, 'day')) {
        daysArray.push(day.add(1, 'day').clone());
    }

    const previousWeek = () => {
        setCurrentWeek(prev => prev.clone().subtract(1, 'week'));
    };

    const nextWeek = () => {
        setCurrentWeek(prev => prev.clone().add(1, 'week'));
    };

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}:00`);

    const bookSlot = (day, slot) => {
        const formattedDay = day.format('YYYY-MM-DD');
        const updatedSlots = {...bookedSlots, [formattedDay]: [...(bookedSlots[formattedDay] || []), slot]};
        setBookedSlots(updatedSlots);
        setSelectedDay(formattedDay);
    };

    const handleSlotClick = (day, slot) => {
        setSelectedSlot({ day, slot });
        setOpenDialog(true);
    };

    const cancelBooking = () => {
        const formattedDay = selectedSlot.day.format('YYYY-MM-DD');
        const updatedSlots = {...bookedSlots, [formattedDay]: bookedSlots[formattedDay].filter(s => s !== selectedSlot.slot)};
        setBookedSlots(updatedSlots);
        setOpenDialog(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Button onClick={previousWeek}>&laquo; Prev Week</Button>
                <Typography variant="h6">{`${startWeek.format('MMM DD')} - ${endWeek.format('MMM DD, YYYY')}`}</Typography>
                <Button onClick={nextWeek}>Next Week &raquo;</Button>
            </Box>
            <ButtonGroup>
                {daysArray.map((day, index) => (
                    <Box key={index} sx={{ textAlign: 'center', marginBottom: '10px'}}>
                        <ButtonGroup color="primary" value={selectedDay} exclusive aria-label="Platform">
                            <StyledButton
                                iscurrent={day.isSame(moment(), 'day')}
                                isselected={day.format('YYYY-MM-DD') === selectedDay}
                                onClick={() => setSelectedDay(day.format('YYYY-MM-DD'))}
                            >
                                {day.format('ddd DD')}
                            </StyledButton>
                        
                        <StyledFormControl>
                            <Select
                                value=""
                                onChange={(e) => bookSlot(day, e.target.value)}
                                sx={{width:'20%',height:'100%',alignItems:"right"}}
                                IconComponent={ArrowDropDownIcon}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {timeSlots.map((slot, slotIndex) => (
                                    <MenuItem key={slotIndex} value={slot} disabled={bookedSlots[day.format('YYYY-MM-DD')]?.includes(slot)}>
                                        {slot}
                                    </MenuItem>
                                ))}
                            </Select>
                        </StyledFormControl>
                        </ButtonGroup>
                        {bookedSlots[day.format('YYYY-MM-DD')]?.map((slot, slotIndex) => (
                            <Button key={slotIndex} 
                            sx={{ mt: 1, background: '#e0e0e0', padding: '2px' ,width:'80%',height:"35%",left:-8,fontSize:10,border:1,borderWidth:1}} onClick={() => handleSlotClick(day, slot)}>
                                Booked: {slot}
                            </Button>
                        ))}
                    </Box>
                ))}
            </ButtonGroup>
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

export default CalendarView;
