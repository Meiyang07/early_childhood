import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { config, today, validateRecord, type AdminRecord, type Field, type Kind } from '@/types/admin';
import { Choice } from '@/components/Common/Choice';

export function RecordEditor({
  kind, record, onClose, onSave,
}: {
  kind: Kind;
  record?: AdminRecord;
  onClose: () => void;
  onSave: (values: { name: string; status: string; data: Record<string, string> }) => void;
}) {
  const def = config[kind];
  const [name, setName] = useState(record?.name ?? '');
  const [status, setStatus] = useState(record?.status ?? def.statuses[0]);
  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...Object.fromEntries(
      def.fields.map((f) => [f.key, f.type === 'date' ? today() : f.options?.[0] ?? '']),
    ),
    ...record?.data,
  }));
  const [error, setError] = useState('');

  useEffect(() => {
    // Keep editor state if record changes externally
  }, [record?.id]);

  function update(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError('');
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      validateRecord(kind, { name, status, data: values });
      onSave({ name, status, data: values });
    } catch (e) {
      const msg = (e as Error).message;
      setError(msg);
      toast.error(msg);
    }
  }

  function renderField(field: Field) {
    const id = `editor-${field.key}`;
    const value = values[field.key] ?? '';
    return (
      <div className={`form-field ${field.type === 'textarea' ? 'full-width' : ''}`} key={field.key}>
        <label htmlFor={id}>
          {field.label}
          {field.required && <span> *</span>}
        </label>
        {field.type === 'select' ? (
          <Choice id={id} value={value} options={field.options ?? []} onChange={(v) => update(field.key, v)} label={field.label} />
        ) : field.type === 'textarea' ? (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => update(field.key, e.target.value)}
            required={field.required}
            maxLength={12000}
            rows={kind === 'blog' && field.key === 'body' ? 9 : 4}
          />
        ) : (
          <Input
            id={id}
            type={field.type ?? 'text'}
            value={value}
            onChange={(e) => update(field.key, e.target.value)}
            required={field.required}
            maxLength={300}
            min={field.min}
            max={field.key === 'birthDate' ? today() : field.max}
            step={field.type === 'number' ? '1' : undefined}
          />
        )}
      </div>
    );
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="editor-dialog">
        <DialogHeader>
          <DialogTitle>{record ? 'Edit' : 'Add'} {def.singular}</DialogTitle>
          <DialogDescription>{def.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="editor-form">
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="record-name">{def.nameLabel} *</label>
              <Input
                id="record-name"
                autoFocus
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                required
                minLength={2}
                maxLength={160}
              />
            </div>
            {def.fields.map(renderField)}
            <div className="form-field">
              <label htmlFor="record-status">Status</label>
              <Choice id="record-status" value={status} options={def.statuses} onChange={setStatus} label="Status" />
            </div>
          </div>

          {record?.data.example === 'true' && (
            <p className="form-example">This is an example record from the design reference.</p>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="primary-button">
              {record ? 'Save changes' : `Add ${def.singular}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}