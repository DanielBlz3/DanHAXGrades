'use client';
export default function DefaultArrow({direction="left", bgColor = "rgb(128, 128, 128)", strokeBgColor = "rgb(0, 0, 0)", strokeWidth }) {
    const arrowCords = {
        "left": ["22", "8"],
        "right": ["8", "22"],
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" fill="none" stroke={strokeBgColor} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx={15} cy={15} r={15} fill={bgColor} strokeWidth={0} />
            <line x1={arrowCords[direction][0]} y1="15" x2={arrowCords[direction][1]} y2="15" />
            <polyline points={`15 ${arrowCords[direction][0]} ${arrowCords[direction][1]} 15 15 ${arrowCords[direction][1]}`} />
        </svg>
    )
}