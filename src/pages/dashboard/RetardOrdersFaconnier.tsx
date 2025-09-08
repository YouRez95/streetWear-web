import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import { useRetardOrdersFaconnier } from "@/hooks/useDashboard";
import { getImageUrl } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClockAlert } from "lucide-react";

export default function RetardOrdersFaconnier() {
  const { data: retardOrdersFaconnier } = useRetardOrdersFaconnier();

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold font-bagel flex items-center gap-2">
        <ClockAlert className="w-10 h-10 bg-background p-2 rounded-lg text-foreground" />
        Commandes en retard
      </h2>
      <Table className="border-background rounded-xl text-base">
        <TableCaption className="sr-only">
          A list of your recent invoices.
        </TableCaption>
        <TableHeader className="text-background bg-tableHead border">
          <TableRow className="">
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
            <TableHead className="text-right text-background mr-2">
              Retard (jours)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-base">
          {retardOrdersFaconnier?.faconniers &&
            retardOrdersFaconnier.faconniers.length === 0 && (
              <TableRow className="h-[55px]">
                <TableCell colSpan={7} className="text-center">
                  Aucune commande en retard trouvée
                </TableCell>
              </TableRow>
            )}
          {retardOrdersFaconnier?.faconniers.map((faconnier) => (
            <TableRow
              key={faconnier.id}
              className="h-[55px] hover:shadow-sm transition-all border"
            >
              <TableCell className="font-medium">
                {faconnier.reference}
              </TableCell>
              <TableCell className="font-medium min-w-[200px]">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(faconnier.productImage, "product")}
                    alt={faconnier.productName}
                    className="w-14 h-14 rounded-lg"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = defaultProductImage;
                    }}
                  />
                  <span className="text-lg text-wrap">
                    {faconnier.productName}
                  </span>
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
              <TableCell className="text-right mr-2">
                {faconnier.delayDays} jours
              </TableCell>
            </TableRow>
          ))}

          {/* {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </div>
  );
}
