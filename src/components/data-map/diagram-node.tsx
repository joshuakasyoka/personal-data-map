import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

const DiagramNode = ({ 
    id, 
    x, 
    y, 
    text, 
    isEditing, 
    onEdit, 
    onDragStart, 
    onDragEnd, 
    onClick, 
    isMain, 
    onConnectionStart, 
    onConnectionEnd 
  }: {
    id: string;
    x: number;
    y: number;
    text: string;
    isEditing: boolean;
    isMain: boolean;
    onEdit: (id: string, value: string) => void;
    onDragStart: (e: React.MouseEvent, id: string) => void;
    onDragEnd: () => void;
    onClick: (id: string) => void;
    onConnectionStart: (e: React.MouseEvent, id: string) => void;
    onConnectionEnd: (id: string) => void;
 }) => {
  const [width, setWidth] = useState(100);
  const textElementRef = useRef<SVGTextElement | null>(null);
  
  // Calculate text width when text changes
  useEffect(() => {
    if (textElementRef.current) {
      const textWidth = textElementRef.current.getComputedTextLength();
      setWidth(Math.max(textWidth + 20, 100)); // minimum width of 100px, 10px padding on each side
    }
  }, [text]);

  const rectWidth = width;
  const rectHeight = 30;
  const rectX = -rectWidth / 2;
  const rectY = -rectHeight / 2;

  return (
    <g
      transform={`translate(${x},${y})`}
      onMouseDown={(e) => {
        if (e.button === 0) {
          if (e.shiftKey) {
            onConnectionStart(e, id);
          } else {
            onDragStart(e, id);
          }
        }
      }}
      onMouseUp={(e) => {
        if (e.shiftKey) {
          onConnectionEnd(id);
        } else {
          onDragEnd();
        }
      }}
      style={{ cursor: 'move' }}
    >
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        fill={isMain ? 'black' : 'white'}
        stroke="black"
        strokeWidth="1"
        rx="4"
        ry="4"
      />
      {isEditing ? (
        <foreignObject 
          x={rectX + 5} 
          y={rectY + 3} 
          width={rectWidth - 10} 
          height={rectHeight - 6}
        >
          <Input
            autoFocus
            defaultValue={text}
            className="h-6 text-sm font-mono"
            onBlur={(e) => onEdit(id, e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  onEdit(id, e.currentTarget.value);
                }
              }}
          />
        </foreignObject>
      ) : (
        <text
          ref={textElementRef}
          x="0"
          y="0"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={isMain ? 'white' : 'black'}
          onClick={() => onClick(id)}
          style={{ fontFamily: 'Courier New', fontSize: '14px' }}
        >
          {text}
        </text>
      )}
    </g>
  );
};

export default DiagramNode;