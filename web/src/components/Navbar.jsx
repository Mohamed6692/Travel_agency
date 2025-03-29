import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const navigate = useNavigate();
  
  // État pour le menu mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Écoute des changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.clear();
        handleCloseUserMenu();
        navigate("/login");
      } else {
        console.error("Échec de la déconnexion :", await response.json());
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Navbar Start */}
      <div className="container-fluid topbar bg-secondary d-none d-xl-block w-100" >
        <div className="container">
          <div className="row gx-0 align-items-center" style={{ height: "45px" }}>
            <div className="col-lg-6 text-center text-lg-start mb-lg-0">
              <div className="d-flex flex-wrap">
                <a href="#" className="text-muted me-4">
                  <i className="fas fa-map-marker-alt text-primary me-2"></i>Find A Location
                </a>
                <a href="tel:+01234567890" className="text-muted me-4">
                  <i className="fas fa-phone-alt text-primary me-2"></i>+225 0707076692
                </a>
                <a href="mailto:example@gmail.com" className="text-muted me-0">
                  <i className="fas fa-envelope text-primary me-2"></i>raf-e@gmail.com
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center text-lg-end">
              <div className="d-flex align-items-center justify-content-end">
                <a href="#" className="btn btn-light btn-sm-square rounded-circle me-3">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="btn btn-light btn-sm-square rounded-circle me-3">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="btn btn-light btn-sm-square rounded-circle me-3">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="btn btn-light btn-sm-square rounded-circle me-0">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid nav-bar sticky-top px-0 px-lg-4 py-2 py-lg-0" style={{ borderBottom: "1px solid #D3D3D3" }}>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light">
            <a href="/" className="navbar-brand p-0 d-flex align-items-center">
              <img src="img/logoraf.jpg" alt="Raf-Raf Logo" className="me-2" style={{ height: "50px" }} />
            </a>

            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleMenu}
            >
              <span className="fa fa-bars"></span>
            </button>

            <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarCollapse">
              <div className="navbar-nav mx-auto py-0">
                <Link to="/" className="nav-item nav-link">ACHAT TICKETS</Link>
                <Link to="/" className="nav-item nav-link">NOS PROGRAMMES</Link>
                <Link to="/" className="nav-item nav-link">NOS SERVICES</Link>
                <Link to="/" className="nav-item nav-link">ACTUALITÉS</Link>
                <Link to="/contact" className="nav-item nav-link">CONTACTS</Link>
                {isMobile && token && (
                  <>
                  <Link to="/user-profile" className="nav-item nav-link">PROFILE </Link>
                   <button 
                      className="nav-item nav-link" 
                      style={{ backgroundColor: "#DB6845", color: "black", display: "flex", alignItems: "center", border: "none", padding: "8px 16px", borderRadius: "4px" }} 
                      onClick={handleLogout}
                    >
                      <LogoutIcon sx={{ marginRight: "8px", color: "black" }} />
                      DECONNEXION
                    </button>
                  </>
                  )}
              </div>
              {!isMobile && (
                  token ? (
                    <div className="navbar-nav d-flex align-items-center">
                    <Stack direction="row" spacing={0} alignItems="center">
                    <span className="nav-item nav-link">{user?.firstName}</span>
                    <Avatar
                      sx={{ cursor: "pointer" }}
                      alt={user?.name}
                      src={user?.avatar || "/broken-image.jpg"}
                      onClick={handleClick}
                    />
                  </Stack>
                </div>
                ) : (
                  <Link to="/login" className="btn btn-primary rounded-pill py-2 px-4 me-2">
                    Se connecter
                  </Link>
                )
              )}

            </div>
          </nav>
        </div>
      </div>
      {/* Navbar End */}

      {/* Menu déroulant (visible seulement sur desktop) */}
      {!isMobile && token && (
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleCloseUserMenu}>
          <Link to="/user-profile">
            <Typography sx={{ textAlign: "center" }}>Profile</Typography>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography sx={{ textAlign: "center", color: "red" }}>Logout</Typography>
        </MenuItem>
      </Menu>
      )}

    </>
  );
};

export default Navbar;
