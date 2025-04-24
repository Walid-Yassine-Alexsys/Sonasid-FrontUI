import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import SurveillantTable from "./SurveillantTable";
// import CreateSurveillant from "./CreateSurveillant";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPays } from "../_requests/apiRequests";
import Swal from "sweetalert2";
import SurveillantTable from "./_partials/SurveillantTable";
import CreateSurveillant from "../create_surveillant/CreateSurveillant";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface TypeSurveillant {
  typeSurveillant_Id: number;
  typeSurveillant_Nom: string;
}

interface Filters {
  search: string;
  typeSurveillantId: number;
  paysId: number;
  statut: string;
  dateCreation: Date | null;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

// Static list for TypeSurveillant as a workaround
const STATIC_TYPE_SURVEILLANTS: TypeSurveillant[] = [
  { typeSurveillant_Id: 1, typeSurveillant_Nom: "Individuel" },
  { typeSurveillant_Id: 2, typeSurveillant_Nom: "Entreprise" },
];

const SurveillantList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    typeSurveillantId: 0,
    paysId: 0,
    statut: "all",
    dateCreation: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const paysResponse: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(paysResponse.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des données :", error);
        Swal.fire(
          "Erreur",
          error.message || "Échec du chargement des données",
          "error"
        );
      }
    };
    loadData();
  }, []);

  const formik = useFormik({
    initialValues: {
      search: "",
      typeSurveillantId: 0,
      paysId: 0,
      statut: "all",
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
        typeSurveillantId: values.typeSurveillantId,
        paysId: values.paysId,
        statut: values.statut,
        dateCreation: values.dateCreation,
      });
    },
  });

  const handleResetFilters = () => {
    formik.resetForm();
    setFilters({
      search: "",
      typeSurveillantId: 0,
      paysId: 0,
      statut: "all",
      dateCreation: null,
    });
  };

  return (
    <>
      <div className="border-0 pt-5 d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-bold custom-title text-dark">Surveillants</span>
          <span className="text-muted mt-1 fw-semibold custom-subtitle">
            Liste des surveillants
          </span>
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Nouveau Surveillant
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
                    placeholder="Nom du surveillant..."
                    value={formik.values.search}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Type de surveillant</label>
                  <select
                    name="typeSurveillantId"
                    className="form-control"
                    value={formik.values.typeSurveillantId}
                    onChange={formik.handleChange}
                  >
                    <option value={0}>Tous les types</option>
                    {STATIC_TYPE_SURVEILLANTS.map((t) => (
                      <option key={t.typeSurveillant_Id} value={t.typeSurveillant_Id}>
                        {t.typeSurveillant_Nom}
                      </option>
                    ))}
                  </select>
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
                  <label className="form-label">Statut</label>
                  <select
                    name="statut"
                    className="form-control"
                    value={formik.values.statut}
                    onChange={formik.handleChange}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
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

        <SurveillantTable
          search={filters.search}
          typeSurveillantId={filters.typeSurveillantId}
          paysId={filters.paysId}
          statut={filters.statut}
          dateCreation={filters.dateCreation}
        />
      </div>

      <CreateSurveillant
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

export default SurveillantList;