import type {
  ClientData,
  CreateAvanceClientInput,
  CreateAvanceClientResponse,
  CreateAvanceFaconnierInput,
  CreateAvanceFaconnierResponse,
  CreateAvanceStylistInput,
  CreateAvanceStylistResponse,
  CreateBonClientInput,
  CreateBonClientResponse,
  CreateBonFaconnierInput,
  CreateBonFaconnierResponse,
  CreateBonStylistInput,
  CreateBonStylistResponse,
  CreateClientInput,
  CreateClientResponse,
  CreateFaconnierInput,
  CreateFaconnierResponse,
  CreateMultipleOrderClientResponse,
  CreateMultipleOrdersClientInput,
  CreateOrderClientFromReturnStockResponse,
  CreateOrderClientInput,
  CreateOrderClientResponse,
  CreateOrderFaconnierInput,
  CreateOrderFaconnierResponse,
  CreateOrderStylistInput,
  CreateOrderStylistResponse,
  CreateProductInput,
  CreateProductResponse,
  CreateSeasonInput,
  CreateSeasonResponse,
  CreateStylistInput,
  CreateStylistResponse,
  CreateUserInput,
  CreateUserResponse,
  DeleteAvanceClientResponse,
  DeleteAvanceFaconnierResponse,
  DeleteAvanceStylistResponse,
  DeleteBonClientResponse,
  DeleteBonFaconnierResponse,
  DeleteBonStylistResponse,
  DeleteClientReturnStockResponse,
  DeleteOrderClientResponse,
  DeleteOrderFaconnierResponse,
  DeleteOrderStylistResponse,
  DeleteProductResponse,
  FaconnierData,
  FullSeasonData,
  GeneralSettings,
  GetActiveClientsResponse,
  GetActiveFaconniersResponse,
  GetActiveStylistsResponse,
  GetAllProductsStatusResponse,
  GetClientSummaryResponse,
  GetFaconnierSummaryResponse,
  GetOrdersClientResponse,
  GetOrdersFaconnierResponse,
  GetOrdersStylistResponse,
  GetProductsParams,
  GetProductsResponse,
  GetRetardOrdersFaconnierResponse,
  GetReturnStockParams,
  GetReturnStockResponse,
  GetStylistSummaryResponse,
  GetSummaryResponse,
  GetSummaryReturnStockResponse,
  LoginFormType,
  QueryParams,
  StylistData,
  ToggleBonClientResponse,
  ToggleBonFaconnierResponse,
  ToggleBonStylistResponse,
  UpdateClientInput,
  UpdateClientReturnStockInput,
  UpdateFaconnierInput,
  UpdateFaconnierStatusInput,
  UpdateOrderClientInput,
  UpdateOrderClientResponse,
  UpdateOrderFaconnierInput,
  UpdateOrderFaconnierResponse,
  UpdateOrderStylistInput,
  UpdateOrderStylistResponse,
  UpdateProductInput,
  UpdateProductResponse,
  UpdateSeasonInput,
  UpdateStylistInput,
  UpdateUserInput,
  UserData,
} from "./models";

export type LoginUser = (userCreadentials: LoginFormType) => Promise<{
  status: "success" | "failed";
  message: string | { field: string; message: string }[];
  user?: UserData;
}>;

export type LogoutUser = () => Promise<{
  status: "success" | "failed";
  message: string;
}>;

// ======================= SEASONS TYPES ======================= //
export type GetSeasons = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: "success" | "failed";
  message: string;
  seasons: FullSeasonData[];
  currentPage: number;
  totalPages: number;
}>;

export type CreateSeason = (
  seasonData: CreateSeasonInput
) => Promise<CreateSeasonResponse>;
export type DeleteSeason = (seasonId: string) => Promise<CreateSeasonResponse>;
export type UpdateSeason = (
  seasonData: UpdateSeasonInput
) => Promise<CreateSeasonResponse>;
export type ToggleSeason = (seasonId: string) => Promise<CreateSeasonResponse>;

// ======================= DASHBOARD TYPES ======================= //

export type GetGeneralSettings = () => Promise<GeneralSettings>;

export type GetSummary = (seasonId: string) => Promise<GetSummaryResponse>;

export type GetRetardOrdersFaconnier = (
  seasonId: string
) => Promise<GetRetardOrdersFaconnierResponse>;

// ======================= PRODUCTS TYPES ======================= //
export type GetProducts = (
  getProductData: GetProductsParams
) => Promise<GetProductsResponse>;

export type CreateProduct = (
  productData: CreateProductInput,
  seasonId: string
) => Promise<CreateProductResponse>;

