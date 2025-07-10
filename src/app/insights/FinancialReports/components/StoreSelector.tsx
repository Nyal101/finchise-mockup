/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const newSelection = selectedStoreIds.includes(storeId)
      ? selectedStoreIds.filter(id => id !== storeId)
      : [...selectedStoreIds, storeId];
    onSelectionChange(newSelection);
  };

  const handleCompanySelect = (companyId: string) => {
    const companyStores = stores.filter(store => store.companyId === companyId);
    const companyStoreIds = companyStores.map(store => store.id);
    
    const allSelected = companyStoreIds.every(id => selectedStoreIds.includes(id));
    
    if (allSelected) {
      // Remove all company stores
      const newSelection = selectedStoreIds.filter(id => !companyStoreIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      // Add all company stores
      const newSelection = [...new Set([...selectedStoreIds, ...companyStoreIds])];
      onSelectionChange(newSelection);
    }
  };

  const handleStoreGroupSelect = (groupId: string) => {
    const group = storeGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const allSelected = group.storeIds.every(id => selectedStoreIds.includes(id));
    
    if (allSelected) {
      // Remove all group stores
      const newSelection = selectedStoreIds.filter(id => !group.storeIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      // Add all group stores
      const newSelection = [...new Set([...selectedStoreIds, ...group.storeIds])];
      onSelectionChange(newSelection);
    }
  };

  const handleCompanyGroupSelect = (groupId: string) => {
    const group = companyGroups.find(g => g.id === groupId);
    if (!group) return;
    
    const groupStoreIds = stores
      .filter(store => group.companyIds.includes(store.companyId))
      .map(store => store.id);
    
    const allSelected = groupStoreIds.every(id => selectedStoreIds.includes(id));
    
    if (allSelected) {
      // Remove all group stores
      const newSelection = selectedStoreIds.filter(id => !groupStoreIds.includes(id));
      onSelectionChange(newSelection);
    } else {
      // Add all group stores
      const newSelection = [...new Set([...selectedStoreIds, ...groupStoreIds])];
      onSelectionChange(newSelection);
    }
  };

  const handleSelectAll = () => {
    if (selectedStoreIds.length === stores.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(stores.map(store => store.id));
    }
  };

  const handleClearSelection = () => {
    onSelectionChange([]);
  };

  // Get selected store names for display
  const selectedStoreNames = stores
    .filter(store => selectedStoreIds.includes(store.id))
    .map(store => store.name);

  const getDisplayText = () => {
    if (selectedStoreIds.length === 0) return "All Stores";
    if (selectedStoreIds.length === stores.length) return "All Stores";
    if (selectedStoreIds.length === 1) return selectedStoreNames[0];
    return `${selectedStoreIds.length} stores selected`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors ${className}`}
        >
          <Building2 className="h-4 w-4 mr-2" />
          {getDisplayText()}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <div className="border-b bg-slate-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Store Selection</h3>
              {searchTerm && (
                <p className="text-xs text-slate-600 mt-1">
                  {totalSearchResults} result{totalSearchResults !== 1 ? 's' : ''} found for &quot;{searchTerm}&quot;
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-7 text-xs px-3"
              >
                {selectedStoreIds.length === stores.length ? "Clear All" : "Select All"}
              </Button>
              {selectedStoreIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-7 text-xs text-red-600 hover:text-red-700 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-lg p-1">
              <TabsTrigger value="stores" className="text-xs flex items-center gap-1 px-2 py-1.5">
                <Store className="h-3 w-3" />
                <span>Stores</span>
                {searchTerm && globalSearchResults.stores.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs h-4 min-w-[16px]">
                    {globalSearchResults.stores.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="companies" className="text-xs flex items-center gap-1 px-2 py-1.5">
                <Building className="h-3 w-3" />
                <span>Companies</span>
                {searchTerm && globalSearchResults.companies.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs h-4 min-w-[16px]">
                    {globalSearchResults.companies.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="store-groups" className="text-xs flex items-center gap-1 px-2 py-1.5">
                <MapPin className="h-3 w-3" />
                <span className="hidden sm:inline">Store Groups</span>
                <span className="sm:hidden">Groups</span>
                {searchTerm && globalSearchResults.storeGroups.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs h-4 min-w-[16px]">
                    {globalSearchResults.storeGroups.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="company-groups" className="text-xs flex items-center gap-1 px-2 py-1.5">
                <Layers className="h-3 w-3" />
                <span className="hidden sm:inline">Company Groups</span>
                <span className="sm:hidden">Co. Groups</span>
                {searchTerm && globalSearchResults.companyGroups.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs h-4 min-w-[16px]">
                    {globalSearchResults.companyGroups.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search across all stores, companies, and groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {selectedStoreIds.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-slate-600 mb-2">
                {selectedStoreIds.length} store{selectedStoreIds.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {selectedStoreNames.slice(0, 10).map((name, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {name}
                  </Badge>
                ))}
                {selectedStoreNames.length > 10 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedStoreNames.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          <div className="px-2 pb-2">
            <TabsContent value="stores" className="mt-0">
              <ScrollArea className="h-72">
                <div className="space-y-1 p-2">
                  {filteredStores.map((store) => (
                    <div
                      key={store.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedStoreIds.includes(store.id)}
                        onCheckedChange={() => handleStoreToggle(store.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: companies.find(c => c.id === store.companyId)?.color }}
                          />
                          <span className="font-medium text-sm">{store.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {store.companyName} • {store.postCode}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredStores.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Store className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No stores found</p>
                      {searchTerm && (
                        <p className="text-xs mt-1">Try adjusting your search terms</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="companies" className="mt-0">
              <ScrollArea className="h-72">
                <div className="space-y-1 p-2">
                  {filteredCompanies.map((company) => {
                    const companyStores = stores.filter(store => store.companyId === company.id);
                    const companyStoreIds = companyStores.map(store => store.id);
                    const allSelected = companyStoreIds.every(id => selectedStoreIds.includes(id));
                    const someSelected = companyStoreIds.some(id => selectedStoreIds.includes(id));
                    
                    return (
                                             <div
                         key={company.id}
                         className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                         onClick={() => handleCompanySelect(company.id)}
                       >
                         <Checkbox
                           checked={allSelected}
                           ref={el => { if (el) (el as any).indeterminate = someSelected && !allSelected; }}
                         />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: company.color }}
                            />
                            <span className="font-medium text-sm">{company.name}</span>
                            {company.isConnectedToXero && (
                              <Badge variant="outline" className="text-xs">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {company.storeCount} stores
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredCompanies.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Building className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No companies found</p>
                      {searchTerm && (
                        <p className="text-xs mt-1">Try adjusting your search terms</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="store-groups" className="mt-0">
              <ScrollArea className="h-72">
                <div className="space-y-1 p-2">
                  {filteredStoreGroups.map((group) => {
                    const allSelected = group.storeIds.every(id => selectedStoreIds.includes(id));
                    const someSelected = group.storeIds.some(id => selectedStoreIds.includes(id));
                    
                    return (
                                             <div
                         key={group.id}
                         className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                         onClick={() => handleStoreGroupSelect(group.id)}
                       >
                         <Checkbox
                           checked={allSelected}
                           ref={el => { if (el) (el as any).indeterminate = someSelected && !allSelected; }}
                         />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: group.color }}
                            />
                            <span className="font-medium text-sm">{group.name}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {group.description} • {group.storeIds.length} stores
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredStoreGroups.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No store groups found</p>
                      {searchTerm && (
                        <p className="text-xs mt-1">Try adjusting your search terms</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="company-groups" className="mt-0">
              <ScrollArea className="h-72">
                <div className="space-y-1 p-2">
                  {filteredCompanyGroups.map((group) => {
                    const groupStoreIds = stores
                      .filter(store => group.companyIds.includes(store.companyId))
                      .map(store => store.id);
                    const allSelected = groupStoreIds.every(id => selectedStoreIds.includes(id));
                    const someSelected = groupStoreIds.some(id => selectedStoreIds.includes(id));
                    
                    return (
                                             <div
                         key={group.id}
                         className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                         onClick={() => handleCompanyGroupSelect(group.id)}
                       >
                         <Checkbox
                           checked={allSelected}
                           ref={el => { if (el) (el as any).indeterminate = someSelected && !allSelected; }}
                         />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: group.color }}
                            />
                            <span className="font-medium text-sm">{group.name}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {group.description} • {group.companyIds.length} companies
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredCompanyGroups.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <Layers className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium">No company groups found</p>
                      {searchTerm && (
                        <p className="text-xs mt-1">Try adjusting your search terms</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
