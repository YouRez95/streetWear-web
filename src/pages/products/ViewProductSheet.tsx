import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDateToDDMMYYYY, getImageUrl } from "@/lib/utils";
import type { Product } from "@/types/models";

type ViewProductSheetProps = {
  product: Product;
  setOpenSheet: (open: boolean) => void;
  openSheet: boolean;
};

export default function ViewProductSheet({
  product,
  setOpenSheet,
  openSheet,
}: ViewProductSheetProps) {
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent className="bg-foreground border w-[85vw] md:min-w-[500px] overflow-y-auto p-3 md:p-6">
        <SheetHeader>
          <SheetTitle className="text-background text-xl md:text-2xl font-bold">
            Détails du produit
          </SheetTitle>
          <SheetDescription className="text-background text-base">
            {product.description}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 text-background text-base pb-6">
          {/* Image */}
          <Card className="bg-muted border-none shadow-none">
            <CardContent className="md:p-4">
              <img
                src={getImageUrl(product.productImage, "product")}
                alt={product.name}
                className="w-full h-[280px] object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = defaultProductImage;
                }}
              />
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="py-2 md:py-6">
            <CardHeader className="px-2 md:px-3">
              <CardTitle className="">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-2 md:px-3">
              <InfoLine label="Nom" value={product.name} />
              <InfoLine
                label="Type"
                value={product.type ? product.type.replace("_", " + ") : "—"}
              />
              <InfoLine
                label="Quantité totale"
                value={`${product.totalQty} pcs`}
              />
            </CardContent>
          </Card>

          {/* Styliste History */}
          {product.StyleTraitOrderItems.length > 0 && (
            <Card className="py-2 md:py-6">
              <CardHeader className="px-2 md:px-3">
                <CardTitle>Historique du styliste</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <table className="min-w-full text-sm border-t border-border">
                  <thead className="bg-muted text-left">
                    <tr>
                      {[
                        "Styliste",
                        "Type",
                        "Bon",
                        "Date",
                        "Qté",
                        "Prix unitaire",
                        "Total",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-2 font-medium text-background/80"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.StyleTraitOrderItems.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-4 py-2">
                          {item.styleTraitOrder.styleTrait.name}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {item.styleTraitOrder.styleTrait.type}
                        </td>
                        <td className="px-4 py-2 text-center">
                          Bon #{item.styleTraitOrder.bon_number.bon_number}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {formatDateToDDMMYYYY(item.createdAt)}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {item.quantity_sent}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {item.unit_price.toFixed(2)} dh
                        </td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">
                          {(item.quantity_sent * item.unit_price).toFixed(2)} dh
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Product Status */}
          {product.ProductStatus && (
            <Card className="py-2 md:py-6">
              <CardHeader className="px-2 md:px-3">
                <CardTitle>Statut du produit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-2 md:px-3">
                <StatusLine
                  label="Quantité en stock"
                  value={product.ProductStatus.raw_in_stock}
                />
                <StatusLine
                  label="Au façonnier"
                  value={product.ProductStatus.quantity_at_faconnier}
                />
                <StatusLine
                  label="Prête"
                  value={product.ProductStatus.quantity_ready}
                />
                <StatusLine
                  label="Avec le client"
                  value={product.ProductStatus.quantity_with_client}
                />
                <StatusLine
                  label="Retournée par le client"
                  value={product.ProductStatus.quantity_returned_client || 0}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper for info display
function InfoLine({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-primary font-medium">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

// Helper for status display
function StatusLine({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between items-center px-2 py-1 rounded-md bg-muted">
      <span className="text-sm text-primary font-medium">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
