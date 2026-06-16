export interface BeneficiaryInfo {
  name: string;
  challenges: string;
  helps: string;
  benefits: string;
  impact: string;
}

export interface BeforeAfterInfo {
  aspect: string;
  traditional: string;
  twin: string;
}

export interface PriorityInfo {
  stars: number;
  group: string;
  reason: string;
}

export interface BeneficiaryData {
  title: string;
  beforeAfterTitle: string;
  priorityTitle: string;
  tabTitle1: string;
  tabTitle2: string;
  tabTitle3: string;
  colBeneficiary: string;
  colChallenges: string;
  colHelps: string;
  colBenefits: string;
  colImpact: string;
  colAspect: string;
  colTraditional: string;
  colTwin: string;
  colPriority: string;
  colGroup: string;
  colReason: string;
  beneficiaries: BeneficiaryInfo[];
  beforeAfter: BeforeAfterInfo[];
  priorities: PriorityInfo[];
}

export const BENEFICIARIES_DATA: Record<"en" | "hi" | "te" | "ta" | "kn", BeneficiaryData> = {
  en: {
    title: "Detailed Beneficiary Comparison",
    beforeAfterTitle: "Before vs After Digital Twin",
    priorityTitle: "Beneficiary Prioritization Matrix",
    tabTitle1: "Impact Matrix",
    tabTitle2: "Before vs After",
    tabTitle3: "Prioritization",
    colBeneficiary: "Beneficiary",
    colChallenges: "Current Challenges",
    colHelps: "How the Digital Twin Helps",
    colBenefits: "Benefits",
    colImpact: "Expected Impact",
    colAspect: "Aspect",
    colTraditional: "Traditional Approach",
    colTwin: "AI-Powered Climate Digital Twin",
    colPriority: "Priority",
    colGroup: "Beneficiary Group",
    colReason: "Reason",
    beneficiaries: [
      {
        name: "Farmers",
        challenges: "Uncertain rainfall, droughts, floods, crop failures, pest attacks",
        helps: "Provides district-level weather forecasts, crop advisories, irrigation schedules, drought prediction, pest-risk alerts",
        benefits: "Better crop planning, reduced losses, higher yields",
        impact: "Increased income and climate-resilient agriculture"
      },
      {
        name: "State Governments",
        challenges: "Reactive disaster response, inefficient resource allocation",
        helps: "Real-time climate monitoring and future scenario simulations",
        benefits: "Better policy decisions and resource management",
        impact: "Reduced disaster-related losses"
      },
      {
        name: "Central Government",
        challenges: "Difficulty in national climate planning",
        helps: "National-scale climate intelligence and risk assessment",
        benefits: "Better climate adaptation strategies",
        impact: "Supports national climate goals"
      },
      {
        name: "Disaster Management Authorities",
        challenges: "Late warnings for floods, cyclones, heatwaves",
        helps: "Predicts disasters days or weeks in advance",
        benefits: "Faster evacuation and emergency response",
        impact: "Saves lives and infrastructure"
      },
      {
        name: "Meteorological Agencies (e.g., IMD)",
        challenges: "Forecast uncertainty and model limitations",
        helps: "AI-enhanced forecasting using multiple data sources",
        benefits: "More accurate weather predictions",
        impact: "Higher public trust and forecast reliability"
      },
      {
        name: "Water Resource Departments",
        challenges: "Water scarcity, poor reservoir management",
        helps: "Predicts rainfall, river flow, groundwater recharge",
        benefits: "Optimized water distribution",
        impact: "Improved water security"
      },
      {
        name: "Agriculture Departments",
        challenges: "Generic advisories for large regions",
        helps: "Hyper-local crop recommendations",
        benefits: "Better extension services",
        impact: "Improved agricultural productivity"
      },
      {
        name: "Urban Planning Authorities",
        challenges: "Flooding, urban heat islands, poor climate resilience",
        helps: "Simulates future city growth and climate impacts",
        benefits: "Climate-resilient urban planning",
        impact: "Safer and smarter cities"
      },
      {
        name: "Scientists & Researchers",
        challenges: "Limited ability to test climate scenarios",
        helps: "Virtual climate laboratory for experimentation",
        benefits: "Faster research and innovation",
        impact: "Advanced climate science"
      },
      {
        name: "Environmental Agencies",
        challenges: "Difficulty monitoring ecosystem changes",
        helps: "Tracks deforestation, biodiversity, land-use changes",
        benefits: "Better conservation planning",
        impact: "Sustainable environmental management"
      },
      {
        name: "Energy Sector",
        challenges: "Renewable energy variability",
        helps: "Predicts solar radiation, wind speed, extreme weather impacts",
        benefits: "Better energy forecasting",
        impact: "Improved grid stability"
      },
      {
        name: "Insurance Companies",
        challenges: "Inaccurate climate risk assessment",
        helps: "Location-specific climate risk analysis",
        benefits: "Better insurance pricing",
        impact: "Reduced financial uncertainty"
      },
      {
        name: "Banks & Financial Institutions",
        challenges: "Agricultural loan defaults due to climate shocks",
        helps: "Climate-based risk evaluation",
        benefits: "Better lending decisions",
        impact: "Reduced financial losses"
      },
      {
        name: "Transportation Sector",
        challenges: "Disruptions due to extreme weather",
        helps: "Early weather and hazard forecasts",
        benefits: "Route optimization and infrastructure protection",
        impact: "Improved operational efficiency"
      },
      {
        name: "Public Health Departments",
        challenges: "Heatwaves and climate-related disease outbreaks",
        helps: "Forecasts heat stress and environmental conditions",
        benefits: "Better preparedness",
        impact: "Reduced health risks"
      },
      {
        name: "Coastal Communities",
        challenges: "Cyclones, sea-level rise, storm surges",
        helps: "Coastal risk forecasting and evacuation planning",
        benefits: "Improved safety",
        impact: "Reduced casualties"
      },
      {
        name: "Fishermen",
        challenges: "Unexpected storms and rough seas",
        helps: "Ocean and weather forecasts in near real time",
        benefits: "Safer fishing operations",
        impact: "Reduced accidents and economic losses"
      },
      {
        name: "Industries & Manufacturing",
        challenges: "Supply chain disruptions and climate risks",
        helps: "Climate impact forecasting for facilities",
        benefits: "Better business continuity planning",
        impact: "Reduced operational losses"
      },
      {
        name: "Educational Institutions",
        challenges: "Lack of real-world climate simulation tools",
        helps: "Access to advanced climate datasets and models",
        benefits: "Better research and education",
        impact: "Skilled future workforce"
      },
      {
        name: "Citizens",
        challenges: "Limited access to actionable climate information",
        helps: "Personalized climate and weather alerts",
        benefits: "Improved preparedness",
        impact: "Better public safety"
      }
    ],
    beforeAfter: [
      { aspect: "Weather Forecasting", traditional: "Based on limited models", twin: "Multi-model + AI-enhanced forecasts" },
      { aspect: "Data Sources", traditional: "Mostly weather stations", twin: "Satellites + Sensors + IMD + Hydrology + Ocean Data" },
      { aspect: "Decision Making", traditional: "Reactive", twin: "Predictive and proactive" },
      { aspect: "Disaster Response", traditional: "After disaster occurs", twin: "Before disaster occurs" },
      { aspect: "Agricultural Planning", traditional: "Historical experience", twin: "Data-driven recommendations" },
      { aspect: "Water Management", traditional: "Static planning", twin: "Dynamic real-time optimization" },
      { aspect: "Climate Research", traditional: "Separate models", twin: "Integrated virtual climate system" },
      { aspect: "Risk Assessment", traditional: "Generalized", twin: "Hyper-local and personalized" },
      { aspect: "Scenario Analysis", traditional: "Difficult and time-consuming", twin: "Instant simulation and testing" },
      { aspect: "Adaptation Planning", traditional: "Limited insights", twin: "Comprehensive future projections" }
    ],
    priorities: [
      { stars: 5, group: "Farmers", reason: "Agriculture employs a large share of India's population and is highly climate-sensitive." },
      { stars: 5, group: "Disaster Management Agencies", reason: "Direct impact on saving lives and reducing damage." },
      { stars: 5, group: "Governments", reason: "Policy and resource allocation decisions affect millions of people." },
      { stars: 5, group: "Water Resource Departments", reason: "Water is critical for agriculture, industry, and domestic use." },
      { stars: 4, group: "Meteorological Agencies", reason: "Improves forecast accuracy nationwide." },
      { stars: 4, group: "Coastal Communities & Fishermen", reason: "Highly vulnerable to cyclones and sea-level changes." },
      { stars: 4, group: "Urban Planners", reason: "Increasing climate risks in rapidly growing cities." },
      { stars: 3, group: "Energy Sector", reason: "Supports renewable energy expansion." },
      { stars: 3, group: "Insurance & Finance", reason: "Better risk assessment and financial resilience." },
      { stars: 3, group: "Scientists & Researchers", reason: "Accelerates climate science and innovation." },
      { stars: 2, group: "Industries", reason: "Improves business continuity and resilience." },
      { stars: 2, group: "General Public", reason: "Receives indirect benefits through improved warnings and services." }
    ]
  },
  hi: {
    title: "विस्तृत लाभार्थी तुलना",
    beforeAfterTitle: "डिजिटल ट्विन से पहले बनाम बाद में",
    priorityTitle: "लाभार्थी प्राथमिकता मैट्रिक्स",
    tabTitle1: "प्रभाव मैट्रिक्स",
    tabTitle2: "पहले बनाम बाद में",
    tabTitle3: "प्राथमिकता",
    colBeneficiary: "लाभार्थी",
    colChallenges: "वर्तमान चुनौतियां",
    colHelps: "डिजिटल ट्विन कैसे मदद करता है",
    colBenefits: "लाभ",
    colImpact: "अपेक्षित प्रभाव",
    colAspect: "पहलू",
    colTraditional: "पारंपरिक दृष्टिकोण",
    colTwin: "एआई-संचालित जलवायु डिजिटल ट्विन",
    colPriority: "प्राथमिकता",
    colGroup: "लाभार्थी समूह",
    colReason: "कारण",
    beneficiaries: [
      {
        name: "किसान",
        challenges: "अनिश्चित बारिश, सूखा, बाढ़, फसल की विफलता, कीटों के हमले",
        helps: "जिला स्तर पर मौसम पूर्वानुमान, फसल परामर्श, सिंचाई कार्यक्रम, सूखा पूर्वानुमान, कीट-जोखिम अलर्ट प्रदान करता है",
        benefits: "बेहतर फसल योजना, नुकसान में कमी, अधिक उपज",
        impact: "बढ़ी हुई आय और जलवायु-लचीली कृषि"
      },
      {
        name: "राज्य सरकारें",
        challenges: "प्रतिक्रियात्मक आपदा प्रबंधन, अक्षम संसाधन आवंटन",
        helps: "वास्तविक समय में जलवायु निगरानी और भविष्य के परिदृश्यों का सिमुलेशन",
        benefits: "बेहतर नीतिगत निर्णय और संसाधन प्रबंधन",
        impact: "आपदा से होने वाले नुकसान में कमी"
      },
      {
        name: "केंद्र सरकार",
        challenges: "राष्ट्रीय जलवायु योजना बनाने में कठिनाई",
        helps: "राष्ट्रीय स्तर पर जलवायु बुद्धिमत्ता और जोखिम मूल्यांकन",
        benefits: "बेहतर जलवायु अनुकूलन रणनीतियाँ",
        impact: "राष्ट्रीय जलवायु लक्ष्यों का समर्थन"
      },
      {
        name: "आपदा प्रबंधन प्राधिकरण",
        challenges: "बाढ़, चक्रवात, लू (हीटवेव) की देर से चेतावनी",
        helps: "दिनों या हफ्तों पहले आपदाओं की भविष्यवाणी करता है",
        benefits: "तेजी से सुरक्षित निकासी और आपातकालीन प्रतिक्रिया",
        impact: "जीवन और बुनियादी ढांचे की रक्षा"
      },
      {
        name: "मौसम विज्ञान एजेंसियां (जैसे, IMD)",
        challenges: "पूर्वानुमान अनिश्चितता और मॉडल की सीमाएं",
        helps: "विभिन्न डेटा स्रोतों का उपयोग करके एआई-संवर्धित पूर्वानुमान",
        benefits: "अधिक सटीक मौसम की भविष्यवाणी",
        impact: "जनता का उच्च विश्वास और पूर्वानुमान की विश्वसनीयता"
      },
      {
        name: "जल संसाधन विभाग",
        challenges: "पानी की कमी, खराब जलाशय प्रबंधन",
        helps: "वर्षा, नदी प्रवाह और भूजल पुनर्भरण की भविष्यवाणी करता है",
        benefits: "इष्टतम जल वितरण",
        impact: "बेहतर जल सुरक्षा"
      },
      {
        name: "कृषि विभाग",
        challenges: "बड़े क्षेत्रों के लिए सामान्य परामर्श",
        helps: "अति-स्थानीय (हाइपर-लोकल) फसल सिफारिशें",
        benefits: "बेहतर कृषि विस्तार सेवाएं",
        impact: "कृषि उत्पादकता में सुधार"
      },
      {
        name: "शहरी नियोजन प्राधिकरण",
        challenges: "बाढ़, शहरी हीट आइलैंड, कमजोर जलवायु लचीलापन",
        helps: "भविष्य के शहर विकास और जलवायु प्रभावों का सिमुलेशन",
        benefits: "जलवायु-अनुकूल शहरी नियोजन",
        impact: "सुरक्षित और स्मार्ट शहर"
      },
      {
        name: "वैज्ञानिक और शोधकर्ता",
        challenges: "जलवायु परिदृश्यों का परीक्षण करने की सीमित क्षमता",
        helps: "प्रयोगों के लिए आभासी जलवायु प्रयोगशाला",
        benefits: "तेजी से अनुसंधान और नवाचार",
        impact: "उन्नत जलवायु विज्ञान"
      },
      {
        name: "पर्यावरण एजेंसियां",
        challenges: "पारिस्थितिकी तंत्र के बदलावों की निगरानी में कठिनाई",
        helps: "वनों की कटाई, जैव विविधता, भूमि उपयोग परिवर्तन को ट्रैक करता है",
        benefits: "बेहतर संरक्षण योजना",
        impact: "सतत पर्यावरण प्रबंधन"
      },
      {
        name: "ऊर्जा क्षेत्र",
        challenges: "नवीकरणीय ऊर्जा की परिवर्तनशीलता",
        helps: "सौर विकिरण, हवा की गति, चरम मौसम प्रभावों का पूर्वानुमान",
        benefits: "बेहतर ऊर्जा पूर्वानुमान",
        impact: "बेहतर ग्रिड स्थिरता"
      },
      {
        name: "बीमा कंपनियां",
        challenges: "गलत जलवायु जोखिम मूल्यांकन",
        helps: "स्थान-विशिष्ट जलवायु जोखिम विश्लेषण",
        benefits: "बेहतर बीमा मूल्य निर्धारण",
        impact: "वित्तीय अनिश्चितता में कमी"
      },
      {
        name: "बैंक और वित्तीय संस्थान",
        challenges: "जलवायु झटकों के कारण कृषि ऋण चूक (डिफ़ॉल्ट)",
        helps: "जलवायु आधारित जोखिम मूल्यांकन",
        benefits: "बेहतर ऋण निर्णय",
        impact: "वित्तीय नुकसान में कमी"
      },
      {
        name: "परिवहन क्षेत्र",
        challenges: "चरम मौसम के कारण व्यवधान",
        helps: "शीघ्र मौसम और खतरे के पूर्वानुमान",
        benefits: "मार्ग अनुकूलन और बुनियादी ढांचे की सुरक्षा",
        impact: "परिचालन दक्षता में सुधार"
      },
      {
        name: "सार्वजनिक स्वास्थ्य विभाग",
        challenges: "लू और जलवायु जनित बीमारियों का प्रकोप",
        helps: "गर्मी के तनाव और पर्यावरणीय स्थितियों का पूर्वानुमान",
        benefits: "बेहतर तैयारी",
        impact: "स्वास्थ्य जोखिमों में कमी"
      },
      {
        name: "तटीय समुदाय",
        challenges: "चक्रवात, समुद्र के स्तर में वृद्धि, तूफान",
        helps: "तटीय जोखिम पूर्वानुमान और सुरक्षित निकासी योजना",
        benefits: "बेहतर सुरक्षा",
        impact: "हताहतों की संख्या में कमी"
      },
      {
        name: "मछुआरे",
        challenges: "अचानक आए तूफान और अशांत समुद्र",
        helps: "वास्तविक समय के करीब महासागर और मौसम का पूर्वानुमान",
        benefits: "सुरक्षित मछली पकड़ने का कार्य",
        impact: "दुर्घटनाओं और आर्थिक नुकसान में कमी"
      },
      {
        name: "उद्योग और विनिर्माण",
        challenges: "आपूर्ति श्रृंखला में व्यवधान और जलवायु जोखिम",
        helps: "सुविधाओं के लिए जलवायु प्रभाव का पूर्वानुमान",
        benefits: "बेहतर व्यावसायिक निरंतरता योजना",
        impact: "परिचालन घाटे में कमी"
      },
      {
        name: "शैक्षणिक संस्थान",
        challenges: "वास्तविक दुनिया के जलवायु सिमुलेशन उपकरणों की कमी",
        helps: "उन्नत जलवायु डेटासेट और मॉडल तक पहुंच",
        benefits: "बेहतर अनुसंधान और शिक्षा",
        impact: "कुशल भविष्य का कार्यबल"
      },
      {
        name: "नागरिक",
        challenges: "कार्रवाई योग्य जलवायु जानकारी तक सीमित पहुंच",
        helps: "व्यक्तिगत जलवायु और मौसम अलर्ट",
        benefits: "बेहतर तैयारी",
        impact: "बेहतर सार्वजनिक सुरक्षा"
      }
    ],
    beforeAfter: [
      { aspect: "मौसम का पूर्वानुमान", traditional: "सीमित मॉडल पर आधारित", twin: "बहु-मॉडल + एआई-संवर्धित पूर्वानुमान" },
      { aspect: "डेटा के स्रोत", traditional: "ज्यादातर मौसम स्टेशन", twin: "उपग्रह + सेंसर + आईएमडी + जल विज्ञान + महासागर डेटा" },
      { aspect: "निर्णय लेना", traditional: "प्रतिक्रियात्मक (रिएक्टिव)", twin: "पूर्वानुमानित और सक्रिय (प्रोएक्टिव)" },
      { aspect: "आपदा प्रतिक्रिया", traditional: "आपदा आने के बाद", twin: "आपदा आने से पहले" },
      { aspect: "कृषि योजना", traditional: "ऐतिहासिक अनुभव", twin: "डेटा-संचालित सिफारिशें" },
      { aspect: "जल प्रबंधन", traditional: "स्थिर योजना", twin: "गतिशील वास्तविक समय अनुकूलन" },
      { aspect: "जलवायु अनुसंधान", traditional: "अलग-अलग मॉडल", twin: "एकीकृत आभासी जलवायु प्रणाली" },
      { aspect: "जोखिम मूल्यांकन", traditional: "सामान्यीकृत", twin: "अति-स्थानीय (हाइपर-लोकल) और व्यक्तिगत" },
      { aspect: "परिदृश्य विश्लेषण", traditional: "कठिन और समय लेने वाला", twin: "त्वरित सिमुलेशन और परीक्षण" },
      { aspect: "अनुकूलन योजना", traditional: "सीमित अंतर्दृष्टि", twin: "व्यापक भविष्य के अनुमान" }
    ],
    priorities: [
      { stars: 5, group: "किसान", reason: "कृषि भारत की एक बड़ी आबादी को रोजगार देती है और जलवायु के प्रति अत्यधिक संवेदनशील है।" },
      { stars: 5, group: "आपदा प्रबंधन एजेंसियां", reason: "जान बचाने और नुकसान को कम करने पर सीधा प्रभाव।" },
      { stars: 5, group: "सरकारें", reason: "नीति और संसाधन आवंटन के फैसले लाखों लोगों को प्रभावित करते हैं।" },
      { stars: 5, group: "जल संसाधन विभाग", reason: "पानी कृषि, उद्योग और घरेलू उपयोग के लिए महत्वपूर्ण है।" },
      { stars: 4, group: "मौसम विज्ञान एजेंसियां", reason: "देश भर में पूर्वानुमान की सटीकता में सुधार करता है।" },
      { stars: 4, group: "तटीय समुदाय और मछुआरे", reason: "चक्रवात और समुद्र के स्तर के बदलावों के प्रति अत्यधिक संवेदनशील।" },
      { stars: 4, group: "शहरी योजनाकार", reason: "तेजी से बढ़ते शहरों में जलवायु जोखिम बढ़ रहे हैं।" },
      { stars: 3, group: "ऊर्जा क्षेत्र", reason: "नवीकरणीय ऊर्जा विस्तार का समर्थन करता है।" },
      { stars: 3, group: "बीमा और वित्त", reason: "बेहतर जोखिम मूल्यांकन और वित्तीय लचीलापन।" },
      { stars: 3, group: "वैज्ञानिक और शोधकर्ता", reason: "जलवायु विज्ञान और नवाचार को गति देता है।" },
      { stars: 2, group: "उद्योग", reason: "व्यावसायिक निरंतरता और लचीलापन में सुधार करता है।" },
      { stars: 2, group: "सामान्य जनता", reason: "बेहतर चेतावनियों और सेवाओं के माध्यम से अप्रत्यक्ष लाभ प्राप्त करता है।" }
    ]
  },
  te: {
    title: "వివరణాత్మక లబ్ధిదారుల పోలిక",
    beforeAfterTitle: "డిజిటల్ ట్విన్ ముందు వర్సెస్ తర్వాత",
    priorityTitle: "లబ్ధిదారుల ప్రాధాన్యత మ్యాట్రిక్స్",
    tabTitle1: "ప్రభావ మ్యాట్రిక్స్",
    tabTitle2: "ముందు వర్సెస్ తర్వాత",
    tabTitle3: "ప్రాధాన్యత",
    colBeneficiary: "లబ్ధిదారుడు",
    colChallenges: "ప్రస్తుత సవాళ్లు",
    colHelps: "డిజిటల్ ట్విన్ ఎలా సహాయపడుతుంది",
    colBenefits: "ప్రయోజనాలు",
    colImpact: "ఆశించిన ప్రభావం",
    colAspect: "అంశం",
    colTraditional: "సాంప్రదాయ పద్ధతి",
    colTwin: "AI-ఆధారిత వాతావరణ డిజిటల్ ట్విన్",
    colPriority: "ప్రాధాన్యత",
    colGroup: "లబ్ధిదారుల సమూహం",
    colReason: "కారణం",
    beneficiaries: [
      {
        name: "రైతులు",
        challenges: "అస్థిరమైన వర్షపాతం, కరువులు, వరదలు, పంట నష్టాలు, తెగుళ్ల దాడులు",
        helps: "జిల్లా స్థాయి వాతావరణ అంచనాలు, పంట సలహాలు, నీటిపారుదల షెడ్యూళ్లు, కరువు అంచనాలు, తెగుళ్ల ముప్పు హెచ్చరికలు అందిస్తుంది",
        benefits: "మెరుగైన పంట ప్రణాళిక, నష్టాల తగ్గింపు, అధిక దిగుబడి",
        impact: "పెరిగిన ఆదాయం మరియు వాతావరణాన్ని తట్టుకునే వ్యవసాయం"
      },
      {
        name: "రాష్ట్ర ప్రభుత్వాలు",
        challenges: "విపత్తుల తర్వాత స్పందించడం, అసమర్థ వనరుల కేటాయింపు",
        helps: "నిజ-సమయ వాతావరణ పర్యవేక్షణ మరియు భవిష్యత్తు దృశ్యాల అనుకరణలు (సిమ్యులేషన్స్)",
        benefits: "మెరుగైన విధాన నిర్ణయాలు మరియు వనరుల నిర్వహణ",
        impact: "విపత్తుల వల్ల జరిగే నష్టాల తగ్గింపు"
      },
      {
        name: "కేంద్ర ప్రభుత్వం",
        challenges: "జాతీయ స్థాయి వాతావరణ ప్రణాళికలో ఇబ్బందులు",
        helps: "జాతీయ స్థాయి వాతావరణ సమాచారం మరియు ముప్పు అంచనా",
        benefits: "మెరుగైన వాతావరణ అనుకూలత వ్యూహాలు",
        impact: "జాతీయ వాతావరణ లక్ష్యాలకు మద్దతు"
      },
      {
        name: "విపత్తు నిర్వహణ సంస్థలు",
        challenges: "వరదలు, తుఫానులు, వడగాల్పుల ఆలస్య హెచ్చరికలు",
        helps: "రోజులు లేదా వారాల ముందే విపత్తులను అంచనా వేస్తుంది",
        benefits: "వేగవంతమైన తరలింపు మరియు అత్యవసర స్పందన",
        impact: "ప్రాణాలు మరియు మౌలిక సదుపాయాల రక్షణ"
      },
      {
        name: "వాతావరణ సంస్థలు (ఉదా. IMD)",
        challenges: "అంచనాలలో అనిశ్చితి మరియు నమూనాల పరిమితులు",
        helps: "బహుళ డేటా మూలాలను ఉపయోగించి AI-ఆధారిత అంచనాలు",
        benefits: "మరింత ఖచ్చితమైన వాతావరణ అంచనాలు",
        impact: "ప్రజలలో అధిక విశ్వసనీయత మరియు అంచనాల నమ్మకం"
      },
      {
        name: "జల వనరుల శాఖలు",
        challenges: "నీటి కొరత, జలాశయాల పేలవమైన నిర్వహణ",
        helps: "వర్షపాతం, నదీ ప్రవాహం, భూగర్భ జలాల రీఛార్జ్‌ను అంచనా వేస్తుంది",
        benefits: "సరైన నీటి పంపిణీ",
        impact: "మెరుగైన నీటి భద్రత"
      },
      {
        name: "వ్యవసాయ శాఖలు",
        challenges: "పెద్ద ప్రాంతాలకు సాధారణ సలహాలు ఇవ్వడం",
        helps: "అతి-స్థానిక (హైపర్-లోకల్) పంట సిఫార్సులు",
        benefits: "మెరుగైన వ్యవసాయ సలహా సేవలు",
        impact: "మెరుగైన వ్యవసాయ ఉత్పాదకత"
      },
      {
        name: "పట్టణ ప్రణాళికా సంస్థలు",
        challenges: "వరదలు, అర్బన్ హీట్ ఐలాండ్స్, పేలవమైన వాతావరణ నిరోధకత",
        helps: "భవిష్యత్తు నగర వృద్ధి మరియు వాతావరణ ప్రభావాల అనుకరణ",
        benefits: "వాతావరణాన్ని తట్టుకునే పట్టణ ప్రణాళిక",
        impact: "సురక్షితమైన మరియు స్మార్ట్ నగరాలు"
      },
      {
        name: "శాస్త్రవేత్తలు & పరిశోధకులు",
        challenges: "వాతావరణ పరిస్థితులను పరీక్షించే పరిమిత సామర్థ్యం",
        helps: "ప్రయోగాల కోసం వర్చువల్ వాతావరణ ప్రయోగశాల",
        benefits: "వేగవంతమైన పరిశోధన మరియు ఆవిష్కరణలు",
        impact: "అధునాతన వాతావరణ శాస్త్రం"
      },
      {
        name: "పర్యావరణ సంస్థలు",
        challenges: "పర్యావరణ వ్యవస్థ మార్పులను పర్యవేక్షించడంలో కష్టం",
        helps: "అడవుల నరికివేత, జీవవైవిధ్యం, భూ వినియోగ మార్పులను ట్రాక్ చేస్తుంది",
        benefits: "మెరుగైన పరిరక్షణ ప్రణాళిక",
        impact: "స్థిరమైన పర్యావరణ నిర్వహణ"
      },
      {
        name: "విద్యుత్ రంగం",
        challenges: "పునరుత్పాదక ఇంధన లభ్యతలో హెచ్చుతగ్గులు",
        helps: "సౌర వికిరణం, గాలి వేగం, తీవ్రమైన వాతావరణ ప్రభావాల అంచనా",
        benefits: "మెరుగైన ఇంధన అంచనాలు",
        impact: "మెరుగైన గ్రిడ్ స్థిరత్వం"
      },
      {
        name: "భీమా కంపెనీలు",
        challenges: "అఖచ్చితమైన వాతావరణ ముప్పు అంచనా",
        helps: "ప్రాంతాల వారీగా వాతావరణ ముప్పు విశ్లేషణ",
        benefits: "మెరుగైన ప్రీమియం ధరల నిర్ణయం",
        impact: "ఆర్థిక అనిశ్చితి తగ్గింపు"
      },
      {
        name: "బ్యాంకులు & ఆర్థిక సంస్థలు",
        challenges: "వాతావరణ విపత్తుల వల్ల వ్యవసాయ రుణాలు చెల్లించలేకపోవడం",
        helps: "వాతావరణ ఆధారిత ముప్పు అంచనా",
        benefits: "మెరుగైన రుణ నిర్ణయాలు",
        impact: "ఆర్థిక నష్టాల తగ్గింపు"
      },
      {
        name: "రవాణా రంగం",
        challenges: "తీవ్ర వాతావరణం వల్ల అంతరాయాలు",
        helps: "ముందస్తు వాతావరణ మరియు ప్రమాద అంచనాలు",
        benefits: "మార్గాల ఆప్టిమైజేషన్ మరియు మౌలిక సదుపాయాల రక్షణ",
        impact: "మెరుగైన కార్యాచరణ సామర్థ్యం"
      },
      {
        name: "ప్రజా ఆరోగ్య శాఖలు",
        challenges: "వడగాల్పులు మరియు వాతావరణ సంబంధిత వ్యాధుల వ్యాప్తి",
        helps: "ఉష్ణ ఒత్తిడి మరియు పర్యావరణ పరిస్థితులను అంచనా వేస్తుంది",
        benefits: "మెరుగైన సంసిద్ధత",
        impact: "ఆరోగ్య ముప్పుల తగ్గింపు"
      },
      {
        name: "తీరప్రాంత ప్రజలు",
        challenges: "తుఫానులు, సముద్ర మట్టాల పెరుగుదల, అలల ఉప్పెనలు",
        helps: "తీరప్రాంత ముప్పు అంచనా మరియు తరలింపు ప్రణాళిక",
        benefits: "మెరుగైన భద్రత",
        impact: "ప్రాణనష్టం తగ్గింపు"
      },
      {
        name: "మత్స్యకారులు",
        challenges: "అకస్మాత్తుగా వచ్చే తుఫానులు మరియు అల్లకల్లోల సముద్రం",
        helps: "సముద్ర మరియు వాతావరణ అంచనాలను నిజ సమయానికి దగ్గరగా అందిస్తుంది",
        benefits: "సురక్షితమైన చేపల వేట కార్యకలాపాలు",
        impact: "ప్రమాదాలు మరియు ఆర్థిక నష్టాల తగ్గింపు"
      },
      {
        name: "పరిశ్రమలు & తయారీ రంగం",
        challenges: "సరఫరా గొలుసు అంతరాయాలు మరియు వాతావరణ ముప్పులు",
        helps: "సౌకర్యాల కోసం వాతావరణ ప్రభావాల అంచనా",
        benefits: "మెరుగైన వ్యాపార కొనసాగింపు ప్రణాళిక",
        impact: "కార్యాచరణ నష్టాల తగ్గింపు"
      },
      {
        name: "విద్యా సంస్థలు",
        challenges: "నిజ-ప్రపంచ వాతావరణ అనుకరణ సాధనాల లేమి",
        helps: "అధునాతన వాతావరణ డేటాసెట్‌లు మరియు మోడళ్లకు ప్రాప్యత",
        benefits: "మెరుగైన పరిశోధన మరియు విద్య",
        impact: "నైపుణ్యం కలిగిన భవిష్యత్ శ్రామికశక్తి"
      },
      {
        name: "పౌరులు",
        challenges: "ఆచరణాత్మక వాతావरण సమాచారం అందుబాటులో లేకపోవడం",
        helps: "వ్యక్తిగతీకరించిన వాతావరణ మరియు ముందస్తు హెచ్చరికలు",
        benefits: "మెరుగైన సంసిద్ధత",
        impact: "మెరుగైన ప్రజా భద్రత"
      }
    ],
    beforeAfter: [
      { aspect: "వాతావరణ అంచనా", traditional: "పరిమిత నమూనాల ఆధారంగా", twin: "బహుళ నమూనాలు + AI-ఆధారిత అంచనాలు" },
      { aspect: "డేటా మూలాలు", traditional: "ఎక్కువగా వాతావరణ కేంద్రాల నుండి", twin: "ఉపగ్రహాలు + సెన్సార్లు + IMD + జల విజ్ఞానం + సముద్ర డేటా" },
      { aspect: "నిర్ణయాధికారం", traditional: "విపత్తు తర్వాత స్పందించడం", twin: "ముందస్తు అంచనా మరియు చొరవ" },
      { aspect: "విపత్తు స్పందన", traditional: "విపత్తు సంభవించిన తర్వాత", twin: "విపత్తు సంభవించడానికి ముందే" },
      { aspect: "వ్యవసాయ ప్రణాళిక", traditional: "గత అనుభవాల ఆధారంగా", twin: "డేటా ఆధారిత సిఫార్సులు" },
      { aspect: "నీటి నిర్వహణ", traditional: "స్థిరమైన ప్రణాళిక", twin: "డైనమిక్ నిజ-సమయ ఆప్టిమైజేషన్" },
      { aspect: "వాతావరణ పరిశోధన", traditional: "వేర్వేరు నమూనాలు", twin: "సమీకృత వర్చువల్ వాతావరణ వ్యవస్థ" },
      { aspect: "ముప్పు అంచనా", traditional: "సాధారణీకరించిన సమాచారం", twin: "అతి-స్థానిక మరియు వ్యక్తిగతీకరించిన ముప్పులు" },
      { aspect: "పరిస్థితుల విశ్లేషణ", traditional: "కష్టమైన మరియు సమయం తీసుకునే ప్రక్రియ", twin: "తక్షణ అనుకరణ మరియు పరీక్ష" },
      { aspect: "అనుకూలత ప్రణాళిక", traditional: "పరిమిత అవగాహన", twin: "సమగ్ర భవిష్యత్తు అంచనాలు" }
    ],
    priorities: [
      { stars: 5, group: "రైతులు", reason: "వ్యవసాయం భారతదేశ జనాభాలో ఎక్కువ మందికి ఉపాధి కల్పిస్తుంది మరియు వాతావరణ మార్పులకు గురవుతుంది." },
      { stars: 5, group: "విపత్తు నిర్వహణ సంస్థలు", reason: "ప్రాణాలను రక్షించడం మరియు నష్టాన్ని తగ్గించడంపై ప్రత్యక్ష ప్రభావం." },
      { stars: 5, group: "ప్రభుత్వాలు", reason: "విధాన మరియు వనరుల కేటాయింపు నిర్ణయాలు మిలియన్ల మంది ప్రజలను ప్రభావితం చేస్తాయి." },
      { stars: 5, group: "జల వనరుల శాఖలు", reason: "వ్యవసాయం, పరిశ్రమలు మరియు గృహ అవసరాలకు నీరు చాలా కీలకం." },
      { stars: 4, group: "వాతావరణ సంస్థలు", reason: "దేశవ్యాప్తంగా అంచనాల ఖచ్చితత్వాన్ని మెరుగుపరుస్తుంది." },
      { stars: 4, group: "తీరప్రాంత ప్రజలు & మత్స్యకారులు", reason: "తుఫానులు మరియు సముద్ర మట్టాల మార్పుల బారిన పడే అవకాశం ఎక్కువ." },
      { stars: 4, group: "పట్టణ ప్రణాళికా నిపుణులు", reason: "వేగంగా అభివృద్ధి చెందుతున్న నగరాలలో పెరుగుతున్న వాతావరణ ముప్పులు." },
      { stars: 3, group: "విద్యుత్ రంగం", reason: "పునరుత్పాదక ఇంధన విస్తరణకు మద్దతు ఇస్తుంది." },
      { stars: 3, group: "భీమా & ఆర్థిక రంగాలు", reason: "మెరుగైన ముప్పు అంచనా మరియు ఆర్థిక నిరోధకత." },
      { stars: 3, group: "శాస్త్రవేత్తలు & పరిశోధకులు", reason: "వాతావరణ శాస్త్ర పరిశోధనలను వేగవంతం చేస్తుంది." },
      { stars: 2, group: "పరిశ్రమలు", reason: "వ్యాపార కొనసాగింపు మరియు స్థితిస్థాపకతను మెరుగుపరుస్తుంది." },
      { stars: 2, group: "సాధారణ ప్రజలు", reason: "మెరుగైన హెచ్చరికలు మరియు సేవల ద్వారా పరోక్ష ప్రయోజనాలను పొందుతారు." }
    ]
  },
  ta: {
    title: "விரிவான பயனாளிகள் ஒப்பீடு",
    beforeAfterTitle: "டிஜிட்டல் ட்வின்னுக்கு முன் மற்றும் பின்",
    priorityTitle: "பயனாளிகள் முன்னுரிமை மேட்ரிக்ஸ்",
    tabTitle1: "தாக்க மேட்ரிக்ஸ்",
    tabTitle2: "முன் மற்றும் பின்",
    tabTitle3: "முன்னுரிமை",
    colBeneficiary: "பயனாளி",
    colChallenges: "தற்போதைய சவால்கள்",
    colHelps: "டிஜிட்டல் ட்வின் எவ்வாறு உதவுகிறது",
    colBenefits: "நன்மைகள்",
    colImpact: "எதிர்பார்க்கப்படும் தாக்கம்",
    colAspect: "அம்சம்",
    colTraditional: "பாரம்பரிய அணுகுமுறை",
    colTwin: "AI-ஆற்றல் வாதாவரண டிஜிட்டல் ட்வின்",
    colPriority: "முன்னுரிமை",
    colGroup: "பயனாளி குழு",
    colReason: "காரணம்",
    beneficiaries: [
      {
        name: "விவசாயிகள்",
        challenges: "நிச்சயமற்ற மழைப்பொழிவு, வறட்சி, வெள்ளம், பயிர் இழப்பு, பூச்சித் தாக்குதல்கள்",
        helps: "மாவட்ட அளவிலான வானிலை முன்னறிவிப்புகள், பயிர் ஆலோசனைகள், பாசன அட்டவணைகள், வறட்சி கணிப்பு, பூச்சி அபாய எச்சரிக்கைகள் ஆகியவற்றை வழங்குகிறது",
        benefits: "சிறந்த பயிர் திட்டமிடல், குறைந்த இழப்புகள், அதிக மகசூல்",
        impact: "அதிகரித்த வருமானம் மற்றும் காலநிலை மாற்றங்களை தாங்கும் விவசாயம்"
      },
      {
        name: "மாநில அரசுகள்",
        challenges: "பேரிடர் நிகழ்ந்த பின் செயல்படுதல், திறமையற்ற வள ஒதுக்கீடு",
        helps: "உண்நேர காலநிலை கண்காணிப்பு மற்றும் எதிர்கால சூழ்நிலைகளின் உருவகப்படுத்துதல் (சிமுலேஷன்స్)",
        benefits: "சிறந்த கொள்கை முடிவுகள் மற்றும் வள மேலாண்மை",
        impact: "பேரிடர் தொடர்பான இழப்புகள் குறைதல்"
      },
      {
        name: "மத்திய அரசு",
        challenges: "தேசிய அளவிலான காலநிலை திட்டமிடலில் உள்ள சிரமங்கள்",
        helps: "தேசிய அளவிலான காலநிலை நுண்ணறிவு மற்றும் அபாய மதிப்பீடு",
        benefits: "சிறந்த காலநிலை தழுவல் உத்திகள்",
        impact: "தேசிய காலநிலை இலக்குகளுக்கு ஆதரவு"
      },
      {
        name: "பேரிடர் மேலாண்மை அமைப்புகள்",
        challenges: "வெள்ளம், புயல், வெப்ப அலைகளின் தாமதமான எச்சரிக்கைகள்",
        helps: "நாட்கள் அல்லது வாரங்களுக்கு முன்பே பேரிடர்களை கணிக்கிறது",
        benefits: "வேகமான இடமாற்றம் மற்றும் அவசரகால பதில் நடவடிக்கை",
        impact: "உயிர்கள் மற்றும் உள்கட்டமைப்புகளின் பாதுகாப்பு"
      },
      {
        name: "வானிலை முகமைகள் (எ.கா. IMD)",
        challenges: "முன்னறிவிப்பு நிச்சயமற்ற தன்மை மற்றும் மாதிரிகளின் வரம்புகள்",
        helps: "பல தரவு மூலங்களைப் பயன்படுத்தி AI-மேம்படுத்தப்பட்ட முன்னறிவிப்பு",
        benefits: "மிகவும் துல்லியமான வானிலை கணிப்புகள்",
        impact: "பொதுமக்களின் அதிக நம்பிக்கை மற்றும் கணிப்புகளின் நம்பகத்தன்மை"
      },
      {
        name: "நீர் வளத் துறைகள்",
        challenges: "தண்ணீர் பற்றாக்குறை, மோசமான நீர்த்தேக்க மேலாண்மை",
        helps: "மழைப்பொழிவு, நதி ஓட்டம், நிலத்தடி நீர் செறிவூட்டல் ஆகியவற்றை கணிக்கிறது",
        benefits: "உகந்த நீர் விநியோகம்",
        impact: "மேம்படுத்தப்பட்ட நீர் பாதுகாப்பு"
      },
      {
        name: "விவசாயத் துறைகள்",
        challenges: "பெரிய பகுதிகளுக்கான பொதுவான ஆலோசனைகள்",
        helps: "மிகவும் உள்ளூர்மயமாக்கப்பட்ட (ஹைப்பர்-லோக்கல்) பயிர் பரிந்துரைகள்",
        benefits: "சிறந்த விவசாய விரிவாக்க சேவைகள்",
        impact: "மேம்படுத்தப்பட்ட விவசாய உற்பத்தித்திறன்"
      },
      {
        name: "நகர திட்டமிடல் அதிகாரிகள்",
        challenges: "வெள்ளம், நகர்ப்புற வெப்ப தீவுகள், மோசமான காலநிலை மீள்தன்மை",
        helps: "எதிர்கால நகர வளர்ச்சி மற்றும் காலநிலை தாக்கங்களை உருவகப்படுத்துகிறது",
        benefits: "காலநிலை மாற்றங்களைத் தாங்கும் நகர திட்டமிடல்",
        impact: "பாதுகாப்பான மற்றும் ஸ்மார்ட் நகரங்கள்"
      },
      {
        name: "விஞ்ஞானிகள் & ஆராய்ச்சியாளர்கள்",
        challenges: "காலநிலை சூழ்நிலைகளை சோதிப்பதற்கான வரையறுக்கப்பட்ட திறன்",
        helps: "பரிசோதனைகளுக்கான மெய்நிகர் காலநிலை ஆய்வகம்",
        benefits: "வேகமான ஆராய்ச்சி மற்றும் கண்டுபிடிப்புகள்",
        impact: "மேம்பட்ட காலநிலை அறிவியல்"
      },
      {
        name: "சுற்றுச்சூழல் அமைப்புகள்",
        challenges: "சுற்றுச்சூழல் மாற்றங்களைக் கண்காணிப்பதில் உள்ள சிரமம்",
        helps: "காடழிப்பு, பல்லுயிர் பெருக்கம், நிலப் பயன்பாட்டு மாற்றங்களைக் கண்காணிக்கிறது",
        benefits: "சிறந்த பாதுகாப்பு திட்டமிடல்",
        impact: "நிலையான சுற்றுச்சூழல் மேலாண்மை"
      },
      {
        name: "மின்சக்தி துறை",
        challenges: "புதுப்பிக்கத்தக்க எரிசக்தி மாறுபாடு",
        helps: "சூரிய கதிர்வீச்சு, காற்றின் வேகம், தீவிர வானிலை தாக்கங்களை கணிக்கிறது",
        benefits: "சிறந்த மின்சக்தி முன்னறிவிப்பு",
        impact: "மேம்படுத்தப்பட்ட மின் கட்டமைப்பின் நிலைத்தன்மை"
      },
      {
        name: "காப்பீட்டு நிறுவனங்கள்",
        challenges: "துல்லியமற்ற காலநிலை அபாய மதிப்பீடு",
        helps: "குறிப்பிட்ட இடங்களுக்கான காலநிலை அபாய பகுப்பாய்வு",
        benefits: "சிறந்த காப்பீட்டு விலை நிர்ணயம்",
        impact: "நிதியியல் நிச்சயமற்ற தன்மை குறைதல்"
      },
      {
        name: "வங்கிகள் & நிதி நிறுவனங்கள்",
        challenges: "காலநிலை பாதிப்புகளால் விவசாயக் கடன் செலுத்த முடியாமை",
        helps: "காலநிலை சார்ந்த அபாய மதிப்பீடு",
        benefits: "சிறந்த கடன் வழங்கும் முடிவுகள்",
        impact: "நிதி இழப்புகள் குறைதல்"
      },
      {
        name: "போக்குவரத்து துறை",
        challenges: "தீவிர வானிலையால் ஏற்படும் இடையூறுகள்",
        helps: "முந்தய வானிலை மற்றும் ஆபத்து முன்னறிவிப்புகள்",
        benefits: "வழித்தடங்களை மேம்படுத்துதல் மற்றும் உள்கட்டமைப்பு பாதுகாப்பு",
        impact: "மேம்படுத்தப்பட்ட செயல்பாட்டுத் திறன்"
      },
      {
        name: "பொது சுகாதாரத் துறைகள்",
        challenges: "வெப்ப அலைகள் மற்றும் காலநிலை தொடர்பான நோய் பரவல்கள்",
        helps: "வெப்ப அழுத்தம் மற்றும் சுற்றுச்சூழல் நிலைமைகளை கணிக்கிறது",
        benefits: "மேம்பட்ட தயார்நிலை",
        impact: "சுகாதார அபாயங்கள் குறைதல்"
      },
      {
        name: "கடலோர சமூகங்கள்",
        challenges: "புயல்கள், கடல் மட்ட உயர்வு, அலை சீற்றம்",
        helps: "கடலோர அபாய முன்னறிவிப்பு மற்றும் வெளியேற்ற திட்டமிடல்",
        benefits: "மேம்படுத்தப்பட்ட பாதுகாப்பு",
        impact: "உயிர்ச்சேதங்கள் குறைதல்"
      },
      {
        name: "மீனவர்கள்",
        challenges: "எதிர்பாராத புயல்கள் மற்றும் சீற்றமான கடல்",
        helps: "உண்மை நேரத்திற்கு நெருக்கமான கடல் மற்றும் வானிலை கணிப்புகள்",
        benefits: "பாதுகாப்பான மீன்பிடி செயல்பாடுகள்",
        impact: "விபத்துக்கள் மற்றும் பொருளாதார இழப்புகள் குறைதல்"
      },
      {
        name: "தொழில்துறைகள் & உற்பத்தி",
        challenges: "விநியோக சங்கிலி இடையூறுகள் மற்றும் காலநிலை அபாயங்கள்",
        helps: "வசதிகளுக்கான காலநிலை தாக்க முன்னறிவிப்பு",
        benefits: "சிறந்த வணிக தொடர்ச்சி திட்டமிடல்",
        impact: "செயல்பாட்டு இழப்புகள் குறைதல்"
      },
      {
        name: "கல்வி நிறுவனங்கள்",
        challenges: "உண்மை உலக காலநிலை உருவகப்படுத்துதல் கருவிகள் இல்லாமை",
        helps: "மேம்பட்ட காலநிலை தரவுத்தொகுப்புகள் மற்றும் மாதிரிகளுக்கான அணுகல்",
        benefits: "சிறந்த ஆராய்ச்சி மற்றும் கல்வி",
        impact: "திறமையான எதிர்கால பணியாளர்கள்"
      },
      {
        name: "குடிமக்கள்",
        challenges: "செயல்படுத்தக்கூடிய காலநிலை தகவல்களுக்கான வரையறுக்கப்பட்ட அணுகல்",
        helps: "தனிப்பயனாக்கப்பட்ட காலநிலை மற்றும் வானிலை எச்சரிக்கைகள்",
        benefits: "மேம்பட்ட தயார்நிலை",
        impact: "மேம்படுத்தப்பட்ட பொதுப் பாதுகாப்பு"
      }
    ],
    beforeAfter: [
      { aspect: "வானிலை முன்னறிவிப்பு", traditional: "வரையறுக்கப்பட்ட மாதிரிகளின் அடிப்படையில்", twin: "பல மாதிரிகள் + AI-மேம்படுத்தப்பட்ட கணிப்புகள்" },
      { aspect: "தரவு மூலங்கள்", traditional: "பெரும்பாலும் வானிலை நிலையங்கள்", twin: "செயற்கைக்கோள்கள் + சென்சார்கள் + IMD + நீரியல் + கடல் தரவு" },
      { aspect: "முடிவெடுத்தல்", traditional: "பாதிப்புக்கு பின் செயல்படுதல்", twin: "முன்கணிப்பு மற்றும் முன்கூட்டியே செயல்படுதல்" },
      { aspect: "பேரிடர் எதிர்வினை", traditional: "பேரிடர் நிகழ்ந்த பிறகு", twin: "பேரிடர் நிகழ்வதற்கு முன்பே" },
      { aspect: "விவசாய திட்டமிடல்", traditional: "வரலாற்று அனுபவம்", twin: "தரவு சார்ந்த பரிந்துரைகள்" },
      { aspect: "நீர் மேலாண்மை", traditional: "நிலையான திட்டமிடல்", twin: "மாறும் நிகழ்நேர உகந்ததாக்கம்" },
      { aspect: "காலநிலை ஆராய்ச்சி", traditional: "தனித்தனி மாதிரிகள்", twin: "ஒருங்கிணைந்த மெய்நிகர் காலநிலை அமைப்பு" },
      { aspect: "அபாய மதிப்பீடு", traditional: "பொதுவானது", twin: "மிகவும் உள்ளூர்மயமாக்கப்பட்ட மற்றும் தனிப்பயனாக்கப்பட்டது" },
      { aspect: "சூழ்நிலை பகுப்பாய்வு", traditional: "கடினமான மற்றும் நேரத்தை எடுத்துக்கொள்வது", twin: "உடனடி உருவகப்படுத்துதல் மற்றும் சோதனை" },
      { aspect: "தழுவல் திட்டமிடல்", traditional: "வரையறுக்கப்பட்ட நுண்ணறிவு", twin: "விரிவான எதிர்கால கணிப்புகள்" }
    ],
    priorities: [
      { stars: 5, group: "விவசாயிகள்", reason: "விவசாயம் இந்தியாவின் மக்கள் தொகையில் பெரும்பகுதியினருக்கு வேலை வழங்குகிறது மற்றும் காலநிலை பாதிப்புகளுக்கு ஆளாகிறது." },
      { stars: 5, group: "பேரிடர் மேலாண்மை முகமைகள்", reason: "உயிர்களைக் காப்பதிலும் சேதங்களைக் குறைப்பதிலும் நேரடித் தாக்கம்." },
      { stars: 5, group: "அரசுகள்", reason: "கொள்கை மற்றும் வள ஒதுக்கீடு முடிவுகள் மில்லியன் கணக்கான மக்களை பாதிக்கின்றன." },
      { stars: 5, group: "நீர் வளத் துறைகள்", reason: "விவசாயம், தொழில் மற்றும் வீட்டுத் தேவைகளுக்கு நீர் மிகவும் முக்கியமானது." },
      { stars: 4, group: "வானிலை முகமைகள்", reason: "நாடு முழுவதும் முன்னறிவிப்பு துல்லியத்தை மேம்படுத்துகிறது." },
      { stars: 4, group: "கடலோர சமூகங்கள் & மீனவர்கள்", reason: "புயல்கள் மற்றும் கடல் மட்ட மாற்றங்களால் அதிகம் பாதிக்கப்படக்கூடியவர்கள்." },
      { stars: 4, group: "நகர திட்டமிடுபவர்கள்", reason: "வேகமாக வளர்ந்து வரும் நகரங்களில் அதிகரித்து வரும் காலநிலை அபாயங்கள்." },
      { stars: 3, group: "மின்சக்தி துறை", reason: "புதுப்பிக்கத்தக்க எரிசக்தி விரிவாக்கத்திற்கு ஆதரவளிக்கிறது." },
      { stars: 3, group: "காப்பீடு & நிதி", reason: "சிறந்த அபாய மதிப்பீடு மற்றும் நிதி மீள்தன்மை." },
      { stars: 3, group: "விஞ்ஞானிகள் & ஆராய்ச்சியாளர்கள்", reason: "காலநிலை அறிவியலையும் கண்டுபிடிப்புகளையும் விரைவுபடுத்துகிறது." },
      { stars: 2, group: "தொழில்துறைகள்", reason: "வணிக தொடர்ச்சி மற்றும் மீள்தன்மையை மேம்படுத்துகிறது." },
      { stars: 2, group: "பொதுமக்கள்", reason: "மேம்படுத்தப்பட்ட எச்சரிக்கைகள் மற்றும் சேவைகள் மூலம் மறைமுக நன்மைகளைப் பெறுகின்றனர்." }
    ]
  },
  kn: {
    title: "ವಿವರವಾದ ಫಲಾನುಭವಿಗಳ ಹೋಲಿಕೆ",
    beforeAfterTitle: "ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಮೊದಲು ಮತ್ತು ನಂತರ",
    priorityTitle: "ಫಲಾನುಭವಿಗಳ ಆದ್ಯತಾ ಮ್ಯಾಟ್ರಿಕ್ಸ್",
    tabTitle1: "ಪ್ರಭಾವದ ಮ್ಯಾಟ್ರಿಕ್ಸ್",
    tabTitle2: "ಮೊದಲು ಮತ್ತು ನಂತರ",
    tabTitle3: "ಆದ್ಯತೆ",
    colBeneficiary: "ಫಲಾನುಭವಿ",
    colChallenges: "ಪ್ರಸ್ತುತ ಸವಾಲುಗಳು",
    colHelps: "ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ",
    colBenefits: "ಪ್ರಯೋಜನಗಳು",
    colImpact: "ನಿರೀಕ್ಷಿತ ಪ್ರಭಾವ",
    colAspect: "ಅಂಶ",
    colTraditional: "ಸಾಂಪ್ರದಾಯಿಕ ವಿಧಾನ",
    colTwin: "AI-ಚಾಲಿತ ಹವಾಮಾನ ಡಿಜಿಟಲ್ ಟ್ವಿನ್",
    colPriority: "ಆದ್ಯತೆ",
    colGroup: "ಫಲಾನುಭವಿಗಳ ಗುಂಪು",
    colReason: "ಕಾರಣ",
    beneficiaries: [
      {
        name: "ರೈತರು",
        challenges: "ಅನಿಶ್ಚಿತ ಮಳೆ, ಬರಗಾಲ, ಪ್ರವಾಹ, ಬೆಳೆ ಹಾನಿ, ಕೀಟಗಳ ದಾಳಿ",
        helps: "ಜಿಲ್ಲಾ ಮಟ್ಟದ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಬೆಳೆ ಸಲಹೆಗಳು, ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಗಳು, ಬರಗಾಲದ ಮುನ್ಸೂಚನೆ, ಕೀಟಗಳ ಅಪಾಯದ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನೀಡುತ್ತದೆ",
        benefits: "ಉತ್ತಮ ಬೆಳೆ ಯೋಜನೆ, ನಷ್ಟದ ಕಡಿತ, ಹೆಚ್ಚಿನ ಇಳುವರಿ",
        impact: "ಹೆಚ್ಚಿದ ಆದಾಯ ಮತ್ತು ಹವಾಮಾನ ಬದಲಾವಣೆಯನ್ನು ತಡೆದುಕೊಳ್ಳುವ ಕೃಷಿ"
      },
      {
        name: "ರಾಜ್ಯ ಸರ್ಕಾರಗಳು",
        challenges: "ಪ್ರತಿಕ್ರಿಯಾತ್ಮಕ ವಿಪತ್ತು ನಿರ್ವಹಣೆ, ಅಸಮರ್ಥ ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ",
        helps: "ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಭವಿಷ್ಯದ ಪರಿಸ್ಥಿತಿಗಳ ಅನುಕರಣೆ (ಸಿಮ್ಯುಲೇಶನ್ಸ್)",
        benefits: "ಉತ್ತಮ ನೀತಿ ನಿರ್ಧಾರಗಳು ಮತ್ತು ಸಂಪನ್ಮೂಲ ನಿರ್ವಹಣೆ",
        impact: "ವಿಪತ್ತು ಸಂಬಂಧಿತ ನಷ್ಟಗಳ ಕಡಿತ"
      },
      {
        name: "ಕೇಂದ್ರ ಸರ್ಕಾರ",
        challenges: "ರಾಷ್ಟ್ರೀಯ ಮಟ್ಟದ ಹವಾಮಾನ ಯೋಜನೆ ತಯಾರಿಕೆಯಲ್ಲಿ ತೊಂದರೆ",
        helps: "ರಾಷ್ಟ್ರೀಯ ಮಟ್ಟದ ಹವಾಮಾನ ಮಾಹಿತಿ ಮತ್ತು ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ",
        benefits: "ಉತ್ತಮ ಹವಾಮಾನ ಹೊಂದಾಣಿಕೆ ಕಾರ್ಯತಂತ್ರಗಳು",
        impact: "ರಾಷ್ಟ್ರೀಯ ಹವಾಮಾನ ಗುರಿಗಳಿಗೆ ಬೆಂಬಲ"
      },
      {
        name: "ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಸಂಸ್ಥೆಗಳು",
        challenges: "ಪ್ರವಾಹ, ಚಂಡಮಾರುತ, ಬಿಸಿಗಾಳಿಯ ತಡವಾದ ಎಚ್ಚರಿಕೆಗಳು",
        helps: "ದಿನಗಳು ಅಥವಾ ವಾರಗಳ ಮುಂಚಿತವಾಗಿ ವಿಪತ್ತುಗಳನ್ನು ಮುನ್ಸೂಚಿಸುತ್ತದೆ",
        benefits: "ವೇಗದ ಸ್ಥಳಾಂತರ ಮತ್ತು ತುರ್ತು ಸ್ಪಂದನೆ",
        impact: "ಜೀವಗಳು ಮತ್ತು ಮೂಲಸೌಕರ್ಯಗಳ ರಕ್ಷಣೆ"
      },
      {
        name: "ಹವಾಮಾನ ಸಂಸ್ಥೆಗಳು (ಉದಾ. IMD)",
        challenges: "ಮುನ್ಸೂಚನೆ ಅನಿಶ್ಚಿತತೆ ಮತ್ತು ಮಾದರಿಗಳ ಮಿತಿಗಳು",
        helps: "ಹಲವು ಡೇಟಾ ಮೂಲಗಳನ್ನು ಬಳಸಿ AI-ವರ್ಧಿತ ಮುನ್ಸೂಚನೆ",
        benefits: "ಹೆಚ್ಚು ನಿಖರವಾದ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳು",
        impact: "ಸಾರ್ವಜನಿಕರಲ್ಲಿ ಹೆಚ್ಚಿನ ನಂಬಿಕೆ ಮತ್ತು ಮುನ್ಸೂಚನೆಯ ವಿಶ್ವಾಸಾರ್ಹತೆ"
      },
      {
        name: "ಜಲಸಂಪನ್ಮೂಲ ಇಲಾಖೆಗಳು",
        challenges: "ನೀರಿನ ಅಭಾವ, ಜಲಾಶಯಗಳ ಕಳಪೆ ನಿರ್ವಹಣೆ",
        helps: "ಮಳೆ, ನದಿ ಹರಿವು ಮತ್ತು ಅಂತರ್ಜಲ ಮರುಪೂರಣವನ್ನು ಮುನ್ಸೂಚಿಸುತ್ತದೆ",
        benefits: "ಸಮರ್ಪಕ ನೀರು ಹಂಚಿಕೆ",
        impact: "ಸುಧಾರಿತ ನೀರಿನ ಭದ್ರತೆ"
      },
      {
        name: "ಕೃಷಿ ಇಲಾಖೆಗಳು",
        challenges: "ದೊಡ್ಡ ಪ್ರದೇಶಗಳಿಗೆ ಸಾಮಾನ್ಯ ಸಲಹೆಗಳು",
        helps: "ಅತಿ-ಸ್ಥಳೀಯ (ಹೈಪರ್-ಲೋಕಲ್) ಬೆಳೆ ಶಿಫಾರಸುಗಳು",
        benefits: "ಉತ್ತಮ ಕೃಷಿ ವಿಸ್ತರಣಾ ಸೇವೆಗಳು",
        impact: "ಸುಧಾರಿತ ಕೃಷಿ ಉತ್ಪಾದಕತೆ"
      },
      {
        name: "ನಗರಾಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರಗಳು",
        challenges: "ಪ್ರವಾಹ, ನಗರ ಉಷ್ಣ ದ್ವೀಪಗಳು, ಕಳಪೆ ಹವಾಮಾನ ನಿರೋಧಕತೆ",
        helps: "ಭವಿಷ್ಯದ ನಗರದ ಬೆಳವಣಿಗೆ ಮತ್ತು ಹವಾಮಾನ ಪರಿಣಾಮಗಳನ್ನು ಅನುಕರಿಸುತ್ತದೆ",
        benefits: "ಹವಾಮಾನ-ನಿರೋಧಕ ನಗರ ಯೋಜನೆ",
        impact: "ಸುರಕ್ಷಿತ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ನಗರಗಳು"
      },
      {
        name: "ವಿಜ್ಞಾನಿಗಳು ಮತ್ತು ಸಂಶೋಧಕರು",
        challenges: "ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ಸೀಮಿತ ಸಾಮರ್ಥ್ಯ",
        helps: "ಪ್ರಯೋಗಗಳಿಗಾಗಿ ವರ್ಚುವಲ್ ಹವಾಮಾನ ಪ್ರಯೋಗಾಲಯ",
        benefits: "ವೇಗದ ಸಂಶೋಧನೆ ಮತ್ತು ಆವಿಷ್ಕಾರಗಳು",
        impact: "ಸುಧಾರಿತ ಹವಾಮಾನ ವಿಜ್ಞಾನ"
      },
      {
        name: "ಪರಿಸರ ಸಂಸ್ಥೆಗಳು",
        challenges: "ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಬದಲಾವಣೆಗಳ ಮೇಲ್ವಿಚಾರಣೆಯಲ್ಲಿ ತೊಂದರೆ",
        helps: "ಅರಣ್ಯ ನಾಶ, ಜೀವವೈವಿಧ್ಯ, ಭೂ ಬಳಕೆ ಬದಲಾವಣೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ",
        benefits: "ಉತ್ತಮ ಸಂರಕ್ಷಣಾ ಯೋಜನೆ",
        impact: "ಸುಸ್ಥಿರ ಪರಿಸರ ನಿರ್ವಹಣೆ"
      },
      {
        name: "ವಿದ್ಯುತ್ ವಲಯ",
        challenges: "ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಲಭ್ಯತೆಯಲ್ಲಿ ಏರಿಳಿತ",
        helps: "ಸೌರ ವಿಕಿರಣ, ಗಾಳಿಯ ವೇಗ, ತೀವ್ರ ಹವಾಮಾನ ಪರಿಣಾಮಗಳನ್ನು ಮುನ್ಸೂಚಿಸುತ್ತದೆ",
        benefits: "ಉತ್ತಮ ಇಂಧನ ಮುನ್ಸೂಚನೆ",
        impact: "ಸುಧಾರಿತ ವಿದ್ಯುತ್ ಜಾಲದ ಸ್ಥಿರತೆ"
      },
      {
        name: "ವಿಮಾ ಕಂಪನಿಗಳು",
        challenges: "ಅನಿಖರ ಹವಾಮಾನ ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ",
        helps: "ಸ್ಥಳ-ನಿರ್ದಿಷ್ಟ ಹವಾಮಾನ ಅಪಾಯದ ವಿಶ್ಲೇಷಣೆ",
        benefits: "ಉತ್ತಮ ವಿಮಾ ದರ ನಿಗದಿ",
        impact: "ಹಣಕಾಸಿನ ಅನಿಶ್ಚಿತತೆಯ ಕಡಿತ"
      },
      {
        name: "ಬ್ಯಾಂಕುಗಳು ಮತ್ತು ಹಣಕಾಸು ಸಂಸ್ಥೆಗಳು",
        challenges: "ಹವಾಮಾನ ಆಘಾತಗಳಿಂದಾಗಿ ಕೃಷಿ ಸಾಲ ಮರುಪಾವತಿ ಸುಸ್ತಿ (ಡೀಫಾಲ್ಟ್)",
        helps: "ಹವಾಮಾನ ಆಧಾರಿತ ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ",
        benefits: "ಉತ್ತಮ ಸಾಲ ನೀಡುವ ನಿರ್ಧಾರಗಳು",
        impact: "ಹಣಕಾಸಿನ ನಷ್ಟಗಳ ಕಡಿತ"
      },
      {
        name: "ಸಾರಿಗೆ ವಲಯ",
        challenges: "ತೀವ್ರ ಹವಾಮಾನದಿಂದ ಉಂಟಾಗುವ ಅಡಚಣೆಗಳು",
        helps: "ಮುಂಚಿತ ಹವಾಮಾನ ಮತ್ತು ಅಪಾಯದ ಮುನ್ಸೂಚನೆಗಳು",
        benefits: "ಮಾರ್ಗಗಳ ಅತ್ಯುತ್ತಮಗೊಳಿಸುವಿಕೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ ರಕ್ಷಣೆ",
        impact: "ಸುಧಾರಿತ ಕಾರ್ಯಾಚರಣೆಯ ದಕ್ಷತೆ"
      },
      {
        name: "ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ಇಲಾಖೆಗಳು",
        challenges: "ಬಿಸಿಗಾಳಿ ಮತ್ತು ಹವಾಮಾನ ಸಂಬಂಧಿತ ಕಾಯಿಲೆಗಳ ಹರಡುವಿಕೆ",
        helps: "ಉಷ್ಣದ ಒತ್ತಡ ಮತ್ತು ಪರಿಸರದ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಮುನ್ಸೂಚಿಸುತ್ತದೆ",
        benefits: "ಉತ್ತಮ ಸಿದ್ಧತೆ",
        impact: "ಆರೋಗ್ಯದ ಅಪಾಯಗಳ ಕಡಿತ"
      },
      {
        name: "ಕರಾವಳಿ ಸಮುದಾಯಗಳು",
        challenges: "ಚಂಡಮಾರುತ, ಸಮುದ್ರ ಮಟ್ಟ ಏರಿಕೆ, ಅಲೆಗಳ ಅಬ್ಬರ",
        helps: "ಕರಾವಳಿ ಅಪಾಯ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಸ್ಥಳಾಂತರ ಯೋಜನೆ",
        benefits: "ಸುಧಾರಿತ ಸುರಕ್ಷತೆ",
        impact: "ಜೀವಹಾನಿ ಕಡಿತ"
      },
      {
        name: "ಮೀನುಗಾರರು",
        challenges: "ಅನಿರೀಕ್ಷಿತ ಚಂಡಮಾರುತ ಮತ್ತು ಅಶಾಂತ ಸಮುದ್ರ",
        helps: "ಸಮುದ್ರ ಮತ್ತು ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಗಳನ್ನು ನೈಜ ಸಮಯಕ್ಕೆ ಹತ್ತಿರ ನೀಡುತ್ತದೆ",
        benefits: "ಸುರಕ್ಷಿತ ಮೀನುಗಾರಿಕೆ ಕಾರ್ಯಾಚರಣೆಗಳು",
        impact: "ಅಪಘಾತಗಳು ಮತ್ತು ಆರ್ಥಿಕ ನಷ್ಟಗಳ ಕಡಿತ"
      },
      {
        name: "ಕೈಗಾರಿಕೆಗಳು ಮತ್ತು ಉತ್ಪಾದನೆ",
        challenges: "ಪೂರೈಕೆ ಸರಪಳಿ ಅಡಚಣೆಗಳು ಮತ್ತು ಹವಾಮಾನ ಅಪಾಯಗಳು",
        helps: "ಕೈಗಾರಿಕಾ ಸೌಲಭ್ಯಗಳಿಗೆ ಹವಾಮಾನ ಪರಿಣಾಮದ ಮುನ್ಸೂಚನೆ",
        benefits: "ಉತ್ತಮ ವ್ಯವಹಾರ ನಿರಂತರತೆಯ ಯೋಜನೆ",
        impact: "ಕಾರ್ಯಾಚರಣೆಯ ನಷ್ಟಗಳ ಕಡಿತ"
      },
      {
        name: "ಶೈಕ್ಷಣಿಕ ಸಂಸ್ಥೆಗಳು",
        challenges: "ನೈಜ-ಪ್ರಪಂಚದ ಹವಾಮಾನ ಸಿಮ್ಯುಲೇಶನ್ ಪರಿಕರಗಳ ಕೊರತೆ",
        helps: "ಸುಧಾರಿತ ಹವಾಮಾನ ಡೇಟಾಸೆಟ್‌ಗಳು ಮತ್ತು ಮಾದರಿಗಳ ಪ್ರವೇಶ",
        benefits: "ಉತ್ತಮ ಸಂಶೋಧನೆ ಮತ್ತು ಶಿಕ್ಷಣ",
        impact: "ಕುಶಲ ಭವಿಷ್ಯದ ಕಾರ್ಯಪಡೆ"
      },
      {
        name: "ನಾಗರಿಕರು",
        challenges: "ಕಾರ್ಯಸಾಧ್ಯ ಹವಾಮಾನ ಮಾಹಿತಿಗೆ ಸೀಮಿತ ಪ್ರವೇಶ",
        helps: "ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಹವಾಮಾನ ಮತ್ತು ಎಚ್ಚರಿಕೆಯ ಸಂದೇಶಗಳು",
        benefits: "ಉತ್ತಮ ಸಿದ್ಧತೆ",
        impact: "ಸುಧಾರಿತ ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ"
      }
    ],
    beforeAfter: [
      { aspect: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ", traditional: "ಸೀಮಿತ ಮಾದರಿಗಳ ಆಧಾರದ ಮೇಲೆ", twin: "ಬಹು-ಮಾದರಿಗಳು + AI-ವರ್ಧಿತ ಮುನ್ಸೂಚನೆಗಳು" },
      { aspect: "ಡೇಟಾ ಮೂಲಗಳು", traditional: "ಹೆಚ್ಚಾಗಿ ಹವಾಮಾನ ಕೇಂದ್ರಗಳಿಂದ", twin: "ಉಪಗ್ರಹಗಳು + ಸಂವೇದಕಗಳು + IMD + ಜಲವಿಜ್ಞಾನ + ಸಮುದ್ರ ಡೇಟಾ" },
      { aspect: "ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವುದು", traditional: "ಪ್ರತಿಕ್ರಿಯಾತ್ಮಕ", twin: "ಮುನ್ಸೂಚಕ ಮತ್ತು ಪೂರ್ವಭಾವಿ" },
      { aspect: "ವಿಪತ್ತು ಪ್ರತಿಕ್ರಿಯೆ", traditional: "ವಿಪತ್ತು ಸಂಭವಿಸಿದ ನಂತರ", twin: "ವಿಪತ್ತು ಸಂಭವಿಸುವ ಮೊದಲು" },
      { aspect: "ಕೃಷಿ ಯೋಜನೆ", traditional: "ಐತಿಹಾಸಿಕ ಅನುಭವದ ಆಧಾರದ ಮೇಲೆ", twin: "ಡೇಟಾ-ಚಾಲಿತ ಶಿಫಾರಸುಗಳು" },
      { aspect: "ನೀರಿನ ನಿರ್ವಹಣೆ", traditional: "ಸ್ಥಿರ ಯೋಜನೆ", twin: "ಡೈನಾಮಿಕ್ ನೈಜ-ಸಮಯದ ಅತ್ಯುತ್ತಮಗೊಳಿಸುವಿಕೆ" },
      { aspect: "ಹವಾಮಾನ ಸಂಶೋಧನೆ", traditional: "ಪ್ರತ್ಯೇಕ ಮಾದರಿಗಳು", twin: "ಸಂಯೋಜಿತ ವರ್ಚುವಲ್ ಹವಾಮಾನ ವ್ಯವಸ್ಥೆ" },
      { aspect: "ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ", traditional: "ಸಾಮಾನ್ಯೀಕರಿಸಿದ ಮಾಹಿತಿ", twin: "ಅತಿ-ಸ್ಥಳೀಯ ಮತ್ತು ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಹವಾಮಾನ ಅಪಾಯಗಳು" },
      { aspect: "ಪರಿಸ್ಥಿತಿಯ ವಿಶ್ಲೇಷಣೆ", traditional: "ಕಷ್ಟಕರ ಮತ್ತು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ", twin: "ತತ್ಕ್ಷಣದ ಅನುಕರಣೆ ಮತ್ತು ಪರೀಕ್ಷೆ" },
      { aspect: "ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆ", traditional: "ಸೀಮಿತ ಒಳನೋಟಗಳು", twin: "ಸಮಗ್ರ ಭವಿಷ್ಯದ ಅಂದಾಜುಗಳು" }
    ],
    priorities: [
      { stars: 5, group: "ರೈತರು", reason: "ಕೃಷಿಯು ಭಾರತದ ಜನಸಂಖ್ಯೆಯ ದೊಡ್ಡ ಭಾಗಕ್ಕೆ ಉದ್ಯೋಗ ನೀಡುತ್ತದೆ ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ಹೆಚ್ಚು ಸೂಕ್ಷ್ಮವಾಗಿದೆ." },
      { stars: 5, group: "ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಸಂಸ್ಥೆಗಳು", reason: "ಜೀವಗಳನ್ನು ಉಳಿಸಲು ಮತ್ತು ಹಾನಿಯನ್ನು ಕಡಿಮೆ ಮಾಡಲು ನೇರ ಪರಿಣಾಮ." },
      { stars: 5, group: "ಸರ್ಕಾರಗಳು", reason: "ನೀತಿ ಮತ್ತು ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ ನಿರ್ಧಾರಗಳು ಲಕ್ಷಾಂತರ ಜನರ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುತ್ತವೆ." },
      { stars: 5, group: "ಜಲಸಂಪನ್ಮೂಲ ಇಲಾಖೆಗಳು", reason: "ಕೃಷಿ, ಕೈಗಾರಿಕೆ ಮತ್ತು ಗೃಹಬಳಕೆಗೆ ನೀರು ಬಹಳ ಮುಖ್ಯವಾಗಿದೆ." },
      { stars: 4, group: "ಹವಾಮಾನ ಸಂಸ್ಥೆಗಳು", reason: "ದೇಶಾದ್ಯಂತ ಮುನ್ಸೂಚನೆ ನಿಖರತೆಯನ್ನು ಸುಧಾರಿಸುತ್ತದೆ." },
      { stars: 4, group: "ಕರಾವಳಿ ಸಮುದಾಯಗಳು ಮತ್ತು ಮೀನುಗಾರರು", reason: "ಚಂಡಮಾರುತಗಳು ಮತ್ತು ಸಮುದ್ರ ಮಟ್ಟ ಏರಿಕೆಯ ಅಪಾಯಕ್ಕೆ ಹೆಚ್ಚು ಒಡ್ಡಿಕೊಳ್ಳುತ್ತಾರೆ." },
      { stars: 4, group: "ನಗರ ಯೋಜಕರು", reason: "ವೇಗವಾಗಿ ಬೆಳೆಯುತ್ತಿರುವ ನಗರಗಳಲ್ಲಿ ಹೆಚ್ಚುತ್ತಿರುವ ಹವಾಮಾನ ಅಪಾಯಗಳು." },
      { stars: 3, group: "ವಿದ್ಯುತ್ ವಲಯ", reason: "ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ವಿಸ್ತರಣೆಗೆ ಬೆಂಬಲ ನೀಡುತ್ತದೆ." },
      { stars: 3, group: "ವಿಮೆ ಮತ್ತು ಹಣಕಾಸು", reason: "ಉತ್ತಮ ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಆರ್ಥಿಕ ನಿರೋಧಕತೆ." },
      { stars: 3, group: "ವಿಜ್ಞಾನಿಗಳು ಮತ್ತು ಸಂಶೋಧಕರು", reason: "ಹವಾಮಾನ ವಿಜ್ಞಾನ ಮತ್ತು ನಾವೀನ್ಯತೆಯನ್ನು ವೇಗಗೊಳಿಸುತ್ತದೆ." },
      { stars: 2, group: "ಕೈಗಾರಿಕೆಗಳು", reason: "ವ್ಯವಹಾರ ನಿರಂತರತೆ ಮತ್ತು ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ." },
      { stars: 2, group: "ಸಾಮಾನ್ಯ ಸಾರ್ವಜನಿಕರು", reason: "ಸುಧಾರಿತ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸೇವೆಗಳ ಮೂಲಕ ಪರೋಕ್ಷ ಪ್ರಯೋಜನಗಳನ್ನು ಪಡೆಯುತ್ತಾರೆ." }
    ]
  }
};
