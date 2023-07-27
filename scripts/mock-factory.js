const { addDays, formatRFC3339 } = require('date-fns');

const { serviceRepo, userRepo, therapistRepo, orderRepo, ratingRepo, activityLogRepo, paymentRepo } = require('./mock-models.js');

userRepo.create({
    id: 100,
    first_name: 'Bintang',
    last_name: 'Kejora',
    email: 'user0@nusatech.id',
    google_id: 'abcd1234efgh5678a',
    avatar: '{{MOCK_URL}}/static/images/user-avatar-1.png',
    role: 'USER',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-07-18T07:30:00Z',
});

serviceRepo.create({
    id: 1,
    name: 'Deep Tissue Massage',
    description: 'Deep Tissue Massage adalah terapi pijat yang menargetkan kelompok otot dan jaringan ikat yang lebih dalam. Tujuannya adalah meredakan nyeri dan ketegangan otot kronis, meningkatkan rentang gerak, dan memperbaiki postur. Terapis menggunakan tekanan kuat untuk menjangkau lapisan yang lebih dalam dari otot dan jaringan ikat. Sesinya biasanya berlangsung antara 60 hingga 90 menit',
    duration: 90,
    price_per_hour: 500000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-1.jpeg',
    icon: '{{MOCK_URL}}/static/images/service-icon-01.png',
});

serviceRepo.create({
    id: 2,
    name: 'Swedish Massage',
    description: 'Swedish Massage adalah jenis terapi pijat yang paling umum dan terkenal. Teknik ini menggunakan serangkaian gerakan berupa menggosok, mengknead, dan mengetuk untuk meredakan ketegangan otot, mempromosikan relaksasi, dan meningkatkan sirkulasi darah. Manfaat lainnya termasuk peningkatan fleksibilitas dan kesejahteraan emosional. Swedish Massage adalah cara yang sempurna untuk meredakan stres dan memanjakan diri Anda.',
    duration: 60,
    price_per_hour: 400000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-2.png',
    icon: '{{MOCK_URL}}/static/images/service-icon-02.png',
});

serviceRepo.create({
    id: 3,
    name: 'Hot Stone Massage',
    description: 'Hot Stone Massage adalah jenis terapi pijat yang menggunakan batu panas sebagai alat utama. Batu-batu tersebut, biasanya batu basalt yang telah dipanaskan, ditempatkan pada titik-titik tertentu di seluruh tubuh untuk membantu meredakan ketegangan otot dan meningkatkan aliran darah. Teknik ini menghasilkan sensasi hangat yang mendalam dan relaksasi yang nyaman, sehingga sangat efektif untuk membantu meredakan stres dan meningkatkan kesejahteraan secara keseluruhan.',
    duration: 90,
    price_per_hour: 700000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-3.avif',
    icon: '{{MOCK_URL}}/static/images/service-icon-03.png',
});

serviceRepo.create({
    id: 4,
    name: 'Aromatherapy Massage',
    description: 'Aromatherapy Massage adalah jenis terapi pijat yang menggabungkan penggunaan minyak esensial aromatik untuk meningkatkan manfaat pijat. Minyak esensial yang diekstrak dari tumbuhan, bunga, dan rempah-rempah digunakan untuk meningkatkan suasana hati, mengurangi stres, dan mendukung perasaan kesejahteraan. Pijat aromaterapi tidak hanya melibatkan teknik pijat yang menenangkan dan mengurangi ketegangan otot, tetapi juga memberikan pengalaman multisensorial yang dapat meremajakan pikiran dan tubuh.',
    duration: 90,
    price_per_hour: 850000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-4.jpg',
    icon: '{{MOCK_URL}}/static/images/service-icon-04.png',
});

serviceRepo.create({
    id: 5,
    name: 'Reflexology',
    description: 'Reflexology adalah teknik pijat khusus yang menekankan pada titik-titik refleksi tertentu di tangan, kaki, dan telinga yang sesuai dengan area dan organ lainnya di dalam tubuh. Reflexology berfungsi untuk meningkatkan keseimbangan dan kesejahteraan tubuh secara keseluruhan. Ini bisa menjadi pengalaman yang sangat menenangkan dan relaksasi, sekaligus berfungsi untuk membantu tubuh meredakan stres dan ketegangan.',
    duration: 90,
    price_per_hour: 100000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-5.jpg',
    icon: '{{MOCK_URL}}/static/images/service-icon-05.png',
});

