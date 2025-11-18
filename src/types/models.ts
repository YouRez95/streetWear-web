export type LoginFormType = {
  email: string;
  password: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super admin";
  imageUrl: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
};

export type UserCreation = {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string | null;
  address?: string | null;
};

export type CreateUserResponse = {
  status: "success" | "failed";
  message: string;
  user?: UserData;
};
export type CreateUserInput = UserCreation & {
  image: ArrayBuffer | null;
  fileName: string | null;
};

export type UpdateUserInput = UserCreation & {
  id: string;
  image: ArrayBuffer | null;
  fileName: string | null;
};

export type StylistData = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  type: "طباع" | "طراز";
  active: boolean;
  createdAt: string;
};

export type CreateStylistInput = Omit<StylistData, "id" | "createdAt">;

export type UpdateStylistInput = Omit<StylistData, "createdAt" | "active">;

export type CreateStylistResponse = {
  status: "success" | "failed";
  message: string;
  stylist?: StylistData;
};

export type FaconnierData = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  active: boolean;
};

export type CreateFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  faconnier?: FaconnierData;
};

export type CreateFaconnierInput = Omit<FaconnierData, "id" | "createdAt">;
export type UpdateFaconnierInput = Omit<FaconnierData, "createdAt">;
export type UpdateFaconnierStatusInput = {
  faconnierId: string;
  status: boolean;
};

export type ClientData = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  active: boolean;
};

export type CreateClientInput = CreateFaconnierInput;
export type UpdateClientInput = UpdateFaconnierInput;

export type CreateClientResponse = {
  status: "success" | "failed";
  message: string;
  client?: ClientData;
};

export type SeasonData = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isClosed: boolean;
};

export type FullSeasonData = SeasonData & {
  summary: {
    type: "down" | "up" | "same" | null;
    percentage: string | null;
  };
  products: {
    totalProducts: number;
    totalClient: number;
    totalStock: number;
  };
};

export type CreateSeasonInput = Omit<
  SeasonData,
  "id" | "createdAt" | "isClosed"
>;
export type CreateSeasonResponse = {
  status: "success" | "failed";
  message: string;
  season?: SeasonData;
};

export type UpdateSeasonInput = Omit<SeasonData, "createdAt">;

export type ProductStatus = {
  raw_in_stock: number;
  quantity_at_faconnier: number;
  quantity_ready: number;
  quantity_with_client: number;
  quantity_returned_client: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  reference: string;
  totalQty: number;
  poids: number;
  metrage: number;
  type: "طبعة" | "طرزة" | "طبعة_طرزة" | null;
  productImage?: string;
  createdAt: string;
  ProductStatus: ProductStatus;
  FaconnierOrderItems: Array<{
    id: string;
    quantity_sent: number;
    quantity_returned: number;
    order_status: "OPEN" | "CLOSED";
    createdAt: string;
    faconnierOrder: {
      createdAt: string;
      faconnier: {
        id: string;
        name: string;
      };
      bon_number: {
        bon_number: number;
        bonStatus: "OPEN" | "CLOSED";
      };
    };
  }>;
  ClientOrdersItems: {
    id: string;
    quantity: number;
    returned: number;
    passagerName: string | null;
    createdAt: string;
    clientOrder: {
      createdAt: Date;
      bon_number: {
        bon_number: number;
        bonStatus: "OPEN" | "CLOSED";
      };
      client: {
        name: string;
        id: string;
      } | null;
    };
  }[];
  StyleTraitOrderItems: Array<{
    id: string;
    quantity_sent: number;
    unit_price: number;
    createdAt: string;
    styleTraitOrder: {
      styleTrait: {
        id: string;
        name: string;
        type: "طباع" | "طراز";
      };
      bon_number: {
        bon_number: number;
        bonStatus: "OPEN" | "CLOSED";
      };
    };
  }>;
};

export type GetProductsParams = {
  page: number;
  limit: number;
  search: string;
  date: string;
  seasonId: string;
};

export type GetProductsResponse = {
  status: "success" | "failed";
  message: string;
  products: Product[];
  currentPage: number;
  totalPages: number;
};

export type ReturnStock = {
  id: string;
  name: string;
  reference: string;
  description: string;
  productImage: string;
  stockInfo: {
    totalReturned: number;
    availableForTransfer: number;
    returnStockId: string;
    returns: {
      client: {
        id: string;
        name: string;
      } | null;
      id: string;
      quantity: number;
      date: string;
      bonNumber: number;
      passagerName: string | null;
    }[];
  };
};

