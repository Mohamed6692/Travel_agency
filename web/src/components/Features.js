import React from "react";

import features from "../data/features.json";

export default function Features() {
  return (
    <div class="py-10">
      <div class="container">
        <h4 class="fs-1 fw-bold mb-3 text-center">Explore our features</h4>
        <p class="text-muted text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div class="row gx-10 gy-7 mt-4">
          {features.entries.map((feature, index) => (
            <div
              key={index}
              class="col-12 col-md-6 col-lg-4 d-flex flex-column justify-content-start"
            >
              <span class="f-w-8 d-block text-primary">
                <img src={feature.svg} />
              </span>
              <p class="fw-medium mb-1 mt-3 fs-5">{feature.title}</p>
              <span class="text-muted fs-7">{feature.description}</span>
            </div>
          ))}
        </div>

        <a
          href="#"
          class="btn btn-primary d-table mx-auto mt-5 w-100 w-md-auto mt-lg-8 mb-3"
          role="button"
        >
          Start your trial
        </a>
        <ul class="list-unstyled d-none d-md-flex align-items-center justify-content-center small text-muted mt-3 pt-1 fw-medium fs-9">
          <li class="me-4 d-flex align-items-center">
            <i class="ri-checkbox-circle-fill text-primary ri-lg me-1"></i> No
            credit card required
          </li>
          <li class="me-4 d-flex align-items-center">
            <i class="ri-checkbox-circle-fill text-primary ri-lg me-1"></i>{" "}
            Cancel anytime
          </li>
          <li class="me-4 d-flex align-items-center">
            <i class="ri-checkbox-circle-fill text-primary ri-lg me-1"></i> 30
            day free trial
          </li>
        </ul>
      </div>
    </div>
  );
}
