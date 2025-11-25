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
import { useRetardOrdersFaconnier } from "@/hooks/useDashboard";
import { useCancelOrderFaconnier } from "@/hooks/useFaconnier";
import { getImageUrl } from "@/lib/utils";
import {
  ClockAlert,
  Package,
  User,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";

export default function RetardOrdersFaconnier() {
  const { data: retardOrdersFaconnier } = useRetardOrdersFaconnier();
  const { mutate: cancelOrderMutation, isPending } = useCancelOrderFaconnier();

  const handleCancelOrder = (orderId: string) => {
    cancelOrderMutation(orderId);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-background p-2 sm:p-2.5 rounded-lg">
          <ClockAlert className="w-6 h-6 sm:w-8 sm:h-8 text-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-bagel">
          Commandes en retard
        </h2>
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden lg:block">
        <Table className="border-background/10 rounded-xl text-base border">
          <TableCaption className="sr-only">
            Liste des commandes en retard
          </TableCaption>
          <TableHeader className="text-background bg-tableHead border">
            <TableRow>
              <TableHead className="text-background">Référence</TableHead>
              <TableHead className="text-background">Produit</TableHead>
              <TableHead className="text-background">Faconnier</TableHead>
              <TableHead className="text-background">Bon n°</TableHead>
              <TableHead className="text-background text-center">
                Quantité attendue
              </TableHead>
              <TableHead className="text-background text-center">
                Quantité retournée
              </TableHead>
              <TableHead className="text-center text-background">
                Retard (jours)
              </TableHead>
              <TableHead className="text-right text-background">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-base">
            {retardOrdersFaconnier?.faconniers.map((faconnier) => (
              <TableRow
                key={faconnier.id}
                className="h-[55px] hover:shadow-sm transition-all"
              >
                <TableCell className="font-medium border-l">
                  {faconnier.reference}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(faconnier.productImage, "product")}
                      alt={faconnier.productName}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100 border"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = defaultProductImage;
                      }}
                    />
                    <span className="text-lg">{faconnier.productName}</span>
                  </div>
                </TableCell>
                <TableCell>{faconnier.faconnierName}</TableCell>
                <TableCell>Bon #{faconnier.bonNumber}</TableCell>
                <TableCell className="text-center">
                  {faconnier.quantityExpected}{" "}
                  {faconnier.quantityExpected > 1 ? "pcs" : "pc"}
                </TableCell>
                <TableCell className="text-center">
                  {faconnier.quantityReturned}{" "}
                  {faconnier.quantityReturned > 1 ? "pcs" : "pc"}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-destructive/10 text-destructive">
                    <Calendar className="w-4 h-4" />
                    {faconnier.delayDays} jours
                  </span>
                </TableCell>
                <TableCell className="text-right border-r">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleCancelOrder(faconnier.id)}
                  >
                    Annuler
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Visible on Mobile & Tablet */}
      <div className="lg:hidden space-y-4">
        {retardOrdersFaconnier?.faconniers.map((faconnier) => (
          <div
            key={faconnier.id}
            className="bg-card border border-border rounded-xl p-4 space-y-4 hover:shadow-md transition-shadow"
          >
            {/* Product Info */}
            <div className="flex items-start gap-3">
              <img
                src={getImageUrl(faconnier.productImage, "product")}
                alt={faconnier.productName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100 border"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = defaultProductImage;
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  {faconnier.productName}
                </h3>
                <p className="text-sm text-background/50 mt-1">
                  Réf: {faconnier.reference}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {/* Faconnier */}
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-background/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-background/50">Faconnier</p>
                  <p className="font-medium truncate">
                    {faconnier.faconnierName}
                  </p>
                </div>
              </div>

              {/* Bon Number */}
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-background/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-background/50">Bon</p>
                  <p className="font-medium">#{faconnier.bonNumber}</p>
                </div>
              </div>

              {/* Quantity Expected */}
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-background/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-background/50">Attendue</p>
                  <p className="font-medium">
                    {faconnier.quantityExpected}{" "}
                    {faconnier.quantityExpected > 1 ? "pcs" : "pc"}
                  </p>
                </div>
              </div>

              {/* Quantity Returned */}
              <div className="flex items-start gap-2">
                <TrendingDown className="w-4 h-4 text-background/50 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-background/50">Retournée</p>
                  <p className="font-medium">
                    {faconnier.quantityReturned}{" "}
                    {faconnier.quantityReturned > 1 ? "pcs" : "pc"}
                  </p>
                </div>
              </div>
            </div>

            {/* Delay Badge & Cancel Button */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>{faconnier.delayDays} jours de retard</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={() => handleCancelOrder(faconnier.id)}
                className="ml-2"
              >
                Annuler
              </Button>
            </div>
          </div>
        ))}

        {/* Empty State for Mobile */}
        {(!retardOrdersFaconnier?.faconniers ||
          retardOrdersFaconnier.faconniers.length === 0) && (
          <div className="text-center py-12 text-background/50">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune commande en retard</p>
          </div>
        )}
      </div>

      {/* Empty State for Desktop */}
      {(!retardOrdersFaconnier?.faconniers ||
        retardOrdersFaconnier.faconniers.length === 0) && (
        <div className="hidden lg:block text-center py-12 text-background/50 border rounded-xl">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune commande en retard</p>
        </div>
      )}
    </div>
  );
}
