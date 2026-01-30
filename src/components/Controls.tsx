export type DisplayMode = 'exact' | 'atleast' | 'both';

type ControlsProps = {
  draw: number;
  onDrawChange: (value: number) => void;
  target: number;
  onTargetChange: (value: number) => void;
  mode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
};

const Controls = ({
  draw,
  onDrawChange,
  target,
  onTargetChange,
  mode,
  onModeChange,
}: ControlsProps) => {
  return (
    <section className="controls">
      <div className="control-card">
        <h2>入力</h2>

        <label className="control">
          <span className="control-title">ドロー枚数 d</span>
          <div className="control-row">
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={draw}
              onChange={(event) => onDrawChange(Number(event.target.value))}
            />
            <span className="value-pill">{draw}枚</span>
          </div>
        </label>

        <div className="control">
          <span className="control-title">山札枚数 a</span>
          <div className="control-row">
            <div className="fixed-pill">d〜60 を描画（最大60固定）</div>
          </div>
        </div>

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
