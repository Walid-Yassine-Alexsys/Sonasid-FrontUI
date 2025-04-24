import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteCondition, fetchConditions } from "../../__requests/apiRequest";
import EditConditionModal from "../../updateConditionContrat/EditeConditionContrat";

// Raw API response interface
interface ConditionRaw {
  Condition_Id?: number;
  condition_Id?: number;
  id?: number;
  Condition_Libelle?: string;
  condition_Libelle?: string;
  libelle?: string;
}

// Normalized interface we use in our component
interface Condition {
  Condition_Id: number;
  Condition_Libelle: string;
}

interface ConditionResponse {
  items: ConditionRaw[];
  totalItems: number;
}

interface ConditionsTableProps {
  search: string;
}

const ConditionsTable: React.FC<ConditionsTableProps> = ({ search }) => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const loadConditions = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const response: ConditionResponse = await fetchConditions(pageNumber, search);
      
      console.log("API Response in ConditionsTable:", response);
      
      if (response && response.items) {
        // First, log the raw items to see exactly what the API returns
        console.log("Raw items from API:", response.items);
        
        // Map API response to ensure consistent property names
        const normalizedConditions = response.items.map(item => {
          // Create a normalized object with our expected property names
          const normalizedItem: Condition = {
            Condition_Id: extractProperty(item, ['Condition_Id', 'condition_Id', 'id', 'conditionId'], 0),
            Condition_Libelle: extractProperty(item, ['Condition_Libelle', 'condition_Libelle', 'libelle', 'conditionLibelle'], ''),
          };
          
          return normalizedItem;
        });
        
        console.log("Normalized conditions:", normalizedConditions);
        
        // Limit to pageSize items
        setConditions(normalizedConditions.slice(0, pageSize));
        
        // Store total items count
        setTotalItems(response.totalItems);
        
        // Calculate total pages based on total items and page size
        const calculatedTotalPages = Math.ceil(response.totalItems / pageSize);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
      } else {
        setError("Invalid API response format");
        setConditions([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des conditions:", err);
      setError("Failed to load conditions data");
      setConditions([]);
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
    loadConditions(page);
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
        await deleteCondition(id);
        await Swal.fire("Supprimé!", "La condition a été supprimée.", "success");
        loadConditions(page);
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

  return (
    <>
      <div className="p-datatable mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des conditions...</p>
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
                {conditions && conditions.length > 0 ? (
                  conditions.map((condition) => {
                    return (
                      <tr key={condition.Condition_Id || 'unknown'}>
                        <td style={{ paddingLeft: '20px' }}><strong>{condition.Condition_Libelle !== undefined ? condition.Condition_Libelle : 'N/A'}</strong></td>
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
                              <Dropdown.Item onClick={() => setEditingCondition(condition)}>
                                <BsPencilSquare className="me-2 text-primary" />
                                Modifier
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDelete(condition.Condition_Id)}
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
                    <td colSpan={2} className="text-center text-muted py-5">
                      Aucune condition trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && conditions.length > 0 && renderPagination()}

      {/* Edit Modal */}
      {editingCondition && (
        <EditConditionModal
          show={true}
          onClose={() => setEditingCondition(null)}
          onUpdated={() => loadConditions(page)}
          conditionId={editingCondition.Condition_Id}
          currentLibelle={editingCondition.Condition_Libelle}
        />
      )}
    </>
  );
};

export default ConditionsTable;