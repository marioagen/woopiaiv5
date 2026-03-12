import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronsRight, 
  ChevronsLeft,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

interface DualListItem {
  id: number;
  text: string;
  subtitle?: string;
}

interface DualListSelectorProps {
  availableItems: DualListItem[];
  selectedItems: DualListItem[];
  onSelectionChange: (selectedItems: DualListItem[]) => void;
  availableTitle?: string;
  selectedTitle?: string;
  height?: string;
  searchPlaceholder?: string;
  availableActionButton?: React.ReactNode;
  summaryActionButton?: React.ReactNode;
}

export function DualListSelector({
  availableItems,
  selectedItems,
  onSelectionChange,
  availableTitle = "Itens Disponíveis",
  selectedTitle = "Itens Selecionados",
  height = "300px",
  searchPlaceholder = "Buscar...",
  availableActionButton,
  summaryActionButton
}: DualListSelectorProps) {
  // State for selections in each list
  const [selectedAvailable, setSelectedAvailable] = useState<number[]>([]);
  const [selectedInList, setSelectedInList] = useState<number[]>([]);
  
  // Search states
  const [availableSearch, setAvailableSearch] = useState('');
  const [selectedSearch, setSelectedSearch] = useState('');
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState<DualListItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Clear selections and searches when props change dramatically
  useEffect(() => {
    setSelectedAvailable([]);
    setSelectedInList([]);
    setAvailableSearch('');
    setSelectedSearch('');
  }, [availableItems.length, selectedItems.length]);

  // Filter available items (exclude already selected ones)
  const filteredAvailableItems = availableItems
    .filter(item => !selectedItems.some(selected => selected.id === item.id))
    .filter(item => item.text.toLowerCase().includes(availableSearch.toLowerCase()));

  // Filter selected items
  const filteredSelectedItems = selectedItems
    .filter(item => item.text.toLowerCase().includes(selectedSearch.toLowerCase()));

  // Handle selection in available list
  const handleAvailableSelect = (itemId: number, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedAvailable(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setSelectedAvailable([itemId]);
    }
  };

  // Handle selection in selected list
  const handleSelectedSelect = (itemId: number, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedInList(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setSelectedInList([itemId]);
    }
  };

  // Move items from available to selected
  const moveToSelected = () => {
    const itemsToMove = availableItems.filter(item => selectedAvailable.includes(item.id));
    const newSelectedItems = [...selectedItems, ...itemsToMove];
    onSelectionChange(newSelectedItems);
    setSelectedAvailable([]);
  };

  // Move items from selected to available
  const moveToAvailable = () => {
    const newSelectedItems = selectedItems.filter(item => !selectedInList.includes(item.id));
    onSelectionChange(newSelectedItems);
    setSelectedInList([]);
  };

  // Move all items to selected
  const moveAllToSelected = () => {
    const allAvailable = availableItems.filter(item => !selectedItems.some(selected => selected.id === item.id));
    const newSelectedItems = [...selectedItems, ...allAvailable];
    onSelectionChange(newSelectedItems);
    setSelectedAvailable([]);
  };

  // Move all items to available
  const moveAllToAvailable = () => {
    onSelectionChange([]);
    setSelectedInList([]);
  };

  // Move item up in selected list
  const moveUp = () => {
    if (selectedInList.length !== 1) return;
    
    const itemId = selectedInList[0];
    const currentIndex = selectedItems.findIndex(item => item.id === itemId);
    
    if (currentIndex > 0) {
      const newItems = [...selectedItems];
      [newItems[currentIndex - 1], newItems[currentIndex]] = [newItems[currentIndex], newItems[currentIndex - 1]];
      onSelectionChange(newItems);
    }
  };

  // Move item down in selected list
  const moveDown = () => {
    if (selectedInList.length !== 1) return;
    
    const itemId = selectedInList[0];
    const currentIndex = selectedItems.findIndex(item => item.id === itemId);
    
    if (currentIndex < selectedItems.length - 1) {
      const newItems = [...selectedItems];
      [newItems[currentIndex], newItems[currentIndex + 1]] = [newItems[currentIndex + 1], newItems[currentIndex]];
      onSelectionChange(newItems);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (item: DualListItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (event: React.DragEvent, targetIndex: number) => {
    event.preventDefault();
    
    if (!draggedItem) return;
    
    const sourceIndex = selectedItems.findIndex(item => item.id === draggedItem.id);
    
    if (sourceIndex === -1) return;
    
    const newItems = [...selectedItems];
    const [movedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);
    
    onSelectionChange(newItems);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4" style={{ height }}>
        {/* Available Items */}
        <div className="col-span-5 space-y-2">
          <Label className="text-sm font-medium">{availableTitle}</Label>
          <Input
            placeholder={searchPlaceholder}
            value={availableSearch}
            onChange={(e) => setAvailableSearch(e.target.value)}
            className="h-8 border-woopi-ai-border focus:border-woopi-ai-blue"
          />
          {availableActionButton && (
            <div className="pt-1">
              {availableActionButton}
            </div>
          )}
          <div className="border border-woopi-ai-border rounded-md bg-white dark:bg-[#292f4c]">
            <ScrollArea className="h-60">
              <div className="p-2 space-y-1">
                {filteredAvailableItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded cursor-pointer text-sm border transition-colors ${
                      selectedAvailable.includes(item.id)
                        ? 'bg-woopi-ai-blue text-white border-woopi-ai-blue'
                        : 'hover:bg-woopi-ai-light-gray border-transparent'
                    }`}
                    onClick={(e) => handleAvailableSelect(item.id, e)}
                  >
                    <div className="font-medium truncate">{item.text}</div>
                    {item.subtitle && (
                      <div className={`text-xs truncate ${
                        selectedAvailable.includes(item.id) ? 'text-white/80' : 'text-woopi-ai-gray'
                      }`}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                ))}
                {filteredAvailableItems.length === 0 && (
                  <div className="p-4 text-center text-woopi-ai-gray text-sm">
                    Nenhum item disponível
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="col-span-2 flex flex-col items-center justify-center space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={moveToSelected}
            disabled={selectedAvailable.length === 0}
            className="w-full h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={moveToAvailable}
            disabled={selectedInList.length === 0}
            className="w-full h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={moveAllToSelected}
            disabled={filteredAvailableItems.length === 0}
            className="w-full h-8"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={moveAllToAvailable}
            disabled={selectedItems.length === 0}
            className="w-full h-8"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          
          <div className="w-full border-t border-woopi-ai-border my-2"></div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={moveUp}
            disabled={selectedInList.length !== 1 || selectedItems.findIndex(item => item.id === selectedInList[0]) === 0}
            className="w-full h-8"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={moveDown}
            disabled={selectedInList.length !== 1 || selectedItems.findIndex(item => item.id === selectedInList[0]) === selectedItems.length - 1}
            className="w-full h-8"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Items */}
        <div className="col-span-5 space-y-2">
          <Label className="text-sm font-medium">{selectedTitle}</Label>
          <Input
            placeholder={searchPlaceholder}
            value={selectedSearch}
            onChange={(e) => setSelectedSearch(e.target.value)}
            className="h-8 border-woopi-ai-border focus:border-woopi-ai-blue"
          />
          <div className="border border-woopi-ai-border rounded-md bg-white dark:bg-[#292f4c]">
            <ScrollArea className="h-60">
              <div className="p-2 space-y-1">
                {filteredSelectedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded cursor-pointer text-sm border transition-colors flex items-center gap-2 ${
                      selectedInList.includes(item.id)
                        ? 'bg-woopi-ai-blue text-white border-woopi-ai-blue'
                        : 'hover:bg-woopi-ai-light-gray border-transparent'
                    } ${dragOverIndex === index ? 'border-t-2 border-t-woopi-ai-blue' : ''}`}
                    onClick={(e) => handleSelectedSelect(item.id, e)}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <GripVertical className={`w-3 h-3 flex-shrink-0 ${
                      selectedInList.includes(item.id) ? 'text-white/60' : 'text-woopi-ai-gray'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.text}</div>
                      {item.subtitle && (
                        <div className={`text-xs truncate ${
                          selectedInList.includes(item.id) ? 'text-white/80' : 'text-woopi-ai-gray'
                        }`}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredSelectedItems.length === 0 && (
                  <div className="p-4 text-center text-woopi-ai-gray text-sm">
                    Nenhum item selecionado
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      
      {/* Summary with optional action button */}
      <div className="space-y-2">
        {summaryActionButton && (
          <div className="flex justify-start">
            {summaryActionButton}
          </div>
        )}
        <div className="text-sm text-woopi-ai-gray">
          {selectedItems.length} item(s) selecionado(s)
        </div>
      </div>
    </div>
  );
}