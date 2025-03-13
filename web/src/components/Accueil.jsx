import React from 'react';
import { Link } from "react-router-dom";

function Accueil({ onReserveClick }) {
  return (
    <div className="header-carousel">
      <div id="carouselId" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
        <ol className="carousel-indicators">
          <li data-bs-target="#carouselId" data-bs-slide-to="0" className="active" aria-current="true" aria-label="First slide"></li>
          <li data-bs-target="#carouselId" data-bs-slide-to="1" aria-label="Second slide"></li>
        </ol>
        <div className="carousel-inner" role="listbox">
          <div className="carousel-item active">
            <img src="img/rafraf.jpg" className="img-fluid w-100" alt="First slide" />
            <div className="carousel-caption">
              <div className="container py-4">
                <div className="row g-5">
                  <div className="col-lg-6 fadeInLeft animated" style={{ animationDelay: "1s" }}>
                    <div className="bg-secondary rounded p-5 d-flex flex-column align-items-start">
                      <h4 className="text-white mb-4 text-start">LES VILLES QUE NOUS DESSERVONS</h4>
                      <ul className="list-unstyled text-white fs-5 text-start ps-1">
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>ABIDJAN</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>BOUAKE</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>BOUNDIALI</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>KHOROHO</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>ODIENE</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-lg-6 d-none d-lg-flex fadeInRight animated" style={{ animationDelay: "1s" }}>
                    <div className="text-start">
                      <h1 className="display-5 text-white">Voyagez sereinement avec RafRaf – Confort et sécurité garantis !</h1>
                      <button 
                        className="btn btn-primary rounded-pill py-2 px-4 me-2"
                        onClick={onReserveClick}
                      >
                        Reserver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
