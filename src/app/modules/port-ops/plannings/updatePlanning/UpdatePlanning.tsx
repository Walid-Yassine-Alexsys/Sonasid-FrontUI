import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { Form, Button, Alert, Spinner, Modal, Card, Col, Row } from "react-bootstrap";
import { fetchPlanningArrivage, updatePlanningArrivage } from "../__requests/apiRequests";
import { PageTitle } from "../../../../../_metronic/layout/core";

// Interface matching the API response format
interface PlanningArrivageResponse {
  planningArrivage_Id: number;
  planningArrivage_Statut: number;
  planningArrivage_Mois: number;
  planningArrivage_Annee: number;
  planningArrivage_DateStatut: string;
  planningArrivage_MotifRejet: string;
  planningArrivage_DateCreation: string;
  planningArrivage_UserId: string;
}

// Interface for our form values
interface PLANNING_ARRIVAGE {
  PlanningArrivage_Id: string;
  PlanningArrivage_Statut: string;
  PlanningArrivage_Mois: string;
  PlanningArrivage_Annee: string;
  PlanningArrivage_DateStatut: string;
  PlanningArrivage_MotifRejet: string;
  PlanningArrivage_DateCreation: string;
  PlanningArrivage_UserId: string;
}

const UpdatePlanning: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const validationSchema = Yup.object({
    PlanningArrivage_Statut: Yup.string()
      .required("Le statut est requis")
      .oneOf(["0", "1", "2"], "Le statut doit être 0 ou 1 ou 2"),
    PlanningArrivage_Mois: Yup.string()
      .required("Le mois est requis")
      .matches(/^(0?[1-9]|1[0-2])$/, "Le mois doit être entre 1 et 12"),
    PlanningArrivage_Annee: Yup.string()
      .required("L'année est requise")
      .matches(/^\d{4}$/, "L'année doit être au format YYYY"),
    PlanningArrivage_DateStatut: Yup.date()
      .required("La date du statut est requise")
      .typeError("Date invalide"),
    PlanningArrivage_MotifRejet: Yup.string().max(450, "Le motif ne doit pas dépasser 450 caractères"),
  });

  const formik = useFormik<PLANNING_ARRIVAGE>({
    initialValues: {
      PlanningArrivage_Id: id || "",
      PlanningArrivage_Statut: "",
      PlanningArrivage_Mois: "",
      PlanningArrivage_Annee: "",
      PlanningArrivage_DateStatut: today,
      PlanningArrivage_MotifRejet: "",
      PlanningArrivage_DateCreation: today,
      PlanningArrivage_UserId: "",
    },
    validationSchema,
    onSubmit: () => {
      setShowConfirm(true);
    },
  });
  
  const handleConfirmUpdate = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updatePlanningArrivage(formik.values);
      setSuccess("Planning mis à jour avec succès !");
      setTimeout(() => navigate("/arrivage"), 2000);
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? "Erreur : L'endpoint API est introuvable. Vérifiez l'URL ou contactez l'administrateur."
          : err.response?.status === 500
            ? "Erreur serveur : Impossible de traiter la requête. Contactez l'administrateur."
            : `Erreur lors de la mise à jour du planning : ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setFetching(true);
        setError(null);
        
        try {
          const response = await fetchPlanningArrivage(1, id);
          console.log("API Response:", response); // For debugging
          
          if (response && response.items && response.items.length > 0) {
            const planning: PlanningArrivageResponse = response.items[0];
            
            // Format the date strings to be compatible with date inputs
            const formatDateForInput = (dateString: string) => {
              if (!dateString) return today;
              const date = new Date(dateString);
              return date.toISOString().split('T')[0];
            };
            
            // Convert camelCase properties to PascalCase and convert types as needed
            formik.setValues({
              PlanningArrivage_Id: planning.planningArrivage_Id?.toString() || id,
              PlanningArrivage_Statut: planning.planningArrivage_Statut?.toString() || "",
              PlanningArrivage_Mois: planning.planningArrivage_Mois?.toString() || "",
              PlanningArrivage_Annee: planning.planningArrivage_Annee?.toString() || "",
              PlanningArrivage_DateStatut: formatDateForInput(planning.planningArrivage_DateStatut),
              PlanningArrivage_MotifRejet: planning.planningArrivage_MotifRejet || "",
              PlanningArrivage_DateCreation: formatDateForInput(planning.planningArrivage_DateCreation),
              PlanningArrivage_UserId: planning.planningArrivage_UserId || "",
            });
          } else {
            setError("Planning non trouvé pour l'ID fourni.");
          }
        } catch (err: any) {
          console.error("Error fetching data:", err);
          setError(
            err.response?.status === 404
              ? "Erreur : L'API pour récupérer les plannings est introuvable. Vérifiez l'URL."
              : err.response?.status === 500
                ? "Erreur serveur : Impossible de charger les données. Contactez l'administrateur."
                : `Erreur lors du chargement des données du planning : ${err.message}`
          );
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    } else {
      setError("ID du planning manquant.");
    }
  }, [id]);

  if (fetching) {
    return (
      <div className="container-fluid mt-4 text-center">
        <Spinner animation="border" />
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <PageTitle breadcrumbs={[]}>Modifier un Planning</PageTitle>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="border-0 shadow-sm rounded-3 p-4">
        <h1 className="mt-4 mb-12">Formulaire de modifier planning d'arrivage</h1>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Statut <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="PlanningArrivage_Statut"
                    value={formik.values.PlanningArrivage_Statut}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.PlanningArrivage_Statut && !!formik.errors.PlanningArrivage_Statut}
                    disabled={loading}
                  >
                    <option value="">Sélectionner un statut</option>
                    <option value="0">Validé</option>
                    <option value="1">Non Validé</option>
                    <option value="2">En cours de validation</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.PlanningArrivage_Statut}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Mois <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="PlanningArrivage_Mois"
                    value={formik.values.PlanningArrivage_Mois}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.PlanningArrivage_Mois && !!formik.errors.PlanningArrivage_Mois}
                    disabled={loading}
                  >
                    <option value="">Sélectionner un mois</option>
                    {[
                      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                    ].map((month, index) => (
                      <option key={index + 1} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.PlanningArrivage_Mois}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Année <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="PlanningArrivage_Annee"
                    value={formik.values.PlanningArrivage_Annee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.PlanningArrivage_Annee && !!formik.errors.PlanningArrivage_Annee}
                    placeholder="YYYY"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.PlanningArrivage_Annee}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Date Statut <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="PlanningArrivage_DateStatut"
                    value={formik.values.PlanningArrivage_DateStatut}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.PlanningArrivage_DateStatut && !!formik.errors.PlanningArrivage_DateStatut}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.PlanningArrivage_DateStatut}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Motif de Rejet</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="PlanningArrivage_MotifRejet"
                    rows={1}
                    value={formik.values.PlanningArrivage_MotifRejet}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.PlanningArrivage_MotifRejet &&
                      !!formik.errors.PlanningArrivage_MotifRejet
                    }
                    placeholder="Notes ou commentaires ..."
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.PlanningArrivage_MotifRejet}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end mt-4">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => navigate("/arrivage")}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: "#fc5421", borderColor: "#fc5421" }}
              >
                {loading ? "Chargement..." : "Mettre à jour"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la mise à jour</Modal.Title>
        </Modal.Header>
        <Modal.Body>Voulez-vous vraiment mettre à jour ce planning ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Non
          </Button>
          <Button
            style={{ backgroundColor: "#fc5421", borderColor: "#fc5421" }}
            onClick={handleConfirmUpdate}
          >
            Oui
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpdatePlanning;