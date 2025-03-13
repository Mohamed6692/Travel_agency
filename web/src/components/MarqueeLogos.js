import React from "react";
import logos from "../data/logos.json";

export default function MarqueeLogos() {
  return (
    <div class="bg-primary py-8">
      <p class="mb-0 text-center small fw-bolder tracking-wider text-uppercase text-white opacity-75">
        Trusted by thousands of companies worldwide
      </p>
      <div class="mt-5">
        <section class="marquee marquee-hover-pause">
          <div class="marquee-body">
            <div class="marquee-section animation-marquee-90">
              {logos.entries.map((logo, index) => (
                <div class="mx-5 f-w-24" key={index}>
                  <a
                    class="d-block"
                    href="#"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={logo.name}
                  >
                    <picture>
                      <img
                        className="img-fluid d-table mx-auto"
                        src={`${process.env.PUBLIC_URL}/assets/images/${logo.img}`}
                      />
                    </picture>
                  </a>
                </div>
              ))}
            </div>
            <div class="marquee-section animation-marquee-90">
              {logos.entries.map((logo, index) => (
                <div class="mx-5 f-w-24">
                  <a
                    class="d-block"
                    href="#"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="{{name}}"
                  >
                    <picture>
                      <img
                        className="img-fluid d-table mx-auto"
                        src={`${process.env.PUBLIC_URL}/assets/images/${logo.img}`}
                      />
                    </picture>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
