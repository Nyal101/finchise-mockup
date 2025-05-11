"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Supplier {
  name: string;
  contact: string;
  category: string;
}

const initialSuppliers: Supplier[] = [
  { name: "Eden Farms", contact: "eden@farms.com", category: "Produce" },
  { name: "Coca Cola", contact: "support@coca-cola.com", category: "Beverages" },
  { name: "Dominos Partner Group", contact: "partners@dominos.com", category: "Pizza Ingredients" },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [newSupplier, setNewSupplier] = useState<Supplier>({ name: "", contact: "", category: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  };

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact && newSupplier.category) {
      setSuppliers([...suppliers, newSupplier]);
      setNewSupplier({ name: "", contact: "", category: "" });
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Suppliers Management</h1>
      <p className="mb-4 text-muted-foreground max-w-xl">
        Manage the suppliers that provide your stores with food and beverage products. Common suppliers include Eden Farms, Coca Cola, and Dominos Partner Group.
      </p>
      <div className="flex justify-end mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Add Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>Enter supplier details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                name="name"
                placeholder="Supplier Name"
                value={newSupplier.name}
                onChange={handleInputChange}
              />
              <Input
                name="contact"
                placeholder="Contact Email"
                value={newSupplier.contact}
                onChange={handleInputChange}
              />
              <Input
                name="category"
                placeholder="Category (e.g., Beverages, Produce)"
                value={newSupplier.category}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  onClick={() => setNewSupplier({ name: "", contact: "", category: "" })}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={handleAddSupplier}
                  disabled={!(newSupplier.name && newSupplier.contact && newSupplier.category)}
                >
                  Add Supplier
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableCaption>List of suppliers providing goods to your stores.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier, idx) => (
            <TableRow key={idx}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.contact}</TableCell>
              <TableCell>{supplier.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