serviceRepo.create({
    id: 6,
    name: 'Facial Treatments',
    description: 'Ini melibatkan berbagai perawatan wajah, seperti pembersihan, pengeksfoliasian, pemijatan, dan perawatan lainnya',
    duration: 90,
    price_per_hour: 120000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-6.jpg',
    icon: '{{MOCK_URL}}/static/images/service-icon-06.png',
});

serviceRepo.create({
    id: 7,
    name: 'Body Scrubs and Wraps',
    description: 'Perawatan wajah atau Facial Treatments adalah rangkaian perawatan yang dirancang untuk memperbaiki dan merawat kulit wajah. Perawatan ini mungkin mencakup pembersihan mendalam, eksfoliasi, ekstraksi komedo, pengaplikasian masker, serum, pelembab, dan perlindungan sinar matahari. Perawatan wajah juga seringkali menyertakan pijatan ringan pada wajah dan leher untuk meningkatkan sirkulasi dan kekenyalan kulit.',
    duration: 90,
    price_per_hour: 100000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-7.jpg',
    icon: '{{MOCK_URL}}/static/images/service-icon-07.png',
});

serviceRepo.create({
    id: 8,
    name: 'Shiatsu Massage',
    description: 'Shiatsu massage adalah salah satu jenis pijat yang berasal dari Jepang. Shiatsu berarti tekanan jari dalam bahasa Jepang, karena pijat ini menggunakan jari, ibu jari, telapak tangan, dan kadang-kadang siku atau lutut untuk memberikan tekanan pada titik-titik atau saluran tertentu di tubuh1. Pijat ini dilakukan melalui pakaian longgar dan tidak menggunakan minyak.',
    duration: 90,
    price_per_hour: 135000,
    minimum_duration: 1,
    image: '{{MOCK_URL}}/static/images/service-8.jpg',
    icon: '{{MOCK_URL}}/static/images/service-icon-08.png',
});

therapistRepo.create({
    id: 1,
    first_name: 'Dewi',
    last_name: 'Sulistiani',
    location: { x: -7.01, y: 110.5 },
    experience_years: 5,
    photo: '{{MOCK_URL}}/static/images/therapist-1.jpg',
    age: 28,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 1),
        serviceRepo.find((s) => s.id === 2),
    ],
});

therapistRepo.create({
    id: 2,
    first_name: 'Budi',
    last_name: 'Santoso',
    location: { x: -7.1, y: 110.125 },
    experience_years: 7,
    photo: '{{MOCK_URL}}/static/images/therapist-2.jpg',
    age: 30,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 3),
        serviceRepo.find((s) => s.id === 4),
    ],
});

therapistRepo.create({
    id: 3,
    first_name: 'Siti',
    last_name: 'Rahayu',
    location: { x: -7.2, y: 110.4 },
    experience_years: 6,
    photo: '{{MOCK_URL}}/static/images/therapist-3.jpg',
    age: 29,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 2),
        serviceRepo.find((s) => s.id === 5),
    ],
});

therapistRepo.create({
    id: 4,
    first_name: 'Raden',
    last_name: 'Widodo',
    location: { x: -7.1, y: 110.5 },
    experience_years: 8,
    photo: '{{MOCK_URL}}/static/images/therapist-4.jpg',
    age: 32,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 6),
        serviceRepo.find((s) => s.id === 7),
    ],
});

therapistRepo.create({
    id: 5,
    first_name: 'Rini',
    last_name: 'Susanti',
    location: { x: -6.98, y: 110.4 },
    experience_years: 4,
    photo: '{{MOCK_URL}}/static/images/therapist-5.jpg',
    age: 27,
    gender: 'female',
    is_available: false,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 1),
        serviceRepo.find((s) => s.id === 8),
    ],
});

therapistRepo.create({
    id: 6,
    first_name: 'Danu',
    last_name: 'Santoso',
    location: { x: -6.9, y: 110.35 },
    experience_years: 5,
    photo: '{{MOCK_URL}}/static/images/therapist-6.jpg',
    age: 28,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 4),
        serviceRepo.find((s) => s.id === 5),
    ],
});

