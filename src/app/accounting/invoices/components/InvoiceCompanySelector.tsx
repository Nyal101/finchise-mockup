import React from "react";

interface InvoiceCompanySelectorProps {
  companies: string[];
  selectedCompanies: string[];
  setSelectedCompanies: (companies: string[]) => void;
}

export const InvoiceCompanySelector: React.FC<InvoiceCompanySelectorProps> = ({
  companies,
  selectedCompanies,
  setSelectedCompanies,
}) => {
  const [search, setSearch] = React.useState("");

  const filteredCompanies = companies.filter((company) =>
    company.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const allSelected = selectedCompanies.length === companies.length;
  const handleAllInvoices = () => {
    if (allSelected) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies([...companies]);
    }
  };

  return (
    <div className="border rounded-lg bg-white h-full flex flex-col shadow-sm w-full max-w-full">
      <div className="p-4 border-b">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="w-full px-3 py-2 border rounded focus:outline-none mb-3"
        />
        <button
          className={`w-full px-3 py-2 rounded text-sm font-medium border ${allSelected ? 'bg-primary text-white' : 'bg-white text-primary'} transition mb-2`}
          onClick={handleAllInvoices}
          type="button"
        >
          All Invoices
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filteredCompanies.length === 0 ? (
          <div className="text-muted-foreground text-center py-4 text-sm">No companies found</div>
        ) : (
          <ul className="space-y-2">
            {filteredCompanies.map((company) => (
              <li key={company} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(company)}
                  onChange={() => toggleCompany(company)}
                  id={`company-${company}`}
                  className="accent-primary"
                />
                <label htmlFor={`company-${company}`}>{company}</label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};