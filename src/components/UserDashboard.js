import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, set, remove, onValue } from 'firebase/database';
import { createTheme,Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem } from '@mui/material';
import moment from 'moment';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; 


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.5),
  textAlign: 'center',
  border: '1',
  borderColor:"#ddd",
  padding:1,


 
}));

const StyledButton = styled(Button)(({ theme, booked, category }) => ({
  fontSize: '0.7rem',
  padding: '3px 6px',
  backgroundColor: booked ? (category ? category : 'gray') : 'white',
  color: booked ? 'white' : 'black',
  border: booked ? 'none' : '1px solid',
  borderColor: booked ? 'none' : 'blue',
  borderRadius: '4px',
  width: '100%',
  '&:hover': {
    backgroundColor: booked ? (category ? category : 'gray') : '#f0f0f0',
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
}));

export default function UserDashboard() {
  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;
  const navigate = useNavigate(); 
  const userId = user ? user.email : '';  
  const [currentDate, setCurrentDate] = useState(moment());
  const [bookedSlots, setBookedSlots] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const timeSlots = Array.from({ length: 14 }, (_, i) => `${9 + i}:00`);
  const categories = ['Skillset', 'Musical', 'Tournament'];
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const bookingsRef = ref(db, 'bookedSlots');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setBookedSlots(data);
    });
  }, [db]);
  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };
  const handleTodayClick = () => {
    setCurrentDate(moment().startOf('isoWeek')); // Reset to the start of this week
  };
  const handleLogout = () => {
    signOut(auth).then(() => {
      handleCloseUserMenu();
      navigate('/'); // Navigate to home or use '/user' based on your routing setup
    }).catch((error) => {
      console.error('Logout Failed', error);
    }); // or handle redirect with your routing logic
    
  };
  const categoryColors = {
    'All': 'default',
    'Skillset': 'primary',
    'Musical': 'success',
    'Tournament': 'warning'
  };
  const handleSlotClick = (date, category, time) => {
    if (bookedSlots[date] && bookedSlots[date][time] && bookedSlots[date][time].userId !== userId) {
      return; // Slot is booked by another user
    }

    const slotPath = `bookedSlots/${date}/${time}`;
    const slotInfo = bookedSlots[date]?.[time];
    
    if (slotInfo && slotInfo.userId === userId && slotInfo.category === category) {
      remove(ref(db, slotPath)); // Cancel booking
    } else if (!slotInfo) {
      set(ref(db, slotPath), { userId, category }); // Book slot
    }
  };

  const getSlotStyle = (date, time, category) => {
    const slotInfo = bookedSlots[date]?.[time];
    const isBooked = !!slotInfo;
    const isCurrentUser = isBooked && slotInfo.userId === userId;
    const categoryColors = { Skillset: 'blue', Musical: 'green', Tournament: 'orange' };

    if (isBooked && isCurrentUser && slotInfo.category === category) {
      return { backgroundColor: categoryColors[category], color: 'white' };
    } else if (isBooked) {
      return { backgroundColor: 'gray', color: 'white', cursor: 'not-allowed', opacity: 0.6 };
    }
    return { border: '1px solid blue', backgroundColor: 'white', color: 'black' };
  };

  return (
    <Box sx={{ padding: '20px' }}>
      
      <Typography variant="h4">User Dashboard</Typography>
    
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography
                    variant="body1"
                    sx={{ cursor: 'pointer' }}
                    onClick={handleUserMenu}
                >
                    {userId}
                </Typography>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseUserMenu}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Box>
    

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {['All', ...categories].map(category => (
          <Button
            key={category}
            color={categoryColors[category]}
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button onClick={() => setCurrentDate(currentDate.clone().subtract(1, 'week'))}>&lt; Previous Day</Button>
        <Typography variant="h6" onClick={handleTodayClick} sx={{ cursor: 'pointer', textDecoration: 'underline' ,color:"dodgerblue"}}>
          {currentDate.format('MMM D')} - {currentDate.clone().endOf('isoWeek').format('MMM D, YYYY')}
        </Typography>
        <Button onClick={() => setCurrentDate(currentDate.clone().add(1, 'week'))}>Next Day &gt;</Button>
      </Box>

      {selectedCategory === 'All' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell >Category</StyledTableCell>
                {timeSlots.map((slot) => (
                  <StyledTableCell  key={slot}>{slot}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category} >
                  <StyledTableCell>{category}</StyledTableCell>
                  {timeSlots.map((slot) => (
                    <StyledTableCell key={slot}
                   
                    style={getSlotStyle(currentDate.format('YYYY-MM-DD'), slot, category) } sx={{}}>
                      <StyledButton
                        style={{ width: '50%',color:'blue',border:'1px ',padding:5,margin:2 ,borderColor:"pink"}}
                        
                        categoryColor={getSlotStyle(currentDate.format('YYYY-MM-DD'), slot, category)}
                      disabled={bookedSlots[currentDate.format('YYYY-MM-DD')]?.[slot] && bookedSlots[currentDate.format('YYYY-MM-DD')]?.[slot].userId !== userId}
                        onClick={() => handleSlotClick(currentDate.format('YYYY-MM-DD'), category, slot)}
                        
                      >
                        {bookedSlots[currentDate.format('YYYY-MM-DD')]?.[slot] ? 'Booked' : slot}
                      </StyledButton>
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{  }}>
            <TableHead>
              <TableRow sx={{borderBlock:"yellow"}}>
                <StyledTableCell sx={{margin: '2px', width: '90%'}} >Day</StyledTableCell>
                {timeSlots.map((slot) => (
                  <StyledTableCell key={slot} align="center" sx={{}}>{slot}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 7 }, (_, i) => currentDate.clone().startOf('isoWeek').add(i, 'days')).map((day) => (
                <TableRow key={day.format('YYYY-MM-DD')}>
                  <StyledTableCell>{day.format('ddd, MMM D')}</StyledTableCell>
                  {timeSlots.map((slot) => (
                    <StyledTableCell key={slot} 
                    sx={{}}
                     align="center" style={getSlotStyle(day.format('YYYY-MM-DD'), slot, selectedCategory)}>
                      <StyledButton
                        style={{ width: '60%', height: '40%',font:"10" ,border:'none'}}
                        onClick={() => handleSlotClick(day.format('YYYY-MM-DD'), selectedCategory, slot)}
                        disabled={bookedSlots[day.format('YYYY-MM-DD')]?.[slot]?.userId && bookedSlots[day.format('YYYY-MM-DD')]?.[slot]?.userId !== userId || (bookedSlots[day.format('YYYY-MM-DD')]?.[slot] && bookedSlots[day.format('YYYY-MM-DD')]?.[slot].category !== selectedCategory)}
                      >
                        {bookedSlots[day.format('YYYY-MM-DD')]?.[slot] ? 'Booked' : slot}
                      </StyledButton>
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    
    </Box>
    
  );
}
