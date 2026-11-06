import { RoomOccupancyStatus } from '../enums/room-occupancy-status.ts';

export const roomOccupancyStatusRecord: Record<RoomOccupancyStatus, string> = {
    [RoomOccupancyStatus.OCCUPIED]: 'Occupied',
    [RoomOccupancyStatus.AVAILABLE]: 'Available',
};
