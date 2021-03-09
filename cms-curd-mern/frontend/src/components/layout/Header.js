import React from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../auth/authOptions";

function Header() {

    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          CMS MERN
        </Link>
        <AuthOptions />
      </nav>
    );
}

export default Header;
