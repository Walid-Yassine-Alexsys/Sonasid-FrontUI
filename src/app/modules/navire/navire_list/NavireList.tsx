import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import NavireTable from "./NavireTable";
// import CreateNavire from "./CreateNavire";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchPays, fetchCompagnieMaritime, fetchPorts } from "../_requests/apiRequests";
import Swal from "sweetalert2";
import CreateNavire from "../create_navire/CreateNavire";
import NavireTable from "./_partials/NavireTable";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface CompagnieMaritime {
  compagnie_Id: number;
  compagnie_NomCompagnie: string;
}

interface Port {
  port_ID: number;
  port_Nom: string;
}

interface Filters {
  search: string;
  imo: string;
  compagnieId: number;
  paysId: number;
  portId: number;
  statut: string;
  dateCreation: Date | null;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

const NavireList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);
  const [compagnies, setCompagnies] = useState<CompagnieMaritime[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    imo: "",
    compagnieId: 0,
    paysId: 0,
    portId: 0,
    statut: "all",
    dateCreation: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const paysResponse: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(paysResponse.items);
        const compagnieResponse: FetchResponse<CompagnieMaritime> = await fetchCompagnieMaritime(1, "");
        setCompagnies(compagnieResponse.items);
        const portResponse: FetchResponse<Port> = await fetchPorts(1, "");
        setPorts(portResponse.items);
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
      imo: "",
      compagnieId: 0,
      paysId: 0,
      portId: 0,
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
        imo: values.imo,
        compagnieId: values.compagnieId,
        paysId: values.paysId,
        portId: values.portId,
        statut: values.statut,
        dateCreation: values.dateCreation,
      });
    },
  });

  const handleResetFilters = () => {
    formik.resetForm();
    setFilters({
      search: "",
      imo: "",
      compagnieId: 0,
      paysId: 0,
      portId: 0,
      statut: "all",
      dateCreation: null,
    });
  };

  return (
    <>
      <div className="border-0 pt-5 d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-bold custom-title text-dark">Navires</span>
          <span className="text-muted mt-1 fw-semibold custom-subtitle">
            Liste des navires
          </span>
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Nouveau Navire
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="row m-8 align-items-center">
            <div className="col-md-12">
              <form onSubmit={formik.handleSubmit} className="row g-3">
                <div className="col-md-2">
                  <label className="form-label">Nom</label>
                  <input
                    name="search"
                    type="text"
                    className="form-control"
                    placeholder="Nom du navire..."
                    value={formik.values.search}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Code IMO</label>
                  <input
                    name="imo"
                    type="text"
                    className="form-control"
                    placeholder="Code IMO..."
                    value={formik.values.imo}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Compagnie</label>
                  <select
                    name="compagnieId"
                    className="form-control"
                    value={formik.values.compagnieId}
                    onChange={formik.handleChange}
                  >
                    <option value={0}>Toutes les compagnies</option>
                    {compagnies.map((c) => (
                      <option key={c.compagnie_Id} value={c.compagnie_Id}>
                        {c.compagnie_NomCompagnie}
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
                  <label className="form-label">Port</label>
                  <select
                    name="portId"
                    className="form-control"
                    value={formik.values.portId}
                    onChange={formik.handleChange}
                  >
                    <option value={0}>Tous les ports</option>
                    {ports.map((p) => (
                      <option key={p.port_ID} value={p.port_ID}>
                        {p.port_Nom}
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

        <NavireTable
          search={filters.search}
          imo={filters.imo}
          compagnieId={filters.compagnieId}
          paysId={filters.paysId}
          portId={filters.portId}
          statut={filters.statut}
          dateCreation={filters.dateCreation}
        />
      </div>

      <CreateNavire
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

export default NavireList;