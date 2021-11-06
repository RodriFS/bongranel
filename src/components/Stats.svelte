<script>
  import FusionCharts from "fusioncharts";
  import Timeseries from "fusioncharts/fusioncharts.timeseries";
  import SvelteFC, { fcRoot } from "svelte-fusioncharts";
import { get } from "../api";

  fcRoot(FusionCharts, Timeseries);

  let dataFetch = get("/monthlysales");
  let schema = [
    {
      name: "Time",
      type: "date",
      format: "%Y-%m-%d",
    },
    {
      name: "Ventas mensuales",
      type: "number",
    },
  ];

  const getChartConfig = (data) => {
    const fusionDataStore = new FusionCharts.DataStore(),
      fusionTable = fusionDataStore.createDataTable(data, schema);

    return {
      type: "timeseries",
      width: "100%",
      height: 450,
      renderAt: "chart-container",
      dataSource: {
        data: fusionTable,
        chart: {
          showLegend: 0,
        },
        caption: {
          text: "Ventas mensuales",
        },
        yAxis: [
          {
            plot: {
              value: "Ventas mensuales",
              type: "column",
            },
            title: "Ventas mensuales (in thousand)",
          },
        ],
      },
    };
  };
</script>

<div id="chart-container">
  {#await dataFetch}
    <p>Fetching data and schema...</p>
  {:then value}
    <SvelteFC {...getChartConfig(value)} />
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
</div>
