import React from "react";
import integrations from "../data/integrations.json";

export default function Integrations() {
  return (
    <div class="bg-dark py-8">
      <div class="container py-4">
        <p class="mb-0 text-center small fw-bolder tracking-wider text-uppercase text-orange">
          Integrations
        </p>
        <h3 class="text-white text-center mt-3 fs-1 mb-3 fw-bold">
          Integrate with your favourite tools
        </h3>
        <p class="text-white opacity-50 text-center">
          Sync, share and download your work on the systems below.
        </p>

        <div class="row gx-10 gy-7 mt-4">
          {integrations.entries.map((integration, index) => (
            <div class="col-12 col-sm-6 col-lg-4 d-flex flex-column align-items-center justify-content-center">
              <picture class="d-block f-h-10">
                <img
                  className="h-100 w-auto"
                  src={`${process.env.PUBLIC_URL}/assets/images/${integration.img}`}
                  alt=""
                />
              </picture>
              <p class="text-white fs-4 fw-medium mb-2 mt-3">
                {integration.name}
              </p>
              <p class="text-white opacity-75 text-center fs-7">
                {integration.description}
              </p>
            </div>
          ))}
        </div>

        <a class="btn btn-white d-table mx-auto mt-7 w-100 w-md-auto" href="#">
          More about our integrations
        </a>
      </div>
    </div>
  );
}
