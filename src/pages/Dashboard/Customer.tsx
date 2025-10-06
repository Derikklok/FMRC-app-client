
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
  IconPlus, 
  IconSearch, 
  IconBuilding, 
  IconPhone, 
  IconMapPin,
  IconEdit,
  IconTrash
} from "@tabler/icons-react"
import { useState } from "react"

// Sample customer data - you'll replace this with actual API calls
const sampleCustomers = [
  {
    id: 1,
    customerId: "CUST-001",
    companyName: "ABC Forklift Services",
    address: "123 Industrial Ave, Manufacturing District, City 12345",
    contactNo: "+1-555-0123",
    status: "Active"
  },
  {
    id: 2,
    customerId: "CUST-002", 
    companyName: "XYZ Warehouse Solutions",
    address: "456 Logistics Blvd, Warehouse District, City 67890",
    contactNo: "+1-555-0456",
    status: "Active"
  },
  {
    id: 3,
    customerId: "CUST-003",
    companyName: "Heavy Machinery Corp",
    address: "789 Equipment St, Industrial Zone, City 11111",
    contactNo: "+1-555-0789",
    status: "Inactive"
  }
]

const CustomerStats = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
        <IconBuilding className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">156</div>
        <p className="text-xs text-muted-foreground">+12% from last month</p>
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

const CustomerList = ({ customers, searchTerm }: { customers: typeof sampleCustomers, searchTerm: string }) => {
  const filteredCustomers = customers.filter(customer =>
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {filteredCustomers.map((customer) => (
        <Card key={customer.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{customer.companyName}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    customer.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.status}
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
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <IconEdit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
  const [searchTerm, setSearchTerm] = useState("")

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
                  <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="px-4 lg:px-6">
                <CustomerStats />
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
                        <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Button variant="outline">Filter</Button>
                    </div>
                    
                    <CustomerList customers={sampleCustomers} searchTerm={searchTerm} />
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Customer