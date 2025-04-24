import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card, Form, Row, Col, Button, Alert} from "react-bootstrap";
import { createPlanningArrivage } from "../__requests/apiRequests";
import { PageTitle } from "../../../../../_metronic/layout/core";
import Swal from "sweetalert2";

interface PLANNING_ARRIVAGE {
  PlanningArrivage_Statut: string;
  PlanningArrivage_Mois: string;
  PlanningArrivage_Annee: string;
  PlanningArrivage_DateStatut: string;
  PlanningArrivage_MotifRejet: string;
  PlanningArrivage_DateCreation: string;
  PlanningArrivage_UserId: string;
}

const CreatePlanning: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const formik = useFormik<PLANNING_ARRIVAGE>({
    initialValues: {
      PlanningArrivage_Statut: "",
      PlanningArrivage_Mois: "",
      PlanningArrivage_Annee: "",
      PlanningArrivage_DateStatut: today,
      PlanningArrivage_MotifRejet: "",
      PlanningArrivage_DateCreation: today,
      PlanningArrivage_UserId: "",
    },
    validationSchema: Yup.object({
      PlanningArrivage_Statut: Yup.string()
        .required("Le statut est requis")
        .oneOf(["0", "1","2"], "Le statut doit être 0 ou 1 ou 2"),
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
      PlanningArrivage_DateCreation: Yup.date()
        .required("La date de création est requise")
        .typeError("Date invalide"),
      // PlanningArrivage_UserId: Yup.string()
      //   .required("L'ID utilisateur est requis")
      //   .matches(/^\d+$/, "L'ID utilisateur doit être numérique"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        await createPlanningArrivage(values);
        await Swal.fire(
          "Ajouté!",
          "Le planning d'arrivage a été crée.",
          "success"
        );
        formik.resetForm();
        
      } catch (err: any) {
        setError(err.response?.status === 404
          ? "Erreur : L'endpoint API est introuvable. Vérifiez l'URL ou contactez l'administrateur."
          : "Erreur lors de la création du planning. Veuillez réessayer.");
        Swal.fire("Erreur", err.message || "La création a échoué", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (    
    <div className="container-fluid mt-4">
      <PageTitle breadcrumbs={[]}>Créer un Planning</PageTitle>
      
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="border-0 shadow-sm rounded-3 p-4">
        <h1 className="mt-4 mb-12">Formulaire de Creation d'un planning d'arrivage</h1>
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
              >
                <option value="">Sélectionner un mois</option>
                {[
                  "Janvier",
                  "Février",
                  "Mars",
                  "Avril",
                  "Mai",
                  "Juin",
                  "Juillet",
                  "Août",
                  "Septembre",
                  "Octobre",
                  "Novembre",
                  "Décembre",
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
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.PlanningArrivage_Annee}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {/* <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                Date Statut <span className="text-danger">*</span>
              </Form.Label><br/>
              <DatePicker
                name="PlanningArrivage_DateStatut"
                selected={
                  formik.values.PlanningArrivage_DateStatut
                    ? new Date(formik.values.PlanningArrivage_DateStatut)
                    : null
                }
                onChange={(date: Date | null) =>
                  formik.setFieldValue(
                    "PlanningArrivage_DateStatut",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                onBlur={formik.handleBlur}
                className={`form-control ${formik.touched.PlanningArrivage_DateStatut &&
                    formik.errors.PlanningArrivage_DateStatut
                    ? "is-invalid"
                    : ""
                  }`}
                dateFormat="yyyy-MM-dd"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.PlanningArrivage_DateStatut}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                Date de Création <span className="text-danger">*</span>
              </Form.Label><br/>
              <DatePicker
                name="PlanningArrivage_DateCreation"
                selected={
                  formik.values.PlanningArrivage_DateCreation
                    ? new Date(formik.values.PlanningArrivage_DateCreation)
                    : null
                }
                onChange={(date: Date | null) =>
                  formik.setFieldValue(
                    "PlanningArrivage_DateCreation",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                onBlur={formik.handleBlur}
                className={`form-control ${formik.touched.PlanningArrivage_DateCreation &&
                    formik.errors.PlanningArrivage_DateCreation
                    ? "is-invalid"
                    : ""
                  }`}
                dateFormat="yyyy-MM-dd"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.PlanningArrivage_DateCreation}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row> */}
        <Row className="mb-3">        
        {/* <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                Utilisateur <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="PlanningArrivage_UserId"
                value={formik.values.PlanningArrivage_UserId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.PlanningArrivage_UserId &&
                  !!formik.errors.PlanningArrivage_UserId
                }
                placeholder="Ex: 123"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.PlanningArrivage_UserId}
              </Form.Control.Feedback>
            </Form.Group>
          </Col> */}
          <Col md={12}>
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
            onClick={() => formik.resetForm()}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#fc5421", borderColor: "#fc5421" }}
          >
            {loading ? "Chargement..." : "Créer Planning"}
          </Button>
        </div>
      </Form>
      </Card.Body>
      </Card>
    </div>
  );
};

export default CreatePlanning;