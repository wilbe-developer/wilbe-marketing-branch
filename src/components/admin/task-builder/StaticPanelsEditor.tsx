
import React from "react";
import { StaticPanel, StaticPanelItem, Condition } from "@/types/task-builder";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ConditionsEditor from "./ConditionsEditor";

interface StaticPanelsEditorProps {
  staticPanels: StaticPanel[];
  onChange: (staticPanels: StaticPanel[]) => void;
}

const StaticPanelsEditor: React.FC<StaticPanelsEditorProps> = ({
  staticPanels,
  onChange,
}) => {
  const handleAddPanel = () => {
    const newPanel: StaticPanel = {
      id: uuidv4(),
      title: "New Panel",
      items: [
        {
          text: "Panel item 1",
          order: 1,
        },
      ],
    };
    
    onChange([...staticPanels, newPanel]);
  };

  const handleDeletePanel = (index: number) => {
    const newPanels = staticPanels.filter((_, i) => i !== index);
    onChange(newPanels);
  };

  const handlePanelChange = (
    index: number,
    field: keyof StaticPanel,
    value: string | Condition[]
  ) => {
    const newPanels = [...staticPanels];
    
    if (field === "conditions") {
      newPanels[index].conditions = value as Condition[];
    } else if (field === "title") {
      newPanels[index].title = value as string;
    }
    
    onChange(newPanels);
  };

  const handleAddItem = (panelIndex: number) => {
    const newPanels = [...staticPanels];
    const currentItems = newPanels[panelIndex].items || [];
    newPanels[panelIndex].items = [
      ...currentItems,
      {
        text: "New item",
        order: currentItems.length + 1,
      },
    ];
    
    onChange(newPanels);
  };

  const handleItemChange = (
    panelIndex: number,
    itemIndex: number,
    field: keyof StaticPanelItem,
    value: string | number
  ) => {
    const newPanels = [...staticPanels];
    if (field === "text" || field === "order") {
      newPanels[panelIndex].items[itemIndex][field] = value as any;
    }
    onChange(newPanels);
  };

  const handleDeleteItem = (panelIndex: number, itemIndex: number) => {
    const newPanels = [...staticPanels];
    newPanels[panelIndex].items = newPanels[panelIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    
    onChange(newPanels);
  };

  if (staticPanels.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No static panels
        </h3>
        <p className="text-gray-500 mb-4">
          Add static panels to display additional information or context
        </p>
        <Button onClick={handleAddPanel}>
          <Plus size={16} className="mr-2" />
          Add Static Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Static Panels</h3>
        <Button onClick={handleAddPanel} size="sm">
          <Plus size={16} className="mr-2" />
          Add Panel
        </Button>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {staticPanels.map((panel, panelIndex) => (
          <AccordionItem
            key={panelIndex}
            value={`panel-${panelIndex}`}
            className="border rounded-md"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex-1 text-left">
                {panel.title || `Panel ${panelIndex + 1}`}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`panel-title-${panelIndex}`}>Panel Title</Label>
                <Input
                  id={`panel-title-${panelIndex}`}
                  value={panel.title}
                  onChange={(e) =>
                    handlePanelChange(panelIndex, "title", e.target.value)
                  }
                  placeholder="Panel title"
                />
              </div>

              <div className="pt-2">
                <ConditionsEditor
                  conditions={panel.conditions || []}
                  onChange={(conditions) =>
                    handlePanelChange(panelIndex, "conditions", conditions)
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Panel Items</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(panelIndex)}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Item
                  </Button>
                </div>

                {panel.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-3 border rounded-md space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`item-text-${panelIndex}-${itemIndex}`}>
                        Item Text
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(panelIndex, itemIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <Textarea
                      id={`item-text-${panelIndex}-${itemIndex}`}
                      value={item.text}
                      onChange={(e) =>
                        handleItemChange(
                          panelIndex,
                          itemIndex,
                          "text",
                          e.target.value
                        )
                      }
                      placeholder="Item text"
                      rows={2}
                    />
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor={`item-order-${panelIndex}-${itemIndex}`}
                        className="whitespace-nowrap"
                      >
                        Display Order
                      </Label>
                      <Input
                        id={`item-order-${panelIndex}-${itemIndex}`}
                        type="number"
                        value={item.order || itemIndex + 1}
                        onChange={(e) =>
                          handleItemChange(
                            panelIndex,
                            itemIndex,
                            "order",
                            parseInt(e.target.value) || itemIndex + 1
                          )
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePanel(panelIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove Panel
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default StaticPanelsEditor;
