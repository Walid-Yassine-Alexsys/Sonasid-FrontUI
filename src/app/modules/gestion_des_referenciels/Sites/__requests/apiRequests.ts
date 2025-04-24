import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

export const fetchSites = async (page = 1, search = "") => {
    const pageSize = 10;
    let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=SITE&pageSize=${pageSize}&page=${page}&fields=site_Id,site_Nom,site_Adresse,site_VilleId,site_Actif`;
  
    if (search && search.length > 0) {
      url += `&filters=site_Nom:contains:${encodeURIComponent(search)}`;
    }
  
    try {
      console.log("Fetching sites with URL:", url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Sites API Response:", data);
      
      if (data && data.items && data.items.length > 0) {
        console.log("First site item:", data.items[0]);
        console.log("Properties in first site:", Object.keys(data.items[0]).join(", "));
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching sites:", error);
      throw error;
    }
  };
  
  export const createSite = async (siteNom: string, siteAdresse: string, siteVilleId: number, siteActif: boolean) => {
    try {
      console.log("Creating site with:", { siteNom, siteAdresse, siteVilleId, siteActif });
      const response = await axios.post(
        `${BASE_URL}/Api/Site`,
        {
          name: siteNom.trim(),
          adresse: siteAdresse.trim(),
          villeId: siteVilleId,
          site_Active: siteActif
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
        }
      );
      console.log("Create site response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du site :', error);
      throw error;
    }
  };
  
  export const deleteSite = async (id: number) => {
    try {
      console.log("Deleting site with ID:", id);
      
      const response = await axios.delete(
        `${BASE_URL}/Api/Site?id=${id}`,
        {
          headers: {
            'accept': '*/*'
          }
        }
      );
      
      console.log("Delete site response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du site :', error);
      throw error;
    }
  };
  
  export const updateSite = async (siteId: number, siteNom: string, siteAdresse: string, siteVilleId: number, siteActif: boolean) => {
    try {
      console.log("Updating site with:", { siteId, siteNom, siteAdresse, siteVilleId, siteActif });
      
      const response = await axios.put(
        `${BASE_URL}/Api/Site`,
        {
          site_Id: siteId,
          site_Name: siteNom.trim(),
          site_Adresse: siteAdresse.trim(), 
          site_VilleId: siteVilleId,
          site_Active: siteActif
        },
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
          }
        }
      );
      
      console.log("Update site response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API updateSite error:", error);
      throw error;
    }
  };