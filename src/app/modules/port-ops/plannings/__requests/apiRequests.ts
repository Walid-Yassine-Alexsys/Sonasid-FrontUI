import axios from "axios";

const BASE_URL = "https://portopsapi-ecdcagbdbjfadfc6.francecentral-01.azurewebsites.net";

interface PLANNING_ARRIVAGE {
  PlanningArrivage_Id?: string;
  PlanningArrivage_Statut: string;
  PlanningArrivage_Mois: string;
  PlanningArrivage_Annee: string;
  PlanningArrivage_DateStatut: string;
  PlanningArrivage_MotifRejet: string;
  PlanningArrivage_DateCreation: string;
  PlanningArrivage_UserId: string;
}

// Retry logic for API calls
const axiosWithRetry = async (config: any, retries = 2): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios(config);
    } catch (error: any) {
      if (i === retries - 1 || error.response?.status < 500) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const fetchPlanningArrivage = async (page: number = 1, search: string = ""): Promise<any> => {
  const pageSize = 100;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Planning&pageSize=${pageSize}&page=${page}&fields=PlanningArrivage_Id,PlanningArrivage_Statut,PlanningArrivage_Mois,PlanningArrivage_Annee,PlanningArrivage_DateStatut,PlanningArrivage_MotifRejet,PlanningArrivage_DateCreation,PlanningArrivage_UserId`;

  if (search) {
    url += `&filters=PlanningArrivage_Id:eq:${encodeURIComponent(search)}`;
  }

  try {
    const response = await axiosWithRetry({ method: "get", url });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération des plannings:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url,
    });
    throw error;
  }
};

export const createPlanningArrivage = async (payload: PLANNING_ARRIVAGE): Promise<any> => {
  const url = `${BASE_URL}/Api/Planning`;
  try {
    const response = await axiosWithRetry({
      method: "post",
      url,
      data: payload,
      headers: { "Content-Type": "application/json", accept: "*/*" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création du planning:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url,
      payload,
    });
    throw error;
  }
};

export const updatePlanningArrivage = async (payload: PLANNING_ARRIVAGE): Promise<any> => {
  const url = `${BASE_URL}/Api/Planning`;
  try {
    const response = await axiosWithRetry({
      method: "put",
      url,
      data: payload,
      headers: { "Content-Type": "application/json", accept: "*/*" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du planning:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url,
      payload,
    });
    throw error;
  }
};