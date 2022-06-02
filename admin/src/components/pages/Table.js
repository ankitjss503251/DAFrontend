import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Editsvg from '../SVG/editsvg';
import Viewsvg from '../SVG/viewsvg';
import Deletesvg from '../SVG/deletesvg';

export default function Table() {
  return (
    <div className="wrapper">
        {/* <!-- Sidebar  --> */}
        <Sidebar />

        {/* <!-- Page Content  --> */}
        <div id="content">
            <div className="adminbody table-widget text-light box-background">
                <h5 className="admintitle font-600 font-24 text-yellow">Example</h5>
                <p className="admindescription">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                <table class="table table-hover text-light">
                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Invoice</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Anna Doe</td>
                        <td>Modern</td>
                        <td>#53327</td>
                        <td>$20</td>
                        <td>
                        <div class="btn-group btn-group-sm">
                            <Link to={''} class="btn btn-info"><Editsvg /></Link>
                            <Link to={"/"} class="btn btn-success"><Viewsvg /></Link>
                            <Link to={"/"} class="btn btn-danger"><Deletesvg /></Link>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Anna Doe</td>
                        <td>Modern</td>
                        <td>#53327</td>
                        <td>$20</td>
                        <td>
                        <div class="btn-group btn-group-sm">
                            <Link to={''} class="btn btn-info"><Editsvg /></Link>
                            <Link to={"/"} class="btn btn-success"><Viewsvg /></Link>
                            <Link to={"/"} class="btn btn-danger"><Deletesvg /></Link>
                        </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Anna Doe</td>
                        <td>Modern</td>
                        <td>#53327</td>
                        <td>$20</td>
                        <td>
                        <div class="btn-group btn-group-sm">
                            <Link to={''} class="btn btn-info"><Editsvg /></Link>
                            <Link to={"/"} class="btn btn-success"><Viewsvg /></Link>
                            <Link to={"/"} class="btn btn-danger"><Deletesvg /></Link>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}
