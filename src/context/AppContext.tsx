// ==========================================
// 🇹🇭 ไฟล์: /src/context/AppContext.tsx
// คำอธิบาย: ตัวเก็บและจัดการสถานะสากล (Global Context Store) ของระบบ PROGRESS+
// โครงสร้างไฟล์:
//   - ส่วนนำเข้าข้อมูลและชนิดข้อมูลอินเตอร์เฟส (Imports, Types, & Interfaces)
//   - ข้อมูลเริ่มต้น (INITIAL_STATE): ข้อมูลผู้ถูกคุมประพฤติจำลอง, กิจกรรมบริการสังคมของ ม.ทักษิณ และเทศบาลเมืองสงขลา
//   - ระบบแชตจำลองกับโมเดลปัญญาประดิษฐ์ (AI Chat Bot Integration & Handler)
//   - ฟังก์ชันบำเพ็ญประโยชน์ สมัครกิจกรรม เช็คอินพิกัด และประเมินพฤติกรรม (Activity Workflows & Handlers)
//   - คอร์สเรียนฝึกอาชีพ ตำแหน่งงาน และกำหนดนัดรายงานตัว (Jobs, Courses, and Appointments Management)
// ==========================================

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  ProfileData,
  Activity,
  Job,
  Course,
  Appointment,
  NotificationItem,
  ChatMessage,
  EmergencyRequest,
  ObservationNote,
  RiskAssessmentRecord
} from "../types";
import { MOCK_PROBATIONERS_375 } from "../data/probationersData";

interface AppContextProps {
  role: UserRole;
  isLoggedIn: boolean;
  currentView: string;
  probationerProfile: ProfileData;
  probationers: ProfileData[];
  probationersList: ProfileData[];
  selectedProbationerId: string;
  activities: Activity[];
  appointments: Appointment[];
  notifications: NotificationItem[];
  chatHistory: ChatMessage[];
  jobs: Job[];
  courses: Course[];
  emergencyRequests: EmergencyRequest[];
  observationNotes: ObservationNote[];
  riskAssessmentRecords: RiskAssessmentRecord[];
  
  // State Setters & Actions
  setRole: (role: UserRole) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentView: (view: string) => void;
  updateProbationerProfile: (profile: ProfileData) => void;
  selectProbationer: (id: string) => void;
  
