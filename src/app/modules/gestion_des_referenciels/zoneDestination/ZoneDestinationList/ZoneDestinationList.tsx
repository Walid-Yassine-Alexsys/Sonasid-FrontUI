import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ZoneDestinationTable from "./__partials/ZoneDestinationTable";
import { fetchSites } from "../../Sites/__requests/apiRequests";
import CreateZoneDestinationModal from "../createZoneDestination/CreateZoneDestination";

interface Site {
  site_Id: number;
  site_Nom: string;
}

const ZoneDestinationList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [sitesList, setSitesList] = useState<Site[]>([]);
  const [siteMap, setSiteMap] = useState<Record<number, string>>({});
  const [loadingSites, setLoadingSites] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    siteId: ""
  });

  // Formik for handling form state and submission
  const formik = useFormik({
    initialValues: {
      search: "",
      siteId: ""
    },
    validationSchema: Yup.object({
      search: Yup.string(),
      siteId: Yup.string()
    }),
    onSubmit: (values) => {
      console.log("Submitting filter form with values:", values);
      setFilters({
        search: values.search,
        siteId: values.siteId
      });
    }
  });

  const handleCreated = () => {
    setRefresh(!refresh);
  };

  const handleResetFilters = () => {
    console.log("Resetting filters");
    formik.resetForm();
    // Important: Also update the filters state to trigger the data reload
    setFilters({
      search: "",
      siteId: ""
    });
  };

  // Load the sites when the component mounts
  useEffect(() => {
    const loadSites = async () => {
      setLoadingSites(true);
      try {
        const response = await fetchSites(1, "");
        if (response && response.items) {
          console.log("Sites loaded in ZoneDestinationList:", response.items);
          setSitesList(response.items);
          
          // Create a map of site ID to site name
          const map: Record<number, string> = {};
          
          // Process each site 
          response.items.forEach((site: Site) => {
            console.log(`Processing site: ID=${site.site_Id}, Name=${site.site_Nom}`);
            map[site.site_Id] = site.site_Nom;
          });
          
          console.log("Site map created:", map);
          setSiteMap(map);
        }
      } catch (error) {
        console.error("Error loading sites:", error);
      } finally {
        setLoadingSites(false);
      }
    };

    loadSites();
  }, []);

  // Function to get site name by ID
  const getSiteByID = (siteId: number): string => {
    // Check if the ID exists in our map
    const siteName = siteMap[siteId];
    return siteName || 'N/A';
  };

  return (
    <div className="container-fluid px-0">
      {/* Main title section */}
      <div className="border-0 pt-5 d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-bold custom-title text-dark">Zones de destination</span>
          
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Nouvelle zone
        </button>
      </div>

      {/* Card with filters and table */}
      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          {/* Search and Filters section */}
          <div className="row m-8 align-items-center">
            <div className="col-md-12">
              <form onSubmit={formik.handleSubmit} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" style={{ fontSize: "2rem", marginLeft: "-20px" }}>Liste des zones de destination disponibles</label>
                  <div className="position-relative">
                    <i className="bi bi-search position-absolute" style={{ marginLeft: "-20px", left: "12px", top: "18px", color: "#adb5bd", width: "10px", fontSize: "1.3rem" }}></i>
                    <input
                      name="search"
                      type="text"
                      className="form-control"
                      placeholder="Rechercher par nom..."
                      value={formik.values.search}
                      onChange={formik.handleChange}
                      style={{ marginLeft: "-20px", borderRadius: "12px", padding: "0.8rem 20.5rem 0.8rem 2.5rem", fontSize: "1rem", height: "50px" }}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  
                  <select
                    name="siteId"
                    className="form-select"
                    value={formik.values.siteId}
                    onChange={formik.handleChange}
                    style={{ marginLeft: "-20px", borderRadius: "12px", padding: "0.8rem 1rem", fontSize: "1rem", height: "50px",marginTop:"44px" }}
                  >
                    <option value="">Tous les sites</option>
                    {sitesList.map(site => (
                      <option key={site.site_Id} value={site.site_Id}>
                        {site.site_Nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <button
                    type="submit"
                    className="btn btn-filter me-2"
                    title="Filtrer"
                    style={{ background: "transparent", padding: "0", border: "none" }}
                  >
                    <i className="bi bi-funnel" style={{
                      border: "2px solid #dee2e6",
                      borderRadius: "6px",
                      padding: "14px",
                      fontSize: "1rem",
                      color: "#6c757d",
                      transition: "all 0.3s ease"
                    }}></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetFilters}
                    title="Réinitialiser"
                    style={{ 
                      background: "transparent", 
                      color: "#6c757d", 
                      border: "2px solid #dee2e6",
                      borderRadius: "6px",
                      padding: "10px 10px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Show sites loading state or table */}
          {loadingSites ? (
            <div className="text-center py-3">Chargement des sites...</div>
          ) : (
            <ZoneDestinationTable 
              key={refresh.toString() + filters.search + filters.siteId} 
              search={filters.search}
              siteId={filters.siteId} // Changed from siteFilter to siteId
              getSiteByID={getSiteByID}
              siteMap={siteMap}
            />
          )}
        </div>
      </div>

      {/* Create Zone Destination Modal */}
      <CreateZoneDestinationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
      />

      {/* Add styling directly in component */}
      <style>{`
        .m-8 {
          margin: 2rem;
        }
        
        .card-header-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .card-header-subtitle {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .btn-filter:hover i {
          color: #fff !important;
          background-color: #fc5421 !important;
          border-color: #fc5421 !important;
        }
        
        .btn-secondary:hover {
          background-color: #fc5421 !important;
          color: #fff !important;
          border-color: #fc5421 !important;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        @media (max-width: 768px) {
          .form-group {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ZoneDestinationList;