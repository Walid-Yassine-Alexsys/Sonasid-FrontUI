import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteZoneDestination, fetchZoneDestinations } from "../../__requests/apiRequests";
import EditZoneDestinationModal from "../../updateZoneDestination/EditZoneDestination";
import { formatDate } from "../../__requests/dateUtils";

// Updated interface to match the API response
interface ZoneDestination {
  zoneDestination_Id: number;
  zoneDestination_Libelle: string;
  zoneDestination_SiteId: number;
  zoneDestination_DateCreation: string;
  
}

interface ZoneDestinationResponse {
  items: ZoneDestination[];
  totalItems: number;
}

interface ZoneDestinationTableProps {
  search: string;
  siteId: string; // Changed from siteFilter to siteId to match API call
  getSiteByID?: (siteId: number) => string;
  siteMap?: Record<number, string>;
}

const ZoneDestinationTable: React.FC<ZoneDestinationTableProps> = ({ 
  search, 
  siteId = "", // Changed from siteFilter
  getSiteByID, 
  siteMap = {} 
}) => {
  const [zoneDestinations, setZoneDestinations] = useState<ZoneDestination[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingZoneDestination, setEditingZoneDestination] = useState<ZoneDestination | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const loadZoneDestinations = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Loading zone destinations, page:", pageNumber, "search:", search, "siteId:", siteId);
      const response = await fetchZoneDestinations(pageNumber, search, siteId);
      console.log("Zone Destinations Response:", response);
      
      if (response && response.items) {
        // Log each item to debug issues
        response.items.forEach((item: any, index: number) => {
          console.log(`Zone item ${index}:`, item);
        });
        
        setZoneDestinations(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(Math.ceil(response.totalItems / pageSize) || 1);
      } else {
        setError("Invalid API response format");
        setZoneDestinations([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des zones de destination :", err);
      setError("Failed to load zone destinations data");
      setZoneDestinations([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZoneDestinations(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, siteId]); // Changed from siteFilter to siteId

  // Reset to page 1 when search or site filter changes
  useEffect(() => {
    console.log("Filter changed, resetting to page 1");
    console.log("New search:", search);
    console.log("New siteId:", siteId);
    setPage(1);
  }, [search, siteId]); // Changed from siteFilter to siteId

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
        await deleteZoneDestination(id);
        await Swal.fire("Supprimé!", "La zone de destination a été supprimée.", "success");
        loadZoneDestinations(page);
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

  // Function to get the site name
  const getSiteName = (siteId: number): string => {
    if (siteId === undefined || siteId === null) {
      console.log("Missing site ID");
      return 'N/A';
    }
    
    console.log(`Looking up site ID ${siteId} in map:`, siteMap);
    
    // Use the provided getSiteByID function if available
    if (getSiteByID) {
      const siteName = getSiteByID(siteId);
      console.log(`Found site name using getSiteByID: ${siteName}`);
      return siteName;
    }
    
    // Otherwise use the siteMap directly
    const siteName = siteMap[siteId];
    console.log(`Found site name using siteMap: ${siteName || 'N/A'}`);
    return siteName || 'N/A';
  };

  return (
    <>
      <div className="p-datatable mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des zones de destination...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger m-4">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead className="p-datatable-thead">
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Nom</th>
                  <th>Site</th>
                  <th>Date de création</th>
                  
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody className="p-datatable-tbody">
                {zoneDestinations && zoneDestinations.length > 0 ? (
                  zoneDestinations.map((zone) => {
                    // Log the zone object for debugging
                    console.log(`Rendering zone ${zone.zoneDestination_Id}:`, zone);
                    
                    // Get site name, with fallback
                    const siteName = getSiteName(zone.zoneDestination_SiteId);
                    
                    // Format the date, with fallback
                    const formattedDate = zone.zoneDestination_DateCreation ? 
                      formatDate(zone.zoneDestination_DateCreation) : 'N/A';
                    
                    return (
                      <tr key={zone.zoneDestination_Id}>
                        <td style={{ paddingLeft: '20px' }}>
                          <strong>{zone.zoneDestination_Libelle || 'N/A'}</strong>
                        </td>
                        <td>{siteName}</td>
                        <td>{formattedDate}</td>
                        
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
                              <Dropdown.Item onClick={() => setEditingZoneDestination(zone)}>
                                <BsPencilSquare className="me-2 text-primary" />
                                Modifier
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDelete(zone.zoneDestination_Id)}
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
                    <td colSpan={5} className="text-center text-muted py-5"> {/* Updated colspan to 5 */}
                      Aucune zone de destination trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && zoneDestinations.length > 0 && renderPagination()}

      {/* Edit Modal */}
      {editingZoneDestination && (
        <EditZoneDestinationModal
          show={true}
          onClose={() => setEditingZoneDestination(null)}
          onUpdated={() => loadZoneDestinations(page)}
          zoneId={editingZoneDestination.zoneDestination_Id}
          currentLibelle={editingZoneDestination.zoneDestination_Libelle}
          currentSiteId={editingZoneDestination.zoneDestination_SiteId}
          currentDateCreation={editingZoneDestination.zoneDestination_DateCreation}
          
        />
      )}
    </>
  );
};

export default ZoneDestinationTable;