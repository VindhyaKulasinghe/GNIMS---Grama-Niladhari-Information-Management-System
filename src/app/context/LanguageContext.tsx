import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "si" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    appName: "GNIMS - Grama Niladhari Information Management System",
    welcome: "Welcome",
    
    // Navigation
    dashboard: "Dashboard",
    householdManagement: "Household Management",
    familyMembers: "Family Member Registry",
    students: "Students",
    employmentIncome: "Employment & Income",
    propertyLand: "Property & Land",
    additionalLand: "Additional Land Ownership",
    boarders: "Boarders",
    animals: "Animals",
    vehicles: "Vehicles",
    reports: "Reports & Certificates",
    userManagement: "User Management",
    settings: "Settings",
    
    // Login
    login: "Login",
    logout: "Logout",
    username: "Username",
    password: "Password",
    enterUsername: "Enter username",
    enterPassword: "Enter password",
    pleaseEnterCredentials: "Please enter username and password",
    invalidCredentials: "Invalid username or password",
    gnOfficerLogin: "GN Officer Login",
    southernProvinceHambantota: "Southern Province - Hambantota District",
    defaultCredentials: "Default Credentials:",
    usernameExample: "gn_officer",
    passwordExample: "hambantota2024",
    
    // Dashboard Cards
    totalHouseholds: "Total Households",
    totalResidents: "Total Residents",
    studentsCount: "Students Count",
    employedResidents: "Employed Residents",
    retiredPersons: "Retired Persons",
    registeredVehicles: "Registered Vehicles",
    
    // Charts
    incomeDistribution: "Income Distribution",
    educationLevels: "Education Levels",
    employmentSectors: "Employment Sectors",
    
    // Common
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    actions: "Actions",
    view: "View",
    export: "Export",
    print: "Print",
    
    // Household
    houseNumber: "House Number",
    address: "Address",
    telephone: "Telephone",
    mobile: "Mobile",
    headOfHousehold: "Head of Household (Gruha Moolikaya)",
    utilities: "Utilities",
    electricity: "Electricity",
    water: "Water Supply",
    toilet: "Toilet Facility",
    housingMaterials: "Housing Materials",
    roofType: "Roof Type",
    wallType: "Wall Type",
    floorType: "Floor Type",
    domesticAnimals: "Domestic Animals",
    animalManagement: "Animal Management",
    cow: "Cow",
    chicken: "Chicken",
    goat: "Goat",
    
    // Family Members
    uniqueNumber: "Unique Number (Anu Ankaya)",
    fullName: "Full Name",
    nicNumber: "National ID Number",
    birthYear: "Birth Year",
    age: "Age",
    nationality: "Nationality",
    religion: "Religion",
    gender: "Gender",
    maritalStatus: "Marital Status",
    educationStatus: "Education Status",
    employmentDetails: "Employment Details",
    jobType: "Job Type",
    trainingReceived: "Training Received",
    sector: "Sector",
    monthlyIncome: "Monthly Income Range",
    
    // Students
    grade: "Grade",
    institutionName: "Institution Name",
    
    // Property
    ownerOfProperty: "Owner of Property",
    oppuNumber: "Oppu Number",
    natureOfOwnership: "Nature of Ownership",
    landSize: "Land Size",
    agriculturalUse: "Agricultural Use",
    vegetableCultivation: "Vegetable Cultivation Details",
    
    // Vehicles
    vehicleType: "Vehicle Type",
    vehicleNumber: "Vehicle Number",
    
    // Reports
    residenceCertificate: "Residence Certificate",
    characterCertificate: "Character Certificate",
    householdReport: "Household Report",
    populationStatistics: "Population Statistics",
    incomeStatistics: "Income Statistics",
  },
  si: {
    // Header
    appName: "GNIMS - ග්‍රාම නිලධාරී තොරතුරු කළමනාකරණ පද්ධතිය",
    welcome: "සාදරයෙන් පිළිගනිමු",
    
    // Navigation
    dashboard: "උපකරණ පුවරුව",
    householdManagement: "ගෘහ කළමනාකරණය",
    familyMembers: "පවුලේ සාමාජික ලේඛනය",
    students: "සිසුන්",
    employmentIncome: "රැකියාව සහ ආදායම",
    propertyLand: "දේපළ සහ ඉඩම",
    additionalLand: "අතිරේක ඉඩම් හිමිකම",
    boarders: "බෝඩිම් කරුවන්",
    animals: "සතුන්",
    vehicles: "වාහන",
    reports: "වාර්තා සහ සහතික",
    userManagement: "පරිශීලක කළමනාකරණය",
    settings: "සැකසුම්",
    
    // Login
    login: "ඇතුල් වන්න",
    logout: "ඉවත් වන්න",
    username: "පරිශීලක නාමය",
    password: "මුරපදය",
    enterUsername: "පරිශීලක නාමය ඇතුළත් කරන්න",
    enterPassword: "මුරපදය ඇතුළත් කරන්න",
    pleaseEnterCredentials: "කරුණාකර පරිශීලක නාමය සහ මුරපදය ඇතුළත් කරන්න",
    invalidCredentials: "වැරදි පරිශීලක ��ාමයක් හෝ මුරපදයක්",
    gnOfficerLogin: "ග්‍රාම නිලධාරී පිවිසුම",
    southernProvinceHambantota: "දකුණු පළාත - හම්බන්තොට දිස්ත්‍රික්කය",
    defaultCredentials: "පෙරනිමි අක්තපත්‍ර:",
    usernameExample: "gn_officer",
    passwordExample: "hambantota2024",
    
    // Dashboard Cards
    totalHouseholds: "මුළු ගෘහ",
    totalResidents: "මුළු නිවැසියන්",
    studentsCount: "සිසුන් සංඛ්‍යාව",
    employedResidents: "රැකියා නියුක්තයින්",
    retiredPersons: "විශ්‍රාමික පුද්ගලයින්",
    registeredVehicles: "ලියාපදිංචි වාහන",
    
    // Charts
    incomeDistribution: "ආදායම් බෙදාහැරීම",
    educationLevels: "අධ්‍යාපන මට්ටම්",
    employmentSectors: "රැකියා අංශ",
    
    // Common
    add: "එකතු කරන්න",
    edit: "සංස්කරණය",
    delete: "මකන්න",
    save: "සුරකින්න",
    cancel: "අවලංගු කරන්න",
    search: "සොයන්න",
    actions: "ක්‍රියාමාර්ග",
    view: "බලන්න",
    export: "අපනයනය",
    print: "මුද්‍රණය",
    
    // Household
    houseNumber: "නිවස අංකය",
    address: "ලිපිනය",
    telephone: "දුරකථන",
    mobile: "ජංගම",
    headOfHousehold: "ගෘහ මූලිකයා",
    utilities: "උපයෝගිතා",
    electricity: "විදුලිය",
    water: "ජල සැපයුම",
    toilet: "වැසිකිළි පහසුකම",
    housingMaterials: "නිවාස ද්‍රව්‍ය",
    roofType: "වහල වර්ගය",
    wallType: "බිත්ති වර්ගය",
    floorType: "බිම වර්ගය",
    domesticAnimals: "ගෘහ සතුන්",
    animalManagement: "සත්ව කළමනාකරණය",
    cow: "ගවයා",
    chicken: "කුකුළා",
    goat: "එළුවා",
    
    // Family Members
    uniqueNumber: "අනු අංකය",
    fullName: "සම්පූර්ණ නම",
    nicNumber: "ජාතික හැඳුනුම්පත් අංකය",
    birthYear: "උපන් වර්ෂය",
    age: "වයස",
    nationality: "ජාතිකත්වය",
    religion: "ආගම",
    gender: "ලිංගය",
    maritalStatus: "විවාහක තත්ත්වය",
    educationStatus: "අධ්‍යාපන තත්ත්වය",
    employmentDetails: "රැකියා විස්තර",
    jobType: "රැකියා වර්ගය",
    trainingReceived: "ලැබූ පුහුණුව",
    sector: "අංශය",
    monthlyIncome: "මාසික ආදායම් පරාසය",
    
    // Students
    grade: "ශ්‍රේණිය",
    institutionName: "ආයතනයේ නම",
    
    // Property
    ownerOfProperty: "දේපළ හිමිකරු",
    oppuNumber: "ඔප්පු අංකය",
    natureOfOwnership: "හිමිකාරිත්වයේ ස්වභාවය",
    landSize: "ඉඩමේ ප්‍රමාණය",
    agriculturalUse: "කෘෂිකාර්මික භාවිතය",
    vegetableCultivation: "එළවළු වගාව විස්තර",
    
    // Vehicles
    vehicleType: "වාහන වර්ගය",
    vehicleNumber: "වාහන අංකය",
    
    // Reports
    residenceCertificate: "නිවාස සහතිකය",
    characterCertificate: "චරිත සහතිකය",
    householdReport: "ගෘහ වාර්තාව",
    populationStatistics: "ජන සංඛ්‍යා සංඛ්‍යාලේඛන",
    incomeStatistics: "ආදායම් සංඛ්‍යාලේඛන",
  },
  ta: {
    // Header
    appName: "GNIMS - கிராம நிலதாரி தகவல் மேலாண்மை அமைப்பு",
    welcome: "வரவேற்கிறோம்",
    
    // Navigation
    dashboard: "முகப்பு பலகை",
    householdManagement: "வீட்டு நிர்வாகம்",
    familyMembers: "குடும்ப உறுப்பினர் பதிவு",
    students: "மாணவர்கள்",
    employmentIncome: "வேலைவாய்ப்பு மற்றும் வருமானம்",
    propertyLand: "சொத்து மற்றும் நிலம்",
    additionalLand: "கூடுதல் நில உரிமை",
    boarders: "தங்குபவர்கள்",
    animals: "விலங்குகள்",
    vehicles: "வாகனங்கள்",
    reports: "அறிக்கைகள் மற்றும் சான்றிதழ்கள்",
    userManagement: "பயனர் நிர்வாகம்",
    settings: "அமைப்புகள்",
    
    // Login
    login: "உள்நுழைய",
    logout: "வெளியேறு",
    username: "பயனர்பெயர்",
    password: "கடவுச்சொல்",
    enterUsername: "பயனர்பெயரை உள்ளிடவும்",
    enterPassword: "கடவுச்சொல்லை உள்ளிடவும்",
    pleaseEnterCredentials: "பயனர்பெயர் மற்றும் கடவுச்சொல்லை உள்ளிடவும்",
    invalidCredentials: "தவறான பயனர்பெயர் அல்லது கடவுச்சொல்",
    gnOfficerLogin: "கிராம நிலதாரி உள்நுழைவு",
    southernProvinceHambantota: "தென் மாகாணம் - ஹம்பந்தோட்ட மாவட்டம்",
    defaultCredentials: "இயல்புநிலை சான்றுகள்:",
    usernameExample: "gn_officer",
    passwordExample: "hambantota2024",
    
    // Dashboard Cards
    totalHouseholds: "மொத்த வீடுகள்",
    totalResidents: "மொத்த குடியிருப்பாளர்கள்",
    studentsCount: "மாணவர் எண்ணிக்கை",
    employedResidents: "வேலை வாய்ப்பு பெற்றவர்கள்",
    retiredPersons: "ஓய்வு பெற்றவர்கள்",
    registeredVehicles: "பதிவு செய்யப்பட்ட வாகனங்கள்",
    
    // Charts
    incomeDistribution: "வருமான விநியோகம்",
    educationLevels: "கல்வி நிலைகள்",
    employmentSectors: "வேலைவாய்ப்பு துறைகள்",
    
    // Common
    add: "சேர்",
    edit: "திருத்து",
    delete: "நீக்கு",
    save: "சேமி",
    cancel: "ரத்துசெய்",
    search: "தேடு",
    actions: "செயல்கள்",
    view: "பார்",
    export: "ஏற்றுமதி",
    print: "அச்சிடு",
    
    // Household
    houseNumber: "வீட்டு எண்",
    address: "முகவரி",
    telephone: "தொலைபேசி",
    mobile: "கைபேசி",
    headOfHousehold: "குடும்பத் தலைவர்",
    utilities: "பயன்பாடுகள்",
    electricity: "மின்சாரம்",
    water: "நீர் வழங்கல்",
    toilet: "கழிப்பறை வசதி",
    housingMaterials: "வீட்டு பொருட்கள்",
    roofType: "கூரை வகை",
    wallType: "சுவர் வகை",
    floorType: "தரை வகை",
    domesticAnimals: "வீட்டு விலங்குகள்",
    animalManagement: "விலங்கு மேலாண்மை",
    cow: "பசு",
    chicken: "கோழி",
    goat: "ஆடு",
    
    // Family Members
    uniqueNumber: "தனி எ���்",
    fullName: "முழு பெயர்",
    nicNumber: "தேசிய அடையாள எண்",
    birthYear: "பிறந்த வருடம்",
    age: "வயது",
    nationality: "தேசியம்",
    religion: "மதம்",
    gender: "பாலினம்",
    maritalStatus: "திருமண நிலை",
    educationStatus: "கல்வி நிலை",
    employmentDetails: "வேலைவாய்ப்பு விவரங்கள்",
    jobType: "வேலை வகை",
    trainingReceived: "பெற்ற பயிற்சி",
    sector: "துறை",
    monthlyIncome: "மாதாந்திர வருமான வரம்பு",
    
    // Students
    grade: "வகுப்பு",
    institutionName: "நிறுவனத்தின் பெயர்",
    
    // Property
    ownerOfProperty: "சொத்து உரிமையாளர்",
    oppuNumber: "ஒப்பு எண்",
    natureOfOwnership: "உரிமையின் தன்மை",
    landSize: "நில அளவு",
    agriculturalUse: "விவசாய பயன்பாடு",
    vegetableCultivation: "காய்கறி சாகுபடி விவரங்கள்",
    
    // Vehicles
    vehicleType: "வாகன வகை",
    vehicleNumber: "வாகன எண்",
    
    // Reports
    residenceCertificate: "குடியிருப்பு சான்றிதழ்",
    characterCertificate: "நல்லொழுக்க சான்றிதழ்",
    householdReport: "வீட்டு அறிக்கை",
    populationStatistics: "மக்கள்தொகை புள்ளிவிவரங்கள்",
    incomeStatistics: "வருமான புள்ளிவிவரங்கள்",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};