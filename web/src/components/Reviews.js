import React from "react";
import MarqueeReviews from "./MarqueeReviews";

export default function Reviews() {
  return (
    <div class="py-10">
      <div class="container">
        <p class="mb-3 small fw-bolder tracking-wider text-uppercase text-primary text-center">
          NOS COMMENTAIRES
        </p>
        <h4 class="fs-1 fw-bold mb-6 text-center col-12 col-sm-6 col-md-5 col-lg-6 col-xl-4 mx-auto">
          Ce que nos clients disent de nous
        </h4>
        <div class="mt-3 d-flex justify-content-center flex-column flex-md-row">
          <a href="#" class="btn btn-primary mb-2 mb-md-0" role="button">
            Qui nous sommes ?
          </a>
          <a
            href="#"
            class="btn btn-link text-decoration-none text-muted ms-md-2 bg-light-hover"
            role="button"
          >
            Contactez-Nous
          </a>
        </div>
      </div>
      <div class="mt-5">
        <MarqueeReviews />
      </div>
    </div>
  );
}
