import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createBanque } from "../__requests/apiRequests";


interface CreateBanqueProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateBanque: React.FC<CreateBanqueProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      banque_Nom: "",
      banque_NumeroCompte: "",
      banque_Active: true,
    },
    validationSchema: Yup.object({
      banque_Nom: Yup.string()
        .required("Le nom de la banque est requis")
        .min(2, "Minimum 2 caractères")
        .max(100, "Maximum 100 caractères"),
      banque_NumeroCompte: Yup.string()
        .required("Le numéro de compte est requis")
        .min(5, "Minimum 5 caractères")
        .max(50, "Maximum 50 caractères"),
      banque_Active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
        setLoading(true);
        try {
          console.log('Form values before API call:');
          console.log('Name:', values.banque_Nom);
          console.log('Account Number:', values.banque_NumeroCompte);
          console.log('Active:', values.banque_Active);
          
          await createBanque(
            values.banque_Nom, 
            values.banque_NumeroCompte, 
            values.banque_Active
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
            <h5 className="modal-title">Créer une nouvelle banque</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom de la banque</label>
                <input
                  type="text"
                  name="banque_Nom"
                  className={`form-control ${
                    formik.errors.banque_Nom && formik.touched.banque_Nom
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.banque_Nom}
                />
                {formik.errors.banque_Nom && formik.touched.banque_Nom && (
                  <div className="invalid-feedback">
                    {formik.errors.banque_Nom}
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <label className="form-label">Numéro de compte</label>
                <input
                  type="text"
                  name="banque_NumeroCompte"
                  className={`form-control ${
                    formik.errors.banque_NumeroCompte && formik.touched.banque_NumeroCompte
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.banque_NumeroCompte}
                />
                {formik.errors.banque_NumeroCompte && formik.touched.banque_NumeroCompte && (
                  <div className="invalid-feedback">
                    {formik.errors.banque_NumeroCompte}
                  </div>
                )}
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="banque_Active"
                  name="banque_Active"
                  checked={formik.values.banque_Active}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label" htmlFor="banque_Active">
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

export default CreateBanque;