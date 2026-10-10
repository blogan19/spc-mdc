'use client';

import { useRef, useState } from 'react';
import MeasureView from '@/app/spc/MeasureView';
import GuidePanel from '@/app/components/GuidePanel';
import { emptyMeasure } from '@/lib/project/seed';
import {
  addEmptyRow,
  setMeasureRows,
  setMeasureSetup,
  setRowRecalculation,
  updateMeasureMeta,
  updateMeasureSettings,
  updateRowField,
  type RowField,
} from '@/lib/project/operations';
import type { ChartSettings, Measure, Project, RecalcJustification } from '@/lib/project/types';
import { type SetupSubmit } from '@/app/spc/DateSetupForm';

function wrap(measure: Measure): Project {
  return {
    id: measure.id,
    name: measure.name,
    createdAt: new Date().toISOString(),
    aim: {},
    measures: [measure],
    pdsaCycles: [],
    driverDiagram: null,
    ishikawa: null,
    processMap: null,
    incidentDataset: null,
  };
}

function downloadMeasure(measure: Measure) {
  const blob = new Blob([JSON.stringify(measure, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${measure.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'chart'}.spc.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function newMeasure(): Measure {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `m-${Date.now().toString(36)}`;
  return emptyMeasure(id, 'New chart');
}

export default function HomePage() {
  const [measure, setMeasure] = useState<Measure | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const openRef = useRef<HTMLInputElement>(null);

  const op = (fn: (p: Project) => Project) => {
    if (!measure) return;
    setMeasure(fn(wrap(measure)).measures[0]);
  };

  const loadFile = (file: File) => {
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text) as Measure;
        if (!parsed.id || !Array.isArray(parsed.data)) throw new Error();
        setMeasure(parsed);
      } catch {
        window.alert('Could not open file — make sure it is a valid SPC chart JSON.');
      }
    });
  };

  if (!measure) {
    return (
      <>
        <GuidePanel open={guideOpen} onClose={() => setGuideOpen(false)} />
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <div className="text-5xl font-extrabold tracking-tight mb-1">
                <span className="text-white">SPC</span>
                <span className="text-slate-400 font-light"> — MDC</span>
              </div>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Statistical process control charts following<br />
                NHS Making Data Count methodology
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setMeasure(newMeasure())}
                className="w-full text-left rounded-2xl p-5 bg-indigo-600 hover:bg-indigo-500 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">New chart</span>
                  <span className="text-indigo-200 group-hover:translate-x-1 transition-transform" aria-hidden>
                    →
                  </span>
                </div>
                <p className="mt-1 text-sm text-indigo-200">
                  Enter your own data or upload a spreadsheet
                </p>
              </button>

              <label className="block w-full rounded-2xl p-5 border border-slate-600 bg-slate-800/60 hover:border-indigo-400 hover:bg-slate-700/60 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-200">Open file…</span>
                  <span className="text-slate-500 group-hover:translate-x-1 transition-transform" aria-hidden>
                    →
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Load a previously saved{' '}
                  <code className="text-xs bg-slate-700 px-1 rounded">.spc.json</code> file
                </p>
                <input
                  type="file"
                  accept=".json,.spc.json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) loadFile(f);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="mt-8 w-full text-center text-sm text-slate-500 hover:text-indigo-400 transition-colors"
            >
              What is SPC? Read the guides →
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <GuidePanel open={guideOpen} onClose={() => setGuideOpen(false)} />

      <div className="min-h-screen bg-gray-50">
        <input
          ref={openRef}
          type="file"
          accept=".json,.spc.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadFile(f);
            e.target.value = '';
          }}
        />

        <header className="bg-slate-900 border-b border-slate-700 px-3 sm:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMeasure(null)}
            className="text-lg font-bold tracking-tight"
          >
            <span className="text-white">SPC</span>
            <span className="text-slate-500 font-light"> — MDC</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 hover:border-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Guides
            </button>
            <button
              type="button"
              onClick={() => downloadMeasure(measure)}
              disabled={measure.data.length === 0}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => openRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-colors"
            >
              Open…
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Start a new chart? Make sure you have saved your current work first.')) {
                  setMeasure(newMeasure());
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800 transition-colors"
            >
              New
            </button>
          </div>
        </header>

        <MeasureView
          measure={measure}
          onOpenGuides={() => setGuideOpen(true)}
          onUpdateRowField={(rowIndex, field, value) =>
            op((p) => updateRowField(p, measure.id, rowIndex, field as RowField, value))
          }
          onAddRow={(date) => op((p) => addEmptyRow(p, measure.id, date))}
          onSetRecalculation={(rowIndex, justification: RecalcJustification | null) =>
            op((p) => setRowRecalculation(p, measure.id, rowIndex, justification))
          }
          onUpdateSettings={(patch: Partial<ChartSettings>) =>
            op((p) => updateMeasureSettings(p, measure.id, patch))
          }
          onUpdateRows={(rows) => op((p) => setMeasureRows(p, measure.id, rows))}
          onUpdateMeasureMeta={(patch) => op((p) => updateMeasureMeta(p, measure.id, patch))}
          onSetupMeasure={({ rows, increment, name, settings, chartKind, aim, target, splitBy }: SetupSubmit) =>
            op((p) =>
              setMeasureSetup(p, measure.id, rows, increment, {
                name,
                settings,
                chartKind,
                aim,
                target,
                splitBy,
              }),
            )
          }
        />
      </div>
    </>
  );
}
