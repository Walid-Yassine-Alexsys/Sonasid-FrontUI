import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createCondition } from "../__requests/apiRequest";


interface CreateConditionProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateCondition: React.FC<CreateConditionProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      Condition_Libelle: "",
    },
    validationSchema: Yup.object({
      Condition_Libelle: Yup.string()
        .required("Le libellé de la condition est requis")
        .min(2, "Minimum 2 caractères")
        .matches(
          /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'.,_-]+$/,
          "Le libellé ne doit contenir que des caractères alphanumériques et des espaces"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createCondition(values.Condition_Libelle);
        Swal.fire("Succès", "La condition a été créée avec succès", "success");
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
            <h5 className="modal-title">Créer une nouvelle condition</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Libellé de la condition</label>
                <input
                  type="text"
                  name="Condition_Libelle"
                  className={`form-control ${
                    formik.errors.Condition_Libelle && formik.touched.Condition_Libelle
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.Condition_Libelle}
                />
                {formik.errors.Condition_Libelle && formik.touched.Condition_Libelle && (
                  <div className="invalid-feedback">
                    {formik.errors.Condition_Libelle}
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

export default CreateCondition;