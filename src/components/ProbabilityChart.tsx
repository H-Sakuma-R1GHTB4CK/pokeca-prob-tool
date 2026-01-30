import { Fragment } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { formatPercent, formatPercentInt } from '../lib/format';
import { DisplayMode } from './Controls';

type Target = {
  id: string;
  count: number;
};

type ChartProps = {
  data: Array<Record<string, number>>;
  draw: number;
  targets: Target[];
  mode: DisplayMode;
  maxDeck: number;
};

const COLORS = ['#2563eb', '#0ea5e9', '#14b8a6', '#10b981'];
const ANIMATION_MS = 400;

const PercentLabel = ({ x, y, value, payload }: any) => {
  if (!payload || payload.a % 5 !== 0) {
    return null;
  }

  const text = `${formatPercentInt(value)}%`;

  return (
    <text x={x} y={y - 8} textAnchor="middle" fontSize={10} fill="#334155">
      {text}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="tooltip">
      <div className="tooltip-title">山札 a = {label} 枚</div>
      <div className="tooltip-body">
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="tooltip-row">
            <span className="dot" style={{ backgroundColor: entry.color }} />
            <span className="tooltip-label">{entry.name}</span>
            <span className="tooltip-value">{formatPercent(entry.value, 2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProbabilityChart = ({ data, draw, targets, mode, maxDeck }: ChartProps) => {
  const isMultiTarget = targets.length > 1;
  const lineCount = (targets[0]?.count ?? 0) + 1;
  const lines = Array.from({ length: lineCount }, (_, index) => index);

  return (
    <section className="chart">
      <div className="chart-card">
        <h2>確率グラフ</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={data} margin={{ top: 20, right: 24, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="a"
                type="number"
                domain={[draw, maxDeck]}
                tickCount={10}
                tickFormatter={(value) => `${value}`}
                tick={{ fill: '#475569' }}
                stroke="#94a3b8"
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
                tick={{ fill: '#475569' }}
                stroke="#94a3b8"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {isMultiTarget ? (
                <Line
                  type="monotone"
                  dataKey="all_atleast_1"
                  stroke={COLORS[0]}
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="全て1枚以上"
                  isAnimationActive
                  animationDuration={ANIMATION_MS}
                >
                  <LabelList dataKey="all_atleast_1" content={<PercentLabel />} />
                </Line>
              ) : (
                lines.map((k) => {
                  const color = COLORS[k % COLORS.length];
                  const exactKey = `exact_${k}`;
                  const atleastKey = `atleast_${k}`;

                  return (
                    <Fragment key={k}>
                      {(mode === 'exact' || mode === 'both') && (
                        <Line
                          type="monotone"
                          dataKey={exactKey}
                          stroke={color}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                          name={`ちょうど ${k}枚`}
                          isAnimationActive
                          animationDuration={ANIMATION_MS}
                        >
                          <LabelList dataKey={exactKey} content={<PercentLabel />} />
                        </Line>
                      )}

                      {(mode === 'atleast' || mode === 'both') && (
                        <Line
                          type="monotone"
                          dataKey={atleastKey}
                          stroke={color}
                          strokeDasharray="6 4"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                          name={`${k}枚以上`}
                          isAnimationActive
                          animationDuration={ANIMATION_MS}
                        >
                          <LabelList dataKey={atleastKey} content={<PercentLabel />} />
                        </Line>
                      )}
                    </Fragment>
                  );
                })
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default ProbabilityChart;
