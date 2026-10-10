import type { RuleHits, SpcPointLimits } from './types';

interface PlottedRow {
  date: string;
  value: number;
}

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[parseInt(m[2], 10) - 1];
  return `${parseInt(m[3], 10)} ${month} ${m[1]}`;
}

function groupConsecutiveRuns(indices: number[]): number[][] {
  if (indices.length === 0) return [];
  const sorted = [...indices].sort((a, b) => a - b);
  const runs: number[][] = [];
  let current = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      current.push(sorted[i]);
    } else {
      runs.push(current);
      current = [sorted[i]];
    }
  }
  runs.push(current);
  return runs;
}

function fmt(v: number): string {
  return Number.isFinite(v) ? parseFloat(v.toFixed(2)).toString() : '—';
}

export function describeRules(
  rules: RuleHits,
  rows: PlottedRow[],
  pointLimits: SpcPointLimits[],
): string[] {
  const messages: string[] = [];

  // Rule 1: individual points outside the control limits
  for (const i of [...rules.outsideLimits].sort((a, b) => a - b)) {
    const row = rows[i];
    const limits = pointLimits[i];
    if (!row || !limits) continue;
    messages.push(
      `Point on ${formatDate(row.date)} lies outside the control limits (value: ${fmt(row.value)}, UCL: ${fmt(limits.ucl)}, LCL: ${fmt(limits.lcl)})`,
    );
  }

  // Rule 2: runs above/below the mean
  for (const run of groupConsecutiveRuns(rules.runAboveBelowMean)) {
    if (run.length === 0) continue;
    const firstRow = rows[run[0]];
    const lastRow = rows[run[run.length - 1]];
    const firstLimits = pointLimits[run[0]];
    if (!firstRow || !lastRow || !firstLimits) continue;
    const direction = firstRow.value > firstLimits.mean ? 'above' : 'below';
    const dateRange =
      run.length === 1
        ? formatDate(firstRow.date)
        : `${formatDate(firstRow.date)} – ${formatDate(lastRow.date)}`;
    messages.push(
      `Run of ${run.length} consecutive point${run.length === 1 ? '' : 's'} ${direction} the mean (${dateRange})`,
    );
  }

  // Rule 3a: increasing trend runs
  for (const run of groupConsecutiveRuns(rules.increasingRun)) {
    if (run.length === 0) continue;
    const firstRow = rows[run[0]];
    const lastRow = rows[run[run.length - 1]];
    if (!firstRow || !lastRow) continue;
    const dateRange =
      run.length === 1
        ? formatDate(firstRow.date)
        : `${formatDate(firstRow.date)} – ${formatDate(lastRow.date)}`;
    messages.push(
      `Trend of ${run.length} consecutive rising point${run.length === 1 ? '' : 's'} (${dateRange})`,
    );
  }

  // Rule 3b: decreasing trend runs
  for (const run of groupConsecutiveRuns(rules.decreasingRun)) {
    if (run.length === 0) continue;
    const firstRow = rows[run[0]];
    const lastRow = rows[run[run.length - 1]];
    if (!firstRow || !lastRow) continue;
    const dateRange =
      run.length === 1
        ? formatDate(firstRow.date)
        : `${formatDate(firstRow.date)} – ${formatDate(lastRow.date)}`;
    messages.push(
      `Trend of ${run.length} consecutive falling point${run.length === 1 ? '' : 's'} (${dateRange})`,
    );
  }

  return messages;
}
