import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

// Interface for Qualite
export interface Qualite {
  qualite_Id: number;
  qualite_Libelle: string;
  qualite_Active: boolean;
}

// Interface for API response
export interface QualiteResponse {
  items: Qualite[];
  totalItems: number;
}

// Fetch qualities with pagination and search
export const fetchQualites = async (page = 1, search = "") => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=QUALITE&pageSize=${pageSize}&page=${page}&fields=Qualite_Id,Qualite_Libelle,Qualite_Active`;

  if (search && search.length > 0) {
    url += `&filters=Qualite_Libelle:contains:${search}`;
  }

  console.log("Fetching qualities with URL:", url);

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur lors de la récupération des qualités");

  const data = await response.json();
   
  return data;
};

// Create a new quality
export const createQualite = async (libelle: string, active: boolean) => {
    try {
      await axios.post(
        `${BASE_URL}/Api/Qualite`,
        {
          libelle: libelle.trim(),
          qualite_Active: active
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
          },
        }
      );
    } catch (error) {
      console.error('Erreur lors de la création de la qualité :', error);
      throw error;
    }
  };
  
  // Delete a quality
  export const deleteQualite = async (id: number) => {
    try {
      await axios.delete(
        `${BASE_URL}/Api/Qualite?id=${id}`,
        {
          headers: {
            'Accept': '*/*'
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors de la suppression de la qualité :', error);
      throw error;
    }
  };
  
  // Update an existing quality
  export const updateQualite = async (qualiteId: number, qualiteLibelle: string, qualiteActive: boolean) => {
    try {
      await axios.put(
        `${BASE_URL}/Api/Qualite`,
        {
          qualiteId: qualiteId,
          qualite_Libelle: qualiteLibelle.trim(),
          qualite_Active: qualiteActive
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': '*/*'
          }
        }
      );
    } catch (error) {
      console.error("API updateQualite error:", error);
      throw error;
    }
  };
  

// Get quality by ID (if needed)
export const getQualiteById = async (id: number) => {
  try {
    const url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=QUALITE&filters=Qualite_Id:equals:${id}&fields=Qualite_Id,Qualite_Libelle,Qualite_Active`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur lors de la récupération de la qualité");

    const data = await response.json();
    return data.items[0]; // Return the first (and should be only) item
  } catch (error) {
    console.error('Erreur lors de la récupération de la qualité :', error);
    throw error;
  }
};