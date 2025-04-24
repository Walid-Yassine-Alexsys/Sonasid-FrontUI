import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

// Fetch zone destinations with pagination and search
export const fetchZoneDestinations = async (page = 1, search = "", siteId = "") => {
  const pageSize = 10;
  
  try {
    console.log("Fetching zone destinations, page:", page, "search:", search, "siteId:", siteId);
    
    // Build the base URL
    let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=ZoneDestination&pageSize=${pageSize}&page=${page}`;
    
    // Build filters
    const filters = [];
    
    // Add search filter if provided
    if (search && search.length > 0) {
      filters.push(`zoneDestination_Libelle:contains:${encodeURIComponent(search)}`);
    }
    
    // Add site filter if provided - use "eq" instead of "equals" as the operator
    if (siteId && siteId.length > 0) {
      filters.push(`zoneDestination_SiteId:eq:${encodeURIComponent(siteId)}`);
    }
    
    // Append filters to URL if any exist
    if (filters.length > 0) {
      url += `&filters=${filters.join(',')}`;
    }
    
    console.log("API request URL:", url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Zone Destinations API Response:", data);
    
    // This is critical - we're now returning the data directly without transformation
    // since the API is already returning correctly formatted data
    return data;
  } catch (error) {
    console.error("Error fetching zone destinations:", error);
    throw error;
  }
};

// Create a new zone destination
export const createZoneDestination = async (
  libelle: string, 
  siteId: number, 
  userId: number | string = 1,
  dateCreation?: string
) => {
  try {
    // Use provided date or current date in ISO format
    const creationDate = dateCreation || new Date().toISOString();
    
    console.log("Creating zone destination with:", { 
      libelle, 
      siteId, 
      userId,
      dateCreation: creationDate 
    });
    
    const payload = {
      zoneDestination_Libelle: libelle.trim(),
      zoneDestination_SiteId: siteId,
      zoneDestination_DateCreation: creationDate,
      zoneDestination_UserId: userId.toString() // API expects string based on the curl example
    };
    
    console.log("Create payload:", payload);
    
    const response = await axios.post(
      `${BASE_URL}/Api/ZoneDestination`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
      }
    );
    console.log("Create zone destination response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la zone de destination :', error);
    throw error;
  }
};

// Update an existing zone destination
export const updateZoneDestination = async (
  id: number, 
  libelle: string, 
  siteId: number, 
  userId: number | string = 1,
  dateCreation?: string
) => {
  try {
    console.log("Updating zone destination with:", { id, libelle, siteId, userId, dateCreation });
    
    // Use provided date or current date
    const creationDate = dateCreation || new Date().toISOString();
    
    // Use the exact same field structure that we saw in the API response
    const response = await axios.put(
      `${BASE_URL}/Api/ZoneDestination`,
      {
        id: id, // Note: this uses "id" without prefix
        zoneDestination_Libelle: libelle.trim(),
        zoneDestination_SiteId: siteId,
        zoneDestination_DateCreation: creationDate,
        zoneDestination_UserId: userId.toString() // API expects string based on the curl example
      },
      {
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        }
      }
    );
    
    console.log("Update zone destination response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API updateZoneDestination error:", error);
    throw error;
  }
};

// Delete a zone destination
// Based on curl example, the DELETE endpoint uses /{id} format
export const deleteZoneDestination = async (id: number) => {
  try {
    console.log("Deleting zone destination with ID:", id);
    
    const response = await axios.delete(
      `${BASE_URL}/Api/ZoneDestination/${id}`,
      {
        headers: {
          'accept': '*/*'
        }
      }
    );
    
    console.log("Delete zone destination response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la zone de destination :', error);
    throw error;
  }
};