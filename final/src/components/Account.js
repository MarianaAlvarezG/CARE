import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import careLogo from '../views/images/CARE.png';


const Account = () => {
  const navigate = useNavigate();

  const setUserType = async (type) => {
    sessionStorage.setItem('userType', type);

    try {
      const response = await fetch('/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType: type }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User type set successfully:', data);
        navigate('/auth/login');
      } else {
        alert('Failed to set user type.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const redirectToRegister = () => {
    navigate('/auth/register');
  };

  return (
    <div className="main-container">
  <img src={careLogo} alt="CARE Logo" className="care-logo" />
      <span className="returning-user">Returning user?</span>
      <button className="rectangle-button" onClick={() => setUserType('admin')}>
        <span className="admin-span">Admin</span>
      </button>
      <button className="rectangle-button-2" onClick={() => setUserType('user')}>
        <span className="user-span">User</span>
      </button>
      <div className="new-here-div">
        <span className="text-5">New here?</span>
        <span className="text-6" onClick={redirectToRegister}>
          Create an account
        </span>
      </div>
    </div>
  );
};

export default Account;
