import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomerForm from './CustomerForm';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "@/types/customer";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  onSubmit: (data: CreateCustomerRequest | UpdateCustomerRequest) => Promise<void>;
  isLoading?: boolean;
}

const CustomerDialog = ({ 
  open, 
  onOpenChange, 
  customer, 
  onSubmit, 
  isLoading 
}: CustomerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
          <DialogDescription>
            {customer
              ? 'Update the customer information below.'
              : 'Fill in the details to add a new customer to your system.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <CustomerForm
          customer={customer}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;