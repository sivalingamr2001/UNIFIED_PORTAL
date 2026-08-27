import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Filter,
  Download,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Circle,
  Info,
  Route,
  Truck,
  ChevronRight,
  CircleAlert,
  CircleCheckBig,
  BarChart3,
  LayoutGrid,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { queryApi } from "../../api/endpoints";

type StageStatus = "on-track" | "at-risk" | "delayed" | "not-started";

type StageBlock = {
  name: string;
  pend?: string;
  scrap?: string;
  comp?: string;
  status: StageStatus;
  warning?: boolean;
};

type JourneyItem = {
  id: number;
  item: string;
  location: string;
  totalOSPs: number;
  planTAT: number;
  actualTAT: number;
  variance: number;
  status: "On Track" | "At Risk" | "Delayed";
  altRoute?: boolean;
  jobs?: number;
  delayedJobs?: number;
  stages: StageBlock[];
  jobId?: string;
  jobVariance?: number;
  jobCards?: JourneyItem[];
};

type ApiRecord = Record<string, unknown>;

const queryNumber = Number(
  import.meta.env.VITE_PES_CONTROL_TOWER_QUERY_NUMBER ?? "1"
);

function valueOf(record: ApiRecord, ...keys: string[]): unknown {
  const entry = Object.entries(record).find(([key]) =>
    keys.some((candidate) => key.toLowerCase() === candidate.toLowerCase())
  );
  return entry?.[1];
}

function textOf(record: ApiRecord, ...keys: string[]): string {
  const value = valueOf(record, ...keys);
  return value == null ? "" : String(value);
}

function numberOf(record: ApiRecord, ...keys: string[]): number {
  const value = Number(valueOf(record, ...keys));
  return Number.isFinite(value) ? value : 0;
}

function booleanOf(record: ApiRecord, ...keys: string[]): boolean {
  const value = valueOf(record, ...keys);
  return value === true || value === 1 || String(value).toLowerCase() === "true";
}

function parseStages(record: ApiRecord): StageBlock[] {
  const rawStages = valueOf(record, "stages", "stageData", "ospStages");
  let stages: unknown[] = Array.isArray(rawStages) ? rawStages : [];
  if (typeof rawStages === "string") {
    try {
      const parsed = JSON.parse(rawStages);
      stages = Array.isArray(parsed) ? parsed : [];
    } catch {
      stages = [];
    }
  }

  if (stages.length === 0) {
    for (let index = 1; index <= 6; index += 1) {
      const name = textOf(record, `OPN${index}_OPERATION_DESC`);
      if (!name) continue;
      const started = textOf(record, `OPN${index}_PROCESS_START_DATE`);
      const completed = textOf(record, `OPN${index}_PROCESS_COMPLETION_DATE`);
      stages.push({
        name,
        pend: textOf(record, `OPN${index}_QTY_QUEUE`) || undefined,
        scrap: textOf(record, `OPN${index}_QTY_SCRAP`) || undefined,
        comp: textOf(record, `OPN${index}_QTY_COMP`) || undefined,
        status: completed
          ? "on-track"
          : started
            ? "at-risk"
            : "not-started",
        warning: Boolean(started && !completed),
      });
    }
  }

  return stages.map((stage, index) => {
    const data = (stage ?? {}) as ApiRecord;
    const status = textOf(data, "status", "stageStatus").toLowerCase();
    return {
      name: textOf(data, "name", "stageName", "ospName") || `OSP ${index + 1}`,
      pend: textOf(data, "pend", "pending", "queue") || undefined,
      scrap: textOf(data, "scrap", "scrapped", "scrapCount") || undefined,
      comp: textOf(data, "comp", "completed", "completion") || undefined,
      status: status.includes("delay")
        ? "delayed"
        : status.includes("risk")
          ? "at-risk"
          : status.includes("start")
            ? "not-started"
            : "on-track",
      warning: booleanOf(data, "warning", "hasWarning"),
    };
  });
}

