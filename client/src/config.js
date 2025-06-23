const token = localStorage.getItem('token');

export const base = "http://localhost:7000/";


const config = {
    headers: {
      'x-auth-token': token,
    },
  };

  export default config