import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createCompagnieMaritime, fetchPays } from "../_requests/apiRequests";
import { PaysResponse } from "../../pays/paysList/__partials/PaysTable";
// import { createCompagnieMaritime, fetchPays } from "../__requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface CreateCompagnieMaritimeProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateCompagnieMaritime: React.FC<CreateCompagnieMaritimeProps> = ({
  show,
  onClose,
  onCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);

  useEffect(() => {
    const loadPays = async () => {
      try {
        const response: PaysResponse = await fetchPays(1, "");
        setPays(response.items);
      } catch (err) {
        const error = err as Error; // Type cast to Error
        console.error("Erreur lors du chargement des pays :", error);
        Swal.fire(
          "Erreur",
          error.message || "Échec du chargement des pays",
          "error"
        );
      }
    };
    loadPays();
  }, []);

  const formik = useFormik({
    initialValues: {
      compagnie_NomCompagnie: "",
      compagnie_CodeIMO: "",
      compagnie_PaysId: 0,
      compagnie_Adresse: "",
      compagnie_Telephone: "",
      compagnie_Email: "",
      compagnie_SiteWeb: "",
      compagnie_Active: true,
      // compagnie_UserId: "",
    },
    validationSchema: Yup.object({
      compagnie_NomCompagnie: Yup.string()
        .required("Le nom de la compagnie est requis")
        .min(2, "Minimum 2 caractères"),
      compagnie_CodeIMO: Yup.string()
        .required("Le code IMO est requis")
        .matches(
          /IMO\d{7}/,
          "Le code IMO doit être au format IMO suivi de 7 chiffres"
        ),
      compagnie_PaysId: Yup.number()
        .required("Le pays est requis")
        .min(1, "Sélectionnez un pays"),
      compagnie_Adresse: Yup.string().required("L'adresse est requise"),
      compagnie_Telephone: Yup.string()
        .required("Le téléphone est requis")
        .matches(
          /^\+?\d{10,15}$/,
          "Le numéro de téléphone doit contenir 10 à 15 chiffres"
        ),
      compagnie_Email: Yup.string()
        .email("Adresse email invalide")
        .required("L'email est requis"),
      compagnie_SiteWeb: Yup.string().url("URL invalide").nullable(),
      compagnie_Active: Yup.boolean().required("Le statut est requis"),
      // compagnie_UserId: Yup.string().required("L'ID utilisateur est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createCompagnieMaritime(values);
        Swal.fire(
          "Succès",
          "La compagnie maritime a été créée avec succès",
          "success"
        );
        onCreated();
        onClose();
      } catch (err) {
        const error = err as Error; // Type cast to Error
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
            <h5 className="modal-title">
              Créer une nouvelle compagnie maritime
            </h5>
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
                  <label className="form-label">Nom de la compagnie</label>
                  <input
                    type="text"
                    name="compagnie_NomCompagnie"
                    className={`form-control ${
                      formik.errors.compagnie_NomCompagnie &&
                      formik.touched.compagnie_NomCompagnie
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_NomCompagnie}
                  />
                  {formik.errors.compagnie_NomCompagnie &&
                    formik.touched.compagnie_NomCompagnie && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_NomCompagnie}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Code IMO</label>
                  <input
                    type="text"
                    name="compagnie_CodeIMO"
                    className={`form-control ${
                      formik.errors.compagnie_CodeIMO &&
                      formik.touched.compagnie_CodeIMO
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_CodeIMO}
                  />
                  {formik.errors.compagnie_CodeIMO &&
                    formik.touched.compagnie_CodeIMO && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_CodeIMO}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pays</label>
                  <select
                    name="compagnie_PaysId"
                    className={`form-control ${
                      formik.errors.compagnie_PaysId &&
                      formik.touched.compagnie_PaysId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_PaysId}
                  >
                    <option value={0}>Sélectionner un pays</option>
                    {pays.map((p) => (
                      <option key={p.pays_id} value={p.pays_id}>
                        {p.pays_Nom}
                      </option>
                    ))}
                  </select>
                  {formik.errors.compagnie_PaysId &&
                    formik.touched.compagnie_PaysId && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_PaysId}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Adresse</label>
                  <input
                    type="text"
                    name="compagnie_Adresse"
                    className={`form-control ${
                      formik.errors.compagnie_Adresse &&
                      formik.touched.compagnie_Adresse
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_Adresse}
                  />
                  {formik.errors.compagnie_Adresse &&
                    formik.touched.compagnie_Adresse && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_Adresse}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="text"
                    name="compagnie_Telephone"
                    className={`form-control ${
                      formik.errors.compagnie_Telephone &&
                      formik.touched.compagnie_Telephone
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_Telephone}
                  />
                  {formik.errors.compagnie_Telephone &&
                    formik.touched.compagnie_Telephone && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_Telephone}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="compagnie_Email"
                    className={`form-control ${
                      formik.errors.compagnie_Email &&
                      formik.touched.compagnie_Email
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_Email}
                  />
                  {formik.errors.compagnie_Email &&
                    formik.touched.compagnie_Email && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_Email}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Site Web</label>
                  <input
                    type="url"
                    name="compagnie_SiteWeb"
                    className={`form-control ${
                      formik.errors.compagnie_SiteWeb &&
                      formik.touched.compagnie_SiteWeb
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_SiteWeb}
                  />
                  {formik.errors.compagnie_SiteWeb &&
                    formik.touched.compagnie_SiteWeb && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_SiteWeb}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Statut</label>
                  <select
                    name="compagnie_Active"
                    className={`form-control ${
                      formik.errors.compagnie_Active &&
                      formik.touched.compagnie_Active
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_Active.toString()}
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                  {formik.errors.compagnie_Active &&
                    formik.touched.compagnie_Active && (
                      <div className="invalid-feedback">
                        {formik.errors.compagnie_Active}
                      </div>
                    )}
                </div>
                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">Utilisateur</label>
                  <input
                    type="text"
                    name="compagnie_UserId"
                    className={`form-control ${
                      formik.errors.compagnie_UserId && formik.touched.compagnie_UserId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.compagnie_UserId}
                  />
                  {formik.errors.compagnie_UserId && formik.touched.compagnie_UserId && (
                    <div className="invalid-feedback">{formik.errors.compagnie_UserId}</div>
                  )}
                </div> */}
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

export default CreateCompagnieMaritime;
