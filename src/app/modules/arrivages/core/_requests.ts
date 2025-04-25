import axios from 'axios';

export interface ArrivageApiRequest {
  arrivage_DateBooking: string;
  arrivage_NumeroFactureProforma: string;
  arrivage_ToleranceTonnage: number;
  arrivage_CoutFinancement: number;
  arrivage_CoutFretEnDevise: number;
  arrivage_DeviseId: number;
  arrivage_StatutInsertion: number;
  arrivage_DateCreation: string;
  arrivage_UserId: string;
  arrivage_Actif: boolean;
  arrivage_TonnageTotal: number;
  arrivage_DelaiPaiment: number;
  arrivage_PrixUnitaireTotale: number;
  arrivage_Incoterm: string;
  arrivage_TauxChangement: number;
  arrivage_ModalitePayment: string;
  arrivage_DateLimiteChargement: string;
  arrivage_DateDepotLettreCredit: string;
}

const baseUrl = 'https://portopsapi-ecdcagbdbjfadfc6.francecentral-01.azurewebsites.net/api';
const refBaseUrl = 'https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net/api'

// Create a new arrivage
export const createArrivage = async (
  arrivageData: ArrivageApiRequest
): Promise<any> => {
   //arrivageData.arrivage_DeviseId =1
  const response = await axios.post(`${baseUrl}/Arrivage`, arrivageData, {
    headers: {
      'Content-Type': 'application/json',
      accept: '*/*',
    },
  });
  return response.data;
};


export const getDevise = async():Promise<any> =>{
    const response = await axios.get(`${refBaseUrl}/GetEntityFieldsWithFilters?entityName=Devise&pageSize=100&page=1&filters=devise_Active%3Aeq%3Atrue`)
    return response.data
}

export const getArrivageList = async (
  page: number,
  searchTerm: string = "",
) => {
  let url = `${baseUrl}/GetEntityFieldsWithFilters?entityName=Arrivage&pageSize=5&page=${page}`;
  
  // Add filter for N° Facture Proforma
  if (searchTerm && searchTerm.length > 0) {
    url += `&filters=arrivage_NumeroFactureProforma:contains:${searchTerm}`;
  }
  
  
  const response = await axios.get(url);
  return response.data;
};

export const getArrivageById = async (id:number):Promise<any> => {
  const url = `${baseUrl}/GetEntityFieldsWithFilters?entityName=Arrivage&pageSize=5&page=1&filters=Arrivage_Id:eq:${id}`;
  const response = await axios.get(url);
  return response.data.items;
};
 