import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { fetchPays, fetchVilles, updatePort } from "../../_requests/apiRequests";
// import { fetchPays, fetchVilles, updatePort } from "../_requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface Ville {
  ville_id: number;
  ville_Nom: string;
}

interface Port {
  port_ID: number;
  port_Nom: string;
  port_CodeIATA: string;
  port_CodeUNLOCODE: string;
  port_PaysId: number;
  port_VilleId: number;
  port_Latitude: number;
  port_Longitude: number;
  port_DateCreation: string;
  port_UserId: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

interface EditPortModalProps {
  show: boolean;
  onClose: () => void;
  onUpdated: () => void;
  port: Port;
}

const EditPortModal: React.FC<EditPortModalProps> = ({
  show,
  onClose,
  onUpdated,
  port,
}) => {
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
      port_Nom: port.port_Nom,
      port_CodeIATA: port.port_CodeIATA,
      port_CodeUNLOCODE: port.port_CodeUNLOCODE,
      port_PaysId: port.port_PaysId,
      port_VilleId: port.port_VilleId,
      port_Latitude: port.port_Latitude,
      port_Longitude: port.port_Longitude,
    },
    enableReinitialize: true,
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
        await updatePort(port.port_ID, values);
        Swal.fire("Succès", "Le port a été modifié avec succès", "success");
        onUpdated();
        onClose();
      } catch (err) {
        const error = err as Error;
        Swal.fire("Erreur", error.message || "Échec de la modification", "error");
        console.error("Erreur modification :", error);
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
            <h5 className="modal-title">Modifier le port</h5>
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
                {loading ? "Modification..." : "Modifier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPortModal;