import React, { useState } from "react";
import { Button, Card, Dropdown } from "react-bootstrap";

const Planning: React.FC = () => {
  const [dateDepart, setDateDepart] = useState("");
  const [dateArrivee, setDateArrivee] = useState("");
  const [dateAccostage, setDateAccostage] = useState("");
  const [planningData, setPlanningData] = useState([
    {
      id: 1,
      dateDepart: "15/02/2025",
      dateArrivee: "25/02/2025",
      dateAccostage: "26/02/2025",
    },
    {
      id: 2,
      dateDepart: "20/02/2025",
      dateArrivee: "01/03/2025",
      dateAccostage: "02/03/2025",
    },
    {
      id: 3,
      dateDepart: "30/06/2025",
      dateArrivee: "09/07/2025",
      dateAccostage: "10/07/2025",
    },
    {
      id: 4,
      dateDepart: "12/07/2025",
      dateArrivee: "20/07/2025",
      dateAccostage: "21/07/2025",
    },
    {
      id: 5,
      dateDepart: "25/07/2025",
      dateArrivee: "01/08/2025",
      dateAccostage: "02/08/2025",
    },
    {
      id: 6,
      dateDepart: "05/08/2025",
      dateArrivee: "10/08/2025",
      dateAccostage: "11/08/2025",
    },
  ]);

  const handleAddPlanning = () => {
    const newItem = {
      id: planningData.length + 1,
      dateDepart,
      dateArrivee,
      dateAccostage,
    };
    setPlanningData([...planningData, newItem]);
    setDateDepart("");
    setDateArrivee("");
    setDateAccostage("");
  };

  const ActionsTemplate = (item: any) => (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="light"
        size="sm"
        className="border-0 no-caret-toggle"
      >
        <i className="bi bi-three-dots-vertical"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Actions</Dropdown.Header>
        <Dropdown.Item onClick={() => alert(`Modifier ${item.id}`)}>
          Modifier
        </Dropdown.Item>
        <Dropdown.Item onClick={() => alert(`Valider ${item.id}`)}>
          Valider
        </Dropdown.Item>
        <Dropdown.Item onClick={() => alert(`Rejeter ${item.id}`)}>
          Rejeter
        </Dropdown.Item>
      </Dropdown.Menu>

      <style>{`
        .no-caret-toggle::after {
        //   display: none !important;
        }
      `}</style>
    </Dropdown>
  );

  return (
    <div className="container-fluid mt-4">
      <Card>
        <div className="card border-0 shadow-sm rounded-3 p-8">
          <Card.Body>
            <h1 className="card-header-title mb-4">Planning d’arrivage</h1>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Date de départ</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateDepart}
                  onChange={(e) => setDateDepart(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date d'arrivée</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateArrivee}
                  onChange={(e) => setDateArrivee(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date d'accostage</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateAccostage}
                  onChange={(e) => setDateAccostage(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mb-4">
              <Button onClick={handleAddPlanning}>Ajouter</Button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>N°</th>
                    <th>Date de départ</th>
                    <th>Date d'arrivée</th>
                    <th>Date d'accostage</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {planningData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.dateDepart}</td>
                      <td>{item.dateArrivee}</td>
                      <td>{item.dateAccostage}</td>
                      <td className="text-end">{ActionsTemplate(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </div>
      </Card>
    </div>
  );
};

export default Planning;
