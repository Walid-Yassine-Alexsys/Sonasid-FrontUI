import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Dropdown } from "react-bootstrap";
import { BsFileEarmarkText, BsPencilSquare, BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface Fournisseur {
  Id: string;
  Nom: string;
  ICE: string;
  PaysId: string;
  Adresse: string;
  VilleId: string;
  ContactNom: string;
  ContactTelephone: string;
  ContactEmail: string;
  statut: string;
  dateArrivee: string;
}

interface PaysDataTableProps {
  data: Fournisseur[];
  loading: boolean;
  translate: (key: string) => string;
  onDelete: (id: string) => void;
}

const FournisseurDataTable: React.FC<PaysDataTableProps> = ({
  data,
  loading,
  translate,
  onDelete,
}) => {
  const [first, setFirst] = useState(0);
  const pageSize = 10;

  const StatutTemplate = (rowData: Fournisseur) => {
    const getBadgeClass = (status: string) => {
      switch (status) {
        case "activé":
          return "badge-status badge-success";
        case "non activé":
          return "badge-status badge-danger";
        default:
          return "badge-status badge-muted";
      }
    };

    return (
      <span className={getBadgeClass(rowData.statut)}>{rowData.statut}</span>
    );
  };

  const navigate = useNavigate();

  const ActionsTemplate = (rowData: Fournisseur) => {
    return (
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

          <Dropdown.Item
            onClick={() => {
              console.log("Navigating to details for ID:", rowData.Id);
              navigate(`/details-fournisseur/${rowData.Id}`); // Updated to plural
            }}
          >
            <BsFileEarmarkText className="me-2" /> Détails
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              console.log("Navigating to edit for ID:", rowData.Id);
              navigate(`/details-fournisseur/${rowData.Id}/edit`); // Matches the route
            }}
          >
            <BsPencilSquare className="me-2" /> Modifier
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item
            className="text-danger"
            onClick={() => {
              console.log("Deleting ID:", rowData.Id);
              onDelete(rowData.Id);
            }}
          >
            <BsTrash className="me-2" /> Supprimer
          </Dropdown.Item>
        </Dropdown.Menu>

        <style>{`
          .no-caret-toggle::after {
            display: none !important;
          }
        `}</style>
      </Dropdown>
    );
  };

  return (
    <div>
      {/* Custom CSS for matching the screenshot */}
      <style>{`
        .p-datatable {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          overflow: hidden;
          font-size: 0.95rem;
        }
 
        .p-datatable .p-datatable-thead > tr > th {
          background-color: #f8f9fa;
          padding: 1rem;
          font-weight: 600;
          color: #495057;
          font-size: 0.95rem;
          border-right: none !important;
          border-bottom: 1px solid #dee2e6;
        }
 
        .p-datatable .p-datatable-tbody > tr > td {
          padding: 1rem;
          border: none;
        }
 
        .p-datatable .p-datatable-tbody > tr {
          border-bottom: 1px solid #dee2e6;
        }
 
        .badge-status {
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
 
        .badge-danger {
          background-color:#fc5421;
          color: white;
        }
 
        .badge-light {
          background-color: #f1f3f5;
          color: #495057;
        }
 
        .badge-secondary {
          background-color: #dee2e6;
          color: #495057;
        }
 
        .badge-muted {
          background-color: #e9ecef;
          color: #6c757d;
        }
      `}</style>
      <DataTable
        value={data}
        paginator
        rows={pageSize}
        first={first}
        onPage={(e) => setFirst(e.first)}
        loading={loading}
        emptyMessage={translate("NO_DATA_FOUND")}
        dataKey="ICE"
        responsiveLayout="scroll"
      >
        <Column field="Nom" header="Nom" />
        <Column field="ICE" header="ICE" />
        <Column field="PaysId" header="Pays Id" />
        <Column field="Adresse" header="Adresse" />
        <Column field="VilleId" header="Ville Id" />
        <Column field="ContactNom" header="Contact Nom" />
        <Column field="ContactTelephone" header="Contact Telephone" />
        <Column field="ContactEmail" header="Contact Email" />
        <Column field="statut" header="Statut" body={StatutTemplate} />
        <Column field="dateArrivee" header="Date arrivée" />
        <Column
          header="Actions"
          body={(rowData) => ActionsTemplate(rowData)}
          style={{ textAlign: "center", width: "6rem" }}
        />
      </DataTable>
    </div>
  );
};

export default FournisseurDataTable;