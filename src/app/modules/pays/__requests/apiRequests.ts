import axios from 'axios';



const BASE_URL ="https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net"

export const fetchPays = async (page = 1, search = "") => {
  const pageSize = 10;
  let url = `https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net/api/GetEntityFieldsWithFilters?entityName=Pay&pageSize=${pageSize}&page=${page}&fields=Pays_id,Pays_Nom`;

  if (search && search.length > 0) {
    url += `&filters=Pays_Nom:contains:${search}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur lors de la récupération des pays");

  const data = await response.json();
  return data;  
};




export const createPay = async (paysNom: string) => {
  try {
    await axios.post(
      `${BASE_URL}/api/Pay`,
      JSON.stringify(paysNom.trim()),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Erreur lors de la création du pays :', error);
    throw error;
  }
};

export const deletePay = async (id: number) => {
  try {
    await axios.delete(
      `${BASE_URL}/api/Pay`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          id,
        },
      }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du pays :', error);
    throw error;
  }
};

export const updatePay = async (payId: number, payName: string) => {
  try {
    await axios.put(
      `${BASE_URL}/api/Pay`,
      {
        payId,
        payName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API updatePay error:", error);
    throw error;
  }
};

