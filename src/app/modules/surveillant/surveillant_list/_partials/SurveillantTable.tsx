import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "react-bootstrap";
import { BsInfoCircle, BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import { deleteSurveillant, fetchSurveillants } from "../../_requests/apiRequests";
import EditSurveillantModal from "../update_surveillant/EditSurveillantModal";
import DetailsSurveillantModal from "../details_surveillant/DetailsSurveillantModal";
// import { deleteSurveillant, fetchSurveillants } from "../_requests/apiRequests";
// import EditSurveillantModal from "./EditSurveillantModal";
// import DetailsSurveillantModal from "./DetailsSurveillantModal";

interface Surveillant {
  surveillant_Id: number;
  surveillant_TypeSuveillantId: number;
  surveillant_TypeSuveillantNom?: string;
  surveillant_RaisonSociale: string;
  surveillant_Nom: string;
  surveillant_Prenom: string;
  surveillant_Telephone: string;
  surveillant_Email: string;
  surveillant_PaysId: number;
  surveillant_PaysNom?: string;
  surveillant_Statut: boolean;
  surveillant_Observations: string;
  surveillant_DateCreation: string;
  surveillant_UserId: string;
}

// Static list for TypeSurveillant as a workaround
const STATIC_TYPE_SURVEILLANTS = [
  { typeSurveillant_Id: 1, typeSurveillant_Nom: "Individuel" },
  { typeSurveillant_Id: 2, typeSurveillant_Nom: "Entreprise" },
];

interface SurveillantProps {
  search: string;
  typeSurveillantId: number;
  paysId: number;
  statut: string;
  dateCreation: Date | null;
}

interface SurveillantResponse {
  items: Surveillant[];
  totalItems: number;
}

const SurveillantTable: React.FC<SurveillantProps> = ({
  search,
  typeSurveillantId,
  paysId,
  statut,
  dateCreation,
}) => {
  const [surveillants, setSurveillants] = useState<Surveillant[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSurveillant, setEditingSurveillant] = useState<Surveillant | null>(null);
  const [viewingSurveillant, setViewingSurveillant] = useState<Surveillant | null>(null);

  const loadSurveillants = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response: SurveillantResponse = await fetchSurveillants(
        pageNumber,
        search,
        typeSurveillantId,
        paysId,
        statut,
        dateCreation
      );
      // Enrich surveillant data with TypeSurveillantNom from static list
      const enrichedData = response.items.map((surveillant) => {
        const typeSurveillant = STATIC_TYPE_SURVEILLANTS.find(
          (t) => t.typeSurveillant_Id === surveillant.surveillant_TypeSuveillantId
        );
        return {
          ...surveillant,
          surveillant_TypeSuveillantNom: typeSurveillant
            ? typeSurveillant.typeSurveillant_Nom
            : `Unknown (${surveillant.surveillant_TypeSuveillantId})`,
        };
      });
      setSurveillants(enrichedData);
      const calculatedTotalPages = Math.ceil(response.totalItems / 10);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      const error = err as Error;
      console.error("Erreur lors du chargement des surveillants :", error);
      Swal.fire(
        "Erreur",
        error.message || "Échec du chargement des surveillants",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveillants(page);
  }, [page, search, typeSurveillantId, paysId, statut, dateCreation]);

  useEffect(() => {
    setPage(1);
  }, [search, typeSurveillantId, paysId, statut, dateCreation]);

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
        await deleteSurveillant(id);
        await Swal.fire(
          "Supprimé!",
          "Le surveillant a été supprimé.",
          "success"
        );
        loadSurveillants(page);
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

  const StatusTemplate = (rowData: Surveillant) => {
    return (
      <span className={`badge-status ${rowData.surveillant_Statut ? 'badge-success' : 'badge-danger'}`}>
        {rowData.surveillant_Statut ? "Actif" : "Inactif"}
      </span>
    );
  };

  const ActionsTemplate = (rowData: Surveillant) => (
    <Dropdown align="end">
      <Dropdown.Toggle variant="light" size="sm" className="border-0 no-caret-toggle">
        <i className="bi bi-three-dots-vertical"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Actions</Dropdown.Header>
        <Dropdown.Item onClick={() => setViewingSurveillant(rowData)}>
          <BsInfoCircle className="me-2 text-info" /> Détails
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setEditingSurveillant(rowData)}>
          <BsPencilSquare className="me-2 text-primary" /> Modifier
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger" onClick={() => handleDelete(rowData.surveillant_Id)}>
          <BsTrash className="me-2" /> Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const DateTemplate = (rowData: Surveillant) => {
    return new Date(rowData.surveillant_DateCreation).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      <DataTable
        value={surveillants}
        loading={loading}
        emptyMessage="Aucun surveillant trouvé"
        dataKey="surveillant_Id"
        responsiveLayout="scroll"
      >
        <Column 
          field="surveillant_Nom" 
          header="Nom" 
          body={(rowData) => <strong>{rowData.surveillant_Nom}</strong>}
        />
        <Column field="surveillant_Prenom" header="Prénom" />
        <Column field="surveillant_RaisonSociale" header="Raison sociale" />
        <Column 
          field="surveillant_TypeSuveillantNom" 
          header="Type de surveillant" 
          body={(rowData) => rowData.surveillant_TypeSuveillantNom || rowData.surveillant_TypeSuveillantId}
        />
        <Column field="surveillant_Telephone" header="Téléphone" />
        <Column field="surveillant_Email" header="Email" />
        <Column 
          field="surveillant_PaysNom" 
          header="Pays" 
          body={(rowData) => rowData.surveillant_PaysNom || rowData.surveillant_PaysId}
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

      {editingSurveillant && (
        <EditSurveillantModal
          show={true}
          onClose={() => setEditingSurveillant(null)}
          onUpdated={() => loadSurveillants(page)}
          surveillant={editingSurveillant}
        />
      )}

      {viewingSurveillant && (
        <DetailsSurveillantModal
          show={true}
          onClose={() => setViewingSurveillant(null)}
          onEdit={() => {
            setEditingSurveillant(viewingSurveillant);
            setViewingSurveillant(null);
          }}
          surveillant={viewingSurveillant}
        />
      )}
    </div>
  );
};

export default SurveillantTable;