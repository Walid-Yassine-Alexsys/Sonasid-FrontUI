import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

export const fetchFournisseurTypes = async (page = 1, search = "") => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=FOURNISSEUR_TYPE&pageSize=${pageSize}&page=${page}&fields=FournisseurType_Id,FournisseurType_Libelle`;

  if (search && search.length > 0) {
    url += `&filters=FournisseurType_Libelle:contains:${search}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur lors de la récupération des types de fournisseurs");

  const data = await response.json();
  return data;
};

export const createFournisseurType = async (libelle: string) => {
  try {
    await axios.post(
      `${BASE_URL}/Api/FournisseurType`,
      JSON.stringify(libelle.trim()),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Erreur lors de la création du type de fournisseur :', error);
    throw error;
  }
};

export const deleteFournisseurType = async (id:number) => {
  try {
    await axios.delete(
      `${BASE_URL}/Api/FournisseurType?id=${id}`,
       
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du type de fournisseur :', error);
    throw error;
  }
};

export const updateFournisseurType = async (fournisseurTypeId: number, fournisseurTypeLibelle: string) => {
  try {
    await axios.put(
      `${BASE_URL}/Api/FournisseurType`,
      {
        fournisseurType_Id: fournisseurTypeId,  
        fournisseurType_Libelle: fournisseurTypeLibelle  
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API updateFournisseurType error:", error);
    throw error;
  }
};
