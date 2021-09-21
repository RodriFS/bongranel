<script lang="ts">
  import { post } from "../api";
  import type { Product } from "../types";
  export let productId: string;
  export let products: Product[];
  export let findProduct: (event?: Event) => Promise<boolean>;

  const handleAdd = async (productId: string | number) => {
    const response = prompt("Cantidad a agregar");
    if (!response) {
      return;
    }
    await post("/change", { id: productId.toString(), amount: response, action: "add" });
    await findProduct();
  };

  const handleEdit = async (productId: string) => {
    const response = prompt("Cantidad a reemplazar");
    if (!response) {
      return;
    }
    await post("/change", { id: productId.toString(), amount: response, action: "replace" });
    await findProduct();
  };
</script>

<div>
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
        <th class="action-column" />
        <th class="action-column" />
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
</div>

<style>
  #find-product-input {
    width: 400px;
    margin: 25px;
  }

  table {
    width: 50%;
    margin: auto;
  }
  table tr:nth-child(even) td {
    background-color: whitesmoke;
  }

  .id-column {
    width: 10%;
  }
  .name-column {
    width: 40%;
  }
  .unit-column {
    width: 10%;
  }
  .limit-column {
    width: 10%;
  }
  .total-column {
    width: 10%;
  }
  .action-column {
    width: 10%;
  }
</style>
