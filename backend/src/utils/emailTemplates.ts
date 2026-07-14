// Templates d'emails transactionnels — même charte que l'email de contact
// (fond sombre #0f0f0f, accents dorés #c7a17a, titre serif).

const esc = (v: any) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c]));

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

// Coque commune (identique à l'email de contact)
const shell = (subtitle: string, bodyHtml: string): string => `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f0f0f; color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid #c7a17a;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-family: 'Times New Roman', Times, serif; color: #c7a17a; font-size: 28px; font-weight: normal; margin: 0; letter-spacing: 2px; text-transform: uppercase;">Maison Love Rooms</h1>
      <p style="color: #c7a17a; font-size: 12px; letter-spacing: 4px; margin-top: 5px; text-transform: uppercase;">${subtitle}</p>
    </div>
    ${bodyHtml}
    <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #888; font-size: 11px;">Maison Love Room · Cet email vous a été envoyé automatiquement.</p>
    </div>
  </div>`;

const card = (inner: string): string =>
  `<div style="background-color: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 20px;">${inner}</div>`;

const row = (label: string, value: string): string =>
  `<p style="margin: 0 0 15px 0; font-size: 14px;"><strong style="color: #c7a17a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">${esc(label)} :</strong><br/><span style="font-size: 16px; margin-top: 5px; display: inline-block; color:#ffffff;">${value}</span></p>`;

const totalBox = (total: number, label = 'Total payé'): string =>
  `<div style="text-align:center; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(199,161,122,0.3); border-radius: 8px;">
     <span style="color:#c7a17a; text-transform:uppercase; letter-spacing:1px; font-size:11px;">${esc(label)}</span><br/>
     <span style="font-family: 'Times New Roman', serif; font-size: 30px; color:#ffffff;">${total} €</span>
   </div>`;

const lineTable = (rows: string): string =>
  `<table style="width:100%; border-collapse:collapse;">${rows}</table>`;

const itemRow = (name: string, amount: number): string =>
  `<tr><td style="padding:6px 0; color:#e0e0e0; font-size:14px;">${name}</td><td style="padding:6px 0; text-align:right; color:#c7a17a; font-size:14px; white-space:nowrap;">${amount} €</td></tr>`;

const reservationRef = (r: any) => `ML-${String(r._id).slice(-6).toUpperCase()}`;

const refundBox = (amount: number): string =>
  `<div style="text-align:center; padding: 18px; margin-bottom:20px; border:1px solid rgba(199,161,122,0.3); border-radius:8px;">
     <span style="color:#c7a17a; text-transform:uppercase; letter-spacing:1px; font-size:11px;">Remboursement effectué</span><br/>
     <span style="font-family:'Times New Roman',serif; font-size:26px; color:#ffffff;">${amount} €</span><br/>
     <span style="color:#888; font-size:12px;">Le remboursement peut prendre quelques jours pour apparaître sur votre compte.</span>
   </div>`;

const questionsLine = `<p style="font-size:14px; color:#b0b0b0; line-height:1.6;">Pour toute question concernant cette annulation, répondez simplement à cet email.</p>`;

// ----- RÉSERVATION -----

export function reservationClientEmail(r: any) {
  const ref = reservationRef(r);
  const prestations = (r.prestations || []).map((p: any) =>
    itemRow(`${esc(p.name)}${p.quantity > 1 ? ` × ${p.quantity}` : ''}`, p.lineTotal)
  ).join('');
  const prestationsBlock = prestations
    ? card(`<strong style="color:#c7a17a; text-transform:uppercase; letter-spacing:1px; font-size:11px; display:block; margin-bottom:12px;">Prestations</strong>${lineTable(prestations)}`)
    : '';
  const body = `
    <p style="font-size:15px; color:#e0e0e0; line-height:1.6;">Bonjour ${esc(r.clientName)},<br/>Nous avons le plaisir de vous confirmer votre réservation.</p>
    ${card(
      row('Référence', ref) +
      row('Chambre', esc(r.suiteName)) +
      (r.formuleName ? row('Formule', esc(r.formuleName)) : '') +
      row('Dates', `${fmtDate(r.checkIn)} → ${fmtDate(r.checkOut)}`) +
      (r.arrivalTime ? row('Arrivée estimée', esc(r.arrivalTime)) : '')
    )}
    ${prestationsBlock}
    ${totalBox(r.totalPrice)}
    <p style="font-size:14px; color:#b0b0b0; line-height:1.6;">Vous recevrez vos codes d'accès et les informations pratiques par email avant votre arrivée. Pour toute question, répondez simplement à cet email.</p>`;
  return { subject: `Votre réservation à Maison Love Room est confirmée ✨ (${ref})`, html: shell('Réservation confirmée', body) };
}

