import axios from "axios";

const BASE_URL =
  "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface Ville {
  ville_id: number;
  ville_Nom: string;
}

interface Port {
  port_ID: number;
  port_Nom: string;
  port_CodeIATA: string;
  port_CodeUNLOCODE: string;
  port_PaysId: number;
  port_PaysNom?: string;
  port_VilleId: number;
  port_VilleNom?: string;
  port_Latitude: number;
  port_Longitude: number;
  port_DateCreation: string;
  port_UserId: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

export const fetchPays = async (page = 1, search = "") => {
  const pageSize = 100;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Pay&pageSize=${pageSize}&page=${page}&fields=Pays_id,Pays_Nom`;

  if (search && search.length > 0) {
    url += `&filters=Pays_Nom:contains:${search}`;
  }

  try {
    const response = await axios.get(url);
    console.log("Pays response:", response.data); // Debug log
    return response.data;
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des pays :", error);
    throw new Error("Échec de la récupération des pays. Veuillez réessayer.");
  }
};

export const fetchVilles = async (page = 1, search = "", paysId = 0) => {
  const pageSize = 100;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Ville&pageSize=${pageSize}&page=${page}&fields=Ville_id,Ville_Nom`;

  const filters = [];
  if (search && search.length > 0) {
    filters.push(`Ville_Nom:contains:${search}`);
  }
  if (paysId > 0) {
    filters.push(`Ville_PaysId:eq:${paysId}`);
  }
  if (filters.length > 0) {
    url += `&filters=${filters.join(",")}`;
  }

  try {
    const response = await axios.get(url);
    console.log("Villes response:", response.data); // Debug log
    return response.data;
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des villes :", error);
    throw new Error("Échec de la récupération des villes. Veuillez réessayer.");
  }
};

export const fetchPorts = async (
  page = 1,
  search = "",
  codeIATA = "",
  codeUNLOCODE = "",
  paysId = 0,
  villeId = 0,
  dateCreation: Date | null = null
) => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Port&pageSize=${pageSize}&page=${page}&fields=Port_ID,Port_Nom,Port_CodeIATA,Port_CodeUNLOCODE,Port_PaysId,Port_VilleId,Port_Latitude,Port_Longitude,Port_DateCreation,Port_UserId`;

  const filters = [];
  if (search && search.length > 0) {
    filters.push(`Port_Nom:contains:${search}`);
  }
  if (codeIATA && codeIATA.length > 0) {
    filters.push(`Port_CodeIATA:contains:${codeIATA}`);
  }
  if (codeUNLOCODE && codeUNLOCODE.length > 0) {
    filters.push(`Port_CodeUNLOCODE:contains:${codeUNLOCODE}`);
  }
  if (paysId > 0) {
    filters.push(`Port_PaysId:eq:${paysId}`);
  }
  if (villeId > 0) {
    filters.push(`Port_VilleId:eq:${villeId}`);
  }
  if (dateCreation) {
    const formattedDate = dateCreation.toISOString().split("T")[0];
    filters.push(`Port_DateCreation:eq:${formattedDate}`);
  }

  if (filters.length > 0) {
    url += `&filters=${filters.join(",")}`;
  }

  try {
    const response = await axios.get(url);
    console.log("Ports response:", response.data); // Debug log
    const portData = response.data.items || [];

    const paysResponse = await fetchPays(1, "");
    const paysData = paysResponse.items || [];
    if (!paysData.length) {
      console.warn("No pays data received"); // Debug log
    }

    const villeResponse = await fetchVilles(1, "");
    const villeData = villeResponse.items || [];
    if (!villeData.length) {
      console.warn("No villes data received"); // Debug log
    }

    const enrichedData = portData.map((port: Port) => {
      const pays = paysData.find((p: Pay) => p.pays_id === port.port_PaysId);
      const ville = villeData.find((v: Ville) => v.ville_id === port.port_VilleId);
      console.log(`Mapping port ${port.port_ID}: PaysId=${port.port_PaysId}, VilleId=${port.port_VilleId}, PaysNom=${pays?.pays_Nom}, VilleNom=${ville?.ville_Nom}`); // Debug log
      return {
        ...port,
        port_PaysNom: pays ? pays.pays_Nom : "Pays non trouvé",
        port_VilleNom: ville ? ville.ville_Nom : "Ville non trouvée",
      };
    });

    return {
      items: enrichedData,
      totalItems: response.data.totalItems || 0,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des ports :", error);
    throw new Error("Échec de la récupération des ports. Veuillez réessayer.");
  }
};

export const createPort = async (
  data: Omit<Port, "port_ID" | "port_DateCreation" | "port_UserId">
): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/api/Port`,
      {
        port_Nom: data.port_Nom.trim(),
        port_CodeIATA: data.port_CodeIATA.trim(),
        port_CodeUNLOCODE: data.port_CodeUNLOCODE.trim(),
        port_PaysId: data.port_PaysId,
        port_VilleId: data.port_VilleId,
        port_Latitude: data.port_Latitude,
        port_Longitude: data.port_Longitude,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la création du port :", error);
    throw new Error("Échec de la création du port. Veuillez réessayer.");
  }
};

export const deletePort = async (port_ID: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/Port?id=${port_ID}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la suppression du port :", error);
    throw new Error("Échec de la suppression du port. Veuillez réessayer.");
  }
};

export const updatePort = async (
  port_ID: number,
  data: Omit<Port, "port_ID" | "port_DateCreation" | "port_UserId">
): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/api/Port`,
      {
        id: port_ID,
        port_Nom: data.port_Nom.trim(),
        port_CodeIATA: data.port_CodeIATA.trim(),
        port_CodeUNLOCODE: data.port_CodeUNLOCODE.trim(),
        port_PaysId: data.port_PaysId,
        port_VilleId: data.port_VilleId,
        port_Latitude: data.port_Latitude,
        port_Longitude: data.port_Longitude,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la modification du port :", error);
    throw new Error("Échec de la modification du port. Veuillez réessayer.");
  }
};