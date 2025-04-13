
import React, { useState } from "react";
import { Undo2, Redo2, Paintbrush, Eye, Upload, Trash2, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { toast } from "sonner";

interface TemplateSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  components: any[];
}

// Pre-built template sections
const templateSections: TemplateSection[] = [
  {
    id: "hero",
    name: "Hero Section",
    icon: <LayoutTemplate size={16} />,
    components: [
      {
        name: "Hero Heading",
        type: "text",
        content: "Welcome to our Website",
        styles: {
          width: "100%",
          height: "auto",
          backgroundColor: "transparent",
          color: "#000000",
          fontSize: "32px",
          fontWeight: "bold",
          padding: "12px",
          margin: "0px",
          borderRadius: "4px",
          textAlign: "center",
        }
      },
      {
        name: "Hero Subheading",
        type: "text",
        content: "We provide the best services for your needs",
        styles: {
          width: "100%",
          height: "auto",
          backgroundColor: "transparent",
          color: "#666666",
          fontSize: "18px",
          fontWeight: "normal",
          padding: "12px",
          margin: "0px",
          borderRadius: "4px",
          textAlign: "center",
        }
      },
      {
        name: "Call to Action",
        type: "button",
        content: "Get Started",
        styles: {
          width: "auto",
          height: "auto",
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: "medium",
          padding: "12px 24px",
          margin: "12px auto",
          borderRadius: "4px",
          textAlign: "center",
        }
      }
    ]
  },
  {
    id: "features",
    name: "Features Section",
    icon: <LayoutTemplate size={16} />,
    components: [
      {
        name: "Features Heading",
        type: "text",
        content: "Our Features",
        styles: {
          width: "100%",
          height: "auto",
          backgroundColor: "transparent",
          color: "#000000",
          fontSize: "28px",
          fontWeight: "bold",
          padding: "12px",
          margin: "0px",
          borderRadius: "4px",
          textAlign: "center",
        }
      },
      {
        name: "Row",
        type: "row",
        styles: {
          width: "100%",
          height: "auto",
          backgroundColor: "transparent",
          color: "#000000",
          fontSize: "16px",
          fontWeight: "normal",
          padding: "24px",
          margin: "12px 0",
          borderRadius: "4px",
          textAlign: "left",
        }
      }
    ]
  },
  {
    id: "contact",
    name: "Contact Section",
    icon: <LayoutTemplate size={16} />,
    components: [
      {
        name: "Contact Heading",
        type: "text",
        content: "Contact Us",
        styles: {
          width: "100%",
          height: "auto",
          backgroundColor: "transparent",
          color: "#000000",
          fontSize: "28px",
          fontWeight: "bold",
          padding: "12px",
          margin: "0px",
          borderRadius: "4px",
          textAlign: "center",
        }
      },
      {
        name: "Contact Form",
        type: "form",
        styles: {
          width: "100%",
          height: "auto",
          backgroundColor: "transparent",
          color: "#000000",
          fontSize: "16px",
          fontWeight: "normal",
          padding: "24px",
          margin: "12px 0",
          borderRadius: "4px",
          textAlign: "left",
        }
      }
    ]
  }
];

export const Toolbar = () => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleUndo = () => {
    // Broadcast undo request to Canvas
    window.dispatchEvent(new CustomEvent('undo-requested'));
    toast.info("Undo requested");
  };

  const handleRedo = () => {
    // Broadcast redo request to Canvas
    window.dispatchEvent(new CustomEvent('redo-requested'));
    toast.info("Redo requested");
  };

  const handleStylesPanel = () => {
    // Broadcast styles panel toggle
    window.dispatchEvent(new CustomEvent('styles-panel-requested', {
      detail: { tab: "styles" }
    }));
    toast.info("Styles panel opened");
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
    // Broadcast preview mode toggle
    window.dispatchEvent(new CustomEvent('preview-mode-toggled', {
      detail: { isPreviewMode: !isPreviewMode }
    }));
    toast.info(isPreviewMode ? "Edit mode activated" : "Preview mode activated");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all components?")) {
      // Broadcast clear request to Canvas
      window.dispatchEvent(new CustomEvent('clear-canvas-requested'));
      toast.success("Canvas cleared");
    }
  };

  const handlePublish = () => {
    // Broadcast publish request
    window.dispatchEvent(new CustomEvent('publish-requested'));
    toast.success("Changes published successfully!");
  };

  const handleAddTemplateSection = (template: TemplateSection) => {
    // Broadcast template add request to Canvas with the template components
    window.dispatchEvent(new CustomEvent('template-section-added', {
      detail: { template }
    }));
    toast.success(`${template.name} added to canvas`);
  };

  return (
    <div className="bg-white border-b border-border flex items-center justify-between p-2 px-4">
      <div className="flex items-center">
        <div className="font-semibold mr-8">Page Builder</div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="toolbar-button" onClick={handleUndo}>
                  <Undo2 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="toolbar-button" onClick={handleRedo}>
                  <Redo2 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="toolbar-button" onClick={handleStylesPanel}>
                  <Paintbrush size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Styles</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="toolbar-button">
                <LayoutTemplate size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Template Sections</h3>
                <div className="grid gap-2">
                  {templateSections.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="justify-start h-auto py-2"
                      onClick={() => handleAddTemplateSection(template)}
                    >
                      {template.icon}
                      <span className="ml-2">{template.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="toolbar-button text-red-500" onClick={handleClear}>
                <Trash2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isPreviewMode ? "default" : "outline"}
                size="sm" 
                className="flex items-center gap-1"
                onClick={handlePreviewToggle}
              >
                <Eye size={16} />
                <span>Preview</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview Changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button size="sm" className="flex items-center gap-1" onClick={handlePublish}>
          <Upload size={16} />
          <span>Publish</span>
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
