import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { 
  MapPin, 
  AlertCircle, 
  ShieldCheck, 
  Map as MapIcon, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Compass, 
  Filter, 
  CheckCircle,
  TrendingUp,
  Info
} from "lucide-react";

// Types
interface RiskArea {
  id: string;
  province: string;
  district: string;
  lat: number;
  lng: number;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  caseCount: number;
  details: string;
  category: string;
  region: "NORTH" | "CENTRAL" | "SOUTH" | "NORTHEAST";
}

// Full Thailand Mock Data for Risk areas
const THAILAND_RISK_AREAS: RiskArea[] = [
  {
    id: "th-bkk-1",
    province: "กรุงเทพมหานคร",
    district: "เขตดินแดง-ห้วยขวาง",
    lat: 13.7763,
    lng: 100.5654,
    riskLevel: "HIGH",
    caseCount: 342,
    details: "พบสถิติคดีขับเสพสารเสพติดและขับรถขณะมึนเมาสูงสุดในช่วงวันหยุดสุดสัปดาห์และเทศกาลสำคัญ",
    category: "ขับเสพ & เมาแล้วขับ",
    region: "CENTRAL"
  },
  {
    id: "th-bkk-2",
    province: "กรุงเทพมหานคร",
    district: "เขตคลองเตย",
    lat: 13.7078,
    lng: 100.5562,
    riskLevel: "HIGH",
    caseCount: 218,
    details: "เขตพื้นที่เฝ้าระวังพิเศษคดีสารเสพติดร้ายแรงและการละเมิดเงื่อนไขไม่รายงานตัวตามเวลากำหนด",
    category: "คดียาเสพติด/ฝ่าฝืนเกณฑ์",
    region: "CENTRAL"
  },
  {
    id: "th-non-1",
    province: "นนทบุรี",
    district: "อ.เมืองนนทบุรี (ท่าน้ำนนท์)",
    lat: 13.8591,
    lng: 100.4908,
    riskLevel: "MEDIUM",
    caseCount: 156,
    details: "พบสถิติวินัยจราจรบกพร่องและการรวมกลุ่มรถจักรยานยนต์ดัดแปลงเชิงความมั่นคง",
    category: "คดีจราจร & แข่งรถ",
    region: "CENTRAL"
  },
  {
    id: "th-cmi-1",
    province: "เชียงใหม่",
    district: "อ.เมืองเชียงใหม่ (คูเมือง/นิมมาน)",
    lat: 18.7883,
    lng: 98.9853,
    riskLevel: "HIGH",
    caseCount: 265,
    details: "พบความหนาแน่นของผู้กระทำความผิดคดีดื่มแล้วขับขี่ โดยเฉพาะบริเวณโซนบันเทิงและย่านท่องเที่ยวหนาแน่น",
    category: "เมาแล้วขับเชิงสถิติ",
    region: "NORTH"
  },
  {
    id: "th-kkn-1",
    province: "ขอนแก่น",
    district: "อ.เมืองขอนแก่น (เขตเทศบาลนคร)",
    lat: 16.4322,
    lng: 102.8236,
    riskLevel: "MEDIUM",
    caseCount: 112,
    details: "พื้นที่เฝ้าระวังปานกลาง มุ่งจัดสัดส่วนและกำลังอาสาสมัครลงชุมชนเพื่อทำกิจกรรมบำเพ็ญประโยชน์เชิงบวก",
    category: "คดีจราจรทั่วไป",
    region: "NORTHEAST"
  },
  {
    id: "th-sk-1",
    province: "สงขลา",
    district: "อ.เมืองสงขลา (ต.บ่อยาง)",
    lat: 7.1898,
    lng: 100.5954,
    riskLevel: "HIGH",
    caseCount: 189,
    details: "พิกัดเป้าหมายสูงสุดเชิงพื้นที่ของภาคใต้ คดีขับรถเร็วและกระทำความผิดซ้ำซ้อนในกลุ่มเยาวชน",
    category: "คดีพฤติกรรมผิดซ้ำ",
    region: "SOUTH"
  },
  {
    id: "th-sk-2",
    province: "สงขลา",
    district: "อ.หาดใหญ่ (ต.หาดใหญ่)",
    lat: 7.0084,
    lng: 100.4767,
    riskLevel: "HIGH",
    caseCount: 295,
    details: "ย่านการค้าท่องเที่ยว พบสถิติสูงสุดเกี่ยวกับการละเมิดพิกัดควบคุมอุปกรณ์ติดตามตัวอิเล็กทรอนิกส์ (EM)",
    category: "คดียาเสพติด & ฝ่าฝืน EM",
    region: "SOUTH"
  },
  {
    id: "th-chb-1",
    province: "ชลบุรี",
    district: "อ.บางละมุง (พัทยาใต้)",
    lat: 12.9236,
    lng: 100.8824,
    riskLevel: "HIGH",
    caseCount: 248,
    details: "พิกัดความเสี่ยงวิกาล มีข้อกำหนดพิเศษคุมเข้มห้ามออกนอกเคหสถานตามช่วงเวลาห้ามคุมประพฤติ",
    category: "ฝ่าฝืนเงื่อนไขวิกาล",
    region: "CENTRAL"
  },
  {
    id: "th-pkt-1",
    province: "ภูเก็ต",
    district: "อ.กระทู้ (หาดป่าตอง)",
    lat: 7.8920,
    lng: 98.2958,
    riskLevel: "MEDIUM",
    caseCount: 167,
    details: "เขตพื้นที่ท่องเที่ยว มีการรวมกลุ่มจัดกิจกรรมบริการสังคมเพื่อสาธารณประโยชน์เชิงรุกในการปรับพฤติกรรม",
    category: "กลุ่มจัดบริการสังคม",
    region: "SOUTH"
  },
  {
    id: "th-nma-1",
    province: "นครราชสีมา",
    district: "อ.เมืองนครราชสีมา",
    lat: 14.9799,
    lng: 102.0978,
    riskLevel: "MEDIUM",
    caseCount: 94,
    details: "ศูนย์กลางคมนาคมภาคอีสาน ใช้เฝ้าระวังผู้ถูกคุมความประพฤติผ่านการประเมินความเสี่ยงและส่งฝึกอาชีพเชิงรุก",
    category: "พื้นที่ศูนย์เรียนรู้ฟื้นฟู",
    region: "NORTHEAST"
  },
  {
    id: "th-srt-1",
    province: "สุราษฎร์ธานี",
    district: "เกาะสมุย",
    lat: 9.5120,
    lng: 100.0136,
    riskLevel: "LOW",
    caseCount: 45,
    details: "พิกัดเชิงบวก อัตราการกลับมาทำผิดซ้ำเป็นศูนย์เปอร์เซ็นต์ (0%) ได้รับการประเมินประพฤติดีเยี่ยมสม่ำเสมอ",
    category: "เขตปลอดภัยประพฤติดี",
    region: "SOUTH"
  },
  {
    id: "th-plk-1",
    province: "พิษณุโลก",
    district: "อ.เมืองพิษณุโลก",
    lat: 16.8211,
    lng: 100.2659,
    riskLevel: "LOW",
    caseCount: 38,
    details: "โมเดลความปลอดภัยชุมชนดีเด่น มีเครือข่ายภาคประชาชนช่วยคุมความประพฤติและสนับสนุนงานคืนคนดีสู่สังคม",
    category: "โมเดลปลอดภัยต้นแบบ",
    region: "NORTH"
  }
];