export type GetReturnStockParams = {
  page: number;
  limit: number;
  search: string;
  seasonId: string;
};

export type GetReturnStockResponse = {
  status: "success" | "failed";
  message: string;
  products: ReturnStock[];
  currentPage: number;
  totalPages: number;
};

export type CreateProductInput = Omit<
  Product,
  | "id"
  | "ProductStatus"
  | "productImage"
  | "FaconnierOrderItems"
  | "type"
  | "StyleTraitOrderItems"
  | "FaconnierOrderItems"
  | "ClientOrdersItems"
> & {
  productImage: ArrayBuffer | null;
  fileName: string | null;
  isReady: boolean;
};

export type CreateProductResponse = {
  status: "success" | "failed";
  message: string;
  product?: Product;
};

export type UpdateProductInput = Omit<
  Product,
  | "ProductStatus"
  | "productImage"
  | "FaconnierOrderItems"
  | "type"
  | "StyleTraitOrderItems"
  | "FaconnierOrderItems"
  | "ClientOrdersItems"
> & {
  productImage: ArrayBuffer | null;
  fileName: string | null;
};

export type UpdateProductResponse = {
  status: "success" | "failed";
  message: string;
  product?: Product;
};

export type DeleteProductResponse = {
  status: "success" | "failed";
  message: string;
  product?: Product;
};

export type DeleteClientReturnStockResponse = {
  status: "success" | "failed";
  message: string;
  data: {
    clientId: string;
    bonId: string;
  };
};

export type GetSummaryReturnStockResponse = {
  status: "success" | "failed";
  message: string;
  summary?: {
    total: number;
    available: number;
    used: number;
    clientCount: number;
    topProduct: string | null;
  };
};

export type CreateOrderClientFromReturnStockResponse = {
  status: "success" | "failed";
  message: string;
  data?: {
    clientId: string;
    bonId: string;
  };
};

export type DeleteReturnStockResponse = {
  status: "success" | "failed";
  message: string;
};

export type UpdateClientReturnStockInput = {
  seasonId: string;
  newQuantity: number;
  clientReturnId: string;
};

export type GetActiveFaconniersResponse = {
  status: "success" | "failed";
  message: string;
  faconniers: {
    id: string;
    name: string;
    BonsFaconnier: {
      id: string;
      bon_number: number;
      bonStatus: "OPEN" | "CLOSED";
    }[];
  }[];
};

export type GetActiveStylistsResponse = {
  status: "success" | "failed";
  message: string;
  stylists: {
    id: string;
    name: string;
    type: "طباع" | "طراز";
    BonsStyleTrait: {
      id: string;
      bon_number: number;
      bonStatus: "OPEN" | "CLOSED";
    }[];
  }[];
};

export type GetActiveClientsResponse = {
  status: "success" | "failed";
  message: string;
  clients: {
    id: string;
    name: string;
    BonsClients: {
      id: string;
      bonStatus: "OPEN" | "CLOSED";
      bon_number: number;
    }[];
  }[];
};

export type CreateBonStylistInput = {
  seasonId: string;
  stylistId: string;
};

export type BonStylistData = {
  id: string;
  bon_number: number;
  styleTraitId: string;
  seasonId: string;
  createdAt: string;
};

export type CreateBonStylistResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonStylistData;
};

export type BonFaconnierData = {
  id: string;
  bon_number: number;
  createdAt: string;
  seasonId: string;
  faconnierId: string;
};

export type CreateBonFaconnierInput = {
  seasonId: string;
  faconnierId: string;
};

export type CreateBonFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonFaconnierData;
};

export type CreateBonClientInput = {
  seasonId: string;
  clientId: string;
};

type BonClientData = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  seasonId: string;
  bonStatus: "OPEN" | "CLOSED";
  bon_number: number;
  clientId: string;
};

export type CreateBonClientPassagerInput = {
  seasonId: string;
};

export type CreateBonClientResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonClientData;
};

export type CreateOrderStylistInput = {
  seasonId: string;
  stylistId: string;
  productId: string;
  bon_number: number;
  priceByUnit: number;
  transferQuantity: number;
  date: string;
};

export type GetBonClientPassagerResponse = {
  status: "success" | "failed";
  message: string;
  bons?: {
    id: string;
    createdAt: string;
    bon_number: number;
  }[];
};

export type OrderStylistData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  productId: string;
  quantity_sent: number;
  unit_price: number;
  styleTraitOrderId: string;
};

