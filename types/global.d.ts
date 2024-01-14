import { Chart } from "@types/chart.js";
declare global {
  const Chart: Chart;

  interface Window {
    snap: any;
  }
}
