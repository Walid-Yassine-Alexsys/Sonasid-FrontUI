import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { createZoneDestination } from "../__requests/apiRequests";
import { fetchSites } from "../../Sites/__requests/apiRequests";

interface Site {
  site_Id: number;
  site_Nom: string;
}

interface CreateZoneDestinationProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
  // Optional current user ID, defaults to 1 if not provided
  userId?: number | string; // Support both types to match database
}

const CreateZoneDestinationModal: React.FC<CreateZoneDestinationProps> = ({ 
  show, 
  onClose, 
  onCreated,
  userId = 1
}) => {
  const [loading, setLoading] = useState(false);
  const [sitesList, setSitesList] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  
  // Get current date in YYYY-MM-DD format for default value
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadSites = async () => {
      if (!show) return;
      
      setLoadingSites(true);
      try {
        const response = await fetchSites(1, "");
        if (response && response.items) {
          setSitesList(response.items);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sites:", error);
        Swal.fire("Erreur", "Impossible de charger la liste des sites", "error");
      } finally {
        setLoadingSites(false);
      }
    };

    loadSites();
  }, [show]);

  const formik = useFormik({
    initialValues: {
      zoneDestination_Libelle: "",
      zoneDestination_SiteId: "",
      zoneDestination_DateCreation: getCurrentDate(),
    },
    validationSchema: Yup.object({
      zoneDestination_Libelle: Yup.string()
        .required("Le libellé de la zone est requis")
        .min(2, "Minimum 2 caractères"),
      zoneDestination_SiteId: Yup.string()
        .required("Veuillez sélectionner un site"),
      zoneDestination_DateCreation: Yup.string()
        .required("La date de création est requise"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createZoneDestination(
          values.zoneDestination_Libelle,
          parseInt(values.zoneDestination_SiteId, 10),
          userId, // Pass userId as-is - API function will convert to string if needed
          values.zoneDestination_DateCreation
        );
        Swal.fire("Succès", "La zone de destination a été créée avec succès", "success");
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
            <h5 className="modal-title">Créer une nouvelle zone de destination</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Libellé de la zone</label>
                <input
                  type="text"
                  name="zoneDestination_Libelle"
                  className={`form-control ${
                    formik.errors.zoneDestination_Libelle && formik.touched.zoneDestination_Libelle
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.zoneDestination_Libelle}
                />
                {formik.errors.zoneDestination_Libelle && formik.touched.zoneDestination_Libelle && (
                  <div className="invalid-feedback">
                    {formik.errors.zoneDestination_Libelle}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Site</label>
                <select
                  name="zoneDestination_SiteId"
                  className={`form-select ${
                    formik.errors.zoneDestination_SiteId && formik.touched.zoneDestination_SiteId
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.zoneDestination_SiteId}
                  disabled={loadingSites}
                >
                  <option value="">Sélectionnez un site</option>
                  {sitesList.map((site) => (
                    <option key={site.site_Id} value={site.site_Id}>
                      {site.site_Nom}
                    </option>
                  ))}
                </select>
                {formik.errors.zoneDestination_SiteId && formik.touched.zoneDestination_SiteId && (
                  <div className="invalid-feedback">
                    {formik.errors.zoneDestination_SiteId}
                  </div>
                )}
                {loadingSites && (
                  <div className="text-muted mt-1">
                    Chargement des sites...
                  </div>
                )}
              </div>

              {/* Date field */}
              <div className="mb-3">
                <label className="form-label">Date de création</label>
                <input
                  type="datetime-local"
                  name="zoneDestination_DateCreation"
                  className={`form-control ${
                    formik.errors.zoneDestination_DateCreation && formik.touched.zoneDestination_DateCreation
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={formik.handleChange}
                  value={formik.values.zoneDestination_DateCreation}
                />
                {formik.errors.zoneDestination_DateCreation && formik.touched.zoneDestination_DateCreation && (
                  <div className="invalid-feedback">
                    {formik.errors.zoneDestination_DateCreation}
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
                disabled={loading || loadingSites}
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

export default CreateZoneDestinationModal;