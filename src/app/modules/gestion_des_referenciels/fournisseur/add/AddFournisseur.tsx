import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Fournisseur {
  Fournisseur_Id?: number; // Optional, as it’s auto-generated in DB
  Fournisseur_Nom: string;
  Fournisseur_TypeId: string;
  Fournisseur_IdentifiantFiscal: string;
  Fournisseur_RC: string;
  Fournisseur_ICE: string;
  Fournisseur_SIRET: string;
  Fournisseur_PaysId: string;
  Fournisseur_Adresse: string;
  Fournisseur_VilleId: string;
  Fournisseur_Telephone: string;
  Fournisseur_Email: string;
  Fournisseur_DeviseId: string;
  Fournisseur_ModePaiementId: string;
  Fournisseur_IBAN: string;
  Fournisseur_SWIFT: string;
  Fournisseur_RIB: string;
  Fournisseur_ContactNom: string;
  Fournisseur_ContactTelephone: string;
  Fournisseur_ContactEmail: string;
  Fournisseur_Statut: string;
  Fournisseur_DateCreation: string;
  Fournisseur_UserId: string;
  Fournisseur_Observations: string;
}

const AddFournisseur: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Fournisseur>({
    Fournisseur_Nom: "",
    Fournisseur_TypeId: "",
    Fournisseur_IdentifiantFiscal: "",
    Fournisseur_RC: "",
    Fournisseur_ICE: "",
    Fournisseur_SIRET: "",
    Fournisseur_PaysId: "",
    Fournisseur_Adresse: "",
    Fournisseur_VilleId: "",
    Fournisseur_Telephone: "",
    Fournisseur_Email: "",
    Fournisseur_DeviseId: "",
    Fournisseur_ModePaiementId: "",
    Fournisseur_IBAN: "",
    Fournisseur_SWIFT: "",
    Fournisseur_RIB: "",
    Fournisseur_ContactNom: "",
    Fournisseur_ContactTelephone: "",
    Fournisseur_ContactEmail: "",
    Fournisseur_Statut: "non activé", // Default value
    Fournisseur_DateCreation: new Date().toISOString().split("T")[0], // Today’s date
    Fournisseur_UserId: "", // Could be set based on logged-in user
    Fournisseur_Observations: "",
  });

  const [errors, setErrors] = useState<Partial<Fournisseur>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user starts typing
    if (errors[name as keyof Fournisseur]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Fournisseur> = {};
    if (!formData.Fournisseur_Nom) newErrors.Fournisseur_Nom = "Nom est requis";
    if (!formData.Fournisseur_Telephone) newErrors.Fournisseur_Telephone = "Telephone est requis";
    if (!formData.Fournisseur_ICE) newErrors.Fournisseur_ICE = "ICE est requis";
    if (formData.Fournisseur_Email && !/\S+@\S+\.\S+/.test(formData.Fournisseur_Email)) {
      newErrors.Fournisseur_Email = "Email invalide";
    }
    if( 
      formData.Fournisseur_Telephone && 
      !/^\+[0-9 ]{10,16}$/.test(formData.Fournisseur_Telephone

      )){
        newErrors.Fournisseur_Telephone = "Numéro de téléphone invalide";
    }
    if (
      formData.Fournisseur_ContactEmail &&
      !/\S+@\S+\.\S+/.test(formData.Fournisseur_ContactEmail)
    ) {
      newErrors.Fournisseur_ContactEmail = "Email de contact invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate API call to save the fournisseur
    console.log("Submitting fournisseur:", formData);
    // Example API call (replace with actual API integration):
    /*
    fetch("/api/fournisseurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => navigate("/fournisseurs"));
    */
    navigate("/fournisseurs"); // Redirect back to the fournisseur list
  };

  const translate = (key: string) => key; // Placeholder for translation

  return (
    <div className="container-fluid mt-4">
      <style>{`
      .page-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #0f172a;
        }
      .star_red{
        color: red;
        font-size: 1rem;
        font-weight: 600;
      }
        .card-header-title {
          font-size: 2rem;
          font-weight: 600;
          color: #0f172a;
        }
        .card-header-subtitle {
          color: #64748b;
          font-size: 1.1rem;
        }
        .form-label {
          font-weight: 500;
          color: #0f172a;
        }
        .form-control, .form-select {
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 1rem;
        }
        .text-danger {
          font-size: 0.85rem;
        }
      `}</style>
        <div className="mb-12 mt-5">
          <h2 className="page-title mb-1 ">Créer un nouveau fournisseur</h2>
        </div>
      <Card className="border-0 shadow-sm rounded-3 p-4">
        <h5 className="card-header-title mb-1">Formulaire de création d'un Fournisseur</h5>
        <p className="card-header-subtitle mb-4">
          
        </p>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Ligne 1: Nom, Type, ICE */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Nom")} <span className="star_red">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_Nom"
                    value={formData.Fournisseur_Nom}
                    onChange={handleChange}
                    placeholder="Ex: ArcelorMittal"
                    isInvalid={!!errors.Fournisseur_Nom}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.Fournisseur_Nom}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Type")}</Form.Label>
                  <Form.Select
                    name="Fournisseur_TypeId"
                    value={formData.Fournisseur_TypeId}
                    onChange={handleChange}
                  >
                    <option value="">{translate("SELECT TYPE")}</option>
                    <option value="1">Type 1</option>
                    <option value="2">Type 2</option>
                    {/* Add actual types from your DB */}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("ICE")}<span className="star_red">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_ICE"
                    value={formData.Fournisseur_ICE}
                    onChange={handleChange}
                    placeholder="Ex: 123456789"
                    isInvalid={!!errors.Fournisseur_ICE}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.Fournisseur_ICE}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 2: Identifiant Fiscal, RC, SIRET */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("FISCAL")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_IdentifiantFiscal"
                    value={formData.Fournisseur_IdentifiantFiscal}
                    onChange={handleChange}
                    placeholder="Ex: ABC123"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("RC")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_RC"
                    value={formData.Fournisseur_RC}
                    onChange={handleChange}
                    placeholder="Ex: RC456"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("SIRET")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_SIRET"
                    value={formData.Fournisseur_SIRET}
                    onChange={handleChange}
                    placeholder="Ex: 12345678901234"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 3: Pays, Ville, Adresse */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Pays")}</Form.Label>
                  <Form.Select
                    name="Fournisseur_PaysId"
                    value={formData.Fournisseur_PaysId}
                    onChange={handleChange}
                  >
                    <option value="">{translate("SELECT PAYS")}</option>
                    <option value="MA">Maroc</option>
                    <option value="FR">France</option>
                    {/* Add actual countries from your DB */}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Ville")}</Form.Label>
                  <Form.Select
                    name="Fournisseur_VilleId"
                    value={formData.Fournisseur_VilleId}
                    onChange={handleChange}
                  >
                    <option value="">{translate("SELECT VILLE")}</option>
                    <option value="CAS">Casablanca</option>
                    <option value="RAB">Rabat</option>
                    {/* Add actual cities from your DB */}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Adresse")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_Adresse"
                    value={formData.Fournisseur_Adresse}
                    onChange={handleChange}
                    placeholder="Ex: 123 Rue de l'Industrie"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 4: Téléphone, Email */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{translate("Telephone")}<span className="star_red">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_Telephone"
                    value={formData.Fournisseur_Telephone}
                    onChange={handleChange}
                    placeholder="Ex: +212 98 512 3456"
                    isInvalid={!!errors.Fournisseur_Telephone}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{translate("Email")}</Form.Label>
                  <Form.Control
                    type="email"
                    name="Fournisseur_Email"
                    value={formData.Fournisseur_Email}
                    onChange={handleChange}
                    placeholder="Ex: contact@fournisseur.com"
                    isInvalid={!!errors.Fournisseur_Email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.Fournisseur_Email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 5: Contact Nom, Contact Téléphone, Contact Email */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Contact Nom")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_ContactNom"
                    value={formData.Fournisseur_ContactNom}
                    onChange={handleChange}
                    placeholder="Ex: John Doe"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Contact Telephone")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_ContactTelephone"
                    value={formData.Fournisseur_ContactTelephone}
                    onChange={handleChange}
                    placeholder="Ex: +212 522 654 321"
                    isInvalid={!!errors.Fournisseur_Telephone}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("Contact Email")}</Form.Label>
                  <Form.Control
                    type="email"
                    name="FournisseurContactEmail"
                    value={formData.Fournisseur_ContactEmail}
                    onChange={handleChange}
                    placeholder="Ex: john.doe@fournisseur.com"
                    isInvalid={!!errors.Fournisseur_ContactEmail}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.Fournisseur_ContactEmail}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 6: Devise, Mode Paiement */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{translate("Devise")}</Form.Label>
                  <Form.Select
                    name="Fournisseur_DeviseId"
                    value={formData.Fournisseur_DeviseId}
                    onChange={handleChange}
                  >
                    <option value="">{translate("SELECT DEVISE")}</option>
                    <option value="MAD">MAD</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    {/* Add actual currencies from your DB */}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{translate("Mode Paiement")}</Form.Label>
                  <Form.Select
                    name="Fournisseur_ModePaiementId"
                    value={formData.Fournisseur_ModePaiementId}
                    onChange={handleChange}
                  >
                    <option value="">{translate("SELECT MODE PAIEMENT")}</option>
                    <option value="1">Virement</option>
                    <option value="2">Chèque</option>
                    {/* Add actual payment modes from your DB */}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 7: IBAN, SWIFT, RIB */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("IBAN")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_IBAN"
                    value={formData.Fournisseur_IBAN}
                    onChange={handleChange}
                    placeholder="Ex: MA12345678901234567890"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("SWIFT")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_SWIFT"
                    value={formData.Fournisseur_SWIFT}
                    onChange={handleChange}
                    placeholder="Ex: ABCDEF12"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{translate("RIB")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_RIB"
                    value={formData.Fournisseur_RIB}
                    onChange={handleChange}
                    placeholder="Ex: RIB123456"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 8: Statut, Observations */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{translate("Statut")}</Form.Label>
                  <Form.Select
                    name="Fournisseur_Statut"
                    value={formData.Fournisseur_Statut}
                    onChange={handleChange}
                  >
                    <option value="activé">{translate("ACTIVÉ")}</option>
                    <option value="non activé">{translate("NON_ACTIVÉ")}</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>{translate("User")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="Fournisseur_UserId"
                    value={formData.Fournisseur_UserId}
                    onChange={handleChange}
                    placeholder="Ex: USER123"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 9: User ID (Optional, could be hidden or auto-filled) */}
            <Row className="mb-3">
            <Col md={6}>
                <Form.Group>
                  <Form.Label>{translate("Observations")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="Fournisseur_Observations"
                    value={formData.Fournisseur_Observations}
                    onChange={handleChange}
                    placeholder="Notes ou commentaires"
                  />
                </Form.Group>
              </Col>              
            </Row>

            {/* Boutons */}
            <div className="text-end mt-4">
              <Button
                variant="secondary"
                className="me-3"
                onClick={() => navigate("/liste_fournisseurs")}
              >
                {translate("ANNULER")}
              </Button>
              <Button type="submit" style={{ backgroundColor: "#fc5421", borderColor: "#fc5421" }}>
                {translate("CRÉER FOURNISSEUR")}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddFournisseur;