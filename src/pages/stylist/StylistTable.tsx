import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrdersStylist } from "@/hooks/useStylist";
import { downloadBon } from "@/services/bons";
import { useUserStore } from "@/store/userStore";
import { formatDateToDDMMYYYY, getImageUrl } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { ArrowUpDown, Download, Info, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteAvanceStylistDialog } from "./DeleteAvanceStylistDialog";
import { DeleteOrderStylistDialog } from "./DeleteOrderStylistDialog";
import { EditOrderStylistDialog } from "./EditOrderStylistDialog";
import type { GetActiveStylistsResponse } from "@/types/models";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const paymentMethodMap: Record<string, string> = {
  cash: "Espèces",
  cheque: "Chèque",
  bank: "Virement bancaire",
};

type StylistTableProps = {
  search: string;
  page: number;
  setTotalPages: (totalPages: number) => void;
  limit: number;
  date: "asc" | "desc";
  setDate: (date: "asc" | "desc") => void;
  selectedStylist?: GetActiveStylistsResponse["stylists"][0];
  selectedBon?: GetActiveStylistsResponse["stylists"][0]["BonsStyleTrait"][0];
};

export default function StylistTable({
  search,
  page,
  setTotalPages,
  limit,
  date,
  setDate,
  selectedStylist,
  selectedBon,
}: StylistTableProps) {
  const { selectedStylistId, selectedStylistBonId } = useUserStore();
  const [openEditDialog, setOpenEditDialog] = useState({
    open: false,
    orderId: "",
    quantity_sent: 0,
    price_by_unit: 0,
    date: "",
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
  const { data, isLoading } = useOrdersStylist(
    selectedStylistId,
    selectedStylistBonId,
    {
      page: page,
      limit: limit,
      search: debouncedSearchTerm,
      date: date,
    }
  );

  //console.log('data from stylist table', data)

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return (
    <>
      <Table className="border-background rounded-xl text-base overflow-hidden">
        <TableCaption className="text-background sr-only">
          Une liste de vos produits récents.
        </TableCaption>
        <TableHeader className="text-background bg-tableHead border">
          <TableRow className="text-base">
            <TableHead className="text-background w-[150px] font-semibold">
              Référence
            </TableHead>
            <TableHead className="text-background w-[200px] font-semibold">
              Modèle
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Date
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDate(date === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </TableHead>
            <TableHead className="text-background w-[170px] font-semibold">
              Quantité envoyée
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Prix unitaire
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Total
            </TableHead>
            <TableHead className="text-background w-[200px] font-semibold text-right pr-5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base border">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Chargement...
              </TableCell>
            </TableRow>
          ) : selectedStylistId === "" || selectedStylistBonId === "" ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Sélectionner un styliste et un bon pour voir votre tableau
              </TableCell>
            </TableRow>
          ) : data?.status === "failed" ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {data.message}
              </TableCell>
            </TableRow>
          ) : data && data.orders.length > 0 ? (
            data.orders.map((order) =>
              order.type === "PRODUCT" ? (
                <TableRow key={order.id}>
                  <TableCell>{order.reference}</TableCell>
                  <TableCell className="font-medium max-w-[200px] min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(order.productImage, "product")}
                        alt={order.id}
                        className="w-14 h-14 rounded-lg"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = defaultProductImage;
                        }}
                      />
                      <span className="text-lg truncate">
                        {order.productName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDateToDDMMYYYY(order.createdAt)}</TableCell>
                  <TableCell>{order.quantity_sent}</TableCell>
                  <TableCell>{order.unit_price?.toFixed(2)}</TableCell>
                  <TableCell>
                    {(
                      (order.quantity_sent || 0) * (order.unit_price || 0)
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right pr-5 space-x-3">
                    {/* Download order */}
                    {selectedBon?.bon_number && selectedStylist?.name && (
                      <Button
                        variant="ghost"
                        className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
                        onClick={() =>
                          downloadBon({
                            stylist: selectedStylist?.name ?? "",
                            bon_number: selectedBon?.bon_number,
                            ...order,
                          })
                        }
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    {/* Edit order */}
                    <Button
                      onClick={() =>
                        setOpenEditDialog({
                          open: true,
                          orderId: order.id,
                          quantity_sent: order.quantity_sent,
                          price_by_unit: order.unit_price,
                          date: order.createdAt,
                        })
                      }
                      variant="ghost"
                      className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Delete order */}
                    <Button
                      onClick={() =>
                        setOpenDeleteOrderDialog({
                          open: true,
                          orderId: order.id,
                          reference: order.reference,
                        })
                      }
                      variant="ghost"
                      className="p-2 border border-destructive/80 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow
                  key={order.id}
                  className="bg-yellow-100 hover:bg-yellow-200 h-[55px]"
                >
                  <TableCell colSpan={2} className="font-bold">
                    Avance
                  </TableCell>
                  <TableCell className="font-bold" colSpan={2}>
                    {formatDateToDDMMYYYY(order.createdAt)}
                  </TableCell>
                  <TableCell className="font-bold  text-left">
                    {paymentMethodMap[order.method] || "N/A"}
                  </TableCell>
                  <TableCell className="text-left font-bold">
                    {order.amount?.toFixed(2)} dh
                  </TableCell>
                  <TableCell className="text-right pr-5 font-bold flex justify-end gap-3 relative">
                    {/* Download avance */}
                    {selectedBon?.bon_number && selectedStylist?.name && (
                      <Button
                        variant="ghost"
                        className="p-2 border border-secondary/80 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-md"
                        onClick={() =>
                          downloadBon({
                            stylist: selectedStylist?.name ?? "",
                            bon_number: selectedBon?.bon_number,
                            ...order,
                          })
                        }
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    {order.description && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="p-2 border border-secondary/80 text-secondary cursor-pointer hover:text-secondary hover:bg-secondary/10 rounded-md">
                            <Info className="w-4 h-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="text-left mr-4 text-sm font-normal">
                          {order.description}
                        </PopoverContent>
                      </Popover>
                    )}
                    <Button
                      variant="ghost"
                      className="p-2 border border-destructive/80 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md"
                      onClick={() =>
                        setOpenDeleteAvanceDialog({
                          open: true,
                          avanceId: order.id,
                          amount: order.amount,
                        })
                      }
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Aucun produit trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <EditOrderStylistDialog
        stylistId={selectedStylistId}
        bonId={selectedStylistBonId}
        openEditDialog={openEditDialog}
        onClose={setOpenEditDialog}
      />

      <DeleteOrderStylistDialog
        stylistId={selectedStylistId}
        bonId={selectedStylistBonId}
        openDeleteOrderDialog={openDeleteOrderDialog}
        onClose={setOpenDeleteOrderDialog}
      />

      <DeleteAvanceStylistDialog
        stylistId={selectedStylistId}
        bonId={selectedStylistBonId}
        openDeleteAvanceDialog={openDeleteAvanceDialog}
        onClose={setOpenDeleteAvanceDialog}
      />
    </>
  );
}
