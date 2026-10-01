import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import type {GalleryItem} from './galleryData';

export type GalleryPhoto=GalleryItem&{id:string};
type Props={photos:GalleryPhoto[];selectedId:string;onSelect:(id:string)=>void;onClose:()=>void};

export default function GalleryViewer({photos,selectedId,onSelect,onClose}:Props){
  const dialog=useRef<HTMLDivElement>(null),closeButton=useRef<HTMLButtonElement>(null);
  const index=photos.findIndex(photo=>photo.id===selectedId),photo=photos[index];
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[photo?.image]);

  useEffect(()=>{
    const previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closeButton.current?.focus({preventScroll:true});
    return()=>{
      document.body.style.overflow=overflow;
      if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
    };
  },[]);

  function adjacent(step:number){if(index>=0&&photos.length>1)onSelect(photos[(index+step+photos.length)%photos.length].id);}
  useEffect(()=>{
    function keydown(event:KeyboardEvent){
      if(event.key==='Escape'){event.preventDefault();onClose();}
      else if(event.key==='ArrowLeft'){event.preventDefault();adjacent(-1);}
      else if(event.key==='ArrowRight'){event.preventDefault();adjacent(1);}
      else if(event.key==='Tab'){
        const controls=dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        if(!controls?.length){event.preventDefault();dialog.current?.focus();return;}
        const first=controls[0],last=controls[controls.length-1];
        if(event.shiftKey&&(document.activeElement===first||!dialog.current?.contains(document.activeElement))){event.preventDefault();last.focus();}
        else if(!event.shiftKey&&(document.activeElement===last||!dialog.current?.contains(document.activeElement))){event.preventDefault();first.focus();}
      }
    }
    window.addEventListener('keydown',keydown);
    return()=>window.removeEventListener('keydown',keydown);
  },[photos,selectedId,onSelect,onClose]);

  if(!photo)return null;
  // Render outside the animated page so its transforms cannot move the fixed viewer.
  return createPortal(<div className="modal-backdrop gallery-backdrop" role="presentation" onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <div ref={dialog} className="lightbox" role="dialog" aria-modal="true" aria-label={photo.alt} tabIndex={-1}>
      <button ref={closeButton} type="button" className="modal-close" onClick={onClose} aria-label="Close photo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19"/></svg></button>
      {failed?<p className="gallery-photo-error" role="alert">This photo could not be loaded. Close it and try another photo.</p>:<img key={photo.image} src={photo.image.startsWith('/')?photo.image:`/assets/${photo.image}`} alt={photo.alt} onError={()=>setFailed(true)}/>}
      <div className="lightbox-toolbar"><button type="button" onClick={()=>adjacent(-1)} disabled={photos.length<2} aria-label="Previous photo">←</button><p aria-live="polite">{photo.alt}<small>{index+1} / {photos.length}</small></p><button type="button" onClick={()=>adjacent(1)} disabled={photos.length<2} aria-label="Next photo">→</button></div>
    </div>
  </div>,document.body);
}
