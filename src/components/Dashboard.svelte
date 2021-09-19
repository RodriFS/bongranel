<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "../api";
  import type { LastConnectionResponse } from "../types";
  import Finder from "./Finder.svelte";

  let lastConnection: string = null;
  let syncNowButtonDisabled: boolean = false;

  const fetchDate = async () => {
    const response = await get<LastConnectionResponse>("/lastconnection");
    lastConnection = response.lastConnection;
  };

  onMount(async () => {
    await fetchDate();
    setInterval(async () => {
      await fetchDate();
    }, 10000);
  });

  const syncNow = async () => {
    syncNowButtonDisabled = true;
    const response = await get<LastConnectionResponse>("/sync");
    lastConnection = response.lastConnection;
    syncNowButtonDisabled = false;
  };
</script>

<div id="program-container">
  <h2>
    <span>Última Conexión:</span><span id="last-connection">{lastConnection}</span>
    <button disabled={syncNowButtonDisabled} id="sync-button" on:click={syncNow}>Sync Ahora!</button>
  </h2>
  <Finder />
</div>
