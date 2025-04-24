import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

export const fetchDevises = async (page = 1, search = "") => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=DEVISE&pageSize=${pageSize}&page=${page}&fields=devise_Id,devise_Nom,devise_Active`;

  if (search && search.length > 0) {
    url += `&filters=devise_Nom:contains:${encodeURIComponent(search)}`;
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Devises API Response:", data);
    
    // Log detailed information about the response to help debug
    if (data && data.items && data.items.length > 0) {
      console.log("First devise item:", data.items[0]);
      console.log("Properties in first devise:", Object.keys(data.items[0]).join(", "));
      
      // Log specific properties to verify their names
      const firstItem = data.items[0];
      console.log("ID property:", firstItem.devise_Id);
      console.log("Name property:", firstItem.devise_Nom);
      console.log("Active property:", firstItem.devise_Active);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching devises:", error);
    throw error;
  }
};

export const createDevise = async (deviseNom: string, deviseActive: boolean) => {
  try {
    console.log("Creating devise with:", { deviseNom, deviseActive });
    
    // Based on the curl example, the API expects just the string value (the name)
    // not a JSON object with fields
    const response = await axios.post(
      `${BASE_URL}/Api/Devise`,
      JSON.stringify(deviseNom.trim()),  // Just send the string value, not an object
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
      }
    );
    
    console.log("Create devise response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la devise :', error);
    // Log more details about the error to help debugging
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    throw error;
  }
};

export const deleteDevise = async (id: number) => {
    try {
      console.log("Deleting devise with ID:", id);
      
      // Based on the curl example, the DELETE endpoint expects a JSON body with id
      await axios.delete(
        `${BASE_URL}/Api/Devise`,
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
          },
          data: {
            id: id
          }
        }
      );
      
      console.log("Devise deleted successfully");
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la devise :', error);
      throw error;
    }
  };
  
  export const updateDevise = async (deviseId: number, deviseNom: string, deviseActive: boolean) => {
    try {
      console.log("Updating devise with:", { deviseId, deviseNom, deviseActive });
      
      // Based on the curl example, the PUT endpoint expects a JSON body with specific fields
      const response = await axios.put(
        `${BASE_URL}/Api/Devise`,
        {
          deviseId: deviseId,
          deviseName: deviseNom.trim(),
          devise_IsActive: deviseActive
        },
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
          }
        }
      );
      
      console.log("Update devise response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API updateDevise error:", error);
      throw error;
    }
  };