import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const camions = [
  "75843-A-1",
  "12934-B-2",
  "43920-C-3",
  "200505-D-4",
  "194903-E-5",
  "490521-F-6",
];
const commandesDisponibles = [
  "CMD-2025-001",
  "CMD-2025-002",
  "CMD-2025-003",
  "CMD-2025-004",
  "CMD-2025-005",
];

const Pesage: React.FC = () => {
  const [selectedMatricule, setSelectedMatricule] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    matricule: "",
    pesee: "",
    navire: "",
    dum: "",
    commande: "",
    radio: "",
    poids: "0.000",
    commentaire: "",
  });
  const [poidsPremier, setPoidsPremier] = useState<number | null>(null);
  const [showHistorique, setShowHistorique] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedHistorique, setEditedHistorique] = useState<any | null>(null);
  const handleEditHistorique = (entry: any) => {
    setEditedHistorique(entry);
    setShowEditModal(true);
  };

  const handleSelectCamion = (matricule: string) => {
    const premier = parseFloat((Math.random() * 10 + 5).toFixed(3));
    const deuxieme = parseFloat((Math.random() * 10 + 5).toFixed(3));

    setSelectedMatricule(matricule);
    setPoidsPremier(premier);

    setFormData({
      matricule,
      pesee: "2ème",
      navire: "NAV-" + matricule.slice(0, 3),
      dum: "DUM-" + Math.floor(Math.random() * 10000),
      commande: "CMD-" + Math.floor(Math.random() * 99999),
      radio: "",
      poids: deuxieme.toFixed(3),
      commentaire: "",
    });
  };
  // Exemple de données historiques
  const [historique, setHistorique] = useState([
    {
      id: 1,
      matricule: "75843-A-1",
      date: "2025-04-20",
      poidsNet: "6.350",
      commentaire: "Pesée normale",
    },
    {
      id: 2,
      matricule: "12934-B-2",
      date: "2025-04-22",
      poidsNet: "7.820",
      commentaire: "Anomalie détectée",
    },
  ]);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Data saved:", formData);
    alert("Enregistré !");
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm border rounded-3 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Module de pesage</h3>
          <Button
            variant="outline-dark"
            onClick={() => setShowHistorique(!showHistorique)}
          >
            📜 Historique de pesage
          </Button>
        </div>
        {showHistorique && (
          <div className="card p-4 shadow-sm border mb-5">
            <h5 className="mb-3 fw-semibold text-primary">
              Historique des pesées
            </h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Date</th>
                    <th>Poids Net</th>
                    <th>Commentaire</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {historique.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.matricule}</td>
                      <td>{entry.date}</td>
                      <td>{entry.poidsNet} t</td>
                      <td>{entry.commentaire}</td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditHistorique(entry)}
                        >
                          Modifier
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            setHistorique((prev) =>
                              prev.filter((h) => h.id !== entry.id)
                            )
                          }
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Modifier la pesée</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editedHistorique && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Matricule</Form.Label>
                  <Form.Control value={editedHistorique.matricule} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>DUM</Form.Label>
                  <Form.Control
                    value={editedHistorique.dum || ""}
                    onChange={(e) =>
                      setEditedHistorique({
                        ...editedHistorique,
                        dum: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Commentaire</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editedHistorique.commentaire}
                    onChange={(e) =>
                      setEditedHistorique({
                        ...editedHistorique,
                        commentaire: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setHistorique((prev) =>
                  prev.map((item) =>
                    item.id === editedHistorique.id ? editedHistorique : item
                  )
                );
                setShowEditModal(false);
              }}
            >
              Enregistrer
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="row">
          {/* 👉 Liste à gauche */}
          <div className="col-md-3 border-end pe-0">
            <h5 className="p-3 border-bottom">📋 Camions</h5>
            <ul className="list-group rounded-0">
              {camions.map((m) => (
                <li
                  key={m}
                  className={`list-group-item list-group-item-action ${
                    selectedMatricule === m ? "active" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectCamion(m)}
                >
                  🚚 {m}
                </li>
              ))}
            </ul>
          </div>

          {/* 👉 Formulaire à droite */}
          <div className="col-md-9 px-5">
            {selectedMatricule ? (
              <>
                <h4 className="my-4 fw-semibold text-primary">
                  Fiche de pesée – {selectedMatricule}
                </h4>

                <div className="row mb-4">
                  <div className="col-md-4">
                    <Form.Label>Matricule</Form.Label>
                    <Form.Control value={formData.matricule} readOnly />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Pesée</Form.Label>
                    <Form.Control value={formData.pesee} readOnly />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Nom du navire</Form.Label>
                    <Form.Control value={formData.navire} readOnly />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-4">
                    <Form.Label>N° DUM</Form.Label>
                    <Form.Control value={formData.dum} readOnly />
                  </div>
                  <div className="col-md-4">
                    <Form.Label>N° Commande</Form.Label>
                    <Form.Select
                      value={formData.commande}
                      onChange={(e) => handleChange("commande", e.target.value)}
                    >
                      <option value="">-- Choisir une commande --</option>
                      {commandesDisponibles.map((cmd, idx) => (
                        <option key={idx} value={cmd}>
                          {cmd}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="col-md-4">
                    <Form.Label>Radioactivité</Form.Label>
                    <div className="d-flex gap-3 mt-2">
                      <Form.Check
                        label="Positif"
                        name="radio"
                        type="radio"
                        id="positif"
                        checked={formData.radio === "positif"}
                        onChange={() => handleChange("radio", "positif")}
                      />
                      <Form.Check
                        label="Négatif"
                        name="radio"
                        type="radio"
                        id="negatif"
                        checked={formData.radio === "negatif"}
                        onChange={() => handleChange("radio", "negatif")}
                      />
                    </div>
                  </div>
                </div>

                {/* 🧾 Afficheur de poids */}
                <div className="text-center mb-4 mt-9">
                  {formData.pesee === "2ème" && poidsPremier !== null && (
                    <div className="poids-wrapper">
                      {/* 👉 1er Pesage */}
                      <div className="poids-display">
                        <div className="label">1er Pesage</div>
                        <div className="value">
                          <span>{poidsPremier.toFixed(3)}</span>
                          <span className="unit">t</span>
                        </div>
                      </div>

                      {/* 👉 2ème Pesage */}
                      <div className="poids-display">
                        <div className="label">2ème Pesage</div>
                        <div className="value">
                          <span>{formData.poids}</span>
                          <span className="unit">t</span>
                        </div>
                      </div>

                      {/* 👉 Poids Net */}
                      <div className="poids-display">
                        <div className="label">Poids Net</div>
                        <div className="value">
                          <span>
                            {Math.abs(
                              poidsPremier - parseFloat(formData.poids)
                            ).toFixed(3)}
                          </span>
                          <span className="unit">t</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Form.Group className="mb-4">
                  <Form.Label>Commentaire</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.commentaire}
                    onChange={(e) =>
                      handleChange("commentaire", e.target.value)
                    }
                  />
                </Form.Group>

                <div className="text-end">
                  <Button
                    onClick={handleSubmit}
                    variant="success"
                    className="px-4"
                  >
                    Enregistrer
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-5 text-muted text-center">
                Sélectionnez un matricule à gauche
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pesage;
