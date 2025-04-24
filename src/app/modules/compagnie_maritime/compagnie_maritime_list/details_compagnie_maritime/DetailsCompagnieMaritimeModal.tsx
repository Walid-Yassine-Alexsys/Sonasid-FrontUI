import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchPays } from "../../_requests/apiRequests";

interface CompagnieMaritime {
  compagnie_Id: number;
  compagnie_NomCompagnie: string;
  compagnie_CodeIMO: string;
  compagnie_PaysId: number;
  compagnie_PaysNom?: string;
  compagnie_Adresse: string;
  compagnie_Telephone: string;
  compagnie_Email: string;
  compagnie_SiteWeb: string;
  compagnie_Active: boolean;
  compagnie_DateCreation: string;
}

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

interface DetailsCompagnieMaritimeModalProps {
  show: boolean;
  onClose: () => void;
  onEdit: () => void;
  compagnieMaritime: CompagnieMaritime;
}

const DetailsCompagnieMaritimeModal: React.FC<DetailsCompagnieMaritimeModalProps> = ({
  show,
  onClose,
  onEdit,
  compagnieMaritime,
}) => {
  const [pays, setPays] = useState<Pay[]>([]);

  useEffect(() => {
    const loadPays = async () => {
      try {
        const response: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(response.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des pays :", error);
        Swal.fire(
          "Erreur",
          error.message || "Échec du chargement des pays",
          "error"
        );
      }
    };
    loadPays();
  }, []);

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow">
          <div className="modal-header d-flex align-items-center">
            <h5 className="modal-title">Détails de la compagnie maritime</h5>
            <div className="ms-auto d-flex align-items-center">
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={onEdit}
              >
                Modifier
              </button>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Nom de la compagnie</label>
                <input
                  type="text"
                  className="form-control"
                  value={compagnieMaritime.compagnie_NomCompagnie}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Code IMO</label>
                <input
                  type="text"
                  className="form-control"
                  value={compagnieMaritime.compagnie_CodeIMO}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Pays</label>
                <select
                  className="form-control"
                  value={compagnieMaritime.compagnie_PaysId}
                  disabled
                >
                  {pays.map((p) => (
                    <option key={p.pays_id} value={p.pays_id}>
                      {p.pays_Nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Adresse</label>
                <input
                  type="text"
                  className="form-control"
                  value={compagnieMaritime.compagnie_Adresse}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Téléphone</label>
                <input
                  type="text"
                  className="form-control"
                  value={compagnieMaritime.compagnie_Telephone}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={compagnieMaritime.compagnie_Email}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Site Web</label>
                <input
                  type="url"
                  className="form-control"
                  value={compagnieMaritime.compagnie_SiteWeb}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Statut</label>
                <select
                  className="form-control"
                  value={compagnieMaritime.compagnie_Active.toString()}
                  disabled
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Date de création</label>
                <input
                  type="text"
                  className="form-control"
                  value={new Date(
                    compagnieMaritime.compagnie_DateCreation
                  ).toLocaleDateString()}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsCompagnieMaritimeModal;