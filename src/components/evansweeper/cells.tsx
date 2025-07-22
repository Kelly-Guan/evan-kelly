interface CellsProps {
  value: number | "M";
  revealed: boolean;
  flagged: boolean;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  onChord?: (e: React.MouseEvent) => void;
  showX?: boolean;
}

export default function Cells({
  value,
  revealed,
  flagged,
  onClick,
  onRightClick,
  onChord,
  showX,
}: CellsProps) {
  return (
    <div
      onClick={onClick}
      onContextMenu={onRightClick}
      onDoubleClick={onChord}
      className={`
        w-[35px] h-[35px] flex items-center justify-center
        border border-gray-400 text-2xl select-none cursor-pointer text-purple-900 font-mono
        ${revealed ? "bg-purple-300" : "bg-transparent"}
      `}
    >
      {revealed
        ? value === "M"
          ? "💔"
          : value || ""
        : flagged
          ? "🫶"
          : showX
            ? "👩‍❤️‍💋‍👨"
            : ""}
    </div>
  );
}
