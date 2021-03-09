import React from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../auth/authOptions";

function Header() {

    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          CMS MERN
        </Link>
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/pages" className="nav-link">
                Pages
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/createuser" className="nav-link">
                Create User
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/createpage" className="nav-link">
                Create Page
              </Link>
            </li>
          </ul>
        </div>
        <AuthOptions />
      </nav>
    );
}

export default Header;
