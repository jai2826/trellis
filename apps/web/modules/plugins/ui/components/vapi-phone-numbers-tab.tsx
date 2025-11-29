"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

import { useVapiPhoneNumbers } from "@/modules/plugins/hooks/use-vapi-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  CheckCircleIcon,
  PhoneIcon,
  XCircleIcon,
} from "lucide-react";

export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumbers, isLoading } =
    useVapiPhoneNumbers();
  const copyToClipboard = async (string: string) => {
    try {
      await navigator.clipboard.writeText(string);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy phone number");
    }
  };

  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">
              Phone Number
            </TableHead>
            <TableHead className="px-6 py-4">
              Name
            </TableHead>
            <TableHead className="px-6 py-4">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground">
                    Loading Phone Numbers
                  </TableCell>
                </TableRow>
              );
            }
            if (phoneNumbers?.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground">
                    No Phone Numbers Configured
                  </TableCell>
                </TableRow>
              );
            }
            return phoneNumbers?.map((phone) => (
              <TableRow
                className="hover:bg-muted/50"
                key={phone.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">
                      {phone.number || "Not configured"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-mono">
                    {phone.name || "Unnamed"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    className="capitalize"
                    variant={
                      phone.status === "active"
                        ? "default"
                        : "destructive"
                    }>
                    {phone.status === "active" ? (
                      <CheckCircleIcon className="mr-1 size-3" />
                    ) : (
                      <XCircleIcon className="mr-1 size-3" />
                    )}
                    {phone.status || "unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
