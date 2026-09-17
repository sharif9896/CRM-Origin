
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { colors } from "./chart-colors";

const RevenueExpenseTrendChart = () => {
  const series = [
    {
      name: "Revenue",
      data: [87450, 78920, 72840, 95230, 88650, 102340],
    },
    {
      name: "Expenses",
      data: [52300, 48750, 45200, 58900, 51200, 62100],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 290,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
    },

    series,

    colors: [colors.secondary, colors.primary],

    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      ...colors.baseAxis,
    },

    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: colors.gray400,
          fontSize: "11px",
        },
      },
    },

    stroke: {
      width: [2, 2],
      curve: "smooth",
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "11px",
      labels: {
        colors: colors.labelColor,
      },
      markers: {
        size: 8,
        shape: "circle",
      },
      itemMargin: {
        horizontal: 12,
      },
    },

    grid: {
      show: true,
      borderColor: colors.borderColor,
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      theme: "light",
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="area"
      height={290}
    />
  );
};

export default RevenueExpenseTrendChart;