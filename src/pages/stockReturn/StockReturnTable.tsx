import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReturnStock } from "@/hooks/useReturnStock";
import { formatDateToDDMMYYYY, getImageUrl } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Shirt,
  Trash,
  Trash2,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import TranferReturnStockToClient from "./TranferReturnStockToClient";
import type { GetReturnStockResponse } from "@/types/models";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { DeleteReturnStock } from "./DeleteReturnStock";

type StockReturnTableProps = {
  search: string;
  page: number;
  setTotalPages: (total: number) => void;
  limit: number;
  setOpenDeleteDialog: (open: boolean) => void;
  setOpenEditDialog: (open: boolean) => void;
  setSelectedStockReturn: (
    stockReturn: GetReturnStockResponse["products"][0]["stockInfo"]["returns"][0]
  ) => void;
};

export default function StockReturnTable({
  search,
  limit,
  page,
  setTotalPages,
  setOpenDeleteDialog,
  setOpenEditDialog,
  setSelectedStockReturn,
}: StockReturnTableProps) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [openTranferProductDialog, setOpenTranferProductDialog] =
    useState(false);
  const [openDeleteReturn, setOpenDeleteReturn] = useState(false);
  const [selectedStock, setSelectedStock] = useState<
    GetReturnStockResponse["products"][0] | null
  >(null);
  const debouncedSearchTerm = useDebounce(search, 300);

  const { data: stockData, isLoading } = useReturnStock(
    page,
    limit,
    debouncedSearchTerm
  );

  const toggleExpand = (id: string) => {
    setExpandedProduct((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (stockData) {
      setTotalPages(stockData.totalPages);
    }
  }, [stockData]);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="text-primary">
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="min-w-[120px] text-primary font-medium text-base">
              Référence
            </TableHead>
            <TableHead className="min-w-[200px] text-primary font-medium text-base">
              Modèle
            </TableHead>
            <TableHead className="text-center min-w-[120px] text-primary font-medium text-base">
              Total Retourné
            </TableHead>
            <TableHead className="text-center min-w-[120px] text-primary font-medium text-base">
              Total Transférable
            </TableHead>
            <TableHead className="text-center min-w-[120px] text-primary font-medium text-base">
              Disponible
            </TableHead>
            <TableHead className="text-right min-w-[120px] text-primary font-medium text-base">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!stockData?.products || stockData?.products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          ) : (
            stockData?.products.map((product) => (
              <Fragment key={product.id}>
                {/* Main Product Row */}
                <TableRow
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpand(product.id)}
                >
                  <TableCell>
                    {expandedProduct === product.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.reference}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <LazyLoadImage
                        loading="lazy"
                        effect="blur"
                        src={getImageUrl(product.productImage, "product")}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover border bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = defaultProductImage;
                        }}
                      />
                      <span>{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">
                      {product.stockInfo?.totalReturned}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">
                      {product.stockInfo?.totalReturned -
                        product.stockInfo?.availableForTransfer}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`font-medium ${
                        product.stockInfo?.availableForTransfer > 0
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {product.stockInfo?.availableForTransfer}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-3 justify-end">
                      <Shirt
                        className="w-7 h-7 cursor-pointer text-destructive/70 border border-destructive/50 rounded-md p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStock(product);
                          setOpenTranferProductDialog(true);
                        }}
                      />
                      <Trash
                        className="w-7 h-7 cursor-pointer text-destructive/70 border border-destructive/50 rounded-md p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStock(product);
                          setOpenDeleteReturn(true);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Returns Row */}
                {expandedProduct === product.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={7} className="p-0">
                      <div className="px-4 py-3">
                        <h4 className="font-medium mb-2">
                          Détails des retours
                        </h4>
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader className="bg-gray-100">
                              <TableRow>
                                <TableHead className="w-[200px]  text-primary font-medium text-base">
                                  Client
                                </TableHead>
                                <TableHead className=" text-primary font-medium text-base">
                                  Bon N°
                                </TableHead>
                                <TableHead className=" text-primary font-medium text-base">
                                  Date
                                </TableHead>
                                <TableHead className="text-right  text-primary font-medium text-base">
                                  Quantité
                                </TableHead>
                                <TableHead className="text-right  text-primary font-medium text-base">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {product.stockInfo?.returns.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    className="h-12 text-center text-gray-500"
                                  >
                                    Aucun retour enregistré
                                  </TableCell>
                                </TableRow>
                              ) : (
                                product.stockInfo?.returns.map((ret, index) => {
                                  const client = ret.client
                                    ? ret.client
                                    : {
                                        id: ret.passagerName
                                          ? `${ret.passagerName}-${index}`
                                          : `unknown-${index}`,
                                        name:
                                          `${ret.passagerName} (passager)` ||
                                          "Inconnu",
                                      };
                                  return (
                                    <TableRow
                                      key={`${product.id}-${client.id}-${ret.date}`}
                                    >
                                      <TableCell className="font-medium">
                                        {client.name}
                                      </TableCell>
                                      <TableCell>
                                        Bon #{ret.bonNumber}
                                      </TableCell>
                                      <TableCell>
                                        {formatDateToDDMMYYYY(
                                          new Date(ret.date)
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right flex justify-end gap-2 items-center">
                                        <span className="mr-4">
                                          {ret.quantity}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex items-center gap-3 justify-end">
                                          <Pencil
                                            className="w-7 h-7 cursor-pointer text-secondary border border-secondary/90 rounded-md p-1"
                                            onClick={() => {
                                              setOpenEditDialog(true);
                                              setSelectedStockReturn(ret);
                                            }}
                                          />
                                          <Trash2
                                            className="w-7 h-7 cursor-pointer text-destructive/70 border border-destructive/50 rounded-md p-1"
                                            onClick={() => {
                                              setOpenDeleteDialog(true);
                                              setSelectedStockReturn(ret);
                                            }}
                                          />
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>

      {selectedStock && openTranferProductDialog && (
        <TranferReturnStockToClient
          open={openTranferProductDialog}
          setOpen={setOpenTranferProductDialog}
          product={selectedStock}
        />
      )}

      {selectedStock && openDeleteReturn && (
        <DeleteReturnStock
          open={openDeleteReturn}
          setOpen={setOpenDeleteReturn}
          returnStock={selectedStock}
        />
      )}
    </div>
  );
}
