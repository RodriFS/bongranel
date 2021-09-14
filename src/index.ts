import { get, post } from "./api";
import { clearTable, writeLastConnection, writeProduct } from "./dom";
import { FindProductResponse, LastConnectionResponse } from "./types/types";

const lastConnectionElement = document.getElementById("last-connection");
const syncButtonElement = document.getElementById("sync-button");
const findInputElement = document.getElementById("find-product-input") as HTMLInputElement;
const productListElement = document.getElementById("product-list-container");
const addTicketInputs = document.getElementsByClassName("add-ticket-input") as HTMLCollectionOf<HTMLInputElement>;

const fetchDate = async () => {
  const response = await get<LastConnectionResponse>("/lastconnection");
  writeLastConnection(lastConnectionElement!, response.lastConnection);
};

const syncNow = async () => {
  syncButtonElement!.setAttribute("disabled", "true");
  const response = await get<LastConnectionResponse>("/sync");
  writeLastConnection(lastConnectionElement!, response.lastConnection);
  syncButtonElement!.removeAttribute("disabled");
};

const findProduct = async (event: Event) => {
  event.preventDefault();
  const value = findInputElement.value;
  if (!value) {
    return false;
  }
  clearTable(productListElement!);
  const response = await get<FindProductResponse>(`/product?name=${value}`);
  response.products.forEach((product) => {
    const element = writeProduct(product);
    productListElement!.appendChild(element);
  });
  return false;
};

const addTicket = async () => {
  const tickets = Array.from(addTicketInputs);
  if (tickets.some((input) => !input.value)) {
    return;
  }
  const product = tickets.reduce((acc, input) => {
    acc[input.name] = input.value;
    return acc;
  }, {} as Record<string, string | number>);
  await post<void>("/addticket", product);
};

fetchDate();
setInterval(async () => {
  await fetchDate();
}, 10000);

document.syncNow = syncNow;
document.findProduct = findProduct;
document.addTicket = addTicket;