  // Actions
  applyForActivity: (activityId: string, probationerId: string) => void;
  approveApplicant: (activityId: string, probationerId: string) => void;
  approveActivityApplication: (activityId: string, probationerId: string) => void;
  checkInActivity: (activityId: string, probationerId: string, time: string) => void;
  checkOutActivity: (
    activityId: string,
    probationerId: string,
    time: string,
    photos: string[],
    signature: string
  ) => void;
  submitEvaluation: (
    activityId: string,
    probationerId: string,
    ratings: { responsibility: number; punctuality: number; cooperation: number; behavior: number },
    comment: string
  ) => void;
  completeActivityApplication: (activityId: string, probationerId: string, ratingObj: any) => void;
  closeProbationerCase: (probationerId: string) => void;
  updateBehaviorScore: (probationerId: string, scoreVal: number) => void;
  submitOnlineReport: (reportName: string, text: string, photoUrl?: string, location?: { lat: number; lng: number }) => void;
  addActivity: (activity: Omit<Activity, "id" | "currentParticipants" | "applicants">) => void;
  deleteActivity: (activityId: string) => void;
  addAppointment: (appointment: Omit<Appointment, "id" | "status">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  addNotification: (title: string, description: string, category: NotificationItem["category"], urgent?: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  clearAllNotifications: () => void;
  sendChatMessage: (message: string) => Promise<void>;
  resetPrototypeData: () => void;
  addEmergencyRequest: (reason: string, details: string, lat: number, lng: number) => void;
  updateEmergencyRequestStatus: (id: string, status: EmergencyRequest["status"]) => void;
  addObservationNote: (probationerId: string, content: string, officerName?: string) => void;
  addRiskAssessmentRecord: (record: Omit<RiskAssessmentRecord, "id" | "date">) => void;
  updateProbationerHoursDirectly: (probationerId: string, hours: number, activityTitle: string, partnerName: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Core Mock Data
const INITIAL_PROBATIONER: ProfileData = MOCK_PROBATIONERS_375[0];

const INITIAL_PROBATIONERS_LIST: ProfileData[] = MOCK_PROBATIONERS_375;

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    title: "ทำความสะอาดวัดเขารูปช้าง (ตรงข้าม ม.ทักษิณ)",
    category: "วัด/ศาสนสถาน",
    organizer: "วัดเขารูปช้าง จ.สงขลา",
    location: "วัดเขารูปช้าง ต.เขารูปช้าง อ.เมืองสงขลา จ.สงขลา (ใกล้ ม.ทักษิณ)",
    province: "สงขลา",
    date: "2026-05-20",
    time: "08:30 - 12:00",
    hours: 4,
    maxParticipants: 25,
    currentParticipants: 24,
    description: "กิจกรรมบำเพ็ญประโยชน์ทำความสะอาดโบสถ์ วิหาร ปัดกวาดเช็ดถู และจัดระเบียบเก้าอี้เพื่อเตรียมพร้อมงานบุญใหญ่ประจำเดือน ช่วยฟื้นฟูจิตใจและสร้างจิตสาธารณะร่วมกับชุมชน",
    imageUrl: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=600&auto=format&fit=crop&q=60",
    status: "เสร็จสิ้น",
    applicants: [
      {
        probationerId: "PB6705-123456",
        probationerName: "นายสมชาย ใจดี",
        avatarUrl: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_ส_ac1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_ส_ac1)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="Sarabun, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ส</text></svg>')}`,
        status: "เสร็จสิ้น",
        checkInTime: "08:35:22",
        checkOutTime: "12:05:18",
        rating: {
          responsibility: 5,
          punctuality: 4,
          cooperation: 5,
          behavior: 5,
          comment: "ตั้งใจทำงานดีมาก ให้ความร่วมมือกับทีมงานและพระสงฆ์เป็นอย่างดี สุภาพเรียบร้อยดีมาก",
          date: "25 พ.ค. 2570"
        }
      }
    ]
  },
  {
    id: "act-2",
    title: "ปรับปรุงภูมิทัศน์และทาสีโรงเรียนวัดเขารูปช้าง",
    category: "โรงเรียน/การศึกษา",
    organizer: "โรงเรียนวัดเขารูปช้าง",
    location: "โรงเรียนวัดเขารูปช้าง ต.เขารูปช้าง อ.เมืองสงขลา จ.สงขลา (ใกล้ ม.ทักษิณ)",
    province: "สงขลา",
    date: "2026-05-22",
    time: "08:30 - 12:00",
    hours: 4,
    maxParticipants: 20,
    currentParticipants: 18,
    description: "ทาสีรั้วโรงเรียน กำจัดวัชพืช ปลูกไม้ดอกไม้ประดับบริเวณหน้าอาคารเรียน เพื่อสุขอนามัยที่ดีของเด็กนักเรียนและให้สภาพแวดล้อมน่าอยู่ น่าเรียนรู้ยิ่งขึ้น",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=60",
    status: "เสร็จสิ้น",
    applicants: [
      {
        probationerId: "PB6705-123456",
        probationerName: "นายสมชาย ใจดี",
        avatarUrl: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_ส_ac2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_ส_ac2)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="Sarabun, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ส</text></svg>')}`,
        status: "เสร็จสิ้น",
        checkInTime: "08:31:00",
        checkOutTime: "12:02:10",
        rating: {
          responsibility: 4,
          punctuality: 5,
          cooperation: 4,
          behavior: 4,
          comment: "มาถึงก่อนเวลา ทำงานทาสีอย่างขยันขันแข็ง ปฏิบัติตามคำสั่งดี",
          date: "22 พ.ค. 2570"
        }
      },
      {
        probationerId: "PB6705-123457",
        probationerName: "นายธนวัฒน์ รักดี",
        avatarUrl: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_ธ_ac2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#172554"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_ธ_ac2)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="Sarabun, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ธ</text></svg>')}`,
        status: "เสร็จสิ้น",
        checkInTime: "08:42:00",
        checkOutTime: "12:00:00",
        rating: {
          responsibility: 3,
          punctuality: 3,
          cooperation: 4,
          behavior: 4,
          comment: "มาสายนิดหน่อย แต่ช่วยยกถังสีและอุปกรณ์ได้ดี พูดจาสุภาพ",
          date: "22 พ.ค. 2570"
        }
      }
    ]
  },
  {
    id: "act-3",
    title: "พัฒนาสวนสาธารณะเมืองสงขลา (สวนสองทะเล)",
    category: "เทศบาล/ชุมชน",
    organizer: "เทศบาลนครสงขลา",
    location: "สวนสองทะเล ต.บ่อยาง อ.เมืองสงขลา จ.สงขลา (แหลมสนอ่อน)",
    province: "สงขลา",
    date: "2026-05-25",
    time: "08:30 - 12:00",
    hours: 4,
    maxParticipants: 15,
    currentParticipants: 12,
    description: "ช่วยเทศบาลตัดแต่งกิ่งไม้ กวาดใบไม้รอบสระน้ำ เก็บขยะที่ตกค้างในสวนสาธารณะเพื่อให้ประชาชนในพื้นที่สามารถมาใช้บริการออกกำลังกายและพักผ่อนหย่อนใจได้อย่างปลอดภัย",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60",
    status: "เปิดรับสมัคร",
    applicants: [
      {
        probationerId: "PB6705-123456",
        probationerName: "นายสมชาย ใจดี",
        avatarUrl: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_ส_ac3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_ส_ac3)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="Sarabun, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ส</text></svg>')}`,
        status: "อนุมัติแล้ว"
      },
      {
        probationerId: "PB6705-123457",
        probationerName: "นายธนวัฒน์ รักดี",
        avatarUrl: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_ธ_ac3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#172554"/><stop offset="100%" stop-color="#1e3a8a"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_ธ_ac3)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="Sarabun, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ธ</text></svg>')}`,
        status: "รออนุมัติ"
      }
    ]
  },
  {
    id: "act-4",
    title: "เก็บขยะชายหาดสมิหลา",
    category: "สิ่งแวดล้อม",
    organizer: "เทศบาลนครสงขลา",
    location: "หาดชลาทัศน์/หาดสมิหลา ต.บ่อยาง อ.เมืองสงขลา จ.สงขลา",
    province: "สงขลา",
    date: "2026-05-25",
    time: "08:30 - 12:00",
    hours: 4,
    maxParticipants: 50,
    currentParticipants: 22,
    description: "กิจกรรมเดินเก็บขยะ พลาสติก เศษขวดแก้ว เพื่อฟื้นฟูทัศนียภาพของหาดสมิหลาและชายฝั่ง ป้องกันมลพิษทางทะเลและฟื้นคืนธรรมชาติสะอาดสวยงามให้นักท่องเที่ยว",
    imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=60",
    status: "เปิดรับสมัคร",
    applicants: []
  },
  {
    id: "act-5",
    title: "เยี่ยมผู้สูงอายุ สถานสงเคราะห์คนชราอนาถาบ้านธรรมปกรณ์สงขลา",
    category: "สาธารณประโยชน์",
    organizer: "สถานสงเคราะห์คนชราบ้านธรรมปกรณ์สงขลา",
    location: "ถนนปละท่า ต.บ่อยาง อ.เมืองสงขลา จ.สงขลา (ใกล้หาดชลาทัศน์)",
    province: "สงขลา",
    date: "2026-05-28",
    time: "09:00 - 13:00",
    hours: 4,
    maxParticipants: 10,
    currentParticipants: 10,
    description: "กิจกรรมสันทนาการ พูดคุย เล่านิทาน เสิร์ฟอาหารกลางวัน และช่วยกวาดล้างทำความสะอาดโรงนอนและอาคารกิจกรรมของท่านผู้สูงอายุที่ขาดคนดูแล",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=60",
    status: "รอจัดกิจกรรม",
    applicants: [
      {
        probationerId: "PB6705-123456",
        probationerName: "นายสมชาย ใจดี",
        avatarUrl: `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="p_ส_ac5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs><circle cx="50" cy="50" r="50" fill="url(#p_ส_ac5)"/><circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/><text x="50" y="52" font-family="Sarabun, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">ส</text></svg>')}`,
        status: "อนุมัติแล้ว"
      }
    ]
  }
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    probationerId: "PB6705-123456",
    probationerName: "นายสมชาย ใจดี",
    type: "นัดรายงานตัว",
    date: "2026-05-20",
    time: "08:30",
    status: "ยืนยันแล้ว"
  },
  {
    id: "apt-2",
    probationerId: "PB6705-123457",
    probationerName: "นายธนวัฒน์ รักดี",
    type: "นัดตรวจสารเสพติด",
    date: "2026-05-20",
    time: "10:00",
    status: "ยืนยันแล้ว"
  },
  {
    id: "apt-3",
    probationerId: "PB6705-123458",
    probationerName: "นายวิชัย ใจกล้า",
    type: "นัดรายงานตัว",
    date: "2026-05-21",
    time: "09:00",
    status: "ขาดนัด"
  },
  {
    id: "apt-4",
    probationerId: "PB6705-123456",
    probationerName: "นายสมชาย ใจดี",
    type: "นัดรายงานตัว",
    date: "2026-05-27",
    time: "09:30",
    status: "รอยืนยัน"
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "not-1",
    title: "ใกล้ถึงวันรายงานตัวครั้งถัดไป",
    description: "คุณมีกำหนดการรายงานตัวตามคำสั่งศาลในอีก 5 วัน (วันที่ 20 พฤษภาคม 2570 เวลา 08:30 น.) กรุณาจัดเตรียมบัตรประจำตัวประชาชน",
    timeAgo: "10 นาทีที่แล้ว",
    category: "รายงานตัว",
    isRead: false,
    urgent: true
  },
  {
    id: "not-2",
    title: "กิจกรรมบำเพ็ญประโยชน์เปิดรับสมัครเพิ่ม",
    description: "กิจกรรม 'พัฒนาสวนสาธารณะเมืองสงขลา (สวนสองทะเล)' ใกล้พื้นที่ของคุณเปิดรับสมัคร ดำเนินการโดยเทศบาลนครสงขลา ได้รับ 4 ชั่วโมงสะสม",
    timeAgo: "3 นาทีที่แล้ว",
    category: "กิจกรรม",
    isRead: false
  },
  {
    id: "not-3",
    title: "ชั่วโมงสะสมบำเพ็ญประโยชน์ยังไม่ครบ",
    description: "เตือนเพื่อวางแผน: ปัจจุบันสะสม 150 ชั่วโมง ขาดอีก 50 ชั่วโมง เพื่อให้ครบตามคำสั่งศาล (200 ชั่วโมง) กรุณาสมัครกิจกรรมเพิ่มเติม",
    timeAgo: "15 นาทีที่แล้ว",
    category: "ชั่วโมงบำเพ็ญประโยชน์",
    isRead: false,
    urgent: true
  },
  {
    id: "not-4",
    title: "เอกสารสำคัญได้รับการตรวจสอบแล้ว",
    description: "เอกสาร 'รายงานผลการทำงานบริการสังคม' ครั้งล่าสุดได้รับการพิจารณาและผ่านการประเมินจากเจ้าหน้าที่คุมประพฤติเรียบร้อย",
    timeAgo: "1 ชั่วโมงที่แล้ว",
    category: "เอกสาร",
    isRead: true
  },
  {
    id: "not-5",
    title: "โอกาสงานใหม่เข้ามาจาก ReStart Job Hub",
    description: "พนักงานคลังสินค้า บริษัท CP ALL (7-11) นครปฐม เปิดรับวุฒิ ม.3 ขึ้นไป ไม่จำกัดประสบการณ์ รายได้ 12,000 - 15,000 บาท/เดือน สนใจกรอกใบสมัครด่วน",
    timeAgo: "2 ชั่วโมงที่แล้ว",
    category: "โอกาสงาน",
    isRead: true
  }
];

