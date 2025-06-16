'use client';
export default function DefaultArrow({direction="left", bgColor = "rgb(128, 128, 128)", strokeBgColor = "rgb(0, 0, 0)", strokeWidth }) {
    const arrowCords = {
        "left": ["8", "22"],
        "right": ["22", "8"],
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" class="fixtures-arrow-svg" width="31" height="31" fill="none" stroke={strokeBgColor} stroke-width={strokeWidth}
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx={15} cy={15} r={15} fill={bgColor} stroke-width={0} />
            <line x1={arrowCords[direction][0]} y1="15" x2={arrowCords[direction][1]} y2="15" />
            <polyline points={`15 ${arrowCords[direction][0]} ${arrowCords[direction][1]} 15 15 ${arrowCords[direction][1]}`} />
        </svg>
    )
}