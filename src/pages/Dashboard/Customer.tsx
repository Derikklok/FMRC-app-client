
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  IconPlus, 
  IconSearch, 
  IconBuilding, 
  IconPhone, 
  IconMapPin,
  IconEdit,
  IconTrash,
  IconUser,
  IconLoader2,
  IconX,
  IconDownload
} from "@tabler/icons-react"
import { useState, useEffect } from "react"

// Customer interface matching API response
interface Customer {
  id: number;
  customerId: string;
  companyName: string;
  address: string;
  contactNo: string;
  userId: number;
  username: string;
}

interface CustomerResponse {
  customers: Customer[];
  total: number;
}

// API function to fetch customers with optional search
const fetchCustomers = async (searchTerm?: string): Promise<CustomerResponse> => {
  try {
    const baseUrl = import.meta.env.VITE_API_SERVER || 'https://fmrc-app-server-nestjs.vercel.app';
    const url = searchTerm 
      ? `${baseUrl}/customers?search=${encodeURIComponent(searchTerm)}`
      : `${baseUrl}/customers`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// API function to update customer
const updateCustomer = async (id: number, customerData: Partial<Customer>): Promise<Customer> => {
  try {
    const baseUrl = import.meta.env.VITE_API_SERVER || 'https://fmrc-app-server-nestjs.vercel.app';
    const response = await fetch(`${baseUrl}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// API function to create customer
const createCustomer = async (customerData: {
  customerId: string;
  companyName: string;
  address: string;
  contactNo: string;
  userId: number;
}): Promise<Customer> => {
  try {
    const baseUrl = import.meta.env.VITE_API_SERVER || 'https://fmrc-app-server-nestjs.vercel.app';
    const response = await fetch(`${baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// API function to delete customer
const deleteCustomer = async (id: number): Promise<void> => {
  try {
    const baseUrl = import.meta.env.VITE_API_SERVER || 'https://fmrc-app-server-nestjs.vercel.app';
    const response = await fetch(`${baseUrl}/customers/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Function to export customers to CSV
const exportToCSV = (customers: Customer[]) => {
  if (customers.length === 0) {
    alert('No customers to export');
    return;
  }

  // CSV headers
  const headers = [
    'Customer ID',
    'Company Name', 
    'Address',
    'Contact Number',
    'Added By (Username)',
    'User ID'
  ];

  // Convert customers to CSV rows
  const csvRows = [
    headers.join(','),
    ...customers.map(customer => [
      `"${customer.customerId}"`,
      `"${customer.companyName}"`,
      `"${customer.address}"`,
      `"${customer.contactNo}"`,
      `"${customer.username}"`,
      customer.userId.toString()
    ].join(','))
  ];

  // Create CSV content
  const csvContent = csvRows.join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const CustomerStats = ({ total, isLoading }: { total: number; isLoading: boolean }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
        <IconBuilding className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <IconLoader2 className="h-6 w-6 animate-spin" />
          ) : (
            total
          )}
        </div>
        <p className="text-xs text-muted-foreground">Active customers</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
        <IconBuilding className="h-4 w-4 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">142</div>
        <p className="text-xs text-muted-foreground">91% active rate</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">New This Month</CardTitle>
        <IconPlus className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">23</div>
        <p className="text-xs text-muted-foreground">+18% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Regions Served</CardTitle>
        <IconMapPin className="h-4 w-4 text-purple-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">8</div>
        <p className="text-xs text-muted-foreground">Across 3 states</p>
      </CardContent>
    </Card>
  </div>
)

const CustomerList = ({ customers, searchTerm, isLoading, onEdit, onDelete }: { 
  customers: Customer[], 
  searchTerm: string, 
  isLoading: boolean,
  onEdit: (customer: Customer) => void,
  onDelete: (customer: Customer) => void
}) => {
  // Server-side filtering is now handled by the API
  const filteredCustomers = customers

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredCustomers.length === 0) {
    return (
      <div className="text-center py-8">
        <IconBuilding className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No customers found</h3>
        <p className="text-muted-foreground">
          {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first customer'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredCustomers.map((customer) => (
        <Card key={customer.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{customer.companyName}</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Customer ID: {customer.customerId}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IconMapPin className="h-4 w-4" />
                    {customer.address}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <IconPhone className="h-4 w-4" />
                  {customer.contactNo}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <IconUser className="h-4 w-4" />
                  Added by: {customer.username}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(customer)}
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDelete(customer)}
                >
                  <IconTrash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit dialog states
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({
    customerId: "",
    companyName: "",
    address: "",
    contactNo: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Delete dialog states
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Add customer dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    customerId: "",
    companyName: "",
    address: "",
    contactNo: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  // Function to load customers with optional search
  const loadCustomers = async (search?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCustomers(search);
      setCustomers(data.customers);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        loadCustomers(searchTerm.trim());
      } else {
        loadCustomers();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditForm({
      customerId: customer.customerId,
      companyName: customer.companyName,
      address: customer.address,
      contactNo: customer.contactNo
    });
  };

  // Handle update customer
  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;
    
    setIsUpdating(true);
    try {
      await updateCustomer(editingCustomer.id, editForm);
      setEditingCustomer(null);
      await loadCustomers(searchTerm || undefined);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update customer');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;
    
    setIsDeleting(true);
    try {
      await deleteCustomer(deletingCustomer.id);
      setDeletingCustomer(null);
      await loadCustomers(searchTerm || undefined);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete customer');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle add customer
  const handleAddCustomer = async () => {
    // Get current user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    let userId = 1; // Default fallback
    
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        userId = parsedUser.id || 1;
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    
    setIsCreating(true);
    try {
      await createCustomer({
        ...addForm,
        userId
      });
      setIsAddDialogOpen(false);
      setAddForm({
        customerId: "",
        companyName: "",
        address: "",
        contactNo: ""
      });
      await loadCustomers(searchTerm || undefined);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    exportToCSV(customers);
  };

  // Show error state
  if (error) {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Customers</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              
              {/* Header Section */}
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground">
                      Manage your forklift and machinery service customers
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleExportCSV}
                      disabled={customers.length === 0 || isLoading}
                    >
                      <IconDownload className="mr-2 h-4 w-4" />
                      Export to CSV
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <IconPlus className="mr-2 h-4 w-4" />
                      Add Customer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="px-4 lg:px-6">
                <CustomerStats total={total} isLoading={isLoading} />
              </div>

              {/* Search and Filter Section */}
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Directory</CardTitle>
                    <CardDescription>
                      Search and manage your customer database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="relative flex-1">
                        {isLoading && searchTerm ? (
                          <IconLoader2 className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
                        ) : (
                          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        )}
                        <Input
                          placeholder="Search by company name, customer ID, or address..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("");
                          loadCustomers();
                        }}
                        disabled={!searchTerm && !isLoading}
                      >
                        {searchTerm ? "Clear" : "Refresh"}
                      </Button>
                    </div>
                    
                    <CustomerList 
                      customers={customers} 
                      searchTerm={searchTerm} 
                      isLoading={isLoading}
                      onEdit={handleEditCustomer}
                      onDelete={setDeletingCustomer}
                    />
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
      
      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-w-[90vw]">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl font-semibold">Add New Customer</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Enter the new customer information below to add them to your database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-customerId" className="text-sm font-medium">
                Customer ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-customerId"
                value={addForm.customerId}
                onChange={(e) => setAddForm({ ...addForm, customerId: e.target.value })}
                placeholder="Enter customer ID (e.g., CUST-001)"
                className="h-11 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-companyName" className="text-sm font-medium">
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-companyName"
                value={addForm.companyName}
                onChange={(e) => setAddForm({ ...addForm, companyName: e.target.value })}
                placeholder="Enter company name"
                className="h-11 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-address" className="text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-address"
                value={addForm.address}
                onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                placeholder="Enter complete address"
                className="h-11 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-contactNo" className="text-sm font-medium">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-contactNo"
                value={addForm.contactNo}
                onChange={(e) => setAddForm({ ...addForm, contactNo: e.target.value })}
                placeholder="Enter contact number (e.g., +1-555-0123)"
                className="h-11 text-base"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setAddForm({
                  customerId: "",
                  companyName: "",
                  address: "",
                  contactNo: ""
                });
              }}
              disabled={isCreating}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              disabled={isCreating || !addForm.customerId || !addForm.companyName || !addForm.address || !addForm.contactNo}
              className="h-11 px-6"
            >
              {isCreating ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Customer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={editingCustomer !== null} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                value={editForm.customerId}
                onChange={(e) => setEditForm({ ...editForm, customerId: e.target.value })}
                placeholder="Enter customer ID"
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={editForm.companyName}
                onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            <div>
              <Label htmlFor="contactNo">Contact Number</Label>
              <Input
                id="contactNo"
                value={editForm.contactNo}
                onChange={(e) => setEditForm({ ...editForm, contactNo: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingCustomer(null)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCustomer}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Customer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingCustomer !== null} onOpenChange={() => setDeletingCustomer(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingCustomer && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">{deletingCustomer.companyName}</h4>
              <p className="text-sm text-muted-foreground">ID: {deletingCustomer.customerId}</p>
              <p className="text-sm text-muted-foreground">{deletingCustomer.address}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingCustomer(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCustomer}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Customer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

export default Customer