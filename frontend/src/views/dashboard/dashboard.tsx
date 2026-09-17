import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { EChartsOption } from "echarts";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import ReactEChartsCore from "echarts-for-react/esm/core";
import ImageWithBasePath from "../../components/ui/imageWithBasePath";
import type { Lead, Property } from "../../data/types";
import { useAccess } from "../../hooks/useAccess";
import { apiRequest } from "../../lib/apiClient";
import { exportCsv } from "../../lib/exportCsv";
import { all_routes } from "../../routes/all_routes";
import { useAuth, useTheme } from "../../store/hooks";

type Summary = {
  totalLeads: number;
  totalProperties: number;
  totalAgents: number;
  totalCustomers: number;
  totalDeals: number;
  wonDeals: number;
  wonRevenue: number;
  paidInvoiceRevenue: number;
  upcomingAppointments: number;
  averageRating: number;
  activeAgents: number;
  hotLeads: number;
  openDeals: number;
  portfolioValue: number;
  outstandingRevenue: number;
  conversionRate: number;
  currency: string;
};

type Bucket = { _id: string; count: number; amount?: number };
type Activity = { type: string; label: string; status: string; at: string };
type ActivityOverview = { leads: number[]; appointments: number[] };
type DashboardData = {
  summary: Summary;
  revenue: number[];
  pipeline: Bucket[];
  propertyStatus: Bucket[];
  propertyCategories: Bucket[];
  activityOverview: ActivityOverview;
  properties: Property[];
  leads: Lead[];
  activity: Activity[];
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pipelineStages = ["New", "Negotiation", "Due Diligence", "Won"];
const pipelineColors: Record<string, string> = {
  New: "#6e7f93",
  Negotiation: "#b08d57",
  "Due Diligence": "#c76f51",
  Won: "#5b8067",
};

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

const rollingAverage = (values: number[]) =>
  values.map((_, index) => {
    const sample = values.slice(Math.max(0, index - 2), index + 1);
    return Math.round(sum(sample) / sample.length);
  });

const ChartPanel = ({
  title,
  description,
  action,
  option,
  height = 300,
  empty,
  emptyLabel,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  option: EChartsOption;
  height?: number;
  empty: boolean;
  emptyLabel: string;
}) => (
  <article className="workspace-panel dashboard-chart-panel">
    <div className="workspace-toolbar">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action && <span>{action}</span>}
    </div>
    <div className="dashboard-chart" role="img" aria-label={`${title}. ${description}`}>
      <ReactEChartsCore echarts={echarts} option={option} notMerge lazyUpdate style={{ height }} />
      {empty && <div className="dashboard-chart-empty">{emptyLabel}</div>}
    </div>
  </article>
);

