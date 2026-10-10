export interface EyeSpecialist {
  id: string
  name: string
  specialty: string
  hospital: string
  location: string
  experience: string
  education: string
  languages: string[]
  image: string
  description: string
  expertise: string[]
  consultationFee: string
  rating: number
  reviews: number
}

export const eyeSpecialistsData: EyeSpecialist[] = [
  {
    id: "dr-kim-min-soo",
    name: "Dr. Kim Min-Soo",
    specialty: "Retinal Surgery & Vitreoretinal Diseases",
    hospital: "Seoul National University Hospital",
    location: "Seoul, South Korea",
    experience: "15+ years",
    education: "MD, Seoul National University",
    languages: ["Korean", "English", "Japanese"],
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Leading expert in retinal detachment surgery and macular degeneration treatment with extensive experience in complex vitreoretinal procedures.",
    expertise: ["Retinal Detachment", "Macular Degeneration", "Diabetic Retinopathy", "Vitrectomy"],
    consultationFee: "₩150,000",
    rating: 4.9,
    reviews: 328,
  },
  {
    id: "dr-lee-ji-hyun",
    name: "Dr. Lee Ji-Hyun",
    specialty: "LASIK & Refractive Surgery",
    hospital: "Samsung Medical Center",
    location: "Gangnam, Seoul",
    experience: "12+ years",
    education: "MD, PhD, Yonsei University",
    languages: ["Korean", "English"],
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Specialist in advanced LASIK, LASEK, and SMILE procedures with over 10,000 successful surgeries performed.",
    expertise: ["LASIK Surgery", "LASEK", "SMILE", "ICL Implantation", "Presbyopia Correction"],
    consultationFee: "₩120,000",
    rating: 4.8,
    reviews: 512,
  },
  {
    id: "dr-park-sung-woo",
    name: "Dr. Park Sung-Woo",
    specialty: "Pediatric Ophthalmology & Strabismus",
    hospital: "Asan Medical Center",
    location: "Seoul, South Korea",
    experience: "18+ years",
    education: "MD, University of Ulsan",
    languages: ["Korean", "English", "Mandarin"],
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Renowned pediatric eye specialist focusing on childhood vision problems, lazy eye, and crossed eyes treatment.",
    expertise: ["Amblyopia", "Strabismus Surgery", "Pediatric Cataracts", "Congenital Eye Disorders"],
    consultationFee: "₩130,000",
    rating: 5.0,
    reviews: 245,
  },
  {
    id: "dr-choi-young-hee",
    name: "Dr. Choi Young-Hee",
    specialty: "Glaucoma & Optic Nerve Diseases",
    hospital: "Severance Hospital",
    location: "Sinchon, Seoul",
    experience: "20+ years",
    education: "MD, PhD, Yonsei University",
    languages: ["Korean", "English"],
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Expert in glaucoma management and surgical interventions with pioneering research in neuroprotection.",
    expertise: ["Glaucoma Surgery", "Trabeculectomy", "Tube Shunt", "Optic Neuropathy", "IOP Management"],
    consultationFee: "₩140,000",
    rating: 4.9,
    reviews: 389,
  },
  {
    id: "dr-jung-tae-ho",
    name: "Dr. Jung Tae-Ho",
    specialty: "Cataract Surgery & Lens Implantation",
    hospital: "Seoul St. Mary's Hospital",
    location: "Seoul, South Korea",
    experience: "14+ years",
    education: "MD, Catholic University of Korea",
    languages: ["Korean", "English", "German"],
    image: "/placeholder.svg?height=400&width=400",
    description: "Specialist in premium IOL implantation and complex cataract cases with minimal incision techniques.",
    expertise: ["Phacoemulsification", "Premium IOLs", "Toric Lenses", "Multifocal Lenses", "Complex Cataracts"],
    consultationFee: "₩110,000",
    rating: 4.8,
    reviews: 467,
  },
  {
    id: "dr-han-soo-jin",
    name: "Dr. Han Soo-Jin",
    specialty: "Corneal Transplant & External Eye Diseases",
    hospital: "Korea University Anam Hospital",
    location: "Seoul, South Korea",
    experience: "16+ years",
    education: "MD, Korea University",
    languages: ["Korean", "English"],
    image: "/placeholder.svg?height=400&width=400",
    description:
      "Leading expert in corneal transplantation, keratoconus treatment, and complex anterior segment surgery.",
    expertise: ["Corneal Transplant", "Keratoconus", "Pterygium Surgery", "Dry Eye Treatment", "Cross-linking"],
    consultationFee: "₩135,000",
    rating: 4.9,
    reviews: 298,
  },
  {
    id: "dr-kang-mi-young",
    name: "Dr. Kang Mi-Young",
    specialty: "Oculoplastic & Reconstructive Surgery",
    hospital: "Gangnam Severance Hospital",
    location: "Gangnam, Seoul",
    experience: "11+ years",
    education: "MD, Yonsei University",
    languages: ["Korean", "English", "French"],
    image: "/placeholder.svg?height=400&width=400",
    description: "Specialist in eyelid surgery, orbital reconstruction, and cosmetic periocular procedures.",
    expertise: ["Blepharoplasty", "Ptosis Repair", "Orbital Fracture", "Tear Duct Surgery", "Aesthetic Eyelid"],
    consultationFee: "₩125,000",
    rating: 4.7,
    reviews: 356,
  },
  {
    id: "dr-shin-dong-hyun",
    name: "Dr. Shin Dong-Hyun",
    specialty: "Uveitis & Ocular Immunology",
    hospital: "Seoul National University Bundang Hospital",
    location: "Seongnam, Gyeonggi",
    experience: "13+ years",
    education: "MD, PhD, Seoul National University",
    languages: ["Korean", "English"],
    image: "/placeholder.svg?height=400&width=400",
    description: "Expert in inflammatory eye diseases and immune-mediated ocular conditions with research focus.",
    expertise: ["Uveitis Treatment", "Ocular Inflammation", "Autoimmune Eye Disease", "Immunosuppression"],
    consultationFee: "₩145,000",
    rating: 4.8,
    reviews: 187,
  },
]
