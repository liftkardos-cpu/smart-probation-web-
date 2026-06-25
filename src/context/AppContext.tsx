import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  ProfileData,
  Activity,
  Job,
  Course,
  Appointment,
  NotificationItem,
  ChatMessage
} from "../types";

interface AppContextProps {
  role: UserRole;
  isLoggedIn: boolean;
  currentView: string;
  probationerProfile: ProfileData;
  probationers: ProfileData[];
  activities: Activity[];
  appointments: Appointment[];
  notifications: NotificationItem[];
  chatHistory: ChatMessage[];
  jobs: Job[];
  courses: Course[];
  
  // State Setters & Actions
  setRole: (role: UserRole) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setCurrentView: (view: string) => void;
  updateProbationerProfile: (profile: ProfileData) => void;
  
  // Actions
  applyForActivity: (activityId: string, probationerId: string) => void;
  approveApplicant: (activityId: string, probationerId: string) => void;
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
  addActivity: (activity: Omit<Activity, "id" | "currentParticipants" | "applicants">) => void;
  deleteActivity: (activityId: string) => void;
  addAppointment: (appointment: Omit<Appointment, "id" | "status">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  addNotification: (title: string, description: string, category: NotificationItem["category"], urgent?: boolean) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  sendChatMessage: (message: string) => Promise<void>;
  resetPrototypeData: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Core Mock Data
const INITIAL_PROBATIONER: ProfileData = {
  id: "PB6705-123456",
  name: "นายสมชาย ใจดี",
  age: 28,
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=facearea&facepad=2&q=80",
  status: "อยู่ระหว่างคุมประพฤติ",
  nationalId: "1-2345-67890-12-3",
  birthDate: "15 มกราคม 2541",
  gender: "ชาย",
  nationality: "ไทย",
  address: "99/1 หมู่ที่ 4 อำเภอคลองหลวง จังหวัดปทุมธานี รหัสไปรษณีย์ 10270",
  phone: "081-234-5678",
  email: "somchai.jaidee@email.com",
  
  // Case Data
  caseId: "อ.1234/2567",
  court: "ศาลแขวงจังหวัดปทุมธานี",
  charge: "ขับขี่รถจักรยานยนต์ขณะมึนเมาสุราและขับรถโดยประมาทหวาดเสียว",
  sentenceConditions: [
    "รายงานตัวต่อพนักงานคุมประพฤติจำนวน 12 ครั้ง ในระยะเวลา 1 ปี",
    "ทำงานบริการสังคมและสาธารณประโยชน์เป็นเวลา 48 ชั่วโมง",
    "เข้าร่วมกิจกรรมปรับเปลี่ยนพฤติกรรมจำนวน 8 ครั้ง",
    "ห้ามเกี่ยวข้องกับสิ่งเสพติดทุกประเภทและตรวจปัสสาวะตามกำหนด"
  ],
  probationPeriod: {
    start: "20 พฤษภาคม 2567",
    end: "20 พฤษภาคม 2568",
    remainingDays: 365
  },
  probationOfficer: {
    name: "นายณัฐพงษ์ มั่นคง",
    contact: "เบอร์โทร 02-123-4567 ต่อ 402"
  },
  
  // Stats
  behaviorScore: 95,
  completedHours: 150,
  requiredHours: 200,
  totalActivities: 6,
  totalReports: 12,
  completedReports: 8,
  documentCount: 4,
  totalDocuments: 5
};

const INITIAL_PROBATIONERS_LIST: ProfileData[] = [
  INITIAL_PROBATIONER,
  {
    id: "PB6705-123457",
    name: "นายธนวัฒน์ รักดี",
    age: 24,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=facearea&facepad=2&q=80",
    status: "อยู่ระหว่างคุมประพฤติ",
    nationalId: "1-1023-45678-90-1",
    birthDate: "15 มีนาคม 2545",
    gender: "ชาย",
    nationality: "ไทย",
    address: "123 หมู่ 5 ต.บางหลวง อ.เมืองปทุมธานี จ.ปทุมธานี 11130",
    phone: "081-234-5678",
    email: "tanawat.rakdee@email.com",
    caseId: "อ.1235/2567",
    court: "ศาลแขวงปทุมธานี",
    charge: "มียาเสพติดให้โทษประเภท 1 (ยาบ้า) ไว้ในครอบครองเพื่อเสพ",
    sentenceConditions: [
      "รายงานตัวจำนวน 8 ครั้ง ใน 1 ปี",
      "ทำงานบริการสังคม 24 ชั่วโมง",
      "เข้ารับการบำบัดฟื้นฟูยาเสพติด CBT ครบ 12 ครั้ง",
      "ตรวจหาสารเสพติดในปัสสาวะอย่างน้อยเดือนละ 1 ครั้ง"
    ],
    probationPeriod: {
      start: "15 มีนาคม 2567",
      end: "15 มีนาคม 2568",
      remainingDays: 265
    },
    probationOfficer: {
      name: "นายณัฐพงษ์ มั่นคง",
      contact: "เบอร์โทร 02-123-4567 ต่อ 402"
    },
    behaviorScore: 86,
    completedHours: 12,
    requiredHours: 24,
    totalActivities: 3,
    totalReports: 8,
    completedReports: 3,
    documentCount: 3,
    totalDocuments: 4
  },
  {
    id: "PB6705-123458",
    name: "นายวิชัย ใจกล้า",
    age: 32,
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=facearea&facepad=2&q=80",
    status: "อยู่ระหว่างคุมประพฤติ",
    nationalId: "3-1204-55667-88-9",
    birthDate: "20 ตุลาคม 2537",
    gender: "ชาย",
    nationality: "ไทย",
    address: "56 ต.สวนพริกไทย อ.เมืองปทุมธานี จ.ปทุมธานี 11130",
    phone: "089-999-8888",
    email: "wichai.jaikla@email.com",
    caseId: "อ.554/2567",
    court: "ศาลจังหวัดปทุมธานี",
    charge: "ลักทรัพย์ในเวลากลางคืน",
    sentenceConditions: [
      "รายงานตัวจำนวน 10 ครั้ง ใน 1 ปี",
      "ทำงานบริการสังคม 48 ชั่วโมง",
      "ห้ามออกนอกเคหสถานระหว่างเวลา 22.00 - 04.00 น."
    ],
    probationPeriod: {
      start: "10 กุมภาพันธ์ 2567",
      end: "10 กุมภาพันธ์ 2568",
      remainingDays: 230
    },
    probationOfficer: {
      name: "นางสาวสุรีย์ ตันติพงษ์",
      contact: "เบอร์โทร 02-123-4567 ต่อ 405"
    },
    behaviorScore: 52,
    completedHours: 0,
    requiredHours: 48,
    totalActivities: 0,
    totalReports: 10,
    completedReports: 2,
    documentCount: 1,
    totalDocuments: 5
  },
  {
    id: "PB6705-123459",
    name: "นางสาวสุรีย์ เสมอใจ",
    age: 25,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=facearea&facepad=2&q=80",
    status: "ปกติ",
    nationalId: "3-1402-99881-22-1",
    birthDate: "5 เมษายน 2544",
    gender: "หญิง",
    nationality: "ไทย",
    address: "12/4 ซอยติวานนท์ ต.ปากเกร็ด อ.ปากเกร็ด จ.นนทบุรี 11120",
    phone: "085-555-4444",
    email: "suree.sam@email.com",
    caseId: "อ.789/2566",
    court: "ศาลแขวงจังหวัดนนทบุรี",
    charge: "ขับรถขณะมึนเมาสุราจนเป็นเหตุให้ผู้อื่นได้รับอันตราย",
    sentenceConditions: [
      "รายงานตัว 4 ครั้ง ใน 1 ปี",
      "ทำงานบริการสังคม 24 ชั่วโมง",
      "อบรมวินัยจราจร 1 ครั้ง"
    ],
    probationPeriod: {
      start: "1 พฤษภาคม 2566",
      end: "1 พฤษภาคม 2567",
      remainingDays: 0
    },
    probationOfficer: {
      name: "นายณัฐพงษ์ มั่นคง",
      contact: "เบอร์โทร 02-123-4567 ต่อ 402"
    },
    behaviorScore: 100,
    completedHours: 24,
    requiredHours: 24,
    totalActivities: 4,
    totalReports: 4,
    completedReports: 4,
    documentCount: 4,
    totalDocuments: 4
  }
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    title: "ทำความสะอาดวัดพระธรรมกาย",
    category: "วัด/ศาสนสถาน",
    organizer: "วัดพระธรรมกาย จ.ปทุมธานี",
    location: "วัดพระธรรมกาย ต.คลองสาม อ.คลองหลวง จ.ปทุมธานี",
    province: "ปทุมธานี",
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
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=facearea&facepad=2&q=80",
        status: "เสร็จสิ้น",
        checkInTime: "08:35:22",
        checkOutTime: "12:05:18",
        rating: {
          responsibility: 5,
          punctuality: 4,
          cooperation: 5,
          behavior: 5,
          comment: "ตั้งใจทำงานดีมาก ให้ความร่วมมือกับทีมงานและพระสงฆ์เป็นอย่างดี สุภาพเรียบร้อยดีมาก",
          date: "25 พ.ค. 2567"
        }
      }
    ]
  },
  {
    id: "act-2",
    title: "ปรับปรุงภูมิทัศน์และทาสีโรงเรียน",
    category: "โรงเรียน/การศึกษา",
    organizer: "โรงเรียนบ้านคลองหลวง",
    location: "โรงเรียนบ้านคลองหลวง ต.คลองหนึ่ง อ.คลองหลวง จ.ปทุมธานี",
    province: "ปทุมธานี",
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
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=facearea&facepad=2&q=80",
        status: "เสร็จสิ้น",
        checkInTime: "08:31:00",
        checkOutTime: "12:02:10",
        rating: {
          responsibility: 4,
          punctuality: 5,
          cooperation: 4,
          behavior: 4,
          comment: "มาถึงก่อนเวลา ทำงานทาสีอย่างขยันขันแข็ง ปฏิบัติตามคำสั่งดี",
          date: "22 พ.ค. 2567"
        }
      },
      {
        probationerId: "PB6705-123457",
        probationerName: "นายธนวัฒน์ รักดี",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=facearea&facepad=2&q=80",
        status: "เสร็จสิ้น",
        checkInTime: "08:42:00",
        checkOutTime: "12:00:00",
        rating: {
          responsibility: 3,
          punctuality: 3,
          cooperation: 4,
          behavior: 4,
          comment: "มาสายนิดหน่อย แต่ช่วยยกถังสีและอุปกรณ์ได้ดี พูดจาสุภาพ",
          date: "22 พ.ค. 2567"
        }
      }
    ]
  },
  {
    id: "act-3",
    title: "พัฒนาสวนสาธารณะเทศบาลเมืองปทุมธานี",
    category: "เทศบาล/ชุมชน",
    organizer: "เทศบาลเมืองปทุมธานี",
    location: "สวนเทพปทุม ถ.พัฒนสัมพันธ์ ต.บางปรอก อ.เมืองปทุมธานี จ.ปทุมธานี",
    province: "ปทุมธานี",
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
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=facearea&facepad=2&q=80",
        status: "อนุมัติแล้ว"
      },
      {
        probationerId: "PB6705-123457",
        probationerName: "นายธนวัฒน์ รักดี",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=facearea&facepad=2&q=80",
        status: "รออนุมัติ"
      }
    ]
  },
  {
    id: "act-4",
    title: "เก็บขยะชายหาดสมิหลา",
    category: "สิ่งแวดล้อม",
    organizer: "เทศบาลนครหาดใหญ่",
    location: "หาดชลาทัศน์/หาดสมิหลา อ.เมืองสงขลา จ.สงขลา",
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
    title: "เยี่ยมผู้สูงอายุและทำความสะอาดที่พักคนชรา",
    category: "สาธารณประโยชน์",
    organizer: "ศูนย์พัฒนาการจัดสวัสดิการสังคมผู้สูงอายุจังหวัดปทุมธานี",
    location: "ศูนย์พัฒนาการจัดสวัสดิการสังคมผู้สูงอายุ ต.รังสิต อ.ธัญบุรี จ.ปทุมธานี",
    province: "ปทุมธานี",
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
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=facearea&facepad=2&q=80",
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
    description: "คุณมีกำหนดการรายงานตัวตามคำสั่งศาลในอีก 5 วัน (วันที่ 20 พฤษภาคม 2567 เวลา 08:30 น.) กรุณาจัดเตรียมบัตรประจำตัวประชาชน",
    timeAgo: "10 นาทีที่แล้ว",
    category: "รายงานตัว",
    isRead: false,
    urgent: true
  },
  {
    id: "not-2",
    title: "กิจกรรมบำเพ็ญประโยชน์เปิดรับสมัครเพิ่ม",
    description: "กิจกรรม 'พัฒนาสวนสาธารณะเทศบาลเมืองปทุมธานี' ใกล้พื้นที่ของคุณเปิดรับสมัคร ดำเนินการโดยเทศบาลเมืองปทุมธานี ได้รับ 4 ชั่วโมงสะสม",
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>("PROBATIONER");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentViewState] = useState<string>("DASHBOARD");
  
  // Dynamic Data States
  const [probationerProfile, setProbationerProfile] = useState<ProfileData>(INITIAL_PROBATIONER);
  const [probationers, setProbationers] = useState<ProfileData[]>(INITIAL_PROBATIONERS_LIST);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "สวัสดีครับคุณสมชาย ยินดีต้อนรับสู่ผู้ช่วยอัจฉริยะ (Smart Probation AI Assistant) สำหรับช่วยเหลือ แนะนำข้อมูลการปฏิบัติตน ตรวจสอบวันรายงานตัว ชั่วโมงบริการสังคม หรือข้อมูลตำแหน่งงานในระบบค่ะ มีเรื่องอะไรให้หนูช่วยไหมคะ?",
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
        nextReportDate: "20 พฤษภาคม 2567 เวลา 08:30 น.",
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
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "model",
        text: "ขออภัยค่ะ ดูเหมือนการสื่อสารกับเซิร์ฟเวอร์ AI ขัดข้องชั่วคราว แต่หนูสามารถแจ้งข้อมูลได้ว่าคุณสมชายมีคิวรายงานตัวครั้งต่อไปใน วันที่ 20 พฤษภาคม 2567 นี้ค่ะ",
        timestamp: new Date()
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
        text: "สวัสดีครับคุณสมชาย ยินดีต้อนรับสู่ผู้ช่วยอัจฉริยะ (Smart Probation AI Assistant) สำหรับช่วยเหลือ แนะนำข้อมูลการปฏิบัติตน ตรวจสอบวันรายงานตัว ชั่วโมงบริการสังคม หรือข้อมูลตำแหน่งงานในระบบค่ะ มีเรื่องอะไรให้หนูช่วยไหมคะ?",
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
        activities,
        appointments,
        notifications,
        chatHistory,
        jobs,
        courses,
        setRole,
        setIsLoggedIn,
        setCurrentView,
        updateProbationerProfile,
        applyForActivity,
        approveApplicant,
        checkInActivity,
        checkOutActivity,
        submitEvaluation,
        addActivity,
        deleteActivity,
        addAppointment,
        updateAppointmentStatus,
        addNotification,
        markNotificationRead,
        clearNotifications,
        sendChatMessage,
        resetPrototypeData
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
