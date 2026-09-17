import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { base_path } from "../../environment";
import { propertyLocations } from "../../data/dashboard";

const MAP_NAME = "USA";
let registered = false;

const tooltipFormatter = (params: { data?: { price?: string } }) => {
  if (!params.data) return "";
  const price = params.data.price ?? "$25k";
  return `
    <div style="background:rgba(255,255,255,0.95);border-radius:12px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.8);padding:12px 18px;display:flex;flex-direction:column;align-items:center;gap:6px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);">
      <div style="width:32px;height:32px;border-radius:50%;background:rgba(112,191,76,0.15);border:1.5px solid rgba(112,191,76,0.3);display:flex;align-items:center;justify-content:center;color:#70BF4C;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
      <div style="font-family:'Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;color:#0F172A;line-height:1.2;">${price}</div>
    </div>
  `;
};

const UsaMap = () => {
  const [ready, setReady] = useState(registered);

  useEffect(() => {
    if (registered) return;
    let cancelled = false;

    fetch(`${base_path}assets/json/usa.json`)
      .then((res) => res.json())
      .then((geo) => {
        if (cancelled) return;
        if (!registered) {
          echarts.registerMap(MAP_NAME, geo);
          registered = true;
        }
        setReady(true);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return <div className="h-100" />;

  return (
    <ReactECharts
      style={{ height: "400px", width: "100%" }}
      opts={{ renderer: "canvas" }}
      option={{
        tooltip: {
          trigger: "item",
          backgroundColor: "transparent",
          borderWidth: 0,
          shadowColor: "transparent",
          padding: 0,
          extraCssText:
            "box-shadow: none !important; border: none !important; background: transparent !important; padding: 0 !important;",
          confine: true,
          formatter: tooltipFormatter,
        },
        geo: {
          type: "map",
          map: MAP_NAME,
          roam: false,
          zoom: 1.2,
          label: { show: false },
          itemStyle: {
            areaColor: "#E2E4E6",
            borderColor: "#FFFFFF",
            borderWidth: 1.5,
          },
          emphasis: {
            itemStyle: { areaColor: "#D1D5DB", borderColor: "#FFFFFF" },
          },
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo",
            data: propertyLocations,
            itemStyle: {
              color: "#70BF4C",
              borderColor: "rgba(112, 191, 76, 0.4)",
              borderWidth: 8,
            },
            symbolSize: 8,
            emphasis: { scale: true },
          },
        ],
      }}
    />
  );
};

export default UsaMap;
