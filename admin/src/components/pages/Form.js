import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Form() {
  return (
    <div className="wrapper">
        {/* <!-- Sidebar  --> */}
        <Sidebar />

        {/* <!-- Page Content  --> */}
        <div id="content">
        <div class="card card-primary">
          <div class="card-header pt-3 pb-3">
            <h5 class="card-title text-light mb-0">Quick Example</h5>
          </div>

          <form class="needs-validation" novalidate>
            <div class="card-body text-light">
              <div class="form-group mb-3">
                <label for="exampleInputEmail1" className='font-600 mb-1 form-label'>Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email" required />
                <div class="invalid-feedback">Please fill out this field.</div>
              </div>

              <div class="form-group mb-3">
                <label for="exampleInputPassword1" className='font-600 mb-1'>Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required />
                <div class="invalid-feedback">Please fill out this field.</div>
              </div>

              <div class="form-group mb-3">
                <label for="exampleInputFile" className='font-600 mb-1'>File input</label>
                <div class="input-group">
                  <div class="custom-file">
                    <input type="file" class="custom-file-input" id="exampleInputFile" required />
                    <div class="invalid-feedback">Please fill out this field.</div>
                  </div>
                </div>
              </div>

              <div class="form-group mb-3">
                <label className='font-600 mb-1'>Custom Select</label>
                <select class="form-select form-control" aria-label="Default select example">
                <option>option 1</option>
                <option>option 2</option>
                <option>option 3</option>
                <option>option 4</option>
                <option>option 5</option>
                </select>
              </div>

              <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
              </div>
            </div>

            <div class="card-footer">
              <button type="submit" class="btn btn-admin text-light">Submit</button>
            </div>

          </form>
          </div>         
        </div>
    </div>
  )
}
