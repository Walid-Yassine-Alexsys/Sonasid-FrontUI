import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deletePieceType, fetchPieceTypes } from "../../__requests/apiRequest";
import EditPieceTypeModal from "../../updatePieceType/EditePieceType";

// Raw API response interface
interface PieceTypeRaw {
  PieceType_Id?: number;
  pieceType_Id?: number;
  id?: number;
  PieceType_Libelle?: string;
  pieceType_Libelle?: string; 
  name?: string;
  PieceType_Active?: boolean;
  pieceType_Active?: boolean;
  active?: boolean;
}

// Normalized interface we use in our component
interface PieceType {
  PieceType_Id: number;
  PieceType_Libelle: string;
  PieceType_Active: boolean;
}

interface PieceTypeResponse {
  items: PieceTypeRaw[];
  totalItems: number;
}

interface PieceTypeTableProps {
  search: string;
  statusFilter?: string;
}

const PieceTypeTable: React.FC<PieceTypeTableProps> = ({ search, statusFilter = "" }) => {
  const [pieceTypes, setPieceTypes] = useState<PieceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingPieceType, setEditingPieceType] = useState<PieceType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const loadPieceTypes = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: PieceTypeResponse = await fetchPieceTypes(pageNumber, search);
      
      console.log("API Response in PieceTypeTable:", response);
      
      if (response && response.items) {
        // First, log the raw items to see exactly what the API returns
        console.log("Raw items from API:", response.items);
        
        // Map API response to ensure consistent property names
        const normalizedPieceTypes = response.items.map(item => {
          // Create a normalized object with our expected property names
          const normalizedItem: PieceType = {
            PieceType_Id: extractProperty(item, ['PieceType_Id', 'pieceType_Id', 'id', 'pieceTypeId'], 0),
            PieceType_Libelle: extractProperty(item, ['PieceType_Libelle', 'pieceType_Libelle', 'name', 'pieceTypeName'], ''),
            PieceType_Active: extractProperty(item, ['PieceType_Active', 'pieceType_Active', 'active', 'pieceTypeActive'], false),
          };
          
          return normalizedItem;
        });
        
        console.log("Normalized piece types:", normalizedPieceTypes);
        
        // Apply status filtering on the client side if needed
        let filteredPieceTypes = normalizedPieceTypes;
        if (statusFilter) {
          console.log("Applying client-side status filtering:", statusFilter);
          filteredPieceTypes = filteredPieceTypes.filter((pieceType) => {
            const isActive = statusFilter === "true";
            return pieceType.PieceType_Active === isActive;
          });
          
          // Update totals for client-side filtering
          setTotalItems(filteredPieceTypes.length);
          setTotalPages(Math.ceil(filteredPieceTypes.length / pageSize) || 1);
        } else {
          // No status filter, use API totals
          setTotalItems(response.totalItems);
          setTotalPages(Math.ceil(response.totalItems / pageSize) || 1);
        }
        
        // Limit the displayed items to the current page
        const startIndex = (pageNumber - 1) * pageSize;
        const paginatedPieceTypes = filteredPieceTypes.slice(startIndex, startIndex + pageSize);
        
        setPieceTypes(paginatedPieceTypes);
      } else {
        setError("Invalid API response format");
        setPieceTypes([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des types de pièce:", err);
      setError("Failed to load piece types data");
      setPieceTypes([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to extract properties with various possible names
  const extractProperty = <T extends string | number | boolean>(item: any, possibleKeys: string[], defaultValue: T): T => {
    for (const key of possibleKeys) {
      if (item[key] !== undefined) {
        console.log(`Found property ${key} with value:`, item[key]);
        return item[key] as T;
      }
    }
    console.log(`Could not find any of these properties: ${possibleKeys.join(', ')}`);
    return defaultValue;
  };

  useEffect(() => {
    loadPieceTypes(page);
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
        await deletePieceType(id);
        await Swal.fire("Supprimé!", "Le type de pièce a été supprimé.", "success");
        loadPieceTypes(page);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
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
  const StatusTemplate = (pieceType: PieceType) => (
    <span className={`badge-status ${pieceType.PieceType_Active ? 'badge-success' : 'badge-danger'}`}>
      {pieceType.PieceType_Active ? 'Actif' : 'Inactif'}
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
            <p className="mt-2">Chargement des types de pièce...</p>
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
                {pieceTypes && pieceTypes.length > 0 ? (
                  pieceTypes.map((pieceType) => {
                    return (
                      <tr key={pieceType.PieceType_Id || 'unknown'}>
                        <td style={{ paddingLeft: '20px' }}><strong>{pieceType.PieceType_Libelle !== undefined ? pieceType.PieceType_Libelle : 'N/A'}</strong></td>
                        <td>
                          {StatusTemplate(pieceType)}
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
                              <Dropdown.Item onClick={() => setEditingPieceType(pieceType)}>
                                <BsPencilSquare className="me-2 text-primary" />
                                Modifier
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDelete(pieceType.PieceType_Id)}
                              >
                                <BsTrash className="me-2" />
                                Supprimer
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-5">
                      Aucun type de pièce trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && pieceTypes.length > 0 && renderPagination()}

      {/* Edit Modal */}
      {editingPieceType && (
        <EditPieceTypeModal
          show={true}
          onClose={() => setEditingPieceType(null)}
          onUpdated={() => loadPieceTypes(page)}
          pieceTypeId={editingPieceType.PieceType_Id}
          currentLibelle={editingPieceType.PieceType_Libelle}
          currentActive={editingPieceType.PieceType_Active}
        />
      )}
    </>
  );
};

export default PieceTypeTable;