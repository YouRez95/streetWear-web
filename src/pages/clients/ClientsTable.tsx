// Mobile-first version with desktop features
import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrdersClient } from "@/hooks/useClients";
import { downloadBon, downloadDailyBon } from "@/services/bons";
import { useUserStore } from "@/store/userStore";
import { formatDateToDDMMYYYY, getImageUrl } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Download,
  Info,
  Pencil,
  Trash,
} from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { DeleteAvanceClientDialog } from "./DeleteAvanceClientDialog";
import { DeleteOrderClientDialog } from "./DeleteOrderClientDialog";
// import { EditOrderClientDialog } from "./EditOrderClientDialog";
import type { GetActiveClientsResponse } from "@/types/models";
import { LazyLoadImage } from "react-lazy-load-image-component";
import EditOrderClientDialog from "./EditOrderClientDialog";

const paymentMethodMap: Record<string, string> = {
  cash: "Espèces",
  cheque: "Chèque",
  bank: "Virement bancaire",
};

type ClientsTableProps = {
  search: string;
  page: number;
  setTotalPages: (totalPages: number) => void;
  limit: number;
  date: "asc" | "desc";
  setDate: (date: "asc" | "desc") => void;
  selectedClient?: GetActiveClientsResponse["clients"][0];
  selectedBon?: GetActiveClientsResponse["clients"][0]["BonsClients"][0];
};

// Memoized row components
const ProductOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedClient,
    selectedClientId,
    onEdit,
    onDelete,
    onDownload,
  }: {
    order: any;
    selectedBon?: any;
    selectedClient?: any;
    selectedClientId: string;
    onEdit: (order: any) => void;
    onDelete: (order: any) => void;
    onDownload: (order: any) => void;
  }) => {
    const notCompleted =
      (order.quantity - order.returned) * order.unit_price -
      (order.avance || 0);

    return (
      <TableRow
        className={`h-[55px] ${
          selectedClientId === "passager" && notCompleted > 0
            ? "bg-red-50 hover:bg-red-100"
            : ""
        }`}
      >
        <TableCell className="font-medium">{order.reference}</TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center gap-3">
            <LazyLoadImage
              loading="lazy"
              effect="blur"
              src={getImageUrl(order.productImage, "product")}
              alt={order.id}
              className="w-14 h-14 rounded-lg object-cover bg-gray-100 border"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = defaultProductImage;
              }}
            />
            <span className="text-base md:text-lg truncate">
              {order.productName}
            </span>
          </div>
        </TableCell>
        {selectedClientId === "passager" && (
          <TableCell className="font-medium">
            {order.passagerName || "N/A"}
          </TableCell>
        )}
        <TableCell className="text-center">{order.quantity}</TableCell>
        <TableCell className="text-center">{order.returned}</TableCell>
        <TableCell>{order.unit_price?.toFixed(2)}</TableCell>
        <TableCell className="font-semibold">
          {(
            (order.quantity - order.returned) *
            (order.unit_price || 0)
          ).toFixed(2)}{" "}
          dh
        </TableCell>
        {selectedClientId === "passager" && (
          <TableCell className="font-medium">
            <div className="flex items-center justify-center gap-1">
              <span>{order.avance || "0"} dh </span>
              {notCompleted > 0 && (
                <Badge
                  variant={"destructive"}
                  className="text-xs text-white p-0.5"
                >
                  ({-notCompleted})
                </Badge>
              )}
            </div>
          </TableCell>
        )}
        <TableCell>
          <div className="flex items-center gap-2 justify-end">
            {selectedBon?.bon_number && selectedClient?.name && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 border border-secondary/50 text-secondary hover:text-secondary hover:bg-secondary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(order);
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-blue-500/50 text-blue-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(order);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-destructive/50 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(order);
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }
);

