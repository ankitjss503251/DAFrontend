import React from 'react';
import Footer from "../components/footer";


var register_bg = {
    backgroundImage: "url(./img/login/login-bg.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
};
var bgImgStyle = {
    backgroundImage: "url(./img/background.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    backgroundColor: "#000",
};

function Register() {
  return (
    <div>
      <section className='register_hd pdd_12' style={register_bg}>
          <div className='container'>
              <div className='row'>
                  <div className='col-md-12'>
                      <h1>Register</h1>
                  </div>
              </div>
          </div>
      </section>
      <section className='register_form pdd_8' style={bgImgStyle}>
          <div className='container'>
              <div className='row'>
                  <div className='col-md-8 m-auto'>
                      <h4>Don’t have an account? Register Now.</h4>
                      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                    <form className='mt-5'>
                    <div className="row">
                        <div className="col-md-6 col-12 mb-4">
                            <label>Email Address:</label>
                            <input type="text" className="form-control" placeholder="" name="email" />
                        </div>
                        <div className="col-md-6 col-12 mb-4">
                            <label>Choose a Username:</label>
                            <input type="text" className="form-control" placeholder="" name="pswd" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-12 mb-4">
                            <label>Password:</label>
                            <input type="password" className="form-control" placeholder="" name="pswd" />
                        </div>
                        <div className="col-md-6 col-12 mb-4">
                            <label>Re-enter Password:</label>
                            <input type="password" className="form-control" placeholder="" name="pswd" />
                        </div>
                    </div>
                        <button type="submit" className="btn main_btn mt-4">Register Now</button>
                    </form>
                  </div>
              </div>
          </div>
      </section>
      <Footer />
    </div>
  )
}

export default Register
