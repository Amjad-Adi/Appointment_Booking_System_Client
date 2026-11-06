import type { z } from 'zod';
import { ActivationStatus } from './enums/activation-status';
import { RoomOccupancyStatus } from './enums/room-occupancy-status';
import { createRoomSchema, queryRoomSchema, updateRoomSchema } from '../zod-schemas/room.schema';
import type { DataResponses } from './Query/query.model';

export interface Room {
    uuid: string;
    name: string;
    description: string;
    profilePicturePath: string;
    createdAtUTC: string;
    updatedAtUTC: string;
    status: ActivationStatus;
    occupancyStatus: RoomOccupancyStatus;
}

export interface RoomResponse extends Room, DataResponses {
    organizationUuid: string;
    organizationName: string;
    userUuid: string;
    firstName: string;
    lastName: string;
}

export type CreateRoom = z.infer<typeof createRoomSchema> & {
    organizationUuid: string;
    userUuid: string;
};

export type UpdateRoom = z.infer<typeof updateRoomSchema> & {
    uuid: string;
    organizationUuid: string;
    userUuid: string;
};

export type QueryRoom = z.infer<typeof queryRoomSchema> & {
    offset?: number;
};