const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "พนักงานคลังสินค้า",
    company: "บริษัท สยามคราฟท์ จำกัด",
    salary: "15,000 - 18,000 บาท",
    location: "กรุงเทพมหานคร",
    qualification: "วุฒิ ม.3 ขึ้นไป",
    experience: "ประสบการณ์ 0-1 ปี",
    tags: ["งานคลังสินค้า", "ยกของ", "ตรวจสอบสต็อก"],
    logo: "SCG"
  },
  {
    id: "job-2",
    title: "พนักงานประจำร้านค้า (7-11)",
    company: "บริษัท ซีพี ออลล์ จำกัด (มหาชน)",
    salary: "12,000 - 15,000 บาท",
    location: "นครปฐม",
    qualification: "วุฒิ ม.3 ขึ้นไป",
    experience: "ไม่จำกัดประสบการณ์",
    tags: ["งานบริการ", "แคชเชียร์", "จัดเรียงสินค้า"],
    logo: "CPALL"
  },
  {
    id: "job-3",
    title: "เจ้าหน้าที่ธุรการประสานงาน",
    company: "บริษัท ปูนซิเมนต์ไทย จำกัด (มหาชน)",
    salary: "16,000 - 20,000 บาท",
    location: "สมุทรปราการ",
    qualification: "วุฒิ ปวช. ขึ้นไป",
    experience: "มีประสบการณ์ 1-2 ปี",
    tags: ["งานเอกสาร", "คีย์ข้อมูล", "ประสานงาน"],
    logo: "SCG"
  },
  {
    id: "job-4",
    title: "ช่างเทคนิคซ่อมบำรุง",
    company: "บริษัท ปตท. จำกัด (มหาชน)",
    salary: "18,000 - 25,000 บาท",
    location: "ระยอง",
    qualification: "วุฒิ ปวส. ขึ้นไป",
    experience: "ประสบการณ์ 1-3 ปี",
    tags: ["ช่างไฟ", "งานซ่อมบำรุง", "ปั๊มน้ำมัน"],
    logo: "PTT"
  },
  {
    id: "job-5",
    title: "พนักงานจัดส่งพัสดุ",
    company: "บริษัท เคอรี่ เอ็กซ์เพรส (ประเทศไทย) จำกัด",
    salary: "16,000 - 20,000 บาท",
    location: "กรุงเทพมหานคร",
    qualification: "วุฒิ ม.3 มีใบขับขี่",
    experience: "ไม่จำกัดประสบการณ์",
    tags: ["จัดส่งสินค้า", "ขับรถ"],
    logo: "KERRY"
  }
];

