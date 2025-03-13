import React from 'react';

function Footer() {
  return (
    <>
      {/* Début du Footer */}
      <div className="container-fluid footer py-5 wow fadeIn mt-5" data-wow-delay="0.2s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <div className="footer-item">
                  <h4 className="text-white mb-4">À propos de nous</h4>
                  <p className="text-muted mb-0">
                    Nous sommes une entreprise spécialisée dans les services de transport et de location de voitures de qualité supérieure. Forts de plusieurs années d'expérience, nous nous engageons à vous offrir les meilleures options pour vos besoins de voyage. Notre équipe est à votre disposition pour rendre votre expérience de transport aussi agréable et pratique que possible.
                  </p>
                </div>
                <div className="position-relative">
                  <input className="form-control rounded-pill w-100 py-3 ps-4 pe-5" type="text" placeholder="Entrez votre email" />
                  <button type="button" className="btn btn-secondary rounded-pill position-absolute top-0 end-0 py-2 mt-2 me-2">S'abonner</button>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">Liens rapides</h4>
                <a href="#" className="text-white"><i className="fas fa-angle-right me-2"></i> À propos</a>
                <a href="#" className="text-white"><i className="fas fa-angle-right me-2"></i> Voitures</a>
                <a href="#" className="text-white"><i className="fas fa-angle-right me-2"></i> Types de voitures</a>
                <a href="#" className="text-white"><i className="fas fa-angle-right me-2"></i> Équipe</a>
                <a href="#" className="text-white"><i className="fas fa-angle-right me-2"></i> Contactez-nous</a>
                <a href="#" className="text-white"><i className="fas fa-angle-right me-2"></i> Termes & Conditions</a>
              </div>
            </div>

            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">Heures d'ouverture</h4>
                <div className="mb-3">
                  <h6 className="text-muted mb-0">Lundi - Vendredi :</h6>
                  <p className="text-white mb-0">7h00 à 19h00</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-0">Samedi :</h6>
                  <p className="text-white mb-0">10h00 à 17h00</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted mb-0">Vacances :</h6>
                  <p className="text-white mb-0">Le dimanche est notre jour de congé</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item d-flex flex-column">
                <h4 className="text-white mb-4">Coordonnées</h4>
                <a href="#" className="text-muted mb-0"><i className="fa fa-map-marker-alt me-2"></i> Abidjan, Côte d'Ivoire</a>
                <a href="mailto:info@exemple.com" className="text-muted mb-0"><i className="fas fa-envelope me-2"></i> info@exemple.com</a>
                <a href="tel:+22512345678" className="text-muted mb-0"><i className="fas fa-phone me-2"></i> +225 12 34 56 78</a>
                <a href="tel:+22512345678" className="text-muted mb-0"><i className="fas fa-print me-2"></i> +225 12 34 56 78</a>

                <div className="d-flex">
                  <a className="btn btn-secondary btn-md-square rounded-circle me-3" href="#"><i className="fab fa-facebook-f text-white"></i></a>
                  <a className="btn btn-secondary btn-md-square rounded-circle me-3" href="#"><i className="fab fa-twitter text-white"></i></a>
                  <a className="btn btn-secondary btn-md-square rounded-circle me-3" href="#"><i className="fab fa-instagram text-white"></i></a>
                  <a className="btn btn-secondary btn-md-square rounded-circle me-0" href="#"><i className="fab fa-linkedin-in text-white"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin du Footer */}

      {/* Copyright Start */}
      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 text-center text-md-start mb-md-0">
              <span className="text-body"><a href="#" className="border-bottom text-white"><i className="fas fa-copyright text-light me-2"></i>RafRaf plateforme</a>, Tous droits réservés.</span>
            </div>
            <div className="col-md-6 text-center text-md-end text-body">
              Conçu par <a className="border-bottom text-white" href="https://">Fatihoune Dev</a> Distribué par <a className="border-bottom text-white" href="https://">Moha</a>
            </div>
          </div>
        </div>
      </div>
      {/* Fin du Copyright */}
    </>
  );
}

export default Footer;
