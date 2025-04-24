import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { updateFournisseurType } from "../__requests/apiRequests";
 

interface EditFournisseurTypeModalProps {
  show: boolean;
  onClose: () => void;
  onUpdated: () => void;
  fournisseurTypeId: number;
  currentLibelle: string;
}

const EditFournisseurTypeModal: React.FC<EditFournisseurTypeModalProps> = ({
  show,
  onClose,
  onUpdated,
  fournisseurTypeId,
  currentLibelle,
}) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fournisseurType_Libelle: currentLibelle,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      fournisseurType_Libelle: Yup.string()
        .required("Le libellé du type de fournisseur est requis")
        .min(2, "Minimum 2 caractères")
        .matches(
          /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
          "Le libellé ne doit contenir que des lettres et des espaces"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
         
        await updateFournisseurType(fournisseurTypeId, values.fournisseurType_Libelle.trim());
        Swal.fire("Succès", "Le type de fournisseur a été modifié avec succès", "success");
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
            <h5 className="modal-title">Modifier le type de fournisseur</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Libellé du type</label>
                <input
                  type="text"
                  name="fournisseurType_Libelle"
                  className={`form-control ${
                    formik.errors.fournisseurType_Libelle && formik.touched.fournisseurType_Libelle ? "is-invalid" : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.fournisseurType_Libelle}
                />
                {formik.errors.fournisseurType_Libelle && formik.touched.fournisseurType_Libelle && (
                  <div className="invalid-feedback">{formik.errors.fournisseurType_Libelle}</div>
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

export default EditFournisseurTypeModal;