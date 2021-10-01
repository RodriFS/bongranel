const SERVER_URL = `http://${window.location.hostname}:${process.env.SERVER_PORT ?? window.location.port}`;

export const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${SERVER_URL}${url}`);
  return await response.json();
};

export const post = async (url: string, body: any): Promise<void> => {
  await fetch(`${SERVER_URL}${url}`, {
    method: "POST",
    body: JSON.stringify(body),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
