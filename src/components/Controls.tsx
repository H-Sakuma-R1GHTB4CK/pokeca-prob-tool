export type DisplayMode = 'exact' | 'atleast' | 'both';

type Target = {
  id: string;
  count: number;
};

type ControlsProps = {
  draw: number;
  onDrawChange: (value: number) => void;
  targets: Target[];
  onTargetsChange: (value: Target[]) => void;
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  maxDeck: number;
  onMaxDeckChange: (value: number) => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const nextTargetId = (index: number) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < alphabet.length) {
    return alphabet[index];
  }
  return `T${index + 1}`;
};

const Controls = ({
  draw,
  onDrawChange,
  targets,
  onTargetsChange,
  mode,
  onModeChange,
  maxDeck,
  onMaxDeckChange,
}: ControlsProps) => {
  const minDraw = 1;
  const maxDraw = 15;
  const minDeck = 1;
  const maxAllowed = 60;
  const targetMin = 1;
  const targetMax = 60;
  const isMultiTarget = targets.length > 1;

  const handleDraw = (next: number) => {
    onDrawChange(clamp(next, minDraw, maxDraw));
  };

  const handleMaxDeck = (next: number) => {
    onMaxDeckChange(clamp(next, minDeck, maxAllowed));
  };

  const handleTargetCount = (index: number, next: number) => {
    const updated = targets.map((item, i) =>
      i === index ? { ...item, count: clamp(next, targetMin, targetMax) } : item
    );
    onTargetsChange(updated);
  };

  const addTarget = () => {
    const id = nextTargetId(targets.length);
    onTargetsChange([...targets, { id, count: 1 }]);
  };

  const removeTarget = (index: number) => {
    const updated = targets.filter((_, i) => i !== index);
    onTargetsChange(updated.length === 0 ? [{ id: 'A', count: 1 }] : updated);
  };

  return (
    <section className="controls">
      <div className="control-card">
        <h2>入力</h2>

        <div className="control">
          <span className="control-title">ドロー枚数 d</span>
          <div className="stepper-row">
            <button
              type="button"
              className="stepper"
              onClick={() => handleDraw(draw - 1)}
              aria-label="ドロー枚数を減らす"
            >
              −
            </button>
            <span className="value-pill">{draw}枚</span>
            <button
              type="button"
              className="stepper"
              onClick={() => handleDraw(draw + 1)}
              aria-label="ドロー枚数を増やす"
            >
              ＋
            </button>
            <span className="helper">範囲: {minDraw}〜{maxDraw}</span>
          </div>
        </div>

        <label className="control">
          <span className="control-title">最大山札枚数 a</span>
          <div className="control-row">
            <input
              type="range"
              min={minDeck}
              max={maxAllowed}
              step={1}
              value={maxDeck}
              onChange={(event) => handleMaxDeck(Number(event.target.value))}
            />
            <span className="value-pill">{maxDeck}枚</span>
          </div>
          <span className="helper">範囲: {minDeck}〜{maxAllowed}</span>
        </label>

        <div className="control">
          <span className="control-title">山札のターゲット枚数</span>
          <div className="target-list">
            {targets.map((target, index) => (
              <div key={target.id} className="target-row">
                <div className="target-meta">
                  <div className="target-label">カード {target.id}</div>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => removeTarget(index)}
                    disabled={targets.length === 1}
                  >
                    削除
                  </button>
                </div>
                <div className="stepper-row compact">
                  <button
                    type="button"
                    className="stepper"
                    onClick={() => handleTargetCount(index, target.count - 1)}
                    aria-label={`カード${target.id}枚数を減らす`}
                  >
                    −
                  </button>
                  <span className="value-pill">{target.count}枚</span>
                  <button
                    type="button"
                    className="stepper"
                    onClick={() => handleTargetCount(index, target.count + 1)}
                    aria-label={`カード${target.id}枚数を増やす`}
                  >
                    ＋
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="add-target" onClick={addTarget}>
            ターゲットを追加
          </button>
          <span className="helper">合計がaを超えると確率は0になります。</span>
        </div>

        <div className="control">
          <span className="control-title">表示モード</span>
          <div className={`segmented ${isMultiTarget ? 'locked' : ''}`}>
            {[
              { value: 'exact', label: 'ちょうど' },
              { value: 'atleast', label: 'それ以上' },
              { value: 'both', label: '両方' },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                className={`segment ${mode === item.value ? 'active' : ''}`}
                onClick={() => onModeChange(item.value as DisplayMode)}
                aria-pressed={mode === item.value}
                disabled={isMultiTarget}
                title={isMultiTarget ? '複数ターゲット時は「それ以上」のみ' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>
          {isMultiTarget && <span className="helper">複数ターゲット時は「それ以上」のみ表示します。</span>}
        </div>
      </div>
    </section>
  );
};

export default Controls;
