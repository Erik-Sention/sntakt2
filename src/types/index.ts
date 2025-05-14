export interface Client {
  id: string;
  name: string;
  personnummer?: string;
  gatuadress?: string;
  postnummer?: string;
  stad?: string;
  startDate: string;
  clinic?: string;
  nextDoctorAppointment: string;
  doctorName?: string;
  doctorAppointmentDetails?: string;
  nextShortContact: string;
  shortContactPerson?: string;
  shortContactDetails?: string;
  nextLongConversation: string;
  longConversationPerson?: string;
  longConversationDetails?: string;
  nextTest: string;
  testPerson?: string;
  testDetails?: string;
  nextMeeting: string;
  meetingPersons?: string;
  meetingDetails?: string;
  comments: string;
  interventionStatus: 'Planned' | 'Completed' | 'Canceled';
  documents?: ClientDocument[];
  links?: ClientLink[];
  notes?: ClientNote[];
}

export interface ClientDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface ClientLink {
  id: string;
  name: string;
  url: string;
  date: string;
  addedAt: string;
}

export interface ClientNote {
  id: string;
  text: string;
  createdAt: string;
  performedAt: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export type ViewMode = 'grid' | 'calendar'; 