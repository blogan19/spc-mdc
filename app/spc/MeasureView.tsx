'use client'
// Composes the chart, controls and editor for one SPC chart.
// Supports sub-process split: when measure.splitBy is set, the chart
// region renders one card per stratum instead of a single chart.

import { useMemo, useState } from 'react';
import LineChart from './spc';
import ParetoChart from './ParetoChart';
import FunnelChart from './FunnelChart';
import MeasureEditor from './MeasureEditor';
import DateSetupForm, { type SetupSubmit } from './DateSetupForm';
import DescriptiveStats from './DescriptiveStats';
import GoalsStrip from './GoalsStrip';
import { downloadMeasureCsv } from '@/lib/project/exportCsv';
import { allowedSplitOptions, splitRows } from '@/lib/project/split';
import { analyseSpc } from '@/lib/spc';
import { describeRules } from '@/lib/spc/describeRules';
import type {
  AimDirection,
  ChartKind,
  ChartSettings,
  Measure,
  MeasureRow,
  SplitKind,
} from '@/lib/project/types';

interface MeasureViewProps {
  measure: Measure;
  onUpdateRowField: (rowIndex: number, field: string, value: string) => void;
  onAddRow: (date: string) => void;
  onSetRecalculation: (
    rowIndex: number,
    justification: { reason: string; confirmedAt: string } | null,
  ) => void;
  onUpdateSettings: (patch: Partial<Measure['settings']>) => void;
  onOpenGuides?: () => void;
  pendingImportFile?: File | null;
  onUpdateRows: (rows: Measure['data']) => void;
  onUpdateMeasureMeta: (
    patch: Partial<
      Pick<Measure, 'name' | 'type' | 'aim' | 'target' | 'chartKind' | 'splitBy' | 'increment'>
    >,
  ) => void;
  onSetupMeasure: (submit: SetupSubmit) => void;
  onClose?: () => void;
}

