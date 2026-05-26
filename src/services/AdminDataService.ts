import { Scholarship, UKM, Achievement, StudentNews, AlumniRecord } from '../types';

export class AdminDataService {
  private scholarships: Scholarship[];
  private ukms: UKM[];
  private achievements: Achievement[];
  private news: StudentNews[];
  private alumni: AlumniRecord[];

  constructor(
    initialScholarships: Scholarship[],
    initialUkms: UKM[],
    initialAchievements: Achievement[],
    initialNews: StudentNews[],
    initialAlumni: AlumniRecord[]
  ) {
    this.scholarships = initialScholarships;
    this.ukms = initialUkms;
    this.achievements = initialAchievements;
    this.news = initialNews;
    this.alumni = initialAlumni;
  }

  // --- Beasiswa / Scholarships CRUD ---
  public getScholarships(): Scholarship[] {
    return [...this.scholarships];
  }

  public addScholarship(item: Scholarship): Scholarship[] {
    this.scholarships = [item, ...this.scholarships];
    return this.getScholarships();
  }

  public updateScholarship(id: string, updatedFields: Partial<Scholarship>): Scholarship[] {
    this.scholarships = this.scholarships.map(s => 
      s.id === id ? { ...s, ...updatedFields } as Scholarship : s
    );
    return this.getScholarships();
  }

  public deleteScholarship(id: string): Scholarship[] {
    this.scholarships = this.scholarships.filter(s => s.id !== id);
    return this.getScholarships();
  }

  // --- UKM Directory CRUD ---
  public getUkms(): UKM[] {
    return [...this.ukms];
  }

  public addUkm(item: UKM): UKM[] {
    this.ukms = [item, ...this.ukms];
    return this.getUkms();
  }

  public updateUkm(id: string, updatedFields: Partial<UKM>): UKM[] {
    this.ukms = this.ukms.map(u => 
      u.id === id ? { ...u, ...updatedFields } as UKM : u
    );
    return this.getUkms();
  }

  public deleteUkm(id: string): UKM[] {
    this.ukms = this.ukms.filter(u => u.id !== id);
    return this.getUkms();
  }

  // --- Achievements CRUD ---
  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public addAchievement(item: Achievement): Achievement[] {
    this.achievements = [item, ...this.achievements];
    return this.getAchievements();
  }

  public updateAchievement(id: string, updatedFields: Partial<Achievement>): Achievement[] {
    this.achievements = this.achievements.map(a => 
      a.id === id ? { ...a, ...updatedFields } as Achievement : a
    );
    return this.getAchievements();
  }

  public deleteAchievement(id: string): Achievement[] {
    this.achievements = this.achievements.filter(a => a.id !== id);
    return this.getAchievements();
  }

  // --- News Editor CRUD ---
  public getNews(): StudentNews[] {
    return [...this.news];
  }

  public addNews(item: StudentNews): StudentNews[] {
    this.news = [item, ...this.news];
    return this.getNews();
  }

  public updateNews(id: string, updatedFields: Partial<StudentNews>): StudentNews[] {
    this.news = this.news.map(n => 
      n.id === id ? { ...n, ...updatedFields } as StudentNews : n
    );
    return this.getNews();
  }

  public deleteNews(id: string): StudentNews[] {
    this.news = this.news.filter(n => n.id !== id);
    return this.getNews();
  }

  // --- Alumni Records CRUD ---
  public getAlumni(): AlumniRecord[] {
    return [...this.alumni];
  }

  public addAlumni(item: AlumniRecord): AlumniRecord[] {
    this.alumni = [item, ...this.alumni];
    return this.getAlumni();
  }

  public updateAlumni(id: string, updatedFields: Partial<AlumniRecord>): AlumniRecord[] {
    this.alumni = this.alumni.map(a => 
      a.id === id ? { ...a, ...updatedFields } as AlumniRecord : a
    );
    return this.getAlumni();
  }

  public deleteAlumni(id: string): AlumniRecord[] {
    this.alumni = this.alumni.filter(a => a.id !== id);
    return this.getAlumni();
  }
}
