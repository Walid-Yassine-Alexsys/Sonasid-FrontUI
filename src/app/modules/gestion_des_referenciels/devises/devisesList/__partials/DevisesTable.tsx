import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { fetchDevises, deleteDevise } from "../../__requests/apiRequests";
import EditDeviseModal from "../../updateDevise/EditDevise";


interface Devise {
  devise_Id: number;
  devise_Nom: string;

  devise_Active: boolean; // Status field for filter
}

interface DeviseResponse {
  items: Devise[];
  totalItems: number;
}

interface DeviseTableProps {
  search: string;
  statusFilter?: string;
}

const DeviseTable: React.FC<DeviseTableProps> = ({ search, statusFilter = "" }) => {
  const [devises, setDevises] = useState<Devise[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingDevise, setEditingDevise] = useState<Devise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const loadDevises = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      // We'll assume fetchDevises works like other fetch functions
      const response: DeviseResponse = await fetchDevises(pageNumber, search);
      
      console.log("API Response in DeviseTable:", response);
      
      if (response && response.items) {
        // Apply status filtering on the client side if needed
        let filteredDevises = response.items;
        if (statusFilter) {
          console.log("Applying client-side status filtering:", statusFilter);
          filteredDevises = filteredDevises.filter((devise: { devise_Active: boolean; }) => {
            const isActive = statusFilter === "true";
            return devise.devise_Active === isActive;
          });
          
          // Update totals for client-side filtering
          setTotalItems(filteredDevises.length);
          setTotalPages(Math.ceil(filteredDevises.length / pageSize) || 1);
        } else {
          // No status filter, use API totals
          setTotalItems(response.totalItems);
          setTotalPages(Math.ceil(response.totalItems / pageSize) || 1);
        }
        
        // Set the devises
        setDevises(filteredDevises);
      } else {
        setError("Invalid API response format");
        setDevises([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des devises :", err);
      setError("Failed to load currencies data");
      setDevises([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevises(page);
  }, [page, search, statusFilter]);

  // Reset to page 1 when search or status filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

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
        await deleteDevise(id);
        await Swal.fire("Supprimé!", "La devise a été supprimée.", "success");
        loadDevises(page);
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

  // Status template
  const StatusTemplate = (devise: Devise) => (
    <span className={`badge-status ${devise.devise_Active ? 'badge-success' : 'badge-danger'}`}>
      {devise.devise_Active ? 'Actif' : 'Inactif'}
    </span>
  );

  return (
    <>
      <div className="p-datatable mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des devises...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-4">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="p-datatable-thead">
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Nom</th>
                  
                  <th>Statut</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                {devises && devises.length > 0 ? (
                  devises.map((devise) => (
                    <tr key={devise.devise_Id}>
                      <td style={{ paddingLeft: '20px' }}><strong>{devise.devise_Nom}</strong></td>
                     
                      <td>
                        {StatusTemplate(devise)}
                      </td>
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
                            <Dropdown.Item onClick={() => setEditingDevise(devise)}>
                              <BsPencilSquare className="me-2 text-primary" />
                              Modifier
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() => handleDelete(devise.devise_Id)}
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
                    <td colSpan={5} className="text-center text-muted py-5">
                      Aucune devise trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && devises.length > 0 && renderPagination()}

      {/* Edit Modal */}
      {editingDevise && (
        <EditDeviseModal
          show={true}
          onClose={() => setEditingDevise(null)}
          onUpdated={() => loadDevises(page)}
          deviseId={editingDevise.devise_Id}
          currentNom={editingDevise.devise_Nom}
          currentActive={editingDevise.devise_Active}
        />
      )}
    </>
  );
};

export default DeviseTable;