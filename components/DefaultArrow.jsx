'use client';
export default function DefaultArrow({
    direction = "left",
    bgColor = "rgb(128, 128, 128)",
    strokeBgColor = "rgb(0, 0, 0)",
    strokeWidth = 1.5,
}) {
    const arrowCords = {
        left: ["16.5", "6"],
        right: ["6", "16.5"],
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            fill="none"
            stroke={strokeBgColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11.5" cy="11.5" r="11.5" fill={bgColor} strokeWidth={0} />
            <line x1={arrowCords[direction][0]} y1="11.5" x2={arrowCords[direction][1]} y2="11.5" />
            <polyline
                points={`11.5 ${arrowCords[direction][0]} ${arrowCords[direction][1]} 11.5 11.5 ${arrowCords[direction][1]}`}
            />
        </svg>
    );
}