const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    title: "หลักสูตรช่างไฟฟ้าเบื้องต้นในครัวเรือน",
    provider: "กรมพัฒนาฝีมือแรงงาน",
    rating: 4.8,
    views: 12543,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "course-2",
    title: "ทักษะการตลาดและการขายออนไลน์ยุคดิจิทัล",
    provider: "สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ (ETDA)",
    rating: 4.6,
    views: 8921,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "course-3",
    title: "การใช้งานคอมพิวเตอร์และอินเทอร์เน็ตเพื่อการประกอบอาชีพ",
    provider: "กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม",
    rating: 4.7,
    views: 15678,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&auto=format&fit=crop&q=60"
  },
  {
    id: "course-4",
    title: "ช่างซ่อมบำรุงรถจักรยานยนต์มืออาชีพ",
    provider: "สถาบันพัฒนาฝีมือแรงงานภาค 1",
    rating: 4.9,
    views: 9342,
    isFree: true,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&auto=format&fit=crop&q=60"
  }
];

const INITIAL_EMERGENCY_REQUESTS: EmergencyRequest[] = [
  {
    id: "EM-9901",
    probationerId: "PB6705-123458",
    probationerName: "นายทวีศักดิ์ มั่นคง",
    reason: "พาหนะเดินทางชำรุดเสียหาย",
    details: "รถจักรยานยนต์ยางระเบิดขณะเดินทางไปบำเพ็ญประโยชน์ที่วัดเขารูปช้าง ไม่สามารถไปทันกำหนดรายงานตัวได้",
    location: { lat: 7.1352, lng: 100.6215 },
    timestamp: "26 มิถุนายน 2570 09:15 น.",
    status: "รอการติดต่อกลับ"
  }
];

const INITIAL_OBSERVATION_NOTES: ObservationNote[] = [
  {
    id: "NOTE-101",
    probationerId: "PB6705-123456",
    probationerName: "นายสมชาย ใจดี",
    content: "ติดตามตรวจเยี่ยมสถานที่ทำงานอาสาคืบหน้าเรียบร้อยดี มีความขยันขันแข็งและตรงต่อเวลา และได้รับคำชื่นชมจากทางวัดบ่อยางในการช่วยทำความสะอาด",
    timestamp: "18 มิถุนายน 2570 14:30 น.",
    officerName: "นายณัฐพงษ์ มั่นคง"
  },
  {
    id: "NOTE-102",
    probationerId: "PB6705-123457",
    probationerName: "นายธนวัฒน์ รักดี",
    content: "เข้ารับการปรึกษาร่วมกับพนักงานคุมประพฤติและวิทยากรหลักสูตรบำบัดฟื้นฟูยาเสพติด CBT แสดงทัศนคติที่ดี มีความตั้งใจสูงในการเลิกพฤติกรรมเสี่ยง",
    timestamp: "20 มิถุนายน 2570 11:15 น.",
    officerName: "นายณัฐพงษ์ มั่นคง"
  },
  {
    id: "NOTE-103",
    probationerId: "PB6705-123458",
    probationerName: "นายวิชัย ใจกล้า",
    content: "โทรสอบถามติดตามสาเหตุที่ไม่เดินทางมารายงานตัวตามนัดหมาย พบว่ามีอุปสรรคเรื่องรายได้และครอบครัวขัดแย้ง แนะนำแนวทางลดปัญหาเบื้องต้นแล้ว",
    timestamp: "22 มิถุนายน 2570 10:00 น.",
    officerName: "นายณัฐพงษ์ มั่นคง"
  }
];

