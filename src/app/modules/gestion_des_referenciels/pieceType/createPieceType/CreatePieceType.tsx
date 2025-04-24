import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createPieceType } from "../__requests/apiRequest";


interface CreatePieceTypeProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreatePieceType: React.FC<CreatePieceTypeProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      pieceType_Libelle: "",
      pieceType_Active: true,
    },
    validationSchema: Yup.object({
      pieceType_Libelle: Yup.string()
        .required("Le libellé du type de pièce est requis")
        .min(2, "Minimum 2 caractères")
        .matches(
          /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
          "Le libellé ne doit contenir que des lettres et des espaces"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createPieceType(
          values.pieceType_Libelle,
          values.pieceType_Active
        );
        Swal.fire("Succès", "Le type de pièce a été créé avec succès", "success");
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
            <h5 className="modal-title">Créer un nouveau type de pièce</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Libellé du type de pièce</label>
                <input
                  type="text"
                  name="pieceType_Libelle"
                  className={`form-control ${
                    formik.errors.pieceType_Libelle && formik.touched.pieceType_Libelle
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.pieceType_Libelle}
                />
                {formik.errors.pieceType_Libelle && formik.touched.pieceType_Libelle && (
                  <div className="invalid-feedback">
                    {formik.errors.pieceType_Libelle}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="pieceType_Active"
                    id="pieceType_Active"
                    className="form-check-input"
                    onChange={formik.handleChange}
                    checked={formik.values.pieceType_Active}
                  />
                  <label className="form-check-label" htmlFor="pieceType_Active">
                    Type de pièce actif
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

export default CreatePieceType;