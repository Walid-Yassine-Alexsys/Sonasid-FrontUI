import React, { useRef, useState, useEffect } from "react";
import { Card, Table, Row, Col, Spinner, Button } from "react-bootstrap";
import {
  BsEye,
  BsFileEarmarkText,
  BsSearch,
  BsTrash,
  BsUpload,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  ArrivageApiRequest,
  createArrivage,
  getDevise,
} from "./core/_requests";

// Define the interface for the Arrivage form data
interface ArrivageFormValues {
  numeroFactureProforma: string;
  toleranceTonnage: string;
  dateBooking: string;
  dateLimiteChargement: string;
  coutFinancement: string;
  fretPrixDevise: string;
  dateReceptionFP: string;
  dateDepotLC: string;
  modalitePaiement: string;
  deviseId: number;
}

// Define the interface for commande
interface Commande {
  id: string;
  numeroFactureProforma: string;
  fournisseur: string;
  devise: string;
  deviseId: number;
  qualite: string;
  tonnage: number;
  tauxChange: number;
  delaiPaiement: string;
  prixUnitaire: number;
  incoterm: string;
}

const AddArrivage: React.FC = () => {
  const [searchCommandeQuery, setSearchCommandeQuery] = useState("");
  const [deviseOptions, setDeviseOptions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [userId, setUserId] = useState<string>("current-user-id"); // Placeholder for user ID

  // Initial values for Formik
  const initialValues: ArrivageFormValues = {
    numeroFactureProforma: "",
    toleranceTonnage: "",
    dateBooking: "",
    dateLimiteChargement: "",
    coutFinancement: "",
    fretPrixDevise: "",
    dateReceptionFP: "",
    dateDepotLC: "",
    modalitePaiement: "",
    deviseId: 0,
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    numeroFactureProforma: Yup.string().required("Numéro de facture requis"),
    toleranceTonnage: Yup.number()
      .typeError("Doit être un nombre")
      .required("Tolérance de tonnage requise"),
    dateBooking: Yup.date().required("Date de booking requise"),
    coutFinancement: Yup.number()
      .typeError("Doit être un nombre")
      .required("Coût de financement requis"),
    fretPrixDevise: Yup.number()
      .typeError("Doit être un nombre")
      .required("Fret requis"),
    dateReceptionFP: Yup.date().required("Date de réception requise"),
    dateDepotLC: Yup.date().required("Date de dépôt requise"),
    modalitePaiement: Yup.string().required("Modalité de paiement requise"),
    deviseId: Yup.string()
      .typeError("Devise requise")
      .required("Devise requise"),
  });

  // Calculate totals from commandes
  const calculateTotals = () => {
    let tonnageTotal = 0;
    let prixUnitaireTotal = 0;
    let delaiPaiement = 0;
    let incoterm = "";
    let tauxChange = 0;

    if (commandes.length > 0) {
      const commande = commandes[0]; // Assuming we're using first commande data
      tonnageTotal = commande.tonnage;
      prixUnitaireTotal = commande.prixUnitaire;
      delaiPaiement = parseInt(commande.delaiPaiement);
      incoterm = commande.incoterm;
      tauxChange = commande.tauxChange;
    }

    return {
      tonnageTotal,
      prixUnitaireTotal,
      delaiPaiement,
      incoterm,
      tauxChange,
    };
  };

  // Form submission handler
  const handleSubmit = async (
    values: ArrivageFormValues,
    { setSubmitting, resetForm }: FormikHelpers<ArrivageFormValues>
  ) => {
    try {
      // Show loading toast
      Swal.fire({
        title: "Création en cours...",
        html: "Veuillez patienter pendant la création de l'arrivage",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const totals = calculateTotals();

      // Map form values to API request format
      const apiRequestData: ArrivageApiRequest = {
        arrivage_DateBooking: new Date(values.dateBooking).toISOString(),
        arrivage_NumeroFactureProforma: values.numeroFactureProforma,
        arrivage_ToleranceTonnage: Number(values.toleranceTonnage),
        arrivage_CoutFinancement: Number(values.coutFinancement),
        arrivage_CoutFretEnDevise: Number(values.fretPrixDevise),
        arrivage_DeviseId: Number(values.deviseId),
        arrivage_StatutInsertion: 0,
        arrivage_DateCreation: new Date().toISOString(),
        arrivage_UserId: userId,
        arrivage_Actif: true,
        arrivage_TonnageTotal: totals.tonnageTotal,
        arrivage_DelaiPaiment: totals.delaiPaiement,
        arrivage_PrixUnitaireTotale: totals.prixUnitaireTotal,
        arrivage_Incoterm: totals.incoterm,
        arrivage_TauxChangement: totals.tauxChange,
        arrivage_ModalitePayment: values.modalitePaiement,
        arrivage_DateLimiteChargement: values.dateLimiteChargement
          ? new Date(values.dateLimiteChargement).toISOString()
          : new Date().toISOString(),
        arrivage_DateDepotLettreCredit: new Date(
          values.dateDepotLC
        ).toISOString(),
      };

      // Send API request
      await createArrivage(apiRequestData);

      // Success alert with two buttons
      Swal.fire({
        icon: "success",
        title: "Succès !",
        text: "L'arrivage a été créé avec succès",
        showCancelButton: true,
        confirmButtonText: "Créer un autre arrivage",
        cancelButtonText: "Voir la liste",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#FC5421",
        cancelButtonColor: "#6c757d",
      }).then((result) => {
        resetForm();
        setDocuments([]);

        if (result.isConfirmed) {
          // Stay on the same page
          // Do nothing, just reset
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Go to the list
          navigate("/arrivage");
        }
      });
    } catch (error) {
      console.error("Error creating arrivage:", error);

      // Error alert
      Swal.fire({
        icon: "error",
        title: "Erreur !",
        text: "Une erreur est survenue lors de la création de l'arrivage",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoirDetails = (id: string) => {
    console.log("Voir détails de la commande", id);
  };

  const handleSupprimerCommande = (id: string) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous supprimer cette commande ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Suppression de la commande", id);
        setCommandes(commandes.filter((commande) => commande.id !== id));
        Swal.fire("Supprimé !", "La commande a été supprimée.", "success");
      }
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocuments((prev) => [...prev, file]);
      // Success toast for document upload
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Document ajouté",
        text: `Le document "${file.name}" a été ajouté`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    }
  };

  const handleDeleteFile = (index: number) => {
    const fileName = documents[index].name;
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous supprimer le document "${fileName}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Document supprimé",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
      }
    });
  };

  const handleSearchCommande = () => {
    if (!searchCommandeQuery.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Attention !",
        text: "Veuillez entrer un numéro de commande",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      // Mock response
      const mockCommande = {
        id: "CMD-2025-002",
        numeroFactureProforma: "FP-2025-1002",
        fournisseur: "Tata Steel",
        devise: "USD",
        deviseId: 1, // Assuming 1 is USD
        qualite: "S235",
        tonnage: 3000,
        tauxChange: 10.3,
        delaiPaiement: "60",
        prixUnitaire: 420,
        incoterm: "FOB",
      };

      if (searchCommandeQuery === mockCommande.id) {
        setCommandes([mockCommande]);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Commande trouvée",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
      } else {
        setCommandes([]);
        Swal.fire({
          icon: "error",
          title: "Commande non trouvée",
          text: `Aucune commande trouvée avec le numéro "${searchCommandeQuery}"`,
          confirmButtonColor: "#3085d6",
        });
      }

      setIsSearching(false);
    }, 1000);
  };

  // Cancel form handler with confirmation
  const handleCancel = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Toutes les données non enregistrées seront perdues",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, quitter",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1);
      }
    });
  };

  useEffect(() => {
    const fetchDeviseData = async () => {
      const data = await getDevise();
      console.log(data); // Check if data is as expected
      // Filter or map the data as needed, in this case, we filter for active devices

      console.log(data); // Verify filtered items
      setDeviseOptions(data.items);
    };

    fetchDeviseData();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <h3 className="card-header-title mb-1">Création d'arrivage</h3>
      <Card>
        <div className="card border-0 shadow-sm rounded-3 p-8">
          <Card.Body>
            {/*  GESTION DES COMMANDES */}
            <div className="mb-5">
              <h1 className="card-header-title mb-2">
                Importation des commandes
              </h1>

              <div className="row align-items-end">
                <div className="col-md-6">
                  <div className="">
                    <label htmlFor="searchCommande" className="form-label">
                      N° de commande
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="searchCommande"
                      value={searchCommandeQuery}
                      onChange={(e) => setSearchCommandeQuery(e.target.value)}
                      placeholder="Entrez un numéro de commande"
                    />
                  </div>
                </div>
                <div className="col-md-auto d-flex align-items-center">
                  <Button
                    variant="primary"
                    onClick={handleSearchCommande}
                    disabled={isSearching}
                    className="d-flex align-items-center"
                  >
                    {isSearching ? (
                      <>
                        <span>Recherche...</span>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="ms-2 align-self-center"
                        />
                      </>
                    ) : (
                      <>
                        <span>Rechercher</span>
                        <BsSearch className="ms-2 align-self-center" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

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
                        <td>{commande.delaiPaiement} jours</td>
                        <td>{commande.prixUnitaire} €/tonne</td>
                        <td>{commande.incoterm}</td>
                        <td className="text-end">
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
          <h5 className="card-header-title mb-1">
            Formulaire de création d'arrivage
          </h5>
          <p className="card-header-subtitle mb-4" style={{ fontSize: "1rem" }}>
            Remplissez les informations pour créer un nouvel arrivage
          </p>
          <Card.Body>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched, setFieldValue, values }) => (
                <Form>
                  <Row className="mb-3">
                    <Col md={4}>
                      <div className="mb-3">
                        <label
                          htmlFor="numeroFactureProforma"
                          className="form-label"
                        >
                          N° Facture Proforma
                        </label>
                        <Field
                          type="text"
                          name="numeroFactureProforma"
                          className={`form-control ${
                            errors.numeroFactureProforma &&
                            touched.numeroFactureProforma
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Ex: FP-2025-001"
                        />
                        <ErrorMessage
                          name="numeroFactureProforma"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <label
                          htmlFor="toleranceTonnage"
                          className="form-label"
                        >
                          Tolérance Tonnage
                        </label>
                        <Field
                          type="number"
                          name="toleranceTonnage"
                          className={`form-control ${
                            errors.toleranceTonnage && touched.toleranceTonnage
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Ex: 5"
                        />
                        <ErrorMessage
                          name="toleranceTonnage"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4}>
                      <div className="mb-3">
                        <label htmlFor="dateBooking" className="form-label">
                          Date Booking
                        </label>
                        <Field
                          type="date"
                          name="dateBooking"
                          className={`form-control ${
                            errors.dateBooking && touched.dateBooking
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="dateBooking"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <label
                          htmlFor="dateLimiteChargement"
                          className="form-label"
                        >
                          Date limite de chargement (LDS){" "}
                          <span className="text-muted">(facultatif)</span>
                        </label>
                        <Field
                          type="date"
                          name="dateLimiteChargement"
                          className="form-control"
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4}>
                      <div className="mb-3">
                        <label htmlFor="coutFinancement" className="form-label">
                          Coût de financement
                        </label>
                        <Field
                          type="number"
                          name="coutFinancement"
                          className={`form-control ${
                            errors.coutFinancement && touched.coutFinancement
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Ex: 25000.00"
                        />
                        <ErrorMessage
                          name="coutFinancement"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <label htmlFor="fretPrixDevise" className="form-label">
                          Fret (Prix en Devise)
                        </label>
                        <Field
                          type="number"
                          name="fretPrixDevise"
                          className={`form-control ${
                            errors.fretPrixDevise && touched.fretPrixDevise
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="Ex: 350000.00"
                        />
                        <ErrorMessage
                          name="fretPrixDevise"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4}>
                      <div className="mb-3">
                        <label htmlFor="deviseId" className="form-label">
                          Devise
                        </label>
                        <Field
                          as="select"
                          name="deviseId"
                          className={`form-select ${
                            errors.deviseId && touched.deviseId
                              ? "is-invalid"
                              : ""
                          }`}
                        >
                          <option value="">
                            -- Sélectionner une devise --
                          </option>
                          {deviseOptions.length === 0 ? (
                            <option disabled>Loading...</option> // Show a loading message if no options
                          ) : (
                            deviseOptions.map((devise: any) => (
                              <option
                                key={devise.devise_Id}
                                value={devise.devise_Id}
                              >
                                {devise.devise_Nom}
                              </option>
                            ))
                          )}
                        </Field>
                        <ErrorMessage
                          name="deviseId"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <label htmlFor="dateReceptionFP" className="form-label">
                          Date Réception Facture Proforma
                        </label>
                        <Field
                          type="date"
                          name="dateReceptionFP"
                          className={`form-control ${
                            errors.dateReceptionFP && touched.dateReceptionFP
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="dateReceptionFP"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4}>
                      <div className="mb-3">
                        <label htmlFor="dateDepotLC" className="form-label">
                          Date dépôt LC à la banque
                        </label>
                        <Field
                          type="date"
                          name="dateDepotLC"
                          className={`form-control ${
                            errors.dateDepotLC && touched.dateDepotLC
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="dateDepotLC"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <label
                          htmlFor="modalitePaiement"
                          className="form-label"
                        >
                          Modalité de paiement
                        </label>
                        <Field
                          as="select"
                          name="modalitePaiement"
                          className={`form-select ${
                            errors.modalitePaiement && touched.modalitePaiement
                              ? "is-invalid"
                              : ""
                          }`}
                        >
                          <option value="">
                            -- Sélectionner une modalité --
                          </option>
                          <option value="LC">Lettre de Crédit</option>
                          <option value="TT">Télétransfert</option>
                          <option value="Remise documentaire">
                            Remise documentaire
                          </option>
                          <option value="Autre">Autre</option>
                        </Field>
                        <ErrorMessage
                          name="modalitePaiement"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3 align-items-end">
                    <Col md={10}>
                      {documents.length > 0 ? (
                        <div className="mt-4">
                          <h6 className="mb-3 fw-semibold">
                            Documents téléchargés
                          </h6>
                          <div className="bg-light border rounded p-3">
                            {documents.map((file, index) => (
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
                                    <div className="fw-semibold">
                                      {file.name}
                                    </div>
                                    <div className="text-muted small">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                  </div>
                                </div>
                                <BsTrash
                                  color="#dc3545"
                                  size={18}
                                  role="button"
                                  onClick={() => handleDeleteFile(index)}
                                  className="ms-3"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <h6 className="mb-3 fw-semibold">
                            Documents téléchargés
                          </h6>
                          <div className="bg-light border rounded p-3 text-muted">
                            Aucun document téléchargé
                          </div>
                        </div>
                      )}
                    </Col>
                    <Col md={2}>
                      <Button
                        style={{
                          backgroundColor: "#fc5421",
                          borderColor: "#fc5421",
                        }}
                        className="w-100 d-flex align-items-center justify-content-center text-white"
                        onClick={handleUploadClick}
                        type="button"
                      >
                        <BsUpload className="me-2" /> Télécharger
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        name="document"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </Col>
                  </Row>

                  <div className="text-end mb-4 mt-10">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={handleCancel}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Création en cours...
                        </>
                      ) : (
                        "Créer l'arrivage"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </div>
      </Card>
    </div>
  );
};

export default AddArrivage;
