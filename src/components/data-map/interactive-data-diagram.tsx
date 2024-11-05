'use client';

;import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


// First, let's create a Connection component to handle the line and deletion
const Connection = ({
    from, 
    to, 
    fromNode, 
    toNode, 
    onDelete 
  }: {
    from: string;
    to: string;
    fromNode: { x: number; y: number };
    toNode: { x: number; y: number };
    onDelete: (from: string, to: string) => void;
}) => {
    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onDelete(from, to);
      };
  return (
    <line
      x1={fromNode.x}
      y1={fromNode.y}
      x2={toNode.x}
      y2={toNode.y}
      stroke="black"
      strokeWidth="1"
      onContextMenu={handleRightClick}
      style={{ cursor: 'move' }}
      className="hover:stroke-red-500 hover:stroke-[2px] transition-all"
    />
  );
};

interface DiagramNodeProps {
    id: string;
    x: number;
    y: number;
    text: string;
    isMain: boolean;
    isEditing: boolean;
    onEdit: (id: string, newText: string) => void;
    onDragStart: (e: React.MouseEvent, id: string) => void;
    onDragEnd: () => void;
    onClick: (id: string) => void;
    onConnectionStart: (e: React.MouseEvent, id: string) => void;
    onConnectionEnd: (id: string) => void;
  }
  
  export interface TempConnection {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  const DiagramNode = ({ id, x, y, text, isEditing, onEdit, onDragStart, onDragEnd, onClick, isMain = false, onConnectionStart, onConnectionEnd }: DiagramNodeProps) => {
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

const InteractiveDataDiagram = () => {
    const [nodes, setNodes] = useState([
      // Center node
      { id: 'main', x: 550, y: 300, text: 'MY DATA', isMain: true },
      
      // Primary categories
      { id: 'bio', x: 300, y: 200, text: 'Biometric Data', isMain: true },
      { id: 'health', x: 400, y: 400, text: 'Health Data', isMain: true },
      { id: 'financial', x: 700, y: 200, text: 'Financial Data', isMain: true },
      { id: 'digital', x: 600, y: 400, text: 'Digital Data', isMain: true },
      { id: 'professional', x: 350, y: 300, text: 'Professional', isMain: true },
      { id: 'personal', x: 700, y: 300, text: 'Personal Info', isMain: true },
      
      // Biometric subcategories
      { id: 'height', x: 250, y: 150, text: 'Height: 5\'8"' },
      { id: 'weight', x: 400, y: 150, text: 'Weight' },
      { id: 'dna', x: 250, y: 250, text: 'DNA Profile' },
      
      // Health subcategories
      { id: 'medical', x: 450, y: 450, text: 'Medical History' },
      { id: 'fitness', x: 300, y: 450, text: 'Fitness Data' },
      { id: 'allergies', x: 400, y: 500, text: 'Allergies' },
      
      // Financial subcategories
      { id: 'bank', x: 800, y: 150, text: 'Bank Accounts' },
      { id: 'invest', x: 750, y: 250, text: 'Investments' },
      { id: 'crypto', x: 850, y: 200, text: 'Crypto Assets' },
      
      // Digital subcategories
      { id: 'social', x: 600, y: 450, text: 'Social Media' },
      { id: 'email', x: 800, y: 450, text: 'Email Accounts' },
      { id: 'devices', x: 650, y: 500, text: 'Devices' },
      
      // Professional subcategories
      { id: 'education', x: 200, y: 300, text: 'Education' },
      { id: 'work', x: 250, y: 350, text: 'Work History' },
      { id: 'skills', x: 200, y: 400, text: 'Skills' },
      
      // Personal subcategories
      { id: 'identity', x: 900, y: 300, text: 'Identity Docs' },
      { id: 'contact', x: 750, y: 350, text: 'Contact Info' },
      { id: 'family', x: 800, y: 400, text: 'Family Data' }
    ]);
    
    const [connections, setConnections] = useState([
      // Main connections
      { from: 'main', to: 'bio' },
      { from: 'main', to: 'health' },
      { from: 'main', to: 'financial' },
      { from: 'main', to: 'digital' },
      { from: 'main', to: 'professional' },
      { from: 'main', to: 'personal' },
      
      // Biometric connections
      { from: 'bio', to: 'height' },
      { from: 'bio', to: 'weight' },
      { from: 'bio', to: 'dna' },
      
      // Health connections
      { from: 'health', to: 'medical' },
      { from: 'health', to: 'fitness' },
      { from: 'health', to: 'allergies' },
      
      // Financial connections
      { from: 'financial', to: 'bank' },
      { from: 'financial', to: 'invest' },
      { from: 'financial', to: 'crypto' },
      
      // Digital connections
      { from: 'digital', to: 'social' },
      { from: 'digital', to: 'email' },
      { from: 'digital', to: 'devices' },
      
      // Professional connections
      { from: 'professional', to: 'education' },
      { from: 'professional', to: 'work' },
      { from: 'professional', to: 'skills' },
      
      // Personal connections
      { from: 'personal', to: 'identity' },
      { from: 'personal', to: 'contact' },
      { from: 'personal', to: 'family' }
    ]);
  
    const [dragging, setDragging] = useState<string | null>(null);
    const [connecting, setConnecting] = useState<string | null>(null);
    const [tempConnection, setTempConnection] = useState<TempConnection | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [editingId, setEditingId] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    
    

    
  
    const handleDragStart = (e: React.MouseEvent, id: string) => {
      const svg = svgRef.current;
      if (!svg) return;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      
      const node = nodes.find(n => n.id === id);
      if (!node) return;  // Add null check
      setOffset({
        x: svgP.x - node.x,
        y: svgP.y - node.y
      });
      setDragging(id);
    };
  
    const handleDragEnd = () => {
      setDragging(null);
    };
  
    
    const handleConnectionStart = (e: React.MouseEvent, id: string) => {
        setConnecting(id);
        const node = nodes.find(n => n.id === id);
        if (!node) return;
      
        setTempConnection({
            x1: node.x,
            y1: node.y,
            x2: node.x,
            y2: node.y
          } as TempConnection);
      };
  
      const handleConnectionEnd = (id: string) => {
        if (connecting && connecting !== id) {
        // Check if connection already exists
        const connectionExists = connections.some(
          conn => (conn.from === connecting && conn.to === id) ||
                 (conn.from === id && conn.to === connecting)
        );
        
        if (!connectionExists) {
          setConnections([...connections, { from: connecting, to: id }]);
        }
      }
      setConnecting(null);
      setTempConnection(null);
    };
  
    const handleMouseMove = (e: React.MouseEvent) => {
        const svg = svgRef.current;
        if (!svg) return;
        
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
  
      if (dragging) {
        setNodes(nodes.map(node => 
          node.id === dragging
            ? { ...node, x: svgP.x - offset.x, y: svgP.y - offset.y }
            : node
        ));
      }
  
      if (connecting) {
        const startNode = nodes.find(n => n.id === connecting);
        if (!startNode) return;
        
        setTempConnection({
          x1: startNode.x,
          y1: startNode.y,
          x2: svgP.x,
          y2: svgP.y
        });
      }
    };
  
    const addNode = (isPrimary = false) => {
      const newId = `node-${Math.random().toString(36).substr(2, 9)}`;
      setNodes([
        ...nodes,
        { 
          id: newId, 
          x: 400, 
          y: 300, 
          text: 'New Data Point', 
          isMain: isPrimary 
        }
      ]);
    };
  
    const handleNodeClick = (id: string) => {
        setEditingId(id);
      };
  
      const handleNodeEdit = (id: string, newText: string) => {
        setNodes(nodes.map(node => 
          node.id === id ? { ...node, text: newText } : node
        ));
      };
  
    const handleDeleteConnection = (from: string, to: string) => {
        setConnections(connections.filter(conn => 
          !(conn.from === from && conn.to === to || conn.from === to && conn.to === from)
        ));
      };

    const exportSVG = () => {
      if (svgRef.current) {
        const svgCopy = svgRef.current.cloneNode(true);
        
        // Add title to the exported SVG
        const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        titleText.setAttribute("x", "400");
        titleText.setAttribute("y", "30");
        titleText.setAttribute("text-anchor", "middle");
        titleText.setAttribute("font-family", "Courier New");
        titleText.setAttribute("font-size", "24px");
        titleText.textContent = "My Personal Data Map";
        svgCopy.insertBefore(titleText, svgCopy.firstChild);
  
        // Convert to string and download
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgCopy);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'personal-data-map.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    };
  
    return (
        <div className="max-w-6xl mx-auto p-8 font-mono">
          <h1 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: 'Courier New' }}>
            My Data or Your Data ?
          </h1>
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">Map and organize your personal data categories</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => addNode(true)} variant="default" className="font-mono">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Primary Node
              </Button>
              <Button onClick={() => addNode(false)} variant="outline" className="font-mono">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Secondary Node
              </Button>
              <Button onClick={exportSVG} variant="outline" className="font-mono">
                <Camera className="mr-2 h-4 w-4" />
                Save as SVG
              </Button>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Hold Shift + Drag between nodes to create connections
            </div>
            <div className="text-sm text-gray-500">
              Right-click on a connection to delete it
            </div>
          </div>
          <svg
            ref={svgRef}
            width="100%"
            height="600"
            onMouseMove={handleMouseMove}
            onMouseUp={() => {
              handleDragEnd();
              setConnecting(null);
              setTempConnection(null);
            }}
          >
            {/* Connections */}
            {connections.map(({ from, to }, i) => {
  const fromNode = nodes.find(n => n.id === from);
  const toNode = nodes.find(n => n.id === to);
  
  if (!fromNode || !toNode) return null;

  return (
    <Connection
      key={`${from}-${to}-${i}`}
      from={from}
      to={to}
      fromNode={{ x: fromNode.x, y: fromNode.y }}
      toNode={{ x: toNode.x, y: toNode.y }}
      onDelete={handleDeleteConnection}
    />
  );
})}
            
            {/* Temporary connection line while dragging */}
            {tempConnection && (
              <line
                x1={tempConnection.x1}
                y1={tempConnection.y1}
                x2={tempConnection.x2}
                y2={tempConnection.y2}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="4"
              />
            )}
            
            {/* Nodes */}
            {nodes.map(node => (
  <DiagramNode
    key={node.id}
    id={node.id}
    x={node.x}
    y={node.y}
    text={node.text}
    isMain={node.isMain ?? false}
    isEditing={editingId === node.id}
    onEdit={handleNodeEdit}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    onClick={handleNodeClick}
    onConnectionStart={handleConnectionStart}
    onConnectionEnd={handleConnectionEnd}
  />
))}
          </svg>
        </div>
      );
    };
    
    export default InteractiveDataDiagram;