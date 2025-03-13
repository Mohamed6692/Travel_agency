import React from "react";

export default function TeamSingle({ img, name, title, bio, android }) {
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div
        className="card card-vcard"
        data-bs-container="body"
        data-bs-toggle="popover"
        data-bs-placement="top"
        data-bs-trigger="hover"
        data-bs-content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, nihil in suscipit neque, voluptas dolor odit beatae nam magnam soluta temporibus. Laudantium tempore sunt expedita voluptatibus ad maxime placeat esse!"
      >
        <picture className="avatar">
          <img
            className="img-fluid rounded-circle"
            src={`${process.env.PUBLIC_URL}/assets/images/${img}`}
            alt={name}
          />
        </picture>
        <h5 className="card-title vcard-title mt-4">{name}</h5>
        <h6 className="card-subtitle mb-4 text-primary vcard-subtitle">
          {title}
        </h6>
        <p className="text-muted">{bio}</p>
        <ul className="list-unstyled d-flex">
          <li className="mx-2">
            <a href={`${android}`}>
              <i class="bi bi-android fs-2"></i>
            </a>
          </li>
          {/* <li className="mx-2">
            <a href={`${process.env.PUBLIC_URL}/assets/files/${link}`}>
              <i class="bi bi-apple fs-2"></i>
            </a>
          </li>
          <li className="mx-2">
            <a href={`${process.env.PUBLIC_URL}/assets/files/${link}`}>
              <i class="bi bi-globe fs-2"></i>
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
