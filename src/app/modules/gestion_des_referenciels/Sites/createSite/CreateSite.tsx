import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { fetchAllPays, fetchVilles } from "../../ville/__requests/apiResquests";
import { createSite } from "../__requests/apiRequests";


interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface Ville {
  ville_Id: number;
  ville_Nom: string;
  pays_Id: number;
}

interface CreateSiteProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateSite: React.FC<CreateSiteProps> = ({ show, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [paysList, setPaysList] = useState<Pay[]>([]);
  const [loadingPays, setLoadingPays] = useState(false);
  const [villesList, setVillesList] = useState<Ville[]>([]);
  const [loadingVilles, setLoadingVilles] = useState(false);
  const [selectedPaysId, setSelectedPaysId] = useState<string>("");

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

  useEffect(() => {
    const loadVilles = async () => {
      if (!selectedPaysId) {
        setVillesList([]);
        return;
      }

      setLoadingVilles(true);
      try {
        // Fetch all villes and filter by pays_Id
        const response = await fetchVilles(1, "");
        if (response && response.items) {
          const filteredVilles = response.items.filter(
            (ville: Ville) => ville.pays_Id === parseInt(selectedPaysId, 10)
          );
          setVillesList(filteredVilles);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error);
        Swal.fire("Erreur", "Impossible de charger la liste des villes", "error");
      } finally {
        setLoadingVilles(false);
      }
    };

    loadVilles();
  }, [selectedPaysId]);

  const formik = useFormik({
    initialValues: {
      site_Nom: "",
      site_Adresse: "",
      site_PaysId: "",
      site_VilleId: "",
      site_Actif: true,
    },
    validationSchema: Yup.object({
      site_Nom: Yup.string()
        .required("Le nom du site est requis")
        .min(2, "Minimum 2 caractères"),
      site_Adresse: Yup.string()
        .required("L'adresse du site est requise")
        .min(5, "Minimum 5 caractères"),
      site_PaysId: Yup.string()
        .required("Veuillez sélectionner un pays"),
      site_VilleId: Yup.string()
        .required("Veuillez sélectionner une ville"),
      site_Actif: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createSite(
          values.site_Nom,
          values.site_Adresse,
          parseInt(values.site_VilleId, 10),
          values.site_Actif
        );
        Swal.fire("Succès", "Le site a été créé avec succès", "success");
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

  const handlePaysChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const paysId = e.target.value;
    formik.setFieldValue("site_PaysId", paysId);
    formik.setFieldValue("site_VilleId", ""); // Reset ville selection
    setSelectedPaysId(paysId);
  };

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
            <h5 className="modal-title">Créer un nouveau site</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nom du site</label>
                <input
                  type="text"
                  name="site_Nom"
                  className={`form-control ${
                    formik.errors.site_Nom && formik.touched.site_Nom
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.site_Nom}
                />
                {formik.errors.site_Nom && formik.touched.site_Nom && (
                  <div className="invalid-feedback">
                    {formik.errors.site_Nom}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  name="site_Adresse"
                  className={`form-control ${
                    formik.errors.site_Adresse && formik.touched.site_Adresse
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.site_Adresse}
                />
                {formik.errors.site_Adresse && formik.touched.site_Adresse && (
                  <div className="invalid-feedback">
                    {formik.errors.site_Adresse}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Pays</label>
                <select
                  name="site_PaysId"
                  className={`form-select ${
                    formik.errors.site_PaysId && formik.touched.site_PaysId
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={handlePaysChange}
                  value={formik.values.site_PaysId}
                  disabled={loadingPays}
                >
                  <option value="">Sélectionnez un pays</option>
                  {paysList.map((pay) => (
                    <option key={pay.pays_id} value={pay.pays_id}>
                      {pay.pays_Nom}
                    </option>
                  ))}
                </select>
                {formik.errors.site_PaysId && formik.touched.site_PaysId && (
                  <div className="invalid-feedback">
                    {formik.errors.site_PaysId}
                  </div>
                )}
                {loadingPays && (
                  <div className="text-muted mt-1">
                    Chargement des pays...
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Ville</label>
                <select
                  name="site_VilleId"
                  className={`form-select ${
                    formik.errors.site_VilleId && formik.touched.site_VilleId
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.site_VilleId}
                  disabled={loadingVilles || !formik.values.site_PaysId}
                >
                  <option value="">Sélectionnez une ville</option>
                  {villesList.map((ville) => (
                    <option key={ville.ville_Id} value={ville.ville_Id}>
                      {ville.ville_Nom}
                    </option>
                  ))}
                </select>
                {formik.errors.site_VilleId && formik.touched.site_VilleId && (
                  <div className="invalid-feedback">
                    {formik.errors.site_VilleId}
                  </div>
                )}
                {loadingVilles && (
                  <div className="text-muted mt-1">
                    Chargement des villes...
                  </div>
                )}
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  name="site_Actif"
                  id="site_Actif"
                  className="form-check-input"
                  onChange={formik.handleChange}
                  checked={formik.values.site_Actif}
                />
                <label className="form-check-label" htmlFor="site_Actif">
                  Site actif
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
                disabled={loading || loadingPays || loadingVilles}
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

export default CreateSite;