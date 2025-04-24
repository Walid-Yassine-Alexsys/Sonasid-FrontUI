// File: src/__requests/banqueApiRequests.ts
import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

// Interface for Banque
export interface Banque {
  banque_Id: number;
  banque_Nom: string;
  banque_NumeroCompte: string;
  banque_Active: boolean;
}

// Interface for API response
export interface BanqueResponse {
  items: Banque[];
  totalItems: number;
}

// Fetch banks with pagination and search

export const fetchBanques = async (page = 1, search = "") => {
    const pageSize = 10; // Ensure this is 10
    let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=BANQUE&pageSize=${pageSize}&page=${page}&fields=Banque_Id,Banque_Nom,Banque_NumeroCompte,Banque_Active`;
  
    if (search && search.length > 0) {
      url += `&filters=Banque_Nom:contains:${search}`;
    }
  
    console.log("Fetching banks with URL:", url); // Debug log to see the URL
  
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur lors de la récupération des banques");
  
    const data = await response.json();
     
    return data;
  };

// Create a new bank
export const createBanque = async (nom: string, numeroCompte: string, active: boolean) => {
    try {
      await axios.post(
        `${BASE_URL}/Api/Banque`,
        {
          banqueName: nom.trim(),
          accountNumber: numeroCompte.trim(),
          isActive: active
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
          },
        }
      );
    } catch (error) {
      console.error('Erreur lors de la création de la banque :', error);
      throw error;
    }
  };

// Delete a bank
export const deleteBanque = async (id: number) => {
  try {
    await axios.delete(
      `${BASE_URL}/Api/Banque?id=${id}`,
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la banque :', error);
    throw error;
  }
};

// Update an existing bank
export const updateBanque = async (banqueId: number, banqueNom: string, banqueNumeroCompte: string, banqueActive: boolean) => {
    try {
      // First delete the existing bank
      await deleteBanque(banqueId);
      
      // Then create a new one with the updated values
      await createBanque(banqueNom, banqueNumeroCompte, banqueActive);
    } catch (error) {
      console.error("API updateBanque error:", error);
      throw error;
    }
  };

// Get bank by ID (if needed)
export const getBanqueById = async (id: number) => {
  try {
    const url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=BANQUE&filters=Banque_Id:equals:${id}&fields=Banque_Id,Banque_Nom,Banque_NumeroCompte,Banque_Active`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur lors de la récupération de la banque");

    const data = await response.json();
    return data.items[0]; // Return the first (and should be only) item
  } catch (error) {
    console.error('Erreur lors de la récupération de la banque :', error);
    throw error;
  }
};