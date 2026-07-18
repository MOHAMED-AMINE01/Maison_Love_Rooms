import * as ical from 'node-ical';

export interface ImportedBlock {
  startDate: Date;
  endDate: Date;
  reason: string;
  source: 'airbnb' | 'booking';
  uid?: string;
}

// Récupère les périodes réservées depuis un flux iCal externe (Airbnb / Booking).
export async function fetchIcalBlocks(url: string, source: 'airbnb' | 'booking'): Promise<ImportedBlock[]> {
  const blocks: ImportedBlock[] = [];
  const data = await ical.async.fromURL(url);
  for (const key of Object.keys(data)) {
    const ev: any = (data as any)[key];
    if (!ev || ev.type !== 'VEVENT') continue;
    if (!ev.start || !ev.end) continue;
    const label = source === 'airbnb' ? 'Airbnb' : 'Booking';
    blocks.push({
      startDate: new Date(ev.start),
      endDate: new Date(ev.end),
      reason: `${label}${ev.summary ? ' — ' + String(ev.summary) : ' — Réservé'}`,
      source,
      uid: ev.uid ? String(ev.uid) : undefined,
    });
  }
  return blocks;
}

// Format DATE iCal (YYYYMMDD) — blocages journaliers compatibles Airbnb/Booking.
function fmtICSDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

// Génère un flux iCal (.ics) à partir des réservations d'une suite, à coller dans
// Airbnb / Booking pour bloquer ces dates chez eux (synchro sortante).
// On exporte TOUTE l'occupation de la suite pour éviter les doublons :
//   - les réservations du site,
//   - les blocages (manuels ET importés d'Airbnb/Booking), afin qu'une résa reçue
//     sur une plateforme ferme aussi les dates sur les autres.
export function buildIcalFeed(
  suiteName: string,
  reservations: { _id: any; checkIn: Date; checkOut: Date }[],
  blocks: { _id?: any; startDate: Date; endDate: Date; reason?: string }[] = []
): string {
  const dtstamp = `${fmtICSDate(new Date())}T000000Z`;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maison Love Rooms//Reservations//FR',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${suiteName}`,
  ];
  for (const r of reservations) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${String(r._id)}@maisonloverooms`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART;VALUE=DATE:${fmtICSDate(new Date(r.checkIn))}`);
    lines.push(`DTEND;VALUE=DATE:${fmtICSDate(new Date(r.checkOut))}`);
    lines.push(`SUMMARY:Réservé — ${suiteName}`);
    lines.push('END:VEVENT');
  }
  for (const b of blocks) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:block-${String(b._id ?? `${fmtICSDate(new Date(b.startDate))}-${fmtICSDate(new Date(b.endDate))}`)}@maisonloverooms`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART;VALUE=DATE:${fmtICSDate(new Date(b.startDate))}`);
    lines.push(`DTEND;VALUE=DATE:${fmtICSDate(new Date(b.endDate))}`);
    lines.push(`SUMMARY:${b.reason ? String(b.reason) : `Indisponible — ${suiteName}`}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