therapistRepo.create({
    id: 7,
    first_name: 'Ratna',
    last_name: 'Wijaya',
    location: { x: -7.025, y: 110.4 },
    experience_years: 9,
    photo: '{{MOCK_URL}}/static/images/therapist-7.jpg',
    age: 31,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 3),
        serviceRepo.find((s) => s.id === 6),
    ],
});

therapistRepo.create({
    id: 8,
    first_name: 'Hendri',
    last_name: 'Santoso',
    location: { x: -7.02, y: 110.4 },
    experience_years: 6,
    photo: '{{MOCK_URL}}/static/images/therapist-8.jpg',
    age: 30,
    gender: 'male',
    is_available: false,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 2),
        serviceRepo.find((s) => s.id === 7),
    ],
});

therapistRepo.create({
    id: 9,
    first_name: 'Hendri',
    last_name: 'Santoso',
    location: { x: -7.02, y: 110.4 },
    experience_years: 6,
    photo: '{{MOCK_URL}}/static/images/therapist-8.jpg',
    age: 30,
    gender: 'male',
    is_available: false,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 5),
        serviceRepo.find((s) => s.id === 8),
    ],
});

therapistRepo.create({
    id: 10,
    first_name: 'Andi',
    last_name: 'Widodo',
    location: { x: -7.0080, y: 110.4019 },
    experience_years: 4,
    photo: '{{MOCK_URL}}/static/images/therapist-10.jpg',
    age: 27,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 1),
        serviceRepo.find((s) => s.id === 6),
    ],
});

therapistRepo.create({
    id: 11,
    first_name: 'Lina',
    last_name: 'Susanti',
    location: { x: -7.0021, y: 110.4067 },
    experience_years: 6,
    photo: '{{MOCK_URL}}/static/images/therapist-11.jpg',
    age: 29,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 4),
        serviceRepo.find((s) => s.id === 7),
    ],
});

therapistRepo.create({
    id: 12,
    first_name: 'Herman',
    last_name: 'Setiawan',
    location: { x: -6.9998, y: 110.3995 },
    experience_years: 8,
    photo: '{{MOCK_URL}}/static/images/therapist-12.jpg',
    age: 31,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 2),
        serviceRepo.find((s) => s.id === 8),
    ],
});

therapistRepo.create({
    id: 13,
    first_name: 'Ratna',
    last_name: 'Widodo',
    location: { x: -7.0221, y: 110.4098 },
    experience_years: 5,
    photo: '{{MOCK_URL}}/static/images/therapist-13.jpg',
    age: 28,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 4),
        serviceRepo.find((s) => s.id === 5),
    ],
});

therapistRepo.create({
    id: 14,
    first_name: 'Hendri',
    last_name: 'Sulistianto',
    location: { x: -6.9965, y: 110.3992 },
    experience_years: 9,
    photo: '{{MOCK_URL}}/static/images/therapist-14.jpg',
    age: 31,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 1),
        serviceRepo.find((s) => s.id === 6),
    ],
});

therapistRepo.create({
    id: 15,
    first_name: 'Rina',
    last_name: 'Wijaya',
    location: { x: -6.9873, y: 110.4117 },
    experience_years: 6,
    photo: '{{MOCK_URL}}/static/images/therapist-15.jpg',
    age: 29,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 3),
        serviceRepo.find((s) => s.id === 7),
    ],
});

therapistRepo.create({
    id: 16,
    first_name: 'Surya',
    last_name: 'Susanto',
    location: { x: -7.0148, y: 110.4079 },
    experience_years: 8,
    photo: '{{MOCK_URL}}/static/images/therapist-16.jpg',
    age: 30,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 2),
        serviceRepo.find((s) => s.id === 5),
    ],
});

therapistRepo.create({
    id: 17,
    first_name: 'Ratih',
    last_name: 'Setiawan',
    location: { x: -7.0196, y: 110.4034 },
    experience_years: 5,
    photo: '{{MOCK_URL}}/static/images/therapist-17.jpg',
    age: 28,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 4),
        serviceRepo.find((s) => s.id === 6),
    ],
});

therapistRepo.create({
    id: 18,
    first_name: 'Hadi',
    last_name: 'Santoso',
    location: { x: -7.0255, y: 110.4067 },
    experience_years: 7,
    photo: '{{MOCK_URL}}/static/images/therapist-18.jpg',
    age: 30,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 1),
        serviceRepo.find((s) => s.id === 7),
    ],
});

