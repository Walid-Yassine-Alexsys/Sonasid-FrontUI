import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

import EditSiteModal from "../../updateSite/EditSite";
import { deleteSite } from "../../__requests/apiRequests";

interface Site {
  site_Id: number;
  site_Nom: string;
  site_Adresse: string;
  site_VilleId: number;
  site_Actif: boolean;
}

interface SiteResponse {
  items: Site[];
  totalItems: number;
}

interface SiteTableProps {
  search: string;
  statusFilter?: string;
  getVilleByID?: (villeId: number) => string;
  villeMap?: Record<number, string>;
}

const SiteTable: React.FC<SiteTableProps> = ({ search, statusFilter = "", getVilleByID, villeMap = {} }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
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
    
    // Detailed property logging - this will help identify exactly what properties exist
    console.log(`${label} - DETAILED PROPERTIES:`);
    for (const key in obj) {
      console.log(`  - ${key}: ${typeof obj[key]} = ${JSON.stringify(obj[key])}`);
    }
  };

  const loadSites = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      // Always fetch all sites without status filter in the API request
      // We'll filter them on the client side instead
      let filterString = "";
      
      // Add name search filter only
      if (search && search.length > 0) {
        filterString = `site_Nom:contains:${encodeURIComponent(search)}`;
      }
      
      console.log("Using filter string:", filterString);
      
      // Custom function to call the API with filters
      const fetchWithFilters = async () => {
        const pageSize = 10;
        let url = `https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net/api/GetEntityFieldsWithFilters?entityName=SITE&pageSize=${pageSize}&page=${pageNumber}&fields=site_Id,site_Nom,site_Adresse,site_VilleId,site_Actif`;
      
        if (filterString && filterString.length > 0) {
          url += `&filters=${filterString}`;
        }
      
        console.log("Fetching sites with URL:", url);
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      };
      
      // Call the API with our built filters (name only)
      const response = await fetchWithFilters();
      console.log("API Response in SiteTable:", response);
      
      if (response && response.items) {
        // Examine the properties of the first item
        if (response.items.length > 0) {
          const firstItem = response.items[0];
          console.log("COMPLETE SITE OBJECT:", JSON.stringify(firstItem, null, 2));
          logAllProperties(firstItem, "First site item");
        }
        
        // Apply status filtering on the client side if needed
        let filteredSites = response.items;
        if (statusFilter) {
          console.log("Applying client-side status filtering:", statusFilter);
          filteredSites = filteredSites.filter((site: { site_Actif: boolean; }) => {
            const isActive = statusFilter === "true";
            return site.site_Actif === isActive;
          });
          
          // Update totals for client-side filtering
          setTotalItems(filteredSites.length);
          setTotalPages(Math.ceil(filteredSites.length / pageSize) || 1);
        } else {
          // No status filter, use API totals
          setTotalItems(response.totalItems);
          setTotalPages(Math.ceil(response.totalItems / pageSize) || 1);
        }
        
        // Set the sites
        setSites(filteredSites);
      } else {
        setError("Invalid API response format");
        setSites([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des sites :", err);
      setError("Failed to load sites data");
      setSites([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites(page);
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
        await deleteSite(id);
        await Swal.fire("Supprimé!", "Le site a été supprimé.", "success");
        loadSites(page);
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

  // Function to get the ville name
  const getVilleName = (villeId: number): string => {
    if (villeId === undefined || villeId === null) {
      console.log("Missing ville ID");
      return 'N/A';
    }
    
    // For debugging: check what's in our maps and the specific ID we're looking for
    console.log(`Villemap keys: ${Object.keys(villeMap).join(', ')}`);
    console.log(`Looking up ID ${villeId} in map`);
    
    // Use the provided getVilleByID function if available
    if (getVilleByID) {
      const villeName = getVilleByID(villeId);
      console.log(`Using getVilleByID for ID ${villeId}: ${villeName}`);
      return villeName;
    }
    
    // Otherwise use the villeMap directly
    const villeName = villeMap[villeId];
    console.log(`Using villeMap directly for ID ${villeId}: ${villeName || 'N/A'}`);
    return villeName || 'N/A';
  };

  // Status template
  const StatusTemplate = (site: Site) => (
    <span className={`badge-status ${site.site_Actif ? 'badge-success' : 'badge-danger'}`}>
      {site.site_Actif ? 'Actif' : 'Inactif'}
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
            <p className="mt-2">Chargement des sites...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-4">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="p-datatable-thead">
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Nom</th>
                  <th>Adresse</th>
                  <th>Ville</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                {sites && sites.length > 0 ? (
                  sites.map((site) => {
                    console.log(`Rendering site ${site.site_Id}:`, site);
                    const villeName = getVilleName(site.site_VilleId);
                    
                    return (
                      <tr key={site.site_Id}>
                        <td style={{ paddingLeft: '20px' }}><strong>{site.site_Nom}</strong></td>
                        <td>{site.site_Adresse}</td>
                        <td>{villeName}</td>
                        <td>
                          {StatusTemplate(site)}
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
                              <Dropdown.Item onClick={() => setEditingSite(site)}>
                                <BsPencilSquare className="me-2 text-primary" />
                                Modifier
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDelete(site.site_Id)}
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
                    <td colSpan={5} className="text-center text-muted py-5">
                      Aucun site trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && sites.length > 0 && renderPagination()}

      {/* Edit Modal */}
      {editingSite && (
        <EditSiteModal
          show={true}
          onClose={() => setEditingSite(null)}
          onUpdated={() => loadSites(page)}
          siteId={editingSite.site_Id}
          currentNom={editingSite.site_Nom}
          currentAdresse={editingSite.site_Adresse}
          currentVilleId={editingSite.site_VilleId}
          currentActif={editingSite.site_Actif}
        />
      )}
    </>
  );
};

export default SiteTable;