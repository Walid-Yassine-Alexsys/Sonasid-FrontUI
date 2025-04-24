import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "react-bootstrap";
import { BsInfoCircle, BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import {
  deleteCompagnieMaritime,
  fetchCompagnieMaritime,
} from "../../_requests/apiRequests";
import EditCompagnieMaritimeModal from "../update_compagnie_maritime/EditCompagnieMaritimeModal";
import DetailsCompagnieMaritimeModal from "../details_compagnie_maritime/DetailsCompagnieMaritimeModal";

interface CompagnieMaritime {
  compagnie_Id: number;
  compagnie_NomCompagnie: string;
  compagnie_CodeIMO: string;
  compagnie_PaysId: number;
  compagnie_PaysNom?: string;
  compagnie_Adresse: string;
  compagnie_Telephone: string;
  compagnie_Email: string;
  compagnie_SiteWeb: string;
  compagnie_Active: boolean;
  compagnie_DateCreation: string;
  compagnie_UserId: string;
}

interface CompagnieMaritimeProps {
  search: string;
  codeIMO: string;
  paysId: number;
  statut: string;
  dateCreation: Date | null;
}

interface CompagnieMaritimeResponse {
  items: CompagnieMaritime[];
  totalItems: number;
}

const CompagnieMaritimeTable: React.FC<CompagnieMaritimeProps> = ({
  search,
  codeIMO,
  paysId,
  statut,
  dateCreation,
}) => {
  const [compagniemaritime, setCompagnieMaritime] = useState<CompagnieMaritime[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCompagnieMaritime, setEditingCompagnieMaritime] = useState<CompagnieMaritime | null>(null);
  const [viewingCompagnieMaritime, setViewingCompagnieMaritime] = useState<CompagnieMaritime | null>(null);

  const loadCompagnieMaritime = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response: CompagnieMaritimeResponse = await fetchCompagnieMaritime(
        pageNumber,
        search,
        codeIMO,
        paysId,
        statut,
        dateCreation
      );
      setCompagnieMaritime(response.items);
      const calculatedTotalPages = Math.ceil(response.totalItems / 10);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      const error = err as Error;
      console.error("Erreur lors du chargement des compagnies maritimes :", error);
      Swal.fire(
        "Erreur",
        error.message || "Échec du chargement des compagnies maritimes",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompagnieMaritime(page);
  }, [page, search, codeIMO, paysId, statut, dateCreation]);

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
        await deleteCompagnieMaritime(id);
        await Swal.fire(
          "Supprimé!",
          "La compagnie maritime a été supprimée.",
          "success"
        );
        loadCompagnieMaritime(page);
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

  const StatusTemplate = (rowData: CompagnieMaritime) => {
    return (
      <span className={`badge-status ${rowData.compagnie_Active ? 'badge-success' : 'badge-danger'}`}>
        {rowData.compagnie_Active ? "Actif" : "Inactif"}
      </span>
    );
  };

  const ActionsTemplate = (rowData: CompagnieMaritime) => (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" size="sm" className="border-0 no-caret-toggle">
        <i className="bi bi-three-dots-vertical"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Actions</Dropdown.Header>
        <Dropdown.Item onClick={() => setViewingCompagnieMaritime(rowData)}>
          <BsInfoCircle className="me-2 text-info" /> Détails
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setEditingCompagnieMaritime(rowData)}>
          <BsPencilSquare className="me-2 text-primary" /> Modifier
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger" onClick={() => handleDelete(rowData.compagnie_Id)}>
          <BsTrash className="me-2" /> Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const WebsiteTemplate = (rowData: CompagnieMaritime) => {
    return rowData.compagnie_SiteWeb ? (
      <a href={rowData.compagnie_SiteWeb} target="_blank" rel="noopener noreferrer">
        {rowData.compagnie_SiteWeb}
      </a>
    ) : (
      <span className="text-muted fst-italic">Non défini</span>
    );
  };

  const DateTemplate = (rowData: CompagnieMaritime) => {
    return new Date(rowData.compagnie_DateCreation).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <DataTable
        value={compagniemaritime}
        loading={loading}
        emptyMessage="Aucune compagnie maritime trouvée"
        dataKey="compagnie_Id"
        responsiveLayout="scroll"
      >
        <Column 
          field="compagnie_NomCompagnie" 
          header="Nom" 
          body={(rowData) => <strong>{rowData.compagnie_NomCompagnie}</strong>}
        />
        <Column field="compagnie_CodeIMO" header="Code IMO" />
        <Column 
          field="compagnie_PaysNom" 
          header="Pays" 
          body={(rowData) => rowData.compagnie_PaysNom || rowData.compagnie_PaysId}
        />
        <Column field="compagnie_Adresse" header="Adresse" />
        <Column field="compagnie_Telephone" header="Téléphone" />
        <Column field="compagnie_Email" header="Email" />
        <Column 
          header="Site Web" 
          body={WebsiteTemplate}
        />
        <Column 
          header="Statut" 
          body={StatusTemplate}
        />
        <Column 
          header="Date de création" 
          body={DateTemplate}
        />
        <Column
          header="Actions"
          body={ActionsTemplate}
          style={{ textAlign: "center", width: "6rem" }}
        />
      </DataTable>

      {totalPages > 1 && (
        <div className="pagination-container mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
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

      {editingCompagnieMaritime && (
        <EditCompagnieMaritimeModal
          show={true}
          onClose={() => setEditingCompagnieMaritime(null)}
          onUpdated={() => loadCompagnieMaritime(page)}
          compagnieMaritime={editingCompagnieMaritime}
        />
      )}

      {viewingCompagnieMaritime && (
        <DetailsCompagnieMaritimeModal
          show={true}
          onClose={() => setViewingCompagnieMaritime(null)}
          onEdit={() => {
            setEditingCompagnieMaritime(viewingCompagnieMaritime);
            setViewingCompagnieMaritime(null); // Close details modal
          }}
          compagnieMaritime={viewingCompagnieMaritime}
        />
      )}
    </div>
  );
};

export default CompagnieMaritimeTable;