export type DisplayMode = 'exact' | 'atleast' | 'both';
export type MultiDisplayMode = 'simple' | 'detailed';

export type Target = {
  id: string;
  name: string;
  count: number;
  need: number;
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
  multiMode: MultiDisplayMode;
  onMultiModeChange: (mode: MultiDisplayMode) => void;
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
  multiMode,
  onMultiModeChange,
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
    const updated = targets.map((item, i) => {
      if (i !== index) {
        return item;
      }
      const count = clamp(next, targetMin, targetMax);
      return { ...item, count, need: Math.min(item.need, count) };
    });
    onTargetsChange(updated);
  };

  const handleTargetNeed = (index: number, next: number) => {
    const updated = targets.map((item, i) => {
      if (i !== index) {
        return item;
      }
      const need = clamp(next, targetMin, item.count);
      return { ...item, need };
    });
    onTargetsChange(updated);
  };

  const handleTargetName = (index: number, next: string) => {
    const updated = targets.map((item, i) => (i === index ? { ...item, name: next } : item));
    onTargetsChange(updated);
  };

  const addTarget = () => {
    const id = nextTargetId(targets.length);
    onTargetsChange([...targets, { id, name: `カード ${id}`, count: 1, need: 1 }]);
  };

  const removeTarget = (index: number) => {
    const updated = targets.filter((_, i) => i !== index);
    onTargetsChange(
      updated.length === 0 ? [{ id: 'A', name: 'カード A', count: 1, need: 1 }] : updated
    );
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
          <span className="control-title">山札内に存在するターゲットの枚数</span>
          <div className="target-list">
            {targets.map((target, index) => (
              <div key={target.id} className="target-row">
                <div className="target-meta">
                  <input
                    type="text"
                    className="target-name-input"
                    value={target.name}
                    onChange={(event) => handleTargetName(index, event.target.value)}
                    aria-label={`カード${target.id}の名称`}
                  />
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => removeTarget(index)}
                    disabled={targets.length === 1}
                  >
                    削除
                  </button>
                </div>
                <div className="target-values">
                  <div className="target-field">
                    <span className="target-caption">山札内枚数</span>
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
                  {isMultiTarget && (
                    <div className="target-field">
                      <span className="target-caption">必要枚数 (≥)</span>
                      <div className="stepper-row compact">
                        <button
                          type="button"
                          className="stepper"
                          onClick={() => handleTargetNeed(index, target.need - 1)}
                          aria-label={`カード${target.id}必要枚数を減らす`}
                        >
                          −
                        </button>
                        <span className="value-pill">{target.need}枚</span>
                        <button
                          type="button"
                          className="stepper"
                          onClick={() => handleTargetNeed(index, target.need + 1)}
                          aria-label={`カード${target.id}必要枚数を増やす`}
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="add-target" onClick={addTarget}>
            ターゲットを追加
          </button>
          <span className="helper">合計がaを超えると確率は0になります。</span>
          {isMultiTarget && <span className="helper">複数ターゲット時は「必要枚数(≥)」を使って判定します。</span>}
        </div>

      </div>
    </section>
  );
};

export default Controls;
