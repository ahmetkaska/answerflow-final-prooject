import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const AdminUserUpdate = () => {
    const { id } = useParams(); // URL'den ID'yi al

    const [userData, setUserData] = useState({
        id: id, // ID'yi state içinde başlangıçta set et
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const updateUser = async () => {
        if (!userData.id) {
            toast.error("Kullanıcı ID'si bulunamadı!");
            return;
        }

        try {
            const response = await axios.put(`/api/admin/updateUser/${userData.id}`, userData);
            console.log(response.data);
            toast.success("Kullanıcı başarıyla güncellendi!");
        } catch (error) {
            console.error(error.response.data);
            toast.error("Kullanıcı güncellenirken bir hata oluştu!");
        }
    };

    return (

        <> 
        <Navbar/>
        <Box sx={{width: 400, margin: 'auto', padding: 3, border: '1px solid #ccc', borderRadius: 5 , marginTop: 10}}>
            <h2>Admin Kullanıcı Bilgilerini Güncelle</h2>
            <TextField
                fullWidth
                label="Adı"
                name="name"
                value={userData.name}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Şifre"
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Rol</InputLabel>
                <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                >
                    <MenuItem value="user">user</MenuItem>
                    <MenuItem value="admin">admin</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" onClick={updateUser} sx={{ mt: 2 }}>Güncelle</Button>
        </Box>

        </>

    );
};

export default AdminUserUpdate;
