import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import VilleTable from "./__partials/VilleTable";
import CreateVille from "../createVille/CreateVille";
import { fetchAllPays } from "../__requests/apiResquests";

interface Pay {
  pays_id: number;  
  pays_Nom: string;
}

const VilleList: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [paysList, setPaysList] = useState<Pay[]>([]);
  const [paysMap, setPaysMap] = useState<Record<number, string>>({});
  const [loadingPays, setLoadingPays] = useState(false);
  const [filters, setFilters] = useState({
    search: ""
  });

  // Formik for handling form state and submission
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    validationSchema: Yup.object({
      search: Yup.string()
    }),
    onSubmit: (values) => {
      setFilters({
        search: values.search
      });
    }
  });

  const handleCreated = () => {
    setRefresh(!refresh);
  };

  const handleResetFilters = () => {
    formik.resetForm();
    setFilters({
      search: ""
    });
  };

  // Load the countries when the component mounts
  useEffect(() => {
    const loadPays = async () => {
      setLoadingPays(true);
      try {
        const countries = await fetchAllPays();
        console.log("Countries loaded in VilleList:", countries);
        setPaysList(countries);
        
        // Create a map of country ID to country name
        const map: Record<number, string> = {};
        
        // Log each country to debug
        countries.forEach((pay: Pay) => {
          console.log(`Processing country: ID=${pay.pays_id}, Name=${pay.pays_Nom}`);
          map[pay.pays_id] = pay.pays_Nom;
        });
        
        console.log("Country map created:", map);
        setPaysMap(map);
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setLoadingPays(false);
      }
    };

    loadPays();
  }, []);
  
  // Reset refresh state when search changes to force table rerender
  useEffect(() => {
    setRefresh(prev => !prev);
  }, [filters.search]);

  // Function to get country name by ID
  const getPaysByID = (payId: number): string => {
    // Debug log to track which IDs are being looked up
    console.log(`Looking up country ID ${payId}`);
    
    // Check if the ID exists in our map
    const paysName = paysMap[payId];
    
    // Log the result
    console.log(`Result for ID ${payId}: ${paysName || 'N/A'}`);
    
    return paysName || 'N/A';
  };

  return (
    <div className="container-fluid px-0">
      {/* Main title section */}
      <div className="border-0 pt-5 d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-bold custom-title text-dark">Liste des villes</span>
          
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Nouvelle ville
        </button>
      </div>

      {/* Card with filters and table */}
      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          {/* Search and Filters section */}
          <div className="row m-8 align-items-center">
            <div className="col-md-12">
              <form onSubmit={formik.handleSubmit} className="row g-3">
                <div className="col-md-9">
                  <label className="form-label" style={{ fontSize: "2rem", marginLeft: "-20px" }}>Liste des villes disponibles</label>
                  <div className="position-relative">
                    <i className="bi bi-search position-absolute" style={{ marginLeft: "-20px", left: "12px", top: "18px", color: "#adb5bd", width: "10px", fontSize: "1.3rem" }}></i>
                    <input
                      name="search"
                      type="text"
                      className="form-control"
                      placeholder="Rechercher par nom de ville..."
                      value={formik.values.search}
                      onChange={formik.handleChange}
                      style={{ marginLeft: "-20px", borderRadius: "12px", padding: "0.8rem 20.5rem 0.8rem 2.5rem", fontSize: "1rem", height: "50px" }}
                    />
                  </div>
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

          {/* Show pays loading state or table */}
          {loadingPays ? (
            <div className="text-center py-3">Chargement des pays...</div>
          ) : (
            <VilleTable 
              key={refresh.toString()} 
              search={filters.search} 
              getPaysByID={getPaysByID}
              paysMap={paysMap}
            />
          )}
        </div>
      </div>

      {/* Create Ville Modal */}
      <CreateVille
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

export default VilleList;