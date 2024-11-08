import React from "react";
import logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <svg
          className="footer-border"
          height="214"
          viewBox="0 0 2204 214"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2203 213C2136.58 157.994 1942.77 -33.1996 1633.1 53.0486C1414.13 114.038 1200.92 188.208 967.765 118.127C820.12 73.7483 263.977 -143.754 0.999958 158.899"
            strokeWidth="2"
          />
        </svg>
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-4 text-center mb-4">
              <a href="#">
                <img
                  className="img-fluid"
                  width="100px"
                  src={logo}
                  alt="logo"
                />
              </a>
            </div>
            <div className="col-md-7 text-md-right text-center mb-4">
              <ul className="list-inline footer-list mb-0">
                <li className="list-inline-item">
                  <a href="#">
                    <i className="ti-facebook"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#">
                    <i className="ti-twitter-alt"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#">
                    <i className="ti-linkedin"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#">
                    <i className="ti-github"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#">
                    <i className="ti-youtube"></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12">
              <div className="border-bottom border-default"></div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}