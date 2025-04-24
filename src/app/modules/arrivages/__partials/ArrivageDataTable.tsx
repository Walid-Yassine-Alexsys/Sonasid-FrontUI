import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "react-bootstrap";
import {
  BsClipboardCheck,
  BsCreditCard,
  BsFileEarmarkText,
  BsTrash,
  BsTruck,
} from "react-icons/bs";

interface Arrivage {
  id: string;
  commande: string;
  fournisseur: string;
  dateCreation: string;
  tonnage: string;
  statut: string;
  dateArrivee: string;
  nomNavire?: string;
  lastDateOfShipment?: string;
}

interface PaysDataTableProps {
  data: Arrivage[];
  loading: boolean;
  translate: (key: string) => string;
  onDelete: (id: string) => void;
}

const ArrivageDataTable: React.FC<PaysDataTableProps> = ({
  data,
  loading,
  translate,
  onDelete,
}) => {
  const [page, setPage] = useState(1);
  // Reduce the page size to 2 to make pagination visible with small data sets
  const pageSize = 5;
  const navigate = useNavigate();

  // Calculate total pages based on data length
  const totalPages = Math.ceil(data.length / pageSize);

  // Calculate current page data
  const getCurrentPageData = () => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  // Reset to first page when data changes
  useEffect(() => {
    setPage(1);
  }, [data]);

  const StatutTemplate = (rowData: Arrivage) => {
    const getBadgeClass = (status: string) => {
      switch (status) {
        case "En attente finance":
          return "badge-status bg-danger text-white";
        case "En attente achat":
          return "badge-status bg-warning text-dark";
        case "En attente logistique":
          return "badge-status bg-success text-white";
        case "En attente site":
          return "badge-status bg-primary text-white";
        case "En attente qualificateur":
          return "badge-status bg-secondary text-white";
        default:
          return "badge-status bg-light text-muted";
      }
    };

    return (
      <span className={getBadgeClass(rowData.statut)}>{rowData.statut}</span>
    );
  };

  const ActionsTemplate = (rowData: Arrivage) => (
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

        <Dropdown.Item onClick={() => navigate(`/consultation/${rowData.id}`)}>
          <BsFileEarmarkText className="me-2" /> Consultation
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate(`/paiement/${rowData.id}`)}>
          <BsCreditCard className="me-2" /> Modalité de paiement
        </Dropdown.Item>
        <Dropdown.Item onClick={() => navigate(`/logistique/${rowData.id}`)}>
          <BsTruck className="me-2" /> Logistique
        </Dropdown.Item>
        <Dropdown.Item disabled>
          <BsClipboardCheck className="me-2" /> Qualification
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item
          className="text-danger"
          onClick={() => onDelete(rowData.id)}
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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <li key="1" className="page-item">
          <button className="page-link" onClick={() => setPage(1)}>
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        items.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      items.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => setPage(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }
    return items;
  };

  console.log("Total pages:", totalPages); // Debug log to check total pages

  return (
    <div>
      <DataTable
        value={getCurrentPageData()}
        rows={pageSize}
        loading={loading}
        emptyMessage={translate("NO_DATA_FOUND")}
        dataKey="id"
        responsiveLayout="scroll"
        paginator={false} // Disable PrimeReact's built-in pagination
      >
        <Column
          field="id"
          header="ID Arrivage"
          body={(rowData) => <strong>{rowData.id}</strong>}
        />
        <Column field="commande" header="N° LC" />
        <Column field="fournisseur" header="Fournisseur" />
        <Column field="nomNavire" header="Nom du navire" />
        <Column field="dateCreation" header="Date création" />
        <Column field="tonnage" header="Tonnage" />
        <Column field="statut" header="Statut" body={StatutTemplate} />
        <Column field="dateArrivee" header="EDA" />
        <Column
          header={<span style={{ color: "red" }}>LDS</span>}
          body={(rowData: Arrivage) =>
            rowData.lastDateOfShipment ? (
              <span>
                {new Date(rowData.lastDateOfShipment).toLocaleDateString(
                  "fr-FR"
                )}
              </span>
            ) : (
              <span className="text-muted fst-italic">Non défini</span>
            )
          }
        />

        <Column
          header="Actions"
          body={(rowData) => ActionsTemplate(rowData)}
          style={{ textAlign: "center", width: "6rem" }}
        />
      </DataTable>

      {/* Added debug info */}
      <div style={{ display: "none" }}>
        Debug: {data.length} items, page size {pageSize}, total pages{" "}
        {totalPages}
      </div>

      {/* Force pagination to show regardless of total pages for testing */}
      <div className="pagination-container mt-3">
        <ul className="pagination mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              «
            </button>
          </li>
          {renderPaginationItems()}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              »
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ArrivageDataTable;
