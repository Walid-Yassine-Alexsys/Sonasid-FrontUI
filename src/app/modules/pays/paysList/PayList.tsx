import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PaysTable from "./__partials/PaysTable";
import CreatePay from "../createPay/CreatePay";

const PayList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    validationSchema: Yup.object({
      search: Yup.string().min(1, "Search term must be at least 1 character"),
    }),
    onSubmit: (values) => {
      setSearchTerm(values.search);
    },
  });

  const handleCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <>
      {/* Title */}
      <div className="border-0 pt-5">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-bold fs-3 text-dark">Pays</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Liste des pays
          </span>
        </h3>
      </div>

      {/* Search Form and Nouveau Button */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="row m-8 align-items-center">
            <div className="col-md-4">
              <form onSubmit={formik.handleSubmit} className="d-flex gap-2">
                <input
                  name="search"
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={formik.values.search}
                  onChange={formik.handleChange}
                />
                <button
                  type="submit"
                  className="btn btn-primary border"
                  title="Filtrer"
                >
                  <i className="bi bi-search bi-lg"></i>
                </button>
              </form>
              {formik.errors.search && formik.touched.search && (
                <div className="text-danger mt-1">{formik.errors.search}</div>
              )}
            </div>

            <div className="col-md-8 d-flex justify-content-end mt-3 mt-md-0">
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-plus me-2"></i>{" "}
                {/* FontAwesome plus icon */}
                Nouveau Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-10">
        <PaysTable key={refresh.toString()} search={searchTerm} />
      </div>

      {/* Modal */}
      <CreatePay
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
      />
    </>
  );
};

export default PayList;
