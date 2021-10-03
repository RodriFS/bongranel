const SERVER_URL = `http://${window.location.hostname}:${process.env.SERVER_PORT ?? window.location.port}`;

export const get = async <T>(path: string, params?: Record<string, unknown>): Promise<T> => {
  const url = new URL(`${SERVER_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });
  }
  const response = await fetch(url.toString());
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

export const put = async (path: string, id: string, body: any): Promise<void> => {
  const url = new URL(`${SERVER_URL}${path}`);
  url.searchParams.append("id", id);
  await fetch(url.toString(), {
    method: "PUT",
    body: JSON.stringify(body),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
