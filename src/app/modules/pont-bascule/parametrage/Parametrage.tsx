import React, { useState } from "react";
import { Button, Form, Tab, Tabs, Table } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

const Parametrage: React.FC = () => {
  const [conducteur, setConducteur] = useState({
    nom: "",
    prenom: "",
    cin: "",
  });
  const [camion, setCamion] = useState({ matricule: "", transporteur: "" });

  const [conducteurs, setConducteurs] = useState<any[]>([]);
  const [camions, setCamions] = useState<any[]>([]);

  const handleAddConducteur = () => {
    if (conducteur.nom && conducteur.prenom && conducteur.cin) {
      setConducteurs((prev) => [...prev, conducteur]);
      setConducteur({ nom: "", prenom: "", cin: "" });
    }
  };

  const handleAddCamion = () => {
    if (camion.matricule && camion.transporteur) {
      setCamions((prev) => [...prev, camion]);
      setCamion({ matricule: "", transporteur: "" });
    }
  };

  const handleDeleteConducteur = (index: number) => {
    setConducteurs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteCamion = (index: number) => {
    setCamions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container-fluid mt-4">
      <div className="form-container">
        <h4 className="form-title">⚙️ Paramétrage des éléments</h4>

        <Tabs defaultActiveKey="conducteur" className="mb-4 form-tab" justify>
          {/* ➕ Conducteur */}
          <Tab eventKey="conducteur" title="Ajouter un conducteur">
            {conducteurs.length > 0 && (
              <Table bordered className="mb-4 mt-3">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>CIN</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {conducteurs.map((c, index) => (
                    <tr key={index}>
                      <td>{c.nom}</td>
                      <td>{c.prenom}</td>
                      <td>{c.cin}</td>
                      <td>
                        <BsTrash
                          className="text-danger"
                          role="button"
                          onClick={() => handleDeleteConducteur(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  placeholder="Nom du conducteur"
                  value={conducteur.nom}
                  onChange={(e) =>
                    setConducteur({ ...conducteur, nom: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  placeholder="Prénom du conducteur"
                  value={conducteur.prenom}
                  onChange={(e) =>
                    setConducteur({ ...conducteur, prenom: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>CIN</Form.Label>
                <Form.Control
                  placeholder="Carte d'identité nationale"
                  value={conducteur.cin}
                  onChange={(e) =>
                    setConducteur({ ...conducteur, cin: e.target.value })
                  }
                />
              </Form.Group>
              <div className="text-end">
                <Button
                  onClick={handleAddConducteur}
                  style={{ backgroundColor: "#fc5421", borderColor: "#fc5421" }}
                >
                  ➕ Ajouter
                </Button>
              </div>
            </Form>
          </Tab>

          {/* ➕ Camion */}
          <Tab eventKey="camion" title="Ajouter un camion">
            {camions.length > 0 && (
              <Table bordered className="mb-4 mt-3">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {camions.map((c, index) => (
                    <tr key={index}>
                      <td>
                        {c.matricule} ({c.transporteur})
                      </td>

                      <td>
                        <BsTrash
                          className="text-danger"
                          role="button"
                          onClick={() => handleDeleteCamion(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <Form>
              <Form.Group className="mb-3 mt-3">
                <Form.Label>Transporteur</Form.Label>
                <Form.Control
                  placeholder="Nom du transporteur"
                  value={camion.transporteur}
                  onChange={(e) =>
                    setCamion({ ...camion, transporteur: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Matricule</Form.Label>
                <Form.Control
                  placeholder="Matricule du camion"
                  value={camion.matricule}
                  onChange={(e) =>
                    setCamion({ ...camion, matricule: e.target.value })
                  }
                />
              </Form.Group>

              <div className="text-end">
                <Button
                  onClick={handleAddCamion}
                  style={{ backgroundColor: "#fc5421", borderColor: "#fc5421" }}
                >
                  🚚 Ajouter
                </Button>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Parametrage;
