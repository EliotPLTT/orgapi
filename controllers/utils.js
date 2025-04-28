import axios from 'axios';

export const fetchPage = async (encodedUrl) => {
  const decodedUrl = decodeURIComponent(encodedUrl);
  const response = await axios.get(decodedUrl);
  return response.data; // HTML brut
};

export const postReq = async (url, data) => {
      // Await the POST request and assign the response object to a variable
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Node.js'
        }});
      sleep(300);
      return response.data
};

export const getDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };

export const enlistedToStamp = (dateString) => {
  const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const formattedDate = `${year}/${month}/${day}`;
    return formattedDate;
}

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const appartient = (el,liste) => {
  for (let i = 0; i < liste.length; i++){
    if (liste[i] == el){return true}
  }
  return false
}