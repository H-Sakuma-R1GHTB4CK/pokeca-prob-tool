export type DisplayMode = 'exact' | 'atleast' | 'both';

type ControlsProps = {
  draw: number;
  onDrawChange: (value: number) => void;
  target: number;
  onTargetChange: (value: number) => void;
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  maxDeck: number;
  onMaxDeckChange: (value: number) => void;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const Controls = ({
  draw,
  onDrawChange,
  target,
  onTargetChange,
  mode,
  onModeChange,
  maxDeck,
  onMaxDeckChange,
}: ControlsProps) => {
  const minDraw = 1;
  const maxDraw = 15;
  const minDeck = 1;
  const maxAllowed = 60;

  const handleDraw = (next: number) => {
    onDrawChange(clamp(next, minDraw, maxDraw));
  };

  const handleMaxDeck = (next: number) => {
    onMaxDeckChange(clamp(next, minDeck, maxAllowed));
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
          <span className="control-title">山札のターゲット枚数 t</span>
          <div className="radio-row">
            {[1, 2, 3, 4].map((value) => (
              <label key={value} className="radio-pill">
                <input
                  type="radio"
                  name="target"
                  value={value}
                  checked={target === value}
                  onChange={() => onTargetChange(value)}
                />
                <span>{value}枚</span>
              </label>
            ))}
          </div>
        </div>

        <div className="control">
          <span className="control-title">表示モード</span>
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
                onClick={() => onModeChange(item.value as DisplayMode)}
                aria-pressed={mode === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Controls;
