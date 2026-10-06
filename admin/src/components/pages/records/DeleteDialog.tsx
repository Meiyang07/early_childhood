import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { AdminRecord } from '@/types/admin';

export function DeleteDialog({
  record, onCancel, onConfirm,
}: {
  record: AdminRecord | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={!!record} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {record?.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the record from this admin workspace. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep record</AlertDialogCancel>
          <Button className="delete-confirm" onClick={onConfirm}>Remove record</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}