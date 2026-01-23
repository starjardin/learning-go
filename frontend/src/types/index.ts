export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  availableStocks: number;
  isNegotiable: boolean;
  imageLink: string;
  companyId: number | null;
  category: string;
}