import React from "react";
import reviews from "../data/reviews.json";

export default function MarqueeReviews() {
  return (
    <div class="marquee marquee-hover-pause">
      <div class="marquee-body">
        <div class="marquee-section animation-marquee-200 py-3">
          {/* {{#each reviews.entries}} */}
          {reviews.entries.map((review, index) => (
            <div
              key={index}
              class="rounded shadow-sm border f-w-76 d-flex flex-wrap flex-column px-5 pb-5 pt-7 mx-4 text-wrap position-relative h-100"
            >
              <i class="ri-double-quotes-l position-absolute top-n1 start-2 ri-2x opacity-10"></i>
              <p class="mb-2 fw-medium fs-6">{review.quote}</p>
              <div class="d-flex align-items-center mt-2">
                <picture>
                  <img
                    class="f-w-10 rounded-circle"
                    src={review.avatar}
                    alt=""
                  />
                </picture>
                <span class="d-block text-muted fs-7 ms-3">{review.name}</span>
              </div>
              <div class="mt-4 f-w-20">
                <picture>
                  <img
                    class="img-fluid d-table mx-auto"
                    src={review.img}
                    alt=""
                  />
                </picture>
              </div>
            </div>
          ))}

          {/* {{/each}} */}
        </div>
        <div class="marquee-section animation-marquee-200 py-3">
          {reviews.entries.map((review, index) => (
            <div
              key={index}
              class="rounded shadow-sm border f-w-76 d-flex flex-wrap flex-column px-5 pb-5 pt-7 mx-4 text-wrap position-relative h-100"
            >
              <i class="ri-double-quotes-l position-absolute top-n1 start-2 ri-2x opacity-10"></i>
              <p class="mb-2 fw-medium fs-6">{review.quote}</p>
              <div class="d-flex align-items-center mt-2">
                <picture>
                  <img
                    class="f-w-10 rounded-circle"
                    src={review.avatar}
                    alt=""
                  />
                </picture>
                <span class="d-block text-muted fs-7 ms-3">{review.name}</span>
              </div>
              <div class="mt-4 f-w-20">
                <picture>
                  <img
                    class="img-fluid d-table mx-auto"
                    src={review.img}
                    alt=""
                  />
                </picture>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
