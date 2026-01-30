import { useEffect, useMemo, useState } from 'react';
import Controls, { DisplayMode, Target, MultiDisplayMode } from './components/Controls';
import ProbabilityChart from './components/ProbabilityChart';
import { atLeast, pmf, probAtLeastTargets, jointPmf } from './lib/hypergeom';

const DEFAULT_MAX_DECK = 53;

const buildCombos = (ranges: number[][]) => {
  if (ranges.length === 0) {
    return [] as number[][];
  }

  const combos: number[][] = [];
  const walk = (index: number, current: number[]) => {
    if (index === ranges.length) {
      combos.push([...current]);
      return;
    }

    for (const value of ranges[index]) {
      current.push(value);
      walk(index + 1, current);
      current.pop();
    }
  };

  walk(0, []);
  return combos;
};

const comboKey = (prefix: string, values: number[]) => `${prefix}_${values.join('_')}`;

const buildData = (
  draw: number,
  targets: Target[],
  maxDeck: number,
  multiMode: MultiDisplayMode
) => {
  const rows: Array<Record<string, number>> = [];
  const upper = Math.max(draw, maxDeck);

  const isMulti = targets.length > 1;
  const exactRanges = targets.map((target) => {
    const min = multiMode === 'simple' ? target.need : 0;
    const max = target.count;
    if (min > max) {
      return [] as number[];
    }
    return Array.from({ length: max - min + 1 }, (_, index) => index + min);
  });
  const exactCombos = isMulti ? buildCombos(exactRanges) : [];

  const atleastRanges = targets.map((target) =>
    Array.from({ length: target.need + 1 }, (_, index) => index)
  );
  const atleastCombos = isMulti && multiMode === 'detailed' ? buildCombos(atleastRanges) : [];

  for (let a = draw; a <= upper; a += 1) {
    const row: Record<string, number> = { a } as Record<string, number>;

    if (targets.length === 1) {
      const t = targets[0].count;
      for (let k = 0; k <= t; k += 1) {
        row[`exact_${k}`] = pmf(a, t, draw, k);
        row[`atleast_${k}`] = atLeast(a, t, draw, k);
      }
    } else {
      row.all_targets = probAtLeastTargets(a, draw, targets);
      exactCombos.forEach((combo) => {
        row[comboKey('exact', combo)] = jointPmf(a, draw, targets, combo);
      });
      atleastCombos.forEach((combo) => {
        row[comboKey('atleast', combo)] = probAtLeastTargets(a, draw, targets, combo);
      });
    }

    rows.push(row);
  }

  return { rows, exactCombos, atleastCombos };
};

const App = () => {
  const [draw, setDraw] = useState(8);
  const [targets, setTargets] = useState<Target[]>([
    { id: 'A', name: 'カード A', count: 3, need: 1 },
  ]);
  const [mode, setMode] = useState<DisplayMode>('atleast');
  const [multiMode, setMultiMode] = useState<MultiDisplayMode>('simple');
  const [maxDeck, setMaxDeck] = useState(DEFAULT_MAX_DECK);

  useEffect(() => {
    if (maxDeck < draw) {
      setMaxDeck(draw);
    }
  }, [draw, maxDeck]);

  const { rows, exactCombos, atleastCombos } = useMemo(
    () => buildData(draw, targets, maxDeck, multiMode),
    [draw, targets, maxDeck, multiMode]
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>ポケカ 確率計算＆プロット</h1>
          <p>超幾何分布で「ちょうど」と「それ以上」の確率を可視化します。</p>
        </div>
        <div className="deck-note">最大山札枚数: {maxDeck}</div>
      </header>

      <div className="layout">
        <Controls
          draw={draw}
          onDrawChange={setDraw}
          targets={targets}
          onTargetsChange={setTargets}
          mode={mode}
          onModeChange={setMode}
          maxDeck={maxDeck}
          onMaxDeckChange={setMaxDeck}
          multiMode={multiMode}
          onMultiModeChange={setMultiMode}
        />
        <div className="chart-column">
          <section className="mode-panel">
            <div className="mode-card">
              <h2>表示モード</h2>
              <div className="segmented">
                {[
                  { value: 'exact', label: 'ちょうど' },
                  { value: 'atleast', label: 'それ以上' },
                  { value: 'both', label: '両方' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`segment ${mode === item.value ? 'active' : ''}`}
                    onClick={() => setMode(item.value as DisplayMode)}
                    aria-pressed={mode === item.value}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {targets.length > 1 && (
                <div className="multi-mode-block">
                  <div className="multi-mode-title">複数ターゲット表示</div>
                  <div className="segmented">
                    {[
                      { value: 'simple', label: '簡易表示' },
                      { value: 'detailed', label: '詳細表示' },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        className={`segment ${multiMode === item.value ? 'active' : ''}`}
                        onClick={() => setMultiMode(item.value as MultiDisplayMode)}
                        aria-pressed={multiMode === item.value}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="helper">詳細表示は組み合わせの線が増えます。</div>
                </div>
              )}
            </div>
          </section>
          <ProbabilityChart
            data={rows}
            draw={draw}
            targets={targets}
            mode={mode}
            maxDeck={maxDeck}
            multiMode={multiMode}
            exactCombos={exactCombos}
            atleastCombos={atleastCombos}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