export type CreateOrderStylistResponse = {
  status: "success" | "failed";
  message: string;
  order?: OrderStylistData;
};

export type CreateOrderFaconnierInput = {
  productId: string;
  bon_number: number;
  seasonId: string;
  faconnierId: string;
  priceByUnit: number;
  transferQuantity: number;
  date: string;
};
export type OrderFaconnierData = {
  id: string;
  faconnierId: string;
  seasonId: string;
  bon_id: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  order?: OrderFaconnierData;
};

export type CreateOrderClientInput = {
  seasonId: string;
  clientId: string | null;
  passagerName: string | null;
  productId: string;
  bon_number: number;
  priceByUnit: number;
  transferQuantity: number;
  date: string;
};

export type CreateMultipleOrdersClientInput = {
  clientId: string;
  bonNumber: number;
  date: string;
  products: {
    productId: string;
    productName: string;
    quantitySent: number;
    priceByUnit: number;
  }[];
};

export type OrderClientData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  seasonId: string;
  bon_id: string;
};

export type CreateOrderClientResponse = {
  status: "success" | "failed";
  message: string;
  order?: OrderClientData;
};

export type CreateMultipleOrderClientResponse = {
  status: "success" | "failed";
  message: string;
  order?: OrderClientData[];
};

export type GetAllProductsStatusResponse = {
  status: "success" | "failed";
  message: string;
  totalProducts: number;
  totalStatusResult: ProductStatus;
  totalProductByPcs: number;
};

export type OrderProduct = {
  type: "PRODUCT";
  id: string;
  order_status: "IN_PROGRESS" | "COMPLETED";
  productId: string;
  reference: string;
  productName: string;
  productImage: string;
  quantity_sent: number;
  quantity_returned: number;
  unit_price: number;
  createdAt: string;
};

export type OrderAvance = {
  type: "AVANCE";
  id: string;
  amount: number;
  createdAt: string;
  method: "cash" | "check" | "bank";
  description: string;
};

export type GetOrdersFaconnierResponse = {
  status: string;
  message: string;
  orders: (OrderProduct | OrderAvance)[];
  totalPages: number;
  currentPage: number;
};

export type GetOrdersStylistResponse = {
  status: string;
  message: string;
  orders: (OrderProduct | OrderAvance)[];
  totalPages: number;
  currentPage: number;
};

export type OrderProductClient = Omit<
  OrderProduct,
  "quantity_returned" | "order_status" | "quantity_sent"
> & {
  quantity: number;
  returned: number;
};

export type GetOrdersClientResponse = {
  status: string;
  message: string;
  orders: (OrderProductClient | OrderAvance)[];
  totalPages: number;
  currentPage: number;
};

export type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  date?: "asc" | "desc";
};

export type CreateAvanceStylistInput = {
  seasonId: string;
  stylistId: string | undefined;
  bonId: string;
  amount: number;
  method: string;
  description: string;
  createdAt: string;
};

export type AvanceStylistData = {
  id: string;
  styleTraitId: string;
  bonId: string;
  amount: number;
  method: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAvanceStylistResponse = {
  status: "success" | "failed";
  message: string;
  avance?: AvanceStylistData;
};

export type CreateAvanceFaconnierInput = {
  seasonId: string;
  faconnierId: string | undefined;
  bonId: string;
  amount: number;
  method: string;
  description: string;
  createdAt: string;
};

type AvanceFaconnierData = {
  id: string;
  faconnierId: string;
  bonId: string;
  amount: number;
  method: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAvanceFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  avance?: AvanceFaconnierData;
};

export type CreateAvanceClientInput = {
  seasonId: string;
  clientId: string | undefined;
  bonId: string;
  amount: number;
  method: string;
  description: string;
  createdAt: string;
};

export type AvanceClientData = {
  id: string;
  clientId: string;
  bonId: string;
  amount: number;
  method: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAvanceClientResponse = {
  status: "success" | "failed";
  message: string;
  avance?: AvanceClientData;
};

export type GetFaconnierSummaryResponse = {
  status: "success" | "failed";
  message: string;
  summary?: {
    totalQuantitySent: number;
    totalQuantityReturned: number;
    totalValueSent: number;
    totalAdvances: number;
  };
};

export type GetStylistSummaryResponse = {
  status: "success" | "failed";
  message: string;
  summary?: {
    totalQuantitySent: number;
    totalValueSent: number;
    totalAdvances: number;
    totalOrderItems: number;
  };
};

export type GetClientSummaryResponse = {
  status: "success" | "failed";
  message: string;
  summary?: {
    totalOrderItems: number;
    totalQuantitySent: number;
    totalQuantityReturned: number;
    totalValueSent: number;
    totalAdvances: number;
    remise: number;
  };
};

export type UpdateOrderFaconnierInput = {
  bonId: string;
  faconnierId: string;
  seasonId: string;
  orderId: string;
  formData: {
    quantity_sent: number;
    newQuantityReturned: number;
    price_by_unit: number;
    date: string;
  };
};

export type UpdateOrderStylistInput = {
  bonId: string;
  stylistId: string;
  seasonId: string;
  orderId: string;
  formData: {
    quantity_sent: number;
    price_by_unit: number;
    date: string;
  };
};

export type UpdateOrderClientInput = {
  bonId: string;
  clientId: string;
  seasonId: string;
  orderId: string;
  formData: {
    quantity_sent: number;
    newQuantityReturned: number;
    price_by_unit: number;
    date: string;
  };
};

export type UpdateOrderFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  order?: OrderFaconnierData;
};

export type UpdateOrderStylistResponse = {
  status: "success" | "failed";
  message: string;
  order?: OrderStylistData;
};

export type UpdateOrderClientResponse = {
  status: "success" | "failed";
  message: string;
  order?: OrderClientData;
};

export type DeleteAvanceFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  avance?: Omit<OrderAvance, "type">;
};

