
import { Undo2, Redo2, Paintbrush, Eye, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Toolbar = () => {
  return (
    <div className="bg-white border-b border-border flex items-center justify-between p-2 px-4">
      <div className="flex items-center">
        <div className="font-semibold mr-8">Page Builder</div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="toolbar-button">
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
                <Button variant="ghost" size="icon" className="toolbar-button">
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
                <Button variant="ghost" size="icon" className="toolbar-button">
                  <Paintbrush size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Styles</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="toolbar-button">
                  <Eye size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="toolbar-button text-red-500">
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
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye size={16} />
                <span>Preview</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview Changes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button size="sm" className="flex items-center gap-1">
          <Upload size={16} />
          <span>Publish</span>
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
