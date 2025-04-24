import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createPort, fetchPays, fetchVilles } from "../_requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface Ville {
  ville_id: number;
  ville_Nom: string;
}

interface CreatePortProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

const CreatePort: React.FC<CreatePortProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);

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
      port_Nom: "",
      port_CodeIATA: "",
      port_CodeUNLOCODE: "",
      port_PaysId: 0,
      port_VilleId: 0,
      port_Latitude: 0,
      port_Longitude: 0,
    },
    validationSchema: Yup.object({
      port_Nom: Yup.string()
        .required("Le nom du port est requis")
        .min(2, "Minimum 2 caractères"),
      port_CodeIATA: Yup.string()
        .required("Le code IATA est requis")
        .matches(/^[A-Z]{3}$/, "Le code IATA doit être 3 lettres majuscules"),
      port_CodeUNLOCODE: Yup.string()
        .required("Le code UN/LOCODE est requis")
        .matches(/^[A-Z]{5}$/, "Le code UN/LOCODE doit être 5 lettres majuscules"),
      port_PaysId: Yup.number()
        .required("Le pays est requis")
        .min(1, "Sélectionnez un pays"),
      port_VilleId: Yup.number()
        .required("La ville est requise")
        .min(1, "Sélectionnez une ville"),
      port_Latitude: Yup.number()
        .required("La latitude est requise")
        .min(-90, "La latitude doit être entre -90 et 90")
        .max(90, "La latitude doit être entre -90 et 90"),
      port_Longitude: Yup.number()
        .required("La longitude est requise")
        .min(-180, "La longitude doit être entre -180 et 180")
        .max(180, "La longitude doit être entre -180 et 180"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createPort(values);
        Swal.fire("Succès", "Le port a été créé avec succès", "success");
        onCreated();
        onClose();
      } catch (err) {
        const error = err as Error;
        Swal.fire("Erreur", error.message || "Échec de la création", "error");
        console.error("Erreur création :", error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Créer un nouveau port</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nom du port</label>
                  <input
                    type="text"
                    name="port_Nom"
                    className={`form-control ${
                      formik.errors.port_Nom && formik.touched.port_Nom
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.port_Nom}
                  />
                  {formik.errors.port_Nom && formik.touched.port_Nom && (
                    <div className="invalid-feedback">{formik.errors.port_Nom}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Code IATA</label>
                  <input
                    type="text"
                    name="port_CodeIATA"
                    className={`form-control ${
                      formik.errors.port_CodeIATA && formik.touched.port_CodeIATA
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.port_CodeIATA}
                  />
                  {formik.errors.port_CodeIATA && formik.touched.port_CodeIATA && (
                    <div className="invalid-feedback">{formik.errors.port_CodeIATA}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Code UN/LOCODE</label>
                  <input
                    type="text"
                    name="port_CodeUNLOCODE"
                    className={`form-control ${
                      formik.errors.port_CodeUNLOCODE && formik.touched.port_CodeUNLOCODE
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.port_CodeUNLOCODE}
                  />
                  {formik.errors.port_CodeUNLOCODE && formik.touched.port_CodeUNLOCODE && (
                    <div className="invalid-feedback">{formik.errors.port_CodeUNLOCODE}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pays</label>
                  <select
                    name="port_PaysId"
                    className={`form-control ${
                      formik.errors.port_PaysId && formik.touched.port_PaysId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.port_PaysId}
                  >
                    <option value={0}>Sélectionner un pays</option>
                    {pays.map((p) => (
                      <option key={p.pays_id} value={p.pays_id}>
                        {p.pays_Nom}
                      </option>
                    ))}
                  </select>
                  {formik.errors.port_PaysId && formik.touched.port_PaysId && (
                    <div className="invalid-feedback">{formik.errors.port_PaysId}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Ville</label>
                  <select
                    name="port_VilleId"
                    className={`form-control ${
                      formik.errors.port_VilleId && formik.touched.port_VilleId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.port_VilleId}
                  >
                    <option value={0}>Sélectionner une ville</option>
                    {villes.map((v) => (
                      <option key={v.ville_id} value={v.ville_id}>
                        {v.ville_Nom}
                      </option>
                    ))}
                  </select>
                  {formik.errors.port_VilleId && formik.touched.port_VilleId && (
                    <div className="invalid-feedback">{formik.errors.port_VilleId}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    name="port_Latitude"
                    className={`form-control ${
                      formik.errors.port_Latitude && formik.touched.port_Latitude
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.port_Latitude}
                  />
                  {formik.errors.port_Latitude && formik.touched.port_Latitude && (
                    <div className="invalid-feedback">{formik.errors.port_Latitude}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    name="port_Longitude"
                    className={`form-control ${
                      formik.errors.port_Longitude && formik.touched.port_Longitude
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.port_Longitude}
                  />
                  {formik.errors.port_Longitude && formik.touched.port_Longitude && (
                    <div className="invalid-feedback">{formik.errors.port_Longitude}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePort;