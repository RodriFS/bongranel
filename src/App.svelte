<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";
  import Dashboard from "./components/Dashboard.svelte";
  import Testing from "./components/Testing.svelte";
</script>

<Router>
  <header>
    <nav>
      <Link to="/">Dashboard</Link>
      {#if process.env.NODE_ENV !== "production"}
        | <Link to="testing">Testing</Link>
      {/if}
    </nav>
  </header>

  <main>
    <Route path="/">
      <Dashboard />
    </Route>

    {#if process.env.NODE_ENV !== "production"}
      <Route path="testing">
        <Testing />
      </Route>
    {/if}
  </main>
</Router>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  header {
    text-align: center;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
