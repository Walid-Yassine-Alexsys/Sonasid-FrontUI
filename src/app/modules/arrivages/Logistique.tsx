import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import { Button, Card, Form, Modal, Table } from "react-bootstrap";
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
}
const typeIncidentOptions = [
  { value: "technique", label: "Problème technique" },
  { value: "securite", label: "Incident de sécurité" },
  { value: "retard", label: "Retard important" },
  { value: "qualite", label: "Problème de qualité" },
  { value: "autre", label: "Autre" },
];

const documentTypesProcedure = [
  { id: "dum", name: "Document Unique de Marchandise", required: false },
  { id: "nor", name: "Notice of Readiness", required: false },
  { id: "bill-lading", name: "Bill of Lading", required: false },
  { id: "certificat-origine", name: "Certificat d'Origine", required: false },
  { id: "certificat-qualite", name: "Certificat de Qualité", required: false },
  {
    id: "autorisation-douane",
    name: "Autorisation Douanière",
    required: false,
  },
];
const Logistique: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleDechargementDateChange = (field: string, value: string) => {
    setDechargementForm((prev) => ({ ...prev, [field]: value }));
  };
  const [suiviDechargementForm, setSuiviDechargementForm] = useState({
    date: "",
    quantiteDechargee: "",
    quantiteRestante: "",
    heureFinDechargement: "",
    draftFinal: "",
    shift: "",
  });
  const [nominationValid, setNominationValid] = useState(false);
  const [surveillantValid, setSurveillantValid] = useState(false);
  const [procedureValid, setProcedureValid] = useState(false);
  const [accostageValid, setAccostageValid] = useState(false);
  const [dechargementValid, setDechargementValid] = useState(false);
  const [qualificationValid, setQualificationValid] = useState(false);
  const [autorisationValid, setAutorisationValid] = useState(false);

  const [suiviDechargement, setSuiviDechargement] = useState<any[]>([]);
  const [arrivage, setArrivage] = useState<ArrivageData | null>(null);
  const [dechargementForm, setDechargementForm] = useState({
    dateDebut: "",
    dateFin: "",
  });
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    type: "",
    date: "",
    heureSurvenue: "",
    heureResolution: "",
    commentaire: "",
  });
  const handleIncidentInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setIncidentForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitIncident = () => {
    console.log("Incident signalé:", incidentForm);
    setIsIncidentDialogOpen(false);
  };

  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("nomination");
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");

  const handleProcedureInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProcedureForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProcedureDateChange = (field: string, value: string) => {
    setProcedureForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProcedure = () => {
    console.log("Procédure enregistrée:", procedureForm);
    alert("Procédure portuaire enregistrée avec succès !");
  };
  const [procedureForm, setProcedureForm] = useState({
    numeroDUM: "",
    dateDUM: "",
    tauxCharge: "",
    dateNOR: "",
    heureNOR: "",
    dateAccostageNavire: "",
  });
  const [commandes, setCommandes] = useState([
    { id: "CMD001", qualite: "Qualité A", quantite: 100, autorise: false },
    { id: "CMD002", qualite: "Qualité B", quantite: 200, autorise: true },
    { id: "CMD003", qualite: "Qualité C", quantite: 300, autorise: false },
    { id: "CMD004", qualite: "Qualité D", quantite: 500, autorise: true },
  ]);

  const [isAutoriserDialogOpen, setIsAutoriserDialogOpen] = useState(false);
  const [commandeToAutoriser, setCommandeToAutoriser] = useState<string | null>(
    null
  );
  const [isQualificationDialogOpen, setIsQualificationDialogOpen] =
    useState(false);

  const [qualificationForm, setQualificationForm] = useState({
    dateQualification: "",
    commande: "",
    commentaire: "",
  });
  const handleApproveNavire = (id: number) => {
    console.log("Navire validé:", id);
  };
  const handleRejectNavire = (id: number) => {
    console.log("Navire rejeté:", id);
  };
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const [
    selectedSurveillantForConsultation,
    setSelectedSurveillantForConsultation,
  ] = useState<any | null>(null);

  const [surveillantForm, setSurveillantForm] = useState({
    type: "",
    pays: "",
    nom: "",
  });
  const [surveillantsData, setSurveillantsData] = useState<any[]>([]);

  const handleAddSuiviDechargement = () => {
    const newItem = {
      id: Date.now(),
      ...suiviDechargementForm,
    };
    setSuiviDechargement((prev) => [...prev, newItem]);
    setSuiviDechargementForm({
      date: "",
      quantiteDechargee: "",
      quantiteRestante: "",
      heureFinDechargement: "",
      draftFinal: "",
      shift: "",
    });
  };
  type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  const handleSuiviDechargementInputChange = (
    e: React.ChangeEvent<FormElement>
  ) => {
    const { name, value } = e.target;
    setSuiviDechargementForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuiviDechargementDateChange = (date: string) => {
    setSuiviDechargementForm((prev) => ({ ...prev, date }));
  };
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Sample data for navires table
  const naviresData = [
    {
      id: 1,
      navire: "Cargo Express",
      dateArriveeChargement: "10/02/2025",
      dateFinChargement: "15/02/2025",
      dateDepart: "16/02/2025",
      dateArriveeDecharge: "26/02/2025",
      montantDemurrage: "15000 DH",
      status: "pending",
    },
    {
      id: 2,
      navire: "Ocean Voyager",
      dateArriveeChargement: "12/02/2025",
      dateFinChargement: "18/02/2025",
      dateDepart: "19/02/2025",
      dateArriveeDecharge: "01/03/2025",
      montantDemurrage: "12000 DH",
      status: "pending",
    },
    {
      id: 3,
      navire: "Maritime Star",
      dateArriveeChargement: "15/02/2025",
      dateFinChargement: "20/02/2025",
      dateDepart: "21/02/2025",
      dateArriveeDecharge: "03/03/2025",
      montantDemurrage: "18000 DH",
      status: "pending",
    },
  ];

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
    });
  }, [id]);
  const handleOpenAutoriserDialog = (commandeId: string) => {
    setCommandeToAutoriser(commandeId);
    setIsAutoriserDialogOpen(true);
  };

  const handleAutoriserCommande = () => {
    if (commandeToAutoriser) {
      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd.id === commandeToAutoriser ? { ...cmd, autorise: true } : cmd
        )
      );
    }
    setIsAutoriserDialogOpen(false);
  };

  const handleQualificationSubmit = () => {
    console.log("Qualification enregistrée:", qualificationForm);
    setIsQualificationDialogOpen(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...files]);
    e.target.value = "";
  };
  const handleAddSurveillant = () => {
    if (surveillantForm.type && surveillantForm.nom) {
      setSurveillantsData((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: surveillantForm.type,
          pays: surveillantForm.pays,
          surveillant: surveillantForm.nom,
        },
      ]);
      setSurveillantForm({ type: "", pays: "", nom: "" });
    }
  };
  const handleRemoveFile = (index: number) => {
    setAttachments((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
            Logistique de l'arrivage {id}
          </h1>
        </div>
      </div>
      <Card className="mt-3">
        <div className="card border-0 shadow-sm rounded-3 p-8 row mb-3">
          <h1 className="mt-4">Informations logistiques</h1>
          <p className="card-header-subtitle mb-4" style={{ fontSize: "1rem" }}>
            Gérez les informations logistiques pour cet arrivage
          </p>
          <form className="row g-3">
            <div className="row mb-3">
              <div className="col-md-13">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={arrivage.description}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Numéro Facture Proforma</label>
                <input
                  type="text"
                  className="form-control"
                  value={arrivage.proformaInvoiceNumber}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  Date Réception Facture Proforma
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={arrivage.proformaInvoiceDate}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Pays</label>
                <input
                  type="text"
                  className="form-control"
                  value={arrivage.country}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Fournisseur</label>
                <input
                  type="text"
                  className="form-control"
                  value={arrivage.supplier}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Devise</label>
                <input
                  type="text"
                  className="form-control"
                  value={arrivage.currency}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Tonnage Total</label>
                <input
                  type="number"
                  className="form-control"
                  value={arrivage.totalTonnage}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Tolérance Tonnage</label>
                <input
                  type="number"
                  className="form-control"
                  value={arrivage.tonnageTolerance}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Date Booking</label>
                <input
                  type="date"
                  className="form-control"
                  value={arrivage.bookingDate}
                  disabled
                />
              </div>
            </div>

            {/* Logistics Tabs */}
            <div className="space-y-6 mt-4">
              <div className="flex flex-wrap space-x-2 border-bottom pb-2">
                {[
                  {
                    id: "nomination",
                    label: "Nomination Navire",
                    unlocked: true,
                  },
                  {
                    id: "surveillant",
                    label: "Nomination du surveillant",
                    unlocked: nominationValid,
                  },
                  {
                    id: "procedure",
                    label: "Procédure Portuaire",
                    unlocked: surveillantValid,
                  },
                  {
                    id: "accostage",
                    label: "Accostage du navire",
                    unlocked: procedureValid,
                  },
                  {
                    id: "dechargement",
                    label: "Déchargement du navire",
                    unlocked: accostageValid,
                  },
                  {
                    id: "qualification-port",
                    label: "Qualification au port de déchargement",
                    unlocked: dechargementValid,
                  },
                  {
                    id: "autorisation",
                    label: "Autorisation de Transfert",
                    unlocked: qualificationValid,
                  },
                  {
                    id: "transfert",
                    label: "Transfert au site",
                    unlocked: autorisationValid,
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
                      className={`btn btn-sm me-2 ${
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
                {/* Onglet Nomination Navire */}
                {activeTab === "nomination" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      Liste des propositions des navires
                    </h3>
                    <div className="rounded-md border mt-4">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Navire</th>
                            <th>Date d'arrivée au port de chargement</th>
                            <th>Date de fin de chargement</th>
                            <th>Date de départ</th>
                            <th>Date d'arrivée au port de déchargement</th>
                            <th>Montant de démurrage</th>{" "}
                            {/* ✅ Nouvelle colonne */}
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {naviresData.map((navire) => (
                            <tr key={navire.id}>
                              <td>{navire.navire}</td>
                              <td>{navire.dateArriveeChargement}</td>
                              <td>{navire.dateFinChargement}</td>
                              <td>{navire.dateDepart}</td>
                              <td>{navire.dateArriveeDecharge}</td>
                              <td>{navire.montantDemurrage}</td>{" "}
                              {/* ✅ Ici on affiche la vraie donnée */}
                              <td className="text-end">
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleApproveNavire(navire.id)}
                                >
                                  Valider
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleRejectNavire(navire.id)}
                                >
                                  Rejeter
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setNominationValid(true);
                          setActiveTab("surveillant");
                        }}
                      >
                        Enregistrer cette section
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "surveillant" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      Surveillant et qualification
                    </h3>

                    <div className="space-y-6">
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label">Pays</label>
                          <select
                            className="form-control"
                            value={surveillantForm.pays}
                            onChange={(e) =>
                              setSurveillantForm({
                                ...surveillantForm,
                                pays: e.target.value,
                              })
                            }
                          >
                            <option value="">Sélectionner un pays</option>
                            <option value="ma">Maroc</option>
                            <option value="fr">France</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Surveillant</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nom du surveillant"
                            value={surveillantForm.nom}
                            onChange={(e) =>
                              setSurveillantForm({
                                ...surveillantForm,
                                nom: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-3">
                        <Button onClick={handleAddSurveillant}>
                          Enregistrer
                        </Button>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-bordered mt-4">
                          <thead>
                            <tr>
                              <th>Type surveillant</th>
                              <th>Surveillant</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {surveillantsData.map((item) => (
                              <tr key={item.id}>
                                <td>{item.type}</td>
                                <td>{item.surveillant}</td>
                                <td className="text-end">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                      setSelectedSurveillantForConsultation(
                                        item
                                      );
                                      setIsConsultationDialogOpen(true);
                                    }}
                                  >
                                    Consulter
                                  </Button>
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() =>
                                      setIsQualificationDialogOpen(true)
                                    }
                                  >
                                    Qualifier
                                  </Button>

                                  <Button variant="outline-danger" size="sm">
                                    Supprimer
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSurveillantValid(true);
                          setActiveTab("procedure");
                        }}
                      >
                        Enregistrer cette section
                      </Button>
                    </div>

                    <Modal
                      show={isConsultationDialogOpen}
                      onHide={() => setIsConsultationDialogOpen(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Détails du surveillant</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {selectedSurveillantForConsultation && (
                          <>
                            <div className="mb-3">
                              <strong>Type :</strong>{" "}
                              {selectedSurveillantForConsultation.type}
                            </div>
                            <div className="mb-3">
                              <strong>Nom :</strong>{" "}
                              {selectedSurveillantForConsultation.surveillant}
                            </div>
                            <div className="mt-3">
                              <strong>Documents :</strong>
                              <div className="mt-2 p-2 border bg-light">
                                Rapport d'inspection (1.2 MB)
                              </div>
                            </div>
                          </>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setIsConsultationDialogOpen(false)}
                        >
                          Fermer
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )}

                {activeTab === "procedure" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Procédure Portuaire</h3>

                    <div className="space-y-6">
                      <div className="row">
                        <div className="col-md-4">
                          <Form.Label htmlFor="numeroDUM">N° D.U.M.</Form.Label>
                          <Form.Control
                            id="numeroDUM"
                            name="numeroDUM"
                            value={procedureForm.numeroDUM}
                            onChange={handleProcedureInputChange}
                            placeholder="Ex: DUM-2025-12345"
                          />
                        </div>
                        <div className="col-md-4">
                          <Form.Label>Date D.U.M.</Form.Label>
                          <Form.Control
                            type="date"
                            value={procedureForm.dateDUM}
                            onChange={(e) =>
                              handleProcedureDateChange(
                                "dateDUM",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <Form.Label htmlFor="tauxCharge">
                            Taux Charge
                          </Form.Label>
                          <Form.Control
                            id="tauxCharge"
                            name="tauxCharge"
                            value={procedureForm.tauxCharge}
                            onChange={handleProcedureInputChange}
                            placeholder="Ex: 5000 tonnes/jour"
                          />
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col-md-4">
                          <Form.Label>Date Notice of Readiness</Form.Label>
                          <Form.Control
                            type="date"
                            value={procedureForm.dateNOR}
                            onChange={(e) =>
                              handleProcedureDateChange(
                                "dateNOR",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Taux de déchargement</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Ex: 5000 tonnes/jour"
                              name="tauxDechargement"
                              onChange={(e) =>
                                console.log(
                                  "Taux de déchargement:",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </div>
                        <div className="col-md-4">
                          <Form.Label htmlFor="heureNOR">
                            Heure Notice of Readiness
                          </Form.Label>
                          <Form.Control
                            id="heureNOR"
                            name="heureNOR"
                            type="time"
                            value={procedureForm.heureNOR}
                            onChange={handleProcedureInputChange}
                          />
                        </div>
                        <div className="col-md-4">
                          <Form.Label>Date d'accostage du navire</Form.Label>
                          <Form.Control
                            type="date"
                            value={procedureForm.dateAccostageNavire}
                            onChange={(e) =>
                              handleProcedureDateChange(
                                "dateAccostageNavire",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-md font-medium">Pièces jointes</h4>

                        <div className="row align-items-end mb-3">
                          <div className="col-md-10">
                            <Form.Group>
                              <Form.Label>Type de document</Form.Label>
                              <Form.Select
                                name="typeDocument"
                                value={selectedDocumentType}
                                onChange={(e) =>
                                  setSelectedDocumentType(e.target.value)
                                }
                              >
                                <option value="">
                                  Sélectionner un type de document
                                </option>
                                {documentTypesProcedure.map((doc) => (
                                  <option key={doc.id} value={doc.id}>
                                    {doc.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </div>

                          <div className="col-md-2">
                            <Button
                              style={{
                                backgroundColor: "#fc5421",
                                borderColor: "#fc5421",
                              }}
                              className="w-100 d-flex align-items-center justify-content-center text-white"
                              onClick={handleUploadClick}
                              disabled={selectedDocumentType === ""}
                            >
                              Télécharger
                            </Button>
                            <Form.Control
                              type="file"
                              ref={fileInputRef}
                              name="document"
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>

                        {/* 🧾 AFFICHAGE DES DOCUMENTS TÉLÉCHARGÉS */}
                        {attachments.length > 0 && (
                          <div className="mt-4">
                            <h6 className="fw-bold mb-3">
                              Documents téléchargés
                            </h6>
                            <div className="bg-light border rounded p-3">
                              {attachments.map((file, index) => (
                                <div
                                  key={index}
                                  className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                                  style={{ backgroundColor: "#f9fbfc" }}
                                >
                                  <div className="d-flex align-items-center gap-3">
                                    <i className="bi bi-file-earmark-text-fill fs-4 text-warning" />
                                    <div>
                                      <div className="fw-semibold">
                                        {documentTypesProcedure.find(
                                          (d) => d.id === selectedDocumentType
                                        )?.name || "Document"}
                                      </div>
                                      <div className="text-muted small">
                                        {file.name} (
                                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB)
                                      </div>
                                    </div>
                                  </div>
                                  <i
                                    className="bi bi-trash-fill fs-5 text-danger"
                                    role="button"
                                    onClick={() => handleRemoveFile(index)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-end mt-4">
                        <Button
                          variant="primary"
                          onClick={() => {
                            setProcedureValid(true);
                            setActiveTab("accostage");
                          }}
                        >
                          Enregistrer cette section
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "accostage" && (
                  <div>
                    <h4>Accostage du navire</h4>
                    <Form.Group className="mb-3">
                      <Form.Label>Numéro D.U.M.</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: DUM-2025-123"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Taux de change</Form.Label>
                      <Form.Control type="number" placeholder="Ex: 10.25" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Date NOR (Notice of Readiness)</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Date d’accostage</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Type de pièce</Form.Label>
                      <Form.Select>
                        <option value="">Sélectionner un type</option>
                        <option value="bon_enlever">Bon à Enlever</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Upload Fichier</Form.Label>
                      <Form.Control type="file" />
                    </Form.Group>
                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setAccostageValid(true);
                          setActiveTab("dechargement");
                        }}
                      >
                        Enregistrer cette section
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "dechargement" && (
                  <div className="space-y-6">
                    <div className="d-flex flex-wrap">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 me-4 mb-3"
                      >
                        <i className="bi bi-calendar"></i>
                        Consulter le planning de déchargement
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 me-4 mb-3"
                        onClick={() => setIsIncidentDialogOpen(true)}
                      >
                        <i className="bi bi-exclamation-circle"></i>
                        Signaler un incident
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 mb-3"
                      >
                        <i className="bi bi-ship"></i>
                        Consulter la situation: Démurrage/Despatch
                      </Button>
                    </div>

                    <div className="row mt-4">
                      <div className="col-md-4">
                        <Form.Label>Date de début de déchargement</Form.Label>
                        <Form.Control
                          type="date"
                          value={dechargementForm.dateDebut}
                          onChange={(e) =>
                            handleDechargementDateChange(
                              "dateDebut",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <Form.Label>Date de fin de déchargement</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control
                            type="date"
                            value={dechargementForm.dateFin}
                            onChange={(e) =>
                              handleDechargementDateChange(
                                "dateFin",
                                e.target.value
                              )
                            }
                          />
                          <Button
                            className=" d-flex align-items-end"
                            onClick={handleSaveProcedure}
                          >
                            Enregistrer
                          </Button>
                        </div>
                      </div>
                    </div>

                    <h5 className="mt-4">Suivi de déchargement</h5>
                    <div className="row">
                      <div className="col-md-2">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={suiviDechargementForm.date}
                          onChange={(e) =>
                            handleSuiviDechargementDateChange(e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Label>Shift</Form.Label>
                        <Form.Select
                          name="shift"
                          value={suiviDechargementForm.shift}
                          onChange={handleSuiviDechargementInputChange}
                        >
                          <option value="">Sélectionner un shift</option>
                          <option value="shift1">Shift 1</option>
                          <option value="shift2">Shift 2</option>
                          <option value="shift3">Shift 3</option>
                        </Form.Select>
                      </div>

                      <div className="col-md-2">
                        <Form.Label>Quantité déchargée</Form.Label>
                        <Form.Control
                          name="quantiteDechargee"
                          value={suiviDechargementForm.quantiteDechargee}
                          onChange={handleSuiviDechargementInputChange}
                          placeholder="Ex: 300T"
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Label>Quantité restante</Form.Label>
                        <Form.Control
                          name="quantiteRestante"
                          value={suiviDechargementForm.quantiteRestante}
                          onChange={handleSuiviDechargementInputChange}
                          placeholder="Ex: 1700T"
                        />
                      </div>
                      <div className="col-md-3">
                        <Form.Label>Heure fin de déchargement</Form.Label>
                        <Form.Control
                          type="time"
                          name="heureFinDechargement"
                          value={suiviDechargementForm.heureFinDechargement}
                          onChange={handleSuiviDechargementInputChange}
                        />
                      </div>
                      <div className="col-md-2">
                        <Form.Label>Draft final</Form.Label>
                        <Form.Control
                          name="draftFinal"
                          value={suiviDechargementForm.draftFinal}
                          onChange={handleSuiviDechargementInputChange}
                          placeholder="Ex: 6.30"
                        />
                      </div>
                      <div className="col-md-1 d-flex align-items-end">
                        <Button
                          onClick={handleAddSuiviDechargement}
                          disabled={
                            !suiviDechargementForm.date ||
                            !suiviDechargementForm.shift ||
                            !suiviDechargementForm.quantiteDechargee ||
                            !suiviDechargementForm.quantiteRestante ||
                            !suiviDechargementForm.heureFinDechargement ||
                            !suiviDechargementForm.draftFinal
                          }
                        >
                          Enregistrer
                        </Button>
                      </div>
                    </div>

                    <div className="table-responsive mt-4">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>shift</th>
                            <th>Quantité déchargée</th>
                            <th>Quantité restante</th>
                            <th>Heure fin de déchargement</th>
                            <th>Draft final</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {suiviDechargement.map((item) => (
                            <tr key={item.id}>
                              <td>{item.date}</td>
                              <td>{item.shift}</td>
                              <td>{item.quantiteDechargee}</td>
                              <td>{item.quantiteRestante}</td>
                              <td>{item.heureFinDechargement}</td>
                              <td>{item.draftFinal}</td>
                              <td className="text-end">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  className="me-2"
                                >
                                  Modifier
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setDechargementValid(true);
                          setActiveTab("qualification-port");
                        }}
                      >
                        Enregistrer cette section
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === "qualification-port" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      Qualification au port de déchargement
                    </h3>

                    <div className="row align-items-end mb-3">
                      <div className="col-md-10">
                        <Form.Group>
                          <Form.Label>Rapport de qualification</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Form.Group>
                      </div>

                      <div className="col-md-2">
                        <Button
                          style={{
                            backgroundColor: "#fc5421",
                            borderColor: "#fc5421",
                          }}
                          className="w-100 d-flex align-items-center justify-content-center text-white"
                          onClick={() => alert("Rapport téléchargé")}
                          disabled={attachments.length === 0}
                        >
                          Télécharger
                        </Button>
                      </div>
                    </div>

                    {/* 🧾 AFFICHAGE DES DOCUMENTS TÉLÉCHARGÉS */}
                    {attachments.length > 0 && (
                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">Documents téléchargés</h6>
                        <div className="bg-light border rounded p-3">
                          {attachments.map((file, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                              style={{ backgroundColor: "#f9fbfc" }}
                            >
                              <div className="d-flex align-items-center gap-3">
                                <i className="bi bi-file-earmark-text-fill fs-4 text-warning" />
                                <div>
                                  <div className="fw-semibold">
                                    Rapport de qualification
                                  </div>
                                  <div className="text-muted small">
                                    {file.name} (
                                    {(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </div>
                                </div>
                              </div>
                              <i
                                className="bi bi-trash-fill fs-5 text-danger"
                                role="button"
                                onClick={() => handleRemoveFile(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setQualificationValid(true);
                          setActiveTab("autorisation");
                        }}
                      >
                        Enregistrer cette section
                      </Button>
                    </div>
                  </div>
                )}
                {activeTab === "autorisation" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">
                      Autorisation de transfert des commandes
                    </h3>

                    <div className="space-y-4">
                      <h4 className="text-md font-medium">
                        Liste des commandes
                      </h4>

                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>N° Commande</th>
                              <th>Qualité</th>
                              <th>Quantité</th>
                              <th>Autorisation Transfert</th>
                            </tr>
                          </thead>
                          <tbody>
                            {commandes.map((commande) => (
                              <tr key={commande.id}>
                                <td>{commande.id}</td>
                                <td>{commande.qualite}</td>
                                <td>{commande.quantite}</td>
                                <td>
                                  {commande.autorise ? (
                                    <span className="badge bg-success">
                                      Autorisé
                                    </span>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="bg-dark text-white"
                                      onClick={() =>
                                        handleOpenAutoriserDialog(commande.id)
                                      }
                                    >
                                      Autoriser
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <Modal
                      show={isAutoriserDialogOpen}
                      onHide={() => setIsAutoriserDialogOpen(false)}
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Confirmer l'autorisation</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Êtes-vous sûr de vouloir autoriser le transfert de cette
                        commande ?
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={() => setIsAutoriserDialogOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleAutoriserCommande}
                        >
                          Confirmer
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                )}
                {activeTab === "autorisation" && (
                  <div>
                    <h4>Autorisation de Transfert</h4>
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>N° Commande</th>
                          <th>Qualité</th>
                          <th>Quantité</th>
                          <th>Tonnage Commande</th>
                          <th>Tonnage Transféré</th>
                          <th>Tonnage Restant</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>CMD001</td>
                          <td>Qualité A</td>
                          <td>300</td>
                          <td>500</td>
                          <td>200</td>
                          <td>300</td>
                          <td className="text-end">
                            <Button variant="danger" size="sm">
                              Arrêter
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          setAutorisationValid(true);
                          setActiveTab("transfert");
                        }}
                      >
                        Enregistrer cette section
                      </Button>
                    </div>
                  </div>
                )}
                {activeTab === "transfert" && (
                  <div>
                    <h4>Transfert au site</h4>
                    <Form className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Numéro D.U.M.</Form.Label>
                        <Form.Select>
                          <option value="">Sélectionner un DUM</option>
                          <option>DUM-2025-001</option>
                          <option>DUM-2025-002</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Commande</Form.Label>
                        <Form.Select>
                          <option value="">Sélectionner une commande</option>
                          <option>CMD001</option>
                          <option>CMD002</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Matricule Camion</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ex: 12345-A-01"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Prestataire de chargement</Form.Label>
                        <Form.Select>
                          <option value="">Sélectionner un prestataire</option>
                          <option>Transport BENAISSA</option>
                          <option>TRANS CARGOS</option>
                        </Form.Select>
                      </Form.Group>

                      <div className="text-end">
                        <Button variant="primary">Enregistrer</Button>
                      </div>
                    </Form>

                    <h5>Historique des transferts</h5>
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>DUM</th>
                          <th>Commande</th>
                          <th>Matricule Camion</th>
                          <th>Prestataire</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>DUM-2025-001</td>
                          <td>CMD001</td>
                          <td>12345-A-01</td>
                          <td>Transport BENAISSA</td>
                          <td>2025-04-10</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                )}
                <Modal
                  show={isIncidentDialogOpen}
                  onHide={() => setIsIncidentDialogOpen(false)}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Signaler un incident</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Type d'incident</Form.Label>
                      <Form.Select
                        value={incidentForm.type}
                        onChange={(e) =>
                          setIncidentForm((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                      >
                        <option value="">
                          Sélectionner un type d'incident
                        </option>
                        {typeIncidentOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={incidentForm.date || ""}
                        onChange={(e) =>
                          setIncidentForm((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <Form.Label>Heure de survenue</Form.Label>
                        <Form.Control
                          type="time"
                          name="heureSurvenue"
                          value={incidentForm.heureSurvenue}
                          onChange={handleIncidentInputChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Label>Heure de résolution</Form.Label>
                        <Form.Control
                          type="time"
                          name="heureResolution"
                          value={incidentForm.heureResolution}
                          onChange={handleIncidentInputChange}
                        />
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Commentaire</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="commentaire"
                        value={incidentForm.commentaire}
                        onChange={handleIncidentInputChange}
                        placeholder="Description détaillée de l'incident"
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setIsIncidentDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSubmitIncident}>
                      Enregistrer
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Logistique;
