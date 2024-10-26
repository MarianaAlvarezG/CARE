import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import careLogo from '../views/images/CARE.png';


const Registration = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    idnumber: '',
    email: '',
    password: '',
    phone: '',
    studentIDFile: null
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'studentIDFile') {
      setFormData({ ...formData, studentIDFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: data
      });
      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        navigate('/auth/dashboard/user');
      }
    } catch (err) {
      console.error('Error:', err.message);
      alert('Registration failed.');
    }
  };

  return (
    <div className="container">
      <img src={careLogo} alt="CARE Logo" className="top-left-img" />
      <div className="heading">Welcome Onboard!</div>
      <form onSubmit={handleSubmit} id="registration-form">
        <div className="column-left">
          <input
            type="text"
            name="fullname"
            placeholder="Enter your Full Name"
            value={formData.fullname}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="idnumber"
            placeholder="Enter your Student ID"
            value={formData.idnumber}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your Student Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="column-right">
          <div className="subheading">Please upload a picture of your Student ID!</div>
          <div className="description">This will be used to verify your identity when you pick up your orders</div>
          <div className="upload-section">
            <label htmlFor="file-upload">Upload File</label>
            <input
              type="file"
              id="file-upload"
              name="idfile"
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Register</button>
          <div className="toggle-link">
            <a href="/auth/account">Already have an account? Go back to login!</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registration;
