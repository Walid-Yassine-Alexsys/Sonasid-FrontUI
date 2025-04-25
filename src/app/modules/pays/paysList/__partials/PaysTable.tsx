import React, { useEffect, useState } from "react";
import { fetchPays, deletePay } from "../../__requests/apiRequests";
import Swal from "sweetalert2";
import EditPayModal from "../../updatePay/EditPayModal";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

export interface PaysResponse {
  items: Pay[];
  totalItems: number;
}

interface PaysTableProps {
  search: string;
}

const PaysTable: React.FC<PaysTableProps> = ({ search }) => {
  const [pays, setPays] = useState<Pay[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingPay, setEditingPay] = useState<Pay | null>(null);
  const pageSize = 10; // Should match the value in fetchPays

  const loadPays = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response: PaysResponse = await fetchPays(pageNumber, search);
      setPays(response.items);
      
      // Calculate total pages based on total items and page size
      const calculatedTotalPages = Math.ceil(response.totalItems / pageSize);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      console.error("Erreur lors du chargement des pays :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPays(page);
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
        await deletePay(id);
        await Swal.fire("Supprimé!", "Le pays a été supprimé.", "success");
        loadPays(page);
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        Swal.fire("Erreur", "La suppression a échoué", "error");
      }
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page and ellipsis if needed
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
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(i)}>{i}</button>
        </li>
      );
    }
    
    // Add last page and ellipsis if needed
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

  return (
    <div className="pays-table-wrapper">
      {loading ? (
        <div className="text-center py-5">Chargement...</div>
      ) : (
        <table className="table pays-table m-0 text-center align-middle">
          <thead>
            <tr>
              
              <th>Nom</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pays.length > 0 ? (
              pays.map((pay) => (
                <tr key={pay.pays_id}>
                  
                  <td>{pay.pays_Nom}</td>
                  <td className="action-dropdown ">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        className="border-0 no-caret-toggle"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setEditingPay(pay)}>
                          <BsPencilSquare className="me-2 text-primary" />
                          Modifier
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => handleDelete(pay.pays_id)}
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
                <td colSpan={3} className="text-center text-muted py-5">
                  Aucun pays trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

      {/* Edit Modal */}
      {editingPay && (
        <EditPayModal
          show={true}
          onClose={() => setEditingPay(null)}
          onUpdated={() => loadPays(page)}
          payId={editingPay.pays_id}
          currentName={editingPay.pays_Nom}
        />
      )}
    </div>
  );
};

export default PaysTable;