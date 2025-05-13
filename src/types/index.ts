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
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export type ViewMode = 'grid' | 'calendar'; 