import { post } from "./api";
import { Product } from "./types/types";

const createEditorElements = (product: Product, parent: HTMLTableRowElement) => {
  const element = document.createElement("td");
  const addButton = document.createElement("button");
  const editButton = document.createElement("button");
  addButton.innerText = "Add";
  addButton.onclick = async () => {
    const response = prompt("Cantidad a agregar");
    await post<void>("/change", { id: product.productId, amount: response, action: "add" });
  };
  editButton.innerText = "Edit";
  editButton.onclick = async () => {
    const response = prompt("Cantidad a reemplazar");
    await post<void>("/change", { id: product.productId, amount: response, action: "replace" });
  };

  element.appendChild(addButton);
  element.appendChild(editButton);
  parent.appendChild(element);
};
export const writeProduct = (product: Product) => {
  const columns: Array<keyof Product> = ["productId", "Name", "units", "lowStock", "quantity"];
  const productElement = document.createElement("tr");
  columns.forEach((columnName) => {
    const element = document.createElement("td");
    element.innerText = product[columnName]?.toString() ?? "";
    productElement.appendChild(element);
  });
  createEditorElements(product, productElement);
  return productElement;
};

export const writeLastConnection = (element: HTMLElement, stringDate: string) => {
  element.innerText = `${new Date(stringDate).toLocaleString()}`;
};

export const clearTable = (element: HTMLElement) => {
  element.innerHTML = "";
};
