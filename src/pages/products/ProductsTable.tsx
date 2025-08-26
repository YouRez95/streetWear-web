import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProducts } from "@/hooks/useProduct";
import { formatDateToDDMMYYYY, getImageUrl } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { ChevronDown, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import TransferProductDropDown from "./TransferProductDropDown";
import type { Product } from "@/types/models";
type ProductsTableProps = {
  // setViewProduct: (product: any) => void
  setOpenSheet: (open: boolean) => void;
  search: string;
  page: number;
  setTotalPages: (totalPages: number) => void;
  limit: number;
  // setUpdateProduct: (product: any) => void
  setOpenEditDialog: (open: boolean) => void;
  // setDeleteProduct: (product: any) => void
  setOpenDeleteDialog: (open: boolean) => void;
  setSelectedProduct: (product: any) => void;
  setSelectedTransferTo: (
    transferTo: "faconnier" | "client" | "stylist" | null
  ) => void;
  setOpenTransferDialogFaconnier: (open: boolean) => void;
  setOpenTransferDialogClient: (open: boolean) => void;
  setOpenTransferDialogStylist: (open: boolean) => void;
};

export function getProductionStatus(product: Product): ReactNode {
  if (!product || !product.ProductStatus) return null;

  const { quantity_at_faconnier, raw_in_stock } = product.ProductStatus;
  const total = product.totalQty;

  if (quantity_at_faconnier === 0 && raw_in_stock === total) {
    return (
      <Badge className="bg-[#F39C12] flex items-center justify-center hover:bg-[#F39C12] text-white h-7 text-[14px]">
        Non commencé
      </Badge>
    );
  }

  if (quantity_at_faconnier > 0) {
    return (
      <Badge className="bg-[#9B59B6] flex items-center justify-center hover:bg-[#9B59B6] text-white h-7 text-[14px]">
        En production
      </Badge>
    );
  }

  if (quantity_at_faconnier === 0 && raw_in_stock < total) {
    return (
      <Badge className="bg-[#B33771] flex items-center justify-center hover:bg-[#B33771] text-white h-7 text-[14px]">
        Retourné
      </Badge>
    );
  }

  return (
    <Badge className="bg-[#F39C12] flex items-center justify-center hover:bg-[#F39C12] text-white h-7 text-[14px]">
      Non commencé
    </Badge>
  );
}

export default function ProductsTable({
  setOpenSheet,
  search,
  page,
  setTotalPages,
  limit,
  setOpenEditDialog,
  setOpenDeleteDialog,
  setSelectedProduct,
  setSelectedTransferTo,
  setOpenTransferDialogFaconnier,
  setOpenTransferDialogClient,
  setOpenTransferDialogStylist,
}: ProductsTableProps) {
  const [nestedTable, setNestedTable] = useState<string | null>(null);

  const handleShowNestedTable = (id: string) => {
    setNestedTable((prev) => (prev === id ? null : id));
  };

  const debouncedSearchTerm = useDebounce(search, 300);
  const { data: productsData, isLoading } = useProducts(
    page,
    limit,
    debouncedSearchTerm
  );

  useEffect(() => {
    if (productsData) {
      setTotalPages(productsData.totalPages);
    }
  }, [productsData]);

  if (isLoading) return <div>Chargement...</div>;

  return (
    <>
      <Table className="border-background rounded-xl text-base overflow-hidden">
        <TableCaption className="text-background sr-only">
          Une liste de vos produits récents.
        </TableCaption>
        <TableHeader className="text-background bg-tableHead border">
          <TableRow className="text-base">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Référence
            </TableHead>
            <TableHead className="text-background w-[300px] font-semibold">
              Modèle
            </TableHead>
            <TableHead className="text-background w-[200px] font-semibold">
              Date
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Quantité
            </TableHead>
            <TableHead className="text-background w-[150px] font-semibold">
              Type
            </TableHead>
            <TableHead className="text-background w-[250px] font-semibold">
              Progression (client)
            </TableHead>
            <TableHead className="text-background w-[190px] font-semibold text-center">
              Statut (faconnier)
            </TableHead>
            <TableHead className="text-background w-[200px] font-semibold text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base border">
          {productsData?.products.length === 0 && (
            <TableRow className="h-[55px]">
              <TableCell colSpan={9} className="text-center">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          )}
          {productsData?.products.map((product) => (
            <Fragment key={product.id}>
              <TableRow
                className="h-[55px] hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleShowNestedTable(product.id)}
              >
                <TableCell className="font-medium">
                  {nestedTable === product.id ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {product.reference}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(product.productImage, "product")}
                      alt={product.id}
                      className="w-14 h-14 rounded-lg"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = defaultProductImage;
                      }}
                    />
                    <span className="text-lg">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-background/80">
                  {formatDateToDDMMYYYY(product.createdAt)}
                </TableCell>
                <TableCell className="text-background/80">
                  {product.totalQty}
                </TableCell>
                <TableCell className="text-background/80">
                  {product.type ? (
                    <Badge className="bg-secondary">
                      {product.type.replace("_", " + ")}
                    </Badge>
                  ) : (
                    "------"
                  )}
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center gap-2 w-[90%]">
                    <Progress
                      className="w-[80%]"
                      value={
                        (product.ProductStatus?.quantity_with_client * 100) /
                        product.totalQty
                      }
                    />
                    <span className="w-[15%]">
                      {(
                        (product.ProductStatus?.quantity_with_client * 100) /
                        product.totalQty
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center justify-center h-full">
                    {getProductionStatus(product)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 justify-end">
                    <Eye
                      className="w-7 h-7 cursor-pointer text-background/70 border border-background/50 rounded-md p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setOpenSheet(true);
                      }}
                    />
                    <Pencil
                      className="w-7 h-7 cursor-pointer text-success border border-success/90 rounded-md p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setOpenEditDialog(true);
                      }}
                    />
                    <TransferProductDropDown
                      product={product}
                      setSelectedProduct={setSelectedProduct}
                      setSelectedTransferTo={setSelectedTransferTo}
                      setOpenTransferDialogFaconnier={
                        setOpenTransferDialogFaconnier
                      }
                      setOpenTransferDialogClient={setOpenTransferDialogClient}
                      setOpenTransferDialogStylist={
                        setOpenTransferDialogStylist
                      }
                    />
                    <Trash2
                      className="w-7 h-7 cursor-pointer text-destructive/70 border border-destructive/50 rounded-md p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setOpenDeleteDialog(true);
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
              {nestedTable === product.id && (
                <TableRow className="">
                  <TableCell colSpan={9} className="p-0">
                    <div>
                      <Table className="text-base w-full bg-muted-foreground">
                        <TableHeader className="text-background bg-tableHead border">
                          <TableRow className="text-base">
                            <TableHead className="text-background">
                              Faconnier
                            </TableHead>
                            <TableHead className="text-background">
                              Numéro de bon
                            </TableHead>
                            <TableHead className="text-background">
                              Date
                            </TableHead>
                            <TableHead className="text-background">
                              Pcs
                            </TableHead>
                            <TableHead className="text-background">
                              Retourné
                            </TableHead>
                            <TableHead className="text-background">
                              Restant
                            </TableHead>
                            <TableHead className="text-background">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.FaconnierOrderItems.length === 0 && (
                            <TableRow className="h-[55px]">
                              <TableCell colSpan={7} className="text-center">
                                Aucun faconnier trouvé
                              </TableCell>
                            </TableRow>
                          )}
                          {product.FaconnierOrderItems.length > 0 &&
                            product.FaconnierOrderItems.map((item) => (
                              <TableRow className="h-[55px]" key={item.id}>
                                <TableCell className="font-medium">
                                  {item.faconnierOrder.faconnier.name}
                                </TableCell>
                                <TableCell>
                                  bon #
                                  {item.faconnierOrder.bon_number.bon_number}
                                </TableCell>
                                <TableCell>
                                  {formatDateToDDMMYYYY(
                                    item.faconnierOrder.createdAt
                                  )}
                                </TableCell>
                                <TableCell>{item.quantity_sent}</TableCell>
                                <TableCell>{item.quantity_returned}</TableCell>
                                <TableCell>
                                  {item.quantity_sent - item.quantity_returned}
                                </TableCell>
                                <TableCell>
                                  {item.quantity_sent !==
                                  item.quantity_returned ? (
                                    <p className="text-secondary">En cours</p>
                                  ) : (
                                    <p className="text-destructive">Terminé</p>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
