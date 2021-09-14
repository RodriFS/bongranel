const SERVER_URL = `http://localhost:${process.env.PORT}`;

export const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${SERVER_URL}${url}`);
  return await response.json();
};

export const post = async <T>(url: string, body: any): Promise<T> => {
  const response = await fetch(`${SERVER_URL}${url}`, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
