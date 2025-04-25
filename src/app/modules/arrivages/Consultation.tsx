import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Card, Table, Spinner } from "react-bootstrap";
import {
  BsEye,
  BsFileEarmarkText,
  BsSearch,
  BsTrash,
  BsUpload,
} from "react-icons/bs";
import { getArrivageById } from "./core/_requests";

const Consultation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [typeDocumentNavire, setTypeDocumentNavire] = useState("");
  const [documentsNomination, setDocumentsNomination] = useState<File[]>([]);
  const [documentsQualification, setDocumentsQualification] = useState<File[]>(
    []
  );
  const [typeDocument, setTypeDocument] = useState<string>("");

  const [qualificationForm, setQualificationForm] = useState({
    date: "",
    conforme: false,
    commentaire: "",
  });
  const [qualificationHistorique, setQualificationHistorique] = useState<any[]>(
    []
  );
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [searchCommandeQuery, setSearchCommandeQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [typePieceQualification, setTypePieceQualification] = useState("");
  const [surveillants, setSurveillants] = useState<any[]>([]);
  const [surveillantForm, setSurveillantForm] = useState({ pays: "", nom: "" });
  const paysOptions = ["Maroc", "France", "Espagne", "Italie"];
  const surveillantOptions = ["SGS Maroc", "Bureau Veritas", "Intertek"];
  const handleSupprimerCommande = (id: string) => {
    console.log("Suppression de la commande", id);
  };
  const handleVoirDetails = (id: string) => {
    console.log("Voir détails de la commande", id);
  };

  const removeSurveillant = (index: number) => {
    setSurveillants((prev) => prev.filter((_, i) => i !== index));
  };
  const [formData, setFormData] = useState<any>({
    description: "",
    numeroFactureProforma: "",
    dateReception: "",
    pays: "",
    fournisseur: "",
    devise: "",
    tonnage: "",
    tolerance: "",
    dateBooking: "",
    dateFixBuyers: "",
    coutFinancement: "",
    fretPrixDevise: "",
    dateDepotLC: "",
    modalitePaiement: "",
    dateDebutChargementReel: "",
    dateFinChargementReel: "",
    dateDepartNavire: "",
    dateArriveeNavire: "",
    poidsDraft: "",
    numeroBL: "",
    dateBL: "",
    policeAssurance: "",
    certificatOrigine: "",
    factureAssurance: "",
    dateLimiteChargement: "",
  });

  const handleUploadClick = (
    context: "nomination" | "qualification" | "documents"
  ) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e: any) => {
        const files = Array.from(e.target.files as File[]);
        if (files.length) {
          if (context === "nomination") {
            setDocumentsNomination((prev) => [...prev, ...files]);
          } else if (context === "qualification") {
            setDocumentsQualification((prev) => [...prev, ...files]);
          } else if (context === "documents") {
            setUploadedDocuments((prev) => [...prev, ...files]);
          }
        }
        e.target.value = "";
      };

      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedDocuments((prev) => [...prev, ...files]);
      e.target.value = "";
    }
  };

  const [commandes, setCommandes] = useState<
    {
      id: string;
      numeroFactureProforma: string;
      fournisseur: string;
      devise: string;
      qualite: string;
      tonnage: number;
      tauxChange: number;
      delaiPaiement: string;
      prixUnitaire: number;
      incoterm: string;
    }[]
  >([]);
  const handleSearchCommande = () => {
    setIsSearching(true);
    setTimeout(() => {
      setCommandes([
        {
          id: "CMD-2025-001",
          numeroFactureProforma: "FP-2025-1001",
          fournisseur: "ArcelorMittal",
          devise: "EUR",
          qualite: "A36",
          tonnage: 5000,
          tauxChange: 10.5,
          delaiPaiement: "30 jours",
          prixUnitaire: 450,
          incoterm: "CIF",
        },
        {
          id: "CMD-2025-002",
          numeroFactureProforma: "FP-2025-1002",
          fournisseur: "Tata Steel",
          devise: "USD",
          qualite: "S235",
          tonnage: 3000,
          tauxChange: 10.3,
          delaiPaiement: "60 jours",
          prixUnitaire: 420,
          incoterm: "FOB",
        },
      ]);

      setIsSearching(false);
    }, 1000);
  };

  const getMappedArrivage = async (id: number) => {
    try {
      const items = await getArrivageById(id);
      const item = items?.[0];

      if (!item) throw new Error("Arrivage not found");

      const mapped = {
        id: `ARR-${item.arrivage_Id.toString().padStart(4, "0")}`,
        description: item.arrivage_Description || "N/A",
        numeroFactureProforma: item.arrivage_NumeroFactureProforma,
        dateReception:"2025-05-09",
        pays: "France", // Replace with dynamic value if needed
        fournisseur: "ArcelorMittal", // Map using arrivage_FournisseurId if needed
        devise: item.arrivage_DeviseId === 1 ? "EUR" : "Unknown",
        tonnage: item.arrivage_TonnageTotal?.toString() || "0",
        tolerance: item.arrivage_ToleranceTonnage?.toString() || "0",
        dateBooking: item.arrivage_DateBooking?.split("T")[0] || "N/A",
        dateFixBuyers: "2025-01-25", // Static fallback — update if needed
        coutFinancement: item.arrivage_CoutFinancement?.toString() || "0",
        fretPrixDevise: item.arrivage_TauxChangement?.toString() || "0",
        dateDepotLC:item.arrivage_DateDepotLettreCredit?.split("T")[0] || "N/A",
        modalitePaiement: item.arrivage_ModalitePayment || "N/A",
        dateLimiteChargement:item.arrivage_DateLimiteChargement?.split("T")[0] || "N/A",
      };

      return mapped;
    } catch (error) {
      console.error("Error mapping arrivage:", error);
      return null;
    }
  };

  useEffect(() => {
    getMappedArrivage(Number(id)).then(setFormData);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" onClick={() => navigate(-1)} className="me-3">
          <i className="bi bi-arrow-left"></i>
        </Button>
        <div>
          <h1 className="card-header-title mb-1">Détails de l'arrivage {id}</h1>
        </div>
      </div>
      {JSON.stringify(formData)}
      <Card>
        <div className="card border-0 shadow-sm rounded-3 p-8">
          <Card.Body>
            {/* ✅ GESTION DES COMMANDES */}
            <div className="mb-5">
              <h1 className="card-header-title mb-2">
                Importation des commandes
              </h1>

              <Form>
                <Row className="align-items-end">
                  <Col md={6}>
                    <Form.Group controlId="searchCommande">
                      <Form.Label>N° de commande</Form.Label>
                      <Form.Control
                        type="text"
                        value={searchCommandeQuery}
                        onChange={(e) => setSearchCommandeQuery(e.target.value)}
                        placeholder="Entrez un numéro de commande"
                      />
                    </Form.Group>
                  </Col>
                  <Col md="auto">
                    <Button
                      variant="primary"
                      onClick={handleSearchCommande}
                      disabled={isSearching}
                      className="d-flex align-items-center"
                    >
                      {isSearching ? (
                        <>
                          Recherche...{" "}
                          <Spinner
                            animation="border"
                            size="sm"
                            className="ms-2"
                          />
                        </>
                      ) : (
                        <>
                          Rechercher <BsSearch className="ms-2" />
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {commandes.length > 0 && (
                <Table bordered responsive className="mt-4">
                  <thead className="table-light">
                    <tr>
                      <th>Fournisseur</th>
                      <th>Devise</th>
                      <th>Qualité</th>
                      <th>Tonnage</th>
                      <th>Taux de change</th>
                      <th>Délai de paiement</th>
                      <th>Prix unitaire Final</th>
                      <th>Incoterm</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commandes.map((commande) => (
                      <tr key={commande.id}>
                        <td>{commande.fournisseur}</td>
                        <td>{commande.devise}</td>
                        <td>{commande.qualite}</td>
                        <td>{commande.tonnage} tonnes</td>
                        <td>{commande.tauxChange}</td>
                        <td>{commande.delaiPaiement}</td>
                        <td>{commande.prixUnitaire} €/tonne</td>
                        <td>{commande.incoterm}</td>
                        <td className="text-end">
                          <span
                            role="button"
                            className="me-3"
                            onClick={() => handleVoirDetails(commande.id)}
                            title="Voir détails"
                            style={{ color: "#fd7e14", fontSize: "1.2rem" }}
                          >
                            <BsEye />
                          </span>
                          <span
                            role="button"
                            onClick={() => handleSupprimerCommande(commande.id)}
                            title="Supprimer"
                            style={{ color: "#dc3545", fontSize: "1.2rem" }}
                          >
                            <BsTrash />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Card.Body>
        </div>
      </Card>

      <Card className="mt-3">
        <div className="card border-0 shadow-sm rounded-3 p-8">
          <h1 className="card-header-title mb-1">Détails d'arrivage</h1>
          <p className="card-header-subtitle mb-4" style={{ fontSize: "1rem" }}>
            Consultez et modifiez les informations de l'arrivage
          </p>

          <Card.Body>
            <Form>
              <Row className="mb-3">
                <Col md={10}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button
                    style={{
                      backgroundColor: "#35363B",
                      borderColor: "#35363B",
                    }}
                    className="w-100 d-flex align-items-center justify-content-center text-white"
                  >
                    Enregistrer autant que version finale
                  </Button>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>N° Facture Proforma</Form.Label>
                    <Form.Control
                      type="text"
                      name="numeroFactureProforma"
                      value={formData.numeroFactureProforma}
                      onChange={handleChange}
                      placeholder="Ex: FP-2025-001"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Tolérance Tonnage</Form.Label>
                    <Form.Control
                      type="number"
                      name="toleranceTonnage"
                      value={formData.tolerance}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Date Booking</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateBooking"
                      value={formData.dateBooking}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Date limite de chargement (LDS){" "}
                      <span className="text-muted">(facultatif)</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="dateLimiteChargement"
                      value={formData.dateLimiteChargement}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Coût de financement</Form.Label>
                    <Form.Control
                      type="number"
                      name="coutFinancement"
                      value={formData.coutFinancement}
                      onChange={handleChange}
                      placeholder="Ex: 25000.00"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Fret (Prix en Devise)</Form.Label>
                    <Form.Control
                      type="number"
                      name="fretPrixDevise"
                      value={formData.fretPrixDevise}
                      onChange={handleChange}
                      placeholder="Ex: 350000.00"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Date Réception Facture Proforma</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateReceptionFP"
                      value={formData.dateReception}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Date dépôt LC à la banque</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateDepotLC"
                      value={formData.dateDepotLC}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Select
                    name="modalitePaiement"
                    value={formData.modalitePaiement} // should be "TT", "LC", etc.
                    onChange={handleChange}
                  >
                    <option value="">-- Sélectionner une modalité --</option>
                    <option value="LC">Lettre de Crédit</option>
                    <option value="TT">Télétransfert</option>
                    <option value="Remise documentaire">
                      Remise documentaire
                    </option>
                    <option value="Autre">Autre</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Onglets Logistique supplémentaires */}
              <div className="flex flex-wrap space-x-2 border-bottom pb-2 mt-4">
                {[
                  { id: "details", label: "Informations complètes" },
                  {
                    id: "infosChargement",
                    label: "Informations de chargement",
                  },
                  { id: "assurance", label: "Assurance" },

                  { id: "nominationNavire", label: "Nomination du navire" },
                  {
                    id: "nominationSurveillant",
                    label: "Nomination du Surveillant",
                  },
                  {
                    id: "qualificationArrivage",
                    label: "Qualification au port de chargement",
                  },
                  {
                    id: "informationsContrat",
                    label: "Informations du contrat",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn btn-sm me-2 ${
                      activeTab === tab.id
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="border rounded p-4 mt-3">
                {/* Onglet Informations complètes */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date limite de chargement{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="dateLimiteChargement"
                            value={formData.dateLimiteChargement}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Taux de déchargement{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="tauxDechargement"
                            value={formData.tauxDechargement}
                            onChange={handleChange}
                            placeholder="Ex: 5000 T/J"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Conditions de Half Dispatch et Demurrage
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="conditionsDispatch"
                            value={formData.conditionsDispatch}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Port de chargement</Form.Label>
                          <Form.Control
                            type="text"
                            name="portChargement"
                            value={
                              formData.portChargement || "Port de chargement"
                            }
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label>
                            Poids et qualité contractualisé{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="poidsQualite"
                            value={formData.poidsQualite}
                            onChange={handleChange}
                            placeholder="Départ / Arrivée / Moyenne"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date Signature Contrat{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="dateSignatureContrat"
                            value={formData.dateSignatureContrat}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Numéro de L.I</Form.Label>
                          <Form.Control
                            type="text"
                            name="numeroLI"
                            value={formData.numeroLI}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date Demande Licence d’import{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="dateDemandeLI"
                            value={formData.dateDemandeLI}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date Obtention Licence d’import{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="dateObtentionLI"
                            value={formData.dateObtentionLI}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Taxes</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="taxes"
                            value={formData.taxes}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Conditions d'achat</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="conditionsAchat"
                            value={formData.conditionsAchat}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Informations contractuelles</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="infosContrat"
                            value={formData.infosContrat}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3 align-items-end">
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label>Type de document</Form.Label>
                          <Form.Select
                            name="typeDocument"
                            value={typeDocument}
                            onChange={(e) => setTypeDocument(e.target.value)}
                          >
                            <option value="">
                              Sélectionner un type de document
                            </option>
                            <option value="contrat">Contrat</option>
                            <option value="demande_lc">Demande LC</option>
                            <option value="licence_import">
                              Licence d’import
                            </option>
                            <option value="certificat_radio">
                              Certificat non-radioactivité
                            </option>
                            <option value="certificat_explosif">
                              Certificat non-explosif
                            </option>
                            <option value="engagement_honneur">
                              Engagement sur l’honneur
                            </option>
                            <option value="autre">Autre</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Button
                          style={{
                            backgroundColor: "#fc5421",
                            borderColor: "#fc5421",
                          }}
                          className="w-100 d-flex align-items-center justify-content-center text-white"
                          onClick={() => handleUploadClick("documents")}
                          disabled={typeDocument === ""}
                        >
                          <BsUpload className="me-2" /> Télécharger
                        </Button>
                        <Form.Control
                          type="file"
                          ref={fileInputRef}
                          name="documentFile"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </Col>
                    </Row>
                    {uploadedDocuments.length > 0 && (
                      <div className="mt-4">
                        <h6 className="mb-3 fw-semibold">
                          Documents téléchargés
                        </h6>
                        <div className="bg-light border rounded p-3">
                          {uploadedDocuments.map((file, index) => (
                            <div
                              key={index}
                              className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                              style={{ backgroundColor: "#f9fbfc" }}
                            >
                              <div className="d-flex align-items-center gap-3">
                                <BsFileEarmarkText size={24} color="#fd7e14" />
                                <div>
                                  <div className="fw-semibold">
                                    {typeDocument || "Document"}
                                  </div>
                                  <div className="text-muted small">
                                    {file.name} (
                                    {(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </div>
                                </div>
                              </div>
                              <BsTrash
                                color="#dc3545"
                                size={18}
                                role="button"
                                onClick={() =>
                                  setUploadedDocuments((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                className="ms-3"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Onglet : Informations de chargement" */}
                {activeTab === "infosChargement" && (
                  <div className="space-y-6">
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date réelle de début de chargement
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="dateDebutChargementReel"
                            value={formData.dateDebutChargementReel}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date réelle de fin de chargement
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="dateFinChargementReel"
                            value={formData.dateFinChargementReel}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date et heure de départ du navire
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="dateDepartNavire"
                            value={formData.dateDepartNavire}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Date et heure d’arrivée du navire
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="dateArriveeNavire"
                            value={formData.dateArriveeNavire}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>
                            Poids du DRAFT de départ (B/L)
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="poidsDraft"
                            value={formData.poidsDraft}
                            onChange={handleChange}
                            placeholder="Ex: 24500"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Numéro du Bill of Lading</Form.Label>
                          <Form.Control
                            type="text"
                            name="numeroBL"
                            value={formData.numeroBL}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Date du Bill of Lading</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateBL"
                            value={formData.dateBL}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                {/* Onglet : Assurance" */}
                {activeTab === "assurance" && (
                  <div className="space-y-6">
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Police d’assurance</Form.Label>
                          <Form.Control
                            type="text"
                            name="policeAssurance"
                            value={formData.policeAssurance}
                            onChange={handleChange}
                            placeholder="Numéro police ou référence"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>
                            Certificat d’origine{" "}
                            <span className="text-muted">(facultatif)</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="certificatOrigine"
                            value={formData.certificatOrigine}
                            onChange={handleChange}
                            placeholder="Ex: Certificat N°456"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Facture</Form.Label>
                          <Form.Control
                            type="text"
                            name="factureAssurance"
                            value={formData.factureAssurance}
                            onChange={handleChange}
                            placeholder="Ex: INV-2025-001"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Onglet : Informations du contrat */}

                {activeTab === "nominationNavire" && (
                  <div className="space-y-6">
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Compagnie maritime</Form.Label>
                          <Form.Control type="text" name="compagnieMaritime" />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Nom du navire</Form.Label>
                          <Form.Control type="text" name="nomNavire" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Label>Date début chargement (LAYCAN)</Form.Label>
                        <Form.Control type="date" name="dateDebutLaycan" />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Date fin chargement (LAYCAN)</Form.Label>
                        <Form.Control type="date" name="dateFinLaycan" />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Label>Date de départ port origine</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateDepartPortOrigine"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Date d'arrivée port EL JORF</Form.Label>
                        <Form.Control type="date" name="dateArriveePortJorf" />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Label>Taux de déchargement</Form.Label>
                        <Form.Control
                          type="text"
                          name="tauxDechargementNavire"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Demurrage Rate</Form.Label>
                        <Form.Control type="text" name="demurrageRate" />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={2}>
                        <Form.Check
                          type="checkbox"
                          label="Éligible Half Dispatch"
                          name="eligibleHalfDispatch"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Montant Demurrage</Form.Label>
                        <Form.Control type="number" name="montantDemurrage" />
                      </Col>
                    </Row>
                    <Row className="mb-3 align-items-end">
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label>Type de document</Form.Label>
                          <Form.Select
                            name="typeDocumentNavire"
                            value={typeDocumentNavire}
                            onChange={(e) =>
                              setTypeDocumentNavire(e.target.value)
                            }
                          >
                            <option value="">
                              Sélectionner un type de document
                            </option>
                            <option value="charter_party">Charter Party</option>
                            <option value="declaration_navire">
                              Déclaration Navire
                            </option>
                            <option value="certificat">Certificat</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Button
                          style={{
                            backgroundColor: "#fc5421",
                            borderColor: "#fc5421",
                          }}
                          className="w-100 d-flex align-items-center justify-content-center text-white"
                          onClick={() => handleUploadClick("nomination")} // Pour le navire
                          disabled={typeDocumentNavire === ""}
                        >
                          <BsUpload className="me-2" /> Télécharger
                        </Button>

                        <Form.Control
                          type="file"
                          ref={fileInputRef}
                          name="documentNomination"
                          style={{ display: "none" }}
                        />
                      </Col>
                      {documentsNomination.length > 0 && (
                        <div className="mt-4">
                          <h6 className="mb-3 fw-semibold">
                            Documents téléchargés
                          </h6>
                          <div className="bg-light border rounded p-3">
                            {documentsNomination.map((file, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                                style={{ backgroundColor: "#f9fbfc" }}
                              >
                                <div className="d-flex align-items-center gap-3">
                                  <BsFileEarmarkText
                                    size={24}
                                    color="#fd7e14"
                                  />
                                  <div>
                                    <div className="fw-semibold">Contrat</div>
                                    <div className="text-muted small">
                                      {file.name} (
                                      {(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </div>
                                  </div>
                                </div>
                                <BsTrash
                                  color="#dc3545"
                                  size={18}
                                  role="button"
                                  onClick={() =>
                                    setDocumentsNomination((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }
                                  className="ms-3"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Row>
                  </div>
                )}
                {/* Onglet Nomination du Surveillant */}
                {activeTab === "nominationSurveillant" && (
                  <div className="space-y-6">
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Label>Pays</Form.Label>
                        <Form.Select
                          value={surveillantForm.pays}
                          onChange={(e) =>
                            setSurveillantForm({
                              ...surveillantForm,
                              pays: e.target.value,
                            })
                          }
                        >
                          <option value="">Sélectionner un pays</option>
                          {paysOptions.map((pays, index) => (
                            <option key={index} value={pays}>
                              {pays}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={4}>
                        <Form.Label>Surveillant</Form.Label>
                        <Form.Select
                          value={surveillantForm.nom}
                          onChange={(e) =>
                            setSurveillantForm({
                              ...surveillantForm,
                              nom: e.target.value,
                            })
                          }
                        >
                          <option value="">Sélectionner un surveillant</option>
                          {surveillantOptions.map((nom, index) => (
                            <option key={index} value={nom}>
                              {nom}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={4} className="d-flex align-items-end">
                        <Button
                          onClick={() =>
                            setSurveillants([...surveillants, surveillantForm])
                          }
                        >
                          Ajouter
                        </Button>
                      </Col>
                    </Row>
                    {surveillants.length > 0 && (
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Pays</th>
                            <th>Surveillant</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {surveillants.map((s, index) => (
                            <tr key={index}>
                              <td>{s.pays}</td>
                              <td>{s.nom}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeSurveillant(index)}
                                >
                                  Supprimer
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                )}

                {activeTab === "informationsContrat" && (
                  <div className="space-y-6">
                    {/* Dates et taux */}
                    <Row className="mb-3 mt-4">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Date limite de chargement *</Form.Label>
                          <Form.Control
                            type="date"
                            name="dateLimiteChargement"
                            value={formData.dateLimiteChargement || ""}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Taux de déchargement *</Form.Label>
                          <Form.Control
                            type="text"
                            name="tauxDechargement"
                            value={formData.tauxDechargement || ""}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Half Dispatch & Demurrage */}
                    <Row className="mb-3">
                      <Col md={2}>
                        <Form.Check
                          type="checkbox"
                          label="Half Dispatch"
                          name="halfDispatch"
                          checked={formData.halfDispatch || false}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              halfDispatch: e.target.checked,
                            }))
                          }
                        />
                      </Col>
                      <Col md={2}>
                        <Form.Check
                          type="checkbox"
                          label="Demurrage"
                          name="demurrage"
                          checked={formData.demurrage || false}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              demurrage: e.target.checked,
                            }))
                          }
                        />
                      </Col>
                    </Row>

                    {/* Port de chargement */}
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Port de chargement</Form.Label>
                          <Form.Select
                            name="portChargement"
                            value={formData.portChargement || ""}
                            onChange={handleChange}
                          >
                            <option value="">Sélectionner un port</option>
                            <option value="Casablanca">Casablanca</option>
                            <option value="Jorf Lasfar">Jorf Lasfar</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Upload documents */}
                    <Row className="mb-3 align-items-end">
                      <Col md={10}>
                        <Form.Group>
                          <Form.Label>Type de document</Form.Label>
                          <Form.Select
                            name="typeDocumentContrat"
                            value={formData.typeDocumentContrat || ""}
                            onChange={handleChange}
                          >
                            <option value="">
                              Sélectionner un type de document
                            </option>
                            <option value="facture">Facture proforma</option>
                            <option value="contrat">Contrat</option>
                            <option value="lc">
                              Demande LC / Engagement d'import
                            </option>
                            <option value="licence">Licence d'import</option>
                            <option value="radio">
                              Certificat non-radioactif
                            </option>
                            <option value="explosif">
                              Certificat non-explosif
                            </option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={2}>
                        <Button
                          style={{
                            backgroundColor: "#fc5421",
                            borderColor: "#dc3545",
                          }}
                          className="w-100 d-flex align-items-center justify-content-center text-white"
                          onClick={() =>
                            document.getElementById("uploadDoc")?.click()
                          }
                          disabled={!formData.typeDocumentContrat}
                        >
                          <i className="bi bi-upload me-2"></i> Télécharger
                        </Button>

                        {/* INPUT FILE CACHÉ */}
                        <Form.Control
                          type="file"
                          id="uploadDoc"
                          name="documentContrat"
                          style={{ display: "none" }}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const file: File = e.target.files[0];
                              setUploadedDocuments((prev: File[]) => [
                                ...prev,
                                file,
                              ]);
                            }
                          }}
                        />
                      </Col>
                      {/* 🧾 AFFICHAGE DES DOCUMENTS TÉLÉCHARGÉS */}
                      {uploadedDocuments.length > 0 && (
                        <div className="mt-4">
                          <h6 className="fw-semibold mb-3">
                            Documents téléchargés
                          </h6>
                          <div className="bg-light border rounded p-3">
                            {uploadedDocuments.map(
                              (file: File, index: number) => (
                                <div
                                  key={index}
                                  className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                                  style={{ backgroundColor: "#f9fbfc" }}
                                >
                                  <div className="d-flex align-items-center gap-3">
                                    <i className="bi bi-file-earmark-text-fill fs-4 text-warning" />
                                    <div>
                                      <div className="fw-semibold">
                                        {formData.typeDocumentContrat ||
                                          "Document"}
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
                                    onClick={() =>
                                      setUploadedDocuments((prev: File[]) =>
                                        prev.filter((_, i) => i !== index)
                                      )
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </Row>
                  </div>
                )}

                {/* Onglet Qualification d’arrivage */}
                {activeTab === "qualificationArrivage" && (
                  <div className="space-y-6">
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateQualification"
                          value={qualificationForm.date}
                          onChange={(e) =>
                            setQualificationForm({
                              ...qualificationForm,
                              date: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={2} className="d-flex align-items-end">
                        <Form.Check
                          type="checkbox"
                          label="Qualité Conforme"
                          checked={qualificationForm.conforme}
                          onChange={(e) =>
                            setQualificationForm({
                              ...qualificationForm,
                              conforme: e.target.checked,
                            })
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Label>Commentaire</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="commentaire"
                          rows={3}
                          value={qualificationForm.commentaire}
                          onChange={(e) =>
                            setQualificationForm({
                              ...qualificationForm,
                              commentaire: e.target.value,
                            })
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label>Type de pièce</Form.Label>
                        <Form.Select
                          value={typePieceQualification}
                          onChange={(e) =>
                            setTypePieceQualification(e.target.value)
                          }
                        >
                          <option value="">Sélectionner un type</option>
                          <option value="rapport">Rapport</option>
                          <option value="photo">Photo</option>
                        </Form.Select>
                      </Col>
                      <Col md={3} className="d-flex align-items-end">
                        <Button
                          onClick={() => handleUploadClick("qualification")} // Pour la qualification
                          disabled={typePieceQualification === ""}
                          className="w-100 bg-primary text-white"
                        >
                          <BsUpload className="me-2" /> Upload
                        </Button>

                        {documentsNomination.length > 0 && (
                          <div className="mt-4">
                            <h6 className="mb-3 fw-semibold">
                              Documents téléchargés
                            </h6>
                            <div className="bg-light border rounded p-3">
                              {documentsNomination.map((file, index) => (
                                <div
                                  key={index}
                                  className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                                  style={{ backgroundColor: "#f9fbfc" }}
                                >
                                  <div className="d-flex align-items-center gap-3">
                                    <BsFileEarmarkText
                                      size={24}
                                      color="#fd7e14"
                                    />
                                    <div>
                                      <div className="fw-semibold">Contrat</div>
                                      <div className="text-muted small">
                                        {file.name} (
                                        {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB)
                                      </div>
                                    </div>
                                  </div>
                                  <BsTrash
                                    color="#dc3545"
                                    size={18}
                                    role="button"
                                    onClick={() =>
                                      setDocumentsNomination((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      )
                                    }
                                    className="ms-3"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Form.Control
                          type="file"
                          ref={fileInputRef}
                          name="documentQualification"
                          style={{ display: "none" }}
                        />
                      </Col>
                    </Row>
                    {/* Liste des qualifications */}
                    {qualificationHistorique.length > 0 && (
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Conforme</th>
                            <th>Commentaire</th>
                          </tr>
                        </thead>
                        <tbody>
                          {qualificationHistorique.map((q, i) => (
                            <tr key={i}>
                              <td>{q.date}</td>
                              <td>{q.conforme ? "Oui" : "Non"}</td>
                              <td>{q.commentaire}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </div>
                )}
              </div>

              <div className="text-end mb-3 mt-7">
                <Button variant="primary">Enregistrer les modifications</Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </Card>
    </div>
  );
};

export default Consultation;
