import { 
    X, ArrowLeft, ArrowRight, Factory, Package, ClipboardCheck, 
    UtensilsCrossed, Droplets, MapPin, Phone, Landmark, Link2 
} from "lucide-react";
import { useState, useEffect } from "react";

interface FactorySeemoreProps {
    isOpen: boolean;
    onClose: () => void;
}

const sections = [
    { id: 0, name: "Factory Info", icon: Factory },
    { id: 1, name: "Product Info", icon: Package },
    { id: 2, name: "Inspection", icon: ClipboardCheck },
    { id: 3, name: "Nutrition Info", icon: UtensilsCrossed },
    { id: 4, name: "Raw Milk Quality", icon: Droplets }
];

export default function FactorySeemore({ isOpen, onClose }: FactorySeemoreProps) {
    const [activeSection, setActiveSection] = useState(0);
    const [data, setData] = useState<any>(null);

    // โหลดข้อมูลจาก localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("trackingData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setData(parsedData?.factory ?? null); // โหลดข้อมูลทั้งหมดของ factory
        }
    }, []);
    

    if (!isOpen) return null;
    const factoryData = data; // เพราะ data คือ factory อยู่แล้ว

    const handlePrev = () => {
        setActiveSection((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveSection((prev) => (prev === sections.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-11/12 max-w-6xl h-auto max-h-[90vh] flex flex-col items-center">
                
                {/* ปุ่มปิด */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-3 rounded-full hover:bg-gray-300 transition"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                {/* แถบไอคอนด้านบน (ปรับขนาดและตำแหน่ง) */}
                    <div className="w-full max-w-4xl flex justify-center gap-10 pb-6 border-b border-gray-300">
                        {sections.map((section, index) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(index)}
                                className={`relative flex flex-col items-center transition-all duration-300 ${
                                    activeSection === index ? "text-blue-600 scale-110 drop-shadow-lg glow" : "text-gray-500"
                                }`}
                            >
                                <section.icon className="w-8 h-8 transition-all duration-300" />
                                <span className="text-sm font-semibold mt-1">{section.name}</span>

                                {/* เรืองแสงเมื่อเลือก */}
                                {activeSection === index && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 bg-blue-400 bg-opacity-30 rounded-full blur-md"></div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                {/* ลูกศรเลื่อนซ้าย-ขวา */}
                <button 
                    onClick={handlePrev} 
                    className="absolute left-[-80px] top-1/2 transform -translate-y-1/2 text-[80px] text-white drop-shadow-[0_0_10px_rgba(0,0,255,0.6)] hover:drop-shadow-[0_0_20px_rgba(0,0,255,1)] transition-all hover:scale-125"
                >
                    {"❮"}
                </button>

                <button 
                    onClick={handleNext} 
                    className="absolute right-[-80px] top-1/2 transform -translate-y-1/2 text-[80px] text-white drop-shadow-[0_0_10px_rgba(0,0,255,0.6)] hover:drop-shadow-[0_0_20px_rgba(0,0,255,1)] transition-all hover:scale-125"
                >
                    {"❯"}
                </button>

                {/* แสดงเนื้อหาตามหมวดที่เลือก */}
                    <div className="mt-6 w-full max-w-3xl h-auto flex flex-col gap-6 items-center text-xl font-semibold text-gray-700">
                        {activeSection === 0 && factoryData?.GeneralInfo && (
                            <>
                                    {/* การ์ดเดียว แยกหัวข้อด้วยเส้น */}
                                    <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">

                                        {/* หัวข้อ: ชื่อโรงงาน + รหัสโรงงาน */}
                                        <div className="pb-4">
                                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                                <Landmark className="w-8 h-8 text-blue-600" /> {factoryData?.factoryInfo.companyName}
                                            </h1>
                                        </div>

                                        {/* เส้นแบ่ง */}
                                        <hr className="border-t border-gray-300 my-4" />

                                        {/* หัวข้อ: ที่อยู่โรงงาน */}
                                        <div className="pb-4">
                                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                <MapPin className="w-7 h-7 text-red-600" /> Address
                                            </h2>
                                            <p className="text-lg text-gray-700 mt-1">
                                                {factoryData?.factoryInfo.address}, {factoryData?.factoryInfo.subDistrict}, {factoryData?.factoryInfo.district}, {factoryData?.factoryInfo.province}, {factoryData?.factoryInfo.country}
                                            </p>
                                        </div>

                                        {/* เส้นแบ่ง */}
                                        <hr className="border-t border-gray-300 my-4" />

                                        {/* หัวข้อ: ข้อมูลติดต่อ */}
                                        <div className="pb-4">
                                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                <Phone className="w-7 h-7 text-green-600" /> Contact
                                            </h2>
                                            <p className="text-lg text-gray-700 mt-1">
                                                📞 {factoryData?.factoryInfo.telephone || "-"} <br />
                                                📧 <a href={`mailto:${factoryData?.factoryInfo.email}`} className="text-blue-600 hover:underline">{factoryData?.factoryInfo.email || "-"}</a>
                                            </p>
                                        </div>

                                        {/* เส้นแบ่ง */}
                                        <hr className="border-t border-gray-300 my-4" />

                                        {/* หัวข้อ: ลิงก์ไปยังแผนที่โรงงาน */}
                                        {factoryData?.factoryInfo.locationLink && (
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    <Link2 className="w-7 h-7 text-purple-600" /> Location
                                                </h2>
                                                <a 
                                                    href={factoryData?.factoryInfo.locationLink} 
                                                    target="_blank" 
                                                    className="text-lg text-blue-600 hover:underline break-all"
                                                >
                                                    {factoryData?.factoryInfo.locationLink}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                            </>
                        )}
                        {activeSection === 1 && factoryData?.GeneralInfo && (
                            <>
                                     {/* การ์ด Product Info */}
                                    <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                                        
                                        {/* หัวข้อ: Product Name + Product ID */}
                                        <div className="pb-4 flex justify-between items-center">
                                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                                <Package className="w-8 h-8 text-orange-600" /> {factoryData?.GeneralInfo.productName}
                                            </h2>
                                            <p className="text-lg text-gray-600">
                                                Product ID: <span className="text-gray-900 font-semibold">{factoryData?.GeneralInfo.productId}</span>
                                            </p>
                                        </div>

                                        {/* เส้นแบ่ง */}
                                        <hr className="border-t border-gray-300 my-4" />

                                        {/* Grid 2 คอลัมน์ */}
                                        <div className="grid grid-cols-2 gap-6">

                                            {/* ฝั่งซ้าย */}
                                            <div className="flex flex-col gap-4">
                                                
                                                {/* ประเภทสินค้า */}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                        <ClipboardCheck className="w-6 h-6 text-blue-600" /> Category
                                                    </h3>
                                                    <p className="text-lg text-gray-700 mt-1">{factoryData?.GeneralInfo.category || "-"}</p>
                                                </div>

                                                {/* ปริมาณสินค้า */}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                        <Droplets className="w-6 h-6 text-purple-600" /> Quantity
                                                    </h3>
                                                    <p className="text-lg text-gray-700 mt-1">
                                                        {factoryData?.GeneralInfo.quantity} {factoryData?.GeneralInfo.quantityUnit}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* ฝั่งขวา */}
                                            <div className="flex flex-col gap-4">
                                                
                                                {/* รายละเอียดสินค้า */}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                        <UtensilsCrossed className="w-6 h-6 text-green-600" /> Description
                                                    </h3>
                                                    <p className="text-lg text-gray-700 mt-1">
                                                        {factoryData?.GeneralInfo.description || "No description available."}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                            </>
                        )}
                        {activeSection === 2 && factoryData?.Quality && (
                            <>
                                     
                            {/* การ์ด Inspection Info */}
                            <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                                
                                {/* หัวข้อ: Inspection Details */}
                                <div className="pb-4 flex justify-between items-center">
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <ClipboardCheck className="w-8 h-8 text-green-600" /> Inspection Details
                                    </h2>
                                </div>

                                {/* เส้นแบ่ง */}
                                <hr className="border-t border-gray-300 my-4" />

                                {/* รายละเอียดการตรวจสอบ */}
                                <div className="grid grid-cols-2 gap-6">
                                    
                                    {/* ฝั่งซ้าย */}
                                    <div className="flex flex-col gap-4">
                                        
                                        {/* ระดับคุณภาพ (Grade) */}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                🏆 Grade
                                            </h3>
                                            <p className="text-lg text-gray-700 mt-1">{factoryData?.Quality.grade || "-"}</p>
                                        </div>
                                    </div>

                                    {/* ฝั่งขวา */}
                                    <div className="flex flex-col gap-4">
                                        
                                        {/* ผู้ตรวจสอบ (Inspector) */}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                👤 Inspector
                                            </h3>
                                            <p className="text-lg text-gray-700 mt-1">{factoryData?.Quality.inspector || "-"}</p>
                                        </div>

                                        {/* วันที่ตรวจสอบ (Inspection Date) */}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                📅 Inspection Date
                                            </h3>
                                            <p className="text-lg text-gray-700 mt-1">
                                                {factoryData?.Quality.inspectionDate ? new Date(factoryData?.Quality.inspectionDate).toLocaleString() : "-"}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            </>
                        )}
                        {activeSection === 3 && factoryData?.nutrition && (
                            <>
                                     
                           {/* การ์ด Nutrition Info */}
                            <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-h-[60vh] overflow-y-auto">
                                
                                {/* หัวข้อ: Nutrition Information */}
                                <div className="pb-4 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <UtensilsCrossed className="w-8 h-8 text-orange-600" /> Nutrition Information
                                    </h2>
                                </div>

                                {/* เส้นแบ่ง */}
                                <hr className="border-t border-gray-300 my-4" />

                                {/* ตารางโภชนาการ */}
                                <div className="grid grid-cols-2 gap-4">
                                    
                                    {/* ฝั่งซ้าย */}
                                    <div className="flex flex-col gap-4 max-w-lg">
                                        <div><h3 className="text-lg font-semibold">🔥 Calories</h3> <p className="text-gray-700">{factoryData?.nutrition.calories || "-"} kcal</p></div>
                                        <div><h3 className="text-lg font-semibold">💪 Protein</h3> <p className="text-gray-700">{factoryData?.nutrition.protein || "-"} g</p></div>
                                        <div><h3 className="text-lg font-semibold">🥑 Total Fat</h3> <p className="text-gray-700">{factoryData?.nutrition.totalFat || "-"} g</p></div>
                                        <div><h3 className="text-lg font-semibold">🩸 Cholesterol</h3> <p className="text-gray-700">{factoryData?.nutrition.cholesterol || "-"} mg</p></div>
                                        <div><h3 className="text-lg font-semibold">🍬 Sugar</h3> <p className="text-gray-700">{factoryData?.nutrition.sugar || "-"} g</p></div>
                                        <div><h3 className="text-lg font-semibold">🧪 pH Level</h3> <p className="text-gray-700">{factoryData?.nutrition.pH || "-"}</p></div>
                                    </div>

                                    {/* ฝั่งขวา */}
                                    <div className="flex flex-col gap-4 max-w-lg">
                                        <div><h3 className="text-lg font-semibold">🍞 Carbohydrates</h3> <p className="text-gray-700">{factoryData?.nutrition.totalCarbohydrates || "-"} g</p></div>
                                        <div><h3 className="text-lg font-semibold">🦴 Calcium</h3> <p className="text-gray-700">{factoryData?.nutrition.calcium || "-"} mg</p></div>
                                        <div><h3 className="text-lg font-semibold">🍌 Potassium</h3> <p className="text-gray-700">{factoryData?.nutrition.potassium || "-"} mg</p></div>
                                        <div><h3 className="text-lg font-semibold">⚡ Magnesium</h3> <p className="text-gray-700">{factoryData?.nutrition.magnesium || "-"} mg</p></div>
                                        <div><h3 className="text-lg font-semibold">☀️ Vitamin D</h3> <p className="text-gray-700">{factoryData?.nutrition.vitaminD || "-"} IU</p></div>
                                        <div><h3 className="text-lg font-semibold">🧂 Sodium</h3> <p className="text-gray-700">{factoryData?.nutrition.sodium || "-"} mg</p></div>
                                    </div>

                                </div>

                                {/* วิตามินอื่นๆ */}
                                <div className="mt-6 max-w-lg">
                                    <h3 className="text-lg font-bold text-gray-900">Other Vitamins & Minerals</h3>
                                    <hr className="border-t border-gray-300 my-3" />
                                    <div className="grid grid-cols-3 gap-4 text-gray-700">
                                        <div>🟠 Vitamin B6: {factoryData?.nutrition.vitaminB6 || "-"} mg</div>
                                        <div>🟢 Vitamin B12: {factoryData?.nutrition.vitaminB12 || "-"} mcg</div>
                                        <div>🔵 Vitamin C: {factoryData?.nutrition.vitaminC || "-"} mg</div>
                                        <div>🟡 Iron: {factoryData?.nutrition.iron || "-"} mg</div>
                                        <div>⚪ Fiber: {factoryData?.nutrition.fiber || "-"} g</div>
                                        <div>🟣 Temperature: {factoryData?.nutrition.temp || "-"}° {data.tempUnit || ""}</div>
                                    </div>
                                </div>

                            </div>
                            </>
                        )}
                        {activeSection === 4 && factoryData?.selectMilkTank && (
                            <>
                                     
                           {/* การ์ด Raw Milk Quality */}
                            <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-h-[60vh] overflow-y-auto">
                                
                                {/* หัวข้อ: Raw Milk Quality */}
                                <div className="pb-4 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <Droplets className="w-8 h-8 text-blue-600" /> Raw Milk Quality
                                    </h2>
                                </div>

                                {/* เส้นแบ่ง */}
                                <hr className="border-t border-gray-300 my-4" />

                                {/* ค่าทางกายภาพ */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div><h3 className="text-lg font-semibold">🌡️ Temperature</h3> <p className="text-gray-700">{factoryData?.selectMilkTank .temp || "-"}° {data.tempUnit || ""}</p></div>
                                    <div><h3 className="text-lg font-semibold">🧪 pH Level</h3> <p className="text-gray-700">{factoryData?.selectMilkTank .pH || "-"}</p></div>
                                    <div><h3 className="text-lg font-semibold">💪 Protein</h3> <p className="text-gray-700">{factoryData?.selectMilkTank .protein || "-"} g</p></div>
                                    <div><h3 className="text-lg font-semibold">🥛 Fat Content</h3> <p className="text-gray-700">{factoryData?.selectMilkTank .fat || "-"} g</p></div>
                                </div>

                                {/* เส้นแบ่ง */}
                                <hr className="border-t border-gray-300 my-4" />

                                {/* ปัญหาที่พบ */}
                                <h3 className="text-lg font-bold text-gray-900 mt-4">⚠️ Quality Issues</h3>
                                <div className="grid grid-cols-2 gap-4 text-gray-700 mt-2">
                                    <div>🦠 Bacteria: {factoryData?.selectMilkTank .bacteria ? "❌ พบปัญหา" : "✅ ปกติ"}</div>
                                    <div>☣️ Contaminants: {factoryData?.selectMilkTank .contaminants ? "❌ พบปัญหา" : "✅ ปกติ"}</div>
                                    <div>📝 Bacteria Info: {factoryData?.selectMilkTank .bacteriaInfo || "-"}</div>
                                    <div>⚠️ Contaminant Info: {factoryData?.selectMilkTank .contaminantInfo || "-"}</div>
                                </div>

                                {/* เส้นแบ่ง */}
                                <hr className="border-t border-gray-300 my-4" />

                                {/* ลักษณะผิดปกติ */}
                                <h3 className="text-lg font-bold text-gray-900 mt-4">🚨 Abnormal Characteristics</h3>
                                <table className="w-full border-collapse text-lg mt-2">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-900 border-b border-gray-400 text-left">
                                            <th className="p-3">ลักษณะผิดปกติ</th>
                                            <th className="p-3 text-center">สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(factoryData?.selectMilkTank.abnormalType || {}).map(([key, value]) => {
                                            const formattedKey = key
                                                .replace(/([A-Z])/g, ' $1')
                                                .replace("Smell Bad", "🔴 กลิ่นเหม็น")
                                                .replace("Smell Not Fresh", "🟡 กลิ่นไม่สด")
                                                .replace("Abnormal Color", "🟠 สีผิดปกติ")
                                                .replace("Sour", "🟣 รสเปรี้ยว")
                                                .replace("Bitter", "🟤 รสขม")
                                                .replace("Cloudy", "🔵 ขุ่น")
                                                .replace("Lumpy", "⚪ จับตัวเป็นก้อน")
                                                .replace("Separation", "⚫ แยกชั้น")
                                                .trim();

                                            return (
                                                <tr key={key} className="border-b border-gray-400">
                                                    <td className="p-4 font-semibold text-gray-900">{formattedKey}</td>
                                                    <td 
                                                        className={`p-4 text-center font-bold ${
                                                            value ? "text-red-700" : "text-green-700"
                                                        }`}
                                                    >
                                                        {value ? "❌ พบปัญหา" : "✅ ปกติ"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            </>
                        )}
                    </div>

            </div>
        </div>
    );
}