export const HeatMapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  // States
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<RiskArea | null>(null);
  const [activeTab, setActiveTab] = useState<"LIST" | "LEGEND">("LIST");

  // Filtered list
  const filteredAreas = THAILAND_RISK_AREAS.filter((area) => {
    const matchesRegion = selectedRegion === "ALL" || area.region === selectedRegion;
    const matchesRisk = selectedRiskLevel === "ALL" || area.riskLevel === selectedRiskLevel;
    const matchesSearch = 
      area.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesRisk && matchesSearch;
  });

  // Calculate stats based on current view/filters
  const totalCases = filteredAreas.reduce((sum, item) => sum + item.caseCount, 0);
  const highRiskCount = filteredAreas.filter(a => a.riskLevel === "HIGH").length;
  const mediumRiskCount = filteredAreas.filter(a => a.riskLevel === "MEDIUM").length;
  const lowRiskCount = filteredAreas.filter(a => a.riskLevel === "LOW").length;

  // Initialize and Update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map instance if it doesn't exist
    if (!mapInstanceRef.current) {
      // Create Leaflet Map centered on Thailand
      const map = L.map(mapContainerRef.current, {
        center: [13.4, 100.8], // Centralized center of Thailand for optimized view
        zoom: 6,
        zoomControl: false, // Use our custom clean UI buttons instead
        minZoom: 5,
        maxZoom: 18,
      });

      // Add a gorgeous clean minimalist tile layer (looks exactly like custom Apple/iOS/Google Map themes)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // FeatureGroup to store markers for easy clearance and updating
      const markersGroup = L.featureGroup().addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = markersGroup;
    }

    // Refresh markers whenever filtered list changes
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    if (map && markersGroup) {
      // Clear previous markers
      markersGroup.clearLayers();

      // Plot new markers
      filteredAreas.forEach((area) => {
        let pulseClass = "pulse-marker-green";
        let colorTheme = "#10b981";
        let levelText = "ระดับเสี่ยงต่ำ (ปลอดภัย)";

        if (area.riskLevel === "HIGH") {
          pulseClass = "pulse-marker-red";
          colorTheme = "#ef4444";
          levelText = "เฝ้าระวังสูงสุด 🚨";
        } else if (area.riskLevel === "MEDIUM") {
          pulseClass = "pulse-marker-orange";
          colorTheme = "#f59e0b";
          levelText = "เฝ้าระวังปานกลาง ⚠️";
        }

        // Custom pulsing divIcon HTML
        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div class="${pulseClass}" id="marker-${area.id}"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        // Add Marker
        const marker = L.marker([area.lat, area.lng], { icon: customIcon });

        // Bind informative popup styled nicely
        const popupContent = `
          <div class="p-1 font-sans">
            <h4 class="text-sm font-black text-slate-100 mb-1 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" style="background-color: ${colorTheme}"></span>
              ${area.province}
            </h4>
            <p class="text-[11px] font-bold text-slate-400 mb-0.5">${area.district}</p>
            <p class="text-[10px] text-amber-400 font-bold mb-2">${levelText}</p>
            <div class="border-t border-slate-700/50 pt-2 mt-1 flex justify-between items-center">
              <span class="text-[10px] text-slate-400">ผู้คุมประพฤติหนาแน่น:</span>
              <span class="text-xs font-black text-white">${area.caseCount} ราย</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: "custom-leaflet-popup",
          closeButton: true,
          offset: L.point(0, -5),
        });

        // Interaction when clicking marker
        marker.on("click", () => {
          setSelectedArea(area);
          map.setView([area.lat, area.lng], 12);
        });

        markersGroup.addLayer(marker);
      });

      // Automatically adjust bounds to fit only if markers exist and not zoomed in too far
      if (filteredAreas.length > 0) {
        // If we only have 1 area, center on it, else fit bounds of all filtered areas
        if (filteredAreas.length === 1) {
          const single = filteredAreas[0];
          map.setView([single.lat, single.lng], 10);
        }
      }
    }
  }, [filteredAreas]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Map Controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    setSelectedArea(null);
    mapInstanceRef.current?.setView([13.4, 100.8], 6);
  };

  const handleFocusArea = (area: RiskArea) => {
    setSelectedArea(area);
    mapInstanceRef.current?.flyTo([area.lat, area.lng], 12, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  };

  return (
    <div className="space-y-6">
      {/* Styles Injection */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <style>{`
        .pulse-marker-red {
          position: relative;
          width: 14px;
          height: 14px;
        }
        .pulse-marker-red::before {
          content: '';
          position: absolute;
          top: -13px;
          left: -13px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(239, 68, 68, 0.5);
          animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
        .pulse-marker-red::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #ef4444;
          border: 2.5px solid white;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.9);
          animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
        }

        .pulse-marker-orange {
          position: relative;
          width: 14px;
          height: 14px;
        }
        .pulse-marker-orange::before {
          content: '';
          position: absolute;
          top: -13px;
          left: -13px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(245, 158, 11, 0.5);
          animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
        .pulse-marker-orange::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #f59e0b;
          border: 2.5px solid white;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.9);
          animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
        }

        .pulse-marker-green {
          position: relative;
          width: 14px;
          height: 14px;
        }
        .pulse-marker-green::before {
          content: '';
          position: absolute;
          top: -13px;
          left: -13px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(16, 185, 129, 0.4);
          animation: pulse-ring-anim 1.6s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
        }
        .pulse-marker-green::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #10b981;
          border: 2.5px solid white;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.9);
          animation: pulse-dot-anim 1.6s cubic-bezier(0.455, 0.030, 0.515, 0.955) -0.4s infinite;
        }

        @keyframes pulse-ring-anim {
          0% { transform: scale(0.25); opacity: 0.95; }
          80%, 100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes pulse-dot-anim {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(0.8); }
        }

        /* Custom popup styling override */
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95) !important;
          color: white !important;
          border-radius: 1.25rem !important;
          padding: 0.4rem !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5) !important;
          backdrop-blur: 12px;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }
        .custom-leaflet-popup .leaflet-popup-close-button {
          color: rgba(255,255,255,0.7) !important;
          font-weight: bold;
          padding: 6px 8px 0 0 !important;
        }
        .custom-leaflet-popup .leaflet-popup-close-button:hover {
          color: white !important;
        }
      `}</style>

      {/* Heading Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0f2d59] flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#cca43b] animate-spin-slow" />
            <span>แผนที่พิกัดระวังภัยเชิงรุกประเทศไทย (National Risk Heat Map)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            สอดส่องพิกัดพฤติกรรมและความหนาแน่นเชิงสถิติของผู้กระทำความผิดคุมประพฤติทั่วประเทศ จุดเฝ้าระวังสูงสุดแบบกระพริบ (Pulsing Risk Map)
          </p>
        </div>

        {/* Counter Stats Container */}
        <div className="flex items-center gap-3 bg-[#0f2d59]/5 border border-[#0f2d59]/10 px-4 py-2.5 rounded-2xl">
          <TrendingUp className="w-5 h-5 text-[#cca43b]" />
          <div className="text-xs">
            <span className="text-slate-500 font-bold block leading-none">กรณีที่กรองอยู่</span>
            <span className="text-base font-black text-[#0f2d59]">{totalCases.toLocaleString()} รายสะสม</span>
          </div>
        </div>
      </div>

      {/* Quick Interactive KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">จุดเฝ้าระวังทั้งหมด</span>
            <span className="text-2xl font-black text-slate-800 mt-0.5 block">{filteredAreas.length} พื้นที่</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
            <MapIcon className="w-5 h-5 text-[#0f2d59]" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-red-500 block uppercase">เฝ้าระวังสูงสุด</span>
            <span className="text-2xl font-black text-red-600 mt-0.5 block">{highRiskCount} จุด</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-500 block uppercase">เฝ้าระวังปานกลาง</span>
            <span className="text-2xl font-black text-amber-600 mt-0.5 block">{mediumRiskCount} จุด</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-500 block uppercase">พื้นที่ปลอดภัยสูง</span>
            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{lowRiskCount} จุด</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Filter and Map Container */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-5">
        
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter icon prefix */}
            <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-100 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>คัดกรองพิกัด:</span>
            </div>

            {/* Region select dropdown */}
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedArea(null);
              }}
              className="bg-white border border-slate-200 hover:border-[#0f2d59]/30 rounded-xl text-xs font-bold text-slate-700 px-3.5 py-2 cursor-pointer focus:ring-2 focus:ring-[#0f2d59]/10 focus:outline-none transition-all"
            >
              <option value="ALL">ทุกภาคทั่วประเทศ</option>
              <option value="CENTRAL">ภาคกลาง & กทม.</option>
              <option value="NORTH">ภาคเหนือ</option>
              <option value="NORTHEAST">ภาคตะวันออกเฉียงเหนือ</option>
              <option value="SOUTH">ภาคใต้</option>
            </select>

            {/* Risk select dropdown */}
            <select
              value={selectedRiskLevel}
              onChange={(e) => {
                setSelectedRiskLevel(e.target.value);
                setSelectedArea(null);
              }}
              className="bg-white border border-slate-200 hover:border-[#0f2d59]/30 rounded-xl text-xs font-bold text-slate-700 px-3.5 py-2 cursor-pointer focus:ring-2 focus:ring-[#0f2d59]/10 focus:outline-none transition-all"
            >
              <option value="ALL">ทุกระดับความเสี่ยง</option>
              <option value="HIGH">🚨 เฝ้าระวังสูงสุด</option>
              <option value="MEDIUM">⚠️ เฝ้าระวังปานกลาง</option>
              <option value="LOW">✅ พื้นที่ปลอดภัย</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาตามจังหวัด, อำเภอ หรือประเภทคดี..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedArea(null);
              }}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-[#0f2d59]/40 rounded-xl text-xs font-medium pl-10 pr-4 py-2.5 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

        </div>

        {/* Map and Info split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          
          {/* Map display block (Leaflet Interactive Map) */}
          <div className="xl:col-span-8 flex flex-col bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
            
            {/* Embedded custom overlay maps header */}
            <div className="flex items-center justify-between mb-3.5 z-10">
              <span className="text-[11px] font-black text-slate-600 flex items-center gap-1">
                <Compass className="w-4 h-4 text-[#cca43b] animate-pulse" />
                <span>ระบบแผนที่สยามพิกัดระดับความปลอดภัยแบบโต้ตอบ (Interactive Map)</span>
              </span>
              <span className="text-[10px] bg-[#0f2d59]/10 text-[#0f2d59] font-black px-2.5 py-1 rounded-full animate-pulse border border-[#0f2d59]/5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>ONLINE - ZOOMABLE</span>
              </span>
            </div>

            {/* Map wrapper holding the real leaflet div container */}
            <div className="relative w-full h-[480px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              {/* Leaflet instance mount target */}
              <div 
                ref={mapContainerRef} 
                className="w-full h-full z-0 bg-slate-100"
              />

              {/* Floating iOS style controllers on top of the Map */}
              <div className="absolute right-3.5 top-3.5 z-[1000] flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 text-slate-700 hover:text-[#0f2d59] transition-all cursor-pointer backdrop-blur-md"
                  title="ขยายแผนที่"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 text-slate-700 hover:text-[#0f2d59] transition-all cursor-pointer backdrop-blur-md"
                  title="ย่อแผนที่"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetView}
                  className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white border border-slate-200 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 text-slate-700 hover:text-[#0f2d59] transition-all cursor-pointer backdrop-blur-md"
                  title="คืนค่าศูนย์กลางประเทศไทย"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Map Floating Guide Badge */}
              <div className="absolute left-3.5 bottom-3.5 z-[1000] bg-slate-900/90 border border-white/10 text-white text-[10px] font-medium py-1.5 px-3.5 rounded-full shadow-lg backdrop-blur-md pointer-events-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#cca43b] animate-ping" />
                <span>สามารถใช้เมาส์ / สัมผัสเพื่อหมุน ซูมลึก และลากดูภูมิภาคต่างๆ ได้ทั่วประเทศ</span>
              </div>
            </div>
          </div>

          {/* Right sidebar listing & active spot details */}
          <div className="xl:col-span-4 flex flex-col justify-between space-y-4">
            
            {/* Inner top selector */}
            <div className="flex-1 flex flex-col justify-between space-y-3.5">
              
              {/* Tabs list versus legend */}
              <div className="flex border-b border-slate-100 pb-2 justify-between items-center shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("LIST")}
                    className={`text-xs font-extrabold pb-2 px-1 transition-all border-b-2 ${
                      activeTab === "LIST" 
                        ? "border-[#0f2d59] text-[#0f2d59]" 
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    รายการจุดเฝ้าระวัง ({filteredAreas.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("LEGEND")}
                    className={`text-xs font-extrabold pb-2 px-1 transition-all border-b-2 ${
                      activeTab === "LEGEND" 
                        ? "border-[#0f2d59] text-[#0f2d59]" 
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    ดัชนีระเบียบข้อกำหนด
                  </button>
                </div>

                <span className="text-[10px] bg-[#cca43b]/10 text-[#cca43b] px-2 py-0.5 rounded font-black tracking-wide">
                  THAILAND MAP
                </span>
              </div>

              {/* Tab Content Display */}
              <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-2.5">
                {activeTab === "LIST" ? (
                  filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => {
                      const isSelected = selectedArea?.id === area.id;
                      let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                      let markerColor = "bg-emerald-500";
                      
                      if (area.riskLevel === "HIGH") {
                        badgeColor = "bg-red-50 text-red-700 border-red-100";
                        markerColor = "bg-red-500";
                      } else if (area.riskLevel === "MEDIUM") {
                        badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                        markerColor = "bg-amber-500";
                      }

                      return (
                        <div
                          key={area.id}
                          onClick={() => handleFocusArea(area)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                            isSelected 
                              ? "bg-[#0f2d59]/5 border-[#0f2d59]/40 shadow-sm" 
                              : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-extrabold text-xs text-slate-800 block">
                                {area.province}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold block">
                                {area.district}
                              </span>
                            </div>

                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border shrink-0 ${badgeColor}`}>
                              {area.riskLevel === "HIGH" ? "เสี่ยงสูงสุด 🚨" : area.riskLevel === "MEDIUM" ? "เสี่ยงปานกลาง ⚠️" : "ปลอดภัย ✅"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-bold border-t border-slate-50 pt-2 mt-0.5">
                            <span className="text-slate-500 flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${markerColor} animate-pulse shrink-0`} />
                              <span>{area.category}</span>
                            </span>
                            <span className="text-slate-700 font-black">{area.caseCount} รายคดี</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <Info className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-400">ไม่พบจุดเฝ้าระวังที่ตรงกับการค้นหา</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3.5 text-xs text-slate-600 font-bold">
                    <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-start space-x-2.5">
                      <div className="w-3 h-3 rounded-full bg-red-500 shrink-0 mt-1 animate-pulse" />
                      <div>
                        <span className="text-red-900 block font-extrabold text-xs">โซนควบคุมเสี่ยงสูงพิเศษ (Red Node)</span>
                        <p className="text-[10px] text-slate-500 block mt-1 leading-relaxed">
                          พื้นที่สถิติคดีลักขโมย ยาเสพติด หรือขับขี่เมาสุราสูงสุด สอดส่องผ่านด่านตรวจร่วมและมีการแจ้งเตือนสัญญาณ EM ทันทีหากผู้ถูกควบคุมฝ่าฝืนแนวพิกัด
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start space-x-2.5">
                      <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-1 animate-pulse" />
                      <div>
                        <span className="text-amber-900 block font-extrabold text-xs">โซนบำเพ็ญประโยชน์เชิงรุก (Amber Node)</span>
                        <p className="text-[10px] text-slate-500 block mt-1 leading-relaxed">
                          เขตจัดกิจกรรมสังคมเชิงกลุ่มสอดส่อง พนักงานคุมประพฤตินัดพบลำดับกลางเพื่อพัฒนาจิตสาธารณะและร่วมดูแลป่าไม้ ทะเล หรือศาสนสถานชุมชน
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start space-x-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-1 animate-pulse" />
                      <div>
                        <span className="text-emerald-900 block font-extrabold text-xs">พื้นที่ประพฤติต้นแบบ (Green Node)</span>
                        <p className="text-[10px] text-slate-500 block mt-1 leading-relaxed">
                          ชุมชนผู้ถูกคุมประพฤติร่วมมือระดับดีเยี่ยม ปริมาณสถิติคืนคนดีกลับสู่ครอบครัว 100% ปลอดภัยสูง มีผลประเมินพฤติกรรมดีที่สุด
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom active inspection pane */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 relative">
              {selectedArea ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">พิกัดที่คุณตรวจสอบอยู่</span>
                    <button
                      onClick={() => setSelectedArea(null)}
                      className="text-[10px] text-[#0f2d59] hover:underline font-extrabold"
                    >
                      ล้างพิกัด
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-slate-800 font-black text-xs block">
                      📌 {selectedArea.province} ({selectedArea.district})
                    </span>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                      {selectedArea.details}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] bg-[#0f2d59]/5 border border-[#0f2d59]/10 px-3 py-1.5 rounded-lg">
                    <span className="font-bold text-[#0f2d59]">อัตราหนาแน่นคดี:</span>
                    <span className="font-black text-[#0f2d59]">{selectedArea.caseCount} รายคดีสะสม</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="font-bold text-slate-700 block text-xs">💡 ระบบประมวลผลภูมิสารสนเทศเชิงรุก:</span>
                  <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">
                    เลือกคลิกจุดพิกัดในแผนที่ หรือเลือกพื้นที่จากแถบรายการด้านบนเพื่อซูมลึก ตรวจสอบสถานะ คดีหนาแน่น และข้อแนะนำเงื่อนไขความประพฤติได้แบบเจาะลึกทันที
                  </p>
                </>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
