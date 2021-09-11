const URL = "http://localhost:3000";
const lastConnectionElement = document.getElementById("last-connection");
const syncButtonElement = document.getElementById("sync-button");

const writeLastConnection = (stringDate) => {
  lastConnectionElement.innerText = `${new Date(stringDate).toLocaleString()}`;
};

const fetchDate = async () => {
  const response = await fetch(`${URL}/lastconnection`);
  const jsonResponse = await response.json();
  writeLastConnection(jsonResponse.lastConnection);
};

const syncNow = async () => {
  syncButtonElement.setAttribute("disabled", "true");
  const response = await fetch(`${URL}/sync`);
  const jsonResponse = await response.json();
  writeLastConnection(jsonResponse.lastConnection);
  syncButtonElement.removeAttribute("disabled");
};

fetchDate();
setInterval(async () => {
  await fetchDate();
}, 10000);

document.syncNow = syncNow;
