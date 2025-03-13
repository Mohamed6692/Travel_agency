import React from "react";

import blogs from "../data/blogs.json";
import { Link } from "react-router-dom";

export default function Blog() {
  return (
    <div class="bg-primary py-10">
      <div class="container">
        <h4 class="fs-1 fw-bold mb-6 text-white text-center">
          Our latest articles
        </h4>
        <div class="row g-5">
          {blogs.entries.map((blog, index) => (
            <article key={index} class="col-12 col-sm-6 col-lg-4">
              <div class="d-flex h-100 bg-white rounded card shadow-lg position-relative border-0 overflow-hidden">
                <picture>
                  <img class="img-fluid" src={blog.img} alt="" />
                </picture>
                <div class="card-body p-4 p-lg-5">
                  <p class="card-title fw-medium mb-4">{blog.title}</p>
                  <Link
                    class="fw-medium fs-7 text-decoration-none link-cover"
                    to={`/`}
                  >
                    Read more &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}

          <div class="mt-7">
            <Link
              class="btn btn-white mx-auto d-table fw-medium w-100 w-md-auto"
              to={``}
            >
              More articles &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
