import {create} from "zustand";

const useUIStore = create((set) => ({
  paymentModalOpen: false,
  selectedInvoice: null,
  openPaymentModal: (invoice) => set({ paymentModalOpen: true, selectedInvoice: invoice }),
  closePaymentModal: () => set({ paymentModalOpen: false, selectedInvoice: null })
}));

export default useUIStore;
