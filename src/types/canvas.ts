
export interface DroppedComponent {
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
