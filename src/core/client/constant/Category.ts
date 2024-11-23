export enum Category {
  RetraitRappelSpecifique = 'RetraitRappelSpecifique',
  Coronavirus = 'Coronavirus',
  CafeRestaurant = 'CafeRestaurant',
  AchatMagasinLegacy = 'AchatMagasinLegacy',
  AchatMagasinInternet = 'AchatMagasinInternet',
  AchatMagasin = 'AchatMagasin',
  AchatInternet = 'AchatInternet',
  ServicesAuxParticuliers = 'ServicesAuxParticuliers',
  TelEauGazElec = 'TelEauGazElec',
  EauGazElectricite = 'EauGazElectricite',
  TelephonieFaiMedias = 'TelephonieFaiMedias',
  BanqueAssuranceMutuelle = 'BanqueAssuranceMutuelle',
  IntoxicationAlimentaire = 'IntoxicationAlimentaire',
  ProduitsObjets = 'ProduitsObjets',
  Internet = 'Internet',
  TravauxRenovations = 'TravauxRenovations',
  VoyageLoisirs = 'VoyageLoisirs',
  Immobilier = 'Immobilier',
  Sante = 'Sante',
  VoitureVehicule = 'VoitureVehicule',
  Animaux = 'Animaux',
  DemarchesAdministratives = 'DemarchesAdministratives',
  VoitureVehiculeVelo = 'VoitureVehiculeVelo',
  DemarchageAbusif = 'DemarchageAbusif',
}

export interface CategoriesByStatus {
  active: Category[]
  inactive: Category[]
  legacy: Category[]
  closed: Category[]
}