const INITIAL_RISK_ASSESSMENTS: RiskAssessmentRecord[] = [
  {
    id: "RISK-201",
    probationerId: "PB6705-123456",
    probationerName: "นายสมชาย ใจดี",
    date: "15 พฤษภาคม 2570",
    crimeHistory: 0,
    drugUsage: 0,
    environment: 1,
    compliance: 0,
    totalScore: 1,
    riskLevel: "ต่ำ",
    recommendation: "แนะนำพบเจ้าหน้าที่ตามเงื่อนไขปกติ (1 ครั้งต่อเดือน) และสนับสนุนพาสปอร์ตส่งเสริมวิชาชีพสุจริต",
    officerName: "นายณัฐพงษ์ มั่นคง"
  },
  {
    id: "RISK-202",
    probationerId: "PB6705-123457",
    probationerName: "นายธนวัฒน์ รักดี",
    date: "18 พฤษภาคม 2570",
    crimeHistory: 1,
    drugUsage: 2,
    environment: 1,
    compliance: 1,
    totalScore: 5,
    riskLevel: "ปานกลาง",
    recommendation: "แนะนำพิจารณาเพิ่มความถี่การพบเจ้าหน้าที่ (2 ครั้งต่อเดือน) ร่วมกับการส่งเข้ารับการบำบัดฟื้นฟูตามหลักสูตรปรับเปลี่ยนพฤติกรรมสะสม",
    officerName: "นายณัฐพงษ์ มั่นคง"
  },
  {
    id: "RISK-203",
    probationerId: "PB6705-123458",
    probationerName: "นายวิชัย ใจกล้า",
    date: "20 พฤษภาคม 2570",
    crimeHistory: 2,
    drugUsage: 3,
    environment: 2,
    compliance: 2,
    totalScore: 9,
    riskLevel: "สูงมาก / เฝ้าระวังรุนแรง",
    recommendation: "⚠️ ต้องเพิ่มมาตรการคุมเข้มเป็นพิเศษ! บังคับรายงานตัวสัปดาห์ละ 1 ครั้ง และสุ่มสกัดตรวจสารเสพติด (Urine Test) ทุกรอบนัดหมาย ห้ามเข้าใกล้สถานบริการกลุ่มเสี่ยง",
    officerName: "นายณัฐพงษ์ มั่นคง"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>("PROBATIONER");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentViewState] = useState<string>("DASHBOARD");
  
  // Dynamic Data States
  const [probationerProfile, setProbationerProfile] = useState<ProfileData>(INITIAL_PROBATIONER);
  const [probationers, setProbationers] = useState<ProfileData[]>(INITIAL_PROBATIONERS_LIST);
  const [selectedProbationerId, setSelectedProbationerId] = useState<string>("");
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(INITIAL_EMERGENCY_REQUESTS);
  const [observationNotes, setObservationNotes] = useState<ObservationNote[]>(INITIAL_OBSERVATION_NOTES);
  const [riskAssessmentRecords, setRiskAssessmentRecords] = useState<RiskAssessmentRecord[]>(INITIAL_RISK_ASSESSMENTS);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "สวัสดีครับคุณสมชาย ยินดีต้อนรับสู่ผู้ช่วยอัจฉริยะ (PROGRESS+ AI Assistant) สำหรับช่วยเหลือ แนะนำข้อมูลการปฏิบัติตน ตรวจสอบวันรายงานตัว ชั่วโมงบริการสังคม หรือข้อมูลตำแหน่งงานในระบบค่ะ มีเรื่องอะไรให้หนูช่วยไหมคะ?",
      timestamp: new Date()
    }
  ]);

  // Load active view based on role
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === "PROBATIONER") {
      setCurrentViewState("DASHBOARD");
    } else if (newRole === "OFFICER") {
      setCurrentViewState("OFFICER_DASHBOARD");
    } else if (newRole === "PARTNER") {
      setCurrentViewState("PARTNER_DASHBOARD");
    }
  };

  const setCurrentView = (view: string) => {
    setCurrentViewState(view);
  };

  const updateProbationerProfile = (updated: ProfileData) => {
    setProbationerProfile(updated);
    // Sync with probationers list
    setProbationers(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const selectProbationer = (id: string) => {
    setSelectedProbationerId(id);
  };

  const approveActivityApplication = (activityId: string, probationerId: string) => {
    approveApplicant(activityId, probationerId);
  };

  const completeActivityApplication = (activityId: string, probationerId: string, ratingObj: any) => {
    const ratings = {
      responsibility: ratingObj.responsibility || 5,
      punctuality: ratingObj.punctuality || 5,
      cooperation: ratingObj.cooperation || 5,
      behavior: ratingObj.behavior || 5
    };
    submitEvaluation(activityId, probationerId, ratings, ratingObj.comment || "");
  };

  const closeProbationerCase = (probationerId: string) => {
    setProbationers(prev => prev.map(p => {
      if (p.id !== probationerId) return p;
      return {
        ...p,
        status: "พ้นการคุมประพฤติ",
        behaviorScore: 100
      };
    }));
    if (probationerId === probationerProfile.id) {
      setProbationerProfile(prev => ({
        ...prev,
        status: "พ้นการคุมประพฤติ",
        behaviorScore: 100
      }));
    }
  };

  const updateBehaviorScore = (probationerId: string, scoreVal: number) => {
    setProbationers(prev => prev.map(p => {
      if (p.id !== probationerId) return p;
      const newScore = Math.min(100, Math.max(0, p.behaviorScore + scoreVal));
      return {
        ...p,
        behaviorScore: newScore
      };
    }));
    if (probationerId === probationerProfile.id) {
      setProbationerProfile(prev => {
        const newScore = Math.min(100, Math.max(0, prev.behaviorScore + scoreVal));
        return {
          ...prev,
          behaviorScore: newScore
        };
      });
    }
  };

  const submitOnlineReport = (reportName: string, text: string, photoUrl?: string, location?: { lat: number; lng: number }) => {
    setProbationerProfile(prev => {
      const newCompletedReports = Math.min(prev.totalReports, prev.completedReports + 1);
      const newDocumentCount = Math.min(prev.totalDocuments, prev.documentCount + 1);
      return {
        ...prev,
        completedReports: newCompletedReports,
        documentCount: newDocumentCount
      };
    });
    
    // Add real-time notification
    addNotification(
      "ยื่นรายงานตัวออนไลน์สำเร็จ",
      `รายงานตัวประจำรอบ '${reportName}' ของคุณได้รับการบันทึกแล้ว พร้อมรูปถ่ายยืนยันตัวตน และพิกัด Geolocation ตรวจสอบจริง (${location?.lat || 7.1476}, ${location?.lng || 100.6128})`,
      "รายงานตัว"
    );
  };

  const addEmergencyRequest = (reason: string, details: string, lat: number, lng: number) => {
    const newReq: EmergencyRequest = {
      id: `EM-${Date.now().toString().slice(-4)}`,
      probationerId: probationerProfile.id,
      probationerName: probationerProfile.name,
      reason,
      details,
      location: { lat, lng },
      timestamp: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }) + " " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
      status: "รอการติดต่อกลับ"
    };
    setEmergencyRequests(prev => [newReq, ...prev]);

    // Send real urgent system alert notification
    addNotification(
      "🆘 คำขอความช่วยเหลือ SOS ด่วน",
      `คุณ ${probationerProfile.name} ขอความช่วยเหลือกรณี '${reason}': ${details}`,
      "ระบบ",
      true
    );
  };

  const updateEmergencyRequestStatus = (id: string, status: EmergencyRequest["status"]) => {
    setEmergencyRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const addObservationNote = (probationerId: string, content: string, officerName?: string) => {
    const pName = probationers.find(p => p.id === probationerId)?.name || "ผู้ถูกคุมประพฤติ";
    const newNote: ObservationNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      probationerId,
      probationerName: pName,
      content,
      timestamp: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }) + " " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.",
      officerName: officerName || "นายณัฐพงษ์ มั่นคง"
    };
    setObservationNotes(prev => [newNote, ...prev]);

    addNotification(
      "บันทึกโน้ตสังเกตการณ์พฤติกรรมรายวัน",
      `พนักงานคุมประพฤติได้เพิ่มบันทึกสังเกตการณ์ของ ${pName}: "${content.slice(0, 40)}${content.length > 40 ? "..." : ""}"`,
      "ระบบ"
    );
  };

  const addRiskAssessmentRecord = (record: Omit<RiskAssessmentRecord, "id" | "date">) => {
    const newRecord: RiskAssessmentRecord = {
      ...record,
      id: `RISK-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })
    };
    setRiskAssessmentRecords(prev => [newRecord, ...prev]);

    addNotification(
      "ประเมินดัชนีความเสี่ยงใหม่สำเร็จ",
      `ระบบได้บันทึกผลการประเมินความเสี่ยงประเภทการผิดซ้ำของ ${record.probationerName} ระดับความเสี่ยง: ${record.riskLevel}`,
      "ระบบ"
    );
  };

  const updateProbationerHoursDirectly = (probationerId: string, hours: number, activityTitle: string, partnerName: string) => {
    const pName = probationers.find(p => p.id === probationerId)?.name || "ผู้ถูกคุมประพฤติ";
    
    setProbationers(prev => prev.map(p => {
      if (p.id !== probationerId) return p;
      return {
        ...p,
        completedHours: Math.min(p.requiredHours, p.completedHours + hours),
        totalActivities: p.totalActivities + 1
      };
    }));

    if (probationerId === probationerProfile.id) {
      setProbationerProfile(prev => ({
        ...prev,
        completedHours: Math.min(prev.requiredHours, prev.completedHours + hours),
        totalActivities: prev.totalActivities + 1
      }));
    }

    addNotification(
      "อัปเดตชั่วโมงบำเพ็ญประโยชน์ออนไลน์สำเร็จ",
      `หน่วยงานภาคี '${partnerName}' ได้อนุมัติและอัปเดตวิทยฐานะชั่วโมงบำเพ็ญประโยชน์จำนวน ${hours} ชั่วโมง สำหรับกิจกรรม '${activityTitle}' เข้าสู่โปรไฟล์ผู้ถูกคุมประพฤติ ${pName} เรียบร้อยแล้ว`,
      "ชั่วโมงบำเพ็ญประโยชน์",
      true
    );
  };

  const markAsRead = (id: string) => {
    markNotificationRead(id);
  };

  const clearAllNotifications = () => {
    clearNotifications();
  };

  // 1. Apply for Activity
  const applyForActivity = (activityId: string, probationerId: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      
      const alreadyApplied = act.applicants.some(app => app.probationerId === probationerId);
      if (alreadyApplied) return act;
      
      // Get the probationer info
      const prob = probationers.find(p => p.id === probationerId) || INITIAL_PROBATIONER;
      
      return {
        ...act,
        currentParticipants: act.currentParticipants + 1,
        applicants: [
          ...act.applicants,
          {
            probationerId: prob.id,
            probationerName: prob.name,
            avatarUrl: prob.avatarUrl,
            status: "รออนุมัติ"
          }
        ]
      };
    }));

    // Add alert notification
    addNotification(
      "ยื่นใบสมัครเข้าร่วมกิจกรรมสำเร็จ",
      `คุณได้สมัครเข้าร่วมกิจกรรม '${activities.find(a => a.id === activityId)?.title || "กิจกรรมบริการสังคม"}' แล้ว กรุณารอการอนุมัติจากหน่วยงานภาคี`,
      "กิจกรรม"
    );
  };

  // 2. Approve Applicant
  const approveApplicant = (activityId: string, probationerId: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        applicants: act.applicants.map(app => {
          if (app.probationerId !== probationerId) return app;
          return { ...app, status: "อนุมัติแล้ว" };
        })
      };
    }));

    const activityName = activities.find(a => a.id === activityId)?.title || "กิจกรรม";
    const probName = probationers.find(p => p.id === probationerId)?.name || "ผู้ถูกคุมประพฤติ";

    // Create system notify
    addNotification(
      "คุณได้รับการอนุมัติให้เข้าร่วมกิจกรรม",
      `ใบสมัครเข้าร่วมกิจกรรม '${activityName}' ของคุณได้รับการอนุมัติแล้ว โปรดตรวจสอบวันเวลาและเดินทางไปเข้าร่วมตามกำหนด`,
      "กิจกรรม",
      true
    );
  };

  // 3. Check In to Activity
  const checkInActivity = (activityId: string, probationerId: string, time: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        applicants: act.applicants.map(app => {
          if (app.probationerId !== probationerId) return app;
          return {
            ...app,
            status: "เช็กอินแล้ว",
            checkInTime: time
          };
        })
      };
    }));

    addNotification(
      "สแกนเช็กอินเข้าร่วมกิจกรรมสำเร็จ",
      `บันทึกเช็กอินเวลา ${time} สำหรับผู้ใช้งานรหัส ${probationerId} สำเร็จ ระบบกำลังติดตามการเข้าร่วม`,
      "กิจกรรม"
    );
  };

  // 4. Check Out from Activity
  const checkOutActivity = (
    activityId: string,
    probationerId: string,
    time: string,
    photos: string[],
    signature: string
  ) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        applicants: act.applicants.map(app => {
          if (app.probationerId !== probationerId) return app;
          return {
            ...app,
            status: "เสร็จสิ้น",
            checkOutTime: time
          };
        })
      };
    }));

    // Update probationer stats
    const activity = activities.find(a => a.id === activityId);
    const addedHours = activity?.hours || 4;

    if (probationerId === probationerProfile.id) {
      const updatedProfile = {
        ...probationerProfile,
        completedHours: Math.min(probationerProfile.requiredHours, probationerProfile.completedHours + addedHours),
        totalActivities: probationerProfile.totalActivities + 1
      };
      setProbationerProfile(updatedProfile);
      setProbationers(prev => prev.map(p => p.id === probationerId ? updatedProfile : p));
    } else {
      setProbationers(prev => prev.map(p => {
        if (p.id !== probationerId) return p;
        return {
          ...p,
          completedHours: Math.min(p.requiredHours, p.completedHours + addedHours),
          totalActivities: p.totalActivities + 1
        };
      }));
    }

    addNotification(
      "บันทึกชั่วโมงบำเพ็ญประโยชน์สำเร็จ",
      `ยินดีด้วย! คุณสะสมเพิ่มอีก ${addedHours} ชั่วโมงรวมจากการเสร็จสิ้นกิจกรรม '${activity?.title}' สำเร็จ ลายเซ็นและภาพถ่ายถูกบันทึกในระบบเรียบร้อย`,
      "ชั่วโมงบำเพ็ญประโยชน์",
      true
    );
  };

  // 5. Submit Evaluation
  const submitEvaluation = (
    activityId: string,
    probationerId: string,
    ratings: { responsibility: number; punctuality: number; cooperation: number; behavior: number },
    comment: string
  ) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        applicants: act.applicants.map(app => {
          if (app.probationerId !== probationerId) return app;
          return {
            ...app,
            rating: {
              ...ratings,
              comment,
              date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })
            }
          };
        })
      };
    }));

    // Recalculate behavior score of probationer
    const averageRating = (ratings.responsibility + ratings.punctuality + ratings.cooperation + ratings.behavior) / 4;
    const addedPoints = Math.round(averageRating * 2); // e.g. 5 stars = +10 points

    setProbationers(prev => prev.map(p => {
      if (p.id !== probationerId) return p;
      const newScore = Math.min(100, Math.max(0, p.behaviorScore + addedPoints - 5)); // adjusted slightly
      return {
        ...p,
        behaviorScore: newScore
      };
    }));

    if (probationerId === probationerProfile.id) {
      setProbationerProfile(prev => ({
        ...prev,
        behaviorScore: Math.min(100, Math.max(0, prev.behaviorScore + addedPoints - 5))
      }));
    }

    addNotification(
      "การประเมินกิจกรรมของคุณได้รับการบันทึก",
      `หน่วยงานภาคีส่งผลประเมินระดับคุณธรรมและพฤติกรรมจากการเข้าร่วมกิจกรรมล่าสุดแล้ว คุณได้รับคะแนนผลงานอยู่ในเกณฑ์ยอดเยี่ยม`,
      "ระบบ"
    );
  };

  // 6. Add Volunteer Activity (Partner)
  const addActivity = (actData: Omit<Activity, "id" | "currentParticipants" | "applicants">) => {
    const newAct: Activity = {
      ...actData,
      id: `act-${Date.now()}`,
      currentParticipants: 0,
      applicants: []
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // 7. Delete Volunteer Activity
  const deleteActivity = (activityId: string) => {
    setActivities(prev => prev.filter(act => act.id !== activityId));
  };

  // 8. Add Appointment (Officer)
  const addAppointment = (aptData: Omit<Appointment, "id" | "status">) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: "รอยืนยัน"
    };
    setAppointments(prev => [newApt, ...prev]);

    // Add notice for probationer
    if (aptData.probationerId === probationerProfile.id) {
      addNotification(
        "มีกำหนดนัดหมายการคุมประพฤติใหม่",
        `เจ้าหน้าที่คุมประพฤติได้ออกใบนัดนัดประเภท '${aptData.type}' วันที่ ${aptData.date} เวลา ${aptData.time} น. กรุณากดตรวจสอบหรือเลื่อนนัดในระบบ`,
        "รายงานตัว",
        true
      );
    }
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
  };

  // 9. Notifications Management
  const addNotification = (title: string, description: string, category: NotificationItem["category"], urgent = false) => {
    const newItem: NotificationItem = {
      id: `not-${Date.now()}`,
      title,
      description,
      timeAgo: "เมื่อสักครู่",
      category,
      isRead: false,
      urgent
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(item => item.id === id ? { ...item, isRead: true } : item));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  // 10. AI Chatbot
  const sendChatMessage = async (msgText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: msgText,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMsg]);

    try {
      // Build context payload
      const payloadContext = {
        name: probationerProfile.name,
        id: probationerProfile.id,
        status: probationerProfile.status,
        completedHours: probationerProfile.completedHours,
        requiredHours: probationerProfile.requiredHours,
        nextReportDate: "20 พฤษภาคม 2570 เวลา 08:30 น.",
        behaviorScore: probationerProfile.behaviorScore,
        currentView: currentView
      };

      // Prepare history
      const formattedHistory = chatHistory.slice(-10).map(c => ({
        role: c.role,
        text: c.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msgText,
          history: formattedHistory,
          context: payloadContext
        })
      });

      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "model",
        text: data.text || "ขออภัยค่ะ ระบบแชทขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้งนะคะ",
        timestamp: new Date(),
        sources: data.sources,
        suggestedActions: data.suggestedActions
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "model",
        text: "ขออภัยค่ะ ดูเหมือนการสื่อสารกับเซิร์ฟเวอร์ AI ขัดข้องชั่วคราว แต่หนูสามารถแจ้งข้อมูลได้ว่าคุณสมชายมีคิวรายงานตัวครั้งต่อไปใน วันที่ 20 พฤษภาคม 2570 นี้ค่ะ",
        timestamp: new Date(),
        suggestedActions: [
          "เช็กวันรายงานตัวครั้งถัดไปและเงื่อนไขของฉัน",
          "ช่วยแนะนำงานฝึกวิชาชีพด้านช่างฝีมือเทคนิค",
          "เกณฑ์การประเมินคะแนนความประพฤติคืออะไร"
        ]
      };
      setChatHistory(prev => [...prev, errMsg]);
    }
  };

  // 11. Reset State
  const resetPrototypeData = () => {
    setProbationerProfile(INITIAL_PROBATIONER);
    setProbationers(INITIAL_PROBATIONERS_LIST);
    setActivities(INITIAL_ACTIVITIES);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setChatHistory([
      {
        id: "welcome",
        role: "model",
        text: "สวัสดีครับคุณสมชาย ยินดีต้อนรับสู่ผู้ช่วยอัจฉริยะ (PROGRESS+ AI Assistant) สำหรับช่วยเหลือ แนะนำข้อมูลการปฏิบัติตน ตรวจสอบวันรายงานตัว ชั่วโมงบริการสังคม หรือข้อมูลตำแหน่งงานในระบบค่ะ มีเรื่องอะไรให้หนูช่วยไหมคะ?",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        isLoggedIn,
        currentView,
        probationerProfile,
        probationers,
        probationersList: probationers,
        selectedProbationerId,
        activities,
        appointments,
        notifications,
        chatHistory,
        jobs,
        courses,
        emergencyRequests,
        observationNotes,
        riskAssessmentRecords,
        setRole,
        setIsLoggedIn,
        setCurrentView,
        updateProbationerProfile,
        selectProbationer,
        applyForActivity,
        approveApplicant,
        approveActivityApplication,
        checkInActivity,
        checkOutActivity,
        submitEvaluation,
        completeActivityApplication,
        closeProbationerCase,
        updateBehaviorScore,
        submitOnlineReport,
        addActivity,
        deleteActivity,
        addAppointment,
        updateAppointmentStatus,
        addNotification,
        markNotificationRead,
        markAsRead,
        clearNotifications,
        clearAllNotifications,
        sendChatMessage,
        resetPrototypeData,
        addEmergencyRequest,
        updateEmergencyRequestStatus,
        addObservationNote,
        addRiskAssessmentRecord,
        updateProbationerHoursDirectly
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
