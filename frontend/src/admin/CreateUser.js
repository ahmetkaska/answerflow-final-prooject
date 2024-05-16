import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Navbar';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const CreateUser = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, actions) => {
      setLoading(true);
      try {
        const response = await axios.post('/api/user/create', values);
        toast.success('User created successfully');
        actions.resetForm();
      } catch (error) {
        console.error('Error creating user:', error);
        toast.error('Failed to create user');
      } finally {
        setLoading(false);
      }
    },
  });
  

  return (
    <> 
    
   
    <Box sx={{ bgcolor: 'white', padding: '20px 200px' }}>
        
      <Typography variant='h5' sx={{ pb: 4 }}>
        Create User
      </Typography>
      <Box component='form' noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <TextField
          sx={{ mb: 3 }}
          fullWidth
          id='name'
          label='Name'
          name='name'
          InputLabelProps={{
            shrink: true,
          }}
          placeholder='Name'
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          sx={{ mb: 3 }}
          fullWidth
          id='email'
          label='Email Address'
          name='email'
          InputLabelProps={{
            shrink: true,
          }}
          placeholder='Email Address'
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <TextField
          sx={{ mb: 3 }}
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
          InputLabelProps={{
            shrink: true,
          }}
          placeholder='Password'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, p: 1, mb: 2, borderRadius: '25px' }}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </Box>
    </Box>
    </>
  );
};

export default CreateUser;
