// Every demo journey is declared here. Field specs drive rendering, validation,
// review and the confirmation summary (see engine.ts), so each rule lives in one place.
import { eitherContact, type FieldSpec, type FlowSpec, type Option } from './engine'
import { COLLECTIONS } from '../data/collections'
import { SHOWROOMS } from '../data/locations'
import { VISIT_MAX_DAYS, VISIT_WINDOWS, earliestVisitDate, visitDateError } from '../lib/schedule'
import { addDays } from '../lib/validation'

const NAME: FieldSpec<any> = { name: 'fullName', label: 'Full name', kind: 'text', autoComplete: 'name', maxLength: 80 }
const EMAIL: FieldSpec<any> = { name: 'email', label: 'Email address', kind: 'email', autoComplete: 'email', maxLength: 120 }
const PHONE: FieldSpec<any> = { name: 'phone', label: 'Phone number', kind: 'tel', autoComplete: 'tel', hint: 'A Ugandan number such as 0772 123 456, or an international number starting with +.' }
const optional = <T,>(field: T) => ({ ...field, optional: true })
const CONTACT_GROUP = { id: 'contactMethod', legend: 'How could ABC reply?', hint: 'Give at least one: an email address or a phone number.', fields: ['email', 'phone'] }

export const SHOWROOM_OPTIONS: Option[] = SHOWROOMS.map(showroom => ({ value: showroom.slug, label: showroom.name, description: showroom.address }))
const PREFERRED_SHOWROOM: Option[] = [...SHOWROOMS.map(showroom => ({ value: showroom.slug, label: showroom.name })), { value: 'none', label: 'No preference' }]

const STAGES: Option[] = [
  { value: 'planning', label: 'Early planning' },
  { value: 'design', label: 'Design and specification' },
  { value: 'construction', label: 'Under construction' },
  { value: 'finishing', label: 'Ready for finishes' },
  { value: 'renovation', label: 'Renovating an existing space' },
]
const TIMEFRAMES: Option[] = [
  { value: 'month', label: 'Within a month' },
  { value: 'quarter', label: 'In the next three months' },
  { value: 'later', label: 'Later than three months' },
  { value: 'unsure', label: 'Not sure yet' },
]

// ---- Quote request ------------------------------------------------------------------
export interface QuoteDraft extends Record<string, string | null> {
  selectionNotes: string | null
  role: string | null
  organisation: string | null
  projectType: string | null
  projectTypeOther: string | null
  location: string | null
  stage: string | null
  timeframe: string | null
  budget: string | null
  fullName: string | null
  email: string | null
  phone: string | null
  showroom: string | null
  reply: string | null
  message: string | null
}

