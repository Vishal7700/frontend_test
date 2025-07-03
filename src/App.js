import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';

const API = 'http://localhost:4000';

function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    wheels: '',
    typeId: '',
    vehicleId: '',
    dates: [null, null],
  });
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [submittedVehicles, setSubmittedVehicles] = useState([]);

  useEffect(() => {
    if (step === 2 && form.wheels) {
      axios.get(`${API}/vehicle-types?wheels=${form.wheels}`)
        .then(res => setTypes(res.data));
    }
    if (step === 3 && form.typeId) {
      axios.get(`${API}/vehicles?typeId=${form.typeId}`)
        .then(res => setVehicles(res.data));
    }
  }, [step, form.wheels, form.typeId]);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const submit = async () => {
    const [startDate, endDate] = form.dates;
    try {
      await axios.post(`${API}/bookings`, {
        firstName: form.firstName,
        lastName: form.lastName,
        vehicleId: parseInt(form.vehicleId),
        startDate,
        endDate,
      });
      alert('✅ Booking submitted successfully!');

      // Fetch all vehicles for the selected type to show in table
 // Fetch all bookings after successful submission
const response = await axios.get(`${API}/bookings`);
setSubmittedVehicles(response.data);


    } catch (err) {
      alert('❌ Booking failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const headerStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '2px solid #ddd',
};

const cellStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
};


  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        px: 2,
        py: 4,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          bgcolor: 'white',
          p: 4,
          boxShadow: 4,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold">
          Vehicle Booking Form
        </Typography>

        {step === 0 && (
          <>
            <Typography variant="h6">What is your name?</Typography>
            <TextField
              label="First Name"
              fullWidth
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, '&:hover': { backgroundColor: 'primary.dark' } }}
              onClick={next}
              disabled={!form.firstName || !form.lastName}
            >
              Next
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <Typography variant="h6">Number of Wheels</Typography>
            <RadioGroup
              value={form.wheels}
              onChange={(e) => setForm({ ...form, wheels: e.target.value })}
            >
              <FormControlLabel value="2" control={<Radio />} label="2" />
              <FormControlLabel value="4" control={<Radio />} label="4" />
            </RadioGroup>
            <Button
              variant="contained"
              fullWidth
              sx={{ '&:hover': { backgroundColor: 'primary.dark' } }}
              onClick={next}
              disabled={!form.wheels}
            >
              Next
            </Button>
            <Button variant="text" fullWidth onClick={back}>
              Back
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h6">Type of Vehicle</Typography>
            <RadioGroup
              value={form.typeId}
              onChange={(e) => setForm({ ...form, typeId: e.target.value })}
            >
              {types.map((t) => (
                <FormControlLabel
                  key={t.id}
                  value={t.id}
                  control={<Radio />}
                  label={t.name}
                />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              fullWidth
              sx={{ '&:hover': { backgroundColor: 'primary.dark' } }}
              onClick={next}
              disabled={!form.typeId}
            >
              Next
            </Button>
            <Button variant="text" fullWidth onClick={back}>
              Back
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="h6">Specific Model</Typography>
            <RadioGroup
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            >
              {vehicles.map((v) => (
                <FormControlLabel
                  key={v.id}
                  value={v.id}
                  control={<Radio />}
                  label={v.name}
                />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              fullWidth
              sx={{ '&:hover': { backgroundColor: 'primary.dark' } }}
              onClick={next}
              disabled={!form.vehicleId}
            >
              Next
            </Button>
            <Button variant="text" fullWidth onClick={back}>
              Back
            </Button>
          </>
        )}

        {step === 4 && (
          <>
            <Typography variant="h6">Select Booking Date Range</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                value={form.dates}
                onChange={(newValue) => setForm({ ...form, dates: newValue })}
                renderInput={(startProps, endProps) => (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField fullWidth {...startProps} />
                    <TextField fullWidth {...endProps} />
                  </Box>
                )}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, '&:hover': { backgroundColor: 'primary.dark' } }}
              onClick={submit}
              disabled={!form.dates[0] || !form.dates[1]}
            >
              Submit
            </Button>
            <Button variant="text" fullWidth onClick={back}>
              Back
            </Button>
          </>
        )}
      </Box>

      {/* Vehicle Table */}
{submittedVehicles.length > 0 && (
  <Box sx={{ width: '100%', maxWidth: 800, mt: 6 }}>
 <Typography variant="h6" gutterBottom align="center">
  All Bookings
</Typography>

    <Box
      sx={{
        overflowX: 'auto',
        borderRadius: 2,
        boxShadow: 2,
        border: '1px solid #ddd',
        backgroundColor: '#fff',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
            <th style={headerStyle}>ID</th>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Vehicle</th>
            <th style={headerStyle}>Start Date</th>
            <th style={headerStyle}>End Date</th>
          </tr>
        </thead>
        <tbody>
          {submittedVehicles.map((b, index) => (
            <tr
              key={b.id}
              style={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
              }}
            >
              <td style={cellStyle}>{b.id}</td>
              <td style={cellStyle}>{b.firstName} {b.lastName}</td>
              <td style={cellStyle}>{b.vehicle?.name || 'N/A'}</td>
              <td style={cellStyle}>{new Date(b.startDate).toLocaleDateString()}</td>
              <td style={cellStyle}>{new Date(b.endDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </Box>
)}

    </Box>
  );
}

export default App;
