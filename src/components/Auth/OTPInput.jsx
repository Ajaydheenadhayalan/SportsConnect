import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 4, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputs = useRef([]);

  useEffect(() => {
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
      if (e.key === "Backspace") {
          if (!otp[index] && e.target.previousSibling) {
               e.target.previousSibling.focus();
          }
      }
  };
  
  // Trigger onComplete when OTP is full
  useEffect(() => {
    if (otp.join('').length === length) {
        onComplete(otp.join(''));
    }
  }, [otp, onComplete, length]);

  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
      {otp.map((data, index) => {
        return (
          <input
            className="otp-field"
            type="text"
            name="otp"
            maxLength="1"
            key={index}
            value={data}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onFocus={e => e.target.select()}
            ref={el => inputs.current[index] = el}
            style={{
                width: '3.5rem',
                height: '4rem',
                fontSize: '1.5rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text-main)',
                fontWeight: 'bold'
            }}
          />
        );
      })}
    </div>
  );
};

export default OTPInput;
