
import { useState } from "react";
import { 
  LayoutPanelLeft, 
  Type, 
  Image, 
  Square, 
  Link, 
  Video, 
  Map, 
  FormInput, 
  Columns, 
  Rows, 
  Container
} from "lucide-react";

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
      return <Image size={16} />;
    case 'button':
      return <Square size={16} />;
    case 'link':
      return <Link size={16} />;
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
}

export const Canvas = () => {
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentName = e.dataTransfer.getData('componentName');
    const componentType = e.dataTransfer.getData('componentType');
    
    if (componentName) {
      // Create a new component with a unique ID
      const newComponent: DroppedComponent = {
        name: componentName,
        type: componentType,
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      setDroppedComponents([...droppedComponents, newComponent]);
    }
  };

  const handleRemoveComponent = (id: string) => {
    setDroppedComponents(droppedComponents.filter(component => component.id !== id));
  };

  return (
    <div 
      className="canvas-area relative p-8"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {droppedComponents.length > 0 ? (
        <div className="w-full">
          {droppedComponents.map((component) => (
            <div 
              key={component.id} 
              className="p-4 border border-gray-200 rounded-md mb-4 bg-white relative hover:border-blue-400 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <ComponentIcon type={component.type} />
                <span>{component.name} Component</span>
              </div>
              <button 
                onClick={() => handleRemoveComponent(component.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-lg mb-2">Drop components here</p>
          <p className="text-sm">Drag elements from the sidebar to build your page</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
