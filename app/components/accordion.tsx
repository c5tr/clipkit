import React, { useState } from "react";

export function Accordion({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="border-l border-t border-r border-default flex flex-col">
            { children }
        </div>
    )
}

export function AccordionNode({
    title,
    children
}: {
    title: string;
    children?: React.ReactNode
}) {
    const [ expanded, setExpanded ] = useState(false);

    return (
        <div className="border-b border-default flex flex-col">
            <button className="flex justify-between px-4 py-2 items-center" onClick={() => children && setExpanded((v) => !v)}>
                { title }
                <div className={`icon-[bi--arrow-right-short] text-xl transition-all ${expanded ? "rotate-90" : "rotate-0"}`} />
            </button>
            { expanded && <div className="px-4 py-2">
                { children }
                </div>}
        </div>
    )
}