export type DeleteAvanceStylistResponse = {
  status: "success" | "failed";
  message: string;
  avance?: Omit<OrderAvance, "type">;
};

export type DeleteAvanceClientResponse = {
  status: "success" | "failed";
  message: string;
  avance?: Omit<OrderAvance, "type">;
};

export type DeleteOrderFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  order?: Omit<OrderProduct, "type">;
};

export type DeleteOrderStylistResponse = {
  status: "success" | "failed";
  message: string;
  order?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    quantity_sent: number;
    unit_price: number;
    styleTraitOrderId: string;
  };
};

export type ToggleBonClientInput = {
  bonId: string;
  seasonId: string;
  openBon: boolean;
  closeBon: boolean;
  remise?: number;
};

export type DeleteOrderClientResponse = {
  status: "success" | "failed";
  message: string;
  order?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: string;
    unit_price: number;
    quantity: number;
    returned: number;
    clientOrderId: string;
  };
};

export type ToggleBonFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonFaconnierData;
};

export type ToggleBonStylistResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonStylistData;
};

export type ToggleBonClientResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonClientData;
};

export type DeleteBonFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonFaconnierData;
};

export type DeleteBonStylistResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonStylistData;
};

export type DeleteBonClientResponse = {
  status: "success" | "failed";
  message: string;
  bon?: BonClientData;
};

export type GeneralSettings = {
  status: "success" | "failed";
  message: string;
  settings?: {
    faconnierActive: number;
    faconnierInactive: number;
    clientsActive: number;
    clientsInactive: number;
    stylistsActive: number;
    stylistsInactive: number;
    users: number;
    seasons: number;
  };
};

export type GetSummaryResponse = {
  status: "success" | "failed";
  message: string;
  summary: {
    faconnier: {
      openBons: number;
      closedBons: number;
      totalAmount: number;
      totalAdvances: any;
      remainingAmount: number;
    };
    client: {
      openBons: number;
      closedBons: number;
      totalAmount: number;
      totalAdvances: any;
      remainingAmount: number;
    };
    stylist: {
      openBons: number;
      closedBons: number;
      totalAmount: number;
      totalAdvances: any;
      remainingAmount: number;
    };
    totalSales: number;
  };
};

export type GetRetardOrdersFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  totalCount: number;
  faconniers: {
    id: string;
    reference: string;
    productName: string;
    faconnierName: string;
    bonNumber: number;
    quantityExpected: number;
    quantityReturned: number;
    delayDays: number;
    productImage: string | null;
  }[];
};

// Worker models
export type WorkPlace = {
  id: string;
  name: string;
  address: string | null;
  createdAt: string;
};

export type CreateWorkPlaceInput = {
  id: string;
  name: string;
  address: string | null;
};

