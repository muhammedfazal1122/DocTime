import React, { useState } from 'react';
import Navbar from '../../Compounts/Navbar';
import '../../pages/Patient/Register.css';

const UserRegister = () => {
 const [firstName, setFirstName] = useState('');
 const [lastName, setLastName] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');

 const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the form submission, e.g., by calling an API
    console.log(`First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Password: ${password}, Confirm Password: ${confirmPassword}`);
 };

 return (
  <div>

  <Navbar/>
    <form className="Registform" onSubmit={handleSubmit}>
      <p className="Registtitle">Register</p>
      <p className="Registmessage">Signup now and get full access to our app.</p>
      <div className="Registflex">
        <label>
          <input
            className="Registinput"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <span>Firstname</span>
        </label>

        <label>
          <input
            className="Registinput"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <span>Lastname</span>
        </label>
      </div>

      <label>
        <input
          className="Registinput"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span>Email</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span>Password</span>
      </label>

      <label>
        <input
          className="Registinput"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <span>Confirm password</span>
      </label>

      <button class="signupBtn">
  SIGN UP
  <span class="arrow">
     <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" fill="rgb(183, 128, 255)"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path></svg>
  </span>
</button>

      <p className="Registsignin">
        Already have an account? <a href="#">Signin</a>
      </p>
    </form>
    </div>
 );
};

export default UserRegister;
