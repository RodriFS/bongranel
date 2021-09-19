<script lang="ts">
  import { get, post } from "../api";
  import type { FindProductResponse, Product } from "../types";

  let productId;
  let products: Product[] = [];

  const findProduct = async (event?: Event) => {
    event?.preventDefault();
    if (!productId) {
      return false;
    }
    const response = await get<FindProductResponse>(`/product?name=${productId}`);
    products = response.products;
    return false;
  };

  const handleAdd = async (productId: string | number) => {
    const response = prompt("Cantidad a agregar");
    await post("/change", { id: productId.toString(), amount: response, action: "add" });
    await findProduct();
  };

  const handleEdit = async (productId: string) => {
    const response = prompt("Cantidad a reemplazar");
    await post("/change", { id: productId.toString(), amount: response, action: "replace" });
    await findProduct();
  };
</script>

<form class="search-bar-container" on:submit={findProduct}>
  Buscar producto:
  <input
    type="text"
    id="find-product-input"
    placeholder="Escribe aquí el nombre o número de producto"
    bind:value={productId}
  />
  <button type="submit" id="find-product-button">Buscar</button>
</form>
<table>
  <thead>
    <tr>
      <th class="id-column">ID</th>
      <th class="name-column">Nombre</th>
      <th class="unit-column">Unidad</th>
      <th class="limit-column">Limit</th>
      <th class="total-column">Total</th>
      <th class="total-column" />
    </tr>
  </thead>
  <tbody id="product-list-container">
    {#each products as product (product.productId)}
      <tr>
        <td>{product.productId}</td>
        <td>{product.Name}</td>
        <td>{product.units}</td>
        <td>{product.lowStock ?? ""}</td>
        <td>{product.quantity ?? ""}</td>
        <td><button on:click={() => handleAdd(product.productId)}>Add</button></td>
        <td><button on:click={() => handleEdit(product.productId)}>Edit</button></td>
      </tr>
    {/each}
  </tbody>
</table>
