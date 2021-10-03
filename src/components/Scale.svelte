<script lang="ts">
  import { onMount } from "svelte";
  import SvelteGenericCrudTable from "svelte-generic-crud-table";
  import { table_config } from "../constants/scaleColumns";
  import { get, put } from "../api";
  import type { ScaleData, ScaleEvent, ScaleRow } from "../types";

  const sortStore = [];
  let scaleData: ScaleData["items"] = [];
  let totalItems = 0;
  let productId: string;
  const pagination = {
    currentPage: 0,
    limit: 30,
  };

  const findProduct = async (event: Event) => {
    event.preventDefault();
    if (!productId) {
      return;
    }
    pagination.currentPage = 0;
    const response = await get<ScaleData>("/scaledata", { id: productId });
    scaleData = response.items;
    totalItems = response.total;
  };

  const reload = async () => {
    productId = null;
    const response = await get<ScaleData>("/scaledata", pagination);
    scaleData = response.items;
    totalItems = response.total;
  };

  onMount(reload);

  const onPrev = () => {
    if (pagination.currentPage > 0) {
      pagination.currentPage -= 1;
      reload();
    }
  };

  const onNext = () => {
    if (pagination.currentPage < totalItems / pagination.limit - 1) {
      pagination.currentPage += 1;
      reload();
    }
  };

  const handleUpdate = async (event: CustomEvent<ScaleEvent>) => {
    await put(`/scaledata`, event.detail.body.SKU, event.detail.body);
    await reload();
  };

  const handleSort = (event: CustomEvent<ScaleEvent>) => {
    const column = event.detail.column;
    if (sortStore[column] === undefined || sortStore[column] === "DESC") {
      sortStore[column] = "ASC";
    } else {
      sortStore[column] = "DESC";
    }

    const tableSort = (a: ScaleRow, b: ScaleRow): number => {
      var keyA = a[column];
      var keyB = b[column];
      if (sortStore[column] === "ASC") {
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
      } else {
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
      }
      return 0;
    };

    scaleData = scaleData.sort(tableSort);
  };
</script>

<div class="scale-table-container">
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
      <button type="button" id="find-product-button" on:click={reload}>Reset</button>
    </form>
    <button on:click={onPrev}>{"\u25C3"}</button>
    <button on:click={onNext}>{"\u25B7"}</button>
    <SvelteGenericCrudTable on:update={handleUpdate} on:sort={handleSort} {table_config} table_data={scaleData} />
    <button on:click={onPrev}>{"\u25C3"}</button>
    <button on:click={onNext}>{"\u25B7"}</button>
  </div>
</div>

<style>
  .scale-table-container {
    display: flex;
    justify-content: center;
  }

  #find-product-input {
    width: 400px;
    margin: 25px;
  }

  .search-bar-container  {
    margin-bottom: 10px;
  }
</style>
