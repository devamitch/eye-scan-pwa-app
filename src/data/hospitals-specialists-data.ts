export interface IcareHospital {
	id: string;
	name: string;
	nameKr: string;
	address: string;
	addressKr: string;
	location: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	phone: string;
	website: string;
	rating: number;
	reviews: number;
	doctorsCount: number;
	image: string;
	specialties: string[];
	services: string[];
	openingHours: {
		weekday: string;
		saturday: string;
		sunday: string;
	};
	description: string;
	specialists: string[]; // IDs of specialists working here
}

export interface IcareSpecialist {
	id: string;
	name: string;
	nameKr: string;
	specialty: string;
	specialtyKr: string;
	hospitalId: string;
	hospital: string;
	hospitalKr: string;
	location: string;
	experience: string;
	education: string;
	languages: string[];
	image: string;
	description: string;
	expertise: string[];
	consultationFee: string;
	rating: number;
	reviews: number;
	availability: string[];
}

// Real Korean Hospital Data with Coordinates
export const hospitalsData: IcareHospital[] = [
	{
		id: 'seoul-national-university-hospital',
		name: 'Seoul National University Hospital',
		nameKr: '서울대학교병원',
		address: '101 Daehak-ro, Jongno-gu, Seoul',
		addressKr: '서울특별시 종로구 대학로 101',
		location: 'Seoul, South Korea',
		coordinates: {
			lat: 37.5796,
			lng: 127.0025,
		},
		phone: '+82-2-2072-2114',
		website: 'http://www.snuh.org',
		rating: 4.9,
		reviews: 2847,
		doctorsCount: 45,
		image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
		specialties: [
			'Retinal Surgery',
			'Glaucoma Treatment',
			'Cataract Surgery',
			'Corneal Transplant',
			'Pediatric Ophthalmology',
		],
		services: [
			'Emergency Eye Care',
			'LASIK Surgery',
			'Retinal Imaging',
			'OCT Scanning',
			'Contact Lens Fitting',
		],
		openingHours: {
			weekday: '08:30 - 17:30',
			saturday: '08:30 - 12:30',
			sunday: 'Closed',
		},
		description:
			'Leading national hospital with state-of-the-art ophthalmology department and internationally recognized specialists.',
		specialists: ['dr-kim-min-soo', 'dr-shin-dong-hyun'],
	},
	{
		id: 'samsung-medical-center',
		name: 'Samsung Medical Center',
		nameKr: '삼성서울병원',
		address: '81 Irwon-ro, Gangnam-gu, Seoul',
		addressKr: '서울특별시 강남구 일원로 81',
		location: 'Gangnam, Seoul',
		coordinates: {
			lat: 37.4885,
			lng: 127.0857,
		},
		phone: '+82-2-3410-2114',
		website: 'http://www.samsunghospital.com',
		rating: 4.8,
		reviews: 3521,
		doctorsCount: 38,
		image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
		specialties: ['LASIK Surgery', 'LASEK', 'SMILE', 'Refractive Surgery', 'ICL Implantation'],
		services: [
			'Premium LASIK',
			'Vision Correction',
			'Pre-operative Screening',
			'Post-operative Care',
			'Custom Wavefront LASIK',
		],
		openingHours: {
			weekday: '08:00 - 18:00',
			saturday: '08:00 - 13:00',
			sunday: 'Closed',
		},
		description:
			'Premium eye care facility specializing in advanced refractive surgery with cutting-edge technology.',
		specialists: ['dr-lee-ji-hyun'],
	},
	{
		id: 'asan-medical-center',
		name: 'Asan Medical Center',
		nameKr: '서울아산병원',
		address: '88 Olympic-ro 43-gil, Songpa-gu, Seoul',
		addressKr: '서울특별시 송파구 올림픽로43길 88',
		location: 'Seoul, South Korea',
		coordinates: {
			lat: 37.5266,
			lng: 127.1088,
		},
		phone: '+82-2-3010-3114',
		website: 'http://www.amc.seoul.kr',
		rating: 5.0,
		reviews: 1823,
		doctorsCount: 32,
		image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800',
		specialties: [
			'Pediatric Ophthalmology',
			'Strabismus',
			'Amblyopia',
			'Pediatric Cataracts',
			'Congenital Eye Disorders',
		],
		services: [
			'Pediatric Eye Exams',
			'Strabismus Surgery',
			'Vision Therapy',
			'Pediatric Contact Lenses',
			'Genetic Counseling',
		],
		openingHours: {
			weekday: '08:30 - 17:00',
			saturday: '08:30 - 12:00',
			sunday: 'Emergency Only',
		},
		description:
			'Leading pediatric ophthalmology center with specialized care for children and young adults.',
		specialists: ['dr-park-sung-woo'],
	},
	{
		id: 'severance-hospital',
		name: 'Severance Hospital',
		nameKr: '세브란스병원',
		address: '50-1 Yonsei-ro, Seodaemun-gu, Seoul',
		addressKr: '서울특별시 서대문구 연세로 50-1',
		location: 'Sinchon, Seoul',
		coordinates: {
			lat: 37.5625,
			lng: 126.9408,
		},
		phone: '+82-2-2228-5810',
		website: 'http://sev.severance.healthcare',
		rating: 4.9,
		reviews: 2156,
		doctorsCount: 41,
		image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
		specialties: [
			'Glaucoma',
			'Optic Nerve Diseases',
			'IOP Management',
			'Trabeculectomy',
			'Tube Shunt',
		],
		services: [
			'Glaucoma Surgery',
			'Visual Field Testing',
			'OCT Imaging',
			'Tonometry',
			'Laser Treatment',
		],
		openingHours: {
			weekday: '09:00 - 17:30',
			saturday: '09:00 - 13:00',
			sunday: 'Closed',
		},
		description:
			'Renowned hospital with advanced glaucoma research center and state-of-the-art surgical facilities.',
		specialists: ['dr-choi-young-hee'],
	},
	{
		id: 'seoul-st-marys-hospital',
		name: "Seoul St. Mary's Hospital",
		nameKr: '서울성모병원',
		address: '222 Banpo-daero, Seocho-gu, Seoul',
		addressKr: '서울특별시 서초구 반포대로 222',
		location: 'Seoul, South Korea',
		coordinates: {
			lat: 37.5013,
			lng: 127.0037,
		},
		phone: '+82-2-2258-5810',
		website: 'http://www.cmcseoul.or.kr',
		rating: 4.8,
		reviews: 1967,
		doctorsCount: 29,
		image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
		specialties: [
			'Cataract Surgery',
			'Premium IOL',
			'Toric Lenses',
			'Multifocal Lenses',
			'Phacoemulsification',
		],
		services: [
			'Cataract Evaluation',
			'IOL Selection',
			'Laser Cataract Surgery',
			'Post-operative Care',
			'Lens Calculations',
		],
		openingHours: {
			weekday: '08:30 - 17:00',
			saturday: '08:30 - 12:30',
			sunday: 'Closed',
		},
		description:
			'Specialized center for advanced cataract surgery with premium intraocular lens implantation.',
		specialists: ['dr-jung-tae-ho'],
	},
	{
		id: 'korea-university-anam-hospital',
		name: 'Korea University Anam Hospital',
		nameKr: '고려대학교 안암병원',
		address: '73 Goryeodae-ro, Seongbuk-gu, Seoul',
		addressKr: '서울특별시 성북구 고려대로 73',
		location: 'Seoul, South Korea',
		coordinates: {
			lat: 37.5873,
			lng: 127.0265,
		},
		phone: '+82-2-920-5114',
		website: 'http://www.kumc.or.kr',
		rating: 4.9,
		reviews: 1534,
		doctorsCount: 27,
		image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800',
		specialties: ['Corneal Transplant', 'Keratoconus', 'Pterygium', 'Dry Eye', 'Cross-linking'],
		services: [
			'Corneal Surgery',
			'Keratoconus Treatment',
			'Dry Eye Clinic',
			'Contact Lens Fitting',
			'Corneal Topography',
		],
		openingHours: {
			weekday: '08:30 - 17:30',
			saturday: '08:30 - 12:30',
			sunday: 'Closed',
		},
		description:
			'Premier corneal transplant center with expertise in external eye diseases and dry eye treatment.',
		specialists: ['dr-han-soo-jin'],
	},
	{
		id: 'gangnam-severance-hospital',
		name: 'Gangnam Severance Hospital',
		nameKr: '강남세브란스병원',
		address: '211 Eonju-ro, Gangnam-gu, Seoul',
		addressKr: '서울특별시 강남구 언주로 211',
		location: 'Gangnam, Seoul',
		coordinates: {
			lat: 37.5196,
			lng: 127.0473,
		},
		phone: '+82-2-2019-3114',
		website: 'http://gs.severance.healthcare',
		rating: 4.7,
		reviews: 1876,
		doctorsCount: 23,
		image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
		specialties: [
			'Oculoplastic Surgery',
			'Blepharoplasty',
			'Ptosis Repair',
			'Orbital Surgery',
			'Aesthetic Eyelid',
		],
		services: [
			'Eyelid Surgery',
			'Orbital Reconstruction',
			'Tear Duct Surgery',
			'Aesthetic Procedures',
			'Facial Rejuvenation',
		],
		openingHours: {
			weekday: '09:00 - 18:00',
			saturday: '09:00 - 13:00',
			sunday: 'Closed',
		},
		description:
			'Premium oculoplastic surgery center combining medical expertise with aesthetic excellence.',
		specialists: ['dr-kang-mi-young'],
	},
	{
		id: 'snuh-bundang-hospital',
		name: 'Seoul National University Bundang Hospital',
		nameKr: '분당서울대학교병원',
		address: '82 Gumi-ro 173beon-gil, Bundang-gu, Seongnam',
		addressKr: '경기도 성남시 분당구 구미로173번길 82',
		location: 'Seongnam, Gyeonggi',
		coordinates: {
			lat: 37.3519,
			lng: 127.1237,
		},
		phone: '+82-31-787-7114',
		website: 'http://www.snubh.org',
		rating: 4.8,
		reviews: 1245,
		doctorsCount: 19,
		image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
		specialties: [
			'Uveitis',
			'Ocular Inflammation',
			'Autoimmune Eye Disease',
			'Immunosuppression',
		],
		services: [
			'Uveitis Treatment',
			'Immune Testing',
			'Inflammatory Eye Care',
			'Biologic Therapy',
			'Research Trials',
		],
		openingHours: {
			weekday: '08:30 - 17:00',
			saturday: '08:30 - 12:00',
			sunday: 'Closed',
		},
		description:
			'Advanced research hospital specializing in inflammatory and immune-mediated eye conditions.',
		specialists: ['dr-shin-dong-hyun'],
	},
];

