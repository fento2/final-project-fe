export type Skill = {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
};

export type UserSkill = {
    id: number;
    userId: number;
    skillId: number;
    skill?: Skill;
};