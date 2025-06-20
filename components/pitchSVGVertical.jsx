const SoccerFieldVertical = ({
  width = 169,
  height = 218,
  strokeColor = '#fff',
  fillColor = '#eee',
  lineWidth = 2,
}) => {
  const margin = 8;
  const fieldWidth = width - 2 * margin;
  const fieldHeight = height - 2 * margin;
  const centerX = width / 2;
  const centerY = height / 2;

  const penaltyAreaHeight = fieldHeight * 0.15;
  const penaltyAreaWidth = fieldWidth * 0.5;

  const goalBoxHeight = fieldHeight * 0.05;
  const goalBoxWidth = fieldWidth * 0.3;

  const centerCircleRadius = Math.min(fieldWidth, fieldHeight) * 0.15;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width={width} height={height} fill={fillColor} />

      {/* Outer boundaries */}
      <rect x={margin} y={margin} width={fieldWidth} height={fieldHeight} fill="none" stroke={strokeColor} strokeWidth={lineWidth} />

      {/* Midfield line */}
      <line x1={margin} y1={centerY} x2={width - margin} y2={centerY} stroke={strokeColor} strokeWidth={lineWidth} />

      {/* Center circle */}
      <circle cx={centerX} cy={centerY} r={centerCircleRadius} fill="none" stroke={strokeColor} strokeWidth={lineWidth} />

      {/* Top penalty area */}
      <rect
        x={centerX - penaltyAreaWidth / 2}
        y={margin}
        width={penaltyAreaWidth}
        height={penaltyAreaHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />

      {/* Top goal box */}
      <rect
        x={centerX - goalBoxWidth / 2}
        y={margin}
        width={goalBoxWidth}
        height={goalBoxHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />

      {/* Bottom penalty area */}
      <rect
        x={centerX - penaltyAreaWidth / 2}
        y={height - margin - penaltyAreaHeight}
        width={penaltyAreaWidth}
        height={penaltyAreaHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />

      {/* Bottom goal box */}
      <rect
        x={centerX - goalBoxWidth / 2}
        y={height - margin - goalBoxHeight}
        width={goalBoxWidth}
        height={goalBoxHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />
    </svg>
  );
};

export default SoccerFieldVertical;
