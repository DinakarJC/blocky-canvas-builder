
import React from "react";
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

export interface ComponentIconProps {
  type: string;
}

export const ComponentIcon = ({ type }: ComponentIconProps) => {
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

export default ComponentIcon;