export type UpdateProduct = (
  productData: UpdateProductInput,
  seasonId: string
) => Promise<UpdateProductResponse>;

export type DeleteProduct = (
  productId: string,
  seasonId: string
) => Promise<DeleteProductResponse>;

export type GetAllProductsStatus = (
  seasonId: string
) => Promise<GetAllProductsStatusResponse>;

// ======================= FACONNIER TYPES ======================= //

export type GetActiveFaconniers = (
  seasonId: string,
  openBon: boolean,
  closedBon: boolean
) => Promise<GetActiveFaconniersResponse>;

export type CreateFaconnier = (
  userData: CreateFaconnierInput
) => Promise<CreateFaconnierResponse>;

export type DeleteFaconnier = (
  faconnierId: string
) => Promise<CreateFaconnierResponse>;

export type UpdateFaconnier = (
  userData: UpdateFaconnierInput
) => Promise<CreateFaconnierResponse>;

export type UpdateFaconnierStatus = (
  faconnierData: UpdateFaconnierStatusInput
) => Promise<CreateFaconnierResponse>;

export type GetFaconniers = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: "success" | "failed";
  message: string;
  faconniers: FaconnierData[];
  currentPage: number;
  totalPages: number;
}>;

export type CreateBonFaconnier = (
  bonData: CreateBonFaconnierInput
) => Promise<CreateBonFaconnierResponse>;

export type CreateOrderFaconnier = (
  orderData: CreateOrderFaconnierInput
) => Promise<CreateOrderFaconnierResponse>;

export type GetOrdersFaconnier = (
  seasonId: string,
  faconnierId: string,
  bonId: string,
  queryParams?: QueryParams
) => Promise<GetOrdersFaconnierResponse>;

export type CreateAvanceFaconnier = (
  avanceData: CreateAvanceFaconnierInput
) => Promise<CreateAvanceFaconnierResponse>;

export type UpdateOrderFaconnier = (
  updateOrderFaconnierData: UpdateOrderFaconnierInput
) => Promise<UpdateOrderFaconnierResponse>;

export type GetFaconnierSummary = (
  seasonId: string,
  faconnierId: string,
  bonId: string
) => Promise<GetFaconnierSummaryResponse>;

export type DeleteAvanceFaconnier = (
  avanceId: string,
  seasonId: string
) => Promise<DeleteAvanceFaconnierResponse>;

export type DeleteOrderFaconnier = (
  orderId: string,
  seasonId: string
) => Promise<DeleteOrderFaconnierResponse>;

export type ToggleBonFaconnier = (
  bonId: string,
  seasonId: string,
  openBon: boolean,
  closeBon: boolean
) => Promise<ToggleBonFaconnierResponse>;

export type DeleteBonFaconnier = (
  bonId: string,
  seasonId: string
) => Promise<DeleteBonFaconnierResponse>;

// ======================= STYLIST TYPES ======================= //

export type GetStylists = (
  type: string[],
  page: number,
  limit: number,
  searchTerm: string
) => Promise<{
  status: "success" | "failed";
  message: string;
  stylists: StylistData[];
  currentPage: number;
  totalPages: number;
}>;

export type CreateStylist = (
  stylistData: CreateStylistInput
) => Promise<CreateStylistResponse>;

export type UpdateStylist = (
  stylistData: UpdateStylistInput
) => Promise<CreateStylistResponse>;

export type UpdateStylistStatus = (stylistData: {
  stylistId: string;
  status: boolean;
}) => Promise<CreateStylistResponse>;

export type DeleteStylist = (
  stylistId: string
) => Promise<CreateStylistResponse>;

export type GetActiveStylists = (
  seasonId: string,
  openBon: boolean,
  closedBon: boolean
) => Promise<GetActiveStylistsResponse>;

export type CreateAvanceStylist = (
  avanceData: CreateAvanceStylistInput
) => Promise<CreateAvanceStylistResponse>;

export type CreateBonStylist = (
  bonData: CreateBonStylistInput
) => Promise<CreateBonStylistResponse>;

export type CreateOrderStylist = (
  orderData: CreateOrderStylistInput
) => Promise<CreateOrderStylistResponse>;

export type GetOrdersStylist = (
  seasonId: string,
  stylistId: string,
  bonId: string,
  queryParams?: QueryParams
) => Promise<GetOrdersStylistResponse>;

export type GetStylistSummary = (
  seasonId: string,
  stylistId: string,
  bonId: string
) => Promise<GetStylistSummaryResponse>;

