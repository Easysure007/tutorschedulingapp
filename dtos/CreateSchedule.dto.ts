export interface CreateScheduleDTO {
    groupId: string;
    instructorId: string;
    availabilityId?: string; //Could be used to query for the instructor's availablity
    schedule: Date;
    duration: number;
}