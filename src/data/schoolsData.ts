import { School, MopAlertItem } from '../types';

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'nanyang-primary',
    name: 'Nanyang Primary School',
    address: "52 King's Rd, Singapore 268097",
    postalCode: '268097',
    planningArea: 'Bukit Timah',
    phaseCategory: 'Phase 2A',
    distanceToUser: 0.8,
    avgPsf1km: 942,
    psfChangeQoq: 3.2,
    transactions6m: 128,
    avg4RoomPrice: 850000,
    priceTrendYoy: 4.2,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 84,
    mrtStationsNearbyCount: 3,
    mrtNearby: [
      { name: 'Farrer Road (CC20)', line: 'Circle Line', distKm: 0.45 },
      { name: 'Tan Kah Kee (DT8)', line: 'Downtown Line', distKm: 0.82 },
      { name: 'Botanic Gardens (CC19/DT9)', line: 'Interchange', distKm: 0.95 }
    ],
    coordinates: {
      lat: 1.3211,
      lng: 103.8078,
      mapX: 47,
      mapY: 53
    },
    priceHistory: [
      { month: 'Jan', room3: 490000, room4: 360000, room5: 560000 },
      { month: 'Feb', room3: 495000, room4: 385000, room5: 590000 },
      { month: 'Mar', room3: 502000, room4: 410000, room5: 595000 },
      { month: 'Apr', room3: 508000, room4: 435000, room5: 640000 },
      { month: 'May', room3: 512000, room4: 470000, room5: 780000 },
      { month: 'Jun', room3: 515000, room4: 500000, room5: 840000 },
      { month: 'Jul', room3: 518000, room4: 530000, room5: 820000 },
      { month: 'Aug', room3: 516000, room4: 550000, room5: 770000 },
      { month: 'Sep', room3: 520000, room4: 565000, room5: 740000 },
      { month: 'Oct', room3: 522000, room4: 580000, room5: 760000 },
      { month: 'Nov', room3: 518000, room4: 630000, room5: 830000 },
      { month: 'Dec', room3: 525000, room4: 660000, room5: 890000 }
    ],
    transactions: [
      {
        id: 'tx-ny-1',
        schoolId: 'nanyang-primary',
        blockStreet: "Blk 5 Queen's Road",
        builtYear: 1974,
        floorAreaSqm: 73,
        flatType: '3-Room',
        distanceKm: 0.3,
        price: 520000,
        dateStr: 'Oct 2023',
        storeyRange: '07 to 09',
        psf: 662
      },
      {
        id: 'tx-ny-2',
        schoolId: 'nanyang-primary',
        blockStreet: 'Blk 4A Farrer Road',
        builtYear: 1999,
        floorAreaSqm: 92,
        flatType: '4-Room',
        distanceKm: 0.6,
        price: 880000,
        dateStr: 'Sep 2023',
        storeyRange: '10 to 12',
        psf: 888
      },
      {
        id: 'tx-ny-3',
        schoolId: 'nanyang-primary',
        blockStreet: 'Blk 6 Empress Road',
        builtYear: 1974,
        floorAreaSqm: 120,
        flatType: '5-Room',
        distanceKm: 0.8,
        price: 1150000,
        dateStr: 'Aug 2023',
        storeyRange: '13 to 15',
        psf: 890
      },
      {
        id: 'tx-ny-4',
        schoolId: 'nanyang-primary',
        blockStreet: "Blk 3 Queen's Road",
        builtYear: 1974,
        floorAreaSqm: 75,
        flatType: '3-Room',
        distanceKm: 0.35,
        price: 535000,
        dateStr: 'Jul 2023',
        storeyRange: '04 to 06',
        psf: 662
      },
      {
        id: 'tx-ny-5',
        schoolId: 'nanyang-primary',
        blockStreet: 'Blk 8 Empress Road',
        builtYear: 1977,
        floorAreaSqm: 95,
        flatType: '4-Room',
        distanceKm: 0.75,
        price: 895000,
        dateStr: 'Jun 2023',
        storeyRange: '16 to 18',
        psf: 875
      },
      {
        id: 'tx-ny-6',
        schoolId: 'nanyang-primary',
        blockStreet: "Blk 2 King's Road",
        builtYear: 1974,
        floorAreaSqm: 68,
        flatType: '3-Room',
        distanceKm: 0.25,
        price: 510000,
        dateStr: 'May 2023',
        storeyRange: '01 to 03',
        psf: 698
      }
    ],
    upcomingMopUnits: 340,
    description: 'Renowned co-educational institution situated in Bukit Timah. Very high demand in Phase 2A and 2B priority ballots.'
  },
  {
    id: 'tao-nan-school',
    name: 'Tao Nan School',
    address: '49 Marine Crescent, Singapore 449761',
    postalCode: '449761',
    planningArea: 'Marine Parade',
    phaseCategory: 'Phase 2B',
    distanceToUser: 1.2,
    avgPsf1km: 810,
    psfChangeQoq: 1.1,
    transactions6m: 96,
    avg4RoomPrice: 720000,
    priceTrendYoy: 1.1,
    trendType: 'Stable',
    hdbBlocks1kmCount: 68,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Marine Terrace (TE27)', line: 'Thomson-East Coast Line', distKm: 0.3 },
      { name: 'Marine Parade (TE26)', line: 'Thomson-East Coast Line', distKm: 0.7 }
    ],
    coordinates: {
      lat: 1.3065,
      lng: 103.9114,
      mapX: 82,
      mapY: 65
    },
    priceHistory: [
      { month: 'Jan', room3: 430000, room4: 680000, room5: 840000 },
      { month: 'Feb', room3: 435000, room4: 690000, room5: 845000 },
      { month: 'Mar', room3: 440000, room4: 695000, room5: 850000 },
      { month: 'Apr', room3: 445000, room4: 700000, room5: 860000 },
      { month: 'May', room3: 450000, room4: 705000, room5: 870000 },
      { month: 'Jun', room3: 452000, room4: 710000, room5: 875000 },
      { month: 'Jul', room3: 455000, room4: 715000, room5: 880000 },
      { month: 'Aug', room3: 458000, room4: 718000, room5: 885000 },
      { month: 'Sep', room3: 460000, room4: 720000, room5: 890000 },
      { month: 'Oct', room3: 462000, room4: 722000, room5: 892000 },
      { month: 'Nov', room3: 465000, room4: 725000, room5: 898000 },
      { month: 'Dec', room3: 470000, room4: 730000, room5: 905000 }
    ],
    transactions: [
      {
        id: 'tx-tn-1',
        schoolId: 'tao-nan-school',
        blockStreet: 'Blk 58 Marine Terrace',
        builtYear: 1976,
        floorAreaSqm: 88,
        flatType: '4-Room',
        distanceKm: 0.35,
        price: 725000,
        dateStr: 'Nov 2023',
        storeyRange: '07 to 09',
        psf: 765
      },
      {
        id: 'tx-tn-2',
        schoolId: 'tao-nan-school',
        blockStreet: 'Blk 1 Marine Terrace',
        builtYear: 1975,
        floorAreaSqm: 65,
        flatType: '3-Room',
        distanceKm: 0.45,
        price: 450000,
        dateStr: 'Oct 2023',
        storeyRange: '04 to 06',
        psf: 642
      },
      {
        id: 'tx-tn-3',
        schoolId: 'tao-nan-school',
        blockStreet: 'Blk 63 Marine Drive',
        builtYear: 1977,
        floorAreaSqm: 122,
        flatType: '5-Room',
        distanceKm: 0.7,
        price: 910000,
        dateStr: 'Sep 2023',
        storeyRange: '10 to 12',
        psf: 694
      }
    ],
    upcomingMopUnits: 180,
    description: 'Premier SAP school established in 1906, prominent East Coast location near East Coast Park.'
  },
  {
    id: 'rosyth-school',
    name: 'Rosyth School',
    address: '21 Serangoon North Ave 4, Singapore 555855',
    postalCode: '555855',
    planningArea: 'Serangoon',
    phaseCategory: 'Phase 2C',
    distanceToUser: 2.5,
    avgPsf1km: 670,
    psfChangeQoq: 2.4,
    transactions6m: 142,
    avg4RoomPrice: 680000,
    priceTrendYoy: 3.5,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 112,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Kovan (NE13)', line: 'North East Line', distKm: 1.4 },
      { name: 'Serangoon North (CR9 - u/c)', line: 'Cross Island Line', distKm: 0.35 }
    ],
    coordinates: {
      lat: 1.3732,
      lng: 103.8745,
      mapX: 68,
      mapY: 38
    },
    priceHistory: [
      { month: 'Jan', room3: 390000, room4: 590000, room5: 750000 },
      { month: 'Feb', room3: 395000, room4: 605000, room5: 760000 },
      { month: 'Mar', room3: 400000, room4: 620000, room5: 770000 },
      { month: 'Apr', room3: 405000, room4: 630000, room5: 785000 },
      { month: 'May', room3: 410000, room4: 645000, room5: 795000 },
      { month: 'Jun', room3: 415000, room4: 655000, room5: 810000 },
      { month: 'Jul', room3: 420000, room4: 665000, room5: 820000 },
      { month: 'Aug', room3: 422000, room4: 670000, room5: 825000 },
      { month: 'Sep', room3: 428000, room4: 675000, room5: 830000 },
      { month: 'Oct', room3: 430000, room4: 680000, room5: 840000 },
      { month: 'Nov', room3: 435000, room4: 690000, room5: 855000 },
      { month: 'Dec', room3: 440000, room4: 700000, room5: 870000 }
    ],
    transactions: [
      {
        id: 'tx-rs-1',
        schoolId: 'rosyth-school',
        blockStreet: 'Blk 153 Serangoon North Ave 1',
        builtYear: 1989,
        floorAreaSqm: 93,
        flatType: '4-Room',
        distanceKm: 0.4,
        price: 685000,
        dateStr: 'Nov 2023',
        storeyRange: '07 to 09',
        psf: 684
      },
      {
        id: 'tx-rs-2',
        schoolId: 'rosyth-school',
        blockStreet: 'Blk 128 Serangoon North Ave 2',
        builtYear: 1987,
        floorAreaSqm: 68,
        flatType: '3-Room',
        distanceKm: 0.6,
        price: 430000,
        dateStr: 'Oct 2023',
        storeyRange: '04 to 06',
        psf: 588
      },
      {
        id: 'tx-rs-3',
        schoolId: 'rosyth-school',
        blockStreet: 'Blk 508 Serangoon North Ave 4',
        builtYear: 1993,
        floorAreaSqm: 121,
        flatType: '5-Room',
        distanceKm: 0.25,
        price: 845000,
        dateStr: 'Sep 2023',
        storeyRange: '10 to 12',
        psf: 649
      }
    ],
    upcomingMopUnits: 520,
    description: 'Highly sought-after primary school with Gifted Education Programme (GEP) in Serangoon.'
  },
  {
    id: 'henry-park-primary',
    name: 'Henry Park Primary School',
    address: '1 Holland Grove Rd, Singapore 278790',
    postalCode: '278790',
    planningArea: 'Queenstown / Bukit Timah',
    phaseCategory: 'Phase 2A',
    distanceToUser: 1.6,
    avgPsf1km: 980,
    psfChangeQoq: 3.8,
    transactions6m: 88,
    avg4RoomPrice: 910000,
    priceTrendYoy: 4.8,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 52,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Dover (EW22)', line: 'East West Line', distKm: 0.75 },
      { name: 'Buona Vista (EW21/CC22)', line: 'Interchange', distKm: 1.1 }
    ],
    coordinates: {
      lat: 1.3175,
      lng: 103.7766,
      mapX: 38,
      mapY: 58
    },
    priceHistory: [
      { month: 'Jan', room3: 540000, room4: 820000, room5: 1050000 },
      { month: 'Jun', room3: 570000, room4: 865000, room5: 1100000 },
      { month: 'Dec', room3: 600000, room4: 920000, room5: 1180000 }
    ],
    transactions: [
      {
        id: 'tx-hp-1',
        schoolId: 'henry-park-primary',
        blockStreet: 'Blk 12 Ghim Moh Road',
        builtYear: 2017,
        floorAreaSqm: 93,
        flatType: '4-Room',
        distanceKm: 0.85,
        price: 960000,
        dateStr: 'Nov 2023',
        storeyRange: '25 to 27',
        psf: 959
      }
    ],
    upcomingMopUnits: 280,
    description: 'Premier primary school with GEP in Mount Sinai / Holland Grove enclave.'
  },
  {
    id: 'catholic-high-primary',
    name: 'Catholic High School (Primary)',
    address: '9 Bishan St 22, Singapore 579767',
    postalCode: '579767',
    planningArea: 'Bishan',
    phaseCategory: 'Phase 2A',
    distanceToUser: 3.1,
    avgPsf1km: 860,
    psfChangeQoq: 2.8,
    transactions6m: 165,
    avg4RoomPrice: 820000,
    priceTrendYoy: 3.9,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 135,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Bishan (NS17/CC15)', line: 'Interchange', distKm: 0.95 },
      { name: 'Marymount (CC16)', line: 'Circle Line', distKm: 0.8 }
    ],
    coordinates: {
      lat: 1.3547,
      lng: 103.8447,
      mapX: 58,
      mapY: 42
    },
    priceHistory: [
      { month: 'Jan', room3: 480000, room4: 760000, room5: 980000 },
      { month: 'Jun', room3: 505000, room4: 790000, room5: 1020000 },
      { month: 'Dec', room3: 530000, room4: 830000, room5: 1080000 }
    ],
    transactions: [
      {
        id: 'tx-ch-1',
        schoolId: 'catholic-high-primary',
        blockStreet: 'Blk 236 Bishan Street 22',
        builtYear: 1992,
        floorAreaSqm: 104,
        flatType: '4-Room',
        distanceKm: 0.25,
        price: 840000,
        dateStr: 'Nov 2023',
        storeyRange: '07 to 09',
        psf: 751
      }
    ],
    upcomingMopUnits: 410,
    description: 'Premier all-boys SAP school located in Bishan North with strong heritage.'
  },
  {
    id: 'nan-hua-primary',
    name: 'Nan Hua Primary School',
    address: '30 Jln Lempeng, Singapore 128806',
    postalCode: '128806',
    planningArea: 'Clementi',
    phaseCategory: 'Phase 2B',
    distanceToUser: 4.0,
    avgPsf1km: 790,
    psfChangeQoq: 2.1,
    transactions6m: 110,
    avg4RoomPrice: 770000,
    priceTrendYoy: 2.9,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 76,
    mrtStationsNearbyCount: 1,
    mrtNearby: [
      { name: 'Clementi (EW23)', line: 'East West Line', distKm: 0.85 }
    ],
    coordinates: {
      lat: 1.3193,
      lng: 103.7628,
      mapX: 32,
      mapY: 56
    },
    priceHistory: [
      { month: 'Jan', room3: 450000, room4: 720000, room5: 910000 },
      { month: 'Dec', room3: 480000, room4: 780000, room5: 970000 }
    ],
    transactions: [
      {
        id: 'tx-nh-1',
        schoolId: 'nan-hua-primary',
        blockStreet: 'Blk 441A Clementi Ave 3',
        builtYear: 2017,
        floorAreaSqm: 93,
        flatType: '4-Room',
        distanceKm: 0.7,
        price: 830000,
        dateStr: 'Oct 2023',
        storeyRange: '19 to 21',
        psf: 829
      }
    ],
    upcomingMopUnits: 290,
    description: 'Esteemed SAP and GEP school located near Clementi town centre.'
  },
  {
    id: 'pei-hwa-presbyterian',
    name: 'Pei Hwa Presbyterian Primary School',
    address: '7 Pei Wah Ave, Singapore 597610',
    postalCode: '597610',
    planningArea: 'Bukit Timah',
    phaseCategory: 'Phase 2B',
    distanceToUser: 2.1,
    avgPsf1km: 875,
    psfChangeQoq: 2.6,
    transactions6m: 72,
    avg4RoomPrice: 795000,
    priceTrendYoy: 3.1,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 48,
    mrtStationsNearbyCount: 1,
    mrtNearby: [
      { name: 'Beauty World (DT5)', line: 'Downtown Line', distKm: 0.35 }
    ],
    coordinates: {
      lat: 1.3382,
      lng: 103.7761,
      mapX: 36,
      mapY: 48
    },
    priceHistory: [
      { month: 'Jan', room3: 460000, room4: 750000, room5: 930000 },
      { month: 'Dec', room3: 490000, room4: 810000, room5: 990000 }
    ],
    transactions: [
      {
        id: 'tx-ph-1',
        schoolId: 'pei-hwa-presbyterian',
        blockStreet: 'Blk 1 Toh Yi Drive',
        builtYear: 1988,
        floorAreaSqm: 104,
        flatType: '4-Room',
        distanceKm: 0.4,
        price: 810000,
        dateStr: 'Oct 2023',
        storeyRange: '07 to 09',
        psf: 724
      }
    ],
    upcomingMopUnits: 150,
    description: 'Popular SAP school near Beauty World MRT and Bukit Timah Nature Reserve.'
  },
  {
    id: 'nan-chiau-primary',
    name: 'Nan Chiau Primary School',
    address: '50 Anchorvale Link, Singapore 544965',
    postalCode: '544965',
    planningArea: 'Sengkang',
    phaseCategory: 'Phase 2B',
    distanceToUser: 1.2,
    avgPsf1km: 630,
    psfChangeQoq: 3.5,
    transactions6m: 165,
    avg4RoomPrice: 585000,
    priceTrendYoy: 3.8,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 142,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Tongkang (SW7)', line: 'Sengkang LRT', distKm: 0.25 },
      { name: 'Sengkang (NE16/STC)', line: 'North East Line', distKm: 0.85 }
    ],
    coordinates: {
      lat: 1.3923,
      lng: 103.8904,
      mapX: 66,
      mapY: 34
    },
    priceHistory: [
      { month: 'Jan', room3: 410000, room4: 540000, room5: 690000 },
      { month: 'Dec', room3: 440000, room4: 590000, room5: 740000 }
    ],
    transactions: [
      {
        id: 'tx-nc-1',
        schoolId: 'nan-chiau-primary',
        blockStreet: 'Blk 313A Anchorvale Road',
        builtYear: 2017,
        floorAreaSqm: 93,
        flatType: '4-Room',
        distanceKm: 0.3,
        price: 595000,
        dateStr: 'Jan 2025',
        storeyRange: '13 to 15',
        psf: 594
      }
    ],
    upcomingMopUnits: 450,
    description: 'Top highly subscribed primary school in North-East Singapore with exceptional academic performance.'
  },
  {
    id: 'ai-tong-school',
    name: 'Ai Tong School',
    address: '100 Bright Hill Dr, Singapore 579646',
    postalCode: '579646',
    planningArea: 'Bishan',
    phaseCategory: 'Phase 2A',
    distanceToUser: 1.5,
    avgPsf1km: 795,
    psfChangeQoq: 4.1,
    transactions6m: 98,
    avg4RoomPrice: 760000,
    priceTrendYoy: 4.6,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 92,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Bright Hill (TE7/CR13)', line: 'Thomson-East Coast Line', distKm: 0.38 },
      { name: 'Upper Thomson (TE8)', line: 'Thomson-East Coast Line', distKm: 0.95 }
    ],
    coordinates: {
      lat: 1.3606,
      lng: 103.8331,
      mapX: 53,
      mapY: 42
    },
    priceHistory: [
      { month: 'Jan', room3: 450000, room4: 710000, room5: 920000 },
      { month: 'Dec', room3: 480000, room4: 770000, room5: 980000 }
    ],
    transactions: [
      {
        id: 'tx-at-1',
        schoolId: 'ai-tong-school',
        blockStreet: 'Blk 408 Sin Ming Ave',
        builtYear: 1990,
        floorAreaSqm: 104,
        flatType: '4-Room',
        distanceKm: 0.45,
        price: 755000,
        dateStr: 'Jan 2025',
        storeyRange: '10 to 12',
        psf: 674
      }
    ],
    upcomingMopUnits: 220,
    description: 'Premier Hokkien Huay Kuan primary institution located in Sin Ming/Bishan.'
  },
  {
    id: 'chongfu-school',
    name: 'Chongfu School',
    address: '170 Yishun Ave 6, Singapore 768959',
    postalCode: '768959',
    planningArea: 'Yishun',
    phaseCategory: 'Phase 2B',
    distanceToUser: 3.1,
    avgPsf1km: 565,
    psfChangeQoq: 2.4,
    transactions6m: 140,
    avg4RoomPrice: 525000,
    priceTrendYoy: 2.7,
    trendType: 'Moderate',
    hdbBlocks1kmCount: 155,
    mrtStationsNearbyCount: 1,
    mrtNearby: [
      { name: 'Yishun (NS13)', line: 'North South Line', distKm: 1.1 }
    ],
    coordinates: {
      lat: 1.4385,
      lng: 103.8502,
      mapX: 57,
      mapY: 17
    },
    priceHistory: [
      { month: 'Jan', room3: 370000, room4: 490000, room5: 640000 },
      { month: 'Dec', room3: 395000, room4: 530000, room5: 680000 }
    ],
    transactions: [
      {
        id: 'tx-cf-1',
        schoolId: 'chongfu-school',
        blockStreet: 'Blk 289 Yishun Ave 6',
        builtYear: 2018,
        floorAreaSqm: 92,
        flatType: '4-Room',
        distanceKm: 0.25,
        price: 540000,
        dateStr: 'Jan 2025',
        storeyRange: '10 to 12',
        psf: 545
      }
    ],
    upcomingMopUnits: 380,
    description: 'High-demand Singapore Hokkien Huay Kuan school serving Yishun North.'
  },
  {
    id: 'radin-mas-primary',
    name: 'Radin Mas Primary School',
    address: '1 Bukit Purmei Ave, Singapore 099840',
    postalCode: '099840',
    planningArea: 'Bukit Merah',
    phaseCategory: 'Phase 2C',
    distanceToUser: 1.8,
    avgPsf1km: 840,
    psfChangeQoq: 4.2,
    transactions6m: 85,
    avg4RoomPrice: 810000,
    priceTrendYoy: 4.4,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 78,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'HarbourFront (NE1/CC29)', line: 'Interchange', distKm: 0.95 },
      { name: 'Telok Blangah (CC28)', line: 'Circle Line', distKm: 1.1 }
    ],
    coordinates: {
      lat: 1.2758,
      lng: 103.8242,
      mapX: 51,
      mapY: 76
    },
    priceHistory: [
      { month: 'Jan', room3: 480000, room4: 760000, room5: 980000 },
      { month: 'Dec', room3: 520000, room4: 820000, room5: 1050000 }
    ],
    transactions: [
      {
        id: 'tx-rm-1',
        schoolId: 'radin-mas-primary',
        blockStreet: 'Blk 109 Bukit Purmei Road',
        builtYear: 1985,
        floorAreaSqm: 104,
        flatType: '4-Room',
        distanceKm: 0.35,
        price: 790000,
        dateStr: 'Jan 2025',
        storeyRange: '10 to 12',
        psf: 705
      }
    ],
    upcomingMopUnits: 190,
    description: 'Historic and popular institution located in Bukit Merah / Telok Blangah.'
  },
  {
    id: 'punggol-green-primary',
    name: 'Punggol Green Primary School',
    address: '98 Punggol Walk, Singapore 828772',
    postalCode: '828772',
    planningArea: 'Punggol',
    phaseCategory: 'Phase 2C',
    distanceToUser: 2.8,
    avgPsf1km: 655,
    psfChangeQoq: 3.8,
    transactions6m: 180,
    avg4RoomPrice: 605000,
    priceTrendYoy: 4.1,
    trendType: 'Increasing',
    hdbBlocks1kmCount: 160,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Punggol (NE17/PTC/CP4)', line: 'Interchange', distKm: 0.45 },
      { name: 'Soo Teck (PW7)', line: 'Punggol LRT', distKm: 0.22 }
    ],
    coordinates: {
      lat: 1.4014,
      lng: 103.9023,
      mapX: 69,
      mapY: 30
    },
    priceHistory: [
      { month: 'Jan', room3: 420000, room4: 560000, room5: 720000 },
      { month: 'Dec', room3: 460000, room4: 615000, room5: 780000 }
    ],
    transactions: [
      {
        id: 'tx-pg-1',
        schoolId: 'punggol-green-primary',
        blockStreet: 'Blk 269B Punggol Field',
        builtYear: 2017,
        floorAreaSqm: 93,
        flatType: '4-Room',
        distanceKm: 0.35,
        price: 615000,
        dateStr: 'Jan 2025',
        storeyRange: '13 to 15',
        psf: 614
      }
    ],
    upcomingMopUnits: 620,
    description: 'Modern waterfront town primary school within walking distance to Punggol Town Hub and Waterway Point.'
  },
  {
    id: 'st-hildas-primary',
    name: "St. Hilda's Primary School",
    address: '2 Tampines Ave 3, Singapore 529706',
    postalCode: '529706',
    planningArea: 'Tampines',
    phaseCategory: 'Phase 2B',
    distanceToUser: 3.5,
    avgPsf1km: 645,
    psfChangeQoq: 2.9,
    transactions6m: 135,
    avg4RoomPrice: 595000,
    priceTrendYoy: 3.2,
    trendType: 'Moderate',
    hdbBlocks1kmCount: 130,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'Tampines West (DT31)', line: 'Downtown Line', distKm: 0.45 },
      { name: 'Tampines (EW2/DT32)', line: 'Interchange', distKm: 0.95 }
    ],
    coordinates: {
      lat: 1.3496,
      lng: 103.9388,
      mapX: 78,
      mapY: 46
    },
    priceHistory: [
      { month: 'Jan', room3: 410000, room4: 550000, room5: 710000 },
      { month: 'Dec', room3: 445000, room4: 605000, room5: 760000 }
    ],
    transactions: [
      {
        id: 'tx-sh-1',
        schoolId: 'st-hildas-primary',
        blockStreet: 'Blk 838 Tampines St 82',
        builtYear: 1986,
        floorAreaSqm: 104,
        flatType: '4-Room',
        distanceKm: 0.4,
        price: 610000,
        dateStr: 'Jan 2025',
        storeyRange: '07 to 09',
        psf: 545
      }
    ],
    upcomingMopUnits: 310,
    description: 'Esteemed Anglican mission school and top-choice primary school in Tampines.'
  },
  {
    id: 'chij-st-nicholas-girls',
    name: "CHIJ St. Nicholas Girls' School (Primary)",
    address: '501 Ang Mo Kio St 13, Singapore 569405',
    postalCode: '569405',
    planningArea: 'Ang Mo Kio',
    phaseCategory: 'Phase 2A',
    distanceToUser: 2.0,
    avgPsf1km: 660,
    psfChangeQoq: 3.1,
    transactions6m: 105,
    avg4RoomPrice: 620000,
    priceTrendYoy: 3.5,
    trendType: 'Moderate',
    hdbBlocks1kmCount: 115,
    mrtStationsNearbyCount: 1,
    mrtNearby: [
      { name: 'Mayflower (TE6)', line: 'Thomson-East Coast Line', distKm: 0.35 },
      { name: 'Yio Chu Kang (NS15)', line: 'North South Line', distKm: 1.3 }
    ],
    coordinates: {
      lat: 1.3741,
      lng: 103.8347,
      mapX: 53,
      mapY: 38
    },
    priceHistory: [
      { month: 'Jan', room3: 420000, room4: 580000, room5: 750000 },
      { month: 'Dec', room3: 450000, room4: 630000, room5: 810000 }
    ],
    transactions: [
      {
        id: 'tx-sng-1',
        schoolId: 'chij-st-nicholas-girls',
        blockStreet: 'Blk 118 Ang Mo Kio Ave 4',
        builtYear: 1980,
        floorAreaSqm: 93,
        flatType: '4-Room',
        distanceKm: 0.3,
        price: 630000,
        dateStr: 'Jan 2025',
        storeyRange: '08 to 10',
        psf: 629
      }
    ],
    upcomingMopUnits: 240,
    description: 'Premier SAP Catholic girls school with strong academic heritage and affiliated secondary section.'
  },
  {
    id: 'south-view-primary',
    name: 'South View Primary School',
    address: '10 Choa Chu Kang Ave 2, Singapore 689904',
    postalCode: '689904',
    planningArea: 'Choa Chu Kang',
    phaseCategory: 'Phase 2C',
    distanceToUser: 4.2,
    avgPsf1km: 550,
    psfChangeQoq: 2.2,
    transactions6m: 125,
    avg4RoomPrice: 510000,
    priceTrendYoy: 2.5,
    trendType: 'Moderate',
    hdbBlocks1kmCount: 145,
    mrtStationsNearbyCount: 2,
    mrtNearby: [
      { name: 'South View (BP2)', line: 'Bukit Panjang LRT', distKm: 0.15 },
      { name: 'Choa Chu Kang (NS4/JS1/BP1)', line: 'Interchange', distKm: 0.8 }
    ],
    coordinates: {
      lat: 1.3815,
      lng: 103.7468,
      mapX: 28,
      mapY: 36
    },
    priceHistory: [
      { month: 'Jan', room3: 360000, room4: 480000, room5: 620000 },
      { month: 'Dec', room3: 385000, room4: 515000, room5: 660000 }
    ],
    transactions: [
      {
        id: 'tx-sv-1',
        schoolId: 'south-view-primary',
        blockStreet: 'Blk 211 Choa Chu Kang Central',
        builtYear: 1993,
        floorAreaSqm: 103,
        flatType: '4-Room',
        distanceKm: 0.35,
        price: 520000,
        dateStr: 'Jan 2025',
        storeyRange: '07 to 09',
        psf: 469
      }
    ],
    upcomingMopUnits: 280,
    description: 'Top-tier primary school in Western Singapore with high subscription rate in Phase 2C.'
  }
];