export function reservationOwnerEmail(r: any) {
  const ref = reservationRef(r);
  const prestations = (r.prestations || []).map((p: any) => `${esc(p.name)}${p.quantity > 1 ? ` × ${p.quantity}` : ''}`).join(', ') || '—';
  const body = `
    ${card(
      row('Client', `${esc(r.clientName)}<br/>${esc(r.clientEmail)}${r.clientPhone ? ` · ${esc(r.clientPhone)}` : ''}`) +
      row('Chambre / Formule', `${esc(r.suiteName)} / ${esc(r.formuleName || '—')}`) +
      row('Dates', `${fmtDate(r.checkIn)} → ${fmtDate(r.checkOut)}`) +
      row('Prestations', prestations) +
      row('Total', `${r.totalPrice} €`) +
      row('Référence', ref)
    )}
    <p style="font-size:13px; color:#888;">La date a été bloquée automatiquement sur le calendrier.</p>`;
  return { subject: `🔔 Nouvelle réservation — ${esc(r.suiteName)} (${ref})`, html: shell('Nouvelle réservation', body) };
}

export function reservationCancelledEmail(r: any, refunded: boolean) {
  const ref = reservationRef(r);
  const body = `
    <p style="font-size:15px; color:#e0e0e0; line-height:1.6;">Bonjour ${esc(r.clientName)},<br/>Votre réservation a été annulée.</p>
    ${card(
      row('Référence', ref) +
      row('Chambre', esc(r.suiteName)) +
      row('Dates', `${fmtDate(r.checkIn)} → ${fmtDate(r.checkOut)}`)
    )}
    ${refunded ? refundBox(r.totalPrice) : questionsLine}`;
  return { subject: `Annulation de votre réservation Maison Love Room (${ref})`, html: shell('Réservation annulée', body) };
}

// ----- COMMANDE (Boutique / Carte cadeau) -----

const fulfillmentText = (o: any) =>
  o.fulfillment === 'livraison'
    ? `Livraison à : ${[o.customerAddress, o.customerPostalCode, o.customerCity].filter(Boolean).map(esc).join(', ')}`
    : 'Retrait sur place';

export function orderClientEmail(o: any) {
  const isGift = (o.items || []).some((i: any) => i.itemType === 'giftcard');
  const items = (o.items || []).map((i: any) => itemRow(`${esc(i.name)}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`, i.price * i.quantity)).join('');
  const body = `
    <p style="font-size:15px; color:#e0e0e0; line-height:1.6;">Bonjour ${esc(o.customerName)},<br/>Merci pour votre commande, bien reçue et payée.</p>
    ${card(lineTable(items))}
    ${card(
      row('Récupération', fulfillmentText(o)) +
      (isGift && o.recipientName ? row('Destinataire', esc(o.recipientName)) : '') +
      (o.note ? row('Message', esc(o.note)) : '')
    )}
    ${totalBox(o.total)}
    <p style="font-size:14px; color:#b0b0b0; line-height:1.6;">Nous vous recontactons rapidement pour la remise / l'envoi. Pour toute question, répondez à cet email.</p>`;
  return { subject: `Votre commande Maison Love Room est confirmée`, html: shell(isGift ? 'Carte cadeau confirmée' : 'Commande confirmée', body) };
}

export function orderOwnerEmail(o: any) {
  const items = (o.items || []).map((i: any) => `${esc(i.name)}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`).join(', ');
  const body = `
    ${card(
      row('Client', `${esc(o.customerName)}<br/>${esc(o.customerEmail)}${o.customerPhone ? ` · ${esc(o.customerPhone)}` : ''}`) +
      row('Article(s)', items) +
      row('Récupération', fulfillmentText(o)) +
      (o.recipientName ? row('Destinataire', esc(o.recipientName)) : '') +
      (o.note ? row('Message', esc(o.note)) : '') +
      row('Total', `${o.total} €`)
    )}`;
  return { subject: `🔔 Nouvelle commande — ${o.total} €`, html: shell('Nouvelle commande', body) };
}

export function orderCancelledEmail(o: any, refunded: boolean) {
  const items = (o.items || []).map((i: any) => `${esc(i.name)}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`).join(', ');
  const body = `
    <p style="font-size:15px; color:#e0e0e0; line-height:1.6;">Bonjour ${esc(o.customerName)},<br/>Votre commande a été annulée.</p>
    ${card(row('Article(s)', items) + row('Total', `${o.total} €`))}
    ${refunded ? refundBox(o.total) : questionsLine}`;
  return { subject: `Annulation de votre commande Maison Love Room`, html: shell('Commande annulée', body) };
}
