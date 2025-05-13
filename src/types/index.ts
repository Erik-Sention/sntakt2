export interface Client {
  id: string;
  name: string;
  startDate: string;
  nextDoctorAppointment: string;
  nextShortContact: string;
  nextLongConversation: string;
  nextTest: string;
  nextMeeting: string;
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