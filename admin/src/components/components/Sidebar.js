import React from 'react';
import { NavLink } from 'react-router-dom';
import Dashboardsvg from '../SVG/dashboardsvg';
import Formsvg from '../SVG/formsvg';
import Tablesvg from '../SVG/tablesvg';
import Performancesvg from '../SVG/performancesvg';
import Collectionsvg from '../SVG/collectionsvg';
import Nftsvg from '../SVG/nftsvg';

function Sidebar() {

//   const [active, setActive] = useState('active');

  return (
        <nav id="sidebar">

            <ul className="list-unstyled components text-uppercase">
                <li>
                    <NavLink to={"/"} className="text-decoration-none text-light" activeClassName="active-link">
                        <Dashboardsvg /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/form'} className="text-decoration-none text-light">
                        <Formsvg /> Forms
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/table'} className="text-decoration-none text-light">
                        <Tablesvg /> Tables
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/createcollection'} className="text-decoration-none text-light">
                        <Collectionsvg /> Create Collection
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/createnfts'} className="text-decoration-none text-light">
                        <Nftsvg /> Create NFTs
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/createbrands'} className="text-decoration-none text-light">
                        <Performancesvg /> Create Brands
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/createcategories'} className="text-decoration-none text-light">
                        <Performancesvg /> Create Categories
                    </NavLink>
                </li>
                <li>
                    <NavLink to={'/performance'} className="text-decoration-none text-light">
                        <Performancesvg /> Performance
                    </NavLink>
                </li>
            </ul>
        </nav>
  )
}

export default Sidebar
