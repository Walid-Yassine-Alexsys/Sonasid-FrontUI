import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteVille, fetchVilles } from "../../__requests/apiResquests";

import EditVilleModal from "../../updateVille/EditVille";

interface Ville {
  ville_Id: number;
  ville_Nom: string;
  pays_Id: number;
}

interface VilleResponse {
  items: Ville[];
  totalItems: number;
}

interface VilleTableProps {
  search: string;
  getPaysByID?: (payId: number) => string;
  paysMap?: Record<number, string>;
}

const VilleTable: React.FC<VilleTableProps> = ({ search, getPaysByID, paysMap = {} }) => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingVille, setEditingVille] = useState<Ville | null>(null);
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

  const loadVilles = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      let filterString = "";
      
      // Add name search filter only
      if (search && search.length > 0) {
        filterString = `ville_Nom:contains:${encodeURIComponent(search)}`;
      }
      
      console.log("Using filter string:", filterString);
      
      // Custom function to call the API with filters
      const fetchWithFilters = async () => {
        const pageSize = 10;
        let url = `https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net/api/GetEntityFieldsWithFilters?entityName=Ville&pageSize=${pageSize}&page=${pageNumber}&fields=ville_Id,ville_Nom,pays_Id`;
      
        if (filterString && filterString.length > 0) {
          url += `&filters=${filterString}`;
        }
      
        console.log("Fetching villes with URL:", url);
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      };
      
      // Call the API
      const response = await fetchWithFilters();
      console.log("API Response in VilleTable:", response);
      
      if (response && response.items) {
        // Examine the properties of the first item
        if (response.items.length > 0) {
          const firstItem = response.items[0];
          console.log("COMPLETE VILLE OBJECT:", JSON.stringify(firstItem, null, 2));
          logAllProperties(firstItem, "First ville item");
        }
        
        setVilles(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(Math.ceil(response.totalItems / pageSize) || 1);
      } else {
        setError("Invalid API response format");
        setVilles([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des villes :", err);
      setError("Failed to load cities data");
      setVilles([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVilles(page);
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
        await deleteVille(id);
        await Swal.fire("Supprimé!", "La ville a été supprimée.", "success");
        loadVilles(page);
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

  // Function to get the pays name
  const getPaysName = (paysId: number): string => {
    if (paysId === undefined || paysId === null) {
      console.log("Missing pays ID");
      return 'N/A';
    }
    
    // For debugging: check what's in our maps and the specific ID we're looking for
    console.log(`Paysmap keys: ${Object.keys(paysMap).join(', ')}`);
    console.log(`Looking up ID ${paysId} in map`);
    
    // Use the provided getPaysByID function if available
    if (getPaysByID) {
      const paysName = getPaysByID(paysId);
      console.log(`Using getPaysByID for ID ${paysId}: ${paysName}`);
      return paysName;
    }
    
    // Otherwise use the paysMap directly
    const paysName = paysMap[paysId];
    console.log(`Using paysMap directly for ID ${paysId}: ${paysName || 'N/A'}`);
    return paysName || 'N/A';
  };

  return (
    <>
      <div className="p-datatable mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des villes...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-4">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="p-datatable-thead">
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Nom</th>
                  <th>Pays</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                {villes && villes.length > 0 ? (
                  villes.map((ville) => {
                    console.log(`Rendering ville ${ville.ville_Id} with pays_Id=${ville.pays_Id}`);
                    const paysName = getPaysName(ville.pays_Id);
                    
                    return (
                      <tr key={ville.ville_Id}>
                        <td style={{ paddingLeft: '20px' }}><strong>{ville.ville_Nom}</strong></td>
                        <td>{paysName}</td>
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
                              <Dropdown.Item onClick={() => setEditingVille(ville)}>
                                <BsPencilSquare className="me-2 text-primary" />
                                Modifier
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDelete(ville.ville_Id)}
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
                      Aucune ville trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && villes.length > 0 && renderPagination()}

      {/* Edit Modal */}
      {editingVille && (
        <EditVilleModal
          show={true}
          onClose={() => setEditingVille(null)}
          onUpdated={() => loadVilles(page)}
          villeId={editingVille.ville_Id}
          currentNom={editingVille.ville_Nom}
          currentPaysId={editingVille.pays_Id}
        />
      )}
    </>
  );
};

export default VilleTable;