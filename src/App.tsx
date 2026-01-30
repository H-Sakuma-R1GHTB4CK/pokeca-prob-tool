import { useEffect, useMemo, useState } from 'react';
import Controls, { DisplayMode } from './components/Controls';
import ProbabilityChart from './components/ProbabilityChart';
import { atLeast, pmf, probAllAtLeastOne } from './lib/hypergeom';

const DEFAULT_MAX_DECK = 53;

type Target = {
  id: string;
  count: number;
};

const buildData = (draw: number, targets: Target[], maxDeck: number) => {
  const rows: Array<Record<string, number>> = [];
  const upper = Math.max(draw, maxDeck);

  for (let a = draw; a <= upper; a += 1) {
    const row: Record<string, number> = { a } as Record<string, number>;

    if (targets.length === 1) {
      const t = targets[0].count;
      for (let k = 0; k <= t; k += 1) {
        row[`exact_${k}`] = pmf(a, t, draw, k);
        row[`atleast_${k}`] = atLeast(a, t, draw, k);
      }
    } else {
      row.all_atleast_1 = probAllAtLeastOne(
        a,
        draw,
        targets.map((item) => item.count)
      );
    }

    rows.push(row);
  }

  return rows;
};

const App = () => {
  const [draw, setDraw] = useState(8);
  const [targets, setTargets] = useState<Target[]>([{ id: 'A', count: 3 }]);
  const [mode, setMode] = useState<DisplayMode>('both');
  const [maxDeck, setMaxDeck] = useState(DEFAULT_MAX_DECK);

  useEffect(() => {
    if (maxDeck < draw) {
      setMaxDeck(draw);
    }
  }, [draw, maxDeck]);

  useEffect(() => {
    if (targets.length > 1 && mode !== 'atleast') {
      setMode('atleast');
    }
  }, [targets.length, mode]);

  const data = useMemo(() => buildData(draw, targets, maxDeck), [draw, targets, maxDeck]);

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
        />
        <ProbabilityChart
          data={data}
          draw={draw}
          targets={targets}
          mode={mode}
          maxDeck={maxDeck}
        />
      </div>
    </div>
  );
};

export default App;
