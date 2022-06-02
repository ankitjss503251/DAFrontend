import React from 'react'

function Register() {
  return (
    <div className='bg_img'>
      <div className='container'>
          <div className='row'>
              <div className='col-md-12'>
                <div className='login_form'>
                  <form>
                  <span class="login100-form-logo">
                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                      width="64.000000pt" height="64.000000pt" viewBox="0 0 64.000000 64.000000"
                      preserveAspectRatio="xMidYMid meet">

                      <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                      fill="#000000" stroke="none">
                      <path d="M284 627 c-3 -8 -4 -32 -2 -53 2 -28 8 -40 21 -42 16 -3 18 3 15 49
                      -3 51 -22 77 -34 46z"/>
                      <path d="M86 563 c-8 -9 54 -73 71 -73 22 0 15 25 -15 53 -28 27 -43 33 -56
                      20z"/>
                      <path d="M457 542 c-32 -33 -35 -52 -8 -52 19 0 71 52 71 71 0 19 -37 8 -63
                      -19z"/>
                      <path d="M245 476 c-41 -18 -83 -69 -91 -111 -6 -35 7 -87 31 -119 13 -17 15
                      -16 45 18 18 20 39 36 49 36 9 0 29 21 45 46 32 50 59 66 94 53 19 -8 21 -6
                      13 9 -16 30 -57 62 -92 72 -44 13 -57 12 -94 -4z"/>
                      <path d="M11 371 c-25 -16 -1 -31 50 -31 43 0 50 3 47 18 -4 19 -73 29 -97 13z"/>
                      <path d="M495 370 c-12 -20 11 -31 56 -28 31 2 44 7 44 18 0 19 -89 27 -100
                      10z"/>
                      <path d="M368 339 c-14 -19 -28 -40 -33 -47 -4 -8 27 -65 85 -153 l93 -139 58
                      0 c32 0 61 5 64 10 6 10 -160 265 -216 333 l-25 30 -26 -34z"/>
                      <path d="M230 200 c-22 -33 -43 -60 -46 -60 -4 0 -15 11 -26 25 -11 14 -23 25
                      -27 25 -13 0 -132 -170 -126 -180 7 -12 458 -14 453 -2 -14 36 -164 252 -174
                      252 -7 0 -32 -27 -54 -60z"/>
                      </g>
                    </svg>
                  </span>
                  <h4 className='text-light text-center font-24 text-uppercase font-700 my-4'>Register in</h4>
                        <div className="mb-3">
                            <label forhtml="name" className="form-label text-light font-600">Email address</label>
                            <input type="text" className="form-control" id="name" aria-describedby="nameHelp" />
                        </div>
                        <div className="mb-3">
                            <label forhtml="exampleInputEmail1" className="form-label text-light font-600">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        </div>
                        <div className="mb-3">
                            <label forhtml="exampleInputPassword1" className="form-label text-light font-600">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label text-light font-600" forhtml="exampleCheck1">Check me out</label>
                        </div>
                        <div className='text-center'>
                            <button type="submit" className="round-btn montserrat text-light text-decoration-none login_btn" >Register</button>
                        </div>
                  </form>
                </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Register
