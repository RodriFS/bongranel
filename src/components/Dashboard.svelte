<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "../api";
  import type { FindProductResponse, LastConnectionResponse, Product } from "../types";
  import Finder from "./Finder.svelte";

  let productId: string;
  let products: Product[] = [];
  let lastConnection: string = null;
  let syncNowButtonDisabled: boolean = false;

  onMount(async () => {
    await fetchDate();
    setInterval(async () => {
      await fetchDate();
    }, 10000);
  });

  const fetchDate = async () => {
    const response = await get<LastConnectionResponse>("/lastconnection");
    lastConnection = response.lastConnection;
  };

  export const findProduct = async (event?: Event) => {
    event?.preventDefault();
    console.log(productId);

    if (!productId) {
      return false;
    }
    const response = await get<FindProductResponse>(`/product?name=${productId}`);
    products = response.products;
    return false;
  };

  const syncNow = async () => {
    syncNowButtonDisabled = true;
    const response = await get<LastConnectionResponse>("/sync");
    lastConnection = response.lastConnection;
    syncNowButtonDisabled = false;
    await findProduct();
  };
</script>

<div id="program-container">
  <h2 class="connection">
    <span>Última Conexión:</span><span id="last-connection">{lastConnection}</span>
    <button disabled={syncNowButtonDisabled} id="sync-button" on:click={syncNow}>Sync Ahora!</button>
  </h2>
  <Finder {findProduct} bind:productId bind:products />
</div>

<style>
  .connection {
    width: 45%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px auto;
  }
</style>
