import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PortTable from "./_partials/PortTable";
import CreatePort from "../create_port/CreatePort";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPays, fetchVilles } from "../_requests/apiRequests";
import Swal from "sweetalert2";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface Ville {
  ville_id: number;
  ville_Nom: string;
}

interface Filters {
  search: string;
  codeIATA: string;
  codeUNLOCODE: string;
  paysId: number;
  villeId: number;
  dateCreation: Date | null;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

const PortList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    codeIATA: "",
    codeUNLOCODE: "",
    paysId: 0,
    villeId: 0,
    dateCreation: null,
  });

  useEffect(() => {
    const loadPays = async () => {
      try {
        const response: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(response.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des pays :", error);
        Swal.fire("Erreur", error.message || "Échec du chargement des pays", "error");
      }
    };

    const loadVilles = async () => {
      try {
        const response: FetchResponse<Ville> = await fetchVilles(1, "");
        setVilles(response.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des villes :", error);
        Swal.fire("Erreur", error.message || "Échec du chargement des villes", "error");
      }
    };

    loadPays();
    loadVilles();
  }, []);

  const formik = useFormik({
    initialValues: {
      search: "",
      codeIATA: "",
      codeUNLOCODE: "",
      paysId: 0,
      villeId: 0,
      dateCreation: null,
    },
    validationSchema: Yup.object({
      search: Yup.string().min(
        1,
        "Le terme de recherche doit contenir au moins 1 caractère"
      ),
    }),
    onSubmit: (values) => {
      setFilters({
        search: values.search,
        codeIATA: values.codeIATA,
        codeUNLOCODE: values.codeUNLOCODE,
        paysId: values.paysId,
        villeId: values.villeId,
        dateCreation: values.dateCreation,
      });
    },
  });

  const handleResetFilters = () => {
    formik.resetForm();
    setFilters({
      search: "",
      codeIATA: "",
      codeUNLOCODE: "",
      paysId: 0,
      villeId: 0,
      dateCreation: null,
    });
  };

  return (
    <>
      <div className="border-0 pt-5 d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-bold custom-title text-dark">Ports</span>
          <span className="text-muted mt-1 fw-semibold custom-subtitle">
            Liste des ports
          </span>
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Nouveau Port
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="row m-8 align-items-center">
            <div className="col-md-12">
              <form onSubmit={formik.handleSubmit} className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Nom</label>
                  <input
                    name="search"
                    type="text"
                    className="form-control"
                    placeholder="Nom du port..."
                    value={formik.values.search}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Code IATA</label>
                  <input
                    name="codeIATA"
                    type="text"
                    className="form-control"
                    placeholder="Code IATA..."
                    value={formik.values.codeIATA}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Code UN/LOCODE</label>
                  <input
                    name="codeUNLOCODE"
                    type="text"
                    className="form-control"
                    placeholder="Code UN/LOCODE..."
                    value={formik.values.codeUNLOCODE}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Pays</label>
                  <select
                    name="paysId"
                    className="form-control"
                    value={formik.values.paysId}
                    onChange={formik.handleChange}
                  >
                    <option value={0}>Tous les pays</option>
                    {pays.map((p) => (
                      <option key={p.pays_id} value={p.pays_id}>
                        {p.pays_Nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Ville</label>
                  <select
                    name="villeId"
                    className="form-control"
                    value={formik.values.villeId}
                    onChange={formik.handleChange}
                  >
                    <option value={0}>Toutes les villes</option>
                    {villes.map((v) => (
                      <option key={v.ville_id} value={v.ville_id}>
                        {v.ville_Nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Date de création</label>
                  <DatePicker
                    selected={formik.values.dateCreation}
                    onChange={(date) =>
                      formik.setFieldValue("dateCreation", date)
                    }
                    className="form-control"
                    placeholderText="Sélectionner une date"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                  />
                </div>

                <div className="col-md-1 d-flex align-items-end">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    title="Filtrer"
                  >
                    <i className="bi bi-filter"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetFilters}
                    title="Réinitialiser"
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
              </form>

              {formik.errors.search && formik.touched.search && (
                <div className="text-danger mt-1">{formik.errors.search}</div>
              )}
            </div>
          </div>
        </div>

        <PortTable
          search={filters.search}
          codeIATA={filters.codeIATA}
          codeUNLOCODE={filters.codeUNLOCODE}
          paysId={filters.paysId}
          villeId={filters.villeId}
          dateCreation={filters.dateCreation}
        />
      </div>

      <CreatePort
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => {
          handleResetFilters();
          setFilters((prev) => ({ ...prev }));
        }}
      />
    </>
  );
};

export default PortList;