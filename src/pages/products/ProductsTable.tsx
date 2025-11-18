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
  Package,
  Palette,
  Pencil,
  Trash2,
  Users,
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
  expandedSection: {
    [key: string]: "clients" | "faconniers" | "stylists" | null;
  };
  onToggleNested: (id: string) => void;
  onToggleSection: (
    productId: string,
    section: "clients" | "faconniers" | "stylists"
  ) => void;
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
  expandedSection,
  onToggleNested,
  onToggleSection,
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
      <button
        onClick={() => onToggleNested(product.id)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors text-blue-700 text-sm font-medium mb-2"
      >
        <span>Détails du produit</span>
        {nestedTable === product.id ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Nested Content */}
      {nestedTable === product.id && (
        <div className="mt-4 pt-4 border-t space-y-3">
          {/* CLIENT DISTRIBUTION SECTION */}
          {(product.ClientOrdersItems?.length || 0) > 0 && (
            <div className="bg-blue-50 rounded-lg border overflow-hidden">
              <button
                onClick={() => onToggleSection(product.id, "clients")}
                className="w-full px-3 py-2 flex items-center justify-between bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-800 text-sm">
                    Distribution Clients
                  </span>
                  <Badge className="bg-blue-500 hover:bg-blue-500 text-white text-xs">
                    {product.ClientOrdersItems?.length || 0}
                  </Badge>
                </div>
                {expandedSection[product.id] === "clients" ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {expandedSection[product.id] === "clients" && (
                <div className="p-3 space-y-2">
                  {product.ClientOrdersItems?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-md p-3 text-xs space-y-2 border"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {item.clientOrder.client
                              ? item.clientOrder.client.name
                              : `${item.passagerName} (Passager)`}
                          </div>
                          <div className="text-gray-600">
                            Bon #{item.clientOrder.bon_number.bon_number}
                          </div>
                        </div>
                        <Badge
                          className={
                            item.clientOrder.bon_number.bonStatus === "OPEN"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {item.clientOrder.bon_number.bonStatus === "OPEN"
                            ? "Ouvert"
                            : "Fermé"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                        <div>
                          <div className="text-gray-600">Quantité</div>
                          <div className="font-semibold text-gray-900">
                            {item.quantity} pcs
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Retourné</div>
                          <div className="font-semibold text-red-600">
                            {item.returned} pcs
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        {formatDateToDDMMYYYY(item.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FACONNIER ORDERS SECTION */}
          {(product.FaconnierOrderItems?.length || 0) > 0 && (
            <div className="bg-purple-50 rounded-lg border overflow-hidden">
              <button
                onClick={() => onToggleSection(product.id, "faconniers")}
                className="w-full px-3 py-2 flex items-center justify-between bg-purple-100 hover:bg-purple-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-gray-800 text-sm">
                    Commandes Faconnier
                  </span>
                  <Badge className="bg-purple-500 hover:bg-purple-500 text-white text-xs">
                    {product.FaconnierOrderItems?.length || 0}
                  </Badge>
                </div>
                {expandedSection[product.id] === "faconniers" ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {expandedSection[product.id] === "faconniers" && (
                <div className="p-3 space-y-2">
                  {product.FaconnierOrderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-md p-3 text-xs space-y-2 border"
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
                        <div className="flex flex-col items-end gap-1">
                          {item.quantity_sent !== item.quantity_returned ? (
                            <Badge className="bg-orange-100 text-orange-700">
                              En cours
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700">
                              Terminé
                            </Badge>
                          )}
                          <Badge
                            className={
                              item.faconnierOrder.bon_number.bonStatus ===
                              "OPEN"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {item.faconnierOrder.bon_number.bonStatus === "OPEN"
                              ? "Ouvert"
                              : "Fermé"}
                          </Badge>
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
                      <div className="text-gray-600">
                        {formatDateToDDMMYYYY(item.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STYLIST ORDERS SECTION */}
          {product.StyleTraitOrderItems &&
            product.StyleTraitOrderItems.length > 0 && (
              <div className="bg-amber-50 rounded-lg border overflow-hidden">
                <button
                  onClick={() => onToggleSection(product.id, "stylists")}
                  className="w-full px-3 py-2 flex items-center justify-between bg-amber-100 hover:bg-amber-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-gray-800 text-sm">
                      Commandes Styliste
                    </span>
                    <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs">
                      {product.StyleTraitOrderItems?.length || 0}
                    </Badge>
                  </div>
                  {expandedSection[product.id] === "stylists" ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {expandedSection[product.id] === "stylists" && (
                  <div className="p-3 space-y-2">
                    {product.StyleTraitOrderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-md p-3 text-xs space-y-2 border"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {item.styleTraitOrder.styleTrait.name}
                            </div>
                            <div className="text-gray-600">
                              Bon #{item.styleTraitOrder.bon_number.bon_number}
                            </div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-700">
                            {item.styleTraitOrder.styleTrait.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                          <div>
                            <div className="text-gray-600">Quantité</div>
                            <div className="font-semibold text-gray-900">
                              {item.quantity_sent}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Prix Unitaire</div>
                            <div className="font-semibold text-gray-900">
                              {item.unit_price} DH
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <div className="text-gray-600">Total</div>
                          <div className="font-semibold text-gray-900">
                            {item.quantity_sent * item.unit_price} DH
                          </div>
                        </div>
                        <div className="text-gray-600">
                          {formatDateToDDMMYYYY(item.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
  const [expandedSection, setExpandedSection] = useState<{
    [key: string]: "clients" | "faconniers" | "stylists" | null;
  }>({});

  const handleShowNestedTable = (id: string) => {
    setNestedTable((prev) => {
      if (prev === id) {
        setExpandedSection({});
        return null;
      }
      return id;
    });
  };

  const toggleSection = (
    productId: string,
    section: "clients" | "faconniers" | "stylists"
  ) => {
    setExpandedSection((prev) => ({
      ...prev,
      [productId]: prev[productId] === section ? null : section,
    }));
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

                {/* EXPANDED NESTED VIEW */}
                {nestedTable === product.id && (
                  <TableRow className="">
                    <TableCell colSpan={9} className="p-0 bg-muted/30">
                      <div className="p-4 space-y-3">
                        {/* CLIENT DISTRIBUTION SECTION */}
                        <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(product.id, "clients");
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold text-gray-800">
                                Distribution Clients
                              </span>
                              <Badge className="bg-blue-500 hover:bg-blue-500 text-white">
                                {product.ClientOrdersItems?.length || 0} clients
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Total:{" "}
                                {product.ClientOrdersItems?.reduce(
                                  (sum, item) =>
                                    sum + item.quantity - item.returned,
                                  0
                                ) || 0}{" "}
                                pcs
                              </span>
                            </div>
                            {expandedSection[product.id] === "clients" ? (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                          </button>

                          {expandedSection[product.id] === "clients" && (
                            <div className="overflow-x-auto">
                              <Table className="text-base">
                                <TableHeader className="bg-muted">
                                  <TableRow>
                                    <TableHead className="text-background/50">
                                      Client
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      N° Bon
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Date
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Quantité
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Retourné
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Statut Bon
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {product.ClientOrdersItems?.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-background/50"
                                      >
                                        Aucune distribution client pour ce
                                        produit
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    product.ClientOrdersItems.map((item) => (
                                      <TableRow
                                        key={item.id}
                                        className="h-[50px]"
                                      >
                                        <TableCell className="font-medium">
                                          {item.clientOrder.client ? (
                                            item.clientOrder.client.name
                                          ) : (
                                            <span>
                                              {item.passagerName}{" "}
                                              <small>(Passager)</small>
                                            </span>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          bon #
                                          {
                                            item.clientOrder.bon_number
                                              .bon_number
                                          }
                                        </TableCell>
                                        <TableCell>
                                          {formatDateToDDMMYYYY(item.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                          <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700 font-semibold">
                                            {item.quantity} pcs
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <Badge className="bg-red-100 hover:bg-blue-100 text-red-700 font-semibold">
                                            {item.returned} pcs
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            className={
                                              item.clientOrder.bon_number
                                                .bonStatus === "OPEN"
                                                ? "bg-green-100 hover:bg-green-100 text-green-700"
                                                : "bg-gray-100 hover:bg-gray-100 text-gray-700"
                                            }
                                          >
                                            {item.clientOrder.bon_number
                                              .bonStatus === "OPEN"
                                              ? "Ouvert"
                                              : "Fermé"}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>

                        {/* FACONNIER ORDERS SECTION */}
                        <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(product.id, "faconniers");
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Package className="w-5 h-5 text-purple-600" />
                              <span className="font-semibold text-gray-800">
                                Commandes Faconnier
                              </span>
                              <Badge className="bg-purple-500 hover:bg-purple-500 text-white">
                                {product.FaconnierOrderItems?.length || 0}{" "}
                                commandes
                              </Badge>
                            </div>
                            {expandedSection[product.id] === "faconniers" ? (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-600" />
                            )}
                          </button>

                          {expandedSection[product.id] === "faconniers" && (
                            <div className="overflow-x-auto">
                              <Table className="text-base">
                                <TableHeader className="bg-muted">
                                  <TableRow>
                                    <TableHead className="text-background/50">
                                      Faconnier
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      N° Bon
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Date
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Envoyé
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Retourné
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Restant
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Statut Bon
                                    </TableHead>
                                    <TableHead className="text-background/50">
                                      Statut Commande
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {product.FaconnierOrderItems?.length === 0 ? (
                                    <TableRow>
                                      <TableCell
                                        colSpan={8}
                                        className="text-center py-8 text-background/50"
                                      >
                                        Aucune commande faconnier
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    product.FaconnierOrderItems?.map((item) => (
                                      <TableRow
                                        key={item.id}
                                        className="h-[50px]"
                                      >
                                        <TableCell className="font-medium">
                                          {item.faconnierOrder.faconnier.name}
                                        </TableCell>
                                        <TableCell>
                                          bon #
                                          {
                                            item.faconnierOrder.bon_number
                                              .bon_number
                                          }
                                        </TableCell>
                                        <TableCell>
                                          {formatDateToDDMMYYYY(item.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                          {item.quantity_sent}
                                        </TableCell>
                                        <TableCell>
                                          {item.quantity_returned}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                          {item.quantity_sent -
                                            item.quantity_returned}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            className={
                                              item.faconnierOrder.bon_number
                                                .bonStatus === "OPEN"
                                                ? "bg-green-100 hover:bg-green-100 text-green-700"
                                                : "bg-gray-100 hover:bg-gray-100 text-gray-700"
                                            }
                                          >
                                            {item.faconnierOrder.bon_number
                                              .bonStatus === "OPEN"
                                              ? "Ouvert"
                                              : "Fermé"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {item.quantity_sent !==
                                          item.quantity_returned ? (
                                            <Badge className="bg-orange-100 hover:bg-orange-100 text-orange-700">
                                              En cours
                                            </Badge>
                                          ) : (
                                            <Badge className="bg-green-100 hover:bg-green-100 text-green-700">
                                              Terminé
                                            </Badge>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>

                        {/* STYLIST ORDERS SECTION */}
                        {product.StyleTraitOrderItems &&
                          product.StyleTraitOrderItems.length > 0 && (
                            <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSection(product.id, "stylists");
                                }}
                                className="w-full px-4 py-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Palette className="w-5 h-5 text-amber-600" />
                                  <span className="font-semibold text-gray-800">
                                    Commandes Styliste
                                  </span>
                                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white">
                                    {product.StyleTraitOrderItems?.length || 0}{" "}
                                    commandes
                                  </Badge>
                                </div>
                                {expandedSection[product.id] === "stylists" ? (
                                  <ChevronDown className="w-5 h-5 text-gray-600" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-600" />
                                )}
                              </button>

                              {expandedSection[product.id] === "stylists" && (
                                <div className="overflow-x-auto">
                                  <Table className="text-base">
                                    <TableHeader className="bg-muted">
                                      <TableRow>
                                        <TableHead className="text-background/50">
                                          Styliste
                                        </TableHead>
                                        <TableHead className="text-background/50">
                                          Type
                                        </TableHead>
                                        <TableHead className="text-background/50">
                                          N° Bon
                                        </TableHead>
                                        <TableHead className="text-background/50">
                                          Date
                                        </TableHead>
                                        <TableHead className="text-background/50">
                                          Quantité
                                        </TableHead>
                                        <TableHead className="text-background/50">
                                          Prix Unitaire
                                        </TableHead>
                                        <TableHead className="text-background/50">
                                          Total
                                        </TableHead>
                                        <TableHead className="text-background/50">
                                          Statut Bon
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {product.StyleTraitOrderItems?.map(
                                        (item) => (
                                          <TableRow
                                            key={item.id}
                                            className="h-[50px]"
                                          >
                                            <TableCell className="font-medium">
                                              {
                                                item.styleTraitOrder.styleTrait
                                                  .name
                                              }
                                            </TableCell>
                                            <TableCell>
                                              <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700">
                                                {
                                                  item.styleTraitOrder
                                                    .styleTrait.type
                                                }
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              bon #
                                              {
                                                item.styleTraitOrder.bon_number
                                                  .bon_number
                                              }
                                            </TableCell>
                                            <TableCell>
                                              {formatDateToDDMMYYYY(
                                                item.createdAt
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {item.quantity_sent}
                                            </TableCell>
                                            <TableCell>
                                              {item.unit_price} DH
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                              {item.quantity_sent *
                                                item.unit_price}{" "}
                                              DH
                                            </TableCell>
                                            <TableCell>
                                              <Badge
                                                className={
                                                  item.styleTraitOrder
                                                    .bon_number.bonStatus ===
                                                  "OPEN"
                                                    ? "bg-green-100 hover:bg-green-100 text-green-700"
                                                    : "bg-gray-100 hover:bg-gray-100 text-gray-700"
                                                }
                                              >
                                                {item.styleTraitOrder.bon_number
                                                  .bonStatus === "OPEN"
                                                  ? "Ouvert"
                                                  : "Fermé"}
                                              </Badge>
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </div>
                          )}
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
            expandedSection={expandedSection}
            onToggleNested={handleShowNestedTable}
            onToggleSection={toggleSection}
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
