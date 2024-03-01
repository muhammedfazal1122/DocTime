import React, { useState } from 'react';
import Navbar from '../../Compounts/Navbar';
import Footer from '../../Compounts/Footer';
import '../../pages/Patient/Login.css';

const UserLogin = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the form submission, e.g., by calling an API
    console.log(`Email: ${email}, Password: ${password}`);
 };

 return (
    <div>
      <Navbar/>
   <div className='Login'>
   <div className="container">
        <div className="heading">Sign In</div>
        <form onSubmit={handleSubmit} className="form">
          <input
            required
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="forgot-password"><a href="#">Forgot Password ?</a></span>
          <input className="login-button" type="submit" value="Sign In" />
        </form>
        <div className="social-account-container">
          <span className="title">Or Sign in with</span>
          <div className="social-accounts">
            {/* Social buttons */}
          </div>
        </div>
        <span className="agreement"><a href="#">Learn user licence agreement</a></span>
      </div>
   </div>
      <Footer/>
    </div>
 );
};

export default UserLogin;
