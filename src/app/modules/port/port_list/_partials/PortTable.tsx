import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "react-bootstrap";
import { BsInfoCircle, BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
// import { deletePort, fetchPorts } from "../_requests/apiRequests";
// import EditPortModal from "../edit_port/EditPortModal";
import DetailsPortModal from "../details_port/DetailsPortModal";
import { deletePort, fetchPorts } from "../../_requests/apiRequests";
import EditPortModal from "../update_port/EditPortModal";

interface Port {
  port_ID: number;
  port_Nom: string;
  port_CodeIATA: string;
  port_CodeUNLOCODE: string;
  port_PaysId: number;
  port_PaysNom?: string;
  port_VilleId: number;
  port_VilleNom?: string;
  port_Latitude: number;
  port_Longitude: number;
  port_DateCreation: string;
  port_UserId: string;
}

interface PortProps {
  search: string;
  codeIATA: string;
  codeUNLOCODE: string;
  paysId: number;
  villeId: number;
  dateCreation: Date | null;
}

interface PortResponse {
  items: Port[];
  totalItems: number;
}

const PortTable: React.FC<PortProps> = ({
  search,
  codeIATA,
  codeUNLOCODE,
  paysId,
  villeId,
  dateCreation,
}) => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPort, setEditingPort] = useState<Port | null>(null);
  const [viewingPort, setViewingPort] = useState<Port | null>(null);

  const loadPorts = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response: PortResponse = await fetchPorts(
        pageNumber,
        search,
        codeIATA,
        codeUNLOCODE,
        paysId,
        villeId,
        dateCreation
      );
      console.log(response.items);
      setPorts(response.items);
      const calculatedTotalPages = Math.ceil(response.totalItems / 10);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      const error = err as Error;
      console.error("Erreur lors du chargement des ports :", error);
      Swal.fire("Erreur", error.message || "Échec du chargement des ports", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPorts(page);
  }, [page, search, codeIATA, codeUNLOCODE, paysId, villeId, dateCreation]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await deletePort(id);
        await Swal.fire("Supprimé!", "Le port a été supprimé.", "success");
        loadPorts(page);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors de la suppression :", error);
        Swal.fire("Erreur", error.message || "La suppression a échoué", "error");
      }
    }
  };

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

  const ActionsTemplate = (rowData: Port) => (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" size="sm" className="border-0 no-caret-toggle">
        <i className="bi bi-three-dots-vertical"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Actions</Dropdown.Header>
        <Dropdown.Item onClick={() => setViewingPort(rowData)}>
          <BsInfoCircle className="me-2 text-info" /> Détails
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setEditingPort(rowData)}>
          <BsPencilSquare className="me-2 text-primary" /> Modifier
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger" onClick={() => handleDelete(rowData.port_ID)}>
          <BsTrash className="me-2" /> Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const DateTemplate = (rowData: Port) => {
    return new Date(rowData.port_DateCreation).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <DataTable
        value={ports}
        loading={loading}
        emptyMessage="Aucun port trouvé"
        dataKey="port_ID"
        responsiveLayout="scroll"
      >
        <Column
          field="port_Nom"
          header="Nom"
          body={(rowData) => <strong>{rowData.port_Nom}</strong>}
        />
        <Column field="port_CodeIATA" header="Code IATA" />
        <Column field="port_CodeUNLOCODE" header="Code UN/LOCODE" />
        <Column
          field="port_PaysNom"
          header="Pays"
          body={(rowData) => rowData.port_PaysNom || rowData.port_PaysId}
        />
        <Column
          field="port_VilleNom"
          header="Ville"
          body={(rowData) => rowData.port_VilleNom || rowData.port_VilleId}
        />
        <Column field="port_Latitude" header="Latitude" />
        <Column field="port_Longitude" header="Longitude" />
        <Column header="Date de création" body={DateTemplate} />
        <Column
          header="Actions"
          body={ActionsTemplate}
          style={{ textAlign: "center", width: "6rem" }}
        />
      </DataTable>

      {totalPages > 1 && (
        <div className="pagination-container mt-3" style={{ display: "flex", justifyContent: "center" }}>
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
      )}

      {editingPort && (
        <EditPortModal
          show={true}
          onClose={() => setEditingPort(null)}
          onUpdated={() => loadPorts(page)}
          port={editingPort}
        />
      )}

      {viewingPort && (
        <DetailsPortModal
          show={true}
          onClose={() => setViewingPort(null)}
          onEdit={() => {
            setEditingPort(viewingPort);
            setViewingPort(null);
          }}
          port={viewingPort}
        />
      )}
    </div>
  );
};

export default PortTable;