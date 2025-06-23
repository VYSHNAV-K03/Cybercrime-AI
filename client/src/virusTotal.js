import axios from 'axios';

const API_KEY = '3b0d51ebd48f233cacfcd72182c426f355d24d0fb1df17616c27f27aa7e64a53'; // Replace with your API key
const BASE_URL = 'https://www.virustotal.com/api/v3';

const virusTotalClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apikey': API_KEY,
  },
});

// Function to scan a URL
export const scanUrl = async (url) => {
  try {
    const response = await virusTotalClient.post(
        '/urls',
        new URLSearchParams({ url }), // Use URLSearchParams to format the payload
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Set the correct content type
          },
        }
      );
    return response.data;
  } catch (error) {
    console.error('Error scanning URL:', error);
    throw error;
  }
};

// Function to get a URL report
export const getUrlReport = async (urlId) => {
  try {
    const response = await virusTotalClient.get(`/urls/${urlId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching URL report:', error);
    throw error;
  }
};

// Function to scan a file
export const scanFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await virusTotalClient.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error scanning file:', error);
    throw error;
  }
};

// Function to get a file report
export const getFileReport = async (fileId) => {
  try {
    const response = await virusTotalClient.get(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching file report:', error);
    throw error;
  }
};

// Function to get a domain report
export const getDomainReport = async (domain) => {
  try {
    const response = await virusTotalClient.get(`/domains/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching domain report:', error);
    throw error;
  }
};