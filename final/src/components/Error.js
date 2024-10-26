import React, { useEffect, useState } from 'react';
import './Error.css';

const Error = () => {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      window.location.href = '/auth/account';
    }

    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className="error-container">
      <p className="error-message">The account type selected does not match. Please try again.</p>
      <p>You will be redirected in <span id="countdown">{countdown}</span> seconds...</p>
    </div>
  );
};

export default Error;