const AvanceOrderRow = memo(
  ({
    order,
    selectedBon,
    selectedClient,
    selectedClientId,
    onDeleteAvance,
    onDownload,
  }: {
    order: any;
    selectedBon?: any;
    selectedClient?: any;
    selectedClientId: string;
    onDeleteAvance: (order: any) => void;
    onDownload: (order: any) => void;
  }) => (
    <TableRow className="h-[55px] bg-amber-50 hover:bg-amber-100">
      <TableCell className="font-bold" colSpan={2}>
        💰 Avance
      </TableCell>
      {selectedClientId === "passager" && (
        <TableCell className="font-bold">
          {order.passagerName || "N/A"}
        </TableCell>
      )}
      <TableCell colSpan={2} className="font-medium">
        {paymentMethodMap[order.method] || "N/A"}
      </TableCell>
      <TableCell colSpan={2} className="font-bold text-amber-700">
        {order.amount?.toFixed(2)} dh
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 justify-end">
          {selectedBon?.bon_number && selectedClient?.name && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-secondary/50 text-secondary hover:text-secondary hover:bg-secondary/10"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(order);
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          {order.description && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 border border-secondary/50 text-secondary hover:text-secondary hover:bg-secondary/10"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="text-left text-sm">
                {order.description}
              </HoverCardContent>
            </HoverCard>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 border border-destructive/50 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteAvance(order);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
);

const DateGroupRow = memo(
  ({
    dateGroup,
    selectedClientId,
    selectedBon,
    selectedClient,
    isExpanded,
    onToggleDate,
    onDownloadDaily,
    onEditOrder,
    onDeleteOrder,
    onDeleteAvance,
    onDownloadOrder,
  }: {
    dateGroup: any;
    selectedClientId: string;
    selectedBon?: any;
    selectedClient?: any;
    isExpanded: boolean;
    onToggleDate: (date: string) => void;
    onDownloadDaily: (dateGroup: any) => void;
    onEditOrder: (order: any) => void;
    onDeleteOrder: (order: any) => void;
    onDeleteAvance: (order: any) => void;
    onDownloadOrder: (order: any) => void;
  }) => {
    let totalAvances = 0;
    let totalAmountExcludingAvances = 0;

    if (selectedClientId === "passager") {
      totalAvances = dateGroup.items
        .map((item: any) => (item.type === "PRODUCT" ? item.avance || 0 : 0))
        .reduce((a: number, b: number) => a + b, 0);
      totalAmountExcludingAvances = Math.abs(dateGroup.totalAmount);
    } else {
      totalAvances = dateGroup.items
        .map((item: any) => (item.type === "AVANCE" ? item.amount || 0 : 0))
        .reduce((a: number, b: number) => a + b, 0);
      totalAmountExcludingAvances = Math.abs(
        dateGroup.totalAmount - totalAvances
      );
    }

    return (
      <>
        {/* Date Header Row - Clickable */}
        <TableRow
          className="h-[55px] hover:bg-slate-50/50 transition-all cursor-pointer bg-gradient-to-r from-slate-50 to-transparent"
          onClick={() => onToggleDate(dateGroup.date)}
        >
          <TableCell className="font-medium">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-500" />
            )}
          </TableCell>
          <TableCell className="font-bold text-slate-900">
            {formatDateToDDMMYYYY(dateGroup.date)}
          </TableCell>
          <TableCell className="text-slate-700 font-medium">
            {dateGroup.totalQuantitySent}
          </TableCell>
          <TableCell className="text-slate-700 font-medium">
            {dateGroup.totalQuantityReturned}
          </TableCell>
          <TableCell className="text-slate-900 font-semibold">
            {totalAmountExcludingAvances} dh
          </TableCell>
          <TableCell className="text-amber-700 font-semibold">
            {totalAvances} dh
          </TableCell>
          <TableCell className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 border border-secondary/50 text-secondary hover:text-secondary hover:bg-secondary/10"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadDaily(dateGroup);
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          </TableCell>
        </TableRow>

        {/* Expanded Items - Nested Table */}
        {isExpanded && (
          <TableRow>
            <TableCell
              colSpan={selectedClientId === "passager" ? 9 : 7}
              className="p-0 bg-slate-50/30"
            >
              <div className="border-t-2 border-blue-200">
                <Table className="text-base w-full">
                  <TableHeader className="bg-slate-100 border-b-2 border-slate-200">
                    <TableRow className="text-sm">
                      <TableHead className="text-slate-900 font-semibold w-[150px]">
                        Référence
                      </TableHead>
                      <TableHead className="text-slate-900 font-semibold w-[250px]">
                        Modèle
                      </TableHead>
                      {selectedClientId === "passager" && (
                        <TableHead className="text-slate-900 font-semibold w-[200px]">
                          Client
                        </TableHead>
                      )}
                      <TableHead className="text-slate-900 font-semibold w-[130px] text-center">
                        Q. envoyée
                      </TableHead>
                      <TableHead className="text-slate-900 font-semibold w-[130px] text-center">
                        Q. retournée
                      </TableHead>
                      <TableHead className="text-slate-900 font-semibold w-[130px]">
                        Prix unitaire
                      </TableHead>
                      <TableHead className="text-slate-900 font-semibold w-[130px]">
                        Total
                      </TableHead>
                      {selectedClientId === "passager" && (
                        <TableHead className="text-slate-900 font-semibold w-[130px]">
                          Avance
                        </TableHead>
                      )}
                      <TableHead className="text-slate-900 font-semibold w-[180px] text-end">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dateGroup.items.length === 0 && (
                      <TableRow className="h-[55px]">
                        <TableCell
                          colSpan={selectedClientId === "passager" ? 9 : 7}
                          className="text-center text-slate-500"
                        >
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    )}
                    {dateGroup.items.map((order: any) =>
                      order.type === "PRODUCT" ? (
                        <ProductOrderRow
                          key={order.id}
                          order={order}
                          selectedBon={selectedBon}
                          selectedClient={selectedClient}
                          selectedClientId={selectedClientId}
                          onEdit={onEditOrder}
                          onDelete={onDeleteOrder}
                          onDownload={onDownloadOrder}
                        />
                      ) : (
                        <AvanceOrderRow
                          key={order.id}
                          order={order}
                          selectedBon={selectedBon}
                          selectedClient={selectedClient}
                          selectedClientId={selectedClientId}
                          onDeleteAvance={onDeleteAvance}
                          onDownload={onDownloadOrder}
                        />
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
);

// Memoized state components
const LoadingRow = memo(({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <span className="text-slate-600">Chargement...</span>
      </div>
    </TableCell>
  </TableRow>
));

const EmptyRow = memo(({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-12 text-slate-500">
      Sélectionner un client et un bon pour voir votre tableau
    </TableCell>
  </TableRow>
));

const FailedRow = memo(
  ({ message, colSpan }: { message: string; colSpan: number }) => (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-12 text-red-600">
        {message}
      </TableCell>
    </TableRow>
  )
);

const NoDataRow = memo(({ colSpan }: { colSpan: number }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-12 text-slate-500">
      Aucun produit trouvé.
    </TableCell>
  </TableRow>
));

function ClientsTableComponent({
  search,
  page,
  setTotalPages,
  limit,
  date,
  setDate,
  selectedClient,
  selectedBon,
}: ClientsTableProps) {
  const { selectedClientId, selectedClientBonId } = useUserStore();
  const [expandedDates, setExpandedDates] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState({
    open: false,
    orderId: "",
    quantity_returned: 0,
    quantity_sent: 0,
    price_by_unit: 0,
    date: "",
    passagerName: "",
    avance: 0,
  });
  const [openDeleteOrderDialog, setOpenDeleteOrderDialog] = useState({
    open: false,
    orderId: "",
    reference: "",
  });
  const [openDeleteAvanceDialog, setOpenDeleteAvanceDialog] = useState({
    open: false,
    avanceId: "",
    amount: 0,
  });

  const debouncedSearchTerm = useDebounce(search, 300);
  const { data, isLoading } = useOrdersClient(
    selectedClientId,
    selectedClientBonId,
    {
      page: page,
      limit: limit,
      search: debouncedSearchTerm,
      date: date,
    }
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data, setTotalPages]);

  // Memoized event handlers
  const handleToggleDate = useCallback((dateKey: string) => {
    setExpandedDates((prev) => (prev === dateKey ? null : dateKey));
  }, []);

  const handleEditOrder = useCallback((order: any) => {
    setOpenEditDialog({
      open: true,
      orderId: order.id,
      quantity_returned: order.returned,
      quantity_sent: order.quantity,
      price_by_unit: order.unit_price,
      date: order.createdAt,
      passagerName: order.passagerName || "",
      avance: order.avance || 0,
    });
  }, []);

  const handleDeleteOrder = useCallback((order: any) => {
    setOpenDeleteOrderDialog({
      open: true,
      orderId: order.id,
      reference: order.reference,
    });
  }, []);

  const handleDeleteAvance = useCallback((order: any) => {
    setOpenDeleteAvanceDialog({
      open: true,
      avanceId: order.id,
      amount: order.amount,
    });
  }, []);

  const handleDownloadOrder = useCallback(
    (order: any) => {
      if (selectedBon?.bon_number && selectedClient?.name) {
        downloadBon({
          client: selectedClient.name,
          bon_number: selectedBon.bon_number,
          ...order,
          quantity: order.quantity,
        });
      }
    },
    [selectedBon, selectedClient]
  );

  const handleDownloadDaily = useCallback((dateGroup: any) => {
    downloadDailyBon(dateGroup);
  }, []);

  const handleDateSort = useCallback(() => {
    setDate(date === "asc" ? "desc" : "asc");
  }, [date, setDate]);

  const colSpan = selectedClientId === "passager" ? 9 : 7;

  // Render table content based on state
  const renderTableContent = () => {
    if (isLoading) {
      return <LoadingRow colSpan={colSpan} />;
    }

    if (selectedClientId === "" || selectedClientBonId === "") {
      return <EmptyRow colSpan={colSpan} />;
    }

    if (data?.status === "failed") {
      return <FailedRow message={data.message} colSpan={colSpan} />;
    }

    if (data && data.orders.length > 0) {
      return data.orders.map((dateGroup: any) => (
        <DateGroupRow
          key={dateGroup.date}
          dateGroup={dateGroup}
          selectedClientId={selectedClientId}
          selectedBon={selectedBon}
          selectedClient={selectedClient}
          isExpanded={expandedDates === dateGroup.date}
          onToggleDate={handleToggleDate}
          onDownloadDaily={handleDownloadDaily}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onDeleteAvance={handleDeleteAvance}
          onDownloadOrder={handleDownloadOrder}
        />
      ));
    }

    return <NoDataRow colSpan={colSpan} />;
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        <Table className="text-sm md:text-base">
          <TableCaption className="text-background sr-only">
            Une liste de vos commandes récentes.
          </TableCaption>
          <TableHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
            <TableRow className="text-sm">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="text-slate-900 font-bold w-[180px]">
                <div className="flex items-center gap-1">
                  Date
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDateSort}
                    className="h-6 w-6 hover:bg-slate-200"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead className="text-slate-900 font-bold w-[130px] text-center">
                Q. envoyée
              </TableHead>
              <TableHead className="text-slate-900 font-bold w-[130px] text-center">
                Q. retournée
              </TableHead>
              <TableHead className="text-slate-900 font-bold w-[150px]">
                Total commandes
              </TableHead>
              <TableHead className="text-slate-900 font-bold w-[150px]">
                Total avances
              </TableHead>
              <TableHead className="text-slate-900 font-bold w-[100px] text-end">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm md:text-base">
            {renderTableContent()}
          </TableBody>
        </Table>
      </div>

      <EditOrderClientDialog
        clientId={selectedClientId}
        bonId={selectedClientBonId}
        openEditDialog={openEditDialog}
        onClose={setOpenEditDialog}
      />

      <DeleteOrderClientDialog
        clientId={selectedClientId}
        bonId={selectedClientBonId}
        openDeleteOrderDialog={openDeleteOrderDialog}
        onClose={setOpenDeleteOrderDialog}
      />

      <DeleteAvanceClientDialog
        clientId={selectedClientId}
        bonId={selectedClientBonId}
        openDeleteAvanceDialog={openDeleteAvanceDialog}
        onClose={setOpenDeleteAvanceDialog}
      />
    </>
  );
}

// Export the memoized component
export default memo(ClientsTableComponent);
