<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";
  import Dashboard from "./components/Dashboard.svelte";
  import Testing from "./components/Testing.svelte";
  import Scale from "./components/Scale.svelte";
  import Stats from "./components/Stats.svelte";
  const environment = process.env.NODE_ENV;
</script>

<Router>
  <header>
    <nav>
      <Link to="/">Dashboard</Link>
      | <Link to="/scale">Balanza</Link>
      | <Link to="/stats">Stats</Link>
      {#if environment !== "production"}
        | <Link to="testing">Testing</Link>
      {/if}
    </nav>
  </header>

  <main>
    <Route path="/" primary={false}>
      <Dashboard />
    </Route>
    <Route path="/scale" primary={false}>
      <Scale />
    </Route>
    <Route path="/stats" primary={false}>
      <Stats />
    </Route>

    {#if environment !== "production"}
      <Route path="testing" primary={false}>
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
