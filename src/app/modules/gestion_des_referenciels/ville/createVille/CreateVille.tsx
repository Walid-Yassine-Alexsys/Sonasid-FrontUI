import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { fetchAllPays } from"../__requests/apiResquests";
import { createVille } from "../__requests/apiResquests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface CreateVilleProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateVille: React.FC<CreateVilleProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [paysList, setPaysList] = useState<Pay[]>([]);
  const [loadingPays, setLoadingPays] = useState(false);

  useEffect(() => {
    const loadPays = async () => {
      setLoadingPays(true);
      try {
        const countries = await fetchAllPays();
        setPaysList(countries);
      } catch (error) {
        console.error("Erreur lors du chargement des pays:", error);
        Swal.fire("Erreur", "Impossible de charger la liste des pays", "error");
      } finally {
        setLoadingPays(false);
      }
    };

    if (show) {
      loadPays();
    }
  }, [show]);

  const formik = useFormik({
    initialValues: {
      ville_Nom: "",
      ville_PaysId: "",
    },
    validationSchema: Yup.object({
      ville_Nom: Yup.string()
        .required("Le nom de la ville est requis")
        .min(2, "Minimum 2 caractères")
        .matches(
          /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
          "Le nom ne doit contenir que des lettres et des espaces"
        ),
      ville_PaysId: Yup.string()
        .required("Veuillez sélectionner un pays"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createVille(
          values.ville_Nom,
          parseInt(values.ville_PaysId, 10)
        );
        Swal.fire("Succès", "La ville a été créée avec succès", "success");
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
            <h5 className="modal-title">Créer une nouvelle ville</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom de la ville</label>
                <input
                  type="text"
                  name="ville_Nom"
                  className={`form-control ${
                    formik.errors.ville_Nom && formik.touched.ville_Nom
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.ville_Nom}
                />
                {formik.errors.ville_Nom && formik.touched.ville_Nom && (
                  <div className="invalid-feedback">
                    {formik.errors.ville_Nom}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Pays</label>
                <select
                  name="ville_PaysId"
                  className={`form-select ${
                    formik.errors.ville_PaysId && formik.touched.ville_PaysId
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.ville_PaysId}
                  disabled={loadingPays}
                >
                  <option value="">Sélectionnez un pays</option>
                  {paysList.map((pay) => (
                    <option key={pay.pays_id} value={pay.pays_id}>
                      {pay.pays_Nom}
                    </option>
                  ))}
                </select>
                {formik.errors.ville_PaysId && formik.touched.ville_PaysId && (
                  <div className="invalid-feedback">
                    {formik.errors.ville_PaysId}
                  </div>
                )}
                {loadingPays && (
                  <div className="text-muted mt-1">
                    Chargement des pays...
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
                disabled={loading || loadingPays}
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

export default CreateVille;