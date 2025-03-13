import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SERVICES from "../data/services.json";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";

export default function Highlights() {
  const navigate = useNavigate();
  const api = useApi();
  const flash = useFlash();

  const [services, setServices] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/api/services/search`);
      if (response.success) {
        setServices(response?.services);
        setPages(response?.pages);
        setPage(response?.page);
      } else {
        flash(`${response.error.message}`, "danger");
      }
    })();
  }, [api]);

  return (
    <>
      <div class="py-5 py-lg-10">
        {services?.map((service, index) => (
          <div class="container py-5 py-lg-8" key={index}>
            <div
              class={`row g-5 g-lg-12 d-flex align-items-center ${
                index % 2 === 0 ? "" : "flex-row-reverse"
              }`}
            >
              <div class="col-12 col-md-6 col-xl-6 position-relative">
                <picture class="position-relative z-index-20">
                  <img
                    class="img-fluid rounded-5"
                    src={`${process.env.REACT_APP_BACKEND_URL}/image/${service?.images[0]?.name}`}
                    alt="config.defaultImgAlt "
                  />
                </picture>
              </div>
              <div class="col-12 col-md-6 col-xl-6 position-relative">
                <div class="position-relative z-index-20">
                  <p class="mb-0 small fw-bolder tracking-wider text-uppercase">
                    Fatihoune
                    <span className="text-primary"> {service?.title}</span>
                  </p>
                  <h4 class="fs-1 fw-bold mb-4 mt-3">{service?.subtitle}</h4>
                  <p class="text-muted fs-4">{service?.description}</p>
                  {!service?.url && (
                    <a
                      href="#"
                      class="btn btn-link px-0 me-3 fw-medium text-decoration-none mt-4"
                    >
                      En savoir plus &rarr;
                    </a>
                  )}
                  {service?.url && (
                    <a
                      href={`${service?.url}`}
                      class="btn btn-link px-0 me-3 fw-medium text-decoration-none mt-4"
                    >
                      En savoir plus &rarr;
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
