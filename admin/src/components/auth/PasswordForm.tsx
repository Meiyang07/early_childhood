import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';

export function PasswordForm() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (next !== confirm) {
      toast.error('New passwords do not match.');
      return;
    }
    setOpen(false);
    setCurrent('');
    setNext('');
    setConfirm('');
    toast.info('Password changes are handled by the developer. Ask them to update src/data/admin-account.ts.');
  }

  return (
    <>
      <Button className="password-change-button" variant="outline" onClick={() => setOpen(true)}>
        Change password
      </Button>

      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogContent className="message-dialog">
          <DialogHeader>
            <DialogTitle>Change admin password</DialogTitle>
            <DialogDescription>
              Password changes are managed by the developer.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="password-change-form">
            <div className="form-field">
              <label htmlFor="current-password">Current password</label>
              <Input id="current-password" type="password" autoComplete="current-password"
                value={current} onChange={(e) => setCurrent(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="new-password">New password</label>
              <Input id="new-password" type="password" autoComplete="new-password"
                value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} />
            </div>
            <div className="form-field">
              <label htmlFor="confirm-new-password">Confirm new password</label>
              <Input id="confirm-new-password" type="password" autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit" className="primary-button">Change password</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}