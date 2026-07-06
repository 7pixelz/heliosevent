const TOKEN = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE = 'Enquiries';

export async function pushToAirtable(fields: {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  typeOfProgram?: string | null;
  teamSize?: string | null;
  budget?: string | null;
  preferredDate?: string | null;
  howDidYouHear?: string | null;
}) {
  if (!TOKEN || !BASE_ID) return;

  await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        Name: fields.name,
        Email: fields.email,
        Phone: fields.phone,
        Company: fields.company,
        Location: fields.location,
        'Event Type': fields.typeOfProgram ?? '',
        'Team Size': fields.teamSize ?? '',
        Budget: fields.budget ?? '',
        'Preferred Date': fields.preferredDate ?? '',
        'How Did You Hear': fields.howDidYouHear ?? '',
      },
    }),
  });
}
