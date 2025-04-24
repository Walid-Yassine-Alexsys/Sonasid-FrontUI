import React, { useEffect, useState } from "react";
import { fetchFournisseurTypes, deleteFournisseurType } from "../../__requests/apiRequests";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import EditFournisseurTypeModal from "../../updateFornisserType/EditFournisseurTypeModal";

interface FournisseurType {
  fournisseurType_Id: number;
  fournisseurType_Libelle: string;
}

interface FournisseurTypeResponse {
  items: FournisseurType[];
  totalItems: number;
}

interface FournisseurTypeTableProps {
  search: string;
}

const FournisseurTypeTable: React.FC<FournisseurTypeTableProps> = ({ search }) => {
  const [fournisseurTypes, setFournisseurTypes] = useState<FournisseurType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [editingFournisseurType, setEditingFournisseurType] = useState<FournisseurType | null>(null);
  const pageSize = 10;

  const loadFournisseurTypes = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: FournisseurTypeResponse = await fetchFournisseurTypes(pageNumber, search);
      
      // Limit to pageSize items
      setFournisseurTypes(response.items.slice(0, pageSize));
      
      // Store total items count
      setTotalItems(response.totalItems);
      
      // Calculate total pages based on total items and page size
      const calculatedTotalPages = Math.ceil(response.totalItems / pageSize);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      console.error("Erreur lors du chargement des types de fournisseurs :", err);
      setError("Failed to load supplier types data");
      setFournisseurTypes([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFournisseurTypes(page);
  }, [page, search]);

  // Reset to page 1 when search changes
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
        await deleteFournisseurType(id);
        await Swal.fire("Supprimé!", "Le type de fournisseur a été supprimé.", "success");
        loadFournisseurTypes(page);
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        Swal.fire("Erreur", "La suppression a échoué", "error");
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
          <button className="page-link" onClick={() => setPage(1)}>1</button>
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
          <button className="page-link" onClick={() => setPage(i)}>{i}</button>
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
          <button className="page-link" onClick={() => setPage(totalPages)}>{totalPages}</button>
        </li>
      );
    }
    
    return items;
  };

  const renderPagination = () => {
    return (
      <div className="pagination-container">
        <ul className="pagination mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button 
              className="page-link" 
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &laquo;
            </button>
          </li>

          {renderPaginationItems()}

          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button 
              className="page-link" 
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="p-datatable mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des types de fournisseur...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-4">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="p-datatable-thead">
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Nom</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                {fournisseurTypes.length > 0 ? (
                  fournisseurTypes.map((fournisseurType) => (
                    <tr key={fournisseurType.fournisseurType_Id}>
                      <td style={{ paddingLeft: '20px' }}><strong>{fournisseurType.fournisseurType_Libelle}</strong></td>
                      <td style={{ textAlign: 'center' }}>
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
                            <Dropdown.Item onClick={() => setEditingFournisseurType(fournisseurType)}>
                              <BsPencilSquare className="me-2 text-primary" />
                              Modifier
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() => handleDelete(fournisseurType.fournisseurType_Id)}
                            >
                              <BsTrash className="me-2" />
                              Supprimer
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center text-muted py-5">
                      Aucun type de fournisseur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && fournisseurTypes.length > 0 && renderPagination()}

      {editingFournisseurType && (
        <EditFournisseurTypeModal
          show={true}
          onClose={() => setEditingFournisseurType(null)}
          onUpdated={() => loadFournisseurTypes(page)}
          fournisseurTypeId={editingFournisseurType.fournisseurType_Id}
          currentLibelle={editingFournisseurType.fournisseurType_Libelle}
        />
      )}
    </>
  );
};

export default FournisseurTypeTable;