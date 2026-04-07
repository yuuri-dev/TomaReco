import { G, Path, Svg, Text as SvgText } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';

export type GenreStat = { genre: { id: string; name: string; color: string }; count: number };

export default function PieChart({ data }: { data: GenreStat[] }) {
  const SIZE = 200;
  const R = 80;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const total = data.reduce((s, d) => s + d.count, 0);

  let cumAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.count / total) * 2 * Math.PI;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, end: cumAngle, angle };
  });

  function arcPath(start: number, end: number, r: number) {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        <G>
          {slices.map((s) => (
            <Path
              key={s.genre.id}
              d={arcPath(s.start, s.end, R)}
              fill={s.genre.color}
              stroke="white"
              strokeWidth={2}
            />
          ))}
          {slices.map((s) => {
            if (s.angle < 0.3) return null;
            const mid = s.start + s.angle / 2;
            const labelR = R * 0.65;
            return (
              <SvgText
                key={s.genre.id}
                x={cx + labelR * Math.cos(mid)}
                y={cy + labelR * Math.sin(mid)}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="white"
                fontSize={11}
                fontWeight="700"
              >
                {Math.round((s.count / total) * 100)}%
              </SvgText>
            );
          })}
        </G>
      </Svg>
      <View style={styles.legend}>
        {data.map((d) => (
          <View key={d.genre.id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: d.genre.color }]} />
            <Text style={styles.legendLabel}>{d.genre.name}</Text>
            <Text style={styles.legendCount}>{d.count}件</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  legend: {
    width: '100%',
    gap: 8,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  legendCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
});
