import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createQualite } from "../__requests/apiRequests";


interface CreateQualiteProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateQualite: React.FC<CreateQualiteProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      qualite_Libelle: "",
      qualite_Active: true,
    },
    validationSchema: Yup.object({
      qualite_Libelle: Yup.string()
        .required("Le libellé de la qualité est requis")
        .min(2, "Minimum 2 caractères")
        .max(100, "Maximum 100 caractères"),
      qualite_Active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
        setLoading(true);
        try {
          console.log('Form values before API call:');
          console.log('Libellé:', values.qualite_Libelle);
          console.log('Active:', values.qualite_Active);
          
          await createQualite(
            values.qualite_Libelle, 
            values.qualite_Active
          );
          onCreated();
          onClose();
        } catch (error) {
          // already logged in the API request function
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
            <h5 className="modal-title">Créer une nouvelle qualité</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Libellé de la qualité</label>
                <input
                  type="text"
                  name="qualite_Libelle"
                  className={`form-control ${
                    formik.errors.qualite_Libelle && formik.touched.qualite_Libelle
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.qualite_Libelle}
                />
                {formik.errors.qualite_Libelle && formik.touched.qualite_Libelle && (
                  <div className="invalid-feedback">
                    {formik.errors.qualite_Libelle}
                  </div>
                )}
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="qualite_Active"
                  name="qualite_Active"
                  checked={formik.values.qualite_Active}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label" htmlFor="qualite_Active">
                  Active
                </label>
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

export default CreateQualite;