therapistRepo.create({
    id: 19,
    first_name: 'Sari',
    last_name: 'Widodo',
    location: { x: -6.9959, y: 110.4121 },
    experience_years: 4,
    photo: '{{MOCK_URL}}/static/images/therapist-19.jpg',
    age: 27,
    gender: 'female',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 2),
        serviceRepo.find((s) => s.id === 8),
    ],
});

therapistRepo.create({
    id: 20,
    first_name: 'Hendri',
    last_name: 'Susanto',
    location: { x: -7.0072, y: 110.3983 },
    experience_years: 3,
    photo: '{{MOCK_URL}}/static/images/therapist-20.jpg',
    age: 26,
    gender: 'male',
    is_available: true,
    rating: undefined,
    client_total: undefined,
    review_total: undefined,
    start_day: 1, // Monday
    end_day: 5, // Friday
    start_time: '09:00',
    end_time: '18:00',
    created_at: '2023-07-18T07:30:00Z',
    updated_at: '2023-05-15T07:30:00Z',
    services: [
        serviceRepo.find((s) => s.id === 5),
        serviceRepo.find((s) => s.id === 8),
    ],
});

let orderIdInc = 1;
const dateBegin = new Date(2023, 5, 1, 10, 0);
const ratingSets = [3, 4, 3, 4, 5, 4, 5];
let ratingIndex = 0;
function cycleRating() {
    if (ratingIndex === ratingSets.length) {
        ratingIndex = 0;
    }
    return ratingSets[ratingIndex++];
}
const ratingNoteSets = [
    'Jasa pijat ini luar biasa! Saya memesan paket pijat refleksi selama satu jam dan saya tidak menyesal sama sekali. Terapisnya ahli dalam memijat kaki, tangan, dan kepala saya dengan tekanan yang pas. Saya bisa merasakan aliran darah dan energi saya meningkat. Ruangannya juga nyaman dengan musik dan aroma yang menenangkan. Saya pasti akan kembali lagi.',
    'Pelayanan cukup acceptable, namun perlu ada peningkatan.',
    'Pijat refleksi yang mantap, terapisnya jago dan tegas, ruangannya cozy dan wangi. Saya puas banget.',
    'Pijat yang bikin rileks, terapisnya sopan dan telaten, ruangannya rapi dan sejuk. Saya senang sekali.',
    'Pijatannya sangat menenangkan dan membantu meredakan ketegangan otot.',
    'Pijatannya sangat menenangkan dan membantu meredakan ketegangan otot.',
    'Pijatnya bagus banget, terapisnya ramah dan profesional, ruangannya juga bersih dan nyaman. Saya merasa segar dan rileks setelah pijat. Recomended banget deh.',
    'Pijatnya enak banget, terapisnya ramah dan profesional, ruangannya bersih dan nyaman. Saya suka sekali.',
    'Pijatnya enak, terapisnya ganteng dan cekatan, ruangannya juga keren dan cozy. Saya suka banget paket pijat refleksinya, bikin kaki dan tangan saya lebih ringan. Worth it banget deh.',
    'Pijatnya gokil, terapisnya ganteng dan gesit, ruangannya juga cool dan cozy. Worth it banget dah.',
    'Pijatnya jos gandos, terapisnya ngegass dan paham banget, ruangannya juga seger dan adem. Mantab bet dah.',
    'Pijatnya jos, terapisnya baik dan pinter, ruangannya juga rapi dan adem. Saya berasa seger dan santai abis pijat. Mantab bet dah.',
    'Pijatnya juara, terapisnya cakep dan cekatan, ruangannya juga keren dan enak. Bintang lima deh.',
    'Pijatnya kece abis, terapisnya friendly dan expert, ruangannya juga comfy dan relaxing. Recomended banget dah.',
    'Pijatnya keren, terapisnya cakep dan cekap, ruangannya juga asik dan enak. Oke punya dah.',
    'Pijatnya keren, terapisnya ramah dan jago, ruangannya juga bersih dan nyaman. Saya senang banget dengan pijatnya yang bikin otot dan sendi saya lebih lemes. Keren dah.',
    'Pijatnya maknyus, terapisnya gaul dan pinter, ruangannya juga bagus dan santai. Mantap jiwa dah.',
    'Pijatnya mantep, terapisnya asyik dan jitu, ruangannya juga nice dan calm. Saya senang banget dengan pijatnya yang bikin otot dan sendi saya lebih lentur. Suka banget deh.',
    'Pijatnya mantep, terapisnya asyik dan jitu, ruangannya juga nice dan calm. Suka banget dah.',
    'Pijatnya oke, terapisnya cakep dan gesit, ruangannya juga asik dan enak. Saya suka banget paket pijat refleksinya, bikin kaki dan tangan saya lebih enteng. Oke punya dah.',
    'Terapis yang sangat profesional dan berpengalaman. Pelayanannya luar biasa!',
];
let ratingNoteIndex = 0;
function cycleRatingNote() {
    if (ratingNoteIndex === ratingNoteSets.length) {
        ratingNoteIndex = 0;
    }
    return ratingNoteSets[ratingNoteIndex++];
}

