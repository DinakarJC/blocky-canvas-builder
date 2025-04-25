import React, { useState, useEffect, CSSProperties, useRef } from "react";
import { ComponentIcon } from "@/components/ComponentIcon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface DroppedComponent {
  name: string;
  type: string;
  id: string;
  styles: {
    width: string;
    height: string;
    backgroundColor: string;
    color: string;
    fontSize: string;
    fontWeight: string;
    padding: string;
    margin: string;
    borderRadius: string;
    textAlign?: "left" | "center" | "right" | "justify" | "start" | "end";
    position?: "relative" | "absolute";
    left?: string;
    top?: string;
  };
  content?: string;
  attributes?: Record<string, string>;
  children?: DroppedComponent[];
  parentId?: string;
}

export const Canvas = () => {
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState<DroppedComponent[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [resizing, setResizing] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Add to history when components change
  const addToHistory = (components: DroppedComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(components)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleDragOver = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    const componentName = e.dataTransfer.getData('componentName');
    const componentType = e.dataTransfer.getData('componentType');
    
    if (!componentName || !canvasRef.current) return;
    
    // Get canvas bounds and drop coordinates
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - canvasRect.left;
    const dropY = e.clientY - canvasRect.top;
    
    // Create a new component with a unique ID and default styles
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
      // If dropping into a container, add to that container's children
      newComponents = addChildToParent(droppedComponents, targetId, newComponent);
    } else {
      // If dropping directly on canvas, add to root level
      newComponents = [...droppedComponents, newComponent];
    }
    
    setDroppedComponents(newComponents);
    setSelectedComponent(newComponent.id);
    addToHistory(newComponents);

    // Publish the selected component to the PropertiesPanel
    window.dispatchEvent(new CustomEvent('component-selected', { 
      detail: { component: newComponent } 
    }));

    // Update layers panel
    updateLayersPanel(newComponents);
  };

  // Helper function to add a child to a parent component
  const addChildToParent = (components: DroppedComponent[], parentId: string, newChild: DroppedComponent): DroppedComponent[] => {
    return components.map(comp => {
      if (comp.id === parentId) {
        return {
          ...comp,
          children: [...(comp.children || []), newChild]
        };
      } else if (comp.children && comp.children.length > 0) {
        return {
          ...comp,
          children: addChildToParent(comp.children, parentId, newChild)
        };
      } else {
        return comp;
      }
    });
  };

  const getDefaultContent = (type: string): string => {
    switch(type.toLowerCase()) {
      case 'text':
        return 'This is a sample text. Click to edit.';
      case 'button':
        return 'Button';
      case 'link':
        return 'Link';
      case 'image':
        return 'https://via.placeholder.com/300x200';
      default:
        return '';
    }
  };

  // Recursively remove component by ID
  const removeComponentById = (components: DroppedComponent[], id: string): DroppedComponent[] => {
    const filteredComponents = components.filter(comp => comp.id !== id);
    
    return filteredComponents.map(comp => {
      if (comp.children && comp.children.length > 0) {
        return {
          ...comp,
          children: removeComponentById(comp.children, id)
        };
      }
      return comp;
    });
  };

  const handleRemoveComponent = (id: string) => {
    const newComponents = removeComponentById(droppedComponents, id);
    setDroppedComponents(newComponents);
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
    addToHistory(newComponents);

    // Update layers panel
    updateLayersPanel(newComponents);
  };

  const handleSelectComponent = (component: DroppedComponent, e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.stopPropagation();
      setSelectedComponent(component.id);
      // Publish the selected component to the PropertiesPanel
      window.dispatchEvent(new CustomEvent('component-selected', { 
        detail: { component } 
      }));
    }
  };

  // Recursively update component by ID
  const updateComponentById = (components: DroppedComponent[], updatedComponent: DroppedComponent): DroppedComponent[] => {
    return components.map(comp => {
      if (comp.id === updatedComponent.id) {
        return updatedComponent;
      } else if (comp.children && comp.children.length > 0) {
        return {
          ...comp,
          children: updateComponentById(comp.children, updatedComponent)
        };
      }
      return comp;
    });
  };

  // Handler for updating a component's styles from the PropertyPanel
  const updateComponent = (updatedComponent: DroppedComponent) => {
    const newComponents = updateComponentById(droppedComponents, updatedComponent);
    setDroppedComponents(newComponents);
    
    // Update layers panel
    updateLayersPanel(newComponents);
  };

  // Build flat list of all components for layers panel
  const flattenComponents = (components: DroppedComponent[], parentNames: string[] = []): any[] => {
    let result: any[] = [];
    
    components.forEach(comp => {
      const path = [...parentNames, comp.name];
      result.push({
        id: comp.id,
        name: comp.name,
        type: comp.type,
        path: path.join(' > ')
      });
      
      if (comp.children && comp.children.length > 0) {
        result = [...result, ...flattenComponents(comp.children, path)];
      }
    });
    
    return result;
  };

  // Function to update the layers panel
  const updateLayersPanel = (components: DroppedComponent[]) => {
    const flatComponents = flattenComponents(components);
    window.dispatchEvent(new CustomEvent('layers-updated', {
      detail: { components: flatComponents }
    }));
  };

  // Start resizing a component
  const startResize = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setResizing(id);
    
    // Add event listeners for resize
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };
  
  // Handle resizing
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
  
  // Stop resizing
  const stopResize = () => {
    if (resizing) {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      setResizing(null);
      addToHistory(droppedComponents);
      updateLayersPanel(droppedComponents);
    }
  };
  
  // Helper to find component by ID (recursive)
  const findComponentById = (components: DroppedComponent[], id: string): DroppedComponent | null => {
    for (const comp of components) {
      if (comp.id === id) return comp;
      
      if (comp.children && comp.children.length > 0) {
        const found = findComponentById(comp.children, id);
        if (found) return found;
      }
    }
    
    return null;
  };

  // Subscribe to style updates from the PropertyPanel
  useEffect(() => {
    const handleStyleUpdate = (e: CustomEvent) => {
      const { component } = e.detail;
      updateComponent(component);
    };

    // Listen for toolbar actions
    const handleUndo = () => {
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setDroppedComponents(JSON.parse(JSON.stringify(history[historyIndex - 1])));
        updateLayersPanel(history[historyIndex - 1]);
      } else {
        toast.error("Nothing to undo");
      }
    };

    const handleRedo = () => {
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setDroppedComponents(JSON.parse(JSON.stringify(history[historyIndex + 1])));
        updateLayersPanel(history[historyIndex + 1]);
      } else {
        toast.error("Nothing to redo");
      }
    };

    const handlePreviewToggle = (e: CustomEvent) => {
      setIsPreviewMode(e.detail.isPreviewMode);
      if (e.detail.isPreviewMode) {
        setSelectedComponent(null);
      }
    };

    const handleClearCanvas = () => {
      setDroppedComponents([]);
      setSelectedComponent(null);
      addToHistory([]);
      updateLayersPanel([]);
    };

    const handleTemplateSection = (e: CustomEvent) => {
      const { template } = e.detail;
      
      // Generate unique IDs for all components in the template
      const newComponents = template.components.map((component: any) => ({
        ...component,
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        children: []
      }));
      
      const updatedComponents = [...droppedComponents, ...newComponents];
      setDroppedComponents(updatedComponents);
      addToHistory(updatedComponents);
      updateLayersPanel(updatedComponents);
    };
    
    const handleStylesPanel = (e: CustomEvent) => {
      if (selectedComponent) {
        // The tab is already in the event detail
        console.log("Opening styles panel with tab:", e.detail.tab);
      } else {
        toast.error("Please select a component first");
      }
    };

    const handleLayerSelected = (e: CustomEvent) => {
      const { id } = e.detail;
      const component = findComponentById(droppedComponents, id);
      if (component) {
        setSelectedComponent(id);
        window.dispatchEvent(new CustomEvent('component-selected', { 
          detail: { component } 
        }));
      }
    };

    window.addEventListener('component-updated' as any, handleStyleUpdate as any);
    window.addEventListener('undo-requested' as any, handleUndo as any);
    window.addEventListener('redo-requested' as any, handleRedo as any);
    window.addEventListener('preview-mode-toggled' as any, handlePreviewToggle as any);
    window.addEventListener('clear-canvas-requested' as any, handleClearCanvas as any);
    window.addEventListener('template-section-added' as any, handleTemplateSection as any);
    window.addEventListener('styles-panel-requested' as any, handleStylesPanel as any);
    window.addEventListener('layer-selected' as any, handleLayerSelected as any);
    
    // Initial update of layers panel
    updateLayersPanel(droppedComponents);
    
    return () => {
      window.removeEventListener('component-updated' as any, handleStyleUpdate as any);
      window.removeEventListener('undo-requested' as any, handleUndo as any);
      window.removeEventListener('redo-requested' as any, handleRedo as any);
      window.removeEventListener('preview-mode-toggled' as any, handlePreviewToggle as any);
      window.removeEventListener('clear-canvas-requested' as any, handleClearCanvas as any);
      window.removeEventListener('template-section-added' as any, handleTemplateSection as any);
      window.removeEventListener('styles-panel-requested' as any, handleStylesPanel as any);
      window.removeEventListener('layer-selected' as any, handleLayerSelected as any);
      
      // Cleanup resize listeners
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, [droppedComponents, selectedComponent, history, historyIndex]);

  // Recursively render components and their children
  const renderComponentTree = (component: DroppedComponent) => {
    const isSelected = selectedComponent === component.id;
    const isResizing = resizing === component.id;
    
    const baseStyles: CSSProperties = {
      ...component.styles,
      border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      position: 'relative',
      cursor: isPreviewMode ? 'default' : 'pointer',
      transition: 'all 0.2s ease'
    };

    // Assign min-height if height is 'auto' for better resizing UX
    if (component.styles.height === 'auto') {
      baseStyles.minHeight = '50px';
    }

    const canContainChildren = ['section', 'row', 'column', 'container'].includes(component.type.toLowerCase());
    const resizeHandleClasses = "absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-bl cursor-se-resize";
    
    const renderContent = () => {
      switch(component.type.toLowerCase()) {
        case 'text':
          return (
            <p style={baseStyles}>
              {component.content}
            </p>
          );
        case 'button':
          return (
            <Button 
              style={baseStyles}
              className="block"
            >
              {component.content}
            </Button>
          );
        case 'image':
          return (
            <img 
              src={component.content} 
              alt="Component" 
              style={baseStyles} 
              className="max-w-full h-auto"
            />
          );
        case 'link':
          return (
            <a 
              href="#" 
              style={baseStyles} 
              className="inline-block"
            >
              {component.content}
            </a>
          );
        case 'section':
          return (
            <section 
              style={baseStyles} 
              className="w-full relative"
              onDragOver={(e) => handleDragOver(e, component.id)}
              onDrop={(e) => handleDrop(e, component.id)}
            >
              {component.children && component.children.length > 0 ? (
                component.children.map(child => (
                  <div key={child.id} className="nested-component">
                    {renderComponentTree(child)}
                  </div>
                ))
              ) : (
                <div className="py-4 flex items-center justify-center bg-gray-50">
                  <span className="text-sm text-gray-500">Drop components here</span>
                </div>
              )}
            </section>
          );
        case 'row':
          return (
            <div 
              style={baseStyles} 
              className="flex flex-row w-full gap-4"
              onDragOver={(e) => handleDragOver(e, component.id)}
              onDrop={(e) => handleDrop(e, component.id)}
            >
              {component.children && component.children.length > 0 ? (
                component.children.map(child => (
                  <div key={child.id} className="flex-1 nested-component">
                    {renderComponentTree(child)}
                  </div>
                ))
              ) : (
                <>
                  <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Drop component here</span>
                  </div>
                  <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Drop component here</span>
                  </div>
                </>
              )}
            </div>
          );
        case 'column':
          return (
            <div 
              style={baseStyles} 
              className="flex flex-col gap-4"
              onDragOver={(e) => handleDragOver(e, component.id)}
              onDrop={(e) => handleDrop(e, component.id)}
            >
              {component.children && component.children.length > 0 ? (
                component.children.map(child => (
                  <div key={child.id} className="nested-component">
                    {renderComponentTree(child)}
                  </div>
                ))
              ) : (
                <>
                  <div className="py-4 bg-gray-50 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Drop component here</span>
                  </div>
                  <div className="py-4 bg-gray-50 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Drop component here</span>
                  </div>
                </>
              )}
            </div>
          );
        case 'container':
          return (
            <div 
              style={baseStyles} 
              className="max-w-4xl mx-auto"
              onDragOver={(e) => handleDragOver(e, component.id)}
              onDrop={(e) => handleDrop(e, component.id)}
            >
              {component.children && component.children.length > 0 ? (
                component.children.map(child => (
                  <div key={child.id} className="nested-component">
                    {renderComponentTree(child)}
                  </div>
                ))
              ) : (
                <div className="py-8 bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Drop components here</span>
                </div>
              )}
            </div>
          );
        case 'video':
          return (
            <div style={baseStyles} className="relative pt-[56.25%]">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                {/* You might want to replace Video with a placeholder or actual video component */}
                <ComponentIcon type="video" />
                <span className="ml-2 text-sm text-gray-500">Video Player</span>
              </div>
            </div>
          );
        case 'map':
          return (
            <div style={baseStyles} className="relative pt-[75%]">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                {/* You might want to replace Map with a placeholder or actual map component */}
                <ComponentIcon type="map" />
                <span className="ml-2 text-sm text-gray-500">Map</span>
              </div>
            </div>
          );
        case 'form':
          return (
            <form style={baseStyles} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" />
              </div>
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-md">Submit</button>
            </form>
          );
        case 'input':
          return (
            <div style={baseStyles} className="space-y-2">
              <label className="block text-sm font-medium">Input Field</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md" 
                placeholder="Enter text here"
              />
            </div>
          );
        default:
          return (
            <div style={baseStyles}>
              <span>{component.name} Component</span>
            </div>
          );
      }
    };

    return (
      <div 
        key={component.id} 
        onClick={(e) => handleSelectComponent(component, e)}
        className={`relative group ${isPreviewMode ? 'pointer-events-none' : ''}`}
      >
        {renderContent()}
        
        {!isPreviewMode && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveComponent(component.id);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 text-gray-500 hover:text-red-500 z-10"
              style={{ display: isResizing ? 'none' : 'block' }}
            >
              &times;
            </button>
            
            {/* Resize handle */}
            <div 
              className={resizeHandleClasses}
              onMouseDown={(e) => startResize(component.id, e)}
              style={{ display: isResizing ? 'none' : 'block' }}
            ></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      className="canvas-area relative p-8 min-h-[calc(100vh-4rem)]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={canvasRef}
    >
      {droppedComponents.length > 0 ? (
        <div className="w-full h-full">
          {droppedComponents.map((component) => renderComponentTree(component))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
          <p className="text-lg mb-2">Drop components here</p>
          <p className="text-sm">Drag elements from the sidebar to build your page</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
