import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{paddingLeft:20, paddingRight:20}}>
      <Link className="navbar-brand" to="/">Kpop Fan Community</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/cms">CMS</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