for (const [index, therapist] of therapistRepo.items.entries()) {
    const firstOrder = orderIdInc++;
    orderRepo.create({
        id: firstOrder,
        user_id: 100,
        therapist_id: therapist.id,
        service_id: therapist.services[0].id,
        order_status: 'DONE',
        appointment_date: formatRFC3339(addDays(dateBegin, (index * 2) + 0)),
        appointment_duration: 90,
        total_price: undefined,
        location: { x: -7 - (index * 0.025), y: 110.5 + (index * 0.015) },
        created_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
        updated_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
    });

    ratingRepo.create({
        order_id: firstOrder,
        user_id: 100,
        rating: cycleRating(),
        note: cycleRatingNote(),
        created_at: formatRFC3339(addDays(dateBegin, (index * 2) + 2 + 0)),
        updated_at: formatRFC3339(addDays(dateBegin, (index * 2) + 2 + 0)),
    });

    paymentRepo.create({
        order_id: firstOrder,
        user_id: 100,
        amount_paid: orderRepo.find((order) => order.id === firstOrder).total_price,
        payment_at: formatRFC3339(addDays(dateBegin, (index * 2) - 1)),
        payment_status: 'SUCCESS',
        payment_method: 'OVO',
        payment_expired: formatRFC3339(addDays(dateBegin, (index * 2) + 5)),
        sender_account: '-',
        to_account: '-',
        created_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
        updated_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
    });

    const secondOrder = orderIdInc++;
    orderRepo.create({
        id: secondOrder,
        user_id: 100,
        therapist_id: therapist.id,
        service_id: therapist.services[1].id,
        order_status: 'DONE',
        appointment_date: formatRFC3339(addDays(dateBegin, (index * 2) + 1)),
        appointment_duration: 90,
        total_price: undefined,
        location: { x: -7 - (index * 0.01), y: 110.5 + (index * 0.02) },
        created_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
        updated_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
    });

    ratingRepo.create({
        order_id: secondOrder,
        user_id: 100,
        rating: cycleRating(),
        note: cycleRatingNote(),
        created_at: formatRFC3339(addDays(dateBegin, (index * 2) + 2 + 1)),
        updated_at: formatRFC3339(addDays(dateBegin, (index * 2) + 2 + 1)),
    });

    paymentRepo.create({
        order_id: secondOrder,
        user_id: 100,
        amount_paid: orderRepo.find((order) => order.id === secondOrder).total_price,
        payment_at: formatRFC3339(addDays(dateBegin, (index * 2) - 2)),
        payment_status: 'SUCCESS',
        payment_method: 'OVO',
        payment_expired: formatRFC3339(addDays(dateBegin, (index * 2) + 5)),
        sender_account: '-',
        to_account: '-',
        created_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
        updated_at: formatRFC3339(addDays(dateBegin, (index * 2) - 5)),
    });
}

orderRepo.create({
    id: 100,
    user_id: 100,
    therapist_id: 1,
    service_id: therapistRepo.find((t) => t.id === 1).services[0].id,
    order_status: 'DONE',
    appointment_date: formatRFC3339(new Date(2023, 6, 20, 10, 0 , 0, 0)),
    appointment_duration: 90,
    total_price: undefined,
    location: { x: -7, y: 110.5 },
    created_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
    updated_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
});