function normalizeRows(data: unknown): JourneyItem[] {
  const rows = Array.isArray(data) ? data : [];
  const jobRows = rows.flatMap((value, index) => {
    if (!value || typeof value !== "object") return [];
    const record = value as ApiRecord;
    const stages = parseStages(record);
    const status = textOf(record, "status", "overallStatus").toLowerCase();
    const derivedStatus = status || (stages.some((stage) => stage.status === "at-risk") ? "at-risk" : "on-track");
    const totalOSPs = stages.length || numberOf(record, "totalOSPs", "ospCount", "totalOsp");
    const planTAT = numberOf(record, "planTAT", "plannedTat", "plannedTAT") || stages.reduce((total, stage) => total + Number(stage.scrap ?? 0), 0);
    return [{
      id: numberOf(record, "id", "itemId", "jobId") || index + 1,
      item: textOf(record, "item", "itemName", "product", "productName", "itemNo", "ITEM_NO") || "Unnamed item",
      location: textOf(record, "location", "plant", "customerLocation", "organizationId"),
      totalOSPs,
      planTAT,
      actualTAT: numberOf(record, "actualTAT", "actualTat"),
      variance: numberOf(record, "variance", "tatVariance"),
      status: derivedStatus.includes("delay") ? "Delayed" : derivedStatus.includes("risk") ? "At Risk" : "On Track",
      altRoute: Boolean(textOf(record, "altRoute", "alternateRoute", "alternateRoutingDesignator")),
      jobs: 1,
      delayedJobs: numberOf(record, "delayedJobs", "delayedJobCount"),
      jobId: textOf(record, "jobId", "jobNumber", "jobNo", "JOB_NO") || undefined,
      jobVariance: numberOf(record, "jobVariance"),
      stages,
    }];
  });

  const grouped = new Map<string, JourneyItem[]>();
  for (const job of jobRows) {
    const key = `${job.item}|${job.location}`;
    const existing = grouped.get(key) ?? [];
    existing.push(job);
    grouped.set(key, existing);
  }

  return Array.from(grouped.values()).map((jobCards, index) => {
    const firstJob = jobCards[0];
    const status = jobCards.some((job) => job.status === "Delayed")
      ? "Delayed"
      : jobCards.some((job) => job.status === "At Risk")
        ? "At Risk"
        : "On Track";

    return {
      ...firstJob,
      id: index + 1,
      status,
      totalOSPs: Math.max(...jobCards.map((job) => job.totalOSPs)),
      planTAT: Math.max(...jobCards.map((job) => job.planTAT)),
      actualTAT: Math.max(...jobCards.map((job) => job.actualTAT)),
      variance: Math.max(...jobCards.map((job) => job.variance)),
      jobs: jobCards.length,
      delayedJobs: jobCards.filter((job) => job.status === "Delayed").length,
      jobId: undefined,
      jobVariance: undefined,
      jobCards,
    };
  });
}

