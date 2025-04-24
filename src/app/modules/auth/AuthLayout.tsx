import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/helpers";

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100%";
    }
    return () => {
      if (root) {
        root.style.height = "auto";
      }
    };
  }, []);

  return (
    <div className="d-flex flex-column flex-lg-row flex-column-fluid h-100">
      {/* begin::Body */}
      <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
        {/* begin::Form */}
        <div className="d-flex flex-center flex-column flex-lg-row-fluid">
          {/* begin::Wrapper */}
          <div className="w-lg-500px p-10">
            <Outlet />
          </div>
        </div>
      </div>
      {/* end::Body */}

      {/* begin::Aside */}
      <div
        className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2 position-relative"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/student726/assets/main/sonasid-cover.png')`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)", // overlay sombre
            zIndex: 1,
          }}
        />
        <div
          className="d-flex flex-column flex-center py-15 px-5 px-md-15 w-100"
          style={{ zIndex: 2, position: "relative" }}
        >
          <h1
            className="text-white fw-bold text-center mb-7"
            style={{ fontSize: "2.75rem", lineHeight: "1.4" }}
          >
            BIENVENUE
            <br />
            SUR VOTRE PLATEFORME
            <br />
            DIS-UP
          </h1>
        </div>
      </div>

      {/* end::Aside */}
    </div>
  );
};

export { AuthLayout };
