import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="position-relative">
      <div class="position-absolute top-0 end-0 start-0 bottom-0 z-index-0 d-none d-lg-block">
        <img
          class="w-100 h-100"
          src={`${process.env.PUBLIC_URL}/assets/images/bg.jpg`}
          alt=""
        />
      </div>

      <div class="container py-5 py-lg-8">
        <div class="row d-flex align-items-center">
          <div class="col-12 col-md-6 col-xl-5 position-relative">
            <div class="position-relative z-index-20 px-4 py-2 bg-white shadow-sm rounded">
              <p class="mb-0 small fw-bolder tracking-wider text-uppercase">
                Le groupe <span className="text-success">fatihoune</span>
              </p>
              <h4 class="fs-1 fw-bold mb-4 mt-3">Fatihoune S.A.R.L</h4>
              <p class="text-muted">
                Le groupe offre une vaste gamme de services, y compris la
                formation continue et qualifiante , l'informatique, la
                restauration, la santé et plus encore. Notre équipe de
                professionnels qualifiés se consacre à aider nos clients à
                réussir et à développer leurs entreprises.
              </p>
              <div class="mt-4 pt-1 d-flex flex-column flex-md-row justify-content-center justify-content-lg-start">
                <Link to="/about" class="btn btn-success" role="button">
                  Nous connaître
                </Link>
                <Link
                  to="/contact"
                  class="btn btn-link text-decoration-none text-muted ms-2 bg-light-hover"
                  role="button"
                >
                  Contactez-nous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
