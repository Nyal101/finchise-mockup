/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Building2,
  Store,
  Search,
  X,
  ChevronDown,
  MapPin,
  Building,
  Layers
} from "lucide-react";

// Data interfaces
interface Store {
  id: string;
  name: string;
  address: string;
  postCode: string;
  companyName: string;
  companyId: string;
}

interface Company {
  id: string;
  name: string;
  color: string;
  storeCount: number;
  isConnectedToXero: boolean;
}

interface StoreGroup {
  id: string;
  name: string;
  description: string;
  storeIds: string[];
  color: string;
}

interface CompanyGroup {
  id: string;
  name: string;
  description: string;
  companyIds: string[];
  color: string;
}

// Sample data
const stores: Store[] = [
  { id: "28684", name: "SHEERNESS", address: "123 High Street, Sheerness", postCode: "ME121NZ", companyName: "Fans (UK) Limited", companyId: "1" },
  { id: "28260", name: "SITTINGBOURNE", address: "45 Main Road, Sittingbourne", postCode: "ME102GZ", companyName: "Fans (UK) Limited", companyId: "1" },
  { id: "28862", name: "HERNE BAY", address: "78 Beach Avenue, Herne Bay", postCode: "CT65LE", companyName: "Fans (UK) Limited", companyId: "1" },
  { id: "28921", name: "HEATHFIELD", address: "12 Market Street, Heathfield", postCode: "TN218JD", companyName: "J & R Corporation Limited", companyId: "2" },
  { id: "28868", name: "PADDOCK WOOD", address: "34 Station Road, Paddock Wood", postCode: "TN126EZ", companyName: "J & R Corporation Limited", companyId: "2" },
  { id: "29130", name: "SOUTHBOROUGH", address: "56 London Road, Southborough", postCode: "TN48PQ", companyName: "J & R Corporation Limited", companyId: "2" },
  { id: "28115", name: "TUNBRIDGE WELLS", address: "89 High Street, Tunbridge Wells", postCode: "TN11XU", companyName: "J & R Corporation Limited", companyId: "2" },
  { id: "29123", name: "HONOR OAK", address: "23 Honor Oak Park, London", postCode: "SE238LB", companyName: "MDJ Investments Limited", companyId: "3" },
  { id: "28109", name: "ORPINGTON", address: "67 High Street, Orpington", postCode: "BR60ND", companyName: "MDJ Investments Limited", companyId: "3" },
  { id: "28621", name: "ST PAULS CRAY", address: "45 Main Road, St Pauls Cray", postCode: "BR58SL", companyName: "MDJ Investments Limited", companyId: "3" },
  { id: "29200", name: "DARTFORD", address: "12 High Street, Dartford", postCode: "DA12ER", companyName: "Popat Leisure Limited", companyId: "4" },
  { id: "28345", name: "GRAVESEND", address: "78 Milton Road, Gravesend", postCode: "DA121HJ", companyName: "Popat Leisure Limited", companyId: "4" },
  { id: "28456", name: "BEXLEYHEATH", address: "34 Broadway, Bexleyheath", postCode: "DA67JQ", companyName: "DMS1 Limited", companyId: "6" },
  { id: "28567", name: "CANTERBURY", address: "56 High Street, Canterbury", postCode: "CT12BZ", companyName: "DMS1 Limited", companyId: "6" },
  { id: "28678", name: "MAIDSTONE", address: "89 Week Street, Maidstone", postCode: "ME144LY", companyName: "DMS1 Limited", companyId: "6" },
  { id: "28789", name: "CHATHAM", address: "23 Military Road, Chatham", postCode: "ME44UG", companyName: "DMS1 Limited", companyId: "6" },
  { id: "28890", name: "GILLINGHAM", address: "67 High Street, Gillingham", postCode: "ME71BQ", companyName: "DMS1 Limited", companyId: "6" },
  { id: "28901", name: "ROCHESTER", address: "45 High Street, Rochester", postCode: "ME11LX", companyName: "KDG Holdings", companyId: "7" },
  { id: "29012", name: "STROOD", address: "12 High Street, Strood", postCode: "ME21AX", companyName: "KDG Holdings", companyId: "7" },
  { id: "29123", name: "RAINHAM", address: "78 High Street, Rainham", postCode: "ME84DZ", companyName: "KDG Holdings", companyId: "7" }
];

