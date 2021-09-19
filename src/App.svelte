<script lang="ts">
  import { Router, Route, Link } from "svelte-navigator";
  import Dashboard from "./components/Dashboard.svelte";
  import Testing from "./components/Testing.svelte";
</script>

<Router>
  <header>
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="testing">Testing</Link>
    </nav>
  </header>

  <main>
    <Route path="/">
      <Dashboard />
    </Route>

    <Route path="testing">
      <Testing />
    </Route>
  </main>
</Router>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