paymentRepo.create({
    order_id: 100,
    user_id: 100,
    amount_paid: orderRepo.find((order) => order.id === 100).total_price,
    payment_at: formatRFC3339(new Date(2023, 6, 15, 10, 0 , 0, 0)),
    payment_status: 'SUCCESS',
    payment_method: 'OVO',
    payment_expired: formatRFC3339(new Date(2023, 6, 16, 10, 0 , 0, 0)),
    sender_account: '-',
    to_account: '-',
    created_at: formatRFC3339(new Date(2023, 6, 15, 10, 0 , 0, 0)),
    updated_at: formatRFC3339(new Date(2023, 6, 15, 10, 0 , 0, 0)),
});

orderRepo.create({
    id: 101,
    user_id: 100,
    therapist_id: 1,
    service_id: therapistRepo.find((t) => t.id === 1).services[0].id,
    order_status: 'WAITING_CONFIRMATION',
    appointment_date: formatRFC3339(new Date(2023, 6, 20, 10, 0 , 0, 0)),
    appointment_duration: 90,
    total_price: undefined,
    location: { x: -7, y: 110.5 },
    created_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
    updated_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
});

orderRepo.create({
    id: 102,
    user_id: 100,
    therapist_id: 1,
    service_id: therapistRepo.find((t) => t.id === 1).services[0].id,
    order_status: 'PAID',
    appointment_date: formatRFC3339(new Date(2023, 6, 20, 10, 0 , 0, 0)),
    appointment_duration: 90,
    total_price: undefined,
    location: { x: -7, y: 110.5 },
    created_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
    updated_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
});

paymentRepo.create({
    order_id: 102,
    user_id: 100,
    amount_paid: orderRepo.find((order) => order.id === 102).total_price,
    payment_at: formatRFC3339(new Date(2023, 6, 15, 10, 0 , 0, 0)),
    payment_status: 'SUCCESS',
    payment_method: 'OVO',
    payment_expired: formatRFC3339(new Date(2023, 6, 16, 10, 0 , 0, 0)),
    sender_account: '-',
    to_account: '-',
    created_at: formatRFC3339(new Date(2023, 6, 15, 10, 0 , 0, 0)),
    updated_at: formatRFC3339(new Date(2023, 6, 15, 10, 0 , 0, 0)),
});

// orderRepo.create({
//     id: 103,
//     user_id: 100,
//     therapist_id: 1,
//     service_id: therapistRepo.find((t) => t.id === 1).services[0].id,
//     order_status: 'CANCELED',
//     appointment_date: formatRFC3339(new Date(2023, 6, 20, 10, 0 , 0, 0)),
//     appointment_duration: 90,
//     total_price: undefined,
//     location: { x: -7, y: 110.5 },
//     created_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
//     updated_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
// });

// orderRepo.create({
//     id: 104,
//     user_id: 100,
//     therapist_id: 1,
//     service_id: therapistRepo.find((t) => t.id === 1).services[0].id,
//     order_status: 'EXPIRED',
//     appointment_date: formatRFC3339(new Date(2023, 6, 20, 10, 0 , 0, 0)),
//     appointment_duration: 90,
//     total_price: undefined,
//     location: { x: -7, y: 110.5 },
//     created_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
//     updated_at: formatRFC3339(addDays(new Date(2023, 6, 20, 0, 0 , 0, 0), - 5)),
// });

activityLogRepo.create({
    user_id: 100,
    activity_type: 'Login',
    device_info: 'Redmi Note 10 Pro',
    ip_address: '36.80.171.248',
    location: 'Semarang, Indonesia',
    result: '',
    created_at: formatRFC3339(addDays(new Date(2023, 6, 20, 10, 0 , 0, 0), - 5)),
    updated_at: formatRFC3339(addDays(new Date(2023, 6, 20, 10, 0 , 0, 0), - 5)),
});

activityLogRepo.create({
    user_id: 100,
    activity_type: 'Login',
    device_info: 'Redmi Note 10 Pro',
    ip_address: '36.80.171.248',
    location: 'Semarang, Indonesia',
    result: '',
    created_at: formatRFC3339(addDays(new Date(2023, 6, 20, 15, 0 , 0, 0), - 5)),
    updated_at: formatRFC3339(addDays(new Date(2023, 6, 20, 15, 0 , 0, 0), - 5)),
});