const companies: Company[] = [
  { id: "1", name: "Fans (UK) Limited", color: "#3b82f6", storeCount: 3, isConnectedToXero: true },
  { id: "2", name: "J & R Corporation Limited", color: "#10b981", storeCount: 4, isConnectedToXero: true },
  { id: "3", name: "MDJ Investments Limited", color: "#f59e0b", storeCount: 3, isConnectedToXero: false },
  { id: "4", name: "Popat Leisure Limited", color: "#ef4444", storeCount: 2, isConnectedToXero: true },
  { id: "5", name: "R & D 2 Pizza Limited", color: "#8b5cf6", storeCount: 1, isConnectedToXero: true },
  { id: "6", name: "DMS1 Limited", color: "#06b6d4", storeCount: 5, isConnectedToXero: true },
  { id: "7", name: "KDG Holdings", color: "#84cc16", storeCount: 8, isConnectedToXero: true },
];

const storeGroups: StoreGroup[] = [
  {
    id: "sg-1",
    name: "Kent Stores",
    description: "All stores located in Kent area",
    storeIds: ["28684", "28260", "28862", "28868", "28921", "29130", "28115"],
    color: "#3b82f6"
  },
  {
    id: "sg-2",
    name: "London Area",
    description: "Stores in Greater London area",
    storeIds: ["29123", "28109", "28621"],
    color: "#10b981"
  },
  {
    id: "sg-3",
    name: "High Performance",
    description: "Top performing stores",
    storeIds: ["28115", "29123", "28456", "28901"],
    color: "#f59e0b"
  }
];

const companyGroups: CompanyGroup[] = [
  {
    id: "cg-1",
    name: "London Companies",
    description: "Companies operating in Greater London area",
    companyIds: ["1", "2", "7"],
    color: "#3b82f6"
  },
  {
    id: "cg-2",
    name: "All South Companies",
    description: "Companies operating in Southern England",
    companyIds: ["3", "4", "5"],
    color: "#10b981"
  },
  {
    id: "cg-3",
    name: "Multi-Region Operators",
    description: "Companies with operations across multiple regions",
    companyIds: ["6", "7"],
    color: "#f59e0b"
  }
];

interface StoreSelectorProps {
  selectedStoreIds: string[];
  onSelectionChange: (storeIds: string[]) => void;
  className?: string;
}