export default function Dashboard() {
  const { user } = useAuth();
  const theme = useTheme();
  const { can } = useAccess();
  const canReadLeads = can("leads:read");
  const canReadProperties = can("properties:read");
  const canCreateProperties = can("properties:create");
  const canReadDeals = can("deals:read");
  const canReadReports = can("reports:read");
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- A changed report period starts a new API request.
    setLoading(true);
    setError("");

    const leadsRequest = canReadLeads
      ? apiRequest<{ data: Lead[] }>("/leads", { params: { limit: 5 } })
      : Promise.resolve({ data: [] as Lead[] });

    Promise.all([
      apiRequest<{ data: Summary }>("/dashboard/summary"),
      apiRequest<{ data: { revenue: number[] } }>("/dashboard/revenue-overview", { params: { year } }),
      apiRequest<{ data: Bucket[] }>("/dashboard/sales-pipeline"),
      apiRequest<{ data: Bucket[] }>("/dashboard/property-status"),
      apiRequest<{ data: Bucket[] }>("/dashboard/property-categories"),
      apiRequest<{ data: ActivityOverview }>("/dashboard/activity-overview", { params: { year } }),
      apiRequest<{ data: Property[] }>("/dashboard/featured-listings", { params: { limit: 3 } }),
      leadsRequest,
      apiRequest<{ data: Activity[] }>("/dashboard/recent-activity", { params: { limit: 6 } }),
    ])
      .then(([summary, revenue, pipeline, propertyStatus, propertyCategories, activityOverview, properties, leads, activity]) => {
        if (!active) return;
        setData({
          summary: summary.data,
          revenue: revenue.data.revenue,
          pipeline: pipeline.data,
          propertyStatus: propertyStatus.data,
          propertyCategories: propertyCategories.data,
          activityOverview: activityOverview.data,
          properties: properties.data,
          leads: leads.data,
          activity: activity.data,
        });
      })
      .catch((requestError: Error) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [year, revision, canReadLeads]);

  const currency = data?.summary.currency || "USD";
  const money = useMemo(
    () => (value: number) =>
      new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value),
    [currency],
  );
  const number = useMemo(
    () => (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value),
    [],
  );

  const isDark = theme === "dark";
  const chart = useMemo(
    () => ({
      text: isDark ? "#f6f1e8" : "#0b1220",
      muted: isDark ? "#aab3c1" : "#6d7480",
      grid: isDark ? "#2a3850" : "#e8e1d6",
      navy: isDark ? "#e7dbc5" : "#0b1220",
      gold: "#b08d57",
      goldSoft: isDark ? "rgba(176,141,87,.2)" : "rgba(176,141,87,.14)",
      blue: isDark ? "#8296b4" : "#526b88",
      green: "#5b8067",
      orange: "#c76f51",
      surface: isDark ? "#111c2f" : "#fffdf9",
    }),
    [isDark],
  );

  const revenueOption = useMemo<EChartsOption>(() => {
    const values = data?.revenue || Array(12).fill(0);
    return {
      animationDuration: 650,
      color: [chart.gold, chart.navy],
      grid: { left: 18, right: 18, top: 52, bottom: 12, containLabel: true },
      legend: { top: 2, right: 8, textStyle: { color: chart.muted, fontSize: 11 }, itemWidth: 11, itemHeight: 7 },
      tooltip: { trigger: "axis", backgroundColor: chart.surface, borderColor: chart.grid, textStyle: { color: chart.text }, valueFormatter: (value) => money(Number(value)) },
      xAxis: { type: "category", data: months, axisTick: { show: false }, axisLine: { lineStyle: { color: chart.grid } }, axisLabel: { color: chart.muted, fontSize: 10 } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: chart.grid, type: "dashed" } }, axisLabel: { color: chart.muted, fontSize: 10, formatter: (value: number) => number(value) } },
      series: [
        { name: "Closed revenue", type: "bar", data: values, barMaxWidth: 22, itemStyle: { color: chart.gold, borderRadius: [5, 5, 0, 0] } },
        { name: "3-month average", type: "line", data: rollingAverage(values), smooth: true, symbol: "circle", symbolSize: 6, lineStyle: { color: chart.navy, width: 2.5 }, itemStyle: { color: chart.navy }, areaStyle: { color: chart.goldSoft } },
      ],
    };
  }, [chart, data?.revenue, money, number]);

  const activityOption = useMemo<EChartsOption>(() => {
    const leads = data?.activityOverview.leads || Array(12).fill(0);
    const appointments = data?.activityOverview.appointments || Array(12).fill(0);
    return {
      animationDuration: 650,
      color: [chart.gold, chart.blue],
      grid: { left: 18, right: 18, top: 52, bottom: 12, containLabel: true },
      legend: { top: 2, right: 8, textStyle: { color: chart.muted, fontSize: 11 }, itemWidth: 11, itemHeight: 7 },
      tooltip: { trigger: "axis", backgroundColor: chart.surface, borderColor: chart.grid, textStyle: { color: chart.text } },
      xAxis: { type: "category", boundaryGap: false, data: months, axisTick: { show: false }, axisLine: { lineStyle: { color: chart.grid } }, axisLabel: { color: chart.muted, fontSize: 10 } },
      yAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: chart.grid, type: "dashed" } }, axisLabel: { color: chart.muted, fontSize: 10 } },
      series: [
        { name: "New leads", type: "line", data: leads, smooth: true, symbolSize: 7, lineStyle: { width: 3 }, areaStyle: { opacity: 0.08 } },
        { name: "Scheduled visits", type: "line", data: appointments, smooth: true, symbolSize: 7, lineStyle: { width: 3 }, areaStyle: { opacity: 0.06 } },
      ],
    };
  }, [chart, data?.activityOverview]);

  const propertyStatusOption = useMemo<EChartsOption>(() => {
    const values = data?.propertyStatus.map((item) => ({ name: item._id || "Unspecified", value: item.count })) || [];
    return {
      animationDuration: 650,
      color: [chart.gold, chart.navy, chart.green, chart.orange],
      tooltip: { trigger: "item", backgroundColor: chart.surface, borderColor: chart.grid, textStyle: { color: chart.text } },
      legend: { bottom: 0, left: "center", textStyle: { color: chart.muted, fontSize: 10 }, itemWidth: 9, itemHeight: 9 },
      series: [{
        name: "Properties",
        type: "pie",
        radius: ["48%", "70%"],
        center: ["50%", "43%"],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: { borderColor: chart.surface, borderWidth: 3, borderRadius: 5 },
        label: { color: chart.text, fontSize: 10, formatter: "{b}\n{c}" },
        data: values,
      }],
    };
  }, [chart, data?.propertyStatus]);

  const categoriesOption = useMemo<EChartsOption>(() => {
    const categories = [...(data?.propertyCategories || [])].sort((a, b) => a.count - b.count);
    return {
      animationDuration: 650,
      grid: { left: 10, right: 24, top: 10, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, backgroundColor: chart.surface, borderColor: chart.grid, textStyle: { color: chart.text } },
      xAxis: { type: "value", minInterval: 1, splitLine: { lineStyle: { color: chart.grid, type: "dashed" } }, axisLabel: { color: chart.muted, fontSize: 10 } },
      yAxis: { type: "category", data: categories.map((item) => item._id || "Other"), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: chart.text, fontSize: 10 } },
      series: [{ type: "bar", name: "Properties", data: categories.map((item) => item.count), barWidth: 14, itemStyle: { color: chart.gold, borderRadius: [0, 6, 6, 0] }, label: { show: true, position: "right", color: chart.muted, fontSize: 10 } }],
    };
  }, [chart, data?.propertyCategories]);

  if (loading && !data) {
    return <section className="record-workspace dashboard-workspace"><div className="dashboard-loading" role="status"><span /><p>Preparing your portfolio intelligence…</p></div></section>;
  }

  const summary = data?.summary;
  if (!summary || !data) {
    return <section className="record-workspace dashboard-workspace"><div className="ws-error" role="alert"><span>{error || "Dashboard data is unavailable."}</span><button onClick={() => setRevision((value) => value + 1)}>Retry</button></div></section>;
  }

  const totalRevenue = sum(data.revenue);
  const pipelineValue = data.pipeline.reduce((total, item) => total + (item.amount || 0), 0);
  const activityTotal = sum(data.activityOverview.leads) + sum(data.activityOverview.appointments);
  const activeAgentRate = summary.totalAgents ? Math.round((summary.activeAgents / summary.totalAgents) * 100) : 0;
  const firstName = user?.name.split(" ")[0] || "there";

  const metrics = [
    { label: "Total Revenue (Won Deals)", value: money(summary.wonRevenue), icon: "icon-trending-up", note: `${summary.wonDeals} closed deals`, accent: "gold" },
    { label: "Portfolio valuation", value: money(summary.portfolioValue), icon: "icon-building-2", note: `${summary.totalProperties} managed properties`, accent: "navy" },
    { label: "Active relationships", value: number(summary.totalCustomers), icon: "icon-users", note: `${summary.totalLeads} leads · ${summary.hotLeads} hot`, accent: "blue" },
    { label: "Upcoming appointments", value: number(summary.upcomingAppointments), icon: "icon-calendar", note: `${money(summary.outstandingRevenue)} receivable`, accent: "green" },
  ];

  return (
    <section className="record-workspace dashboard-workspace">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="eyebrow">PORTFOLIO COMMAND CENTER</span>
          <h1>Welcome back, {firstName}</h1>
          <p>Live commercial performance, client demand, and portfolio health in one view.</p>
        </div>
        <div className="workspace-actions dashboard-hero-actions">
          <button className="ws-button dashboard-ghost-button" onClick={() => exportCsv("workspace-overview", [summary])}>
            <i className="icon-download" /> Export overview
          </button>
          {canCreateProperties && <Link className="ws-button primary" to={all_routes.addProperty}><i className="icon-plus" /> Add property</Link>}
        </div>
        <div className="dashboard-pulse" aria-label="Portfolio summary">
          <div><span>Open pipeline</span><strong>{summary.openDeals}</strong><small>{money(pipelineValue)}</small></div>
          <div><span>Deal conversion</span><strong>{summary.conversionRate}%</strong><small>{summary.wonDeals} wins</small></div>
          <div><span>Active agents</span><strong>{summary.activeAgents}/{summary.totalAgents}</strong><small>{activeAgentRate}% available</small></div>
          <div><span>Client rating</span><strong>{summary.averageRating ? summary.averageRating.toFixed(1) : "—"}</strong><small>{summary.averageRating ? "out of 5.0" : "No reviews yet"}</small></div>
        </div>
      </section>

      {error && <div className="ws-error" role="alert"><span>{error}</span><button onClick={() => setRevision((value) => value + 1)}>Retry</button></div>}

      <div className="metric-grid dashboard-metric-grid">
        {metrics.map((metric) => (
          <article className={`metric-card enterprise-metric accent-${metric.accent}`} key={metric.label}>
            <div className="metric-icon"><i className={metric.icon} /></div>
            <p>{metric.label}</p>
            <h2>{metric.value}</h2>
            <small>{metric.note}</small>
          </article>
        ))}
      </div>

      <div className="dashboard-analytics-grid dashboard-analytics-primary">
        <ChartPanel
          title="Revenue performance"
          description={`Closed deal value and trailing average for ${year}`}
          action={<select className="year-input" aria-label="Dashboard reporting year" value={year} onChange={(event) => setYear(Number(event.target.value))}>{Array.from({ length: 6 }, (_, index) => currentYear - index).map((value) => <option key={value}>{value}</option>)}</select>}
          option={revenueOption}
          height={330}
          empty={totalRevenue === 0}
          emptyLabel="No won deals with a closing date in this period."
        />

        <article className="workspace-panel pipeline-panel">
          <div className="workspace-toolbar"><div><h2>Sales pipeline</h2><p>{summary.totalDeals} opportunities across all stages</p></div><span className="conversion-pill">{summary.conversionRate}% won</span></div>
          <div className="pipeline-summary">
            <span className="eyebrow">TOTAL PIPELINE VALUE</span>
            <h2>{money(pipelineValue)}</h2>
            <div className="pipeline-segments" aria-label="Deal distribution by stage">
              {pipelineStages.map((stage) => {
                const bucket = data.pipeline.find((item) => item._id === stage);
                return <span key={stage} style={{ flex: bucket?.count || 0.08, background: pipelineColors[stage] }} title={`${stage}: ${bucket?.count || 0}`} />;
              })}
            </div>
            <div className="pipeline-rows">
              {pipelineStages.map((stage) => {
                const bucket = data.pipeline.find((item) => item._id === stage);
                const percentage = summary.totalDeals ? Math.round(((bucket?.count || 0) / summary.totalDeals) * 100) : 0;
                return <div className="pipeline-row" key={stage}><span className="pipeline-dot" style={{ background: pipelineColors[stage] }} /><span>{stage}</span><div className="pipeline-progress"><i style={{ width: `${percentage}%`, background: pipelineColors[stage] }} /></div><strong>{bucket?.count || 0}</strong><small>{money(bucket?.amount || 0)}</small></div>;
              })}
            </div>
            {canReadDeals && <Link to={all_routes.deals} className="ws-button pipeline-button">Open deal board <i className="icon-arrow-up-right" /></Link>}
          </div>
        </article>
      </div>

      <div className="dashboard-analytics-grid dashboard-analytics-secondary">
        <ChartPanel
          title="Demand and visits"
          description={`New leads compared with scheduled property visits in ${year}`}
          option={activityOption}
          height={286}
          empty={activityTotal === 0}
          emptyLabel="No leads or scheduled visits in this period."
        />
        <ChartPanel
          title="Portfolio status"
          description="Current listing mix across the portfolio"
          option={propertyStatusOption}
          height={286}
          empty={sum(data.propertyStatus.map((item) => item.count)) === 0}
          emptyLabel="No properties to classify yet."
        />
        <ChartPanel
          title="Inventory by category"
          description="Property count for each asset class"
          option={categoriesOption}
          height={286}
          empty={sum(data.propertyCategories.map((item) => item.count)) === 0}
          emptyLabel="No property categories to display."
        />
      </div>

      <div className="dashboard-chart-footer">
        <span><i className="icon-info" /> Values are calculated from saved CRM records and update after every change.</span>
        {canReadReports && <Link to={all_routes.reports}>Open financial reports <i className="icon-arrow-right" /></Link>}
      </div>

      <div className="dashboard-section-title">
        <div><span className="eyebrow">CURATED PORTFOLIO</span><h2>Latest properties</h2></div>
        {canReadProperties && <Link to={all_routes.properties} className="ws-button">View all properties <i className="icon-arrow-right" /></Link>}
      </div>
      <div className="property-preview-grid">
        {data.properties.map((property) => {
          const content = <><div className="property-preview-image"><ImageWithBasePath src={property.image} alt={property.name} /><span className="ws-badge">{property.status}</span></div><div className="property-preview-body"><span className="eyebrow">{property.type}</span><h3>{property.name}</h3><p><i className="icon-map-pin" /> {property.location}</p><div><strong>{money(property.price)}</strong><small>{property.beds} beds · {property.baths} baths · {property.sqft.toLocaleString()} sqft</small></div></div></>;
          return canReadProperties
            ? <Link to={`${all_routes.propertyDetails}/${property.id}`} className="property-preview" key={property.id}>{content}</Link>
            : <article className="property-preview" key={property.id}>{content}</article>;
        })}
      </div>
      {!data.properties.length && <div className="workspace-panel ws-state">Add a property to start building your portfolio.</div>}

      <div className="dashboard-operations-grid">
        {canReadLeads && <article className="workspace-panel recent-leads-panel"><div className="workspace-toolbar"><div><h2>Priority relationships</h2><p>Most recently added leads</p></div><span><Link to={all_routes.leads}>View all</Link></span></div><div className="workspace-table-scroll"><table className="workspace-table"><thead><tr><th>Contact</th><th>Stage</th><th>Assigned to</th><th>Budget</th></tr></thead><tbody>{data.leads.map((lead) => <tr key={lead.id}><td><Link to={`${all_routes.leadDetails}/${lead.id}`} className="record-name">{lead.name}</Link><small className="table-secondary-line">{lead.email}</small></td><td><span className="ws-badge">{lead.status}</span></td><td>{lead.assignedTo || "Unassigned"}</td><td>{lead.budget || "—"}</td></tr>)}</tbody></table>{!data.leads.length && <div className="ws-state compact">No leads yet.</div>}</div></article>}

        <article className="workspace-panel activity-panel"><div className="workspace-toolbar"><div><h2>Operational activity</h2><p>Latest changes across the workspace</p></div></div><div className="activity-list">{data.activity.map((item, index) => <div className="activity-row" key={`${item.type}-${item.at}-${index}`}><span><i className={item.type === "lead" ? "icon-user-plus" : item.type === "deal" ? "icon-handshake" : "icon-calendar"} /></span><div><p>{item.label}</p><small>{new Date(item.at).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })} · {item.status}</small></div></div>)}{!data.activity.length && <div className="ws-state compact">Your latest activity will appear here.</div>}</div></article>
      </div>
    </section>
  );
}
