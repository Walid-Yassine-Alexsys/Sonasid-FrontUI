import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteBanque, fetchBanques } from "../../__requests/apiRequests";
import EditBanqueModal from "../../updateBanque/EditBanque";

interface Banque {
  banque_Id: number;
  banque_Nom: string;
  banque_NumeroCompte: string;
  banque_Active: boolean;
}

interface BanqueResponse {
  items: Banque[];
  totalItems: number;
}

interface BanqueTableProps {
  search: string;
  statusFilter?: string;
}

const BanqueTable: React.FC<BanqueTableProps> = ({ search, statusFilter = "" }) => {
  const [banques, setBanques] = useState<Banque[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingBanque, setEditingBanque] = useState<Banque | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  // Debug function to log all available properties in an object
  const logAllProperties = (obj: any, label: string) => {
    if (!obj) {
      console.log(`${label} is null or undefined`);
      return;
    }
    
    console.log(`--- ${label} ---`);
    console.log("Keys:", Object.keys(obj).join(", "));
    console.log("Values:", obj);
  };

  const loadBanques = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      // Always fetch all banques without status filter in the API request
      // We'll filter them on the client side instead
      const response: BanqueResponse = await fetchBanques(pageNumber, search);
      
      console.log("API Response in BanqueTable:", response);
      
      if (response && response.items) {
        // Examine the properties of the first item
        if (response.items.length > 0) {
          const firstItem = response.items[0];
          logAllProperties(firstItem, "First bank item");
        }
        
        // Apply status filtering on the client side if needed
        let filteredBanques = response.items;
        if (statusFilter) {
          console.log("Applying client-side status filtering:", statusFilter);
          filteredBanques = filteredBanques.filter((banque) => {
            const isActive = statusFilter === "true";
            return banque.banque_Active === isActive;
          });
          
          // Update totals for client-side filtering
          setTotalItems(filteredBanques.length);
          setTotalPages(Math.ceil(filteredBanques.length / pageSize) || 1);
        } else {
          // No status filter, use API totals
          setTotalItems(response.totalItems);
          setTotalPages(Math.ceil(response.totalItems / pageSize) || 1);
        }
        
        // Set the banques
        setBanques(filteredBanques);
      } else {
        setError("Invalid API response format");
        setBanques([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des banques :", err);
      setError("Failed to load banks data");
      setBanques([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanques(page);
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
        await deleteBanque(id);
        await Swal.fire("Supprimé!", "La banque a été supprimée.", "success");
        loadBanques(page);
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
  const StatusTemplate = (banque: Banque) => (
    <span className={`badge-status ${banque.banque_Active ? 'badge-success' : 'badge-danger'}`}>
      {banque.banque_Active ? 'Actif' : 'Inactif'}
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
            <p className="mt-2">Chargement des banques...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-4">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="p-datatable-thead">
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Nom</th>
                  <th>Numéro de Compte</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                {banques && banques.length > 0 ? (
                  banques.map((banque) => (
                    <tr key={banque.banque_Id}>
                      <td style={{ paddingLeft: '20px' }}><strong>{banque.banque_Nom}</strong></td>
                      <td>{banque.banque_NumeroCompte}</td>
                      <td>
                        {StatusTemplate(banque)}
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
                            <Dropdown.Item onClick={() => setEditingBanque(banque)}>
                              <BsPencilSquare className="me-2 text-primary" />
                              Modifier
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() => handleDelete(banque.banque_Id)}
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
                    <td colSpan={4} className="text-center text-muted py-5">
                      Aucune banque trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && banques.length > 0 && renderPagination()}

      {/* Edit Modal */}
      {editingBanque && (
        <EditBanqueModal
          show={true}
          onClose={() => setEditingBanque(null)}
          onUpdated={() => loadBanques(page)}
          banqueId={editingBanque.banque_Id}
          currentName={editingBanque.banque_Nom}
          currentNumeroCompte={editingBanque.banque_NumeroCompte}
          currentActive={editingBanque.banque_Active}
        />
      )}
    </>
  );
};

export default BanqueTable;