export const quoteFlow: FlowSpec<QuoteDraft> = {
  key: 'quote',
  empty: () => ({
    selectionNotes: null, role: null, organisation: null, projectType: null, projectTypeOther: null, location: null, stage: null,
    timeframe: null, budget: null, fullName: null, email: null, phone: null, showroom: null, reply: null, message: null,
  }),
  sample: () => ({
    role: 'homeowner', projectType: 'residential', location: 'Kira, Wakiso', stage: 'finishing', timeframe: 'quarter', budget: 'unsure',
    fullName: 'Amani Nakato', email: 'amani.nakato@example.com', phone: '0772 123 456', showroom: 'stiles-and-bathz', reply: 'either',
    message: 'Two bathrooms and a kitchen in a new house. We would like to see options in person first.',
  }),
  stages: [
    {
      id: 'selections',
      title: 'Your selections',
      intro: 'These are the items on your project shortlist. Adjust piece counts or remove anything before you continue.',
      fields: [{
        name: 'selectionNotes', label: 'Notes about these selections', kind: 'textarea', optional: true, maxLength: 500, rows: 3,
        hint: 'For example, which rooms they are for. Kept only for this visit and never saved.',
      }],
    },
    {
      id: 'project',
      title: 'Your project',
      fields: [
        {
          name: 'role', label: 'Who are you?', kind: 'radio', requiredMessage: 'Choose who you are.',
          options: [
            { value: 'homeowner', label: 'Homeowner' },
            { value: 'designer', label: 'Architect or designer' },
            { value: 'contractor', label: 'Contractor' },
            { value: 'organisation', label: 'Business or organisation' },
          ],
        },
        { name: 'organisation', label: 'Company or organisation', kind: 'text', optional: true, autoComplete: 'organization', maxLength: 100, when: draft => Boolean(draft.role) && draft.role !== 'homeowner' },
        {
          name: 'projectType', label: 'Project type', kind: 'radio', requiredMessage: 'Choose a project type.',
          options: [
            { value: 'residential', label: 'Residential' },
            { value: 'hospitality', label: 'Hospitality' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'other', label: 'Something else' },
          ],
        },
        { name: 'projectTypeOther', label: 'What kind of project?', kind: 'text', maxLength: 80, requiredMessage: 'Describe the project type in a few words.', when: draft => draft.projectType === 'other' },
        { name: 'location', label: 'General project location', kind: 'text', autoComplete: 'address-level2', maxLength: 80, hint: 'An area or town is enough, such as Ntinda or Entebbe. No street address needed.' },
        { name: 'stage', label: 'Project stage', kind: 'select', options: STAGES },
        { name: 'timeframe', label: 'Timeframe', kind: 'select', options: TIMEFRAMES },
        {
          name: 'budget', label: 'Budget range', kind: 'select', optional: true, hint: 'Optional, and only a rough guide.',
          options: [
            { value: 'under-10m', label: 'Under UGX 10 million' },
            { value: '10-50m', label: 'UGX 10–50 million' },
            { value: '50m+', label: 'Over UGX 50 million' },
            { value: 'unsure', label: 'Not sure yet' },
          ],
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact preferences',
      fields: [
        NAME, EMAIL, PHONE,
        { name: 'showroom', label: 'Preferred showroom', kind: 'select', options: PREFERRED_SHOWROOM, requiredMessage: 'Choose a showroom, or “No preference”.' },
        {
          name: 'reply', label: 'How would you prefer a reply?', kind: 'radio', requiredMessage: 'Choose how you would prefer a reply.',
          options: [{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'either', label: 'Either' }],
        },
        { name: 'message', label: 'Anything else?', kind: 'textarea', optional: true, maxLength: 800, rows: 4 },
      ],
    },
  ],
  review: { title: 'Review your quote request', intro: 'Check everything. Use Edit to change a step; you will come back here afterwards.' },
  final: { label: 'Complete demo quote request', note: 'Demonstration only. Nothing is sent to ABC, and no quote will be prepared.' },
  done: { title: 'Demo complete.', body: 'No quote request was sent.' },
}

// ---- Showroom visit -------------------------------------------------------------------
export interface VisitDraft extends Record<string, string | null> {
  showroom: string | null
  purpose: string | null
  date: string | null
  window: string | null
  fullName: string | null
  email: string | null
  phone: string | null
  bringShortlist: string | null
}

export const visitFlow: FlowSpec<VisitDraft> = {
  key: 'visit',
  empty: () => ({ showroom: null, purpose: null, date: null, window: null, fullName: null, email: null, phone: null, bringShortlist: null }),
  sample: today => ({ showroom: 'stiles-and-bathz', purpose: 'project', date: addDays(today, 4), window: 'morning', fullName: 'Amani Nakato', email: 'amani.nakato@example.com', phone: '', bringShortlist: 'yes' }),
  groups: [CONTACT_GROUP],
  stages: [
    {
      id: 'visit',
      title: 'Your visit',
      intro: 'Dates use Kampala time and start from tomorrow. Time windows are preferences only; they do not come from a real calendar.',
      fields: [
        { name: 'showroom', label: 'Showroom', kind: 'radio', options: SHOWROOM_OPTIONS, requiredMessage: 'Choose a showroom.' },
        {
          name: 'purpose', label: 'Purpose of the visit', kind: 'select',
          options: [
            { value: 'browse', label: 'Browse the collections' },
            { value: 'project', label: 'Discuss a project' },
            { value: 'selections', label: 'See items from my shortlist' },
            { value: 'other', label: 'Something else' },
          ],
        },
        {
          name: 'date', label: 'Preferred date', kind: 'date', hint: `From tomorrow up to ${VISIT_MAX_DAYS} days ahead.`,
          dateBounds: () => ({ min: earliestVisitDate(), max: addDays(earliestVisitDate(), VISIT_MAX_DAYS - 1) }),
          validate: value => visitDateError(value ?? ''),
        },
        { name: 'window', label: 'Time of day', kind: 'radio', options: VISIT_WINDOWS.map(window => ({ ...window, description: 'Preference only' })), requiredMessage: 'Choose a time of day.' },
      ],
    },
    {
      id: 'contact',
      title: 'Contact details',
      fields: [
        NAME, optional(EMAIL), optional(PHONE),
        {
          name: 'bringShortlist', label: 'Include your project shortlist?', kind: 'radio', optional: true,
          options: [{ value: 'yes', label: 'Yes, list my selections' }, { value: 'no', label: 'No' }],
        },
      ],
      validate: eitherContact('contactMethod', 'email', 'phone'),
    },
  ],
  review: { title: 'Review your visit request', intro: 'Check the details before completing the demo.' },
  final: { label: 'Complete demo visit request', note: 'Demonstration only. No appointment is booked and the showroom is not told.' },
  done: { title: 'Demo visit request complete.', body: 'No appointment was booked and the showroom has not been told about this visit.' },
}

// ---- Professional project brief ----------------------------------------------------------
export interface BriefDraft extends Record<string, string | null> {
  organisation: string | null
  role: string | null
  projectType: string | null
  location: string | null
  collections: string | null
  scope: string | null
  stage: string | null
  timeframe: string | null
  fullName: string | null
  email: string | null
  phone: string | null
  notes: string | null
}

export const briefFlow: FlowSpec<BriefDraft> = {
  key: 'brief',
  empty: () => ({ organisation: null, role: null, projectType: null, location: null, collections: null, scope: null, stage: null, timeframe: null, fullName: null, email: null, phone: null, notes: null }),
  sample: () => ({
    organisation: 'Sample Architects Ltd', role: 'architect', projectType: 'hospitality', location: 'Entebbe',
    collections: 'tiles|sanitaryware|concealed-cisterns', scope: 'A 40-room lodge: guest bathrooms, public washrooms and about 1,200 square metres of floor finishes.',
    stage: 'design', timeframe: 'later', fullName: 'Daniel Okello', email: 'daniel.okello@example.com', phone: '0701 234 567',
  }),
  stages: [
    {
      id: 'organisation',
      title: 'Your organisation',
      fields: [
        { name: 'organisation', label: 'Organisation', kind: 'text', autoComplete: 'organization', maxLength: 100 },
        {
          name: 'role', label: 'Your role', kind: 'select',
          options: [
            { value: 'architect', label: 'Architect' },
            { value: 'interior-designer', label: 'Interior designer' },
            { value: 'contractor', label: 'Contractor' },
            { value: 'developer', label: 'Developer' },
            { value: 'operator', label: 'Hotel or property operator' },
            { value: 'other', label: 'Other' },
          ],
        },
      ],
    },
    {
      id: 'project',
      title: 'The project',
      intro: 'Approximate answers are fine. Please don’t include drawings, client names or confidential documents.',
      fields: [
        {
          name: 'projectType', label: 'Project type', kind: 'radio', requiredMessage: 'Choose a project type.',
          options: [
            { value: 'residential', label: 'Residential development' },
            { value: 'hospitality', label: 'Hospitality' },
            { value: 'commercial', label: 'Commercial or office' },
            { value: 'institutional', label: 'Institutional or public' },
            { value: 'other', label: 'Other' },
          ],
        },
        { name: 'location', label: 'General location', kind: 'text', maxLength: 80, hint: 'A town or area is enough.' },
        { name: 'collections', label: 'Relevant collections', kind: 'checkboxes', options: COLLECTIONS.map(collection => ({ value: collection.slug, label: collection.name })), requiredMessage: 'Choose at least one collection.' },
        { name: 'scope', label: 'Approximate scope', kind: 'textarea', minLength: 15, maxLength: 600, rows: 4, hint: 'For example, the number of bathrooms or the rough floor area.' },
        { name: 'stage', label: 'Project stage', kind: 'select', options: STAGES },
        { name: 'timeframe', label: 'Timeframe', kind: 'select', options: TIMEFRAMES },
      ],
    },
    {
      id: 'contact',
      title: 'Contact details',
      fields: [NAME, EMAIL, optional(PHONE), { name: 'notes', label: 'Notes', kind: 'textarea', optional: true, maxLength: 600, rows: 3 }],
    },
  ],
  review: { title: 'Review your project brief', intro: 'Check each answer before completing the demo.' },
  final: { label: 'Complete demo project brief', note: 'Demonstration only. Nothing is sent and ABC is not contacted.' },
  done: { title: 'Demo project brief complete.', body: 'No brief was sent and ABC has not been contacted.' },
}

// ---- Contact ---------------------------------------------------------------------------
export interface ContactDraft extends Record<string, string | null> {
  category: string | null
  message: string | null
  fullName: string | null
  email: string | null
  phone: string | null
}

export const contactFlow: FlowSpec<ContactDraft> = {
  key: 'contact',
  empty: () => ({ category: null, message: null, fullName: null, email: null, phone: null }),
  sample: () => ({ category: 'products', message: 'Do you have the pedestal basin on display at the Jinja Road showroom?', fullName: 'Amani Nakato', email: 'amani.nakato@example.com', phone: '' }),
  groups: [CONTACT_GROUP],
  stages: [
    {
      id: 'message',
      title: 'Your message',
      fields: [
        {
          name: 'category', label: 'What is it about?', kind: 'select',
          options: [
            { value: 'products', label: 'A product or collection' },
            { value: 'showroom', label: 'Visiting a showroom' },
            { value: 'project', label: 'A project or quote' },
            { value: 'other', label: 'Something else' },
          ],
        },
        { name: 'message', label: 'Message', kind: 'textarea', minLength: 10, maxLength: 1000, rows: 6 },
      ],
    },
    {
      id: 'contact',
      title: 'Your details',
      fields: [NAME, optional(EMAIL), optional(PHONE)],
      validate: eitherContact('contactMethod', 'email', 'phone'),
    },
  ],
  review: { title: 'Review your message', intro: 'Check the details before completing the demo.' },
  final: { label: 'Complete demo message', note: 'Demonstration only. This form is not connected to email, WhatsApp or any server.' },
  done: { title: 'Demo message complete.', body: 'No message was sent. To reach ABC, use the published contact details on this page.' },
}
