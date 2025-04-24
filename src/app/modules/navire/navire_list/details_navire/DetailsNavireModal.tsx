import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchCompagnieMaritime, fetchPays, fetchPorts } from "../../_requests/apiRequests";
// import { fetchPays, fetchCompagnieMaritime, fetchPorts } from "../_requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface CompagnieMaritime {
  compagnie_Id: number;
  compagnie_NomCompagnie: string;
}

interface Port {
  port_ID: number;
  port_Nom: string;
}

interface Navire {
  navire_Id: number;
  navire_Nom: string;
  navire_IMO: string;
  navire_CompagnieId: number;
  navire_CompagnieNom?: string;
  navire_ImmatriculationPaysId: number;
  navire_ImmatriculationPaysNom?: string;
  navire_ImmatriculationPortId: number;
  navire_ImmatriculationPortNom?: string;
  navire_AnneeConstruction: number;
  navire_LongueurMettres: number;
  navire_LargeurMetres: number;
  navire_TonnageBrut: number;
  navire_TonnageNet: number;
  navire_DeadweightTonnage: number;
  navire_Observations: string;
  navire_ValidationStatutId: number;
  navire_DateValidationStatut: string;
  navire_Active: boolean;
  navire_DateCreation: string;
  navire_UserId: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

interface DetailsNavireModalProps {
  show: boolean;
  onClose: () => void;
  onEdit: () => void;
  navire: Navire;
}

const DetailsNavireModal: React.FC<DetailsNavireModalProps> = ({
  show,
  onClose,
  onEdit,
  navire,
}) => {
  const [pays, setPays] = useState<Pay[]>([]);
  const [compagnies, setCompagnies] = useState<CompagnieMaritime[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const paysResponse: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(paysResponse.items);
        const compagnieResponse: FetchResponse<CompagnieMaritime> = await fetchCompagnieMaritime(1, "");
        setCompagnies(compagnieResponse.items);
        const portResponse: FetchResponse<Port> = await fetchPorts(1, "");
        setPorts(portResponse.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des données :", error);
        Swal.fire(
          "Erreur",
          error.message || "Échec du chargement des données",
          "error"
        );
      }
    };
    loadData();
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
            <h5 className="modal-title">Détails du navire</h5>
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
                <label className="form-label fw-bold">Nom du navire</label>
                <input
                  type="text"
                  className="form-control"
                  value={navire.navire_Nom}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Code IMO</label>
                <input
                  type="text"
                  className="form-control"
                  value={navire.navire_IMO}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Compagnie</label>
                <select
                  className="form-control"
                  value={navire.navire_CompagnieId}
                  disabled
                >
                  {compagnies.map((c) => (
                    <option key={c.compagnie_Id} value={c.compagnie_Id}>
                      {c.compagnie_NomCompagnie}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Pays d'immatriculation</label>
                <select
                  className="form-control"
                  value={navire.navire_ImmatriculationPaysId}
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
                <label className="form-label fw-bold">Port d'immatriculation</label>
                <select
                  className="form-control"
                  value={navire.navire_ImmatriculationPortId}
                  disabled
                >
                  {ports.map((p) => (
                    <option key={p.port_ID} value={p.port_ID}>
                      {p.port_Nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Année de construction</label>
                <input
                  type="number"
                  className="form-control"
                  value={navire.navire_AnneeConstruction}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Longueur (mètres)</label>
                <input
                  type="number"
                  className="form-control"
                  value={navire.navire_LongueurMettres}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Largeur (mètres)</label>
                <input
                  type="number"
                  className="form-control"
                  value={navire.navire_LargeurMetres}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Tonnage brut</label>
                <input
                  type="number"
                  className="form-control"
                  value={navire.navire_TonnageBrut}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Tonnage net</label>
                <input
                  type="number"
                  className="form-control"
                  value={navire.navire_TonnageNet}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Tonnage de port en lourd</label>
                <input
                  type="number"
                  className="form-control"
                  value={navire.navire_DeadweightTonnage}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Observations</label>
                <textarea
                  className="form-control"
                  value={navire.navire_Observations || ""}
                  disabled
                ></textarea>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Statut de validation</label>
                <select
                  className="form-control"
                  value={navire.navire_ValidationStatutId}
                  disabled
                >
                  <option value={1}>Validé</option>
                  <option value={2}>En attente</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Statut</label>
                <select
                  className="form-control"
                  value={navire.navire_Active.toString()}
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
                    navire.navire_DateCreation
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

export default DetailsNavireModal;