// Enhanced Specialist Data with Hospital Links
export const specialistsData: IcareSpecialist[] = [
	{
		id: 'dr-kim-min-soo',
		name: 'Dr. Kim Min-Soo',
		nameKr: '김민수 교수',
		specialty: 'Retinal Surgery & Vitreoretinal Diseases',
		specialtyKr: '망막수술 및 유리체망막질환',
		hospitalId: 'seoul-national-university-hospital',
		hospital: 'Seoul National University Hospital',
		hospitalKr: '서울대학교병원',
		location: 'Seoul, South Korea',
		experience: '15+ years',
		education: 'MD, Seoul National University',
		languages: ['Korean', 'English', 'Japanese'],
		image: 'https://plus.unsplash.com/premium_photo-1661766752153-9f0c3fad728f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a29yZWFuJTIwZG9jdG9yc3xlbnwwfHwwfHx8MA%3D%3D',
		description:
			'Leading expert in retinal detachment surgery and macular degeneration treatment with extensive experience in complex vitreoretinal procedures.',
		expertise: [
			'Retinal Detachment',
			'Macular Degeneration',
			'Diabetic Retinopathy',
			'Vitrectomy',
		],
		consultationFee: '₩150,000',
		rating: 4.9,
		reviews: 328,
		availability: ['Monday', 'Wednesday', 'Friday'],
	},
	{
		id: 'dr-lee-ji-hyun',
		name: 'Dr. Lee Ji-Hyun',
		nameKr: '이지현 교수',
		specialty: 'LASIK & Refractive Surgery',
		specialtyKr: '라식/라섹 시력교정',
		hospitalId: 'samsung-medical-center',
		hospital: 'Samsung Medical Center',
		hospitalKr: '삼성서울병원',
		location: 'Gangnam, Seoul',
		experience: '12+ years',
		education: 'MD, PhD, Yonsei University',
		languages: ['Korean', 'English'],
		image: 'https://plus.unsplash.com/premium_photo-1726812157958-09564992dc4a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8a29yZWFuJTIwZG9jdG9yc3xlbnwwfHwwfHx8MA%3D%3D',
		description:
			'Specialist in advanced LASIK, LASEK, and SMILE procedures with over 10,000 successful surgeries performed.',
		expertise: ['LASIK Surgery', 'LASEK', 'SMILE', 'ICL Implantation', 'Presbyopia Correction'],
		consultationFee: '₩120,000',
		rating: 4.8,
		reviews: 512,
		availability: ['Tuesday', 'Thursday', 'Saturday'],
	},
	{
		id: 'dr-park-sung-woo',
		name: 'Dr. Park Sung-Woo',
		nameKr: '박성우 교수',
		specialty: 'Pediatric Ophthalmology & Strabismus',
		specialtyKr: '소아안과 및 사시',
		hospitalId: 'asan-medical-center',
		hospital: 'Asan Medical Center',
		hospitalKr: '서울아산병원',
		location: 'Seoul, South Korea',
		experience: '18+ years',
		education: 'MD, University of Ulsan',
		languages: ['Korean', 'English', 'Mandarin'],
		image: 'https://plus.unsplash.com/premium_photo-1661398760070-30982ccd1643?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGtvcmVhbiUyMGRvY3RvcnN8ZW58MHx8MHx8fDA%3D',
		description:
			'Renowned pediatric eye specialist focusing on childhood vision problems, lazy eye, and crossed eyes treatment.',
		expertise: [
			'Amblyopia',
			'Strabismus Surgery',
			'Pediatric Cataracts',
			'Congenital Eye Disorders',
		],
		consultationFee: '₩130,000',
		rating: 5.0,
		reviews: 245,
		availability: ['Monday', 'Tuesday', 'Thursday'],
	},
	{
		id: 'dr-choi-young-hee',
		name: 'Dr. Choi Young-Hee',
		nameKr: '최영희 교수',
		specialty: 'Glaucoma & Optic Nerve Diseases',
		specialtyKr: '녹내장 및 시신경질환',
		hospitalId: 'severance-hospital',
		hospital: 'Severance Hospital',
		hospitalKr: '세브란스병원',
		location: 'Sinchon, Seoul',
		experience: '20+ years',
		education: 'MD, PhD, Yonsei University',
		languages: ['Korean', 'English'],
		image: 'https://plus.unsplash.com/premium_photo-1661777326990-9dbd5b4d475e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8a29yZWFuJTIwZG9jdG9yc3xlbnwwfHwwfHx8MA%3D%3D',
		description:
			'Expert in glaucoma management and surgical interventions with pioneering research in neuroprotection.',
		expertise: [
			'Glaucoma Surgery',
			'Trabeculectomy',
			'Tube Shunt',
			'Optic Neuropathy',
			'IOP Management',
		],
		consultationFee: '₩140,000',
		rating: 4.9,
		reviews: 389,
		availability: ['Monday', 'Wednesday', 'Friday'],
	},
	{
		id: 'dr-jung-tae-ho',
		name: 'Dr. Jung Tae-Ho',
		nameKr: '정태호 교수',
		specialty: 'Cataract Surgery & Lens Implantation',
		specialtyKr: '백내장 수술 및 인공수정체',
		hospitalId: 'seoul-st-marys-hospital',
		hospital: "Seoul St. Mary's Hospital",
		hospitalKr: '서울성모병원',
		location: 'Seoul, South Korea',
		experience: '14+ years',
		education: 'MD, Catholic University of Korea',
		languages: ['Korean', 'English', 'German'],
		image: 'https://images.unsplash.com/photo-1757125736482-328a3cdd9743?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWVkaWNhbCUyMHByb2Zlc3Npb25hbCUyMGFzaWFufGVufDB8fDB8fHww',
		description:
			'Specialist in premium IOL implantation and complex cataract cases with minimal incision techniques.',
		expertise: [
			'Phacoemulsification',
			'Premium IOLs',
			'Toric Lenses',
			'Multifocal Lenses',
			'Complex Cataracts',
		],
		consultationFee: '₩110,000',
		rating: 4.8,
		reviews: 467,
		availability: ['Tuesday', 'Wednesday', 'Thursday'],
	},
	{
		id: 'dr-han-soo-jin',
		name: 'Dr. Han Soo-Jin',
		nameKr: '한수진 교수',
		specialty: 'Corneal Transplant & External Eye Diseases',
		specialtyKr: '각막이식 및 외안부질환',
		hospitalId: 'korea-university-anam-hospital',
		hospital: 'Korea University Anam Hospital',
		hospitalKr: '고려대학교 안암병원',
		location: 'Seoul, South Korea',
		experience: '16+ years',
		education: 'MD, Korea University',
		languages: ['Korean', 'English'],
		image: 'https://images.unsplash.com/photo-1640052789212-dfac3c02516b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1lZGljYWwlMjBwcm9mZXNzaW9uYWwlMjBqYXBhbmVzZXxlbnwwfHwwfHx8MA%3D%3D',
		description:
			'Leading expert in corneal transplantation, keratoconus treatment, and complex anterior segment surgery.',
		expertise: [
			'Corneal Transplant',
			'Keratoconus',
			'Pterygium Surgery',
			'Dry Eye Treatment',
			'Cross-linking',
		],
		consultationFee: '₩135,000',
		rating: 4.9,
		reviews: 298,
		availability: ['Monday', 'Thursday', 'Friday'],
	},
	{
		id: 'dr-kang-mi-young',
		name: 'Dr. Kang Mi-Young',
		nameKr: '강미영 교수',
		specialty: 'Oculoplastic & Reconstructive Surgery',
		specialtyKr: '안성형 및 재건수술',
		hospitalId: 'gangnam-severance-hospital',
		hospital: 'Gangnam Severance Hospital',
		hospitalKr: '강남세브란스병원',
		location: 'Gangnam, Seoul',
		experience: '11+ years',
		education: 'MD, Yonsei University',
		languages: ['Korean', 'English', 'French'],
		image: 'https://images.unsplash.com/photo-1592393532405-fb1f165c4a1f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWVkaWNhbCUyMHByb2Zlc3Npb25hbCUyMGtvcmVhbnxlbnwwfHwwfHx8MA%3D%3D',
		description:
			'Specialist in eyelid surgery, orbital reconstruction, and cosmetic periocular procedures.',
		expertise: [
			'Blepharoplasty',
			'Ptosis Repair',
			'Orbital Fracture',
			'Tear Duct Surgery',
			'Aesthetic Eyelid',
		],
		consultationFee: '₩125,000',
		rating: 4.7,
		reviews: 356,
		availability: ['Tuesday', 'Thursday', 'Saturday'],
	},
	{
		id: 'dr-shin-dong-hyun',
		name: 'Dr. Shin Dong-Hyun',
		nameKr: '신동현 교수',
		specialty: 'Uveitis & Ocular Immunology',
		specialtyKr: '포도막염 및 안면역학',
		hospitalId: 'snuh-bundang-hospital',
		hospital: 'Seoul National University Bundang Hospital',
		hospitalKr: '분당서울대학교병원',
		location: 'Seongnam, Gyeonggi',
		experience: '13+ years',
		education: 'MD, PhD, Seoul National University',
		languages: ['Korean', 'English'],
		image: 'https://images.unsplash.com/photo-1594920529206-ac9bb992430a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG1lZGljYWwlMjBwcm9mZXNzaW9uYWwlMjBrb3JlYW58ZW58MHx8MHx8fDA%3D',
		description:
			'Expert in inflammatory eye diseases and immune-mediated ocular conditions with research focus.',
		expertise: [
			'Uveitis Treatment',
			'Ocular Inflammation',
			'Autoimmune Eye Disease',
			'Immunosuppression',
		],
		consultationFee: '₩145,000',
		rating: 4.8,
		reviews: 187,
		availability: ['Monday', 'Wednesday', 'Friday'],
	},
];

