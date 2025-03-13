import React from "react";
import { SVGSHapeNine } from "../svg/svg-shape-nine";

export default function HighlightItem() {
  return (
    <div class="py-5 py-lg-10">
      <div class="container py-5 py-lg-8">
        <div class="row g-5 g-lg-10 d-flex align-items-center">
          <div class="col-12 col-md-6 col-xl-5 offset-xl-1 position-relative">
            <picture class="position-relative z-index-20">
              <img
                class="img-fluid rounded-5"
                src={`${process.env.PUBLIC_URL}/assets/images/feature-1.jpeg`}
                alt="config.defaultImgAlt "
              />
            </picture>
            <div class="position-absolute bottom-5 end-0 z-index-30 d-none d-lg-block">
              <div class="p-3 bg-white shadow-lg rounded-3 f-w-60 mb-3 d-flex align-items-center me-0 ms-auto">
                <div class="position-relative me-4">
                  <picture class="position-relative z-index-0">
                    <img
                      class="f-w-12 rounded-circle"
                      src={`${process.env.PUBLIC_URL}/assets/images/profile-small-2.jpeg`}
                      alt=""
                    />
                  </picture>
                  <span class="position-absolute z-index-20 d-block f-w-3 f-h-3 border border-3 border-white bg-success rounded-circle bottom-0 end-8"></span>
                </div>
                <div class="lh-sm">
                  <small class="align-self-center fs-8">
                    I like it. 👍 Can we try a different shade of orange for the
                    nav?
                  </small>
                  <span class="fs-9 text-muted fw-medium mt-1 d-block">
                    12 mins ago
                  </span>
                </div>
              </div>

              <div class="p-3 bg-white shadow-lg rounded-3 f-w-56 mb-3 d-flex align-items-center me-0 ms-auto">
                <div class="position-relative me-4">
                  <picture class="position-relative z-index-0">
                    <img
                      class="f-w-12 rounded-circle"
                      src={`${process.env.PUBLIC_URL}/assets/images/profile-small-3.jpeg`}
                      alt=""
                    />
                  </picture>
                  <span class="position-absolute z-index-20 d-block f-w-3 f-h-3 border border-3 border-white bg-danger rounded-circle bottom-0 end-8"></span>
                </div>
                <div class="lh-sm">
                  <small class="align-self-center fs-8 lh-sm">
                    Orange updated in header and footer.
                  </small>
                  <span class="fs-9 text-muted fw-medium mt-1 d-block">
                    5 mins ago
                  </span>
                </div>
              </div>
            </div>

            <div class="d-none d-xl-block f-w-60 position-absolute top-n13 start-n3 opacity-75">
              <span class="d-block">
                <SVGSHapeNine />
              </span>
            </div>
          </div>
          <div class="col-12 col-md-6 col-xl-5 offset-xl-1 position-relative">
            <div class="position-relative z-index-20">
              <p class="mb-0 small fw-bolder tracking-wider text-uppercase text-primary">
                Build together
              </p>
              <h4 class="fs-1 fw-bold mb-4 mt-3">
                You need collaboration. We've got you covered.
              </h4>
              <p class="text-muted">
                Use our builder to collaborate with your team members during all
                stages of your landing page build.
              </p>
              <a
                href="#"
                class="btn btn-link px-0 me-3 fw-medium text-decoration-none mt-4"
              >
                Let's get started &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
