import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

interface ArrivageData {
  description: string;
  proformaInvoiceNumber: string;
  proformaInvoiceDate: string;
  country: string;
  supplier: string;
  currency: string;
  totalTonnage: number;
  tonnageTolerance: number;
  bookingDate: string;
  prixUnitaireFinal: number;
  coutFinancement: number;
  delaiPaiement: string;
  fret: number;
}

const Paiement: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [arrivage, setArrivage] = useState<ArrivageData | null>(null);
  const [banqueValid, setBanqueValid] = useState(false);
  const [swiftValid, setSwiftValid] = useState(false);

  const [bank, setBank] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [swiftRef, setSwiftRef] = useState("");
  const [swiftDate, setSwiftDate] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("banque");
  const [reclamationType, setReclamationType] = useState("");
  const [reclamationAmount, setReclamationAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [reclamations, setReclamations] = useState<
    { type: string; amount: string; isTreated: boolean }[]
  >([]);
  const handleAddReclamation = () => {
    if (reclamationType && reclamationAmount) {
      setReclamations((prev) => [
        ...prev,
        { type: reclamationType, amount: reclamationAmount, isTreated: false },
      ]);
      setReclamationType("");
      setReclamationAmount("");
    }
  };
  const handleMarkAsTreated = (index: number) => {
    setReclamations((prev) =>
      prev.map((rec, i) => (i === index ? { ...rec, isTreated: true } : rec))
    );
  };

  useEffect(() => {
    setArrivage({
      description: "Arrivage de ferraille E1 et E2",
      proformaInvoiceNumber: "FP-2025-0458",
      proformaInvoiceDate: "2025-01-10",
      country: "France",
      supplier: "ArcelorMittal",
      currency: "EUR",
      totalTonnage: 2000,
      tonnageTolerance: 5,
      bookingDate: "2025-01-20",
      prixUnitaireFinal: 450,
      coutFinancement: 20000,
      delaiPaiement: "60 jours",
      fret: 30000,
    });
  }, [id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...files]);
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Paiement enregistré avec succès !");
  };

  if (!arrivage) return <div>Chargement...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" onClick={() => navigate(-1)} className="me-3">
          <i className="bi bi-arrow-left"></i>
        </Button>
        <div>
          <h1 className="card-header-title mb-1">
            Paiement de l’arrivage {id}
          </h1>
        </div>
      </div>
      <Card className="mt-3">
        <div className="card border-0 shadow-sm rounded-3 p-8 row mb-3">
          <h2 className="mt-4">Informations de paiement</h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Description</label>
                <input
                  className="form-control"
                  value={arrivage.description}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label>Numéro Facture Proforma</label>
                <input
                  className="form-control"
                  value={arrivage.proformaInvoiceNumber}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Pays</label>
                <input
                  className="form-control"
                  value={arrivage.country}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label>Fournisseur</label>
                <input
                  className="form-control"
                  value={arrivage.supplier}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label>Devise</label>
                <input
                  className="form-control"
                  value={arrivage.currency}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Tonnage Total</label>
                <input
                  className="form-control"
                  value={arrivage.totalTonnage}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label>Tolérance</label>
                <input
                  className="form-control"
                  value={arrivage.tonnageTolerance}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label>Prix unitaire final</label>
                <input
                  className="form-control"
                  value={arrivage.prixUnitaireFinal}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Coût de financement</label>
                <input
                  className="form-control"
                  value={arrivage.coutFinancement}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label>Délai de paiement</label>
                <input
                  className="form-control"
                  value={arrivage.delaiPaiement}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label>Fret (Prix en Devise)</label>
                <input
                  className="form-control"
                  value={arrivage.fret}
                  disabled
                />
              </div>
            </div>
            {banqueValid && (
              <>
                <h5 className="mt-4 mb-3">Informations bancaires</h5>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Banque</label>
                    <input className="form-control" value={bank} disabled />
                  </div>
                  <div className="col-md-6">
                    <label>Compte bancaire</label>
                    <input
                      className="form-control"
                      value={accountNumber}
                      disabled
                    />
                  </div>
                </div>
              </>
            )}

            {swiftValid && (
              <>
                <h5 className="mt-4 mb-3">Informations Swift</h5>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Type de paiement</label>
                    <input
                      className="form-control"
                      value={paymentMode}
                      disabled
                    />
                  </div>
                  <div className="col-md-4">
                    <label>Date dépôt LC</label>
                    <input
                      className="form-control"
                      value={swiftDate}
                      disabled
                    />
                  </div>
                  <div className="col-md-4">
                    <label>Référence Swift</label>
                    <input className="form-control" value={swiftRef} disabled />
                  </div>
                </div>
                <div className="mb-3">
                  <label>Nombre de fichiers joints</label>
                  <input
                    className="form-control"
                    value={`${attachments.length} fichier(s)`}
                    disabled
                  />
                </div>
              </>
            )}

            {reclamations.length > 0 && (
              <>
                <h5 className="mt-4 mb-3">Réclamations</h5>
                {reclamations.map((rec, index) => (
                  <div className="row mb-3" key={index}>
                    <div className="col-md-6">
                      <label>Type</label>
                      <input
                        className="form-control"
                        value={rec.type}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Montant</label>
                      <input
                        className="form-control"
                        value={`${rec.amount} DH`}
                        disabled
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Onglets */}
            <div className="d-flex gap-2 border-bottom pb-2 mt-4">
              {[
                {
                  id: "banque",
                  label: "Nomination de la banque",
                  unlocked: true,
                },
                { id: "swift", label: "Swift", unlocked: banqueValid },
                {
                  id: "reclamation",
                  label: "Réclamation",
                  unlocked: banqueValid && swiftValid,
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const isUnlocked = tab.unlocked;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (isUnlocked) setActiveTab(tab.id);
                    }}
                    className={`btn btn-sm ${
                      isActive
                        ? "btn-primary"
                        : isUnlocked
                        ? "btn-outline-secondary"
                        : "btn-outline-secondary disabled text-muted border-muted"
                    }`}
                    style={{
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      opacity: isUnlocked ? 1 : 0.6,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="border rounded p-4 mt-3">
              {activeTab === "banque" && (
                <>
                  <div className="mb-3">
                    <label>Banque</label>
                    <select
                      className="form-select"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                    >
                      <option value="">-- Sélectionnez une banque --</option>
                      <option value="Attijariwafa Bank">
                        Attijariwafa Bank
                      </option>
                      <option value="BMCE">BMCE</option>
                      <option value="Banque Populaire">Banque Populaire</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label>Compte bancaire</label>
                    <input
                      className="form-control"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <div className="text-end">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        if (bank && accountNumber) {
                          setBanqueValid(true);
                          setActiveTab("swift");
                        } else {
                          alert(
                            "Veuillez remplir tous les champs de la section Banque."
                          );
                        }
                      }}
                    >
                      Enregistrer cette section
                    </Button>
                  </div>
                </>
              )}

              {activeTab === "swift" && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>Type de paiement</label>
                      <select
                        className="form-select"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      >
                        <option value="">-- Sélectionnez --</option>
                        <option value="LC">Lettre de Crédit</option>
                        <option value="Transfert">Transfert</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label>Date dépôt LC</label>
                      <input
                        type="date"
                        className="form-control"
                        value={swiftDate}
                        onChange={(e) => setSwiftDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Numéro Swift</label>
                      <input
                        className="form-control"
                        value={swiftRef}
                        onChange={(e) => setSwiftRef(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Fichier Swift</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      onChange={handleFileChange}
                    />
                    {attachments.length > 0 && (
                      <ul className="list-unstyled mt-2">
                        {attachments.map((file, idx) => (
                          <li key={idx}>
                            {file.name}{" "}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveFile(idx)}
                            >
                              Supprimer
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-end">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        if (paymentMode && swiftDate && swiftRef) {
                          setSwiftValid(true);
                          setActiveTab("reclamation");
                        } else {
                          alert(
                            "Veuillez remplir tous les champs de la section Swift."
                          );
                        }
                      }}
                    >
                      Enregistrer cette section
                    </Button>
                  </div>
                </>
              )}

              {activeTab === "reclamation" && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Type de réclamation</label>
                      <select
                        className="form-select"
                        value={reclamationType}
                        onChange={(e) => setReclamationType(e.target.value)}
                      >
                        <option value="">-- Sélectionnez --</option>
                        <option value="poids">Poids</option>
                        <option value="qualite">Qualité</option>
                        <option value="demurrage">Demurrage</option>
                        <option value="halfDispatch">Half-Dispatch</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>Montant de la réclamation</label>
                      <input
                        className="form-control"
                        value={reclamationAmount}
                        onChange={(e) => setReclamationAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3 text-end">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleAddReclamation}
                    >
                      Ajouter la réclamation
                    </button>
                  </div>
                  {/* Liste des réclamations enregistrées */}
                  {reclamations.length > 0 && (
                    <div className="mt-4">
                      <h5>Réclamations enregistrées</h5>
                      <ul className="list-group">
                        {reclamations.map((rec, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <span>
                              <strong>Type:</strong> {rec.type} |{" "}
                              <strong>Montant:</strong> {rec.amount} DH
                            </span>
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                rec.isTreated
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleMarkAsTreated(index)}
                              disabled={rec.isTreated}
                            >
                              {rec.isTreated
                                ? "Traité"
                                : "Marquer comme traité"}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="text-end mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate(-1)}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Enregistrer le paiement
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Paiement;
