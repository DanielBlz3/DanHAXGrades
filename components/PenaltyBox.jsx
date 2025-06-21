const PenaltyBox = ({
    width = 300,
    height = 150,
    strokeColor = '#fff',
    lineWidth = 2,
}) => {
    const margin = 8;
    const centerX = width / 2;

    const penaltyAreaHeight = height * .875
    const penaltyAreaWidth = width * .95;
    const goalBoxHeight = height/3;
    const goalBoxWidth = width/2;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
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

export default PenaltyBox;