export type CreateWorkPlaceResponse = {
  status: "success" | "failed";
  message: string;
  workplace?: {
    id: string;
    name: string;
    address: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type WorkerData = {
  id: string;
  name: string;
  phone: string | null;
  workplaceId: string;
  salaireHebdomadaire: number;
  isActive: boolean;
  createdAt: string;
};

export type GetWorkersResponse = {
  id: string;
  name: string;
  phone: string | null;
  salaireHebdomadaire: number;
  createdAt: string;
  isActive: boolean;
  workplace: {
    id: string;
    name: string;
  };
};

export type CreateWorkerInput = Omit<
  WorkerData,
  "id" | "isActive" | "createdAt"
>;

export type UpdateWorkerInput = Omit<WorkerData, "isActive" | "createdAt">;

export type CreateWorkerResponse = {
  status: "success" | "failed";
  message: string;
  worker?: WorkerData;
};

export type Week = {
  id: string;
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  displayText: string;
};

export type CreateWeekResponse = {
  status: "success" | "failed";
  message: string;
  week?: {
    weekStart: Date;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    weekEnd: Date;
  };
};

export type DeleteWeekResponse = {
  status: "success" | "failed";
  message: string;
  week?: {
    weekStart: Date;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    weekEnd: Date;
  };
  nextWeekId?: string | null;
};

export type WorkerRecord = {
  id: string;
  workerId: string;
  weekId: string;
  lundi: number;
  lundiSupp: number;
  mardi: number;
  mardiSupp: number;
  mercredi: number;
  mercrediSupp: number;
  jeudi: number;
  jeudiSupp: number;
  vendredi: number;
  vendrediSupp: number;
  samedi: number;
  samediSupp: number;
  description: string | null;
  salaireHebdomadaire: number;
  avance: number;
  isPaid: boolean;
  worker: {
    id: string;
    name: string;
  };
};

export type GetWeeksRecordsInput = {
  weekId: string;
  workplaceId: string;
};

export type GetWeekRecordsResponse = {
  status: "success" | "failed";
  message: string;
  records: WorkerRecord[];
  nextWeekId: string | null;
  prevWeekId: string | null;
};

export type UpdateWeekRecordInput = {
  id: string;
  lundi: number;
  mardi: number;
  mercredi: number;
  jeudi: number;
  vendredi: number;
  samedi: number;
  avance: number;
};

export type UpdateWeekRecordPaymentInput = {
  type: "pay" | "undo";
  recordId: string;
};

export type UpdateWeekRecordResponse = {
  status: "success" | "failed";
  message: string;
  record?: WorkerRecord;
};

export type GetYearSummaryInput = {
  year: string;
  workplaceId: string;
};

export type GetYearSummaryResponse = {
  status: "success" | "failed";
  message: string;
  records?: {
    name: string;
    weeks: any[];
    totalAmount: number;
  }[];
  yearTotal?: number;
  nextYear?: number | null;
  prevYear?: number | null;
  year?: number;
};

export type GetSummaryWorkersResponse = {
  status: "success" | "failed";
  message: string;
  summary: {
    inactiveWorkers: number;
    totalOvertimeHours: number;
    totalRegularHours: number;
    totalSpent: number;
    totalWeeks: number;
    totalWorkers: number;
    totalAdvances: number;
    restApayer: number;
  };
};

export type GetSummaryWorkerResponse = {
  status: "success" | "failed";
  message: string;
  summary: {
    totalOvertimeHours: number;
    totalRegularHours: number;
    totalSpent: number;
    totalWeeks: number;
    totalAdvances: number;
    workerName: string;
  };
};

export type SecondWorkerRecord = {
  id: string;
  workerId: string;
  weekId: string;
  workplaceId: string;
  worker: {
    name: string;
  };
  lundi: number;
  lundiSupp: number;
  mardi: number;
  mardiSupp: number;
  mercredi: number;
  mercrediSupp: number;
  jeudi: number;
  jeudiSupp: number;
  vendredi: number;
  vendrediSupp: number;
  samedi: number;
  samediSupp: number;
  salaireHebdomadaire: number;
  avance: number;
  description: string | null;
  week: Week;
  workplace: Workplace;
  weekNumber: number;
  displayText: string;
  isPaid: boolean;
};

export type Workplace = {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type GetWorkerRecordsResponse = {
  status: "success" | "error";
  message: string;
  records: SecondWorkerRecord[];
  pagination: PaginationMeta;
};

export type OrderStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELED";
export type CancelOrderFaconnierResponse = {
  status: "success" | "failed";
  message: string;
  order?: {
    id: string;
    productId: string;
    quantity_sent: number;
    quantity_returned: number;
    unit_price: number;
    faconnierOrderId: string;
    order_status: OrderStatus;
  };
};
