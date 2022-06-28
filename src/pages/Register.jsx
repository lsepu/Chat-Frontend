import React from 'react'

const Register = () => {
  return (
    <>
      <div className="form-wrapper">
        <h1 style={{textAlign: "center"}}>Register</h1>

       {/* <div className="message">Sorry, That login is incorrect</div> */}

        <form className="login__form">
          <label>Email:</label>
          <input type="text" name="username" />

          <label>Password:</label>
          <input type="password" name="password" />

          <label>Verify password:</label>
          <input type="password" name="verify-password" />

          <p>Already have an account? <a href="">Log In</a></p>

          <button className="btn btn--login">Register</button>
        </form>
      </div>
    </>
  )
}

export default Register