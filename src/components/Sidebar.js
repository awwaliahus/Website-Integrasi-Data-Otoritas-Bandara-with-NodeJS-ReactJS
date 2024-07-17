import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Sidebar({ nama, nip, unit }) {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogOut = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/logout", { nip })
      .then((res) => {
        if (res.data.status === "Success") {
          navigate("/login");
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* Main Sidebar Container */}
      <aside
        className="main-sidebar sidebar-dark-primary elevation-4"
        style={{ backgroundColor: "#343A40", color: "#DBDBDB" }}
      >
        {/* Brand Logo */}
        <Link to="/dashboard" className="brand-link">
          <img
            src="ap_logo.png"
            alt="AP Logo"
            className="brand-image"
            style={{
              opacity: ".8",
              marginLeft: "25%",
              width: "100px",
              height: "100px",
            }}
          />
          <span
            className="brand-text font-weight-light"
            style={{ color: "#343A40" }}
          >
            AP Logo
          </span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <i className="fas fa-user-circle" style={{ fontSize: "2em" }} />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                {nama}
              </a>
              <a href="#" className="d-block">
                {nip}
              </a>
              <a href="#" className="d-block">
                {unit}
              </a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/datapas" className="nav-link">
                  <i className="nav-icon fas fa-user" />
                  <p>Data Pas Bandara</p>
                </Link>
              </li>
              {/* Scan Validation */}
              <li className="nav-item">
                <Link to="/scan" className="nav-link">
                  <i className="nav-icon fas fa-search" />
                  <p>Scan Pas Bandara</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/logakses" className="nav-link">
                  <i className="nav-icon fas fa-user" />
                  <p>Log Akses Terimal</p>
                </Link>
              </li>
              {unit === "Admin" ? (
                <>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      <i className="nav-icon fas fa-user" />
                      <p>Register</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/datapersonal" className="nav-link">
                      <i className="nav-icon fas fa-user" />
                      <p>Data Personal</p>
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}
              <li className="nav-item">
                <button
                  className="nav-link btn btn-block"
                  onClick={handleLogOut}
                  style={{
                    textAlign: "left",
                    fontFamily: "inherit",
                    fontSize: "15px",
                    color: "white",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="nav-item fas fa-sign-out-alt"
                    style={{ marginLeft: "6px", marginRight: "5px" }}
                  ></i>
                  <p style={{ marginLeft: "2.8px" }}>Log Out</p>
                </button>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
}

export default Sidebar;
