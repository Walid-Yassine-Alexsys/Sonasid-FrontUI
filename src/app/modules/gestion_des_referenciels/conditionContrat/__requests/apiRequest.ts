import axios from 'axios';

const BASE_URL = "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

export const fetchConditions = async (page = 1, search = "") => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=CONDITIONS_CONTRAT&pageSize=${pageSize}&page=${page}&fields=Condition_Id,Condition_Libelle`;

  if (search && search.length > 0) {
    url += `&filters=Condition_Libelle:contains:${encodeURIComponent(search)}`;
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Conditions API Response:", data);
    
    // Log detailed information about the response to help debug
    if (data && data.items && data.items.length > 0) {
      console.log("First condition item:", data.items[0]);
      console.log("Properties in first condition:", Object.keys(data.items[0]).join(", "));
      
      // Log specific properties to verify their names
      const firstItem = data.items[0];
      console.log("ID property:", firstItem.Condition_Id);
      console.log("Name property:", firstItem.Condition_Libelle);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching conditions:", error);
    throw error;
  }
};

export const createCondition = async (conditionLibelle: string) => {
  try {
    console.log("Creating condition with:", { conditionLibelle });
    
    // Based on the curl example, the POST endpoint expects a JSON with libelle property
    const response = await axios.post(
      `${BASE_URL}/Api/ConditionContrat`,
      {
        libelle: conditionLibelle.trim()
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
      }
    );
    
    console.log("Create condition response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la condition :', error);
    // Log more details about the error to help debugging
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    throw error;
  }
};

export const deleteCondition = async (id: number) => {
  try {
    console.log("Deleting condition with ID:", id);
    
    // Based on the curl example, it's using query parameter not body
    await axios.delete(
      `${BASE_URL}/Api/ConditionContrat?id=${id}`,
      {
        headers: {
          'accept': '*/*'
        }
      }
    );
    
    console.log("Condition deleted successfully");
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la condition :', error);
    throw error;
  }
};

export const updateCondition = async (conditionId: number, conditionLibelle: string) => {
  try {
    console.log("Updating condition with:", { conditionId, conditionLibelle });
    
    // Based on the curl example, the field is called condition_Libelle in the PUT request
    const response = await axios.put(
      `${BASE_URL}/Api/ConditionContrat`,
      {
        conditionId: conditionId,
        condition_Libelle: conditionLibelle.trim()
      },
      {
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        }
      }
    );
    
    console.log("Update condition response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API updateCondition error:", error);
    throw error;
  }
};