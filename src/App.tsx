import { useMemo, useState } from 'react';
import Controls, { DisplayMode } from './components/Controls';
import ProbabilityChart from './components/ProbabilityChart';
import { atLeast, pmf } from './lib/hypergeom';

const MAX_DECK = 60;

const buildData = (draw: number, target: number) => {
  const rows: Array<Record<string, number>> = [];

  for (let a = draw; a <= MAX_DECK; a += 1) {
    const row: Record<string, number> = { a } as Record<string, number>;

    for (let k = 0; k <= target; k += 1) {
      row[`exact_${k}`] = pmf(a, target, draw, k);
      row[`atleast_${k}`] = atLeast(a, target, draw, k);
    }

    rows.push(row);
  }

  return rows;
};

const App = () => {
  const [draw, setDraw] = useState(8);
  const [target, setTarget] = useState(3);
  const [mode, setMode] = useState<DisplayMode>('both');

  const data = useMemo(() => buildData(draw, target), [draw, target]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>ポケカ 確率計算＆プロット</h1>
          <p>超幾何分布で「ちょうど」と「それ以上」の確率を可視化します。</p>
        </div>
        <div className="deck-note">最大山札枚数: 60固定</div>
      </header>

      <div className="layout">
        <Controls
          draw={draw}
          onDrawChange={setDraw}
          target={target}
          onTargetChange={setTarget}
          mode={mode}
          onModeChange={setMode}
        />
        <ProbabilityChart
          data={data}
          draw={draw}
          target={target}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default App;
