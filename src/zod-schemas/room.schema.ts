import { z } from 'zod';
import { ActivationStatus } from '../models/enums/activation-status.js';
import { RoomOccupancyStatus } from '../models/enums/room-occupancy-status.js';
import { querySchema } from './query.schema.js';
export const createRoomSchema = z
    .object({
        name: z.string().trim().nonempty().max(256),
        description: z.string().trim().nonempty().max(4096).optional(),
    })
    .strict();

export const updateRoomSchema = z
    .object({
        name: z.string().trim().nonempty().max(256).optional(),
        description: z.string().trim().nonempty().max(4096).optional(),
        assignedUserUuid: z.uuid(),
        status: z.enum(ActivationStatus).optional(),
        occupancyStatus: z.enum(RoomOccupancyStatus).optional(),
    })
    .strict();

export const roomFilterSchema = z
    .object({
        status: z.enum(ActivationStatus).optional(),
        occupancyStatus: z.enum(RoomOccupancyStatus).optional(),
    })
    .strict();
