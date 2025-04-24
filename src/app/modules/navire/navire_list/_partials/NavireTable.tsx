import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "react-bootstrap";
import { BsInfoCircle, BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import { deleteNavire, fetchNavire } from "../../_requests/apiRequests";
import DetailsNavireModal from "../details_navire/DetailsNavireModal";
import EditNavireModal from "../update_navire/EditNavireModal";
// import { deleteNavire, fetchNavire } from "../_requests/apiRequests";
// import EditNavireModal from "./EditNavireModal";
// import DetailsNavireModal from "./DetailsNavireModal";

interface Navire {
  navire_Id: number;
  navire_Nom: string;
  navire_IMO: string;
  navire_CompagnieId: number;
  navire_CompagnieNom?: string;
  navire_ImmatriculationPaysId: number;
  navire_ImmatriculationPaysNom?: string;
  navire_ImmatriculationPortId: number;
  navire_ImmatriculationPortNom?: string;
  navire_AnneeConstruction: number;
  navire_LongueurMettres: number;
  navire_LargeurMetres: number;
  navire_TonnageBrut: number;
  navire_TonnageNet: number;
  navire_DeadweightTonnage: number;
  navire_Observations: string;
  navire_ValidationStatutId: number;
  navire_DateValidationStatut: string;
  navire_Active: boolean;
  navire_DateCreation: string;
  navire_UserId: string;
}

interface NavireProps {
  search: string;
  imo: string;
  compagnieId: number;
  paysId: number;
  portId: number;
  statut: string;
  dateCreation: Date | null;
}

interface NavireResponse {
  items: Navire[];
  totalItems: number;
}

const NavireTable: React.FC<NavireProps> = ({
  search,
  imo,
  compagnieId,
  paysId,
  portId,
  statut,
  dateCreation,
}) => {
  const [navires, setNavires] = useState<Navire[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingNavire, setEditingNavire] = useState<Navire | null>(null);
  const [viewingNavire, setViewingNavire] = useState<Navire | null>(null);

  const loadNavires = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response: NavireResponse = await fetchNavire(
        pageNumber,
        search,
        imo,
        compagnieId,
        paysId,
        portId,
        statut,
        dateCreation
      );
      setNavires(response.items);
      const calculatedTotalPages = Math.ceil(response.totalItems / 10);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      const error = err as Error;
      console.error("Erreur lors du chargement des navires :", error);
      Swal.fire(
        "Erreur",
        error.message || "Échec du chargement des navires",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNavires(page);
  }, [page, search, imo, compagnieId, paysId, portId, statut, dateCreation]);

  useEffect(() => {
    setPage(1);
  }, [search, imo, compagnieId, paysId, portId, statut, dateCreation]);

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
        await deleteNavire(id);
        await Swal.fire(
          "Supprimé!",
          "Le navire a été supprimé.",
          "success"
        );
        loadNavires(page);
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

  const StatusTemplate = (rowData: Navire) => {
    return (
      <span className={`badge-status ${rowData.navire_Active ? 'badge-success' : 'badge-danger'}`}>
        {rowData.navire_Active ? "Actif" : "Inactif"}
      </span>
    );
  };

  const ActionsTemplate = (rowData: Navire) => (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" size="sm" className="border-0 no-caret-toggle">
        <i className="bi bi-three-dots-vertical"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Actions</Dropdown.Header>
        <Dropdown.Item onClick={() => setViewingNavire(rowData)}>
          <BsInfoCircle className="me-2 text-info" /> Détails
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setEditingNavire(rowData)}>
          <BsPencilSquare className="me-2 text-primary" /> Modifier
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger" onClick={() => handleDelete(rowData.navire_Id)}>
          <BsTrash className="me-2" /> Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const DateTemplate = (rowData: Navire) => {
    return new Date(rowData.navire_DateCreation).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <DataTable
        value={navires}
        loading={loading}
        emptyMessage="Aucun navire trouvé"
        dataKey="navire_Id"
        responsiveLayout="scroll"
      >
        <Column 
          field="navire_Nom" 
          header="Nom" 
          body={(rowData) => <strong>{rowData.navire_Nom}</strong>}
        />
        <Column field="navire_IMO" header="Code IMO" />
        <Column 
          field="navire_CompagnieNom" 
          header="Compagnie" 
          body={(rowData) => rowData.navire_CompagnieNom || rowData.navire_CompagnieId}
        />
        <Column 
          field="navire_ImmatriculationPaysNom" 
          header="Pays d'immatriculation" 
          body={(rowData) => rowData.navire_ImmatriculationPaysNom || rowData.navire_ImmatriculationPaysId}
        />
        <Column 
          field="navire_ImmatriculationPortNom" 
          header="Port d'immatriculation" 
          body={(rowData) => rowData.navire_ImmatriculationPortNom || rowData.navire_ImmatriculationPortId}
        />
        <Column field="navire_AnneeConstruction" header="Année de construction" />
        <Column field="navire_LongueurMettres" header="Longueur (m)" />
        <Column field="navire_LargeurMetres" header="Largeur (m)" />
        <Column field="navire_TonnageBrut" header="Tonnage brut" />
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

      {editingNavire && (
        <EditNavireModal
          show={true}
          onClose={() => setEditingNavire(null)}
          onUpdated={() => loadNavires(page)}
          navire={editingNavire}
        />
      )}

      {viewingNavire && (
        <DetailsNavireModal
          show={true}
          onClose={() => setViewingNavire(null)}
          onEdit={() => {
            setEditingNavire(viewingNavire);
            setViewingNavire(null);
          }}
          navire={viewingNavire}
        />
      )}
    </div>
  );
};

export default NavireTable;