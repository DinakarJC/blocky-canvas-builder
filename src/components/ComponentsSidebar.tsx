
import { 
  LayoutPanelLeft, 
  Type, 
  Image, 
  Button as ButtonIcon, 
  Link as LinkIcon, 
  Video, 
  Map, 
  FormInput, 
  Columns, 
  Rows, 
  Container
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const ComponentsSidebar = () => {
  const componentCategories = [
    {
      name: "Layout",
      items: [
        { name: "Section", icon: <LayoutPanelLeft size={16} /> },
        { name: "Row", icon: <Rows size={16} /> },
        { name: "Column", icon: <Columns size={16} /> },
        { name: "Container", icon: <Container size={16} /> },
      ]
    },
    {
      name: "Basic Elements",
      items: [
        { name: "Text", icon: <Type size={16} /> },
        { name: "Image", icon: <Image size={16} /> },
        { name: "Button", icon: <ButtonIcon size={16} /> },
        { name: "Link", icon: <LinkIcon size={16} /> },
        { name: "Video", icon: <Video size={16} /> },
        { name: "Map", icon: <Map size={16} /> },
      ]
    },
    {
      name: "Forms",
      items: [
        { name: "Form", icon: <FormInput size={16} /> },
        { name: "Input", icon: <FormInput size={16} /> },
      ]
    }
  ];

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData('component', JSON.stringify(component));
  };

  return (
    <div className="bg-white h-full overflow-y-auto border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm">Components</h2>
      </div>
      <div className="p-2">
        <Accordion type="multiple" defaultValue={["Layout", "Basic Elements", "Forms"]}>
          {componentCategories.map((category) => (
            <AccordionItem value={category.name} key={category.name}>
              <AccordionTrigger className="py-2 text-sm">{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-1">
                  {category.items.map((item) => (
                    <div 
                      key={item.name}
                      className="component-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default ComponentsSidebar;
