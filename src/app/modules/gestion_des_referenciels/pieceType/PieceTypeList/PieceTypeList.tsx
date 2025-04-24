import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PieceTypeTable from "./__partials/PieceTypeTable";
import CreatePieceType from "../createPieceType/CreatePieceType";

const PieceTypeList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: ""
  });

  // Formik for handling form state and submission
  const formik = useFormik({
    initialValues: {
      search: "",
      status: ""
    },
    validationSchema: Yup.object({
      search: Yup.string()
    }),
    onSubmit: (values) => {
      setFilters({
        search: values.search,
        status: values.status
      });
    }
  });

  const handleCreated = () => {
    setRefresh(!refresh);
  };

  const handleResetFilters = () => {
    formik.resetForm();
    setFilters({
      search: "",
      status: ""
    });
  };
  
  // Reset refresh state when search or status changes to force table rerender
  useEffect(() => {
    setRefresh(prev => !prev);
  }, [filters.search, filters.status]);

  return (
    <div className="container-fluid px-0">
      {/* Main title section */}
      <div className="border-0 pt-5 d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-bold custom-title text-dark">Liste des types de pièce</span>
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Nouveau type de pièce
        </button>
      </div>

      {/* Card with filters and table */}
      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          {/* Search and Filters section */}
          <div className="row m-8 align-items-center">
            <div className="col-md-12">
              <form onSubmit={formik.handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "2rem", marginLeft: "-20px" }}>Liste des types de pièce disponibles</label>
                  <div className="position-relative">
                    <i className="bi bi-search position-absolute" style={{ marginLeft: "-20px", left: "12px", top: "18px", color: "#adb5bd", width: "10px", fontSize: "1.3rem" }}></i>
                    <input
                      name="search"
                      type="text"
                      className="form-control"
                      placeholder="Rechercher par libellé..."
                      value={formik.values.search}
                      onChange={formik.handleChange}
                      style={{ marginLeft: "-20px", borderRadius: "12px", padding: "0.8rem 20.5rem 0.8rem 2.5rem", fontSize: "1rem", height: "50px" }}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  
                  <select
                    name="status"
                    className="form-control"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    style={{ marginLeft: "-20px", borderRadius: "12px", padding: "0.8rem 1rem", fontSize: "1rem", height: "50px",marginTop:"44px" }}
                  >
                    <option value="">Tous les statuts</option>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <button
                    type="submit"
                    className="btn btn-filter me-2"
                    title="Filtrer"
                    style={{ background: "transparent", padding: "0", border: "none" }}
                  >
                    <i className="bi bi-funnel" style={{
                      border: "2px solid #dee2e6",
                      borderRadius: "6px",
                      padding: "14px",
                      fontSize: "1rem",
                      color: "#6c757d",
                      transition: "all 0.3s ease"
                    }}></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetFilters}
                    title="Réinitialiser"
                    style={{ 
                      background: "transparent", 
                      color: "#6c757d", 
                      border: "2px solid #dee2e6",
                      borderRadius: "6px",
                      padding: "10px 10px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Table */}
          <PieceTypeTable 
            key={refresh.toString()} 
            search={filters.search}
            statusFilter={filters.status}
          />
        </div>
      </div>

      {/* Create PieceType Modal */}
      <CreatePieceType
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
      />

      {/* Add styling directly in component */}
      <style>{`
        .m-8 {
          margin: 2rem;
        }
        
        .card-header-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .card-header-subtitle {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .btn-filter:hover i {
          color: #fff !important;
          background-color: #fc5421 !important;
          border-color: #fc5421 !important;
        }
        
        .btn-secondary:hover {
          background-color: #fc5421 !important;
          color: #fff !important;
          border-color: #fc5421 !important;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        @media (max-width: 768px) {
          .form-group {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PieceTypeList;