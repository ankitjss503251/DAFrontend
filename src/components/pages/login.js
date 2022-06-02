import React from "react";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

const Login = () => (
  <div>
    <section
      className="login_sec jumbotron breadcumb no-bg pdd_8"
      style={{ backgroundImage: `url(${"./img/login/login-bg.jpg"})` }}
    >
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-8 col-md-12 text-light wow fadeInRight mb-5"
              data-wow-delay=".5s"
            >
              <h1>Create, sell or<br /> collect digital items</h1>
              <p className="lead max-600">
              Unit of data stored on a digital ledger, called a blockchain, that certifies a digital asset to be unique and therefore not interchangeable
              </p>
            </div>
            <div
              className="col-lg-4 col-md-12 wow fadeIn"
              data-wow-delay=".5s"
            >
              <div className="box-login">
                <h3 className="">Sign In</h3>
                <p>
                  Login using an existing account or create a new account <Link to="/register">here .</Link>
                </p>
                <form
                  name="LoginForm"
                  id="login_form"
                  className="form-border"
                  action="#"
                >
                  <div className="form-group">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="form-control"
                      placeholder="username"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      placeholder="password"
                    />
                  </div>

                  <div className="form-group1">
                    <Link to={'/loginhome'} >
                    <input
                      type="submit"
                      id="send_message"
                      value="Submit"
                      className="btn main_btn width-100 color-2"
                    />
                    </Link>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
    </section>

    <Footer />
  </div>
);
export default Login;
