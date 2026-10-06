import { useState } from 'react';
import { Mail } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';


import { dateLabel, type AdminRecord } from '@/types/admin';
import { ExampleTag } from '@/components/Common/ExampleTag';
import { Status } from '@/components/Common/Status';
import { RowActions } from '@/components/Common/RowAction';

export function MessagesList({
  records, onOpen, onEdit, onRemove,
}: {
  records: AdminRecord[];
  onOpen: (record: AdminRecord) => void;
  onEdit: (record: AdminRecord) => void;
  onRemove: (record: AdminRecord) => void;
}) {
  const [message, setMessage] = useState<AdminRecord | null>(null);

  function open(record: AdminRecord) {
    setMessage(record);
    onOpen(record);
  }

  function close() {
    setMessage(null);
  }

  return (
    <>
      <div className="message-list">
        {records.map((record) => (
          <article className={`message-row ${record.status === 'Unread' ? 'unread' : ''}`} key={record.id}>
            <button className="message-open" onClick={() => open(record)}>
              <span className="message-avatar"><Mail size={21} /></span>
              <div>
                <h2>{record.data.subject}</h2>
                <p>{record.name} <ExampleTag record={record} /></p>
                <span className="message-preview">{record.data.body}</span>
              </div>
            </button>
            <div className="message-meta">
              <span>{dateLabel(record.data.date)}</span>
              <Status value={record.status} />
              <RowActions record={record} onEdit={onEdit} onRemove={onRemove} />
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!message} onOpenChange={(open) => !open && close()}>
        <DialogContent className="message-dialog">
          <DialogHeader>
            <DialogTitle>{message?.data.subject}</DialogTitle>
            <DialogDescription>
              {message?.name}
              {message?.data.email ? ` · ${message.data.email}` : ''}
            </DialogDescription>
          </DialogHeader>
          {message && (
            <>
              <Status value={message.status} />
              <div className="message-body">{message.data.body}</div>
              <span className="secondary-text">
                {dateLabel(message.data.date)} <ExampleTag record={message} />
              </span>
              <DialogFooter>
                {message.data.email && (
                  <a
                    className="primary-button"
                    href={`mailto:${encodeURIComponent(message.data.email)}?subject=${encodeURIComponent(`Re: ${message.data.subject}`)}`}
                  >
                    Open reply email
                  </a>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}