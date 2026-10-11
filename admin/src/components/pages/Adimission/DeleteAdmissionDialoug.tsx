import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AdmissionApplication } from "@/types/adimission";

export function DeleteAdmissionDialog({
  application,
  onCancel,
  onConfirm,
  isPending,
}: {
  application: AdmissionApplication | null;
  onCancel: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <AlertDialog
      open={!!application}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete application for {application?.childInfo.fullName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the admission application and cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            )}
          >
            {isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}