import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchPays } from "../../_requests/apiRequests";
// import { fetchPays } from "../_requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface TypeSurveillant {
  typeSurveillant_Id: number;
  typeSurveillant_Nom: string;
}

interface Surveillant {
  surveillant_Id: number;
  surveillant_TypeSuveillantId: number;
  surveillant_TypeSuveillantNom?: string;
  surveillant_RaisonSociale: string;
  surveillant_Nom: string;
  surveillant_Prenom: string;
  surveillant_Telephone: string;
  surveillant_Email: string;
  surveillant_PaysId: number;
  surveillant_PaysNom?: string;
  surveillant_Statut: boolean;
  surveillant_Observations: string;
  surveillant_DateCreation: string;
  surveillant_UserId: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

// Static list for TypeSurveillant as a workaround
const STATIC_TYPE_SURVEILLANTS: TypeSurveillant[] = [
  { typeSurveillant_Id: 1, typeSurveillant_Nom: "Individuel" },
  { typeSurveillant_Id: 2, typeSurveillant_Nom: "Entreprise" },
];

interface DetailsSurveillantModalProps {
  show: boolean;
  onClose: () => void;
  onEdit: () => void;
  surveillant: Surveillant;
}

const DetailsSurveillantModal: React.FC<DetailsSurveillantModalProps> = ({
  show,
  onClose,
  onEdit,
  surveillant,
}) => {
  const [pays, setPays] = useState<Pay[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const paysResponse: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(paysResponse.items);
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
            <h5 className="modal-title">Détails du surveillant</h5>
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
                <label className="form-label fw-bold">Type de surveillant</label>
                <select
                  className="form-control"
                  value={surveillant.surveillant_TypeSuveillantId}
                  disabled
                >
                  {STATIC_TYPE_SURVEILLANTS.map((t) => (
                    <option key={t.typeSurveillant_Id} value={t.typeSurveillant_Id}>
                      {t.typeSurveillant_Nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Raison sociale</label>
                <input
                  type="text"
                  className="form-control"
                  value={surveillant.surveillant_RaisonSociale}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  value={surveillant.surveillant_Nom}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Prénom</label>
                <input
                  type="text"
                  className="form-control"
                  value={surveillant.surveillant_Prenom}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Téléphone</label>
                <input
                  type="text"
                  className="form-control"
                  value={surveillant.surveillant_Telephone}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={surveillant.surveillant_Email}
                  disabled
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Pays</label>
                <select
                  className="form-control"
                  value={surveillant.surveillant_PaysId}
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
                <label className="form-label fw-bold">Statut</label>
                <select
                  className="form-control"
                  value={surveillant.surveillant_Statut.toString()}
                  disabled
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Observations</label>
                <textarea
                  className="form-control"
                  value={surveillant.surveillant_Observations || ""}
                  disabled
                ></textarea>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Date de création</label>
                <input
                  type="text"
                  className="form-control"
                  value={new Date(
                    surveillant.surveillant_DateCreation
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

export default DetailsSurveillantModal;