export type DeleteAvanceStylist = (
  avanceId: string,
  seasonId: string
) => Promise<DeleteAvanceStylistResponse>;

export type UpdateOrderStylist = (
  updateOrderStylistData: UpdateOrderStylistInput
) => Promise<UpdateOrderStylistResponse>;

export type DeleteOrderStylist = (
  orderId: string,
  seasonId: string
) => Promise<DeleteOrderStylistResponse>;

export type ToggleBonStylist = (
  bonId: string,
  seasonId: string,
  openBon: boolean,
  closeBon: boolean
) => Promise<ToggleBonStylistResponse>;

export type DeleteBonStylist = (
  bonId: string,
  seasonId: string
) => Promise<DeleteBonStylistResponse>;

// ======================= CLIENT TYPES ======================= //
export type GetClients = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: "success" | "failed";
  message: string;
  clients: ClientData[];
  currentPage: number;
  totalPages: number;
}>;

export type CreateClient = (
  userData: CreateClientInput
) => Promise<CreateClientResponse>;

export type DeleteClient = (clientId: string) => Promise<CreateClientResponse>;

export type UpdateClient = (
  userData: UpdateClientInput
) => Promise<CreateClientResponse>;

export type UpdateClientStatus = (clientData: {
  clientId: string;
  status: boolean;
}) => Promise<CreateClientResponse>;

export type DeleteClientReturnStock = (
  clientReturnId: string,
  seasonId: string
) => Promise<DeleteClientReturnStockResponse>;

export type UpdateClientReturnStock = (
  UpdateClientReturnData: UpdateClientReturnStockInput
) => Promise<DeleteClientReturnStockResponse>;

export type CreateOrderClientFromReturnStock = (
  orderClientData: CreateOrderClientInput
) => Promise<CreateOrderClientFromReturnStockResponse>;

export type GetActiveClients = (
  seasonId: string,
  openBon: boolean,
  closedBon: boolean
) => Promise<GetActiveClientsResponse>;

export type CreateBonClient = (
  bonData: CreateBonClientInput
) => Promise<CreateBonClientResponse>;

export type CreateOrderClient = (
  orderData: CreateOrderClientInput
) => Promise<CreateOrderClientResponse>;

export type CreateMultipleOrdersClient = (
  ordersData: CreateMultipleOrdersClientInput & { seasonId: string }
) => Promise<CreateMultipleOrderClientResponse>;

export type GetOrdersClient = (
  seasonId: string,
  clientId: string,
  bonId: string,
  queryParams?: QueryParams
) => Promise<GetOrdersClientResponse>;

export type CreateAvanceClient = (
  avanceData: CreateAvanceClientInput
) => Promise<CreateAvanceClientResponse>;

export type GetClientSummary = (
  seasonId: string,
  clientId: string,
  bonId: string
) => Promise<GetClientSummaryResponse>;

export type DeleteAvanceClient = (
  avanceId: string,
  seasonId: string
) => Promise<DeleteAvanceClientResponse>;

export type UpdateOrderClient = (
  updateOrderClientData: UpdateOrderClientInput
) => Promise<UpdateOrderClientResponse>;

export type DeleteOrderClient = (
  orderId: string,
  seasonId: string
) => Promise<DeleteOrderClientResponse>;

export type ToggleBonClient = (
  bonId: string,
  seasonId: string,
  openBon: boolean,
  closeBon: boolean
) => Promise<ToggleBonClientResponse>;

export type DeleteBonClient = (
  bonId: string,
  seasonId: string
) => Promise<DeleteBonClientResponse>;

// ======================= RETURN STOCK TYPES ======================= //
export type GetReturnStock = (
  getReturnStockData: GetReturnStockParams
) => Promise<GetReturnStockResponse>;
export type deleteClientReturnStock = (
  clientReturnId: string,
  seasonId: string
) => Promise<DeleteClientReturnStockResponse>;

export type updateClientReturnStock = (
  UpdateClientReturnData: UpdateClientReturnStockInput
) => Promise<DeleteClientReturnStockResponse>;

export type GetSummaryReturnStock = (
  seasonId: string
) => Promise<GetSummaryReturnStockResponse>;

// ======================= USERS TYPES ======================= //

export type GetUsers = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: "success" | "failed";
  message: string;
  users: UserData[];
  currentPage: number;
  totalPages: number;
}>;

export type CreateUser = (
  userData: CreateUserInput
) => Promise<CreateUserResponse>;

export type DeleteUser = (userId: string) => Promise<CreateUserResponse>;

export type UpdateUser = (
  userData: UpdateUserInput
) => Promise<CreateUserResponse>;
