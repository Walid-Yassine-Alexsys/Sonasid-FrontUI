import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

interface Conducteur {
  nom: string;
  prenom: string;
  cin: string;
}

interface AffectationFormProps {
  matricules: string[];
  conducteurs: Conducteur[];
  onAffect: (matricule: string, conducteur: Conducteur) => void;
}

const AffectationForm: React.FC<AffectationFormProps> = ({
  matricules,
  conducteurs,
  onAffect,
}) => {
  const [selectedMatricule, setSelectedMatricule] = useState("");
  const [selectedConducteur, setSelectedConducteur] = useState("");

  const handleAffect = () => {
    const conducteur = conducteurs.find(
      (c) => `${c.nom} ${c.prenom} (${c.cin})` === selectedConducteur
    );
    if (selectedMatricule && conducteur) {
      onAffect(selectedMatricule, conducteur);
    }
  };

  return (
    <div className="card-body">
      <Form className="search-form">
        <Row className="align-items-center">
          {/* Liste des matricules */}
          <Col md={5} className="mb-3">
          <Form.Label>Matricule</Form.Label>

            <Form.Select
              className="form-control"
              value={selectedMatricule}
              onChange={(e) => setSelectedMatricule(e.target.value)}
            >
              <option value="">-- Choisir un matricule --</option>
              {matricules.map((mat, idx) => (
                <option key={idx} value={mat}>
                  {mat}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Liste des conducteurs */}
          <Col md={5} className="mb-3">
          <Form.Label>Conducteur</Form.Label>

            <Form.Select
              className="form-control"
              value={selectedConducteur}
              onChange={(e) => setSelectedConducteur(e.target.value)}
            >
              <option value="">-- Choisir un conducteur --</option>
              {conducteurs.map((c, idx) => (
                <option key={idx} value={`${c.nom} ${c.prenom} (${c.cin})`}>
                  {c.nom} {c.prenom} ({c.cin})
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Bouton Affecter */}
          <Col md={2} className="mb-3 d-flex justify-content-end mt-7 ">
            <Button variant="primary" onClick={handleAffect}>
              Affecter
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AffectationForm;
