/**
 * Formats a date string to a more readable format (DD/MM/YYYY HH:mm)
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return 'N/A';
      
      // Log the original date string for debugging
      console.log("Formatting date:", dateString);
      
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return 'Date invalide';
      }
      
      // Format the date as DD/MM/YYYY HH:mm
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
      console.log("Formatted date:", formattedDate);
      
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error, "for date string:", dateString);
      return 'Erreur de format';
    }
  };