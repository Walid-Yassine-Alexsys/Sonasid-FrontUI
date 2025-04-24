import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";


export const fetchVilles = async (page = 1, search = "") => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=VILLE&pageSize=${pageSize}&page=${page}&fields=ville_Id,ville_Nom,pays_Id`;

  if (search && search.length > 0) {
    url += `&filters=ville_Nom:contains:${encodeURIComponent(search)}`;
  }

  try {
    console.log("Fetching villes with URL:", url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Villes API Response:", data);
    

    if (data && data.items && data.items.length > 0) {
      console.log("First ville item:", data.items[0]);
      console.log("Properties in first ville:", Object.keys(data.items[0]).join(", "));
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching villes:", error);
    throw error;
  }
};
// For dropdowns when you need all countries
export const fetchAllPays = async () => {
  const pageSize = 1000; // Increase page size to ensure we get all countries
  // Make sure to match the field names exactly as they appear in the API response
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Pay&pageSize=${pageSize}&page=1&fields=pays_id,pays_Nom`;

  try {
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Pays API Response:", data);
    
    if (!data || !Array.isArray(data.items)) {
      console.error("Unexpected API response format for pays:", data);
      return [];
    }
    
    // Log each country to make sure we have the correct structure
    if (data.items.length > 0) {
      console.log("First country object:", data.items[0]);
      console.log("Properties in first country:", Object.keys(data.items[0]).join(", "));
    }
    
    return data.items;
  } catch (error) {
    console.error("Error fetching pays:", error);
    throw error;
  }
};
export const createVille = async (villeNom: string, villePaysId: number) => {
  try {
    console.log("Creating ville with:", { villeNom, villePaysId });
    const response = await axios.post(
      `${BASE_URL}/Api/Ville`,
      {
        ville_Nom: villeNom.trim(),
        pays_Id: villePaysId  
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("Create ville response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la ville :', error);
    throw error;
  }
};

export const deleteVille = async (id: number) => {
  try {
    console.log("Deleting ville with ID:", id);
    
    const response = await axios.delete(
      `${BASE_URL}/Api/Ville?id=${id}`,
      {
        headers: {
          'accept': '*/*'
        }
      }
    );
    
    console.log("Delete ville response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la ville :', error);
    throw error;
  }
};
export const updateVille = async (villeId: number, villeNom: string, villePaysId: number) => {
  try {
    console.log("Updating ville with:", { villeId, villeNom, villePaysId });
    
    
    const response = await axios.put(
      `${BASE_URL}/Api/Ville`,
      {
        id: villeId,
        name: villeNom, 
        pays_Id: villePaysId
      },
      {
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        }
      }
    );
    
    console.log("Update ville response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API updateVille error:", error);
    throw error;
  }
};