import type {
  CancelOrderFaconnierResponse,
  ClientData,
  CreateAvanceClientInput,
  CreateAvanceClientResponse,
  CreateAvanceFaconnierInput,
  CreateAvanceFaconnierResponse,
  CreateAvanceStylistInput,
  CreateAvanceStylistResponse,
  CreateBonClientInput,
  CreateBonClientPassagerInput,
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
  CreateWeekResponse,
  CreateWorkerInput,
  CreateWorkerResponse,
  CreateWorkPlaceInput,
  CreateWorkPlaceResponse,
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
  DeleteWeekResponse,
  FaconnierData,
  FullSeasonData,
  GeneralSettings,
  GetActiveClientsResponse,
  GetActiveFaconniersResponse,
  GetActiveStylistsResponse,
  GetAllProductsStatusResponse,
  GetBonClientPassagerResponse,
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
  GetSummaryWorkerResponse,
  GetSummaryWorkersResponse,
  GetWeekRecordsResponse,
  GetWeeksRecordsInput,
  GetWorkerRecordsResponse,
  GetWorkersResponse,
  GetYearSummaryInput,
  GetYearSummaryResponse,
  LoginFormType,
  QueryParams,
  StylistData,
  ToggleBonClientInput,
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
  UpdateWeekRecordInput,
  UpdateWeekRecordPaymentInput,
  UpdateWeekRecordResponse,
  UpdateWorkerInput,
  UserData,
  Week,
  WorkerData,
  WorkPlace,
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

export type CancelOrderFaconnier = (
  orderId: string
) => Promise<CancelOrderFaconnierResponse>;

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
  toggleBonData: ToggleBonClientInput
) => Promise<ToggleBonClientResponse>;

export type DeleteBonClient = (
  bonId: string,
  seasonId: string
) => Promise<DeleteBonClientResponse>;

export type CreateBonClientPassager = (
  bonData: CreateBonClientPassagerInput
) => Promise<CreateBonClientResponse>;

export type GetBonsClientPassager = (
  seasonId: string
) => Promise<GetBonClientPassagerResponse>;

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

// ======================= Workers TYPES ======================= //
export type CreateWorkPlace = (
  workPlaceData: Omit<CreateWorkPlaceInput, "id">
) => Promise<CreateWorkPlaceResponse>;

export type GetWorkPlacesByCursor = ({
  take,
  cursor,
  search,
}: {
  take: number;
  cursor: string;
  search: string;
}) => Promise<{
  status: "success" | "failed";
  message: string;
  workplaces: WorkPlace[];
  nextCursor: string | null;
}>;

export type GetWorkPlaces = (
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: "success" | "failed";
  message: string;
  workplaces: WorkPlace[];
  currentPage: number;
  totalPages: number;
}>;

export type UpdateWorkplace = (
  workPlaceData: CreateWorkPlaceInput
) => Promise<CreateWorkPlaceResponse>;
export type DeleteWorkplace = (
  workplaceId: string
) => Promise<CreateWorkPlaceResponse>;

export type CreateWorker = (
  workerData: Omit<CreateWorkerInput, "id">
) => Promise<CreateWorkerResponse>;
export type GetWorkers = (
  active: string[],
  page: number,
  limit: number,
  search: string
) => Promise<{
  status: "success" | "failed";
  message: string;
  workers: GetWorkersResponse[];
  currentPage: number;
  totalPages: number;
}>;

export type UpdateWorker = (
  workerData: UpdateWorkerInput
) => Promise<CreateWorkerResponse>;
export type DeleteWorker = (workerId: string) => Promise<CreateWorkerResponse>;

export type GetWorkersByCursor = ({
  take,
  cursor,
  search,
}: {
  take: number;
  cursor: string;
  search: string;
}) => Promise<{
  status: "success" | "failed";
  message: string;
  workers: (WorkerData & { workplace: { id: string; name: string } })[];
  nextCursor: string | null;
}>;

export type UpdateWorkerStatus = ({
  workerId,
  status,
}: {
  workerId: string;
  status: boolean;
}) => Promise<CreateWorkerResponse>;

export type GetWeeksByCursor = ({
  workplaceId,
  take,
  cursor,
  search,
}: {
  workplaceId: string;
  take: number;
  cursor: string;
  search: string;
}) => Promise<{
  status: "success" | "failed";
  message: string;
  weeks: Week[];
  nextCursor: string | null;
}>;

export type CreateWeek = ({
  weekStart,
  workplaceId,
}: {
  weekStart: string;
  workplaceId: string;
}) => Promise<CreateWeekResponse>;
export type UpdateWeek = ({
  weekStart,
  weekId,
}: {
  weekStart: string;
  weekId: string;
}) => Promise<CreateWeekResponse>;

export type DeleteWeek = ({
  weekId,
  workplaceId,
}: {
  weekId: string;
  workplaceId: string;
}) => Promise<DeleteWeekResponse>;

export type GetWeekRecords = ({
  weekId,
  workplaceId,
}: GetWeeksRecordsInput) => Promise<GetWeekRecordsResponse>;

export type UpdateWeekRecord = (
  recordData: UpdateWeekRecordInput
) => Promise<UpdateWeekRecordResponse>;

export type UpdateWeekRecordPayment = (
  recordData: UpdateWeekRecordPaymentInput
) => Promise<UpdateWeekRecordResponse>;

export type CreateWeekRecord = ({
  weekId,
  workerId,
}: {
  weekId: string;
  workerId: string;
}) => Promise<UpdateWeekRecordResponse>;

export type DeleteWeekRecord = (
  recordId: string
) => Promise<UpdateWeekRecordResponse>;

export type GetYearSummary = ({
  year,
  workplaceId,
}: GetYearSummaryInput) => Promise<GetYearSummaryResponse>;

export type Year = {
  id: string;
  year: number;
  displayText: string;
};

export type GetYearByCursor = ({
  workplaceId,
  take,
  cursor,
  search,
}: {
  workplaceId: string;
  take: number;
  cursor: string;
  search: string;
}) => Promise<{
  status: "success" | "failed";
  message: string;
  years: Year[];
  nextCursor: string | null;
}>;

export type GetSummaryWorkers = ({
  weekId,
  workplaceId,
}: {
  weekId: string;
  workplaceId: string;
}) => Promise<GetSummaryWorkersResponse>;

export type GetSummaryWorker = (
  workerId: string
) => Promise<GetSummaryWorkerResponse>;

export type GetWorkerRecords = ({
  limit,
  page,
  workerId,
}: {
  workerId: string;
  page: number;
  limit: number;
}) => Promise<GetWorkerRecordsResponse>;