// Specialty Categories
export const specialtyCategories = [
	{
		id: 'retinal-surgery',
		name: 'Retinal Surgery',
		nameKr: '망막수술',
		icon: '👁️',
		count: 1,
	},
	{
		id: 'refractive-surgery',
		name: 'Refractive Surgery',
		nameKr: '시력교정수술',
		icon: '🔬',
		count: 1,
	},
	{
		id: 'pediatric',
		name: 'Pediatric Ophthalmology',
		nameKr: '소아안과',
		icon: '👶',
		count: 1,
	},
	{
		id: 'glaucoma',
		name: 'Glaucoma Treatment',
		nameKr: '녹내장',
		icon: '💊',
		count: 1,
	},
	{
		id: 'cataract',
		name: 'Cataract Surgery',
		nameKr: '백내장수술',
		icon: '⚕️',
		count: 1,
	},
	{
		id: 'corneal',
		name: 'Corneal & External',
		nameKr: '각막/외안부',
		icon: '🔍',
		count: 1,
	},
	{
		id: 'oculoplastic',
		name: 'Oculoplastic Surgery',
		nameKr: '안성형',
		icon: '✨',
		count: 1,
	},
	{
		id: 'uveitis',
		name: 'Uveitis & Immunology',
		nameKr: '포도막염',
		icon: '🧬',
		count: 1,
	},
];

// External Product Links
export const productExternalLinks = {
	'piaren-eye-drops-0.5ml': 'https://m.smartstore.naver.com/ouestore/products/11585336675',
	'dr-fresh-eye-drops-0.45ml': 'https://m.smartstore.naver.com/ouestore/products/11368976394',
	'ouesoo-trehalose-eye-drop': 'https://m.smartstore.naver.com/ouestore/products/8096581893',
	default: 'http://optuspharm.com/us/sub/otc_pd.php',
};
