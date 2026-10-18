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

const CSV_EXTENSIONS = ['csv', 'xlsx'];
function fileExt(name: string) {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
}

export default function HomePage() {
  const [measure, setMeasure] = useState<Measure | null>(null);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [dropHover, setDropHover] = useState(false);
  const [displayMode, setDisplayMode] = useState(false);
  const openJsonRef = useRef<HTMLInputElement>(null);
  const openCsvRef = useRef<HTMLInputElement>(null);
  const openWorkspaceRef = useRef<HTMLInputElement>(null);

  const op = (fn: (p: Project) => Project) => {
    if (!measure) return;
    setMeasure(fn(wrap(measure)).measures[0]);
  };

  const loadJsonFile = (file: File) => {
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text) as Measure;
        if (!parsed.id || !Array.isArray(parsed.data)) throw new Error();
        setPendingImportFile(null);
        setMeasure(parsed);
      } catch {
        window.alert('Could not open file — make sure it is a valid SPC chart JSON.');
      }
    });
  };

  const loadCsvFile = (file: File) => {
    const m = newMeasure();
    setPendingImportFile(file);
    setMeasure(m);
  };

  const handleDroppedFile = (file: File) => {
    const ext = fileExt(file.name);
    if (ext === 'json') {
      loadJsonFile(file);
    } else if (CSV_EXTENSIONS.includes(ext)) {
      loadCsvFile(file);
    }
  };

  if (!measure) {
    return (
      <>
        <GuidePanel open={guideOpen} onClose={() => setGuideOpen(false)} />

        {/* Hidden file inputs */}
        <input
          ref={openJsonRef}
          type="file"
          accept=".json,.spc.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadJsonFile(f);
            e.target.value = '';
          }}
        />
        <input
          ref={openCsvRef}
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadCsvFile(f);
            e.target.value = '';
          }}
        />

        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            {/* Wordmark */}
            <div className="text-center mb-12">
              <div className="text-4xl font-extrabold tracking-tight mb-1">
                <span className="text-white">SPC</span>
                <span className="text-slate-400 font-light"> — MDC</span>
              </div>
              <p className="mt-2 text-slate-400 text-sm">
                Statistical process control following NHS Making Data Count methodology
              </p>
            </div>

            {/* Three tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Tile 1 — Enter my own data */}
              <button
                type="button"
                onClick={() => setMeasure(newMeasure())}
                className="group text-left rounded-2xl p-6 bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-500 shadow-lg hover:shadow-indigo-900/40 hover:shadow-xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-white">
                    <path d="M4 6h12M4 10h8M4 14h5" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-white mb-1">Enter my own data</h2>
                <p className="text-sm text-indigo-200 leading-relaxed">
                  Type or paste values into a data table and build your chart step by step
                </p>
                <span className="mt-4 block text-indigo-200 group-hover:translate-x-1 transition-transform text-sm" aria-hidden>→</span>
              </button>

              {/* Tile 2 — Drag & drop a file */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDropHover(true); }}
                onDragLeave={() => setDropHover(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDropHover(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleDroppedFile(file);
                }}
                onClick={() => openCsvRef.current?.click()}
                className={`group cursor-pointer text-left rounded-2xl p-6 border-2 border-dashed transition-all ${
                  dropHover
                    ? 'border-indigo-400 bg-indigo-900/60 scale-[1.02]'
                    : 'border-slate-600 bg-slate-800/50 hover:border-indigo-500 hover:bg-slate-700/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-indigo-800 transition-colors">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-slate-300">
                    <path d="M10 3v10M6 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">
                  {dropHover ? 'Drop to import' : 'Drag & drop a file'}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Upload a <span className="text-slate-300">.csv</span> or <span className="text-slate-300">.xlsx</span> spreadsheet to import your data
                </p>
                <span className="mt-4 block text-slate-500 text-xs group-hover:text-slate-400 transition-colors">
                  Or click to browse files
                </span>
              </div>

              {/* Tile 3 — Load existing graph */}
              <button
                type="button"
                onClick={() => openJsonRef.current?.click()}
                className="group text-left rounded-2xl p-6 bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-500 shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center mb-4 group-hover:bg-slate-600 transition-colors">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-slate-300">
                    <path d="M5 4h6l4 4v9a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" strokeLinejoin="round" />
                    <path d="M11 4v4h4" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">Load existing graph</h2>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  Reopen a previously saved <span className="text-slate-300">.spc.json</span> file to continue your work
                </p>
                <span className="mt-4 block text-slate-500 group-hover:translate-x-1 transition-transform text-sm" aria-hidden>→</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="mt-10 w-full text-center text-sm text-white/60 hover:text-white transition-colors"
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

      <div className="pb-16">
        <input
          ref={openWorkspaceRef}
          type="file"
          accept=".json,.spc.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadJsonFile(f);
            e.target.value = '';
          }}
        />

        <header className="bg-indigo-600/90 border-b border-indigo-500 px-3 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            type="button"
            onClick={() => { setMeasure(null); setPendingImportFile(null); setDisplayMode(false); }}
            className="text-lg font-bold tracking-tight"
          >
            <span className="text-white">SPC</span>
            <span className="text-white/60 font-light"> — MDC</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            {displayMode ? (
              <button
                type="button"
                onClick={() => setDisplayMode(false)}
                className="px-3 py-1.5 rounded-lg bg-white text-indigo-700 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                ← Edit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-white/30 text-white/80 text-sm hover:bg-white/10 hover:text-white transition-colors"
                >
                  Guides
                </button>
                <button
                  type="button"
                  onClick={() => downloadMeasure(measure)}
                  disabled={measure.data.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-white text-indigo-700 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => openWorkspaceRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-white/30 text-white/80 text-sm hover:bg-white/10 hover:text-white transition-colors"
                >
                  Open…
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Start a new chart? Make sure you have saved your current work first.')) {
                      setMeasure(newMeasure());
                      setPendingImportFile(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-white/30 text-white/80 text-sm hover:bg-white/10 hover:text-white transition-colors"
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode(true)}
                  disabled={measure.data.length === 0}
                  className="px-3 py-1.5 rounded-lg border border-white/30 text-white/80 text-sm hover:bg-white/10 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Hide controls and show just the chart"
                >
                  Display
                </button>
              </>
            )}
          </div>
        </header>

        <MeasureView
          measure={measure}
          displayMode={displayMode}
          pendingImportFile={pendingImportFile}
          onClose={() => { setMeasure(null); setPendingImportFile(null); }}
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
