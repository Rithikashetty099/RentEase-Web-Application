import apiCall from './api';

export const fetchHouseList = async () => {
  try {
    const response = await apiCall('/listings/');
    return response.results || response; // Handle paginated or direct response
  } catch (error) {
    console.error('Error fetching house list:', error);
    throw error;
  }
};

export const fetchHouseById = async (id) => {
  try {
    const response = await apiCall(`/listings/${id}/`);
    return response;
  } catch (error) {
    console.error('Error fetching house by ID:', error);
    throw error;
  }
};

export const createNewHouse = async (houseData, houseImages) => {
  try {
    const newHouseData = {
      ...houseData
    };
    
    console.log('Creating house:', newHouseData);
    
    const response = await apiCall('/listings/', {
      method: 'POST',
      body: JSON.stringify(newHouseData),
    });
    
    return response;
  } catch (error) {
    console.error('Error creating house:', error);
    throw error;
  }
};

export const deleteHouse = async (id) => {
  try {
    await apiCall(`/listings/${id}/`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting house:', error);
    throw error;
  }
};
