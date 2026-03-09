export type LeadStatus =
  | 'New Lead'
  | 'Contacted'
  | 'Requirement Collected'
  | 'Property Suggested'
  | 'Visit Scheduled'
  | 'Visit Completed'
  | 'Booked'
  | 'Lost';

export type LeadSource = 'WhatsApp' | 'Website' | 'Phone' | 'Social Media';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  status: LeadStatus;
  assignedAgent: string;
  createdAt: Date;
  budget?: string;
  requirements?: string;
  scheduledVisit?: {
    date: string;
    property: string;
  };
  notes?: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
}