function statusBadge(status: string) {
  switch (status) {
    case "On Track":
      return "bg-green-100 text-green-700";
    case "At Risk":
      return "bg-amber-100 text-amber-700";
    case "Delayed":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function stageRing(status: StageStatus) {
  switch (status) {
    case "on-track":
      return "ring-green-400";
    case "at-risk":
      return "ring-amber-400";
    case "delayed":
      return "ring-red-400";
    default:
      return "ring-gray-200";
  }
}

function stageCellBg(status: StageStatus) {
  switch (status) {
    case "on-track":
      return "bg-green-50 border-green-300";
    case "at-risk":
      return "bg-amber-50 border-amber-300";
    case "delayed":
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
}

export default function PlanningExecutionControlTower() {
  const [journeyData, setJourneyData] = useState<JourneyItem[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!Number.isInteger(queryNumber) || queryNumber <= 0) {
      setError("Set VITE_PES_CONTROL_TOWER_QUERY_NUMBER to a valid query number.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await queryApi.execute({ QueryNumber: queryNumber });
      const groupedRows = normalizeRows(response.Data ?? response.data ?? []);
      setJourneyData(groupedRows);
      setExpandedRows(groupedRows.map((row) => row.id));
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not load control tower data."
      );
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const loadTimer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalJobs = journeyData.reduce((total, row) => total + (row.jobs ?? 1), 0);
  const onTrack = journeyData.filter((row) => row.status === "On Track").reduce((total, row) => total + (row.jobs ?? 1), 0);
  const atRisk = journeyData.filter((row) => row.status === "At Risk").reduce((total, row) => total + (row.jobs ?? 1), 0);
  const delayed = journeyData.filter((row) => row.status === "Delayed").reduce((total, row) => total + (row.jobs ?? 1), 0);
  const average = (selector: (row: JourneyItem) => number) =>
    journeyData.length === 0 ? 0 : journeyData.reduce((total, row) => total + selector(row), 0) / journeyData.length;
  const percentage = (value: number) => totalJobs === 0 ? "0%" : `${Math.round((value / totalJobs) * 100)}%`;
  const statusData = [
    { name: "On Track", value: onTrack, color: "#16a34a" },
    { name: "At Risk", value: atRisk, color: "#d97706" },
    { name: "Delayed", value: delayed, color: "#dc2626" },
  ];
  const varianceData = [
    { stage: "Pre-Processing", value: average((row) => row.stages.reduce((sum, stage) => sum + Number.parseFloat(stage.pend ?? "0"), 0)), color: "#fca5a5" },
    { stage: "Processing", value: average((row) => row.stages.reduce((sum, stage) => sum + Number.parseFloat(stage.scrap ?? "0"), 0)), color: "#ef4444" },
    { stage: "Post-Processing", value: average((row) => row.stages.reduce((sum, stage) => sum + Number.parseFloat(stage.comp ?? "0"), 0)), color: "#4ade80" },
  ];
  const delayedOSPs = journeyData.flatMap((row) => row.stages
    .filter((stage) => stage.status === "delayed" || stage.status === "at-risk")
    .map((stage) => ({ name: stage.name, value: Math.abs(row.variance) })))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-sm">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#0f1b2d] px-5 py-3 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-[13px] font-bold text-white tracking-wide uppercase leading-tight">
              Planning & Execution Control Tower
            </h1>
            <p className="text-[11px] text-blue-300/70 mt-0.5">
              OSP Jobs – Multi-OSP Train Journey
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <FilterChip label="Date Range" value="Last 30 Days" icon={<CalendarDays className="w-3 h-3 opacity-50" />} />
            <FilterChip label="Job Type" value="All" icon={<ChevronDown className="w-3 h-3 opacity-50" />} />
            <FilterChip label="Product" value="All" icon={<ChevronDown className="w-3 h-3 opacity-50" />} />
            <FilterChip label="Customer Location" value="All" icon={<ChevronDown className="w-3 h-3 opacity-50" />} />

            <button className="flex items-center gap-1.5 border border-blue-400 text-blue-300 rounded px-3 py-1.5 text-[11px] font-semibold hover:bg-blue-500/20 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <button className="border border-white/20 rounded p-1.5 text-white/50 hover:text-white hover:border-white/50 transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Loading control tower data...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>
              <button className="inline-flex items-center gap-1.5 font-semibold hover:text-red-900" onClick={() => void loadData()}>
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}
          {!isLoading && !error && journeyData.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
              No control tower records were returned by the query.
            </div>
          )}

          {/* KPI cards */}
          <div className="flex gap-2 flex-wrap">
            <KpiCard
              label="Total OSP Jobs"
              value={totalJobs}
              sub="Across all stages"
              icon={<LayoutGrid className="w-4 h-4 text-blue-600" />}
              iconBg="bg-blue-50"
            />
            <KpiCard
              label="On Track"
              value={onTrack}
              sub={percentage(onTrack)}
              icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
              iconBg="bg-green-50"
              subClass="text-green-600"
            />
            <KpiCard
              label="At Risk"
              value={atRisk}
              sub={percentage(atRisk)}
              icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
              iconBg="bg-amber-50"
              subClass="text-amber-600"
            />
            <KpiCard
              label="Delayed"
              value={delayed}
              sub={percentage(delayed)}
              icon={<CircleAlert className="w-4 h-4 text-red-600" />}
              iconBg="bg-red-50"
              subClass="text-red-600"
            />
            <KpiCard
              label="Avg Plan TAT"
              value={average((row) => row.planTAT).toFixed(1)}
              sub="Days"
              icon={<Clock3 className="w-4 h-4 text-slate-500" />}
              iconBg="bg-slate-100"
            />
            <KpiCard
              label="Avg Actual TAT"
              value={average((row) => row.actualTAT).toFixed(1)}
              sub="Days"
              icon={<CalendarDays className="w-4 h-4 text-slate-500" />}
              iconBg="bg-slate-100"
            />
            <KpiCard
              label="Avg Variance"
              value={`+${average((row) => row.variance).toFixed(1)}`}
              sub="Days"
              icon={<BarChart3 className="w-4 h-4 text-red-500" />}
              iconBg="bg-red-50"
              subClass="text-red-500"
            />
            <KpiCard
              label="On-time Completion"
              value={percentage(onTrack)}
              sub="Current query"
              icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
              iconBg="bg-green-50"
              subClass="text-green-600"
            />
          </div>

          {/* Journey table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] font-bold text-gray-800 tracking-wide uppercase">
                  Multi-OSP Train Journey – All Items
                </span>
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  <LegendDot color="bg-green-500" label="On Track" />
                  <LegendDot color="bg-amber-500" label="At Risk" />
                  <LegendDot color="bg-red-500" label="Delayed" />
                  <LegendDot color="bg-gray-300" label="Not Started" />
                </div>

                <div className="flex items-center gap-1 text-[10px] text-purple-600 border border-purple-200 bg-purple-50 rounded px-2 py-0.5">
                  <Route className="w-3 h-3" />
                  <span className="font-semibold">Alt. Route Available</span>
                </div>
              </div>
            </div>

            {/* Table header */}
            <div className="flex items-center bg-gray-50 border-b border-gray-100 text-[10px] font-semibold text-gray-500 uppercase tracking-wide px-2">
              <div className="w-6 shrink-0"></div>
              <div className="w-36 shrink-0 py-2 px-2">Item</div>
              <div className="w-14 shrink-0 text-center py-2">Total OSPs</div>
              <div className="w-16 shrink-0 text-center py-2">Plan TAT (Days)</div>
              <div className="w-16 shrink-0 text-center py-2">Actual TAT (Days)</div>
              <div className="w-16 shrink-0 text-center py-2">Variance (Days)</div>
              <div className="w-24 shrink-0 text-center py-2">Status</div>
              <div className="flex-1 py-2 px-2 flex gap-4 text-center">
                <span className="flex-1">OSP 1</span>
                <span className="flex-1">OSP 2</span>
                <span className="flex-1">OSP 3</span>
                <span className="flex-1">OSP 4</span>
              </div>
            </div>

            {journeyData.map((row) => (
              <div key={row.id} className="border-b border-gray-100 last:border-b-0">
                <div
                  className={`flex items-center px-2 py-2.5 cursor-pointer transition-colors hover:bg-slate-50 ${expandedRows.includes(row.id) ? "bg-blue-50/30" : ""
                    }`}
                  onClick={() => toggleRow(row.id)}
                >
                  <div className="w-6 shrink-0 flex justify-center text-gray-400 hover:text-blue-500">
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${expandedRows.includes(row.id) ? "rotate-90" : ""
                        }`}
                    />
                  </div>

                  <div className="w-36 shrink-0 px-2">
                    <div className="flex flex-wrap items-center gap-1 mb-0.5">
                      <span className="text-[11px] font-bold text-gray-800 leading-tight">
                        {row.item}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[9px] text-gray-400">{row.location}</span>
                      {row.altRoute && (
                        <span className="inline-flex items-center gap-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded px-1 py-[1px] text-[8px] font-semibold">
                          <Route className="w-3 h-3" />
                          Alt. Route
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-14 shrink-0 text-center font-mono text-[12px] font-semibold text-gray-700">
                    {row.totalOSPs}
                  </div>
                  <div className="w-16 shrink-0 text-center font-mono text-[12px] font-semibold text-gray-700">
                    {row.planTAT}
                  </div>
                  <div className="w-16 shrink-0 text-center font-mono text-[12px] font-semibold text-gray-700">
                    {row.actualTAT}
                  </div>
                  <div
                    className={`w-16 shrink-0 text-center font-mono text-[12px] font-bold ${row.variance > 0 ? "text-red-500" : "text-gray-500"
                      }`}
                  >
                    {row.variance > 0 ? `+${row.variance}` : row.variance}
                  </div>

                  <div className="w-24 shrink-0 flex items-center justify-center gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                    {row.status === "Delayed" && <CircleAlert className="w-3.5 h-3.5 text-red-500" />}
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    <div className="flex items-center gap-1">
                      {row.stages.map((stage, idx) => {
                        const isEmpty = stage.status === "not-started";
                        return (
                          <div key={idx} className="flex items-center gap-1 shrink-0">
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Truck className="w-4 h-4 text-blue-500" />
                              <ChevronRight className="w-3 h-3 text-blue-400" />
                            </div>

                            <div
                              className={`flex flex-col items-stretch rounded ${isEmpty ? "ring-1 ring-gray-200" : `ring-1 ${stageRing(stage.status)}`
                                } bg-white overflow-hidden`}
                            >
                              <div className="flex divide-x divide-gray-100">
                                {["Pend", "Scrap", "Comp"].map((part) => {
                                  const value =
                                    part === "Pend"
                                      ? stage.pend
                                      : part === "Scrap"
                                        ? stage.scrap
                                        : stage.comp;

                                  const bgClass = isEmpty
                                    ? "bg-gray-50 border-gray-200"
                                    : stageCellBg(stage.status);

                                  return (
                                    <div
                                      key={part}
                                      className={`flex flex-col items-center px-1.5 py-1 border ${bgClass}`}
                                    >
                                      <span className="text-[8px] font-semibold text-gray-400 leading-none uppercase tracking-wide">
                                        {part}
                                      </span>
                                      <span className="text-[10px] font-semibold text-gray-700 font-mono leading-tight my-[3px]">
                                        {value ?? "-"}
                                      </span>
                                      {!isEmpty ? (
                                        stage.warning ? (
                                          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-amber-500 text-white text-[5px] font-bold">
                                            !
                                          </span>
                                        ) : (
                                          <CircleCheckBig className="w-2 h-2 text-green-500" />
                                        )
                                      ) : (
                                        <Circle className="w-2 h-2 text-gray-300" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="text-center text-[8px] font-medium text-gray-400 bg-gray-50 border-t border-gray-100 px-1 py-[2px] tracking-wide truncate">
                                {stage.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {expandedRows.includes(row.id) && (
                  <div className="border-t border-blue-100">
                    {(row.jobCards ?? [row]).slice(0, 3).map((jobCard) => (
                      <div key={jobCard.jobId ?? jobCard.id} className="flex items-center pl-10 pr-2 py-1.5 bg-slate-50 border-t border-dashed border-gray-200 hover:bg-blue-50/40 transition-colors">
                      <div className="w-36 shrink-0 px-2">
                        <p className="text-[11px] font-semibold text-blue-600">
                          {jobCard.jobId ?? `Item ${jobCard.id}`}
                        </p>
                      </div>
                      <div className="w-14 shrink-0 text-center font-mono text-[11px] text-gray-600">
                        {jobCard.totalOSPs}
                      </div>
                      <div className="w-16 shrink-0 text-center font-mono text-[11px] text-gray-600">
                        {jobCard.planTAT}
                      </div>
                      <div className="w-16 shrink-0 text-center font-mono text-[11px] text-gray-600">
                        {jobCard.actualTAT}
                      </div>
                      <div className="w-16 shrink-0 text-center font-mono text-[11px] font-semibold text-green-600">
                        {jobCard.jobVariance ?? jobCard.variance}
                      </div>
                      <div className="w-24 shrink-0 flex justify-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${statusBadge(jobCard.status)}`}>
                          {jobCard.status}
                        </span>
                      </div>
                      <div className="flex-1 overflow-x-auto">
                        <div className="flex items-center gap-1">
                          {jobCard.stages.map((stage, idx) => (
                            <div key={idx} className="flex items-center gap-1 shrink-0">
                              <div className="flex items-center gap-0.5 shrink-0">
                                <Truck className="w-4 h-4 text-blue-500" />
                                <ChevronRight className="w-3 h-3 text-blue-400" />
                              </div>
                              <div
                                className={`flex flex-col items-stretch rounded ring-1 ${stage.status === "on-track"
                                  ? "ring-green-400"
                                  : stage.status === "at-risk"
                                    ? "ring-amber-400"
                                    : stage.status === "delayed"
                                      ? "ring-red-400"
                                      : "ring-gray-200"
                                  } bg-white overflow-hidden`}
                              >
                                <div className="flex divide-x divide-gray-100">
                                  <div className="flex flex-col items-center px-1.5 py-1 border-green-300 bg-green-50">
                                    <span className="text-[8px] font-semibold text-gray-400 leading-none uppercase tracking-wide">
                                      Pend
                                    </span>
                                    <span className="text-[10px] font-semibold text-gray-700 font-mono leading-tight my-[3px]">
                                      {stage.pend ?? "-"}
                                    </span>
                                    <CircleCheckBig className="w-2 h-2 text-green-500" />
                                  </div>
                                  <div className="flex flex-col items-center px-1.5 py-1 border-green-300 bg-green-50">
                                    <span className="text-[8px] font-semibold text-gray-400 leading-none uppercase tracking-wide">
                                      Scrap
                                    </span>
                                    <span className="text-[10px] font-semibold text-gray-700 font-mono leading-tight my-[3px]">
                                      {stage.scrap ?? "-"}
                                    </span>
                                    <CircleCheckBig className="w-2 h-2 text-green-500" />
                                  </div>
                                  <div className="flex flex-col items-center px-1.5 py-1 border-green-300 bg-green-50">
                                    <span className="text-[8px] font-semibold text-gray-400 leading-none uppercase tracking-wide">
                                      Comp
                                    </span>
                                    <span className="text-[10px] font-semibold text-gray-700 font-mono leading-tight my-[3px]">
                                      {stage.comp ?? "-"}
                                    </span>
                                    <CircleCheckBig className="w-2 h-2 text-green-500" />
                                  </div>
                                </div>
                                <div className="text-center text-[8px] font-medium text-gray-400 bg-gray-50 border-t border-gray-100 px-1 py-[2px] tracking-wide truncate">
                                  {stage.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-3">
                Variance by Stage (Avg Days)
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={varianceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="stage" tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {varianceData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-3">
                Top Delayed OSPs (by Avg Variance)
              </h3>
              <div className="space-y-2.5">
                {delayedOSPs.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 w-36 shrink-0 truncate">
                      {item.name}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${Math.min(item.value * 20, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-red-600 font-mono w-14 text-right">
                      +{item.value} Days
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-2">
                Jobs by Overall Status
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={38}
                        outerRadius={56}
                        stroke="#fff"
                      >
                        {statusData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-gray-900 font-mono leading-none">
                      {totalJobs}
                    </span>
                    <span className="text-[9px] text-gray-400 mt-0.5">Total Jobs</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {statusData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: item.color }}
                      />
                      <div>
                        <p className="text-[10px] text-gray-600">{item.name}</p>
                        <p className="text-[11px] font-semibold font-mono text-gray-800">
                          {item.value}{" "}
                          <span className="text-gray-400 font-normal">
                            ({Math.round((item.value / totalJobs) * 100)}%)
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- small reusable components -------------------- */

function FilterChip({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-white/10 border border-white/20 hover:border-blue-400 rounded px-2.5 py-1 cursor-pointer transition-colors min-w-[90px]">
      <span className="text-[9px] text-white/50 leading-none">{label}</span>
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <span className="text-[11px] font-medium text-white/90">{value}</span>
        {icon}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  iconBg,
  subClass = "text-gray-400",
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  subClass?: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-lg border border-gray-100 px-3 py-2.5 shadow-sm flex-1 min-w-[180px]">
      <div className="mt-0.5 shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 leading-none mb-1 whitespace-nowrap">
          {label}
        </p>
        <p className="text-xl font-bold text-gray-900 leading-none font-mono">{value}</p>
        <p className={`text-[11px] font-semibold mt-0.5 ${subClass}`}>{sub}</p>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