export default function StoreSelector({ selectedStoreIds, onSelectionChange, className }: StoreSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("stores");
  
  // Add state to track pending changes
  const [pendingSelection, setPendingSelection] = useState<string[]>(selectedStoreIds);

  // Update pending selection when component receives new props
  React.useEffect(() => {
    setPendingSelection(selectedStoreIds);
  }, [selectedStoreIds]);

  // Global search results across all categories
  const globalSearchResults = useMemo(() => {
    if (!searchTerm) return { stores: [], companies: [], storeGroups: [], companyGroups: [] };
    
    const term = searchTerm.toLowerCase();
    
    return {
      stores: stores.filter(store => 
        store.name.toLowerCase().includes(term) ||
        store.address.toLowerCase().includes(term) ||
        store.companyName.toLowerCase().includes(term) ||
        store.postCode.toLowerCase().includes(term)
      ),
      companies: companies.filter(company => 
        company.name.toLowerCase().includes(term)
      ),
      storeGroups: storeGroups.filter(group => 
        group.name.toLowerCase().includes(term) ||
        group.description.toLowerCase().includes(term)
      ),
      companyGroups: companyGroups.filter(group => 
        group.name.toLowerCase().includes(term) ||
        group.description.toLowerCase().includes(term)
      )
    };
  }, [searchTerm]);

  // Use global search results or show all items
  const filteredStores = searchTerm ? globalSearchResults.stores : stores;
  const filteredCompanies = searchTerm ? globalSearchResults.companies : companies;
  const filteredStoreGroups = searchTerm ? globalSearchResults.storeGroups : storeGroups;
  const filteredCompanyGroups = searchTerm ? globalSearchResults.companyGroups : companyGroups;
  
  // Get total search results count
  const totalSearchResults = searchTerm ? 
    globalSearchResults.stores.length + 
    globalSearchResults.companies.length + 
    globalSearchResults.storeGroups.length + 
    globalSearchResults.companyGroups.length : 0;

  // Auto-switch to tab with most results when searching
  React.useEffect(() => {
    if (searchTerm && totalSearchResults > 0) {
      const results = globalSearchResults;
      const maxResults = Math.max(
        results.stores.length,
        results.companies.length,
        results.storeGroups.length,
        results.companyGroups.length
      );
      
      if (results.stores.length === maxResults) {
        setActiveTab("stores");
      } else if (results.companies.length === maxResults) {
        setActiveTab("companies");
      } else if (results.storeGroups.length === maxResults) {
        setActiveTab("store-groups");
      } else if (results.companyGroups.length === maxResults) {
        setActiveTab("company-groups");
      }
    }
  }, [searchTerm, globalSearchResults, totalSearchResults]);

  // Selection handlers
  const handleStoreToggle = (storeId: string) => {
    const newSelection = pendingSelection.includes(storeId)
      ? pendingSelection.filter(id => id !== storeId)
      : [...pendingSelection, storeId];
    setPendingSelection(newSelection);
  };

  const handleCompanySelect = (companyId: string) => {
    const companyStores = stores.filter(store => store.companyId === companyId);
    const companyStoreIds = companyStores.map(store => store.id);
    
    const allSelected = companyStoreIds.every(id => pendingSelection.includes(id));
    
    if (allSelected) {
      // Remove all company stores
      const newSelection = pendingSelection.filter(id => !companyStoreIds.includes(id));
      setPendingSelection(newSelection);
    } else {
      // Add all company stores
      const newSelection = [...new Set([...pendingSelection, ...companyStoreIds])];
      setPendingSelection(newSelection);
    }
  };

  const handleStoreGroupSelect = (groupId: string) => {
    const group = storeGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const allSelected = group.storeIds.every(id => pendingSelection.includes(id));
    
    if (allSelected) {
      // Remove all group stores
      const newSelection = pendingSelection.filter(id => !group.storeIds.includes(id));
      setPendingSelection(newSelection);
    } else {
      // Add all group stores
      const newSelection = [...new Set([...pendingSelection, ...group.storeIds])];
      setPendingSelection(newSelection);
    }
  };

  const handleCompanyGroupSelect = (groupId: string) => {
    const group = companyGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const groupStoreIds = stores
      .filter(store => group.companyIds.includes(store.companyId))
      .map(store => store.id);
    
    const allSelected = groupStoreIds.every(id => pendingSelection.includes(id));
    
    if (allSelected) {
      // Remove all group stores
      const newSelection = pendingSelection.filter(id => !groupStoreIds.includes(id));
      setPendingSelection(newSelection);
    } else {
      // Add all group stores
      const newSelection = [...new Set([...pendingSelection, ...groupStoreIds])];
      setPendingSelection(newSelection);
    }
  };

  const handleSelectAll = () => {
    if (pendingSelection.length === stores.length) {
      setPendingSelection([]);
    } else {
      setPendingSelection(stores.map(store => store.id));
    }
  };

  const handleClearSelection = () => {
    setPendingSelection([]);
  };

  // Add apply and cancel handlers
  const handleApplyChanges = () => {
    onSelectionChange(pendingSelection);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPendingSelection(selectedStoreIds); // Reset to original selection
    setIsOpen(false);
  };

  // Get selected store names for display (use pending selection for display)
  const selectedStoreNames = stores
    .filter(store => pendingSelection.includes(store.id))
    .map(store => store.name);

  const getDisplayText = () => {
    if (selectedStoreIds.length === 0) return "All Stores";
    if (selectedStoreIds.length === stores.length) return "All Stores";
    if (selectedStoreIds.length === 1) return stores.filter(store => selectedStoreIds.includes(store.id))[0]?.name || "All Stores";
    return `${selectedStoreIds.length} stores selected`;
  };

  // Check if there are pending changes
  const hasChanges = JSON.stringify(pendingSelection.sort()) !== JSON.stringify(selectedStoreIds.sort());

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors min-w-[200px] justify-start ${className}`}
        >
          <Building2 className="h-4 w-4 mr-2" />
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[800px] p-0" align="start">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-gray-900">Store & Company Selection</h3>
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                {totalSearchResults} result{totalSearchResults !== 1 ? 's' : ''} found for &quot;{searchTerm}&quot;
              </p>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('stores')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'stores'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Individual Stores
                  {searchTerm && globalSearchResults.stores.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {globalSearchResults.stores.length}
                    </Badge>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'companies'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Companies
                  {searchTerm && globalSearchResults.companies.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {globalSearchResults.companies.length}
                    </Badge>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('store-groups')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'store-groups'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Store Groups
                  {searchTerm && globalSearchResults.storeGroups.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {globalSearchResults.storeGroups.length}
                    </Badge>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('company-groups')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'company-groups'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Company Groups
                  {searchTerm && globalSearchResults.companyGroups.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {globalSearchResults.companyGroups.length}
                    </Badge>
                  )}
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Controls */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search stores, companies, and groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {selectedStoreIds.length === stores.length ? "Clear All" : "Select All"}
                  </Button>
                  {selectedStoreIds.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearSelection}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear Selection
                    </Button>
                  )}
                </div>
                
                {pendingSelection.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {pendingSelection.length} of {stores.length} stores selected
                  </div>
                )}
              </div>
              
              {pendingSelection.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Selected Stores</span>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                    {selectedStoreNames.slice(0, 15).map((name, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        {name}
                      </Badge>
                    ))}
                    {selectedStoreNames.length > 15 && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        +{selectedStoreNames.length - 15} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {activeTab === 'stores' && (
                <div>
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Individual Stores</h4>
                    <p className="text-xs text-gray-600 mt-1">Select specific store locations</p>
                  </div>
                  <ScrollArea className="h-80">
                    <div className="space-y-1 p-4">
                      {filteredStores.map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                          onClick={() => handleStoreToggle(store.id)}
                        >
                          <Checkbox
                            checked={pendingSelection.includes(store.id)}
                            onCheckedChange={() => handleStoreToggle(store.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: companies.find(c => c.id === store.companyId)?.color }}
                              />
                              <span className="font-medium text-sm text-gray-900">{store.name}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <span>{store.companyName}</span>
                              <span>•</span>
                              <span>{store.postCode}</span>
                              <span>•</span>
                              <span className="text-gray-400">{store.address}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredStores.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Store className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-sm font-medium">No stores found</p>
                          {searchTerm && (
                            <p className="text-xs mt-1 text-gray-400">Try adjusting your search terms</p>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {activeTab === 'companies' && (
                <div>
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Companies</h4>
                    <p className="text-xs text-gray-600 mt-1">Select all stores for entire companies</p>
                  </div>
                  <ScrollArea className="h-80">
                    <div className="space-y-1 p-4">
                      {filteredCompanies.map((company) => {
                        const companyStores = stores.filter(store => store.companyId === company.id);
                        const companyStoreIds = companyStores.map(store => store.id);
                        const allSelected = companyStoreIds.every(id => pendingSelection.includes(id));
                        const someSelected = companyStoreIds.some(id => pendingSelection.includes(id));
                        
                        return (
                          <div
                            key={company.id}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                            onClick={() => handleCompanySelect(company.id)}
                          >
                            <Checkbox
                              checked={allSelected}
                              ref={el => { if (el) (el as any).indeterminate = someSelected && !allSelected; }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-200"
                                  style={{ backgroundColor: company.color }}
                                />
                                <span className="font-medium text-sm text-gray-900">{company.name}</span>
                                {company.isConnectedToXero && (
                                  <Badge variant="outline" className="text-xs border-green-300 text-green-700 bg-green-50">
                                    Xero Connected
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {company.storeCount} stores • {someSelected ? `${companyStoreIds.filter(id => pendingSelection.includes(id)).length} selected` : 'None selected'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredCompanies.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-sm font-medium">No companies found</p>
                          {searchTerm && (
                            <p className="text-xs mt-1 text-gray-400">Try adjusting your search terms</p>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {activeTab === 'store-groups' && (
                <div>
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Store Groups</h4>
                    <p className="text-xs text-gray-600 mt-1">Predefined groups of stores by location or performance</p>
                  </div>
                  <ScrollArea className="h-80">
                    <div className="space-y-1 p-4">
                      {filteredStoreGroups.map((group) => {
                        const allSelected = group.storeIds.every(id => pendingSelection.includes(id));
                        const someSelected = group.storeIds.some(id => pendingSelection.includes(id));
                        
                        return (
                          <div
                            key={group.id}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                            onClick={() => handleStoreGroupSelect(group.id)}
                          >
                            <Checkbox
                              checked={allSelected}
                              ref={el => { if (el) (el as any).indeterminate = someSelected && !allSelected; }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-200"
                                  style={{ backgroundColor: group.color }}
                                />
                                <span className="font-medium text-sm text-gray-900">{group.name}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {group.description} • {group.storeIds.length} stores • {someSelected ? `${group.storeIds.filter(id => pendingSelection.includes(id)).length} selected` : 'None selected'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredStoreGroups.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-sm font-medium">No store groups found</p>
                          {searchTerm && (
                            <p className="text-xs mt-1 text-gray-400">Try adjusting your search terms</p>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {activeTab === 'company-groups' && (
                <div>
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">Company Groups</h4>
                    <p className="text-xs text-gray-600 mt-1">Predefined groups of companies by region or operation type</p>
                  </div>
                  <ScrollArea className="h-80">
                    <div className="space-y-1 p-4">
                      {filteredCompanyGroups.map((group) => {
                        const groupStoreIds = stores
                          .filter(store => group.companyIds.includes(store.companyId))
                          .map(store => store.id);
                        const allSelected = groupStoreIds.every(id => pendingSelection.includes(id));
                        const someSelected = groupStoreIds.some(id => pendingSelection.includes(id));
                        
                        return (
                          <div
                            key={group.id}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                            onClick={() => handleCompanyGroupSelect(group.id)}
                          >
                            <Checkbox
                              checked={allSelected}
                              ref={el => { if (el) (el as any).indeterminate = someSelected && !allSelected; }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-200"
                                  style={{ backgroundColor: group.color }}
                                />
                                <span className="font-medium text-sm text-gray-900">{group.name}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {group.description} • {group.companyIds.length} companies • {someSelected ? `${groupStoreIds.filter(id => pendingSelection.includes(id)).length} stores selected` : 'None selected'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {filteredCompanyGroups.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-sm font-medium">No company groups found</p>
                          {searchTerm && (
                            <p className="text-xs mt-1 text-gray-400">Try adjusting your search terms</p>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Changes will be applied to the current report view</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApplyChanges}
                className={`px-6 py-2 ${
                  hasChanges 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } shadow-sm`}
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
