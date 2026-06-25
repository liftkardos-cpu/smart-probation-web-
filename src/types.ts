export type UserRole = "PROBATIONER" | "OFFICER" | "PARTNER";

export interface ProfileData {
  id: string; // e.g., PB6705-123456
  name: string;
  age: number;
  avatarUrl: string;
  status: string; // e.g. "อยู่ระหว่างคุมประพฤติ" or "ปกติ"
  nationalId: string;
  birthDate: string;
  gender: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  
  // Case Data
  caseId: string;
  court: string;
  charge: string;
  sentenceConditions: string[];
  probationPeriod: {
    start: string;
    end: string;
    remainingDays: number;
  };
  probationOfficer: {
    name: string;
    contact: string;
  };
  
  // Stats
  behaviorScore: number;
  completedHours: number;
  requiredHours: number;
  totalActivities: number;
  totalReports: number;
  completedReports: number;
  documentCount: number;
  totalDocuments: number;
}

export interface Activity {
  id: string;
  title: string;
  category: "วัด/ศาสนสถาน" | "โรงเรียน/การศึกษา" | "เทศบาล/ชุมชน" | "สิ่งแวดล้อม" | "สาธารณประโยชน์";
  organizer: string;
  location: string;
  province: string;
  date: string;
  time: string;
  hours: number;
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  imageUrl: string;
  status: "เปิดรับสมัคร" | "รอจัดกิจกรรม" | "กำลังดำเนินการ" | "เสร็จสิ้น" | "ยกเลิก";
  applicants: {
    probationerId: string;
    probationerName: string;
    avatarUrl: string;
    status: "รออนุมัติ" | "อนุมัติแล้ว" | "ปฏิเสธ" | "เช็กอินแล้ว" | "เสร็จสิ้น";
    checkInTime?: string;
    checkOutTime?: string;
    rating?: {
      responsibility: number;
      punctuality: number;
      cooperation: number;
      behavior: number;
      comment: string;
      date?: string;
    };
  }[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  qualification: string;
  experience: string;
  tags: string[];
  logo: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  rating: number;
  views: number;
  isFree: boolean;
  imageUrl: string;
}

export interface Appointment {
  id: string;
  probationerId: string;
  probationerName: string;
  type: "นัดรายงานตัว" | "นัดบริการสังคม" | "นัดตรวจสารเสพติด";
  date: string; // YYYY-MM-DD
  time: string;
  status: "รอยืนยัน" | "ยืนยันแล้ว" | "เลื่อนนัด" | "ขาดนัด";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  category: "รายงานตัว" | "กิจกรรม" | "ชั่วโมงบำเพ็ญประโยชน์" | "เอกสาร" | "โอกาสงาน" | "ระบบ";
  isRead: boolean;
  urgent?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
