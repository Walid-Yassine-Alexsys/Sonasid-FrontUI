import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchPays, fetchVilles } from "../../_requests/apiRequests";
// import { fetchPays, fetchVilles } from "../_requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface Ville {
  ville_id: number;
  ville_Nom: string;
}

interface Port {
  port_ID: number;
  port_Nom: string;
  port_CodeIATA: string;
  port_CodeUNLOCODE: string;
  port_PaysId: number;
  port_PaysNom?: string;
  port_VilleId: number;
  port_VilleNom?: string;
  port_Latitude: number;
  port_Longitude: number;
  port_DateCreation: string;
  port_UserId: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

interface DetailsPortModalProps {
  show: boolean;
  onClose: () => void;
  onEdit: () => void;
  port: Port;
}

const DetailsPortModal: React.FC<DetailsPortModalProps> = ({
  show,
  onClose,
  onEdit,
  port,
}) => {
  const [pays, setPays] = useState<Pay[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);

  useEffect(() => {
    const loadPays = async () => {
      try {
        const response: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(response.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des pays :", error);
        Swal.fire("Erreur", error.message || "Échec du chargement des pays", "error");
      }
    };

    const loadVilles = async () => {
      try {
        const response: FetchResponse<Ville> = await fetchVilles(1, "");
        setVilles(response.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des villes :", error);
        Swal.fire("Erreur", error.message || "Échec du chargement des villes", "error");
      }
    };

    loadPays();
    loadVilles();
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
            <h5 className="modal-title">Détails du port</h5>
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
                <label className="form-label fw-bold">Nom du port</label>
                <input
                  type="text"
                  className="form-control"
                  value={port.port_Nom}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Code IATA</label>
                <input
                  type="text"
                  className="form-control"
                  value={port.port_CodeIATA}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Code UN/LOCODE</label>
                <input
                  type="text"
                  className="form-control"
                  value={port.port_CodeUNLOCODE}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Pays</label>
                <select
                  className="form-control"
                  value={port.port_PaysId}
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
                <label className="form-label fw-bold">Ville</label>
                <select
                  className="form-control"
                  value={port.port_VilleId}
                  disabled
                >
                  {villes.map((v) => (
                    <option key={v.ville_id} value={v.ville_id}>
                      {v.ville_Nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Latitude</label>
                <input
                  type="number"
                  className="form-control"
                  value={port.port_Latitude}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Longitude</label>
                <input
                  type="number"
                  className="form-control"
                  value={port.port_Longitude}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Date de création</label>
                <input
                  type="text"
                  className="form-control"
                  value={new Date(port.port_DateCreation).toLocaleDateString()}
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

export default DetailsPortModal;