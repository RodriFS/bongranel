<script>
  import FusionCharts from "fusioncharts";
  import Charts from 'fusioncharts/fusioncharts.charts';
  import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
  import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
  import { get } from "../api";

  fcRoot(FusionCharts, Charts, FusionTheme);


  let dataFetch = get("/mostsolditems");

  let getChartProps = (caption) => ({
    caption,
    "showValues":"1",
    "showPercentInTooltip" : "0",
    "enableMultiSlicing":"1",
  })


  let getChartData = (data, caption) => ({
    type: 'pie3d',
    width: '1000',
    height: '800',
    renderAt: 'chart-container',
    dataSource: {
      chart: getChartProps(caption),
      data
    }
  });



</script>

<div id="chart-container">
  {#await dataFetch}
    <p>Buscando la informacion, por favor espere...</p>
  {:then value}
    <div >
      <h1>Productos más vendidos desde el 1ro del mes</h1>
      <div class="container">
        <SvelteFC {...getChartData(value.firstMonth.mostSold.units, "Productos más vendidos (Unidades)")}/>
        <SvelteFC {...getChartData(value.firstMonth.mostSold.grams, "Productos más vendidos (Kilogramos)")}/>
      </div>
      <h1>Productos menos vendidos desde el 1ro del mes</h1>
      <div class="container">
        <SvelteFC {...getChartData(value.firstMonth.lessSold.units, "Productos menos vendidos (Unidades)")} chart={getChartProps()}/>
        <SvelteFC {...getChartData(value.firstMonth.lessSold.grams, "Productos menos vendidos (Kilogramos)")}/>
      </div>
    </div>
    <div >
      <h1>Productos más vendidos en los últimos 3 meses</h1>
      <div class="container">
        <SvelteFC {...getChartData(value.threeMonths.mostSold.units, "Productos más vendidos (Unidades)")}/>
        <SvelteFC {...getChartData(value.threeMonths.mostSold.grams, "Productos más vendidos (Kilogramos)")}/>
      </div>
      <h1>Productos menos vendidos en los últimos 3 meses</h1>
      <div class="container">
        <SvelteFC {...getChartData(value.threeMonths.lessSold.units, "Productos menos vendidos (Unidades)")} chart={getChartProps()}/>
        <SvelteFC {...getChartData(value.threeMonths.lessSold.grams, "Productos menos vendidos (Kilogramos)")}/>
      </div>
    </div>
    <div >
      <h1>Productos más vendidos en los últimos 6 meses</h1>
      <div class="container">
        <SvelteFC {...getChartData(value.sixMonths.mostSold.units, "Productos más vendidos (Unidades)")}/>
        <SvelteFC {...getChartData(value.sixMonths.mostSold.grams, "Productos más vendidos (Kilogramos)")}/>
      </div>
      <h1>Productos menos vendidos en los últimos 6 meses</h1>
      <div class="container">
        <SvelteFC {...getChartData(value.sixMonths.lessSold.units, "Productos menos vendidos (Unidades)")} chart={getChartProps()}/>
        <SvelteFC {...getChartData(value.sixMonths.lessSold.grams, "Productos menos vendidos (Kilogramos)")}/>
      </div>
    </div>
  {:catch error}
    <p>Algo fue mal: {error.message}</p>
  {/await}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
  }

</style>
