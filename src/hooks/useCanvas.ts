
import { useState, useRef } from 'react';
import { DroppedComponent } from '@/types/canvas';
import { toast } from "sonner";
import { 
  getDefaultContent,
  findComponentById,
  removeComponentById,
  updateComponentById,
  addChildToParent,
  flattenComponents
} from '@/utils/canvasUtils';

export const useCanvas = () => {
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState<DroppedComponent[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [resizing, setResizing] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addToHistory = (components: DroppedComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(components)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    const componentName = e.dataTransfer.getData('componentName');
    const componentType = e.dataTransfer.getData('componentType');
    
    if (!componentName || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - canvasRect.left;
    const dropY = e.clientY - canvasRect.top;
    
    const newComponent: DroppedComponent = {
      name: componentName,
      type: componentType,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      styles: {
        width: componentType === 'image' ? '300px' : '100%',
        height: 'auto',
        backgroundColor: 'transparent',
        color: '#000000',
        fontSize: '16px',
        fontWeight: 'normal',
        padding: '12px',
        margin: '0px',
        borderRadius: '4px',
        textAlign: 'left',
        position: targetId ? 'relative' : 'absolute',
        left: targetId ? 'auto' : `${dropX}px`,
        top: targetId ? 'auto' : `${dropY}px`,
      },
      content: getDefaultContent(componentType),
      parentId: targetId,
      children: []
    };
    
    let newComponents: DroppedComponent[];
    
    if (targetId) {
      newComponents = addChildToParent(droppedComponents, targetId, newComponent);
    } else {
      newComponents = [...droppedComponents, newComponent];
    }
    
    setDroppedComponents(newComponents);
    setSelectedComponent(newComponent.id);
    addToHistory(newComponents);
    
    window.dispatchEvent(new CustomEvent('component-selected', { 
      detail: { component: newComponent } 
    }));
    
    updateLayersPanel(newComponents);
  };

  const updateLayersPanel = (components: DroppedComponent[]) => {
    const flatComponents = flattenComponents(components);
    window.dispatchEvent(new CustomEvent('layers-updated', {
      detail: { components: flatComponents }
    }));
  };

  const handleResize = (e: MouseEvent) => {
    if (!resizing || !canvasRef.current) return;
    
    const component = findComponentById(droppedComponents, resizing);
    if (!component) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.clientX - canvasRect.left;
    const relativeY = e.clientY - canvasRect.top;
    
    const updatedComponent = {
      ...component,
      styles: {
        ...component.styles,
        width: `${relativeX}px`,
        height: `${relativeY}px`
      }
    };
    
    const newComponents = updateComponentById(droppedComponents, updatedComponent);
    setDroppedComponents(newComponents);
  };

  return {
    droppedComponents,
    selectedComponent,
    isPreviewMode,
    resizing,
    canvasRef,
    setIsPreviewMode,
    setSelectedComponent,
    setResizing,
    handleDrop,
    handleResize,
    addToHistory,
    updateLayersPanel,
    setDroppedComponents
  };
};
