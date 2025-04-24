import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createDevise } from "../__requests/apiRequests";


interface CreateDeviseProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateDevise: React.FC<CreateDeviseProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      devise_Nom: "",
      devise_Active: true,
    },
    validationSchema: Yup.object({
      devise_Nom: Yup.string()
        .required("Le nom de la devise est requis")
        .min(2, "Minimum 2 caractères")
        .matches(
          /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
          "Le nom ne doit contenir que des lettres et des espaces"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createDevise(
          values.devise_Nom,
          values.devise_Active
        );
        Swal.fire("Succès", "La devise a été créée avec succès", "success");
        onCreated();
        onClose();
      } catch (error) {
        console.error("Erreur lors de la création:", error);
        Swal.fire("Erreur", "La création a échoué", "error");
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
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Créer une nouvelle devise</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom de la devise</label>
                <input
                  type="text"
                  name="devise_Nom"
                  className={`form-control ${
                    formik.errors.devise_Nom && formik.touched.devise_Nom
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.devise_Nom}
                />
                {formik.errors.devise_Nom && formik.touched.devise_Nom && (
                  <div className="invalid-feedback">
                    {formik.errors.devise_Nom}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="devise_Active"
                    id="devise_Active"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    checked={formik.values.devise_Active}
                  />
                  <label className="form-check-label" htmlFor="devise_Active">
                    Devise active
                  </label>
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

export default CreateDevise;