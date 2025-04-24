import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPay } from "../__requests/apiRequests";
  // Adjust path as needed

interface CreatePayProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreatePay: React.FC<CreatePayProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      pays_Nom: "",
    },
    validationSchema: Yup.object({
      pays_Nom: Yup.string()
        .required("Le nom du pays est requis")
        .min(2, "Minimum 2 caractères")
        .matches(
          /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
          "Le nom ne doit contenir que des lettres et des espaces"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createPay(values.pays_Nom);
        onCreated();
        onClose();
      } catch (error) {
        // already logged
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
            <h5 className="modal-title">Créer un nouveau pays</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom du pays</label>
                <input
                  type="text"
                  name="pays_Nom"
                  className={`form-control ${
                    formik.errors.pays_Nom && formik.touched.pays_Nom
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.pays_Nom}
                />
                {formik.errors.pays_Nom && formik.touched.pays_Nom && (
                  <div className="invalid-feedback">
                    {formik.errors.pays_Nom}
                  </div>
                )}
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

export default CreatePay;
