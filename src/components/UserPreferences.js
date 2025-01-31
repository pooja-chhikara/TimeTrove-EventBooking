import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

function UserPreferences() {
  const [category, setCategory] = React.useState('');

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          label="Category"
          onChange={handleChange}
        >
          <MenuItem value={'Cat 1'}>Cat 1</MenuItem>
          <MenuItem value={'Cat 2'}>Cat 2</MenuItem>
          <MenuItem value={'Cat 3'}>Cat 3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default UserPreferences;
