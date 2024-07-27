import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    username: '',
    email: '',
    password: '',
    role: 'user', // default role
  });

  const [verificationToken, setVerificationToken] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://riziki-backend-ft22.onrender.com/api/auth/register', formData);
      const { data } = response;
      if (data.message) {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Registration Error:', error);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://riziki-backend-ft22.onrender.com/api/auth/verifyemail', {
        token: verificationToken,
      });
      const { data } = response;
      if (data.success) {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Email Verification Error:', error);
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleRegister}>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>

      <br />
      <h3>Email Verification</h3>
      <form onSubmit={handleVerifyEmail}>
        <label>
          Verification Token:
          <input type="text" value={verificationToken} onChange={(e) => setVerificationToken(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Verify Email</button>
      </form>

      <br />
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateUser;