export default function MeasureView({
  measure,
  onUpdateRowField,
  onAddRow,
  onSetRecalculation,
  onUpdateSettings,
  onUpdateRows,
  onUpdateMeasureMeta,
  onSetupMeasure,
  onOpenGuides,
  pendingImportFile,
  onClose,
}: MeasureViewProps) {
  const [showWizard, setShowWizard] = useState(false);
  const isPareto = measure.chartKind === 'Pareto';
  const isFunnel = measure.chartKind === 'Funnel';
  const isCategorical = isPareto || isFunnel;
  const needsSetup = !isCategorical && measure.data.length === 0 && !pendingImportFile;

  const strata = useMemo(
    () =>
      isCategorical
        ? [{ label: '', rows: measure.data }]
        : splitRows(measure.data, measure.splitBy),
    [measure.data, measure.splitBy, isCategorical],
  );
  const isSplit =
    !isCategorical && measure.splitBy !== 'none' && strata.length > 1;

  if (needsSetup || showWizard) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center px-3 sm:px-6 py-8">
        <DateSetupForm
          onApply={(submit) => {
            onSetupMeasure(submit);
            setShowWizard(false);
          }}
          onCancel={showWizard ? () => setShowWizard(false) : onClose}
          initialValues={showWizard ? {
            name: measure.name,
            description: measure.settings.description ?? '',
            xAxisLabel: measure.settings.xAxisLabel ?? '',
            yAxisLabel: measure.settings.yAxisLabel ?? '',
            increment: measure.increment,
            chartKind: measure.chartKind,
            aim: measure.aim,
            target: measure.target,
            splitBy: measure.splitBy,
          } : undefined}
          initialRows={showWizard ? measure.data : undefined}
          initialMode={!showWizard ? 'empty' : undefined}
        />
      </div>
    );
  }

  const isSplitForEdit =
    !isCategorical && measure.splitBy !== 'none' && strata.length > 1;
  const onUpdateRowFieldForChart =
    isCategorical || isSplitForEdit ? undefined : onUpdateRowField;

  return (
    <>
      <div className="px-3 sm:px-6 mt-3">
        <div className="mx-auto w-full max-w-7xl bg-white/80 rounded-xl shadow-lg ring-1 ring-slate-300 p-4 sm:p-6">
          <Controls
            measure={measure}
            onUpdateMeta={onUpdateMeasureMeta}
            onUpdateSettings={onUpdateSettings}
            isSplit={isSplit}
            isCategorical={isCategorical}
            onRedo={() => setShowWizard(true)}
            onOpenGuides={onOpenGuides}
          />

          {!isCategorical && <GoalsStrip measure={measure} />}

          {!isSplit ? (
            <MeasureChartCard
              label=""
              rows={strata[0]?.rows ?? []}
              measure={measure}
              onUpdateRowField={onUpdateRowFieldForChart}
              compact={false}
              showIcons
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {strata.map((s) => (
                <MeasureChartCard
                  key={s.label}
                  label={s.label}
                  rows={s.rows}
                  measure={measure}
                  onUpdateRowField={onUpdateRowFieldForChart}
                  compact
                  showIcons
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {!isCategorical && (
        <div className="px-3 sm:px-6 mt-2">
          <div className="mx-auto w-full max-w-7xl">
            <label className="block text-xs text-slate-400 mb-1">Chart description</label>
            <textarea
              value={measure.settings.chartNote ?? ''}
              onChange={(e) => onUpdateSettings({ chartNote: e.target.value })}
              placeholder="Add a description for this chart…"
              rows={2}
              className="bg-white/5 border border-slate-700 rounded-lg text-slate-300 text-sm p-3 w-full resize-y placeholder:text-slate-600"
            />
          </div>
        </div>
      )}

      <div className="px-3 sm:px-6 mt-3">
        <div className="mx-auto w-full max-w-7xl">
          <DescriptiveStats measure={measure} />
        </div>
      </div>

      <div className="px-3 sm:px-6 mt-3 mb-6">
        <div className="mx-auto w-full max-w-7xl bg-white/80 rounded-xl shadow-lg ring-1 ring-slate-300 p-4 sm:p-8">
          <MeasureEditor
            measure={measure}
            onUpdateRowField={onUpdateRowField}
            onAddRow={onAddRow}
            onSetRecalculation={onSetRecalculation}
            onUpdateSettings={onUpdateSettings}
            onUpdateRows={onUpdateRows}
            onUpdateTarget={(target) => onUpdateMeasureMeta({ target })}
            autoOpenFile={pendingImportFile ?? null}
          />
        </div>
      </div>
    </>
  );
}

function Controls({
  measure,
  onUpdateMeta,
  onUpdateSettings,
  isSplit,
  isCategorical,
  onRedo,
  onOpenGuides,
}: {
  measure: Measure;
  onUpdateMeta: MeasureViewProps['onUpdateMeasureMeta'];
  onUpdateSettings: MeasureViewProps['onUpdateSettings'];
  isSplit: boolean;
  isCategorical: boolean;
  onRedo: () => void;
  onOpenGuides?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
      <button
        type="button"
        onClick={onRedo}
        className="mr-auto text-xs text-gray-400 hover:text-slate-700 transition-colors"
        title="Re-run the setup wizard to change chart type, axis labels, cadence or date range"
      >
        ← Edit setup
      </button>
      <label className="flex items-center gap-1">
        <span className="text-gray-600">Chart</span>
        <select
          value={measure.chartKind}
          onChange={(e) => onUpdateMeta({ chartKind: e.target.value as ChartKind })}
          className="border border-gray-300 rounded px-1 py-0.5"
          title="XmR: mean ± 3-sigma for any continuous metric. Run chart: median, no limits. P chart: proportions (needs a denominator). C chart: counts of rare events with constant exposure. U chart: rates per varying exposure. Pareto: descending bars + cumulative %."
        >
          <option value="XmR">XmR (control)</option>
          <option value="RunChart">Run chart</option>
          <option value="P">P chart (proportions)</option>
          <option value="C">C chart (counts)</option>
          <option value="U">U chart (rates)</option>
          <option value="Pareto">Pareto (categorical)</option>
          <option value="Funnel">Funnel (cross-unit)</option>
        </select>
      </label>

      {!isCategorical && measure.chartKind !== 'RunChart' && (
        <label className="flex items-center gap-1">
          <span className="text-gray-600">Limits</span>
          <select
            value={measure.settings.sigmaLevel ?? 3}
            onChange={(e) => onUpdateSettings({ sigmaLevel: Number(e.target.value) })}
            className="border border-gray-300 rounded px-1 py-0.5"
            title="Sigma level for control limits. NHS Making Data Count uses 3σ (the default). Reducing to 2σ gives narrower limits that catch more signals."
          >
            <option value={2}>2σ</option>
            <option value={2.5}>2.5σ</option>
            <option value={3}>3σ</option>
          </select>
        </label>
      )}

      {!isCategorical && (
        <>
          <label className="flex items-center gap-1">
            <span className="text-gray-600">Split by</span>
            <select
              value={measure.splitBy}
              onChange={(e) => onUpdateMeta({ splitBy: e.target.value as SplitKind })}
              className="border border-gray-300 rounded px-1 py-0.5"
              title="Render the data as one chart per stratum — the MDC alternative to rolling averages."
            >
              {allowedSplitOptions(measure.increment).map((opt) => (
                <option key={opt.kind} value={opt.kind}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1">
            <span className="text-gray-600">Aim</span>
            <select
              value={measure.aim}
              onChange={(e) => onUpdateMeta({ aim: e.target.value as AimDirection })}
              className="border border-gray-300 rounded px-1 py-0.5"
              title="Sets which direction counts as improvement. Pick None to monitor without editorialising signals."
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
              <option value="none">None</option>
            </select>
          </label>

          <label className="flex items-center gap-1">
            <span className="text-gray-600">Target</span>
            <input
              type="number"
              value={measure.target ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                onUpdateMeta({ target: v === '' ? undefined : Number(v) });
              }}
              className="border border-gray-300 rounded px-1 py-0.5 w-24"
              placeholder="—"
            />
          </label>
        </>
      )}

      {isSplit && (
        <span className="text-xs text-gray-500 w-full text-right -mt-1">
          Each card below has its own variation icon and limits computed from its stratum.
        </span>
      )}

      {onOpenGuides && (
        <div className="w-full flex justify-end pt-1 border-t border-gray-100 mt-1">
          <button
            type="button"
            onClick={onOpenGuides}
            className="shrink-0 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            SPC Guides →
          </button>
        </div>
      )}
    </div>
  );
}

interface MeasureChartCardProps {
  label: string;
  rows: MeasureRow[];
  measure: Measure;
  onUpdateRowField?: (rowIndex: number, field: string, value: string) => void;
  compact: boolean;
  showIcons: boolean;
}

function MeasureChartCard({
  label,
  rows,
  measure,
  onUpdateRowField,
  compact,
  showIcons,
}: MeasureChartCardProps) {
  const isPareto = measure.chartKind === 'Pareto';
  const isFunnel = measure.chartKind === 'Funnel';

  const titleParts = [measure.settings.title, label].filter(Boolean);
  const baseChartParams = {
    data: rows,
    aim: measure.aim,
    target: measure.target,
    chartKind: measure.chartKind,
    increment: measure.increment,
    onUpdateRowField,
    onExportCsv: !compact ? () => downloadMeasureCsv(measure) : undefined,
    ...measure.settings,
    title: titleParts.join(' — '),
    ...(compact
      ? {
          width: 520,
          height: 320,
          marginTop: 40,
          marginBottom: 60,
          marginLeft: 50,
          marginRight: 30,
          titleSize: 14,
        }
      : {}),
  };

  if (isPareto || isFunnel) {
    const Chart = isPareto ? ParetoChart : FunnelChart;
    return (
      <div className={compact ? 'bg-white rounded p-3 border border-gray-200' : ''}>
        {compact && label && (
          <h4 className="text-sm font-semibold text-gray-800 mb-1">{label}</h4>
        )}
        <Chart params={baseChartParams} />
      </div>
    );
  }

  return (
    <SpcChartCard
      rows={rows}
      measure={measure}
      label={label}
      compact={compact}
      showIcons={showIcons}
      chartParams={baseChartParams}
    />
  );
}

function SpcChartCard({
  rows,
  measure,
  label,
  compact,
  showIcons,
  chartParams,
}: {
  rows: MeasureRow[];
  measure: Measure;
  label: string;
  compact: boolean;
  showIcons: boolean;
  chartParams: ReturnType<typeof Object>;
}) {
  void rows;
  void showIcons;

  return (
    <div className={compact ? 'bg-white rounded p-3 border border-gray-200' : ''}>
      {compact && label && (
        <h4 className="text-sm font-semibold text-gray-800 mb-1">{label}</h4>
      )}
      <LineChart params={chartParams} />
      {!compact && measure.settings.chartNote?.trim() && (
        <p className="text-sm text-slate-500 italic px-1 mt-1">{measure.settings.chartNote}</p>
      )}
      {!compact && <SpecialCausePanel measure={measure} />}
      {!compact && <ChartLegend settings={measure.settings} hasTarget={measure.target !== undefined} />}
    </div>
  );
}

function ChartLegend({ settings, hasTarget }: { settings: ChartSettings; hasTarget: boolean }) {
  const items: { color: string; label: string; dashed?: boolean }[] = [
    { color: settings.lineColor, label: 'Data' },
    { color: settings.successColor, label: 'Improving signal' },
    { color: settings.outlierColor, label: 'Concerning signal' },
    { color: settings.medianColor, label: 'Mean', dashed: true },
    { color: settings.confColor, label: 'Control limits', dashed: true },
  ];
  if (hasTarget) {
    items.push({ color: '#2563eb', label: 'Target', dashed: true });
  }
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-gray-100">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          {item.dashed ? (
            <svg width="20" height="8" className="shrink-0">
              <line
                x1="0" y1="4" x2="20" y2="4"
                stroke={item.color}
                strokeWidth="2"
                strokeDasharray="4,2"
              />
            </svg>
          ) : (
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function SpecialCausePanel({ measure }: { measure: Measure }) {
  const messages = useMemo(() => {
    const kind = (['RunChart', 'P', 'C', 'U'] as const).includes(
      measure.chartKind as 'RunChart' | 'P' | 'C' | 'U',
    )
      ? (measure.chartKind as 'RunChart' | 'P' | 'C' | 'U')
      : ('XmR' as const);
    const sigmaLevel = measure.settings.sigmaLevel ?? 3;
    const sourceRows = measure.data
      .filter((d) => d?.date && d?.value !== '' && d?.value != null)
      .map((d) => ({
        date: d.date,
        value: Number(d.value),
        denominator:
          d?.denominator !== undefined && d?.denominator !== ''
            ? Number(d.denominator)
            : undefined,
        recalculate: Boolean(d?.comment?.recalculate),
      }))
      .filter((r) => Number.isFinite(r.value));
    if (sourceRows.length === 0) return [];
    const { analysis, plottedRows } = analyseSpc(sourceRows, { kind, sigmaLevel });
    const totalHits =
      analysis.rules.outsideLimits.length +
      analysis.rules.runAboveBelowMean.length +
      analysis.rules.increasingRun.length +
      analysis.rules.decreasingRun.length;
    if (totalHits === 0) return [];
    return describeRules(analysis.rules, plottedRows, analysis.pointLimits);
  }, [measure.data, measure.chartKind, measure.settings.sigmaLevel]);

  if (messages.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 mt-1">
      <p className="text-sm font-semibold text-amber-800 mb-2">
        ⚠ Special cause variation detected
      </p>
      <ul className="space-y-1">
        {messages.map((msg, i) => (
          <li key={i} className="text-sm text-amber-900 flex gap-2">
            <span className="shrink-0">•</span>
            <span>{msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
