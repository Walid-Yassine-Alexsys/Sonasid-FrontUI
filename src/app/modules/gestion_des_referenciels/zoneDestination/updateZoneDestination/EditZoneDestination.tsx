import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { updateZoneDestination } from "../__requests/apiRequests";
import { fetchSites } from "../../Sites/__requests/apiRequests";

interface Site {
  site_Id: number;
  site_Nom: string;
}

interface EditZoneDestinationModalProps {
  show: boolean;
  onClose: () => void;
  onUpdated: () => void;
  zoneId: number;
  currentLibelle: string;
  currentSiteId: number;
  currentDateCreation?: string;
  userId?: number | string;
}

// Define form values type to get proper typing on errors
interface FormValues {
  zoneDestination_Libelle: string;
  zoneDestination_SiteId: string;
  zoneDestination_DateCreation: string;
}

const EditZoneDestinationModal: React.FC<EditZoneDestinationModalProps> = ({
  show,
  onClose,
  onUpdated,
  zoneId,
  currentLibelle,
  currentSiteId,
  currentDateCreation,
  userId = 1
}) => {
  const [loading, setLoading] = useState(false);
  const [sitesList, setSitesList] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);

  // Ensure return type is string and dateString is optional
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return formatDateForInput();
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return formatDateForInput();
    }
  };

  useEffect(() => {
    const loadSites = async () => {
      if (!show) return;

      setLoadingSites(true);
      try {
        const response = await fetchSites(1, "");
        if (response && response.items) setSitesList(response.items);
      } catch (error) {
        console.error("Erreur lors du chargement des sites:", error);
        Swal.fire("Erreur", "Impossible de charger la liste des sites", "error");
      } finally {
        setLoadingSites(false);
      }
    };
    loadSites();
  }, [show]);

  const formik = useFormik<FormValues>({
    initialValues: {
      zoneDestination_Libelle: currentLibelle || "",
      zoneDestination_SiteId: currentSiteId ? currentSiteId.toString() : "",
      zoneDestination_DateCreation: formatDateForInput(currentDateCreation),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      zoneDestination_Libelle: Yup.string()
        .required("Le libellé de la zone est requis")
        .min(2, "Minimum 2 caractères"),
      zoneDestination_SiteId: Yup.string().required("Veuillez sélectionner un site"),
      zoneDestination_DateCreation: Yup.string().required("La date de création est requise"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateZoneDestination(
          zoneId,
          values.zoneDestination_Libelle.trim(),
          parseInt(values.zoneDestination_SiteId, 10),
          userId,
          values.zoneDestination_DateCreation
        );
        Swal.fire("Succès", "La zone de destination a été modifiée avec succès", "success");
        onUpdated();
        onClose();
      } catch (err) {
        console.error("Erreur modification :", err);
        Swal.fire("Erreur", "Échec de la modification", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">Modifier la zone de destination</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              {/* ... other fields ... */}
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
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || loadingSites}>
                {loading ? "Modification..." : "Modifier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditZoneDestinationModal;
