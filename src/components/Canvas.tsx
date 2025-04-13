
import { useState } from "react";
import { 
  LayoutPanelLeft, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Link as LinkIcon, 
  Video, 
  Map, 
  FormInput, 
  Columns, 
  Rows, 
  Container
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Component to render the appropriate icon based on component type
const ComponentIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'section':
      return <LayoutPanelLeft size={16} />;
    case 'row':
      return <Rows size={16} />;
    case 'column':
      return <Columns size={16} />;
    case 'container':
      return <Container size={16} />;
    case 'text':
      return <Type size={16} />;
    case 'image':
      return <ImageIcon size={16} />;
    case 'button':
      return <Square size={16} />;
    case 'link':
      return <LinkIcon size={16} />;
    case 'video':
      return <Video size={16} />;
    case 'map':
      return <Map size={16} />;
    case 'form':
    case 'input':
      return <FormInput size={16} />;
    default:
      return null;
  }
};

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
    textAlign?: string;
  };
  content?: string;
  attributes?: Record<string, string>;
}

export const Canvas = () => {
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentName = e.dataTransfer.getData('componentName');
    const componentType = e.dataTransfer.getData('componentType');
    
    if (componentName) {
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
        },
        content: getDefaultContent(componentType)
      };
      
      setDroppedComponents([...droppedComponents, newComponent]);
      setSelectedComponent(newComponent.id);

      // Publish the selected component to the PropertiesPanel
      window.dispatchEvent(new CustomEvent('component-selected', { 
        detail: { component: newComponent } 
      }));
    }
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

  const handleRemoveComponent = (id: string) => {
    setDroppedComponents(droppedComponents.filter(component => component.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const handleSelectComponent = (component: DroppedComponent) => {
    setSelectedComponent(component.id);
    // Publish the selected component to the PropertiesPanel
    window.dispatchEvent(new CustomEvent('component-selected', { 
      detail: { component } 
    }));
  };

  // Handler for updating a component's styles from the PropertyPanel
  const updateComponent = (updatedComponent: DroppedComponent) => {
    setDroppedComponents(
      droppedComponents.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
  };

  // Subscribe to style updates from the PropertyPanel
  React.useEffect(() => {
    const handleStyleUpdate = (e: CustomEvent) => {
      const { component } = e.detail;
      updateComponent(component);
    };

    window.addEventListener('component-updated' as any, handleStyleUpdate as any);
    
    return () => {
      window.removeEventListener('component-updated' as any, handleStyleUpdate as any);
    };
  }, [droppedComponents]);

  // Render the actual component based on its type
  const renderComponent = (component: DroppedComponent) => {
    const isSelected = selectedComponent === component.id;
    const baseStyles = {
      ...component.styles,
      border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      position: 'relative' as const,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    };

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
          <section style={baseStyles} className="w-full">
            <div className="py-4 flex items-center justify-center bg-gray-50">
              <span className="text-sm text-gray-500">Section</span>
            </div>
          </section>
        );
      case 'row':
        return (
          <div style={baseStyles} className="flex flex-row w-full gap-4">
            <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
              <span className="text-sm text-gray-500">Column 1</span>
            </div>
            <div className="flex-1 py-8 bg-gray-50 flex items-center justify-center">
              <span className="text-sm text-gray-500">Column 2</span>
            </div>
          </div>
        );
      case 'column':
        return (
          <div style={baseStyles} className="flex flex-col gap-4">
            <div className="py-4 bg-gray-50 flex items-center justify-center">
              <span className="text-sm text-gray-500">Item 1</span>
            </div>
            <div className="py-4 bg-gray-50 flex items-center justify-center">
              <span className="text-sm text-gray-500">Item 2</span>
            </div>
          </div>
        );
      case 'container':
        return (
          <div style={baseStyles} className="max-w-4xl mx-auto">
            <div className="py-8 bg-gray-50 flex items-center justify-center">
              <span className="text-sm text-gray-500">Container Content</span>
            </div>
          </div>
        );
      case 'video':
        return (
          <div style={baseStyles} className="relative pt-[56.25%]">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <Video size={32} className="text-gray-400" />
              <span className="ml-2 text-sm text-gray-500">Video Player</span>
            </div>
          </div>
        );
      case 'map':
        return (
          <div style={baseStyles} className="relative pt-[75%]">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <Map size={32} className="text-gray-400" />
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
      className="canvas-area relative p-8"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {droppedComponents.length > 0 ? (
        <div className="w-full space-y-4">
          {droppedComponents.map((component) => (
            <div 
              key={component.id} 
              onClick={() => handleSelectComponent(component)}
              className="relative group"
            >
              {renderComponent(component)}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveComponent(component.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 text-gray-500 hover:text-red-500 z-10"
              >
                &times;
              </button>
            </div>
          ))}
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
