const SoccerField = ({
  width = 218,
  height = 169,
  strokeColor = '#fff',
  fillColor = '#eee',
  lineWidth = 4
}) => {
  // Field margin
  const margin = 0.1 * Math.min(width, height); // 10% margin of the smallest dimension
  const fieldWidth = width - 2 * margin;
  const fieldHeight = height - 2 * margin;
  const centerX = width / 2;
  const centerY = height / 2;

  // Dimensions based on field size
  const penaltyAreaWidth = fieldWidth * 0.15; // 15% of field width
  const penaltyAreaHeight = fieldHeight * 0.5; // 70% of field height

  const goalBoxWidth = fieldWidth * 0.05; // 5% of field width
  const goalBoxHeight = fieldHeight * 0.3; // 30% of field height

  const centerCircleRadius = Math.min(fieldWidth, fieldHeight) * 0.15; // 15% of smallest dimension

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width={width} height={height} fill={fillColor} />

      {/* Outer boundaries */}
      <rect x={margin} y={margin} width={fieldWidth} height={fieldHeight} fill="none" stroke={strokeColor} strokeWidth={lineWidth} />

      {/* Midfield line */}
      <line x1={centerX} y1={margin} x2={centerX} y2={height - margin} stroke={strokeColor} strokeWidth={lineWidth} />

      {/* Center circle */}
      <circle cx={centerX} cy={centerY} r={centerCircleRadius} fill="none" stroke={strokeColor} strokeWidth={lineWidth} />

      {/* Left penalty area */}
      <rect
        x={margin}
        y={centerY - penaltyAreaHeight / 2}
        width={penaltyAreaWidth}
        height={penaltyAreaHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />
      {/* Left goal box */}
      <rect
        x={margin}
        y={centerY - goalBoxHeight / 2}
        width={goalBoxWidth}
        height={goalBoxHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />

      {/* Right penalty area */}
      <rect
        x={width - margin - penaltyAreaWidth}
        y={centerY - penaltyAreaHeight / 2}
        width={penaltyAreaWidth}
        height={penaltyAreaHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />
      {/* Right goal box */}
      <rect
        x={width - margin - goalBoxWidth}
        y={centerY - goalBoxHeight / 2}
        width={goalBoxWidth}
        height={goalBoxHeight}
        fill="none"
        stroke={strokeColor}
        strokeWidth={lineWidth}
      />
    </svg>
  );
};

export default SoccerField;
