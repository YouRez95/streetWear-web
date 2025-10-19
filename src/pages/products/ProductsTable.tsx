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
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import TransferProductDropDown from "./TransferProductDropDown";
import type { Product } from "@/types/models";
import { Button } from "@/components/ui/button";

type ProductsTableProps = {
  setOpenSheet: (open: boolean) => void;
  search: string;
  page: number;
  setTotalPages: (totalPages: number) => void;
  date: "asc" | "desc";
  setDate: (date: "asc" | "desc") => void;
  limit: number;
  setOpenEditDialog: (open: boolean) => void;
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

type ProductCardProps = {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onTransfer: (product: Product) => void;
  nestedTable: string | null;
  onToggleNested: (id: string) => void;
  setSelectedTransferTo: (
    transferTo: "faconnier" | "client" | "stylist" | null
  ) => void;
  setOpenTransferDialogFaconnier: (open: boolean) => void;
  setOpenTransferDialogClient: (open: boolean) => void;
  setOpenTransferDialogStylist: (open: boolean) => void;
};

// Mobile Card Component
function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
  onTransfer,
  nestedTable,
  onToggleNested,
  setSelectedTransferTo,
  setOpenTransferDialogClient,
  setOpenTransferDialogFaconnier,
  setOpenTransferDialogStylist,
}: ProductCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Image, Ref, Name */}
      <div className="flex gap-3 mb-4">
        <LazyLoadImage
          src={getImageUrl(product.productImage, "product")}
          loading="lazy"
          alt={product.id}
          effect="blur"
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = defaultProductImage;
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 font-medium mb-1">
            Référence: {product.reference}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {product.name}
          </h3>
          <div className="text-xs text-gray-500 mt-1">
            {formatDateToDDMMYYYY(product.createdAt)}
          </div>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b">
        <div>
          <div className="text-xs text-gray-500 font-medium mb-1">Quantité</div>
          <div className="text-lg font-bold text-gray-900">
            {product.totalQty}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium mb-1">Type</div>
          <div>
            {product.type ? (
              <Badge className="bg-secondary text-xs">
                {product.type.replace("_", " + ")}
              </Badge>
            ) : (
              <span className="text-xs text-gray-400">------</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 pb-4 border-b">
        <div className="text-xs text-gray-500 font-medium mb-2">
          Progression (client)
        </div>
        <div className="flex items-center gap-2">
          <Progress
            className="flex-1"
            value={
              (product.ProductStatus?.quantity_with_client * 100) /
              product.totalQty
            }
          />
          <span className="text-sm font-semibold text-gray-900 min-w-[45px]">
            {(
              (product.ProductStatus?.quantity_with_client * 100) /
              product.totalQty
            ).toFixed(1)}
            %
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4 pb-4 border-b">
        <div className="text-xs text-gray-500 font-medium mb-2">
          Statut (faconnier)
        </div>
        <div>{getProductionStatus(product)}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => onView(product)}
          className="flex-1 border flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors text-gray-700 text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>Voir</span>
        </button>
        <button
          onClick={() => onEdit(product)}
          className="flex-1 flex border items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 rounded-md transition-colors text-green-700 text-sm font-medium"
        >
          <Pencil className="w-4 h-4" />
          <span>Éditer</span>
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex-1 flex border items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-md transition-colors text-red-700 text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          <span>Supprimer</span>
        </button>
      </div>

      {/* Transfer Dropdown - Full Width */}
      <div className="mb-4">
        <TransferProductDropDown
          product={product}
          setSelectedProduct={onTransfer}
          setSelectedTransferTo={setSelectedTransferTo}
          setOpenTransferDialogFaconnier={setOpenTransferDialogFaconnier}
          setOpenTransferDialogClient={setOpenTransferDialogClient}
          setOpenTransferDialogStylist={setOpenTransferDialogStylist}
        />
      </div>

      {/* Nested Table Toggle */}
      {product.FaconnierOrderItems.length > 0 && (
        <button
          onClick={() => onToggleNested(product.id)}
          className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors text-blue-700 text-sm font-medium"
        >
          <span>Détails Faconnier ({product.FaconnierOrderItems.length})</span>
          {nestedTable === product.id ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Nested Table */}
      {nestedTable === product.id && product.FaconnierOrderItems.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs font-semibold text-gray-700 mb-3">
            Commandes Faconnier
          </div>
          <div className="space-y-2">
            {product.FaconnierOrderItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-md p-3 text-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {item.faconnierOrder.faconnier.name}
                    </div>
                    <div className="text-gray-600">
                      Bon #{item.faconnierOrder.bon_number.bon_number}
                    </div>
                  </div>
                  <div>
                    {item.quantity_sent !== item.quantity_returned ? (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        En cours
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Terminé</Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <div className="text-gray-600">Envoyé</div>
                    <div className="font-semibold text-gray-900">
                      {item.quantity_sent}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Retourné</div>
                    <div className="font-semibold text-gray-900">
                      {item.quantity_returned}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Restant</div>
                    <div className="font-semibold text-gray-900">
                      {item.quantity_sent - item.quantity_returned}
                    </div>
                  </div>
                </div>
                <div className="text-gray-600 pt-1">
                  {formatDateToDDMMYYYY(item.faconnierOrder.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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
  date,
  setDate,
}: ProductsTableProps) {
  const [nestedTable, setNestedTable] = useState<string | null>(null);

  const handleShowNestedTable = (id: string) => {
    setNestedTable((prev) => (prev === id ? null : id));
  };

  const debouncedSearchTerm = useDebounce(search, 300);
  const { data: productsData, isLoading } = useProducts(
    page,
    limit,
    debouncedSearchTerm,
    date
  );

  useEffect(() => {
    if (productsData) {
      setTotalPages(productsData.totalPages);
    }
  }, [productsData]);

  if (isLoading) return <div className="p-4">Chargement...</div>;

  if (productsData?.products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Aucun produit trouvé</div>
    );
  }

  return (
    <>
      {/* Desktop View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDate(date === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
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
                  <TableCell className="font-medium max-w-[200px] min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <LazyLoadImage
                        src={getImageUrl(product.productImage, "product")}
                        loading="lazy"
                        alt={product.id}
                        effect="blur"
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = defaultProductImage;
                        }}
                      />
                      <span className="text-base truncate">{product.name}</span>
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
                        setOpenTransferDialogClient={
                          setOpenTransferDialogClient
                        }
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
                                  <TableCell>
                                    {item.quantity_returned}
                                  </TableCell>
                                  <TableCell>
                                    {item.quantity_sent -
                                      item.quantity_returned}
                                  </TableCell>
                                  <TableCell>
                                    {item.quantity_sent !==
                                    item.quantity_returned ? (
                                      <p className="text-secondary">En cours</p>
                                    ) : (
                                      <p className="text-destructive">
                                        Terminé
                                      </p>
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
      </div>

      {/* Mobile View - Visible only on mobile */}
      <div className="lg:hidden px-2">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Tri par date
          </span>
          <Button
            variant="ghost"
            className="border"
            size="sm"
            onClick={() => setDate(date === "asc" ? "desc" : "asc")}
          >
            <span>Date</span>
            {date === "asc" ? "↑" : "↓"}
          </Button>
        </div>
        {productsData?.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            nestedTable={nestedTable}
            onToggleNested={handleShowNestedTable}
            onView={(p: any) => {
              setSelectedProduct(p);
              setOpenSheet(true);
            }}
            onEdit={(p: any) => {
              setSelectedProduct(p);
              setOpenEditDialog(true);
            }}
            onDelete={(p: any) => {
              setSelectedProduct(p);
              setOpenDeleteDialog(true);
            }}
            onTransfer={setSelectedProduct}
            setOpenTransferDialogClient={setOpenTransferDialogClient}
            setOpenTransferDialogFaconnier={setOpenTransferDialogFaconnier}
            setOpenTransferDialogStylist={setOpenTransferDialogStylist}
            setSelectedTransferTo={setSelectedTransferTo}
          />
        ))}
      </div>
    </>
  );
}
