import React from "react";
import { SVGShapeOne } from "../svg/svg-shape-one";
import { SVGShapeTwo } from "../svg/svg-shape-two";
import { SVGShapeSeven } from "../svg/svg-shape-seven";
import { SVGShapeFour } from "../svg/svg-shape-four";
import { SVGShapeThree } from "../svg/svg-shape-three";
import { SVGShapeFive } from "../svg/svg-shape-five";
import { SVGShapeEight } from "../svg/svg-shape-eight";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div class="pt-10 bg-light">
      <div class="container">
        <div class="col-12 mx-auto col-sm-10 col-md-8 col-lg-6 text-center">
          <h4 class="fs-1 fw-bold mb-4">Qui sommes nous ?</h4>

          <div class="my-5 d-none d-md-flex align-items-start justify-content-between">
            <div>
              <span class="display-3 fw-bold text-primary d-block">6</span>
              <span class="d-block fs-9 fw-bolder tracking-wide text-uppercase text-muted">
                Pays
              </span>
            </div>
            <div>
              <span class="display-3 fw-bold text-primary d-block">75K</span>
              <span class="d-block fs-9 fw-bolder tracking-wide text-uppercase text-muted">
                Clients
              </span>
            </div>
            <div>
              <span class="display-3 fw-bold text-primary d-block">160</span>
              <span class="d-block fs-9 fw-bolder tracking-wide text-uppercase text-muted">
                Employées
              </span>
            </div>
          </div>

          <Link to={`/about`} class="btn btn-success mt-4">
            En savoir plus
          </Link>
        </div>
      </div>
      <div class="position-relative mt-10">
        <picture class="d-table mx-auto mt-5 col-12 col-sm-10 position-relative z-index-20">
          <img
            class="img-fluid d-table mx-auto"
            src="/assets/images/team-photo.png"
            alt=""
          />
        </picture>
        <div class="position-absolute top-0 end-0 start-0 bottom-0 z-index-0 d-none d-lg-block">
          <div class="d-block f-w-6 position-absolute top-n13 end-50">
            <span class="d-block">
              <SVGShapeOne />
            </span>
          </div>
          <div class="d-block f-w-6  position-absolute bottom-15 end-3 rotate-n45 origin-center">
            <span class="d-block">
              <SVGShapeTwo />
            </span>
          </div>
          <div class="d-block f-w-4  position-absolute bottom-50 start-3">
            <span class="d-block">
              <SVGShapeSeven />
            </span>
          </div>
          <div class="d-block f-w-6 position-absolute top-n3 start-30">
            <span class="d-block">
              <SVGShapeFour />
            </span>
          </div>
          <div class="d-block f-w-6 position-absolute top-20 end-5">
            <span class="d-block">
              <SVGShapeThree />
            </span>
          </div>
          <div class="d-block f-w-6 position-absolute top-n13 end-25">
            <span class="d-block">
              <SVGShapeFive />
            </span>
          </div>
          <div class="d-block f-w-4 position-absolute top-n13 start-20">
            <span class="d-block">
              <SVGShapeEight />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
