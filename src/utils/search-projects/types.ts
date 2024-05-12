export interface Project {
  title: string;
  type: string;
  description: string;
  url: string;
  createdBy: string;
}

export interface ApiState {
  records?: Project[];
  error?: Error;
  loading?: boolean;
}
