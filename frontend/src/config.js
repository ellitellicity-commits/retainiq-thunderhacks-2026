const API = process.env.REACT_APP_API_URL;

if (!API) {
  throw new Error("Missing REACT_APP_API_URL");
}

export default API;