export const MOP_ALERTS_DATA: MopAlertItem[] = [
  {
    id: 'mop-1',
    schoolId: 'nanyang-primary',
    schoolName: 'Nanyang Primary School',
    estateName: 'Farrer Vista BTO Phase 2',
    blockAddress: 'Blk 4A - 4D Farrer Road',
    estMopDate: 'Q2 2025',
    unitsCount: 420,
    flatTypes: ['3-Room', '4-Room', '5-Room'],
    distanceKm: 0.55,
    status: 'Approaching MOP (Under 6 Mths)'
  },
  {
    id: 'mop-2',
    schoolId: 'nanyang-primary',
    schoolName: 'Nanyang Primary School',
    estateName: "Queen's Park Sanctuary",
    blockAddress: "Blk 8 & 10 Queen's Road",
    estMopDate: 'Q4 2025',
    unitsCount: 280,
    flatTypes: ['4-Room', '5-Room'],
    distanceKm: 0.4,
    status: 'MOP in 2025'
  },
  {
    id: 'mop-3',
    schoolId: 'tao-nan-school',
    schoolName: 'Tao Nan School',
    estateName: 'Marine Breeze Haven',
    blockAddress: 'Blk 60 - 64 Marine Drive',
    estMopDate: 'Q1 2025',
    unitsCount: 310,
    flatTypes: ['3-Room', '4-Room'],
    distanceKm: 0.65,
    status: 'Approaching MOP (Under 6 Mths)'
  },
  {
    id: 'mop-4',
    schoolId: 'rosyth-school',
    schoolName: 'Rosyth School',
    estateName: 'Serangoon North Grove',
    blockAddress: 'Blk 155A - 155D Serangoon North',
    estMopDate: 'Q3 2025',
    unitsCount: 560,
    flatTypes: ['3-Room', '4-Room', '5-Room'],
    distanceKm: 0.35,
    status: 'MOP in 2025'
  },
  {
    id: 'mop-5',
    schoolId: 'henry-park-primary',
    schoolName: 'Henry Park Primary School',
    estateName: 'Ghim Moh Edge',
    blockAddress: 'Blk 11 - 15 Ghim Moh Link',
    estMopDate: 'Q1 2024',
    unitsCount: 390,
    flatTypes: ['4-Room', '5-Room'],
    distanceKm: 0.8,
    status: 'Freshly MOP-ed'
  },
  {
    id: 'mop-6',
    schoolId: 'catholic-high-primary',
    schoolName: 'Catholic High School (Primary)',
    estateName: 'Bishan Ridges',
    blockAddress: 'Blk 230 - 238 Bishan St 22',
    estMopDate: 'Q2 2026',
    unitsCount: 480,
    flatTypes: ['4-Room', '5-Room'],
    distanceKm: 0.3,
    status: 'MOP in 2026'
  }
];
