import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { updatePay } from "../__requests/apiRequests";
 

interface EditPayModalProps {
  show: boolean;
  onClose: () => void;
  onUpdated: () => void;
  payId: number;
  currentName: string;
}

const EditPayModal: React.FC<EditPayModalProps> = ({
  show,
  onClose,
  onUpdated,
  payId,
  currentName,
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      pays_Nom: currentName,
    },
    enableReinitialize: true,
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
         
        await updatePay(payId, values.pays_Nom.trim());
        Swal.fire("Succès", "Le pays a été modifié avec succès", "success");
        onUpdated();
        onClose();
      } catch (err) {
        Swal.fire("Erreur", "Échec de la modification", "error");
        console.error("Erreur modification :", err);
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
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Modifier le pays</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom du pays</label>
                <input
                  type="text"
                  name="pays_Nom"
                  className={`form-control ${
                    formik.errors.pays_Nom && formik.touched.pays_Nom ? "is-invalid" : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.pays_Nom}
                />
                {formik.errors.pays_Nom && formik.touched.pays_Nom && (
                  <div className="invalid-feedback">{formik.errors.pays_Nom}</div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Modification..." : "Modifier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPayModal;