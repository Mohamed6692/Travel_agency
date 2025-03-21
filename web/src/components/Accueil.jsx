import React from 'react';

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
                <div className="row g-4 align-items-center">
                  
                  {/* Section Liste des Villes */}
                  <div className="col-12 col-md-6 fadeInLeft animated" style={{ animationDelay: "1s" }}>
                    <div className="bg-secondary rounded p-4 w-100 text-start">
                      <h4 className="text-white mb-3">LES VILLES QUE NOUS DESSERVONS</h4>
                      <ul className="list-unstyled text-white fs-5">
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>ABIDJAN</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>BOUAKE</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>BOUNDIALI</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>KHOROHO</li>
                        <li className="mb-2"><i className="bi bi-geo-alt-fill me-2"></i>ODIENE</li>
                      </ul>
                    </div>
                    
                  </div>

                  {/* Section Texte + Bouton */}
                  <div className="col-12 col-md-6 fadeInRight animated text-center text-md-start" style={{ animationDelay: "1s" }}>
                    <h1 className="display-6 text-white">
                      Voyagez sereinement avec RafRaf <br className="d-none d-md-block" /> Confort et sécurité garantis !
                    </h1>
                    <button className="btn btn-primary rounded-pill py-2 px-4 mt-3" onClick={onReserveClick}>
                      Réserver
                    </button>
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
