import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

export const fetchPieceTypes = async (page = 1, search = "") => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=PIECE_TYPE&pageSize=${pageSize}&page=${page}&fields=PieceType_Id,PieceType_Libelle,PieceType_Active`;

  if (search && search.length > 0) {
    url += `&filters=PieceType_Libelle:contains:${encodeURIComponent(search)}`;
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("PieceTypes API Response:", data);
    
    // Log detailed information about the response to help debug
    if (data && data.items && data.items.length > 0) {
      console.log("First piece type item:", data.items[0]);
      console.log("Properties in first piece type:", Object.keys(data.items[0]).join(", "));
      
      // Log specific properties to verify their names
      const firstItem = data.items[0];
      console.log("ID property:", firstItem.PieceType_Id);
      console.log("Name property:", firstItem.PieceType_Libelle);
      console.log("Active property:", firstItem.PieceType_Active);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching piece types:", error);
    throw error;
  }
};

export const createPieceType = async (pieceTypeLibelle: string, pieceTypeActive: boolean) => {
    try {
      console.log("Creating piece type with:", { pieceTypeLibelle, pieceTypeActive });
      
      // Based on the curl example
      const response = await axios.post(
        `${BASE_URL}/Api/PieceType`,
        {
          libelle: pieceTypeLibelle.trim(),
          pieceType_Active: pieceTypeActive
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          },
        }
      );
      
      console.log("Create piece type response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du type de pièce :', error);
      // Log more details about the error to help debugging
      if (axios.isAxiosError(error)) {
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      throw error;
    }
  };
  
  export const deletePieceType = async (id: number) => {
      try {
        console.log("Deleting piece type with ID:", id);
        
        // Based on the curl example - using URL parameter instead of request body
        await axios.delete(
          `${BASE_URL}/Api/PieceType?id=${id}`,
          {
            headers: {
              'accept': '*/*'
            }
          }
        );
        
        console.log("Piece type deleted successfully");
        return true;
      } catch (error) {
        console.error('Erreur lors de la suppression du type de pièce :', error);
        throw error;
      }
    };
    
  export const updatePieceType = async (pieceTypeId: number, pieceTypeLibelle: string, pieceTypeActive: boolean) => {
    try {
      console.log("Updating piece type with:", { pieceTypeId, pieceTypeLibelle, pieceTypeActive });
      
      // Based on the curl example
      const response = await axios.put(
        `${BASE_URL}/Api/PieceType`,
        {
          pieceType_Id: pieceTypeId,
          pieceType_Libelle: pieceTypeLibelle.trim(),
          pieceType_Active: pieceTypeActive
        },
        {
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
          }
        }
      );
      
      console.log("Update piece type response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API updatePieceType error:", error);
      throw error;
    }
  };